import express from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create note  ;
//tbl_notes tablosuna veri eklemek için kullanılır
router.post("/note", async (request, response) => {
  try {
    const text =
      "INSERT INTO tbl_notes (title,description,person_id) VALUES ($1,$2,$3) RETURNING *";
    const values = [
      request.body.title,
      request.body.description,
      request.body.person_id,
    ];

    const result = await postgresClient.query(text, values);
    const { rows } = result;
    return response.status(201).json({ message: rows[0] });
  } catch (error) {
    console.log("found error  : ", error);
    return response.status(400).json({ message: error.message });
  }
});

//get all notes ;
router.get("/", async (request, response) => {
  try {
    const text = "SELECT * FROM tbl_notes ORDER BY note_id ASC";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//get note by person_id
router.get("/person-notes/:personId", async (request, response) => {
  try {
    const { personId } = request.params;
    const text = "SELECT * FROM tbl_notes WHERE person_id = $1";
    const values = [parseInt(personId.slice(1))];
    const { rows } = await postgresClient.query(text, values);

    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Update notes
router.put("/update-note/:noteId", async (request, response) => {
  try {
    const { noteId } = request.params;
    const text =
      "UPDATE tbl_notes SET title = $1 , description = $2  WHERE note_id = $3 RETURNING * ";
    const values = [
      request.body.title,
      request.body.description,
      parseInt(noteId.slice(1)),
    ];

    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "Note not found" });
    }
    return response.status(200).json({ message: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//delete note
router.delete("/delete-note/:noteId", async (request, response) => {
  try {
    const { noteId } = request.params;
    const text = "DELETE FROM tbl_notes WHERE note_id = $1 RETURNING * ";
    const values = [parseInt(noteId.slice(1))];
    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "Not not found" });
    }
    return response
      .status(200)
      .json({ message: "Delete note", deleteUser: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
