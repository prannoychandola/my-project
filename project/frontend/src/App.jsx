import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  // ------------------ THEME HANDLING ------------------
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ------------------ FORM STATE ------------------
  const [form, setForm] = useState({
    sleep_hours: "",
    study_hours: "",
    screen_time: "",
    physical_activity: "",
    diet_quality: "",
    caffeine_intake: "",
    social_interaction: "",
    mood_rating: "",
    loneliness_score: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = useMemo(
    () => Object.values(form).every((v) => String(v).trim() !== ""),
    [form]
  );

  // ------------------ RESULT MODAL ------------------
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePredict = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)])
      );

      // TODO: Replace with Flask backend API call
      const fakeProb = Math.min(
        0.99,
        Math.max(0.01, (payload.screen_time + payload.loneliness_score) / 20 / 2)
      );
      const data = { probability: fakeProb, label: fakeProb > 0.5 ? "High" : "Low" };

      setResult(data);
      setShowModal(true);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  const closeModal = () => setShowModal(false);

  // ------------------ RENDER ------------------
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <h1>StressSense AI</h1>
        </div>
        <button className="toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <main className="page-content">
        <section className="card">
          <h2 className="section-title">Predict Stress</h2>
          <div className="row">
            {[
              ["sleep_hours", "Sleep Hours", "e.g., 7"],
              ["study_hours", "Study Hours", "e.g., 4"],
              ["screen_time", "Screen Time (hours/day)", "e.g., 5"],
              ["physical_activity", "Physical Activity (minutes/day)", "e.g., 30"],
              ["diet_quality", "Diet Quality (1–10)", "Rate diet quality (1–10)"],
              ["caffeine_intake", "Caffeine Intake (cups/day 0–10)", "e.g., 2"],
              ["social_interaction", "Social Interaction (1–10)", "Rate social interaction (1–10)"],
              ["mood_rating", "Mood Rating (1–10)", "Rate overall mood (1–10)"],
              ["loneliness_score", "Loneliness Score (1–10)", "Rate loneliness (1–10)"],
            ].map(([name, label, placeholder]) => (
              <div key={name}>
                <label>{label}</label>
                <input
                  name={name}
                  type="number"
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <button className="btn primary" disabled={!isValid} onClick={handlePredict}>
              Predict Stress
            </button>
          </div>
        </section>
      </main>

      <footer className="app-footer">© 2025 StressSense AI</footer>

      {showModal && result && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-head">
              <h3 style={{ margin: 0 }}>Prediction Result</h3>
              <button className="close-x" aria-label="Close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Stress Probability:{" "}
                <strong>{(result.probability * 100).toFixed(1)}%</strong>
              </p>
              <p>
                Risk Level:{" "}
                <strong
                  style={{
                    color: result.label === "High" ? "#ef4444" : "#10b981",
                  }}
                >
                  {result.label}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
