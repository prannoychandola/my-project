import { useState } from "react";
import { predictStress } from "../services/api";

const PredictForm = () => {
  const [form, setForm] = useState({
    sleep_hours: 7,
    quality_score: 8,
    work_hours: 6,
    deadline_pressure: 5,
    breaks_taken: 3,
    physical_activity: 40,
    diet_quality: 7,
    caffeine_intake: 2,
    social_interaction: 6,
    mood_rating: 7,
    loneliness_score: 3,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await predictStress(form);
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Check backend or ML service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block capitalize mb-1">{key.replace(/_/g, " ")}</label>
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 border-t">
          <p>
            <strong>Stress Level:</strong>{" "}
            {result.stress_level === 1 ? "Stressed 😟" : "Not Stressed 😊"}
          </p>
          <p>
            <strong>Probability:</strong> {result.stress_probability}%
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictForm;
