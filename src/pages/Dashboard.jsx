import React, { useMemo } from "react";
import { Column } from "../components/Column";
import { Task } from "../components/Task";
import { useProjectManager } from "../hooks/useProjectManager";
import { useScanEngine } from "../hooks/useScanEngine";
import { STATUSES } from "../state/boardReducer";

export default function Dashboard() {
  const pm = useProjectManager();

  useScanEngine({
    tasks: pm.tasks,
    tickProgress: pm.tickProgress,
    completeTask: pm.completeTask,
    failTask: pm.failTask,
  });

  const active = pm.byStatus[STATUSES.ACTIVE];
  const completed = pm.byStatus[STATUSES.COMPLETED];
  const failed = pm.byStatus[STATUSES.FAILED];

  const cards = useMemo(
    () => ({
      [STATUSES.ACTIVE]: active,
      [STATUSES.COMPLETED]: completed,
      [STATUSES.FAILED]: failed,
    }),
    [active, completed, failed]
  );

  return (
    <main className="board" id="board">
      <Column title="Active Scans" count={active.length} emptyText="No active scans">
        {cards[STATUSES.ACTIVE].map((t) => (
          <Task key={t.id} task={t} onDelete={pm.deleteTask} onMove={pm.moveTask} />
        ))}
      </Column>

      <Column title="Completed Scans" count={completed.length} emptyText="No completed scans">
        {cards[STATUSES.COMPLETED].map((t) => (
          <Task key={t.id} task={t} onDelete={pm.deleteTask} onMove={pm.moveTask} />
        ))}
      </Column>

      <Column title="Failed Scans" count={failed.length} emptyText="No failed scans">
        {cards[STATUSES.FAILED].map((t) => (
          <Task key={t.id} task={t} onDelete={pm.deleteTask} onMove={pm.moveTask} />
        ))}
      </Column>
    </main>
  );
}
