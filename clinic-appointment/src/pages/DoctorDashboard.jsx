import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/navbar.css";

const statusStyle = {
  waiting:   { bg: "#fef3c7", color: "#92400e", label: "WAITING" },
  called:    { bg: "#dbeafe", color: "#1e40af", label: "IN PROGRESS" },
  completed: { bg: "#dcfce7", color: "#166534", label: "COMPLETED" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "CANCELLED" },
};

const DoctorDashboard = ({ onLogout }) => {
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [activePage,    setActivePage]    = useState("dashboard");
  const [appointments,  setAppointments]  = useState([]);
  const [loading,       setLoading]       = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ──────────────────────────────────── Data Fetching ──────── */

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/doctors/appointments", { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data.success) {
        // Sort by token number ascending (queue order)
        const sorted = (data.appointments || []).sort(
          (a, b) => (a.tokenNumber ?? 999) - (b.tokenNumber ?? 999)
        );
        setAppointments(sorted);
      }
    } catch {}
    finally { setLoading(false); }
  };

  /* ──────────────────────────────────── Actions ────────────── */

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch("/api/doctors/update-status", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ appointmentId: id, status: newStatus }),
      });
      if (res.ok) fetchAppointments();
    } catch {}
  };

  const handleCallNext = async () => {
    try {
      const res = await fetch("/api/queue/call-next", {
        method: "POST",
        headers: authHeaders,
      });
      if (res.ok) fetchAppointments();
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    else window.location.href = "/";
  };

  /* ──────────────────────────────────── Derived data ───────── */

  const waiting   = appointments.filter((a) => a.status === "waiting");
  const inProgress = appointments.filter((a) => a.status === "called");
  const completed = appointments.filter((a) => a.status === "completed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  /* ──────────────────────────────────── Card Component ─────── */

  const ApptCard = ({ appt }) => {
    const st = statusStyle[appt.status] || statusStyle.waiting;
    return (
      <div style={c.apptCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={c.patientName}>
              Token #{appt.tokenNumber ?? "—"} · {appt.patientData?.name || "Patient"}
            </p>
            <p style={c.sub}>{appt.patientData?.gender || ""} · {appt.patientData?.phone || ""}</p>
          </div>
          <span style={{ ...c.badge, background: st.bg, color: st.color }}>{st.label}</span>
        </div>

        <div style={c.chips}>
          {[
            { icon: "📅", text: appt.slotDate || "—" },
            { icon: "🕐", text: appt.slotTime || "—" },
            { icon: "💰", text: `₹${appt.amount ?? "—"}` },
          ].map((r) => (
            <span key={r.text} style={c.chip}>{r.icon} {r.text}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {appt.status === "waiting" && (
            <button
              onClick={() => handleStatusChange(appt._id, "called")}
              style={c.callBtn}
            >
              📣 Call Patient
            </button>
          )}
          {appt.status === "called" && (
            <button
              onClick={() => handleStatusChange(appt._id, "completed")}
              style={c.doneBtn}
            >
              ✓ Mark Completed
            </button>
          )}
        </div>
      </div>
    );
  };

  /* ──────────────────────────────────── Render ─────────────── */

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      <Navbar role="doctor" activeItem={activePage} onNavigate={setActivePage} user={user} />

      <div style={{ flex: 1, marginLeft: 240, padding: "20px" }}>

        {/* ── Top Bar ── */}
        <div style={c.topBar}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {activePage === "dashboard"    && "Doctor Dashboard"}
              {activePage === "appointments" && "Today's Schedule"}
              {activePage === "queue"        && "Queue Management"}
              {activePage === "patients"     && "My Patients"}
              {activePage === "history"      && "Visit History"}
              {activePage === "profile"      && "My Profile"}
            </p>
            <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600, margin: "2px 0 0" }}>{today}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchAppointments} title="Refresh" style={c.iconBtn}>↻</button>
            <button onClick={handleLogout} style={c.logoutBtn}>Logout</button>
          </div>
        </div>

        {/* ────────────────── DASHBOARD ────────────────── */}
        {activePage === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Hero */}
            <div style={c.hero}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#10b981", margin: "0 0 4px" }}>On Duty</p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                  Dr. {user.name || "Doctor"}
                </h2>
                <p style={{ fontSize: 14, color: "#475569", fontWeight: 600, margin: 0 }}>
                  {user.speciality || "General OPD"} ·{" "}
                  <strong style={{ color: "#f59e0b" }}>{appointments.length}</strong> appointments today
                </p>
              </div>
              {waiting.length > 0 && (
                <button onClick={handleCallNext} style={c.callNextBtn}>
                  📣 Call Next Patient
                </button>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {[
                { label: "Total Today",  value: appointments.length, color: "#6366f1" },
                { label: "Waiting",      value: waiting.length,      color: "#f59e0b" },
                { label: "In Progress",  value: inProgress.length,   color: "#06b6d4" },
                { label: "Completed",    value: completed.length,    color: "#10b981" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, borderLeft: `4px solid ${s.color}` }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: "#020617", margin: "0 0 4px" }}>{s.value}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Currently In Progress */}
            {inProgress.length > 0 && (
              <div style={{ background: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 12, padding: 18 }}>
                <p style={{ fontWeight: 700, color: "#0f766e", margin: "0 0 12px", fontSize: 14 }}>
                  🩺 Currently Seeing
                </p>
                {inProgress.map((a) => <ApptCard key={a._id} appt={a} />)}
              </div>
            )}

            {/* Waiting Queue Preview */}
            {waiting.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: 0 }}>
                    Waiting Queue ({waiting.length})
                  </p>
                  <span style={{ fontSize: 13, color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setActivePage("appointments")}>
                    View all →
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {waiting.slice(0, 3).map((a) => <ApptCard key={a._id} appt={a} />)}
                </div>
              </div>
            )}

            {loading && <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading...</p>}
            {!loading && appointments.length === 0 && (
              <div style={c.emptyState}>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>📋</p>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No appointments scheduled for today.</p>
              </div>
            )}
          </div>
        )}

        {/* ────────────────── APPOINTMENTS ────────────────── */}
        {activePage === "appointments" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>Today's Schedule</h2>
            {loading && <p style={{ color: "#94a3b8" }}>Loading...</p>}
            {!loading && appointments.length === 0 && (
              <div style={c.emptyState}>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>📋</p>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No appointments for today.</p>
              </div>
            )}

            {/* Waiting */}
            {waiting.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={c.sectionTitle}>Waiting ({waiting.length})</p>
                <div style={c.grid}>{waiting.map((a) => <ApptCard key={a._id} appt={a} />)}</div>
              </div>
            )}

            {/* In Progress */}
            {inProgress.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={c.sectionTitle}>In Progress ({inProgress.length})</p>
                <div style={c.grid}>{inProgress.map((a) => <ApptCard key={a._id} appt={a} />)}</div>
              </div>
            )}

            {/* Completed today */}
            {completed.length > 0 && (
              <div>
                <p style={c.sectionTitle}>Completed ({completed.length})</p>
                <div style={c.grid}>{completed.map((a) => <ApptCard key={a._id} appt={a} />)}</div>
              </div>
            )}
          </div>
        )}

        {/* ────────────────── QUEUE ────────────────── */}
        {activePage === "queue" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>Queue Management</h2>
            <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e5e7eb", maxWidth: 600 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>Current Queue Status</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                    Waiting: <strong>{waiting.length}</strong> · In Progress: <strong>{inProgress.length}</strong>
                  </p>
                </div>
                <button
                  onClick={handleCallNext}
                  disabled={waiting.length === 0}
                  style={{
                    ...c.callNextBtn,
                    opacity: waiting.length === 0 ? 0.5 : 1,
                    cursor: waiting.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  📣 Call Next
                </button>
              </div>

              {inProgress.length > 0 && (
                <div style={{ background: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontWeight: 700, color: "#0f766e", margin: "0 0 10px", fontSize: 14 }}>Currently Seeing</p>
                  {inProgress.map((a) => (
                    <div key={a._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>
                        Token #{a.tokenNumber} — {a.patientData?.name || "Patient"}
                      </span>
                      <button onClick={() => handleStatusChange(a._id, "completed")}
                        style={c.doneBtn}>
                        ✓ Complete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {waiting.length > 0 && (
                <div>
                  <p style={{ fontWeight: 700, color: "#374151", margin: "0 0 10px", fontSize: 14 }}>Waiting Queue</p>
                  {waiting.map((a, i) => (
                    <div key={a._id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0", borderBottom: i < waiting.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}>
                      <div>
                        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                          #{a.tokenNumber}
                        </span>
                        <span style={{ color: "#475569", fontSize: 14, marginLeft: 8 }}>
                          {a.patientData?.name || "Patient"}
                        </span>
                        <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: 8 }}>
                          {a.slotTime}
                        </span>
                      </div>
                      <button onClick={() => handleStatusChange(a._id, "called")} style={c.callBtn}>
                        Call
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {waiting.length === 0 && inProgress.length === 0 && (
                <div style={c.emptyState}>
                  <p style={{ fontSize: 40, margin: "0 0 8px" }}>✅</p>
                  <p style={{ color: "#64748b", fontWeight: 600 }}>Queue is empty!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────── PATIENTS ────────────────── */}
        {activePage === "patients" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>My Patients Today</h2>
            {appointments.length === 0 ? (
              <div style={c.emptyState}>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No patients today.</p>
              </div>
            ) : (
              <div style={c.grid}>
                {appointments.map((a) => (
                  <div key={a._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                    <p style={c.patientName}>{a.patientData?.name || "Unknown Patient"}</p>
                    <p style={c.sub}>
                      {a.patientData?.gender || "—"} · {a.patientData?.phone || "—"}
                    </p>
                    <div style={c.chips}>
                      <span style={c.chip}>🎫 Token #{a.tokenNumber}</span>
                      <span style={c.chip}>🕐 {a.slotTime}</span>
                      <span style={{ ...c.badge, background: (statusStyle[a.status] || statusStyle.waiting).bg, color: (statusStyle[a.status] || statusStyle.waiting).color }}>
                        {(statusStyle[a.status] || statusStyle.waiting).label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────────────────── HISTORY ────────────────── */}
        {activePage === "history" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>Visit History</h2>
            {completed.length === 0 ? (
              <div style={c.emptyState}>
                <p style={{ fontSize: 40, margin: "0 0 8px" }}>🗂️</p>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No completed visits yet.</p>
              </div>
            ) : (
              <div style={c.grid}>{completed.map((a) => <ApptCard key={a._id} appt={a} />)}</div>
            )}
          </div>
        )}

        {/* ────────────────── PROFILE ────────────────── */}
        {activePage === "profile" && (
          <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e5e7eb", maxWidth: 500 }}>
            <h2 style={{ marginTop: 0 }}>My Profile</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Full Name",  val: `Dr. ${user.name || "—"}` },
                { label: "Email",      val: user.email || "—" },
                { label: "Speciality", val: user.speciality || "General physician" },
                { label: "Role",       val: "Doctor" },
              ].map((r) => (
                <div key={r.label}>
                  <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{r.label}</label>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginTop: 2 }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ─── Component Styles ─── */
const c = {
  topBar: {
    height: 60, background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 10, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 18px", marginBottom: 16,
  },
  iconBtn: {
    width: 34, height: 34, borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#f8fafc", cursor: "pointer", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoutBtn: {
    padding: "0 14px", height: 34, borderRadius: 8, border: "none",
    background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 13,
  },
  hero: {
    background: "linear-gradient(135deg,#ecfdf5,#f0f9ff)",
    border: "1px solid #bbf7d0", borderRadius: 16, padding: 24,
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  callNextBtn: {
    padding: "10px 18px", background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff", border: "none", borderRadius: 8,
    fontWeight: 700, fontSize: 13, cursor: "pointer",
  },
  apptCard: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16,
    display: "flex", flexDirection: "column", gap: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  patientName: { fontWeight: 700, fontSize: 15, color: "#0f172a", margin: 0 },
  sub: { fontSize: 13, color: "#64748b", margin: "2px 0 0", fontWeight: 500 },
  badge: {
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    background: "#f8fafc", border: "1px solid #e5e7eb",
    borderRadius: 6, padding: "4px 8px", fontSize: 12, color: "#475569", fontWeight: 500,
  },
  callBtn: {
    padding: "7px 14px", background: "#dbeafe", color: "#1e40af",
    border: "1px solid #bfdbfe", borderRadius: 6,
    cursor: "pointer", fontWeight: 600, fontSize: 13,
  },
  doneBtn: {
    padding: "7px 14px", background: "#dcfce7", color: "#166534",
    border: "1px solid #bbf7d0", borderRadius: 6,
    cursor: "pointer", fontWeight: 600, fontSize: 13,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 },
  sectionTitle: { fontWeight: 700, fontSize: 13, color: "#374151", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" },
  emptyState: { textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" },
};

export default DoctorDashboard;