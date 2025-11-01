// src/components/ResultPanel.jsx
import React from "react";

const Badge = ({ tone = "neutral", children }) => (
  <span className={`badge ${tone}`}>{children}</span>
);

const ResultPanel = ({ result, isSubmitting }) => {
  if (isSubmitting) {
    return (
      <section className="card result">
        <div className="skeleton title" />
        <div className="skeleton line" />
        <div className="skeleton line short" />
      </section>
    );
  }

  if (!result) {
    return (
      <section className="card result empty">
        <h3>No Prediction Yet</h3>
        <p>
          Fill out the form and click <strong>Predict</strong>. This panel will
          display the server response once you connect the backend.
        </p>
        <div className="muted">Endpoint expected: /api/predict (POST)</div>
      </section>
    );
  }

  const { stress_level, stress_probability, message } = result;

  return (
    <section className="card result">
      <div className="result-head">
        <h3>Prediction</h3>
        <Badge tone={stress_level === 1 ? "danger" : "success"}>
          {stress_level === 1 ? "Stressed" : "Not Stressed"}
        </Badge>
      </div>

      <div className="result-body">
        <div className="meter">
          <div
            className="meter-fill"
            style={{ width: `${Math.min(stress_probability || 0, 100)}%` }}
          />
        </div>
        <div className="result-rows">
          <div className="row">
            <span className="key">Probability</span>
            <span className="val">
              {typeof stress_probability === "number"
                ? `${stress_probability}%`
                : "—"}
            </span>
          </div>
          <div className="row">
            <span className="key">Message</span>
            <span className="val">{message || "Success"}</span>
          </div>
        </div>
      </div>

      <div className="muted">
        UI-only mode. Replace submit handler to call your Flask service.
      </div>
    </section>
  );
};

export default ResultPanel;
