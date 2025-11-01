// src/components/FeatureSlider.jsx
import React from "react";

const FeatureSlider = ({
  id,
  label,
  value,
  min,
  max,
  step,
  hint,
  onChange,
}) => {
  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <div className="field-value" aria-live="polite">
          {value}
        </div>
      </div>

      <input
        id={id}
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
};

export default FeatureSlider;