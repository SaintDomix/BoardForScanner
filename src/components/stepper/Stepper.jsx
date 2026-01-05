import React, { useMemo, useReducer } from "react";
import { StepperContext } from "./stepperContext";
import { initialStepperState, stepperReducer, STEPPER_ACTIONS } from "./stepperReducer";
import { StepList } from "./StepList";
import { Step } from "./Step";
import { StepPanel } from "./StepPanel";

export function Stepper({
  initialData = {},
  initialStep = 0,
  onStepChange,
  children,
  className = "",
}) {
  const [state, dispatch] = useReducer(stepperReducer, {
    ...initialStepperState,
    activeIndex: initialStep,
    data: initialData,
  });

  const api = useMemo(() => {
    const steps = state.steps;
    const activeIndex = state.activeIndex;
    const activeStep = steps[activeIndex] || null;

    const setActive = (index) => {
      dispatch({ type: STEPPER_ACTIONS.SET_ACTIVE, payload: { index } });
      onStepChange?.(index);
    };

    const next = () => {
      dispatch({ type: STEPPER_ACTIONS.NEXT });
    };

    const prev = () => dispatch({ type: STEPPER_ACTIONS.PREV });

    const setData = (patch) =>
      dispatch({ type: STEPPER_ACTIONS.SET_DATA, payload: { patch } });

    const setTouched = (key, value = true) =>
      dispatch({ type: STEPPER_ACTIONS.SET_TOUCHED, payload: { key, value } });

    const registerStep = (step) =>
      dispatch({ type: STEPPER_ACTIONS.REGISTER_STEP, payload: step });

    const unregisterStep = (id) =>
      dispatch({ type: STEPPER_ACTIONS.UNREGISTER_STEP, payload: { id } });

    const canGoTo = (index) => {
      const s = steps[index];
      return Boolean(s) && !s.disabled;
    };

    return {
      steps,
      activeIndex,
      activeStep,
      data: state.data,
      touched: state.touched,

      setActive,
      next,
      prev,
      setData,
      setTouched,
      registerStep,
      unregisterStep,
      canGoTo,
      dispatch,
    };
  }, [state, onStepChange]);

  return (
    <StepperContext.Provider value={api}>
      <div className={`stepper ${className}`}>{children}</div>
    </StepperContext.Provider>
  );
}

Stepper.List = StepList;
Stepper.Step = Step;
Stepper.Panel = StepPanel;
