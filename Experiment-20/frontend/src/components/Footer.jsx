// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Stress Predictor UI</span>
      <span className="dot">•</span>
      <a
        className="link subtle"
        href="#privacy"
        onClick={(e) => e.preventDefault()}
      >
        Privacy
      </a>
      <span className="dot">•</span>
      <a
        className="link subtle"
        href="#terms"
        onClick={(e) => e.preventDefault()}
      >
        Terms
      </a>
    </footer>
  );
};

export default Footer;
