#!/usr/bin/env bash
set -e

echo "[start] Checking for model artifacts..."
if [ ! -f "artifacts/model_bundle.pkl" ]; then
  echo "[start] No model found. Training model now..."
  python train_model.py
else
  echo "[start] Model found. Skipping training."
fi

echo "[start] Launching Flask ML API..."
python app.py
