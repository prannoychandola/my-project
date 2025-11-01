// src/App.jsx
import React, { useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StressForm from "./components/StressForm";
import ResultPanel from "./components/ResultPanel";
import featureConfig from "./data/featureConfig";
import "./App.css";

const initialValues = featureConfig.reduce((acc, f) => {
  const mid =
    typeof f.min === "number" && typeof f.max === "number"
      ? Number(((f.min + f.max) / 2).toFixed(0))
      : 5;
  acc[f.key] = mid;
  return acc;
}, {});

function App() {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (key, val) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const payload = useMemo(() => ({ ...values }), [values]);

  const handleSubmit = async () => {
    // UI-only demo: no API call. Show a loading state then a placeholder result.
    setIsSubmitting(true);

    // Simulate pending UI
    setTimeout(() => {
      // Placeholder preview result (replace with real fetch to Flask)
      setResult({
        stress_level: 0,
        stress_probability: 42.5,
        message: "Preview mode — connect backend to get real predictions.",
      });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        <section className="grid">
          <div className="col">
            <StressForm
              values={values}
              onChange={handleChange}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
            />
          </div>

          <div className="col">
            <ResultPanel result={result} isSubmitting={isSubmitting} />
            <section className="card payload">
              <h4 className="payload-title">Payload Preview</h4>
              <pre className="code" aria-live="polite">
                {JSON.stringify(payload, null, 2)}
              </pre>
              <div className="muted">
                This is the exact JSON shape your Flask endpoint expects.
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
