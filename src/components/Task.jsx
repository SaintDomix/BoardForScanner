import React from "react";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "./Badge";

const STATUS_KIND = {
  COMPLETED: "green",
  FAILED: "red",
  ACTIVE: "gray",
};

export function Task({ task, onDelete, onMove }) {
  const canReport = task.status === "COMPLETED" && task.reportUrl;

  const openReport = () => {
    window.open(task.reportUrl, "_blank", "noopener,noreferrer");
  };

  const statusKind = STATUS_KIND[task.status] || "gray";

  return (
    <article className="card">
      <div className="card__top">
        <div className="card__title">{task.title}</div>
        <button
          className="iconbtn"
          onClick={() => onDelete(task.id)}
          title="Delete"
          aria-label="Delete"
        >
          ✕
        </button>
      </div>

      <div className="card__meta">
        <Badge kind="blue">{task.scanType}</Badge>
        <Badge kind={statusKind}>{task.status}</Badge>
      </div>

      <div className="card__sub">
        <div className="mono">SOURCE:</div>
        <div className="mono mono--truncate" title={task.sourceValue}>
          {task.sourceValue}
        </div>
      </div>

      {task.status === "ACTIVE" && <ProgressBar value={task.progress} />}

      {task.status === "COMPLETED" && task.findings && (
        <div className="card__meta">
          <span className="badge badge--red">CRITICAL {task.findings.critical}</span>
          <span className="badge badge--purple">MEDIUM {task.findings.medium}</span>
          <span className="badge badge--green">LOW {task.findings.low}</span>
        </div>
      )}

      <div className="card__actions">
        {canReport && (
          <button className="btn btn--secondary" onClick={openReport}>
            View PDF Report
          </button>
        )}
      </div>

      <label className="label" style={{ marginTop: 10 }}>
        Move to
        <select
          className="select"
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
        >
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </label>
    </article>
  );
}
