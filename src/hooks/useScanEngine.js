import { useEffect, useRef } from "react";
import { STATUSES } from "../state/boardReducer";

export function useScanEngine({ tasks, tickProgress, completeTask, failTask }) {
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const runningRef = useRef(false);

  useEffect(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    const timer = setInterval(() => {
      const list = tasksRef.current.filter((t) => t.status === STATUSES.ACTIVE);

      for (const t of list) {
        const delta = 3 + Math.floor(Math.random() * 7); // 3..9
        tickProgress(t.id, delta);

        const next = Math.min(100, (t.progress || 0) + delta);

        if (next >= 100) {
          const failChance = t.scanType === "DAST" ? 0.12 : 0.06;
          if (Math.random() < failChance) failTask(t.id);
          else completeTask(t.id);
        }
      }
    }, 650);

    return () => {
      clearInterval(timer);
      runningRef.current = false;
    };
  }, [tickProgress, completeTask, failTask]);
}
