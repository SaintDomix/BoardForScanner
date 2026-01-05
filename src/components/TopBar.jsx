import React from "react";

export default function TopBar({ onStart, onGo }) {
  return (
    <header className="topbar">
      <div className="topbar__title">RepoScan</div>
      <div className="topbar__actions">
        <button className="btn btn--ghost" onClick={() => onGo("/sast")}>SAST</button>
        <button className="btn btn--ghost" onClick={() => onGo("/dast")}>DAST</button>
        <button className="btn" onClick={onStart}>Start Scan</button>
      </div>
    </header>
  );
}
