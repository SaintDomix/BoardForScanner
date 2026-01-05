import React from "react";

const RESOURCES = {
  sast: [
    { id: "owasp", title: "OWASP Top 10", desc: "Critical web risks" },
    { id: "cwe", title: "CWE Reference", desc: "Weakness enumeration" },
    { id: "best", title: "Best Practices", desc: "Secure SDLC basics" },
  ],
  dast: [
    { id: "zap", title: "About OWASP ZAP", desc: "Scanner overview" },
    { id: "prep", title: "Scan Preparation", desc: "Before you scan" },
    { id: "vuln", title: "Common Vulnerabilities", desc: "Typical web issues" },
  ],
};

export function ResourceCards({ variant = "sast", onOpen }) {
  const items = RESOURCES[variant] ?? RESOURCES.sast;

  return (
    <div className="resources-grid">
      {items.map((x) => (
        <div
          key={x.id}
          className="resource-card"
          role="button"
          tabIndex={0}
          onClick={() => onOpen?.(x.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpen?.(x.id);
          }}
        >
          <div className="card-gradient">
            <div className="logo-placeholder" />
          </div>
          <div className="card-content">
            <h3>{x.title}</h3>
            <p>{x.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
