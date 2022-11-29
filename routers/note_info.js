import express from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create note  ;
router.post("/note_info", async (request, response) => {
  try {
    const text =
      "INSERT INTO noteInfo (noteTitle,noteDesc,personId) VALUES ($1,$2,$3) RETURNING *";

    const values = [
      request.body.noteTitle,
      request.body.noteDesc,
      request.body.personId,
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
    const text = "SELECT * FROM noteInfo ORDER BY noteId ASC";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
