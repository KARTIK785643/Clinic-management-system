import React, { useState, useEffect } from "react";

const LandingPage = ({ onNavigateLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated counters
  useEffect(() => {
    const targets = { patients: 1200, doctors: 85, appointments: 9400 };
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const pct = step / steps;
      const ease = 1 - Math.pow(1 - pct, 3);
      setCount({
        patients: Math.floor(targets.patients * ease),
        doctors: Math.floor(targets.doctors * ease),
        appointments: Math.floor(targets.appointments * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: "📅", title: "Smart Scheduling", desc: "Book appointments with any doctor in seconds. Real-time slot availability — no phone calls needed." },
    { icon: "🎫", title: "Live Queue Tokens", desc: "Get a digital token and track your position in the queue from anywhere. No waiting-room surprises." },
    { icon: "👨‍⚕️", title: "Doctor Dashboard", desc: "Doctors see today's schedule, call the next patient, and manage statuses all in one place." },
    { icon: "🛡️", title: "Secure & Role-Based", desc: "Separate secure portals for Patients, Doctors and Admins with JWT-protected access." },
    { icon: "📊", title: "Admin Analytics", desc: "Full control over doctors, appointments and clinic statistics from a powerful admin console." },
    { icon: "⚡", title: "Instant Confirmation", desc: "Every booking returns a token number immediately. Patients always know their status." },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Register as a Patient or Doctor in under a minute.", color: "#6366f1" },
    { num: "02", title: "Book Appointment", desc: "Choose a doctor, pick a date and time slot.", color: "#2563eb" },
    { num: "03", title: "Get Your Token", desc: "Receive a queue token instantly after booking.", color: "#06b6d4" },
    { num: "04", title: "Visit & Done", desc: "Track your turn live and walk in when called.", color: "#10b981" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Patient", text: "I booked my appointment in under 2 minutes and got a token instantly. No more waiting in long queues!", avatar: "PS", color: "#6366f1" },
    { name: "Dr. Arjun Mehta", role: "Cardiologist", desc: "The dashboard gives me a perfect view of my day. Calling the next patient is just one click.", avatar: "AM", color: "#10b981" },
    { name: "Riya Patel", role: "Patient", text: "CareSync makes visiting the clinic feel modern and stress-free. Absolutely love it!", avatar: "RP", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a", background: "#fff", overflowX: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "none",
        transition: "all 0.3s ease",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}>🏥</div>
          <span style={{
            fontSize: 22, fontWeight: 900,
            background: scrolled ? "linear-gradient(135deg,#2563eb,#06b6d4)" : "none",
            WebkitBackgroundClip: scrolled ? "text" : "unset",
            WebkitTextFillColor: scrolled ? "transparent" : "#ffffff",
            transition: "all 0.3s ease",
          }}>Apna Clinic</span>
        </div>

        <button onClick={onNavigateLogin} style={{
          padding: "10px 26px", borderRadius: 10,
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          letterSpacing: "0.2px", transition: "transform 0.15s, box-shadow 0.15s",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(37,99,235,0.45)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)"; }}
        >
          Login / Register →
        </button>
      </header>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg,#0f172a 0%,#1e1b4b 40%,#0c4a6e 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "100px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.25),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.2),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)", pointerEvents: "none" }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.35)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          fontSize: 13, fontWeight: 600, color: "#93c5fd",
          animation: "fadeSlide 0.6s ease",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22d3ee", display: "inline-block", boxShadow: "0 0 8px #22d3ee" }} />
          Now live — Smart Queue Management
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1,
          color: "#fff", maxWidth: 780, marginBottom: 24,
          animation: "fadeSlide 0.7s ease 0.1s both",
          letterSpacing: "-1.5px",
        }}>
          Modern Healthcare,{" "}
          <span style={{ background: "linear-gradient(135deg,#60a5fa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Zero Hassle.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 19, color: "#94a3b8", maxWidth: 560,
          lineHeight: 1.7, marginBottom: 44, fontWeight: 400,
          animation: "fadeSlide 0.7s ease 0.2s both",
        }}>
          CareSync connects patients and doctors through smart appointment scheduling, live queue tokens, and role-based dashboards — all in one platform.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeSlide 0.7s ease 0.3s both" }}>
          <button onClick={onNavigateLogin} style={{
            padding: "16px 38px", borderRadius: 12,
            background: "linear-gradient(135deg,#2563eb,#0891b2)",
            color: "#fff", border: "none", fontWeight: 800,
            fontSize: 17, cursor: "pointer", letterSpacing: "0.2px",
            boxShadow: "0 8px 30px rgba(37,99,235,0.45)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(37,99,235,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,99,235,0.45)"; }}
          >
            Get Started Free →
          </button>
          <button onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })} style={{
            padding: "16px 32px", borderRadius: 12,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
            color: "#e2e8f0", fontWeight: 600, fontSize: 16, cursor: "pointer",
            transition: "background 0.2s",
            backdropFilter: "blur(4px)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            See How It Works
          </button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 0, marginTop: 72, flexWrap: "wrap", justifyContent: "center",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "28px 40px", backdropFilter: "blur(8px)",
          animation: "fadeSlide 0.7s ease 0.4s both",
        }}>
          {[
            { value: `${count.patients.toLocaleString()}+`, label: "Patients Registered" },
            { value: `${count.doctors}+`, label: "Active Doctors" },
            { value: `${count.appointments.toLocaleString()}+`, label: "Appointments Booked" },
          ].map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "0 40px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none",
            }}>
              <p style={{ fontSize: 34, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-1px" }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: "100px 40px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px" }}>Everything You Need</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", margin: "12px 0 16px", letterSpacing: "-1px" }}>
              Built for Modern Clinics
            </h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              One unified platform for patients, doctors, and administrators.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 18, padding: "28px 26px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg,#eff6ff,#e0f2fe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 18, border: "1px solid #bfdbfe",
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "1px" }}>Simple Process</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", margin: "12px 0 16px", letterSpacing: "-1px" }}>How CareSync Works</h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>From registration to your clinic visit in 4 easy steps.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {steps.map((s) => (
              <div key={s.num} style={{
                background: "#f8fafc", borderRadius: 18, padding: "30px 22px",
                border: "1px solid #e5e7eb", position: "relative", overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{
                  position: "absolute", top: -12, right: -8,
                  fontSize: 72, fontWeight: 900, color: s.color, opacity: 0.07,
                  lineHeight: 1, userSelect: "none",
                }}>{s.num}</div>
                <div style={{
                  display: "inline-block", fontSize: 13, fontWeight: 800,
                  color: s.color, background: `${s.color}18`,
                  padding: "4px 12px", borderRadius: 8, marginBottom: 16,
                }}>Step {s.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLES SECTION ─── */}
      <section style={{ padding: "100px 40px", background: "linear-gradient(145deg,#0f172a,#1e1b4b)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "1px" }}>For Everyone</span>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: "#fff", margin: "12px 0 14px", letterSpacing: "-1px" }}>Who Uses Apna clinic?</h2>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 460, margin: "0 auto 56px", lineHeight: 1.7 }}>Three tailored portals — one seamless experience.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
            {[
              {
                icon: "🏥", role: "Patient", color: "#6366f1", borderColor: "rgba(99,102,241,0.3)",
                points: ["Register & book appointments", "Get queue token instantly", "View visit history", "Track appointment status live"],
              },
              {
                icon: "👨‍⚕️", role: "Doctor", color: "#10b981", borderColor: "rgba(16,185,129,0.3)",
                points: ["See today's full schedule", "Call next patient in queue", "Update appointment status", "Manage patient history"],
              },
              {
                icon: "⚙️", role: "Admin", color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)",
                points: ["Add / remove doctors", "View all appointments", "Monitor all patients", "Access clinic-wide stats"],
              },
            ].map((r) => (
              <div key={r.role} style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid ${r.borderColor}`,
                borderRadius: 20, padding: "32px 26px", textAlign: "left",
                transition: "background 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{r.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 20px" }}>{r.role} Portal</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {r.points.map(p => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${r.color}25`, border: `1px solid ${r.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: r.color, fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "100px 40px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px" }}>Testimonials</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", margin: "12px 0 14px", letterSpacing: "-1px" }}>Loved by Our Users</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 18, padding: "28px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ fontSize: 28, color: "#fbbf24", marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, margin: "0 0 20px", fontStyle: "italic" }}>
                  "{t.text || t.desc}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `linear-gradient(135deg,${t.color},${t.color}99)`,
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14,
                  }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{
        padding: "100px 40px",
        background: "linear-gradient(135deg,#2563eb 0%,#0891b2 100%)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 46, fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-1.5px" }}>
            Ready to Transform Your Clinic?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto 42px", lineHeight: 1.7 }}>
            Join hundreds of clinics already using CareSync to deliver faster, smarter healthcare.
          </p>
          <button onClick={onNavigateLogin} style={{
            padding: "18px 52px", borderRadius: 14,
            background: "#fff", color: "#1d4ed8",
            border: "none", fontWeight: 800, fontSize: 18,
            cursor: "pointer", letterSpacing: "0.2px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.28)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.2)"; }}
          >
            Get Started — It's Free →
          </button>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 18 }}>No credit card required. Takes under 2 minutes.</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#0f172a", padding: "40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🏥</div>
          <span style={{ fontSize: 18, fontWeight: 900, background: "linear-gradient(135deg,#60a5fa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Apna Clinic</span>
        </div>
        <p style={{ fontSize: 13, color: "#475569", margin: "0 0 16px" }}>Smart Clinic Management System</p>
        <p style={{ fontSize: 12, color: "#ccd0d5ff" }}>© {new Date().getFullYear()} Apna Clinic. All rights reserved.</p>
        <h2 style={{ color: "white" }}>Developed by Kartik</h2>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
