import os
import joblib
import numpy as np
import pandas as pd
import logging
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score, brier_score_loss

# ------------------ LOGGER ------------------
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("StressSense-TRAIN")

# ------------------ CONFIG ------------------
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

ROOT = os.path.dirname(__file__)
DATA_DIR = os.path.join(ROOT, "data")
ARTIFACT_DIR = os.path.join(ROOT, "artifacts")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

DATA_PATH = os.path.join(DATA_DIR, "mental_stress_dataset.csv")
BUNDLE_PATH = os.path.join(ARTIFACT_DIR, "model_bundle.pkl")

# ------------------ DATASET ------------------
def generate_dataset():
    logger.info("📊 Generating synthetic dataset...")
    rng = np.random.default_rng(42)
    n = 5000
    df = pd.DataFrame({
        "sleep_hours": rng.normal(6.5, 1.8, n).clip(0, 12),
        "study_hours": rng.normal(5.5, 2.5, n).clip(0, 14),
        "screen_time_hours": rng.normal(7, 3, n).clip(0, 18),
        "physical_activity_minutes": rng.normal(40, 25, n).clip(0, 300),
        "diet_quality": rng.integers(1, 11, n),
        "caffeine_intake": rng.integers(0, 8, n),
        "social_interaction": rng.integers(0, 11, n),
        "mood_rating": rng.integers(1, 11, n),
        "loneliness_score": rng.integers(0, 11, n),
    })

    stress_score = (
        -0.4 * df["sleep_hours"]
        + 0.1 * df["study_hours"]
        + 0.25 * df["screen_time_hours"]
        - 0.015 * df["physical_activity_minutes"]
        - 0.3 * df["diet_quality"]
        + 0.2 * df["caffeine_intake"]
        - 0.25 * df["social_interaction"]
        - 0.4 * df["mood_rating"]
        + 0.35 * df["loneliness_score"]
        + rng.normal(0, 0.8, n)
    )

    prob = 1 / (1 + np.exp(-stress_score))
    df["stress_label"] = (prob > 0.5).astype(int)
    df.to_csv(DATA_PATH, index=False)
    logger.info(f"✅ Dataset generated -> {DATA_PATH}")
    return df


# ------------------ TRAINING ------------------
def main():
    logger.info("🚀 Starting model training...")
    df = pd.read_csv(DATA_PATH) if os.path.exists(DATA_PATH) else generate_dataset()

    X = df[FEATURE_COLUMNS]
    y = df["stress_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    rf = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        random_state=42,
        class_weight="balanced_subsample"
    )

    model = CalibratedClassifierCV(rf, method="sigmoid", cv=3)
    model.fit(X_train_s, y_train)
    logger.info("✅ Model training complete.")

    preds = model.predict(X_test_s)
    probs = model.predict_proba(X_test_s)[:, 1]
    auc = roc_auc_score(y_test, probs)
    brier = brier_score_loss(y_test, probs)

    logger.info(f"📈 AUC: {auc:.3f} | Brier Score: {brier:.4f}")
    logger.info("\n" + classification_report(y_test, preds))

    joblib.dump({"scaler": scaler, "model": model}, BUNDLE_PATH)
    logger.info(f"💾 Model bundle saved to {BUNDLE_PATH}")

    logger.info("🎯 Training process finished successfully.")

if __name__ == "__main__":
    main()
