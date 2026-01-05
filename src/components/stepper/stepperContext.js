import React from "react";

export const StepperContext = React.createContext(null);

export function useStepper() {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used inside <Stepper>");
  return ctx;
}
