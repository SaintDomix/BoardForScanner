import React from "react";

export function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: `${v}%` }} />
      <div className="progress__label">{v}%</div>
    </div>
  );
}
