import React, { useState, useEffect } from "react";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const BookAppointment = ({ onBack, onBooked }) => {
  const token = localStorage.getItem("token");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate]     = useState("");
  const [selectedTime, setSelectedTime]     = useState("");
  const [notes, setNotes]                   = useState("");

  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [booked,   setBooked]   = useState(null); // holds { tokenNumber, doctorName, slotDate, slotTime }

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch available doctors
  useEffect(() => {
    fetch("/api/doctors", { headers: authHeaders })
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors || []))
      .catch(() => setError("Could not load doctors"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedDoctor) return setError("Please select a doctor.");
    if (!selectedDate)   return setError("Please select a date.");
    if (!selectedTime)   return setError("Please select a time slot.");

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(selectedDate);
    if (chosen < today) return setError("Cannot book an appointment in the past.");

    setLoading(true);
    try {
      const res = await fetch("/api/patients/book-appointment", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          docId:    selectedDoctor._id,
          slotDate: selectedDate,
          slotTime: selectedTime,
          notes,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Booking failed");

      setBooked({
        tokenNumber: data.tokenNumber,
        doctorName:  data.doctorName || selectedDoctor.name,
        slotDate:    data.slotDate   || selectedDate,
        slotTime:    data.slotTime   || selectedTime,
      });

      if (onBooked) setTimeout(onBooked, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Booking Success Screen ---- */
  if (booked) {
    return (
      <div style={s.page}>
        <div style={{ ...s.card, textAlign: "center", maxWidth: 400 }}>
          {/* Success icon */}
          <div style={s.successIcon}>✓</div>
          <h2 style={{ color: "#166534", margin: "12px 0 4px" }}>Appointment Confirmed!</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            Your appointment has been booked successfully.
          </p>

          {/* Token */}
          <div style={s.tokenBox}>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 4px" }}>Your Queue Token</p>
            <div style={s.tokenNumber}>#{booked.tokenNumber}</div>
          </div>

          {/* Details */}
          <div style={s.detailsBox}>
            {[
              { label: "Doctor",  value: `Dr. ${booked.doctorName}` },
              { label: "Date",    value: booked.slotDate },
              { label: "Time",    value: booked.slotTime },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>{r.label}</span>
                <span style={{ color: "#0f172a", fontSize: 13, fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button style={s.secondaryBtn} onClick={onBack}>← Back to Dashboard</button>
            <button style={s.primaryBtn} onClick={() => setBooked(null)}>Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Booking Form ---- */
  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button style={s.secondaryBtn} onClick={onBack}>← Back</button>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>Book Appointment</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Fill in the details to schedule your visit</p>
          </div>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Step 1 — Select Doctor */}
          <div>
            <label style={s.label}>Step 1 · Select Doctor</label>
            {doctors.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading doctors...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginTop: 8 }}>
                {doctors.map((doc) => (
                  <button
                    key={doc._id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    style={{
                      padding: "12px",
                      borderRadius: 10,
                      border: selectedDoctor?._id === doc._id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      background: selectedDoctor?._id === doc._id ? "#eff6ff" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Dr. {doc.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{doc.speciality}</div>
                    {doc.fees > 0 && <div style={{ fontSize: 12, color: "#2563eb", marginTop: 2, fontWeight: 600 }}>₹{doc.fees}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2 — Select Date */}
          <div>
            <label style={s.label}>Step 2 · Select Date</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ ...s.input, marginTop: 8 }}
            />
          </div>

          {/* Step 3 — Select Time Slot */}
          <div>
            <label style={s.label}>Step 3 · Select Time Slot</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: selectedTime === t ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    background: selectedTime === t ? "#eff6ff" : "#fff",
                    color: selectedTime === t ? "#2563eb" : "#475569",
                    fontWeight: selectedTime === t ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={s.label}>Notes (Optional)</label>
            <textarea
              placeholder="Describe your symptoms or reason for visit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ ...s.input, resize: "vertical", marginTop: 8 }}
            />
          </div>

          {/* Summary */}
          {selectedDoctor && selectedDate && selectedTime && (
            <div style={s.summaryBox}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>Appointment Summary</p>
              <div style={{ fontSize: 13, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
                <span>👨‍⚕️ Dr. {selectedDoctor.name} · {selectedDoctor.speciality}</span>
                <span>📅 {selectedDate} at {selectedTime}</span>
                {selectedDoctor.fees > 0 && <span>💰 Consultation fee: ₹{selectedDoctor.fees}</span>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.primaryBtn,
              opacity: loading ? 0.7 : 1,
              fontSize: 15,
              padding: "14px",
            }}
          >
            {loading ? "Booking..." : "✓ Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  page: {
    padding: "20px 0",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 28,
    maxWidth: 700,
    margin: "0 auto",
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
  summaryBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: "12px 16px",
  },
  tokenBox: {
    background: "linear-gradient(135deg,#eff6ff,#e0f2fe)",
    borderRadius: 12,
    padding: "16px 24px",
    marginBottom: 16,
  },
  tokenNumber: {
    fontSize: 52,
    fontWeight: 900,
    color: "#2563eb",
    lineHeight: 1,
    margin: "4px 0",
  },
  detailsBox: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: "4px 16px",
    textAlign: "left",
  },
  successIcon: {
    width: 60,
    height: 60,
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 28,
    fontWeight: 900,
    margin: "0 auto 4px",
  },
  primaryBtn: {
    padding: "11px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    transition: "opacity 0.2s",
  },
  secondaryBtn: {
    padding: "9px 16px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    background: "#f8fafc",
    color: "#374151",
    fontWeight: 600,
    fontSize: 13,
  },
};

export default BookAppointment;