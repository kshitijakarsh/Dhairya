import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import userRouter from "./routes/userRouter.js"
import gymRouter from "./routes/gymRouter.js"
import goerRoutes from "./routes/goerRoutes.js"
import membershipRoutes from "./routes/membershipRouter.js";
import ownerRoutes from "./routes/ownerRoutes.js"
import "./jobs/cronJobs.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users', userRouter);
app.use('/api/gyms', gymRouter);
app.use("/api/memberships", membershipRoutes);
app.use("/api/goer", goerRoutes)
app.use("/api/owner", ownerRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});