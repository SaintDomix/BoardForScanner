export const STATUSES = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export const ACTIONS = {
  ADD_TASK: "ADD_TASK",
  DELETE_TASK: "DELETE_TASK",
  MOVE_TASK: "MOVE_TASK",
  TICK_PROGRESS: "TICK_PROGRESS",
  COMPLETE_TASK: "COMPLETE_TASK",
  FAIL_TASK: "FAIL_TASK",
};

export const initialState = {
  projects: [
    {
      id: "p1",
      name: "RepoScan",
      tasks: [],
    },
  ],
};

function updateProject(state, projectId, updater) {
  return {
    ...state,
    projects: state.projects.map((p) => (p.id === projectId ? updater(p) : p)),
  };
}

export function boardReducer(state, action) {
  const pid = "p1";

  switch (action.type) {
    case ACTIONS.ADD_TASK: {
      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: [action.payload, ...p.tasks],
      }));
    }

    case ACTIONS.DELETE_TASK: {
      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: p.tasks.filter((t) => t.id !== action.payload.id),
      }));
    }

    case ACTIONS.MOVE_TASK: {
      const { id, status } = action.payload;
      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: p.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
    }

    case ACTIONS.TICK_PROGRESS: {
      const { id, delta } = action.payload;
      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: p.tasks.map((t) => {
          if (t.id !== id) return t;
          if (t.status !== STATUSES.ACTIVE) return t;

          const next = Math.min(100, (t.progress || 0) + delta);
          return { ...t, progress: next };
        }),
      }));
    }

    case ACTIONS.COMPLETE_TASK: {
        const { id, reportUrl, findings } = action.payload;

      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: p.tasks.map((t) =>
          t.id === id
            ? { ...t, status: STATUSES.COMPLETED, progress: 100, reportUrl, findings }
            : t
        ),
      }));
    }

    case ACTIONS.FAIL_TASK: {
      const { id } = action.payload;
      return updateProject(state, pid, (p) => ({
        ...p,
        tasks: p.tasks.map((t) =>
          t.id === id ? { ...t, status: STATUSES.FAILED } : t
        ),
      }));
    }

    default:
      return state;
  }
}
