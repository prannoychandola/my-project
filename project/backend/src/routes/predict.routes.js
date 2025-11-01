import express from "express";
import axios from "axios";
import Prediction from "../models/Prediction.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { data } = await axios.post(
      `${process.env.FLASK_URL}/api/predict`,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    // Save prediction to Mongo
    await Prediction.create({
      input: req.body,
      result: data,
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Flask service error:", err?.response?.data || err.message);
    res.status(400).json({ error: "Flask service error" });
  }
});

router.get("/logs", async (_req, res) => {
  const logs = await Prediction.find().sort({ createdAt: -1 }).limit(50);
  res.json(logs);
});

export default router;
