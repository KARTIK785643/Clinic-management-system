import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AppointmentCard from "../components/AppointmentCard";
import AddDoctor from "../components/AddDoctor";
import "../styles/navbar.css";

const AdminDashboard = ({ onLogout }) => {
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [activePage, setActivePage]     = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [patients, setPatients]         = useState([]);
  const [stats, setStats]               = useState({});
  const [loading, setLoading]           = useState(false);
  const [editDoctor, setEditDoctor]     = useState(null);
  const [editForm, setEditForm]         = useState({});

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, docRes, patRes, statsRes] = await Promise.all([
        fetch("/api/admin/appointments",  { headers: authHeaders }),
        fetch("/api/admin/doctors",       { headers: authHeaders }),
        fetch("/api/admin/patients",      { headers: authHeaders }),
        fetch("/api/admin/stats",         { headers: authHeaders }),
      ]);
      const [apptData, docData, patData, statsData] = await Promise.all([
        apptRes.json(), docRes.json(), patRes.json(), statsRes.json(),
      ]);
      setAppointments(apptData.appointments || []);
      setDoctors(docData.doctors || []);
      setPatients(patData.patients || []);
      setStats(statsData.stats || {});
    } catch {} finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/doctors/update-status`, { // Assuming admins can use doctor's status update or we just let it fail
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ appointmentId: id, status: newStatus }),
      });
      if (res.ok) fetchAll();
    } catch {}
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await fetch(`/api/admin/cancel-appointment`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ appointmentId: id })
      });
      if (res.ok) fetchAll();
    } catch {}
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Remove this doctor?")) return;
    try {
      const res = await fetch(`/api/admin/doctor/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (res.ok) fetchAll();
    } catch {}
  };

  const openEditDoctor = (doc) => {
    setEditDoctor(doc);
    setEditForm({
      name: doc.name || "", phone: doc.phone || "", gender: doc.gender || "",
      speciality: doc.speciality || "", degree: doc.degree || "",
      experience: doc.experience || "", about: doc.about || "",
      fees: doc.fees || 0, available: doc.available !== false,
      addressLine1: doc.address?.line1 || "", addressLine2: doc.address?.line2 || "",
    });
  };

  const handleUpdateDoctor = async () => {
    try {
      const res = await fetch(`/api/admin/doctor/${editDoctor._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          ...editForm,
          fees: Number(editForm.fees),
          address: { line1: editForm.addressLine1, line2: editForm.addressLine2 },
        }),
      });
      const data = await res.json();
      if (data.success) { setEditDoctor(null); fetchAll(); }
      else alert(data.message || "Update failed");
    } catch { alert("Network error"); }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const todayAppts = appointments.filter((a) => {
    const d = new Date(a.date);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  });

 return (
  <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
    
    <Navbar
      role="admin"
      activeItem={activePage}
      onNavigate={setActivePage}
      user={user}
    />

    <div style={{ flex: 1, marginLeft: 240, padding: "20px" }}>
      
      {/* Topbar */}
      <div style={{
        height: 60,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        marginBottom: 16
      }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.3px" }}>
            {activePage === "dashboard" && "Admin Dashboard"}
          </p>
          <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            {today}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f8fafc",
            cursor: "pointer"
          }}>
            <span style={{
              width: 6,
              height: 6,
              background: "red",
              borderRadius: "50%",
              display: "inline-block"
            }} />
          </button>

          <button
            onClick={fetchAll}
            title="Refresh Data"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f8fafc",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ↻
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              if (onLogout) onLogout();
              else window.location.href = "/";
            }}
            style={{
              padding: "0 14px",
              height: 34,
              borderRadius: 8,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 13
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Conditional Views */}
      {activePage === "dashboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Hero Card */}
          <div style={{
            background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)",
            border: "1px solid #bae6fd",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>
                Admin Console
              </p>

              <h2 style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                margin: "6px 0"
              }}>
                {user.name || "Administrator"}
              </h2>

              <p style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>
                <strong style={{ color: "#2563eb" }}>{todayAppts.length}</strong> appointments ·{" "}
                <strong style={{ color: "#06b6d4" }}>{doctors.length}</strong> doctors ·{" "}
                <strong style={{ color: "#10b981" }}>{patients.length}</strong> patients
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14
          }}>
            {[
              { label: "Total Appointments", value: appointments.length, color: "#6366f1" },
              { label: "Doctors", value: doctors.length, color: "#06b6d4" },
              { label: "Patients", value: patients.length, color: "#10b981" },
              { label: "Today", value: todayAppts.length, color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 18,
                borderLeft: `4px solid ${s.color}`,
                transition: "0.2s"
              }}>
                <p style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#020617"
                }}>
                  {s.value}
                </p>

                <p style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569"
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {activePage === "doctors" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>All Doctors</h2>
                <button onClick={() => setActivePage("add-doctor")} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold" }}>+ Add Doctor</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {doctors.map(doc => (
                    <div key={doc._id} style={{ padding: 18, border: "1px solid #e5e7eb", borderRadius: 14, background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{doc.name}</h4>
                            <p style={{ fontSize: 12, color: "#2563eb", margin: "2px 0 0", fontWeight: 600 }}>{doc.speciality}</p>
                          </div>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: doc.available ? "#dcfce7" : "#fee2e2", color: doc.available ? "#166534" : "#991b1b" }}>
                            {doc.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                          {doc.degree && <span>🎓 {doc.degree}</span>}
                          {doc.experience && <span>📅 {doc.experience} experience</span>}
                          <span>📞 {doc.phone || "N/A"}</span>
                          <span>💰 ₹{doc.fees || 0} fees</span>
                          {doc.email && <span>✉️ {doc.email}</span>}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          <button onClick={() => openEditDoctor(doc)} style={{ flex: 1, padding: "7px 0", background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>✏️ Edit</button>
                          <button onClick={() => handleDeleteDoctor(doc._id)} style={{ flex: 1, padding: "7px 0", background: "#ef4444", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>🗑️ Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Doctor Modal */}
            {editDoctor && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setEditDoctor(null)}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 520, maxWidth: "94vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Edit Doctor — {editDoctor.name}</h3>
                    <button onClick={() => setEditDoctor(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Row: Name & Phone */}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Full Name</label>
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={modalInput} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Phone</label>
                        <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={modalInput} />
                      </div>
                    </div>

                    {/* Row: Speciality & Gender */}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Speciality</label>
                        <select value={editForm.speciality} onChange={e => setEditForm(f => ({ ...f, speciality: e.target.value }))} style={modalInput}>
                          <option value="General physician">General Physician</option>
                          <option value="Gynecologist">Gynecologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Pediatricians">Pediatrician</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Gender</label>
                        <select value={editForm.gender} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} style={modalInput}>
                          <option value="Not Selected">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Row: Degree & Experience */}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Degree</label>
                        <input value={editForm.degree} onChange={e => setEditForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. MBBS, MD" style={modalInput} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Experience</label>
                        <input value={editForm.experience} onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5 Years" style={modalInput} />
                      </div>
                    </div>

                    {/* Row: Fees & Availability */}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Consultation Fees (₹)</label>
                        <input type="number" value={editForm.fees} onChange={e => setEditForm(f => ({ ...f, fees: e.target.value }))} style={modalInput} />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <label style={modalLabel}>Availability</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                          <input type="checkbox" checked={editForm.available} onChange={e => setEditForm(f => ({ ...f, available: e.target.checked }))} id="avail-check" />
                          <label htmlFor="avail-check" style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>
                            {editForm.available ? "✅ Available" : "❌ Unavailable"}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      <label style={modalLabel}>About</label>
                      <textarea value={editForm.about} onChange={e => setEditForm(f => ({ ...f, about: e.target.value }))} rows={3} placeholder="Brief description about the doctor" style={{ ...modalInput, resize: "vertical" }} />
                    </div>

                    {/* Row: Address */}
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Address Line 1</label>
                        <input value={editForm.addressLine1} onChange={e => setEditForm(f => ({ ...f, addressLine1: e.target.value }))} style={modalInput} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={modalLabel}>Address Line 2</label>
                        <input value={editForm.addressLine2} onChange={e => setEditForm(f => ({ ...f, addressLine2: e.target.value }))} style={modalInput} />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      <button onClick={handleUpdateDoctor} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>Save Changes</button>
                      <button onClick={() => setEditDoctor(null)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
      )}

      {activePage === "add-doctor" && (
          <AddDoctor token={token} onBack={() => setActivePage("doctors")} onSuccess={() => { fetchAll(); setActivePage("doctors"); }} />
      )}

      {activePage === "patients" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>All Patients</h2>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {patients.map(p => (
                    <div key={p._id} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
                        <h4 style={{ margin: "0 0 4px 0" }}>{p.name}</h4>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{p.email}</p>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{p.phone}</p>
                    </div>
                ))}
            </div>
          </div>
      )}

      {activePage === "appointments" && (
          <div>
            <h2 style={{ marginBottom: 20 }}>All Appointments</h2>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {appointments.map(a => (
                    <div key={a._id} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
                        <h4 style={{ margin: "0 0 4px 0" }}>Date: {a.slotDate} | Time: {a.slotTime}</h4>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}>Doctor: Dr. {a.docData?.name}</p>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px 0" }}>Patient: {a.patientData?.name}</p>
                        <span style={{ display: "inline-block", padding: "4px 8px", background: a.cancelled ? "#fee2e2" : "#dcfce7", color: a.cancelled ? "#991b1b" : "#166534", borderRadius: 12, fontSize: 12, fontWeight: "bold" }}>
                          {a.cancelled ? "Cancelled" : a.status.toUpperCase()}
                        </span>
                        {!a.cancelled && a.status !== 'completed' && (
                          <button onClick={() => handleCancelAppointment(a._id)} style={{ display: "block", marginTop: 10, padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
                        )}
                    </div>
                ))}
            </div>
          </div>
      )}
      {activePage === "reports" && (
        <div>
          <h2 style={{ marginBottom: 20 }}>System Reports</h2>
          <p style={{ color: "#64748b" }}>Reports module is currently under development.</p>
        </div>
      )}

      {activePage === "queue" && (
        <div>
          <h2 style={{ marginBottom: 20 }}>Global Queue Overview</h2>
          <p style={{ color: "#64748b" }}>Global queue tracking is currently under development.</p>
        </div>
      )}

      {activePage === "settings" && (
        <div>
          <h2 style={{ marginBottom: 20 }}>System Settings</h2>
          <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e5e7eb", maxWidth: 500 }}>
             <h3 style={{ marginTop: 0 }}>Admin Profile</h3>
             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label style={{ fontSize: 12, color: "#64748b" }}>Name</label><div style={{ fontSize: 16, fontWeight: 500 }}>Administrator</div></div>
                <div><label style={{ fontSize: 12, color: "#64748b" }}>Email</label><div style={{ fontSize: 16, fontWeight: 500 }}>{user.email || "admin@admin.com"}</div></div>
                <div><label style={{ fontSize: 12, color: "#64748b" }}>Role</label><div style={{ fontSize: 16, fontWeight: 500 }}>Super Admin</div></div>
             </div>
          </div>
        </div>
      )}

    </div>
  </div>
);
};

export default AdminDashboard;