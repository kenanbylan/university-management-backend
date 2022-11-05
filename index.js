import express from "express";
import postgresClient from "./config/database.js";
import userRouter from "./routers/userRouter.js";

const app = express();
app.use(express.json());
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;

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
