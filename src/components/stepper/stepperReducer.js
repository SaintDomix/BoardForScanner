export const STEPPER_ACTIONS = {
  REGISTER_STEP: "REGISTER_STEP",
  UNREGISTER_STEP: "UNREGISTER_STEP",
  SET_ACTIVE: "SET_ACTIVE",
  NEXT: "NEXT",
  PREV: "PREV",
  SET_DATA: "SET_DATA",
  SET_TOUCHED: "SET_TOUCHED",
};

export const initialStepperState = {
  steps: [], 
  activeIndex: 0,
  data: {},
  touched: {},
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function nextEnabledIndex(steps, from, dir) {
  const n = steps.length;
  if (!n) return 0;

  let i = clamp(from, 0, n - 1);
  for (let k = 0; k < n; k++) {
    i = i + dir;
    if (i < 0) i = n - 1;
    if (i >= n) i = 0;
    if (!steps[i]?.disabled) return i;
  }
  return clamp(from, 0, n - 1);
}

export function stepperReducer(state, action) {
  switch (action.type) {
    case STEPPER_ACTIONS.REGISTER_STEP: {
      const step = action.payload;
      const exists = state.steps.some((s) => s.id === step.id);
      if (exists) return state;

      const steps = [...state.steps, step];

      let activeIndex = state.activeIndex;
      if (steps[activeIndex]?.disabled) {
        activeIndex = steps.findIndex((s) => !s.disabled);
        if (activeIndex === -1) activeIndex = 0;
      }

      return { ...state, steps, activeIndex };
    }

    case STEPPER_ACTIONS.UNREGISTER_STEP: {
      const { id } = action.payload;
      const steps = state.steps.filter((s) => s.id !== id);
      const activeIndex = clamp(state.activeIndex, 0, Math.max(0, steps.length - 1));
      return { ...state, steps, activeIndex };
    }

    case STEPPER_ACTIONS.SET_ACTIVE: {
      const { index } = action.payload;
      if (!state.steps.length) return state;

      const i = clamp(index, 0, state.steps.length - 1);
      if (state.steps[i]?.disabled) return state;

      return { ...state, activeIndex: i };
    }

    case STEPPER_ACTIONS.NEXT: {
      if (!state.steps.length) return state;
      const next = nextEnabledIndex(state.steps, state.activeIndex, +1);
      return { ...state, activeIndex: next };
    }

    case STEPPER_ACTIONS.PREV: {
      if (!state.steps.length) return state;
      const prev = nextEnabledIndex(state.steps, state.activeIndex, -1);
      return { ...state, activeIndex: prev };
    }

    case STEPPER_ACTIONS.SET_DATA: {
      const { patch } = action.payload;
      return { ...state, data: { ...state.data, ...patch } };
    }

    case STEPPER_ACTIONS.SET_TOUCHED: {
      const { key, value } = action.payload;
      return { ...state, touched: { ...state.touched, [key]: value } };
    }

    default:
      return state;
  }
}
