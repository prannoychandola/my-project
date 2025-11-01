import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import predictRoutes from "./routes/predict.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/predict", predictRoutes);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Node backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

start();
