import React from "react";

const Header = () => {
  return (
    <header className="header card">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span>◎</span>
        </div>
        <div className="brand-copy">
          <h1 className="title">Stress Level Predictor</h1>
          <p className="subtitle">Clean, minimal and light UI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
