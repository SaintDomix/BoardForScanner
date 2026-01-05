import React from "react";
import { Link, useLocation } from "wouter";

function NavItem({ to, children }) {
  const [loc] = useLocation();
  const active = loc === to;
  return (
    <Link href={to} className={`nav__item ${active ? "nav__item--active" : ""}`}>
      {children}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__icon">🛡️</div>
        <div>
          <div className="brand__name">RepoScan</div>
          <div className="brand__sub">Security Scan Platform</div>
        </div>
      </div>

      <nav className="nav">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/sast">SAST</NavItem>
        <NavItem to="/dast">DAST</NavItem>
      </nav>

      <div className="sidebar__foot">
        Assignment 1 - Alikhan Damira
      </div>
    </aside>
  );
}
