import express from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//get  all workss ;
router.get("/", async (request, response) => {
  try {
    const text = "SELECT * FROM tbl_works  ORDER BY work_id ASC";
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

//Update note work_owner
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

//delete works
router.delete("/delete/:workId", async (request, response) => {
  try {
    const { workId } = request.params;
    const text = "DELETE FROM tbl_works WHERE work_id = $1 RETURNING * ";
    const values = [workId];
    //const values = [parseInt(workId.slice(1))];
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

export default router;
