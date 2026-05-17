import React from "react";

const STATUS_CONFIG = {
  waiting:    { label: "Waiting" },
  in_progress:{ label: "In Progress" },
  completed:  { label: "Completed" },
  cancelled:  { label: "Cancelled" },
};

const AppointmentCard = ({
  appointment,
  role = "patient",
  onStatusChange,
  onCancel,
  onCallNext,
  compact = false,
}) => {

  const {
    _id,
    patientName,
    doctorName,
    date,
    time,
    status = "waiting",
    tokenNumber,
    department,
    notes,
  } = appointment || {};

  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ---------------- BUTTON STYLES ---------------- */
  const btnPrimary = {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer"
  };

  const btnSuccess = { ...btnPrimary, background: "#10b981" };
  const btnDanger  = { ...btnPrimary, background: "#ef4444" };

  /* ---------------- COMPACT VIEW ---------------- */
  if (compact) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
        marginBottom: 8
      }}>
        <div style={{
          minWidth: 40,
          height: 40,
          borderRadius: 10,
          background: status === "in_progress" ? "#2563eb" : "#f1f5f9",
          color: status === "in_progress" ? "#fff" : "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800
        }}>
          #{tokenNumber || "—"}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            {patientName || "Patient"}
          </p>
          <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            {time} · {department || "General"}
          </p>
        </div>

        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: "4px 8px",
          borderRadius: 20,
          background: "#e0f2fe",
          color: "#0369a1"
        }}>
          {statusCfg.label}
        </span>

        {role === "doctor" && status === "waiting" && (
          <button onClick={() => onCallNext?.(_id)} style={btnPrimary}>
            Call
          </button>
        )}
      </div>
    );
  }

  /* ---------------- FULL CARD ---------------- */
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      borderLeft: status === "in_progress"
        ? "4px solid #2563eb"
        : "4px solid transparent"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800
          }}>
            #{tokenNumber || "—"}
          </div>

          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
              {role === "patient" ? `Dr. ${doctorName}` : patientName}
            </p>
            <p style={{ fontSize: 12, color: "#64748b" }}>
              {department || "General OPD"}
            </p>
          </div>
        </div>

        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: 20,
          background: "#e0f2fe",
          color: "#0369a1"
        }}>
          {statusCfg.label}
        </span>
      </div>

      {/* INFO GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: notes ? 12 : 0
      }}>
        <InfoRow label="Date" value={formatDate(date)} />
        <InfoRow label="Time" value={time || "—"} />
        <InfoRow label={role === "patient" ? "Doctor" : "Patient"} value={role === "patient" ? doctorName : patientName} />
        <InfoRow label="Dept." value={department || "General"} />
      </div>

      {/* NOTES */}
      {notes && (
        <div style={{
          padding: 10,
          borderRadius: 8,
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          fontSize: 13,
          color: "#475569",
          marginBottom: 12
        }}>
          {notes}
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {role === "doctor" && status === "waiting" && (
          <button style={btnPrimary} onClick={() => onStatusChange?.(_id, "in_progress")}>
            Start
          </button>
        )}
        {role === "doctor" && status === "in_progress" && (
          <button style={btnSuccess} onClick={() => onStatusChange?.(_id, "completed")}>
            Complete
          </button>
        )}
        {role === "patient" && status === "waiting" && (
          <button style={btnDanger} onClick={() => onCancel?.(_id)}>
            Cancel
          </button>
        )}
      </div>

    </div>
  );
};

/* ---------------- InfoRow ---------------- */
const InfoRow = ({ label, value }) => (
  <div>
    <p style={{
      fontSize: 10,
      fontWeight: 700,
      color: "#64748b",
      marginBottom: 2
    }}>
      {label}
    </p>
    <p style={{
      fontSize: 13,
      fontWeight: 600,
      color: "#0f172a"
    }}>
      {value}
    </p>
  </div>
);

export default AppointmentCard;