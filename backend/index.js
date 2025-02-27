import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

const DB = process.env.MONGO_URL;
app.use(express.json());
app.use(cors());

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
  });

app.use("/api/users", userRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });