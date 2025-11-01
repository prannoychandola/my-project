// src/components/StressForm.jsx
import React from "react";
import FeatureSlider from "./FeatureSlider";
import featureConfig from "../data/featureConfig";

const defaultValues = featureConfig.reduce((acc, f) => {
  // Set good mid defaults
  const mid =
    typeof f.min === "number" && typeof f.max === "number"
      ? Number(((f.min + f.max) / 2).toFixed(0))
      : 5;
  acc[f.key] = mid;
  return acc;
}, {});

const StressForm = ({ values, onChange, onSubmit, disabled }) => {
  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className="form-grid">
        {featureConfig.map((f) => (
          <FeatureSlider
            key={f.key}
            id={f.key}
            label={f.label}
            value={values[f.key]}
            min={f.min}
            max={f.max}
            step={f.step}
            hint={f.hint}
            onChange={(val) => onChange(f.key, val)}
          />
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" className="button primary" disabled={disabled}>
          Predict
        </button>
        <button
          type="button"
          className="button ghost"
          onClick={() => {
            // Reset to mid values
            featureConfig.forEach((f) => onChange(f.key, defaultValues[f.key]));
          }}
          disabled={disabled}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default StressForm;
