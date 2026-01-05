import React, { useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Sidebar } from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { ScanDialog } from "../components/ScanDialog";
import Dashboard from "../pages/Dashboard";
import Sast from "../pages/Sast";
import Dast from "../pages/Dast";
import { useProjectManager } from "../hooks/useProjectManager";

export default function App() {
  const pm = useProjectManager();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <TopBar
          onStart={() => setDialogOpen(true)}
          onGo={(path) => setLocation(path)}
        />

        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/sast" component={Sast} />
          <Route path="/dast" component={Dast} />
          <Route>
            <Dashboard />
          </Route>
        </Switch>

        <ScanDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={(taskInput) => pm.addTask(taskInput)}
        />
      </div>
    </div>
  );
}
