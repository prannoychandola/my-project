import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# --- Paths ---
MODEL_PATH = os.path.join('artifacts', 'logistic_regression_model.pkl')
SCALER_PATH = os.path.join('artifacts', 'standard_scaler.pkl')

FEATURE_COLUMNS = [
    'sleep_hours', 'quality_score', 'work_hours', 'deadline_pressure',
    'breaks_taken', 'physical_activity', 'diet_quality', 'caffeine_intake',
    'social_interaction', 'mood_rating', 'loneliness_score'
]

# --- Load Model & Scaler ---
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("AI Service: Model and Scaler loaded successfully.")
except FileNotFoundError:
    print("AI Service ERROR: Model or Scaler file not found.")
    model = None
    scaler = None

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

@app.route('/api/predict', methods=['POST'])
def predict_stress():
    if model is None or scaler is None:
        return jsonify({'error': 'Model not initialized'}), 503

    data = request.get_json(force=True)
    try:
        features = [data[col] for col in FEATURE_COLUMNS]
        input_df = pd.DataFrame([features], columns=FEATURE_COLUMNS)
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0].tolist()

        result = {
            'stress_level': int(prediction),
            'stress_probability': round(probability[1] * 100, 2),
            'message': 'Prediction successful.'
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("\n--- Starting Python ML Service (Flask) ---")
    print("Available at: http://localhost:5000/api/predict (POST)")
    app.run(host='0.0.0.0', port=5000)
