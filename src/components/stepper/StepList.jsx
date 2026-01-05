import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStepper } from "./stepperContext";

export function StepList({ className = "" }) {
  const stepper = useStepper();
  const { steps, activeIndex } = stepper;

  const [focusIndex, setFocusIndex] = useState(activeIndex);
  const tabRefs = useRef([]);

  useEffect(() => {
    setFocusIndex(activeIndex);
  }, [activeIndex]);

  const enabledIndexes = useMemo(() => {
    return steps.map((s, i) => (!s.disabled ? i : null)).filter((x) => x !== null);
  }, [steps]);

  const firstEnabled = enabledIndexes[0] ?? 0;
  const lastEnabled = enabledIndexes[enabledIndexes.length - 1] ?? 0;

  const findNextEnabled = (from, dir) => {
    const n = steps.length;
    if (!n) return 0;
    let i = from;
    for (let k = 0; k < n; k++) {
      i = i + dir;
      if (i < 0) i = n - 1;
      if (i >= n) i = 0;
      if (!steps[i]?.disabled) return i;
    }
    return from;
  };

  const focusTab = (i) => {
    setFocusIndex(i);
    requestAnimationFrame(() => tabRefs.current[i]?.focus?.());
  };

  const onKeyDown = (e) => {
    if (!steps.length) return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown": {
        e.preventDefault();
        focusTab(findNextEnabled(focusIndex, +1));
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        e.preventDefault();
        focusTab(findNextEnabled(focusIndex, -1));
        break;
      }
      case "Home": {
        e.preventDefault();
        focusTab(firstEnabled);
        break;
      }
      case "End": {
        e.preventDefault();
        focusTab(lastEnabled);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (stepper.canGoTo(focusIndex)) stepper.setActive(focusIndex);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className={`stepper__tabs ${className}`}
      role="tablist"
      aria-label="Steps"
      onKeyDown={onKeyDown}
    >
      {steps.map((s, i) => {
        const selected = i === activeIndex;
        const tabId = `stepper-tab-${s.id}`;
        const panelId = `stepper-panel-${s.id}`;
        const disabled = !!s.disabled;

        return (
          <button
            key={s.id}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={tabId}
            aria-selected={selected}
            aria-controls={panelId}
            aria-disabled={disabled || undefined}
            tabIndex={selected ? 0 : -1} 
            className={`stepper__tab ${selected ? "is-active" : ""} ${
              disabled ? "is-disabled" : ""
            }`}
            onClick={() => {
              if (!disabled) stepper.setActive(i);
            }}
          >
            <span className="stepper__tabIndex">{i + 1}</span>
            <span className="stepper__tabTitle">{s.title}</span>
            {s.optional ? <span className="stepper__optional">Optional</span> : null}
          </button>
        );
      })}
    </div>
  );
}
