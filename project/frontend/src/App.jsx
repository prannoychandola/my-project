import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  // ------------------ THEME ------------------
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

  // ------------------ API URL (IMPORTANT) ------------------
  // Uses Vite env if available (Docker build or local .env).
  // Falls back to localhost:5000 (your ml-service port from `docker ps`).
  const API_URL =
    (import.meta?.env?.VITE_ML_URL && String(import.meta.env.VITE_ML_URL).trim()) ||
    "http://localhost:5000/predict";
  console.log("Using ML API:", API_URL);

  // ------------------ FORM STATE ------------------
  const [form, setForm] = useState({
    sleep_hours: "",
    study_hours: "",
    screen_time_hours: "",
    physical_activity_minutes: "",
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

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Read raw first to surface HTML errors (like 404 pages)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert(`API returned non-JSON (status ${res.status}). First 200 chars:\n${text.slice(0, 200)}`);
        return;
      }
      if (!data.success) throw new Error(data.error || `Request failed (${res.status})`);

      // Prefer server-provided risk band; fallback to same thresholds
      const p = Number(data.probability ?? 0);
      const risk = data.risk_level ?? (p > 0.66 ? "High" : p >= 0.33 ? "Medium" : "Low");

      setResult({ probability: p, riskLevel: risk });
      setShowModal(true);
    } catch (err) {
      console.error("Prediction failed:", err);
      alert(err.message || "Prediction failed");
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
              ["screen_time_hours", "Screen Time (hours/day)", "e.g., 5"],
              ["physical_activity_minutes", "Physical Activity (minutes/day)", "e.g., 30"],
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
                    color:
                      result.riskLevel === "High"
                        ? "#ef4444"
                        : result.riskLevel === "Medium"
                        ? "#f59e0b"
                        : "#10b981",
                  }}
                >
                  {result.riskLevel}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
