import React from "react";

export function Badge({ kind, children }) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}
