import React, { useState } from "react";
import "../styles/navbar.css";

const NAV_CONFIG = {
  patient: [
    {
      section: "Main",
      items: [
        { id: "dashboard", label: "Dashboard",      icon: "⊞",  badge: null },
        { id: "book",      label: "Book Appointment",icon: "📅", badge: null },
        { id: "appointments", label: "My Appointments", icon: "🗒️", badge: null },
        { id: "queue",     label: "My Queue Token",  icon: "🎫", badge: null },
      ],
    },
    {
      section: "Account",
      items: [
        { id: "history",  label: "Visit History",  icon: "📋", badge: null },
        { id: "profile",  label: "Profile",        icon: "👤", badge: null },
      ],
    },
  ],
  doctor: [
    {
      section: "Main",
      items: [
        { id: "dashboard",    label: "Dashboard",       icon: "⊞",  badge: null },
        { id: "appointments", label: "Today's Schedule", icon: "📅", badge: null},
        { id: "queue",        label: "Queue Management", icon: "🔢", badge: null },
        { id: "patients",     label: "My Patients",     icon: "👥", badge: null },
      ],
    },
    {
      section: "Account",
      items: [
        { id: "history", label: "Visit History",   icon: "📋", badge: null },
        { id: "profile", label: "Profile",         icon: "👤", badge: null },
      ],
    },
  ],
  admin: [
    {
      section: "Overview",
      items: [
        { id: "dashboard",    label: "Dashboard",      icon: "⊞",  badge: null },
        { id: "reports",      label: "Reports",        icon: "📊", badge: null },
      ],
    },
    {
      section: "Manage",
      items: [
        { id: "doctors",      label: "Doctors",        icon: "🩺", badge: null },
        { id: "patients",     label: "Patients",       icon: "👥", badge: null },
        { id: "appointments", label: "Appointments",   icon: "📅", badge: "12" },
        { id: "queue",        label: "Queue Overview", icon: "🔢", badge: null },
      ],
    },
    {
      section: "Settings",
      items: [
        { id: "settings", label: "System Settings", icon: "⚙️", badge: null },
      ],
    },
  ],
};

const ROLE_LABELS = {
  patient: "Patient Portal",
  doctor:  "Doctor Portal",
  admin:   "Admin Console",
};

const Navbar = ({ role = "patient", activeItem, onNavigate, user }) => {
  const [open, setOpen] = useState(false);
  const navSections = NAV_CONFIG[role] || NAV_CONFIG.patient;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CS";

  const handleNav = (id) => {
    onNavigate?.(id);
    setOpen(false);
  };


  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">🏥</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="brand-name">SmartClinic</span>
            </div>
          </div>
          <p className="brand-tagline">Smart Clinic Management</p>
        </div>

        {/* Role pill */}
        <div className="role-pill">
          <span className="role-dot" />
          <span>{ROLE_LABELS[role]}</span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {navSections.map((section) => (
            <div key={section.section}>
              <p className="nav-section-label">{section.section}</p>
              <ul className="nav-list">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item ${activeItem === item.id ? "active" : ""}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer user card */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-role-text">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>
    
        </div>
      </aside>
    </>
  );
};

export default Navbar;
