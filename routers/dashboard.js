import express from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//tbl_person_details tablosu ile tbl_works tablosunu birleştirerek verileri çekmek için kullanılır.
router.get("/", async (request, response) => {
  try {
    const text =
      "Select work_name,work_id,details,work_creator,work_owner,estimated_time, work_status,clasroom_id,create_time,finish_time,priority,person_id, name ,surname From tbl_works INNER join tbl_person_details ON tbl_works.work_creator = tbl_person_details.person_id ORDER BY work_id ASC";
    const { rows } = await postgresClient.query(text);
    const obj = {};
    const dataBegin = [];
    const dataProgressing = [];
    const dataControl = [];
    const dataOver = [];

    //get data from database convert to work_status
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].work_status == 0) {
        dataBegin.push(rows[i]);
      } else if (rows[i].work_status == 1) {
        dataProgressing.push(rows[i]);
      } else if (rows[i].work_status == 2) {
        dataControl.push(rows[i]);
      } else if (rows[i].work_status == 3) {
        dataOver.push(rows[i]);
      }
    }

    const data = [
      {
        title: "Başlangıç",
        items: dataBegin,
      },
      {
        title: "Devam Ediyor",
        items: dataProgressing,
      },
      {
        title: "Kontrol",
        items: dataControl,
      },
      {
        title: "Bitti",
        items: dataOver,
      },
    ];

    obj.data = data;

    return response.status(200).json(obj);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Update notes
//tbl_works tablosundaki verileri güncellemek için kullanılır.
router.put("/update/:workId", async (request, response) => {
  try {
    const { workId } = request.params;
    const text =
      "UPDATE tbl_works SET work_name = $1 , details = $2 ,work_creator = $3 ,work_owner = $4, estimated_time = $5 ,work_status = $6,clasroom_id = $7 , create_time = $8,finish_time = $9,priority = $10 WHERE work_id = $11 RETURNING * ";

    const values = [
      request.body.work_name,
      request.body.details,
      request.body.work_creator,
      request.body.work_owner,
      request.body.estimated_time,
      request.body.work_status,
      request.body.clasroom_id,
      request.body.create_time,
      request.body.finish_time,
      request.body.priority,
      workId,
    ];

    const { rows } = await postgresClient.query(text, values);
    if (!rows.length) {
      return response.status(404).json({ message: "Workss not found" });
    }
    return response.status(200).json({ message: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Update work work_owner
//tbl_works tablosundaki work_owner ve work_status verilerini güncellemek için kullanılır.
router.put("/setWorkOwner", async (request, response) => {
  try {
    const text =
      "UPDATE tbl_works SET work_owner = $1, work_status = $2 WHERE work_id = $3 RETURNING * ";
    const values = [
      request.body.work_owner,
      request.body.work_status,
      request.body.work_id,
    ];

    const { rows } = await postgresClient.query(text, values);
    if (!rows.length) {
      return response.status(404).json({ message: "Works not found" });
    }
    return response.status(200).json({ message: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Update work Finish Time
//tbl_works tablosundaki finish_time verilerini güncellemek için kullanılır.
router.put("/setWorkFinishTime", async (request, response) => {
  try {
    const text =
      "UPDATE tbl_works SET finish_time = $1 WHERE work_id = $2 RETURNING * ";
    const values = [request.body.finish_time, request.body.work_id];

    const { rows } = await postgresClient.query(text, values);
    if (!rows.length) {
      return response.status(404).json({ message: "Works not found" });
    }
    return response.status(200).json({ message: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//delete works
//tbl_works tablosundaki verileri silmek için kullanılır.
router.delete("/delete/:workId", async (request, response) => {
  try {
    const { workId } = request.params;
    const text = "DELETE FROM tbl_works WHERE work_id = $1 RETURNING * ";
    //const values = [workId];
    const values = [parseInt(workId.slice(1))];
    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "User not found" });
    }
    return response
      .status(200)
      .json({ message: "Delete work", deleteUser: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//create work
//tbl_works tablosuna veri eklemek için kullanılır.
router.post("/work", async (request, response) => {
  try {
    const text =
      "INSERT INTO tbl_works (work_name,details,work_creator,estimated_time, clasroom_id, create_time, priority) VALUES ($1,$2,$3, $4, $5, $6, $7) RETURNING *";
    const values = [
      request.body.work_name,
      request.body.details,
      request.body.work_creator,
      request.body.estimated_time,
      request.body.clasroom_id,
      request.body.create_time,
      request.body.priority,
    ];

    const result = await postgresClient.query(text, values);
    const { rows } = result;
    return response.status(201).json({ message: rows[0] });
  } catch (error) {
    console.log("found error  : ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
