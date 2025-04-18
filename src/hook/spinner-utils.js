import React from "react";

export const Spinner = ({ size = "1.5rem", color = "#0d6efd" }) => {
  return (
    <div className="spinner-container">
      <svg
        className="custom-spinner"
        viewBox="0 0 50 50"
        style={{ width: size, height: size }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="94.5"
          strokeDashoffset="94.5"
          className="spinner-circle"
        />
      </svg>
    </div>
  );
};