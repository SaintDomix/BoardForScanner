import React from "react";

export function Column({ title, count, emptyText, children }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <section className="column">
      <header className="column__head">
        <h3 className="column__title">{title}</h3>
        <span className="pill">{count}</span>
      </header>

      <div className="column__body">
        {hasChildren ? children : <div className="empty">{emptyText}</div>}
      </div>
    </section>
  );
}
