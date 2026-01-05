import React, { useState } from "react";
import { useProjectManager } from "../hooks/useProjectManager";
import { ResourceCards } from "../components/ResourceCards";
import { Modal } from "../components/Modal";

export default function Dast() {
  const pm = useProjectManager();
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const [modalId, setModalId] = useState(null);

  const start = () => {
    pm.addTask({
      title: name || "DAST Scan",
      scanType: "DAST",
      sourceType: "Running Application",
      sourceValue: targetUrl || "https://example.com",
    });
    setName("");
    setTargetUrl("");
  };

  return (
    <div className="page">
      <div className="panel">
        <h2 className="page__title">DAST — Dynamic Analysis</h2>
        <p className="page__muted">Test a running application for vulnerabilities (mock).</p>

        <div className="grid2">
          <label className="label">
            Scan Name
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Checkout Flow DAST" />
          </label>

          <label className="label">
            Target URL
            <input className="input" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://example.com" />
          </label>
        </div>

        <div className="row">
          <button className="btn" onClick={start}>Start DAST Scan</button>
        </div>
      </div>

      <div className="container resources-container">
        <h2 className="section-title">
          <span className="icon-placeholder">📚</span>
          Security Resources
        </h2>

        <ResourceCards variant="dast" onOpen={(id) => setModalId(id)} />
      </div>

      <Modal
        open={Boolean(modalId)}
        title={
          modalId === "zap" ? "About OWASP ZAP" :
          modalId === "prep" ? "Scan Preparation" :
          modalId === "vuln" ? "Common Vulnerabilities" : ""
        }
        onClose={() => setModalId(null)}
      >
        {modalId === "zap" ? (
          <div className="modal-body">
            <p>OWASP ZAP is a widely used web application security scanner.</p>
            <ul>
              <li>Spider crawling</li>
              <li>Passive analysis</li>
              <li>Active scanning</li>
            </ul>
          </div>
        ) : null}

        {modalId === "prep" ? (
          <div className="modal-body">
            <ul>
              <li>Have authorization</li>
              <li>Prefer staging environment</li>
              <li>Monitor performance during scan</li>
              <li>Use full URL with https://</li>
            </ul>
          </div>
        ) : null}

        {modalId === "vuln" ? (
          <div className="modal-body">
            <ul>
              <li>XSS / SQLi / auth issues</li>
              <li>Missing security headers</li>
              <li>Information disclosure</li>
              <li>Access control flaws</li>
            </ul>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
