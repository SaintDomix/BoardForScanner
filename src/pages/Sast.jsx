import React, { useMemo, useRef, useState } from "react";
import { useProjectManager } from "../hooks/useProjectManager";
import { ResourceCards } from "../components/ResourceCards";
import { Modal } from "../components/Modal";

export default function Sast() {
  const pm = useProjectManager();

  const [tab, setTab] = useState("link");

  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [file, setFile] = useState(null);

  const [error, setError] = useState("");

  const [modalId, setModalId] = useState(null);

  const fileInputRef = useRef(null);

  const sourceValue = useMemo(() => {
    if (tab === "link") return repoUrl || "https://github.com/user/repo";
    return file?.name || "upload.zip";
  }, [tab, repoUrl, file]);

  const start = (e) => {
    e?.preventDefault?.();
    setError("");

    if (tab === "link") {
      if (!repoUrl.trim()) return setError("Please enter GitHub/GitLab repository URL.");
    } else {
      if (!file) return setError("Please choose a .zip file.");
      if (!file.name.toLowerCase().endsWith(".zip")) return setError("Only .zip files are supported.");
    }

    pm.addTask({
      title: name || "SAST Scan",
      scanType: "SAST",
      sourceType: tab === "link" ? "GitHub/GitLab Repository" : "ZIP Upload",
      sourceValue,
    });

    setName("");
    setRepoUrl("");
    setFile(null);
  };

  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="page">
      <div className="panel">
        <h2 className="page__title">SAST — Static Analysis</h2>
        <p className="page__muted">Analyze source code for vulnerabilities (mock).</p>

        <div className="grid2">
          <label className="label">
            Scan Name
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Frontend API Security"
            />
          </label>

          {tab === "link" ? (
            <label className="label">
              Enter GitHub/GitLab Repository URL
              <input
                className="input"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
              />
            </label>
          ) : (
            <div className="label">
              Upload ZIP (.zip)
              <div
                className={`upload-area ${dragOver ? "dragover" : ""} ${file ? "has-file" : ""}`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <div className="upload-content">
                  <div className="upload-icon">⬆️</div>

                  {!file ? (
                    <>
                      <p className="upload-text">Drag & drop your code file here</p>
                      <p className="upload-subtext">or click to browse files</p>
                      <p className="upload-formats">Supported format: .zip (mock)</p>
                    </>
                  ) : (
                    <>
                      <p className="upload-text">Selected file:</p>
                      <p className="upload-subtext">{file.name}</p>
                      <p className="upload-formats">Ready to scan</p>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="file-input"
                    accept=".zip"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tab-buttons">
          <button
            type="button"
            className={`tab-button ${tab === "link" ? "active" : ""}`}
            onClick={() => setTab("link")}
          >
            Scan by Link
          </button>
          <button
            type="button"
            className={`tab-button ${tab === "file" ? "active" : ""}`}
            onClick={() => setTab("file")}
          >
            Scan by File Upload
          </button>
        </div>

        {error ? <div className="error-message">{error}</div> : null}

        <div className="row">
          <button className="btn" onClick={start}>
            Start SAST Scan
          </button>
        </div>
      </div>

      <div className="container resources-container">
        <h2 className="section-title">
          <span className="icon-placeholder">📚</span>
          Security Resources
        </h2>

        <ResourceCards
          variant="sast"
          onOpen={(id) => setModalId(id)}
        />
      </div>

      <Modal
        open={Boolean(modalId)}
        title={
          modalId === "owasp"
            ? "OWASP Top 10"
            : modalId === "cwe"
            ? "Common Weakness Enumeration (CWE)"
            : modalId === "best"
            ? "Security Best Practices"
            : ""
        }
        onClose={() => setModalId(null)}
      >
        {modalId === "owasp" ? (
          <div className="modal-body">
            <p>Most critical web application security risks.</p>
            <ol>
              <li>Broken Access Control</li>
              <li>Cryptographic Failures</li>
              <li>Injection</li>
              <li>Insecure Design</li>
              <li>Security Misconfiguration</li>
              <li>Vulnerable Components</li>
              <li>Authentication Failures</li>
              <li>Integrity Failures</li>
              <li>Logging/Monitoring Failures</li>
              <li>SSRF</li>
            </ol>
          </div>
        ) : null}

        {modalId === "cwe" ? (
          <div className="modal-body">
            <ul>
              <li>CWE-79 — Cross-Site Scripting (XSS)</li>
              <li>CWE-89 — SQL Injection</li>
              <li>CWE-22 — Path Traversal</li>
              <li>CWE-287 — Authentication Issues</li>
              <li>CWE-200 — Information Exposure</li>
            </ul>
          </div>
        ) : null}

        {modalId === "best" ? (
          <div className="modal-body">
            <ul>
              <li>Validate input, encode output</li>
              <li>Use parameterized queries</li>
              <li>Least privilege + RBAC</li>
              <li>Keep dependencies updated</li>
              <li>Logging & monitoring</li>
            </ul>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
