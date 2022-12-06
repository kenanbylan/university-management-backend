import express from "express";
import postgresClient from "./config/database.js";
import person_info from "./routers/person_info.js";
import address_info from "./routers/address_info.js";
import workingDay from "./routers/workingDay.js";
import note_info from "./routers/note_info.js";
import classroom from "./routers/classroom.js";
import contacts from "./routers/contacts.js";
import cors from "cors";
const app = express();

//middleware for parsing json

//cors error problem solved
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
app.use(express.json());

app.use("/person_info", person_info);
app.use("/address_info", address_info);
app.use("/workingDay", workingDay);
app.use("/note_info", note_info);
app.use("/classroom", classroom);
app.use("/contacts", contacts);
//app.use("/users", userRouter);

// .env dosyasında port numarasını belirledik.
//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  postgresClient.connect((err) => {
    if (err) {
      console.log("connection error  ", err);
    } else {
      console.log("database connection successfull.");
    }
  });
});
