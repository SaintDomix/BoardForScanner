import React, { useMemo, useRef, useState } from "react";
import { Modal } from "./Modal";
import { Stepper } from "./stepper/Stepper";

const DEFAULTS = {
  scanType: "SAST", 
  mode: "repo", 
  title: "",
  repoUrl: "",
  targetUrl: "",
  zipFile: null,
};

export function ScanDialog({ open, onClose, onSubmit }) {
  const fileInputRef = useRef(null);

  const submitPayload = (data) => {
    const scanType = data.scanType;

    if (scanType === "SAST") {
      const sourceType = data.mode === "zip" ? "ZIP Upload" : "GitHub/GitLab Repository";
      const sourceValue =
        data.mode === "zip"
          ? (data.zipFile?.name || "upload.zip")
          : (data.repoUrl || "https://github.com/user/repo");

      onSubmit({
        title: data.title || "SAST Scan",
        scanType: "SAST",
        sourceType,
        sourceValue,
      });
      return;
    }

    onSubmit({
      title: data.title || "DAST Scan",
      scanType: "DAST",
      sourceType: "Running Application",
      sourceValue: data.targetUrl || "https://example.com",
    });
  };

  const header = (
    <div>
      <div className="modal__title">Start New Security Scan</div>
      <div className="modal__desc">Wizard: choose tool → provide target → review → run.</div>
    </div>
  );

  return (
    <Modal open={open} header={header} onClose={onClose}>
      <Stepper initialData={DEFAULTS} initialStep={0} className="scanWizard">
        <Stepper.List />

        <Stepper.Step id="type" title="Scan Type">
          {({ data, setData, next }) => (
            <div className="wizard">
              <div className="wizard__block">
                <div className="wizard__label">Choose scan type</div>

                <div className="wizard__seg">
                  <button
                    type="button"
                    className={`wizard__segBtn ${data.scanType === "SAST" ? "is-active" : ""}`}
                    onClick={() => setData({ scanType: "SAST" })}
                  >
                    SAST (Static)
                  </button>
                  <button
                    type="button"
                    className={`wizard__segBtn ${data.scanType === "DAST" ? "is-active" : ""}`}
                    onClick={() => setData({ scanType: "DAST" })}
                  >
                    DAST (Dynamic)
                  </button>
                </div>

                <p className="page__muted" style={{ marginTop: 10 }}>
                  {data.scanType === "SAST"
                    ? "SAST analyzes source code (repo or zip)."
                    : "DAST scans a running web app via URL."}
                </p>
              </div>

              <div className="wizard__actions">
                <button type="button" className="btn" onClick={next}>
                  Continue
                </button>
              </div>
            </div>
          )}
        </Stepper.Step>

        <Stepper.Step id="target" title="Target">
          {({ data, setData, next, prev, setTouched, touched }) => {
            const errors = {};

            if (data.scanType === "SAST") {
              if (data.mode === "repo") {
                if (!data.repoUrl?.trim()) errors.repoUrl = "Enter repository URL.";
              } else {
                if (!data.zipFile) errors.zipFile = "Choose a .zip file.";
                else if (!data.zipFile.name.toLowerCase().endsWith(".zip"))
                  errors.zipFile = "Only .zip supported (mock).";
              }
            } else {
              if (!data.targetUrl?.trim()) errors.targetUrl = "Enter target URL.";
            }

            const hasErrors = Object.keys(errors).length > 0;

            const goNext = () => {
              if (data.scanType === "SAST") {
                if (data.mode === "repo") setTouched("repoUrl", true);
                else setTouched("zipFile", true);
              } else setTouched("targetUrl", true);

              if (!hasErrors) next();
            };

            return (
              <div className="wizard">
                {data.scanType === "SAST" ? (
                  <>
                    <div className="wizard__block">
                      <div className="wizard__label">SAST source</div>

                      <div className="wizard__seg">
                        <button
                          type="button"
                          className={`wizard__segBtn ${data.mode === "repo" ? "is-active" : ""}`}
                          onClick={() => setData({ mode: "repo" })}
                        >
                          Repo link
                        </button>
                        <button
                          type="button"
                          className={`wizard__segBtn ${data.mode === "zip" ? "is-active" : ""}`}
                          onClick={() => setData({ mode: "zip" })}
                        >
                          ZIP upload
                        </button>
                      </div>

                      {data.mode === "repo" ? (
                        <label className="label" style={{ marginTop: 12 }}>
                          Repository URL
                          <input
                            className="input"
                            value={data.repoUrl}
                            onChange={(e) => setData({ repoUrl: e.target.value })}
                            onBlur={() => setTouched("repoUrl", true)}
                            placeholder="https://github.com/user/repo"
                          />
                          {touched.repoUrl && errors.repoUrl ? (
                            <div className="error-message">{errors.repoUrl}</div>
                          ) : null}
                        </label>
                      ) : (
                        <div style={{ marginTop: 12 }}>
                          <div className="wizard__label">Upload ZIP (.zip)</div>

                          <div
                            className={`upload-area ${data.zipFile ? "has-file" : ""}`}
                            role="button"
                            tabIndex={0}
                            aria-label="Upload zip file"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                fileInputRef.current?.click();
                              }
                            }}
                          >
                            <div className="upload-content">
                              <div className="upload-icon">⬆️</div>
                              {!data.zipFile ? (
                                <>
                                  <p className="upload-text">Click to browse a ZIP</p>
                                  <p className="upload-subtext">Mock upload</p>
                                </>
                              ) : (
                                <>
                                  <p className="upload-text">Selected:</p>
                                  <p className="upload-subtext">{data.zipFile.name}</p>
                                </>
                              )}

                              <input
                                ref={fileInputRef}
                                type="file"
                                className="file-input"
                                accept=".zip"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  setData({ zipFile: f });
                                  setTouched("zipFile", true);
                                }}
                              />
                            </div>
                          </div>

                          {touched.zipFile && errors.zipFile ? (
                            <div className="error-message" style={{ marginTop: 10 }}>
                              {errors.zipFile}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="wizard__block">
                    <div className="wizard__label">DAST target</div>
                    <label className="label" style={{ marginTop: 12 }}>
                      Target URL
                      <input
                        className="input"
                        value={data.targetUrl}
                        onChange={(e) => setData({ targetUrl: e.target.value })}
                        onBlur={() => setTouched("targetUrl", true)}
                        placeholder="https://example.com"
                      />
                      {touched.targetUrl && errors.targetUrl ? (
                        <div className="error-message">{errors.targetUrl}</div>
                      ) : null}
                    </label>
                  </div>
                )}

                <div className="wizard__actions">
                  <button type="button" className="btn btn--ghost" onClick={prev}>
                    Back
                  </button>
                  <button type="button" className="btn" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </div>
            );
          }}
        </Stepper.Step>

        <Stepper.Step id="review" title="Review">
          {({ data, setData, next, prev }) => {
            const sourceType =
              data.scanType === "SAST"
                ? data.mode === "zip"
                  ? "ZIP Upload"
                  : "GitHub/GitLab Repository"
                : "Running Application";

            const sourceValue =
              data.scanType === "SAST"
                ? data.mode === "zip"
                  ? (data.zipFile?.name || "upload.zip")
                  : (data.repoUrl || "https://github.com/user/repo")
                : (data.targetUrl || "https://example.com");

            return (
              <div className="wizard">
                <div className="wizard__block">
                  <div className="wizard__label">Name + Summary</div>

                  <label className="label" style={{ marginTop: 12 }}>
                    Scan Name
                    <input
                      className="input"
                      value={data.title}
                      onChange={(e) => setData({ title: e.target.value })}
                      placeholder={`${data.scanType} Scan`}
                    />
                  </label>

                  <div className="review">
                    <div className="review__row">
                      <span className="mono">TYPE:</span>
                      <span className="mono">{data.scanType}</span>
                    </div>
                    <div className="review__row">
                      <span className="mono">SOURCE TYPE:</span>
                      <span className="mono">{sourceType}</span>
                    </div>
                    <div className="review__row">
                      <span className="mono">SOURCE VALUE:</span>
                      <span className="mono mono--truncate" title={sourceValue}>
                        {sourceValue}
                      </span>
                    </div>
                  </div>

                  <p className="page__muted" style={{ marginTop: 10 }}>
                    Press “Start” to create a task. Progress & report are mock-generated.
                  </p>
                </div>

                <div className="wizard__actions">
                  <button type="button" className="btn btn--ghost" onClick={prev}>
                    Back
                  </button>
                  <button type="button" className="btn" onClick={next}>
                    Start
                  </button>
                </div>
              </div>
            );
          }}
        </Stepper.Step>

        <Stepper.Step id="run" title="Run">
          {({ data, prev }) => (
            <div className="wizard">
              <div className="wizard__block">
                <div className="wizard__label">Ready to launch</div>
                <p className="page__muted">
                  This will create a new scan task in the board.
                </p>
              </div>

              <div className="wizard__actions">
                <button type="button" className="btn btn--ghost" onClick={prev}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    submitPayload(data);
                    onClose();
                  }}
                >
                  Create Task
                </button>
              </div>
            </div>
          )}
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
}
