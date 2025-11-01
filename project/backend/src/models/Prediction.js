import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema(
  {
    input: { type: Object, required: true },
    result: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", PredictionSchema);
