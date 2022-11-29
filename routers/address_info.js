import express, { request, response } from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create address ;
router.post("/address", async (request, response) => {
  try {
    const text =
      "INSERT INTO address_info (bina_no,mahalle,ilce,il) VALUES ($1,$2,$3,$4) RETURNING *";

    const values = [
      request.body.bina_no,
      request.body.mahalle,
      request.body.ilce,
      request.body.il,
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
    const text = "SELECT * FROM address_info ORDER BY address_id ASC";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
