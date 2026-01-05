import { useContext, useMemo } from "react";
import { BoardContext } from "../state/BoardContext";
import { ACTIONS, STATUSES } from "../state/boardReducer";
import { uid } from "../lib/uid";

const REPORT_URL = "/reports/sample-report.pdf";

export function useProjectManager() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useProjectManager must be used inside BoardProvider");

  const { state, dispatch } = ctx;
  const project = state.projects[0];
  const tasks = project.tasks;

  const byStatus = useMemo(() => {
    const out = {
      [STATUSES.ACTIVE]: [],
      [STATUSES.COMPLETED]: [],
      [STATUSES.FAILED]: [],
    };
    for (const t of tasks) out[t.status].push(t);
    return out;
  }, [tasks]);

  const addTask = (input) => {
    const task = {
      id: uid("scan"),
      title: input.title,
      scanType: input.scanType,
      sourceType: input.sourceType,
      sourceValue: input.sourceValue,
      status: STATUSES.ACTIVE,
      progress: 0,
      createdAt: Date.now(),
      reportUrl: null,
    };
    dispatch({ type: ACTIONS.ADD_TASK, payload: task });
  };

  const deleteTask = (id) => dispatch({ type: ACTIONS.DELETE_TASK, payload: { id } });

  const moveTask = (id, status) =>
    dispatch({ type: ACTIONS.MOVE_TASK, payload: { id, status } });

  const tickProgress = (id, delta) =>
    dispatch({ type: ACTIONS.TICK_PROGRESS, payload: { id, delta } });

  const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const completeTask = (id) => {
  const findings = {
    critical: rand(0, 2), 
    medium: rand(1, 6),
    low: rand(3, 12),
  };

  dispatch({
    type: ACTIONS.COMPLETE_TASK,
    payload: { id, reportUrl: REPORT_URL, findings },
  });
};


  const failTask = (id) =>
    dispatch({ type: ACTIONS.FAIL_TASK, payload: { id } });

  return { state, tasks, byStatus, addTask, deleteTask, moveTask, tickProgress, completeTask, failTask };
}
