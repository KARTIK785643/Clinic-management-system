import React, { useState } from "react";

import LandingPage      from "./pages/LandingPage";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard  from "./pages/DoctorDashboard";
import AdminDashboard   from "./pages/AdminDashboard";

const App = () => {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  /* ── Role routing ── */
  const getDashboardPage = (role) => {
    if (role === "doctor") return "doctor";
    if (role === "admin")  return "admin";
    return "patient";
  };

  /* ── Login success ── */
  const handleLoginSuccess = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setPage(getDashboardPage(u.role));
  };

  /* ── Logout → back to landing ── */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("landing");
  };

  /* ── Routes ── */
  if (page === "patient")  return <PatientDashboard onLogout={handleLogout} />;
  if (page === "doctor")   return <DoctorDashboard  onLogout={handleLogout} />;
  if (page === "admin")    return <AdminDashboard    onLogout={handleLogout} />;

  if (page === "register") {
    return <Register onNavigateLogin={() => setPage("login")} />;
  }

  if (page === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setPage("register")}
      />
    );
  }

  /* ── Default → Landing ── */
  return <LandingPage onNavigateLogin={() => setPage("login")} />;
};

export default App;