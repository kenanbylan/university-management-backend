import express, { request, response } from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create address ;
//tbl_workdate tablosuna veri gün , başlangıç ve bitiş saatlerini eklemek için kullanılır
router.post("/workingDay", async (request, response) => {
  try {
    const text =
      "INSERT INTO tbl_workdate (day,start_time,end_time) VALUES ($1,$2,$3) RETURNING *";

    const values = [
      request.body.day,
      request.body.startTime,
      request.body.endTime,
    ];

    const result = await postgresClient.query(text, values);
    const { rows } = result;
    return response.status(201).json({ message: rows[0] });
  } catch (error) {
    console.log("found error  : ", error);
    return response.status(400).json({ message: error.message });
  }
});

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

//3 farklı tablodan inner join kullanarak verileri personle günleri kısmına aktarma
//tbl_person_details, tbl_person_workday, tbl_workdate

router.get("/", async (request, response) => {
  try {
    const text = `Select tbl_person_details.person_id, name, surname, degree, room_no, day, start_time, end_time 
    from tbl_person_details 
    inner join tbl_person_workday
    on 
    tbl_person_details.person_id = tbl_person_workday.person_id
    inner join tbl_workdate 
    on 
    tbl_person_workday.date_id = tbl_workdate.date_id`;
    const { rows } = await postgresClient.query(text);

    const result = groupByKey(rows, "person_id");

    const mapped = Object.entries(result).map(([key, value]) => ({
      key,
      value,
    }));

    return response.status(200).json(mapped);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
