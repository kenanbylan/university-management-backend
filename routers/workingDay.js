import express, { request, response } from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create address ;
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

router.get("/", async (request, response) => {
  try {
    const text = "SELECT * FROM tbl_workdate ORDER BY person_id ASC";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
