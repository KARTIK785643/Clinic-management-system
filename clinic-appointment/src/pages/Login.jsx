import React, { useState } from "react";

const Login = ({ onLoginSuccess, onNavigateRegister }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let endpoint = "";
    if (form.role === "patient") endpoint = "/api/patients/login";
    else if (form.role === "doctor") endpoint = "/api/doctors/login";
    else if (form.role === "admin") endpoint = "/api/admin/login";

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await res.json();

        if (data.success) {
            // Include role in user data for routing
            const userData = { ...data, role: form.role };
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", data.token);
            onLoginSuccess(userData);
        } else {
            setError(data.message || "Login failed");
        }
    } catch (err) {
        setError("Network error or server down");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: 380,
          background: "#ffffff",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          animation: "fadeSlide 0.6s ease",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: "linear-gradient(135deg,#2563eb,#06b6d4)",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            C
          </div>

          <h2
            style={{
              marginTop: 10,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Login to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: 10,
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Role Selection Tabs */}
          <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 6, borderRadius: 10, marginBottom: 10 }}>
            {["patient", "doctor", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: form.role === r ? "#fff" : "transparent",
                  color: form.role === r ? "#0f172a" : "#64748b",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow: form.role === r ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Email */}
          <input
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            style={input}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            style={input}
          />

          {/* Button */}
          <button style={btn}>Login</button>
        </form>

        {/* Register */}
        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 13,
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              color: "#2563eb",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={onNavigateRegister}
          >
            Register
          </span>
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

/* Input Style */
const input = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  color: "#0f172a",
  background: "#f8fafc",
  transition: "border-color 0.2s, box-shadow 0.2s",
  width: "100%",
};

/* Button Style */
const btn = {
  padding: "13px",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 700,
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  cursor: "pointer",
  letterSpacing: "0.2px",
  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  transition: "opacity 0.2s",
};

export default Login;