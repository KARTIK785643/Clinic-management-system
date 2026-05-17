import React, { useState } from "react";

const AddDoctor = ({ onBack, onSuccess, token }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "General physician",
    degree: "",
    experience: "1 Year",
    fees: "",
    about: "",
    address: { line1: "", line2: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "line1" || e.target.name === "line2") {
      setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/add-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, fees: Number(form.fees) }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to add doctor");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    marginTop: "4px",
  };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Add New Doctor</h2>
        <button onClick={onBack} style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>Back</button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label>Name</label>
          <input name="name" required value={form.name} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" required value={form.password} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Experience</label>
          <select name="experience" value={form.experience} onChange={handleChange} style={inputStyle}>
            {["1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "10+ Years"].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label>Fees</label>
          <input type="number" name="fees" required value={form.fees} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Speciality</label>
          <select name="speciality" value={form.speciality} onChange={handleChange} style={inputStyle}>
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>
        <div>
          <label>Degree</label>
          <input name="degree" required value={form.degree} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label>About</label>
          <textarea name="about" required value={form.about} onChange={handleChange} style={{ ...inputStyle, height: 80 }} />
        </div>
        <div>
          <label>Address Line 1</label>
          <input name="line1" required value={form.address.line1} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Address Line 2</label>
          <input name="line2" value={form.address.line2} onChange={handleChange} style={inputStyle} />
        </div>

        <button type="submit" disabled={loading} style={{
          gridColumn: "span 2",
          padding: "12px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: 10
        }}>
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
