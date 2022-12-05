import express, { request, response } from "express";
import postgresClient from "../config/database.js";

const router = express.Router();

//create user
router.post("/", async (request, response) => {
  try {
    const text =
      "INSERT INTO tbl_person_details (person_id,name,surname,degree,phone,room_no,address_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";

    const values = [
      request.body.person_id,
      request.body.name,
      request.body.surname,
      request.body.degree,
      request.body.phone,
      request.body.room_no,
      request.body.address_id,
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
      "SELECT * FROM tbl_authorization WHERE email = $1 AND password = $2";

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
      "UPDATE tbl_person_details SET email =$1 , name = $2  WHERE id = $3 RETURNING * ";
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

// delete users
// router.delete("/:userId", async (request, response) => {
//   try {
//     const { userId } = request.params;
//     const text = "DELETE FROM users WHERE id = $1 RETURNING * ";
//     const values = [userId];

//     const { rows } = await postgresClient.query(text, values);

//     if (!rows.length) {
//       return response.status(404).json({ message: "User not found" });
//     }

//     return response
//       .status(200)
//       .json({ message: "Delete user", deleteUser: rows[0] });
//   } catch (error) {
//     console.log("error = ", error);
//     return response.status(400).json({ message: error.message });
//   }
// });

//Get users all users:

router.get("/", async (request, response) => {
  try {
    const text = "SELECT  * FROM tbl_person_details ORDER BY person_id ASC  ";
    const { rows } = await postgresClient.query(text);
    return response.status(200).json(rows);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

//Get userID by email address
router.get("/email/:email", async (request, response) => {
  try {
    const { email } = request.params;
    const text = "SELECT person_id FROM tbl_authorization WHERE email = $1";
    const values = [ email.slice(1)];
    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) { 
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json(rows[0]);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

// get person by id
router.get("/personID/:personId", async (request, response) => {
  try {
    const { personId } = request.params;
    const text = "SELECT * FROM tbl_person_details WHERE person_id = $1";
    const values = [parseInt(personId.slice(1))];
    const { rows } = await postgresClient.query(text, values);

    if (!rows.length) {
      return response.status(404).json({ message: "User not found"});
    }
    return response.status(200).json(rows[0]);
  } catch (error) {
    console.log("error = ", error);
    return response.status(400).json({ message: error.message });
  }
});

export default router;
