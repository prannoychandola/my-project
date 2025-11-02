import os
import joblib
import numpy as np
import pandas as pd
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# ------------------ LOGGER SETUP ------------------
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("StressSense-ML")

# ------------------ LOAD ARTIFACTS ------------------
ROOT = os.path.dirname(__file__)
ARTIFACT_DIR = os.path.join(ROOT, "artifacts")
BUNDLE_PATH = os.path.join(ARTIFACT_DIR, "model_bundle.pkl")

logger.info("🚀 Initializing StressSense AI Model Service...")

if not os.path.exists(BUNDLE_PATH):
    logger.error("❌ Model bundle not found in artifacts/. Did you run train_model.py?")
    raise FileNotFoundError("Model bundle missing — please train the model first.")

bundle = joblib.load(BUNDLE_PATH)
scaler, model = bundle["scaler"], bundle["model"]
logger.info("✅ Model and scaler loaded successfully.")

# ------------------ FLASK SETUP ------------------
app = Flask(__name__)
CORS(app)

FEATURE_COLUMNS = [
    "sleep_hours",
    "study_hours",
    "screen_time_hours",
    "physical_activity_minutes",
    "diet_quality",
    "caffeine_intake",
    "social_interaction",
    "mood_rating",
    "loneliness_score",
]

RANGES = {
    "sleep_hours": (0, 16),
    "study_hours": (0, 18),
    "screen_time_hours": (0, 20),
    "physical_activity_minutes": (0, 300),
    "diet_quality": (1, 10),
    "caffeine_intake": (0, 10),
    "social_interaction": (0, 10),
    "mood_rating": (1, 10),
    "loneliness_score": (0, 10),
}

# ------------------ HELPERS ------------------
def risk_band(prob):
    if prob < 0.33:
        return "Low"
    elif prob < 0.66:
        return "Medium"
    return "High"

def validate_and_prepare(data):
    vals, warnings = [], []
    for col in FEATURE_COLUMNS:
        if col not in data:
            raise ValueError(f"Missing feature: {col}")
        val = float(data[col])
        lo, hi = RANGES[col]
        if val < lo or val > hi:
            warnings.append(f"{col}={val} clipped to range [{lo},{hi}]")
            val = np.clip(val, lo, hi)
        vals.append(val)
    return np.array(vals).reshape(1, -1), warnings

# ------------------ ROUTES ------------------
@app.route("/health", methods=["GET"])
def health():
    logger.info("✅ Health check requested — service is alive.")
    return jsonify(status="ok", timestamp=datetime.now().isoformat())

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        logger.info(f"📨 Prediction request: {data}")

        X, warnings = validate_and_prepare(data)
        X_scaled = scaler.transform(X)
        prob = float(model.predict_proba(X_scaled)[0, 1])
        prob = float(np.clip(prob, 0.01, 0.99))
        risk = risk_band(prob)

        logger.info(
            f"🤖 Prediction -> Probability: {prob:.3f} | Risk Level: {risk} | Warnings: {len(warnings)}"
        )

        return jsonify(
            success=True,
            probability=round(prob, 4),
            risk_level=risk,
            confidence_percent=round(prob * 100, 2),
            warnings=warnings,
        )
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        return jsonify(success=False, error=str(e)), 400


if __name__ == "__main__":
    public_base = os.environ.get("PUBLIC_BASE_URL", "http://localhost:5000")
    logger.info("============================================================")
    logger.info("🚀 StressSense ML Service")
    logger.info(f"🔗 Health:   {public_base}/health")
    logger.info(f"🔗 Predict:  {public_base}/predict")
    logger.info("============================================================")
    app.run(host="0.0.0.0", port=5000, debug=False)

