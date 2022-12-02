import express from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create classroom ;

router.post("/classroom", async (request, response) => {
  try {
    const text =
      "INSERT INTO tbl_classroom (classroom_id,class_code,capacity) VALUES ($1,$2,$3) RETURNING *";

    const values = [request.body.class_name, request.body.class_amount, request.body.class_capacity];

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
    const text = "SELECT * FROM tbl_classroom ORDER BY classroom_id ASC";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
