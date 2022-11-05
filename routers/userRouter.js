import express, { request, response } from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create user
router.post("/", async (request, response) => {
  try {
    const text =
      "INSERT INTO users (email,password,fullname) VALUES ($1, crypt($2,gen_salt('bf')),$3) RETURNING *";
    const values = [
      request.body.email,
      request.body.password,
      request.body.fullname,
    ];

    const result = await postgresClient.query(text, values);
    const { rows } = result;
    return response.status(201).json({ message: rows[0] });
  } catch (error) {
    console.log("found error  : ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Auth
router.post("/login", async (request, response) => {
  try {
    const text =
      "SELECT * FROM users WHERE email = $1 AND password = crypt($2,password)";
    const values = [request.body.email, request.body.password];
    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "user not found" });
    }

    return response.status(200).json({ message: "authentication succesfull." });
  } catch (error) {
    console.log("ERROR = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Update Users
router.put("/update/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const text =
      "UPDATE users SET email =$1 , fullname = $2  WHERE id = $3 RETURNING * ";
    const values = [request.body.email, request.body.fullname, userId];

    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json({ message: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//delete users
router.delete("/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const text = "DELETE FROM users WHERE id = $1 RETURNING * ";
    const values = [userId];

    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "User not found" });
    }

    return response
      .status(200)
      .json({ message: "Delete user", deleteUser: rows[0] });
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Get users :

router.get("/", async (request, response) => {
  try {
    const text = "SELECT  * FROM users ORDER BY id ASC  ";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
