#!/usr/bin/env bash
set -e

if [ ! -f artifacts/logistic_regression_model.pkl ] || [ ! -f artifacts/standard_scaler.pkl ]; then
  echo "[ml-service] Artifacts missing → training model..."
  python train_model.py
else
  echo "[ml-service] Found artifacts → skipping training."
fi

echo "[ml-service] Starting Flask..."
python app.py
