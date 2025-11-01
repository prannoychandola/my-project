import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

DATA_PATH = os.path.join('data', 'mental_stress_dataset.xlsx')
MODEL_PATH = os.path.join('artifacts', 'logistic_regression_model.pkl')
SCALER_PATH = os.path.join('artifacts', 'standard_scaler.pkl')

FEATURE_COLUMNS = [
    'sleep_hours', 'quality_score', 'work_hours', 'deadline_pressure',
    'breaks_taken', 'physical_activity', 'diet_quality', 'caffeine_intake',
    'social_interaction', 'mood_rating', 'loneliness_score'
]
TARGET_COLUMN = 'stress_level'

def train_and_save_model():
    print("--- Starting Model Training ---")
    df = pd.read_excel(DATA_PATH)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    joblib.dump(scaler, SCALER_PATH)

    model = LogisticRegression(solver='liblinear')
    model.fit(X_train_scaled, y_train)
    joblib.dump(model, MODEL_PATH)

    accuracy = model.score(scaler.transform(X_test), y_test)
    print(f"✅ Model trained successfully. Accuracy: {accuracy:.2f}")

if __name__ == '__main__':
    train_and_save_model()
