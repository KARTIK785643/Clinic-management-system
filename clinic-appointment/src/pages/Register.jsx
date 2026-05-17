import React, { useState } from "react";

const Register = ({ onNavigateLogin }) => {
  const [role, setRole] = useState("patient");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    line1: "",
    line2: "",
    speciality: "General physician",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleRoleChange = (r) => {
    setRole(r);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const endpoint =
      role === "patient"
        ? "/api/patients/register"
        : "/api/doctors/register";

    const body =
      role === "patient"
        ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            dob: form.dob || "Not Selected",
            gender: form.gender || "Not Selected",
            address: { line1: form.line1, line2: form.line2 },
          }
        : {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            gender: form.gender || "Not Selected",
            speciality: form.speciality,
          };

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(
          role === "patient"
            ? "Patient account created! Redirecting to login..."
            : "Doctor account created! Redirecting to login..."
        );
        setTimeout(() => onNavigateLogin(), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error or server down");
    } finally {
      setLoading(false);
    }
  };

  /* Labeled input helper */
  const LabeledInput = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Card */}
      <div style={styles.card}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={styles.logo}>C</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join Apna Clinic as a {role}</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.tabs}>
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                ...styles.tab,
                background: role === r ? "#fff" : "transparent",
                color: role === r ? "#0f172a" : "#64748b",
                boxShadow: role === r ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {r === "patient" ? "🏥 Patient" : "👨‍⚕️ Doctor"}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && <div style={styles.alertError}>{error}</div>}
        {success && <div style={styles.alertSuccess}>{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Row 1: Name & Email */}
          <div style={styles.row}>
            <LabeledInput label="Full Name">
              <input name="name"  placeholder="name" onChange={handleChange} value={form.name} style={styles.input} />
            </LabeledInput>
            <LabeledInput label="Email Address">
              <input name="email"  type="email" placeholder="email" onChange={handleChange} value={form.email} style={styles.input} />
            </LabeledInput>
          </div>

          {/* Row 2: Phone & Gender */}
          <div style={styles.row}>
            <LabeledInput label="Phone Number">
              <input name="phone" required placeholder="" onChange={handleChange} value={form.phone} style={styles.input} />
            </LabeledInput>
            <LabeledInput label="Gender">
              <select name="gender" onChange={handleChange} value={form.gender} style={styles.input}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </LabeledInput>
          </div>

          {/* Patient-only fields */}
          {role === "patient" && (
            <>
              {/* Row 3: DOB & Address 1 */}
              <div style={styles.row}>
                <LabeledInput label="Date of Birth">
                  <input type="date" name="dob" onChange={handleChange} value={form.dob} style={styles.input} />
                </LabeledInput>
                <LabeledInput label="Address Line 1">
                  <input name="line1" placeholder="Street address" onChange={handleChange} value={form.line1} style={styles.input} />
                </LabeledInput>
              </div>
              {/* Row 4: Address 2 alone */}
              <LabeledInput label="Address Line 2 (Optional)">
                <input name="line2" placeholder="Apartment, suite, etc." onChange={handleChange} value={form.line2} style={styles.input} />
              </LabeledInput>
            </>
          )}

          {/* Doctor-only fields */}
          {role === "doctor" && (
            <LabeledInput label="Speciality">
              <select name="speciality" onChange={handleChange} value={form.speciality} style={styles.input}>
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </LabeledInput>
          )}

          {/* Row: Passwords */}
          <div style={styles.row}>
            <LabeledInput label="Password">
              <input type="password" name="password" required placeholder="Min 6 characters" onChange={handleChange} value={form.password} style={styles.input} />
            </LabeledInput>
            <LabeledInput label="Confirm Password">
              <input type="password" name="confirmPassword" required placeholder="Re-enter password" onChange={handleChange} value={form.confirmPassword} style={styles.input} />
            </LabeledInput>
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.btn,
            background: loading
              ? "#94a3b8"
              : role === "doctor"
              ? "linear-gradient(135deg,#059669,#047857)"
              : "linear-gradient(135deg,#2563eb,#1d4ed8)",
          }}>
            {loading ? "Registering..." : `Register as ${role === "patient" ? "Patient" : "Doctor"}`}
          </button>
        </form>

        {/* Doctor note */}
        {role === "doctor" && (
          <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 6, lineHeight: 1.5 }}>
            ℹ️ Professional details (degree, fees, etc.) can be updated by the admin after registration.
          </p>
        )}

        {/* Link to Login */}
        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={onNavigateLogin}>
            Login
          </span>
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

/* Styles */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
    padding: "20px 0",
  },
  card: {
    width: 520,
    background: "#ffffff",
    padding: "26px 30px",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    animation: "fadeSlide 0.6s ease",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    background: "linear-gradient(135deg,#2563eb,#06b6d4)",
    margin: "0 auto 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: 18,
  },
  title: {
    margin: 0,
    fontWeight: 800,
    color: "#0f172a",
    fontSize: 21,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
    margin: "4px 0 0",
    textTransform: "capitalize",
  },
  tabs: {
    display: "flex",
    gap: 8,
    background: "#f1f5f9",
    padding: 5,
    borderRadius: 10,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  row: {
    display: "flex",
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#334155",
    letterSpacing: "0.2px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "#0f172a",
    background: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  btn: {
    padding: "12px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    cursor: "pointer",
    marginTop: 4,
    letterSpacing: "0.2px",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
    transition: "opacity 0.2s",
  },
  alertError: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
  },
  alertSuccess: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
  },
  footerText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 13,
    color: "#475569",
  },
  link: {
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Register;