import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
const app = express();
import connectToMongo from "./config/db.js";
import userRouter from "./routes/userRouter.js";




app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);


console.log(process.env.PORT);


const startServer = async () => {
    await connectToMongo();
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
};

startServer()