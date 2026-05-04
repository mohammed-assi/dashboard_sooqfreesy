import React from "react";

const ProgressBar = ({ score, color }) => {
  const clampedValue = Math.min(100, Math.max(0, score));

  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${clampedValue}%`, backgroundColor: `${color}` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
