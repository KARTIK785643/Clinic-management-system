import React, { useEffect, useState } from "react";

const TokenDisplay = ({ token, queuePosition, totalInQueue, estimatedWait, status }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (status === "in_progress") {
      const interval = setInterval(() => setPulse((p) => !p), 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const isActive  = status === "in_progress";
  const isWaiting = status === "waiting";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${isActive ? "var(--border-accent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-xl)",
        padding: "32px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: isActive ? "var(--shadow-glow)" : "none",
        animation: "fadeIn 0.5s ease",
      }}
    >
      {/* Animated background glow when active */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Status badge */}
      <div style={{ marginBottom: 20 }}>
        {isActive ? (
          <span className="badge badge-progress" style={{ fontSize: 12 }}>
            ⚡ Your turn — Please proceed
          </span>
        ) : isWaiting ? (
          <span className="badge badge-waiting" style={{ fontSize: 12 }}>
            ⏳ In Queue
          </span>
        ) : (
          <span className="badge badge-completed" style={{ fontSize: 12 }}>
            ✓ Completed
          </span>
        )}
      </div>

      {/* Token number */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: isActive
            ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
            : "var(--bg-raised)",
          border: isActive
            ? "none"
            : "2px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: isActive
            ? `0 0 ${pulse ? "40px" : "24px"} rgba(99,102,241,${pulse ? "0.5" : "0.3"})`
            : "none",
          transition: "box-shadow 0.6s ease",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 9,
              color: isActive ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 0,
            }}
          >
            TOKEN
          </p>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 30,
              fontWeight: 700,
              color: isActive ? "#fff" : "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {token ?? "—"}
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-secondary)",
          marginBottom: 20,
          letterSpacing: "0.3px",
        }}
      >
        Your Queue Token
      </p>

      {/* Stats row */}
      {isWaiting && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginTop: 8,
          }}
        >
          <StatTile label="Position"    value={queuePosition ? `#${queuePosition}` : "—"} color="var(--accent-primary)" />
          <StatTile label="Total Queue" value={totalInQueue ?? "—"}                       color="var(--accent-amber)" />
          <StatTile label="Est. Wait"   value={estimatedWait ? `~${estimatedWait}m` : "—"} color="var(--accent-secondary)" />
        </div>
      )}

      {isActive && (
        <div
          style={{
            marginTop: 8,
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "var(--accent-green)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            fontWeight: 500,
          }}
        >
          🏥 Please proceed to the doctor's room
        </div>
      )}
    </div>
  );
};

const StatTile = ({ label, value, color }) => (
  <div
    style={{
      padding: "10px 8px",
      borderRadius: 10,
      background: "var(--bg-raised)",
      border: "1px solid var(--border-subtle)",
    }}
  >
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 18,
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: 3,
      }}
    >
      {value}
    </p>
    <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
      {label}
    </p>
  </div>
);

export default TokenDisplay;