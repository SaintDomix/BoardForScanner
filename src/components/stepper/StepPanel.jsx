import React from "react";
import { useStepper } from "./stepperContext";

export function StepPanel({ className = "" }) {
  const stepper = useStepper();
  const { steps, activeIndex } = stepper;

  const active = steps[activeIndex];
  if (!active) return null;

  const tabId = `stepper-tab-${active.id}`;
  const panelId = `stepper-panel-${active.id}`;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      className={`stepper__panel ${className}`}
    >
      {/* Panel просто контейнер. Контент рендерится через <Stepper.Step> */}
      <div className="stepper__panelInner" />
    </div>
  );
}
