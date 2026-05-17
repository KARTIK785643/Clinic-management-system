import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BookAppointment from "./BookAppointment";
import "../styles/navbar.css";

const statusStyle = {
  waiting:   { bg: "#fef3c7", color: "#92400e", label: "WAITING" },
  called:    { bg: "#dbeafe", color: "#1e40af", label: "CALLED IN" },
  completed: { bg: "#dcfce7", color: "#166534", label: "COMPLETED" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "CANCELLED" },
};

const PatientDashboard = ({ onLogout }) => {
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [activePage,    setActivePage]    = useState("dashboard");
  const [appointments,  setAppointments]  = useState([]);
  const [activeToken,   setActiveToken]   = useState(null);
  const [loading,       setLoading]       = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchAppointments();
    fetchActiveToken();
  }, []);

  /* ──────────────────────────────────── Data Fetching ──────── */

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/patients/appointments", { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data.success) {
        // Sort newest first
        const sorted = (data.appointments || []).sort(
          (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        setAppointments(sorted);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const fetchActiveToken = async () => {
    try {
      const res  = await fetch("/api/queue/my-token", { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data.success) setActiveToken(data.token);
      else setActiveToken(null);
    } catch {}
  };

  /* ──────────────────────────────────── Actions ────────────── */

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await fetch("/api/patients/cancel-appointment", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ appointmentId: id }),
      });
      if (res.ok) { fetchAppointments(); fetchActiveToken(); }
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    else window.location.href = "/";
  };

  /* ──────────────────────────────────── Derived data ───────── */

  const upcoming  = appointments.filter((a) => a.status === "waiting" || a.status === "called");
  const history   = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");
  const completed = appointments.filter((a) => a.status === "completed");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  /* ──────────────────────────────────── Card Component ─────── */

  const AppointmentCard = ({ appt, showCancel = false }) => {
    const st = statusStyle[appt.status] || statusStyle.waiting;
    return (
      <div style={c.apptCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={c.apptDoc}>Dr. {appt.docData?.name || "—"}</p>
            <p style={c.apptSpec}>{appt.docData?.speciality || ""}</p>
          </div>
          <span style={{ ...c.badge, background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>

        <div style={c.apptDetails}>
          {[
            { icon: "📅", text: `Date: ${appt.slotDate || "—"}` },
            { icon: "🕐", text: `Time: ${appt.slotTime || "—"}` },
            { icon: "🎫", text: `Token #${appt.tokenNumber ?? "—"}` },
            { icon: "💰", text: `Fee: ₹${appt.amount ?? "—"}` },
          ].map((r) => (
            <span key={r.text} style={c.detailChip}>{r.icon} {r.text}</span>
          ))}
        </div>

        {showCancel && appt.status !== "cancelled" && appt.status !== "completed" && (
          <button onClick={() => handleCancel(appt._id)} style={c.cancelBtn}>
            Cancel Appointment
          </button>
        )}
      </div>
    );
  };

  /* ──────────────────────────────────── Render ─────────────── */

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      <Navbar role="patient" activeItem={activePage} onNavigate={setActivePage} user={user} />

      <div style={{ flex: 1, marginLeft: 240, padding: "20px" }}>

        {/* ── Top Bar ── */}
        <div style={c.topBar}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {activePage === "dashboard"    && "My Dashboard"}
              {activePage === "book"         && "Book Appointment"}
              {activePage === "appointments" && "My Appointments"}
              {activePage === "queue"        && "My Queue Token"}
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
                <p style={{ fontSize: 13, fontWeight: 600, color: "#6366f1", margin: "0 0 4px" }}>Welcome back</p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                  {user.name || "Patient"}
                </h2>
                <p style={{ fontSize: 14, color: "#475569", fontWeight: 600, margin: 0 }}>
                  You have <strong style={{ color: "#f59e0b" }}>{upcoming.length}</strong> upcoming appointment{upcoming.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button onClick={() => setActivePage("book")} style={c.bookBtn}>
                + Book Appointment
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {[
                { label: "Total",     value: appointments.length,       color: "#6366f1" },
                { label: "Upcoming",  value: upcoming.length,           color: "#f59e0b" },
                { label: "Completed", value: completed.length,          color: "#10b981" },
                { label: "Token",     value: activeToken ? `#${activeToken.tokenNumber}` : "—", color: "#06b6d4" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, borderLeft: `4px solid ${s.color}` }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: "#020617", margin: "0 0 4px" }}>{s.value}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent upcoming appointments (up to 3) */}
            {upcoming.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: 0 }}>Upcoming Appointments</p>
                  <span style={{ fontSize: 13, color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setActivePage("appointments")}>
                    View all →
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                  {upcoming.slice(0, 3).map((a) => <AppointmentCard key={a._id} appt={a} showCancel={true} />)}
                </div>
              </div>
            )}

            {loading && <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading appointments...</p>}
          </div>
        )}

        {/* ────────────────── BOOK ────────────────── */}
        {activePage === "book" && (
          <BookAppointment
            onBack={() => setActivePage("dashboard")}
            onBooked={() => { fetchAppointments(); fetchActiveToken(); setActivePage("appointments"); }}
          />
        )}

        {/* ────────────────── APPOINTMENTS ────────────────── */}
        {activePage === "appointments" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>My Appointments</h2>
              <button onClick={() => setActivePage("book")} style={c.bookBtn}>+ Book New</button>
            </div>

            {loading && <p style={{ color: "#94a3b8" }}>Loading...</p>}

            {!loading && appointments.length === 0 && (
              <div style={c.emptyState}>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>📋</p>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No appointments yet.</p>
                <button onClick={() => setActivePage("book")} style={{ ...c.bookBtn, marginTop: 12 }}>Book Your First Appointment</button>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={c.sectionTitle}>Upcoming ({upcoming.length})</p>
                <div style={c.grid}>
                  {upcoming.map((a) => <AppointmentCard key={a._id} appt={a} showCancel={true} />)}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div>
                <p style={c.sectionTitle}>Past Visits ({history.length})</p>
                <div style={c.grid}>
                  {history.map((a) => <AppointmentCard key={a._id} appt={a} showCancel={false} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ────────────────── QUEUE ────────────────── */}
        {activePage === "queue" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>My Queue Token</h2>
            <div style={{ maxWidth: 360, margin: "0 auto" }}>
              {activeToken ? (
                <div style={c.tokenCard}>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 4px", fontWeight: 600 }}>Your Token Number</p>
                  <div style={c.tokenNumber}>#{activeToken.tokenNumber}</div>

                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Doctor",  val: `Dr. ${activeToken.docData?.name || "—"}` },
                      { label: "Date",    val: activeToken.slotDate || "—" },
                      { label: "Time",    val: activeToken.slotTime || "—" },
                      { label: "Status",  val: (activeToken.status || "").toUpperCase() },
                    ].map((r) => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>{r.label}</span>
                        <span style={{ color: "#0f172a", fontSize: 13, fontWeight: 700 }}>{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => { fetchActiveToken(); fetchAppointments(); }}
                    style={{ ...c.bookBtn, marginTop: 20, width: "100%" }}>
                    ↻ Refresh Status
                  </button>
                </div>
              ) : (
                <div style={c.emptyState}>
                  <p style={{ fontSize: 48, margin: "0 0 8px" }}>🎫</p>
                  <p style={{ color: "#64748b", fontWeight: 600 }}>No active token right now.</p>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>Book an appointment to get a queue token.</p>
                  <button onClick={() => setActivePage("book")} style={{ ...c.bookBtn, marginTop: 12 }}>Book Appointment</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────── HISTORY ────────────────── */}
        {activePage === "history" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>Visit History</h2>
            {history.length === 0 ? (
              <div style={c.emptyState}>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>🗂️</p>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No past visits yet.</p>
              </div>
            ) : (
              <div style={c.grid}>
                {history.map((a) => <AppointmentCard key={a._id} appt={a} showCancel={false} />)}
              </div>
            )}
          </div>
        )}

        {/* ────────────────── PROFILE ────────────────── */}
        {activePage === "profile" && (
          <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e5e7eb", maxWidth: 500 }}>
            <h2 style={{ marginTop: 0 }}>My Profile</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Full Name", val: user.name || "—" },
                { label: "Email",     val: user.email || "—" },
                { label: "Role",      val: "Patient" },
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
    height: 60,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    marginBottom: 16,
  },
  iconBtn: {
    width: 34, height: 34,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoutBtn: {
    padding: "0 14px", height: 34,
    borderRadius: 8, border: "none",
    background: "#ef4444", color: "#fff",
    cursor: "pointer", fontWeight: "bold", fontSize: 13,
  },
  hero: {
    background: "linear-gradient(135deg,#eef2ff,#f0f9ff)",
    border: "1px solid #c7d2fe",
    borderRadius: 16, padding: 24,
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  bookBtn: {
    padding: "10px 18px",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff", border: "none",
    borderRadius: 8, cursor: "pointer",
    fontWeight: 700, fontSize: 13,
  },
  apptCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12, padding: 16,
    display: "flex", flexDirection: "column", gap: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  apptDoc: {
    fontWeight: 700, fontSize: 15,
    color: "#0f172a", margin: 0,
  },
  apptSpec: {
    fontSize: 13, color: "#64748b",
    margin: "2px 0 0", fontWeight: 500,
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20, fontSize: 11,
    fontWeight: 700, whiteSpace: "nowrap",
  },
  apptDetails: {
    display: "flex", flexWrap: "wrap", gap: 6,
  },
  detailChip: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 12, color: "#475569", fontWeight: 500,
  },
  cancelBtn: {
    padding: "7px 14px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 6, cursor: "pointer",
    fontWeight: 600, fontSize: 13,
    alignSelf: "flex-start",
  },
  tokenCard: {
    background: "#fff",
    border: "2px solid #06b6d4",
    borderRadius: 16, padding: 28,
    textAlign: "center",
  },
  tokenNumber: {
    fontSize: 56, fontWeight: 900,
    color: "#0891b2", lineHeight: 1, margin: "4px 0 8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 14,
  },
  sectionTitle: {
    fontWeight: 700, fontSize: 14,
    color: "#374151", margin: "0 0 10px",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
};

export default PatientDashboard;