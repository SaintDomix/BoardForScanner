import React, { useEffect } from "react";
import { useStepper } from "./stepperContext";

function isFn(x) {
  return typeof x === "function";
}

export function Step({
  id,
  title,
  disabled = false,
  optional = false,
  describedBy,
  children,
}) {
  const stepper = useStepper();

  useEffect(() => {
    if (!id) throw new Error("<Stepper.Step> requires an id");
    stepper.registerStep({ id, title, disabled, optional, describedBy });
    return () => stepper.unregisterStep(id);
  }, [id, title, disabled, optional, describedBy]);

  const index = stepper.steps.findIndex((s) => s.id === id);
  const isActive = index === stepper.activeIndex;

  if (!isActive) return null;

  const ctx = {
    ...stepper,
    stepId: id,
    stepIndex: index,
    isActive,
  };

  return <div className="stepper__step">{isFn(children) ? children(ctx) : children}</div>;
}
