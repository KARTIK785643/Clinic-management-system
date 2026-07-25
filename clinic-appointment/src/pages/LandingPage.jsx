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
    { icon: "📅", title: "Smart Scheduling", desc: "Select preferred doctors & date slots in seconds without phone delays." },
    { icon: "🎫", title: "Live Queue Tokens", desc: "Get real-time queue position on your phone. Zero waiting room stress." },
    { icon: "👨‍⚕️", title: "Doctor Workstation", desc: "Call next patient, update consultation status, and manage schedules easily." },
    { icon: "🛡️", title: "Secure & Role-Based", desc: "Dedicated, JWT-protected portals for Patients, Doctors, and Admins." },
    { icon: "📊", title: "Clinic Analytics", desc: "Monitor daily appointments, active doctors, and patient queue metrics." },
    { icon: "⚡", title: "Instant Token Generation", desc: "Get immediate booking confirmation with unique queue numbers." },
  ];

  const steps = [
    { num: "01", title: "Quick Register", desc: "Create your account as Patient or Doctor in seconds." },
    { num: "02", title: "Choose Slot", desc: "Pick your doctor, date, and preferred appointment time." },
    { num: "03", title: "Get Token", desc: "Receive live digital token & queue order instantly." },
    { num: "04", title: "Smooth Visit", desc: "Arrive on your turn when called by doctor." },
  ];

  const roles = [
    {
      icon: "🏥",
      role: "Patient Portal",
      desc: "Fast appointment booking & live token tracking",
      points: ["Instant Booking", "Live Queue Tracker", "Visit Records"],
      badge: "For Patients",
    },
    {
      icon: "👨‍⚕️",
      role: "Doctor Portal",
      desc: "Streamlined consultation queue & schedule control",
      points: ["Daily Schedule", "One-Click Call", "Status Updates"],
      badge: "For Doctors",
    },
    {
      icon: "⚙️",
      role: "Admin Console",
      desc: "Full oversight of clinic staff, users & operational stats",
      points: ["Doctor Management", "Full Audit Logs", "Clinic Stats"],
      badge: "For Admins",
    },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Patient", text: "Booked my consultation in 30 seconds and knew my exact position in queue. Super convenient!", avatar: "PS" },
    { name: "Dr. Arjun Mehta", role: "Cardiologist", text: "Calling the next patient is seamless. Reduced clinic lobby crowd by over 70%.", avatar: "AM" },
    { name: "Riya Patel", role: "Patient", text: "Cleanest clinic booking experience ever. Highly recommended for busy professionals!", avatar: "RP" },
  ];

  // SVG Medical Cross Pattern Data URL for subtle background decoration
  const medicalCrossPattern = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><path d="M28 20h4v8h8v4h-8v8h-4v-8h-8v-4h8z" fill="%230284c7" fill-opacity="0.05"/><circle cx="50" cy="50" r="1.5" fill="%230284c7" fill-opacity="0.08"/></svg>`;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a", background: "#ffffff", overflowX: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(255, 255, 255, 0.98)" : "#ffffff",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.06)" : "none",
        transition: "all 0.3s ease",
        padding: "0 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #0284c7, #0369a1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)",
          }}>🏥</div>
          <span style={{
            fontSize: 22, fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}>SmartClinic</span>
        </div>

        <button onClick={onNavigateLogin} style={{
          padding: "10px 24px", borderRadius: 10,
          background: "#0284c7",
          color: "#ffffff", border: "none", fontWeight: 800, fontSize: 14,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
          letterSpacing: "0.2px", transition: "transform 0.15s, background 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "#0369a1"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = "#0284c7"; }}
        >
          Login / Register →
        </button>
      </header>

      {/* ─── HERO ON CLEAN WHITE BACKGROUND WITH DARK READABLE TEXT ─── */}
      <section style={{
        minHeight: "94vh",
        background: `#ffffff url("${medicalCrossPattern}")`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 70px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Soft Hospital Ambient Glows */}
        <div style={{ position: "absolute", top: "5%", left: "5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(2,132,199,0.10), transparent 70%)", pointerEvents: "none" }} />

        {/* Floating Hospital Micro-Icons */}
        <div className="floating-med" style={{ position: "absolute", top: "18%", left: "12%", fontSize: 32, opacity: 0.3, userSelect: "none" }}>🩺</div>
        <div className="floating-med-alt" style={{ position: "absolute", bottom: "25%", left: "8%", fontSize: 28, opacity: 0.25, userSelect: "none" }}>💊</div>
        <div className="floating-med" style={{ position: "absolute", top: "22%", right: "12%", fontSize: 34, opacity: 0.3, userSelect: "none" }}>🛡️</div>
        <div className="floating-med-alt" style={{ position: "absolute", bottom: "20%", right: "10%", fontSize: 30, opacity: 0.25, userSelect: "none" }}>🧬</div>

        {/* ECG Heartbeat Pulse Background Line (SVG) */}
        <div style={{ position: "absolute", bottom: "18%", left: 0, right: 0, height: 80, overflow: "hidden", pointerEvents: "none", opacity: 0.25 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,60 L350,60 L370,20 L385,100 L400,10 L415,80 L430,60 L750,60 L770,25 L785,95 L800,15 L815,75 L830,60 L1200,60" fill="none" stroke="#0284c7" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Live Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#f0f9ff", border: "1px solid #bae6fd",
          borderRadius: 100, padding: "8px 22px", marginBottom: 28,
          fontSize: 14, fontWeight: 800, color: "#0284c7",
          animation: "fadeSlide 0.6s ease",
          boxShadow: "0 2px 10px rgba(2, 132, 199, 0.1)",
        }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#0284c7", display: "inline-block", boxShadow: "0 0 10px #38bdf8" }} />
          Smart Queue management
        </div>

        {/* Headline - Deep Dark Slate (#0f172a) on White for 100% Readability */}
        <h1 style={{
          fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 900, lineHeight: 1.15,
          color: "#0f172a", maxWidth: 840, marginBottom: 20,
          animation: "fadeSlide 0.7s ease 0.1s both",
          letterSpacing: "-1.5px",
        }}>
          Modern Healthcare,{" "}
          <span style={{ color: "#0284c7" }}>
            Zero Queue Stress.
          </span>
        </h1>

        {/* Subtitle - Dark Slate (#334155) for High Contrast */}
        <p style={{
          fontSize: 19, color: "#334155", maxWidth: 640,
          lineHeight: 1.65, marginBottom: 38, fontWeight: 600,
          animation: "fadeSlide 0.7s ease 0.2s both",
        }}>
          Connect patients and doctors seamlessly. Track live queue tokens, schedule appointments, and manage consultations with hospital-grade security.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeSlide 0.7s ease 0.3s both" }}>
          <button onClick={onNavigateLogin} style={{
            padding: "16px 38px", borderRadius: 12,
            background: "#0284c7", color: "#ffffff", border: "none", fontWeight: 900,
            fontSize: 16, cursor: "pointer", letterSpacing: "0.2px",
            boxShadow: "0 8px 28px rgba(2, 132, 199, 0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 34px rgba(2, 132, 199, 0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 28px rgba(2, 132, 199, 0.35)"; }}
          >
            Get Started Free →
          </button>
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "16px 32px", borderRadius: 12,
            background: "#ffffff", border: "2px solid #0284c7",
            color: "#0f172a", fontWeight: 800, fontSize: 15, cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"}
            onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}
          >
            Explore Features
          </button>
        </div>

        {/* Stat Counter Strip on White */}
        <div style={{
          display: "flex", gap: 0, marginTop: 56, flexWrap: "wrap", justifyContent: "center",
          background: "#ffffff", border: "2px solid #e2e8f0",
          borderRadius: 18, padding: "22px 36px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
          animation: "fadeSlide 0.7s ease 0.4s both",
        }}>
          {[
            { value: `${count.patients.toLocaleString()}+`, label: "Patients Served" },
            { value: `${count.doctors}+`, label: "Expert Doctors" },
            { value: `${count.appointments.toLocaleString()}+`, label: "Appointments Completed" },
          ].map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "0 32px",
              borderRight: i < 2 ? "1px solid #e2e8f0" : "none",
            }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: "#0284c7", margin: 0, letterSpacing: "-0.5px" }}>{s.value}</p>
              <p style={{ fontSize: 14, color: "#0f172a", margin: "4px 0 0", fontWeight: 800 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ON CLEAN WHITE / LIGHT BACKDROP ─── */}
      <section id="features" style={{
        padding: "80px 32px",
        background: `#f8fafc url("${medicalCrossPattern}")`,
        borderTop: "1px solid #e2e8f0",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1.2px", background: "#ffffff", padding: "6px 16px", borderRadius: 20, border: "2px solid #bae6fd", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>Core Capabilities</span>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: "14px 0 10px", letterSpacing: "-0.8px" }}>
              Designed for Speed & Efficiency
            </h2>
            <p style={{ fontSize: 17, color: "#334155", maxWidth: 520, margin: "0 auto", fontWeight: 600 }}>
              Everything you need to streamline patient visits and daily clinic operations.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "#ffffff", border: "2px solid #e2e8f0",
                borderRadius: 16, padding: "26px 24px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(2, 132, 199, 0.15)";
                  e.currentTarget.style.borderColor = "#0284c7";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: "#f0f9ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 16, border: "2px solid #bae6fd",
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ON CLEAN WHITE ─── */}
      <section style={{ padding: "80px 32px", background: "#ffffff", position: "relative", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1.2px", background: "#f0f9ff", padding: "6px 16px", borderRadius: 20, border: "2px solid #bae6fd" }}>Step-by-Step</span>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: "14px 0 10px", letterSpacing: "-0.8px" }}>How SmartClinic Works</h2>
            <p style={{ fontSize: 17, color: "#334155", maxWidth: 460, margin: "0 auto", fontWeight: 600 }}>Get your appointment and token in 4 simple steps.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}>
            {steps.map((s) => (
              <div key={s.num} style={{
                background: "#ffffff", borderRadius: 16, padding: "26px 20px",
                border: "2px solid #e2e8f0", position: "relative",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                transition: "transform 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#0284c7"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{
                  display: "inline-block", fontSize: 13, fontWeight: 900,
                  color: "#ffffff", background: "#0284c7",
                  padding: "4px 12px", borderRadius: 8, marginBottom: 14,
                }}>Step {s.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLE PORTALS ON CLEAN LIGHT SKY BLUE BACKGROUND ─── */}
      <section style={{
        padding: "85px 32px",
        background: "#f0f7ff",
        position: "relative", overflow: "hidden",
        borderTop: "1px solid #e2e8f0",
      }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1.2px", background: "#ffffff", padding: "6px 16px", borderRadius: 20, border: "2px solid #bae6fd" }}>Tailored Dashboards</span>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: "14px 0 10px", letterSpacing: "-0.8px" }}>Portals Built for Every Role</h2>
          <p style={{ fontSize: 17, color: "#334155", maxWidth: 480, margin: "0 auto 48px", fontWeight: 600 }}>Dedicated interfaces designed specifically for Patients, Doctors, and Admins.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
            {roles.map((r) => (
              <div key={r.role} style={{
                background: "#ffffff", border: "2px solid #bae6fd",
                borderRadius: 18, padding: "28px 24px", textAlign: "left",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)", transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0284c7"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#bae6fd"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 36 }}>{r.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#ffffff", background: "#0284c7", padding: "4px 12px", borderRadius: 12 }}>{r.badge}</span>
                </div>
                <h3 style={{ fontSize: 21, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>{r.role}</h3>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.5, margin: "0 0 20px", fontWeight: 600 }}>{r.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {r.points.map(p => (
                    <span key={p} style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", background: "#f0f9ff", padding: "5px 12px", borderRadius: 8, border: "1px solid #bae6fd" }}>
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ON CLEAN WHITE ─── */}
      <section style={{ padding: "80px 32px", background: `#ffffff url("${medicalCrossPattern}")`, borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1.2px", background: "#f0f9ff", padding: "6px 16px", borderRadius: 20, border: "2px solid #bae6fd" }}>User Reviews</span>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: "14px 0 8px", letterSpacing: "-0.8px" }}>Trusted by Patients & Doctors</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                background: "#ffffff", border: "2px solid #e2e8f0",
                borderRadius: 16, padding: "26px 22px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#0284c7"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ fontSize: 22, color: "#d97706", marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: "#0f172a", lineHeight: 1.6, margin: "0 0 18px", fontStyle: "italic", fontWeight: 600 }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "#0284c7",
                    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 14,
                  }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: 15, color: "#0f172a", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 13, color: "#0284c7", margin: 0, fontWeight: 700 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{
        padding: "80px 32px",
        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#ffffff", margin: "0 0 12px", letterSpacing: "-1px" }}>
            Ready for Hassle-Free Clinic Visits?
          </h2>
          <p style={{ fontSize: 18, color: "#ffffff", maxWidth: 500, margin: "0 auto 36px", fontWeight: 600 }}>
            Join SmartClinic today to manage appointments and live queue tokens with ease.
          </p>
          <button onClick={onNavigateLogin} style={{
            padding: "16px 44px", borderRadius: 12,
            background: "#ffffff", color: "#0284c7",
            border: "none", fontWeight: 900, fontSize: 17,
            cursor: "pointer", letterSpacing: "0.2px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)"; }}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#0f172a", padding: "36px 24px", textAlign: "center", borderTop: "2px solid #0284c7" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#0284c7",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🏥</div>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#ffffff" }}>SmartClinic</span>
        </div>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 12px", fontWeight: 600 }}>Smart Clinic Appointment & Queue Management System</p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px", fontWeight: 500 }}>© {new Date().getFullYear()} SmartClinic. All rights reserved.</p>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#38bdf8", margin: 0 }}>Developed by Kartik</p>
      </footer>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes floatSlowAlt {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-4deg); }
        }
        .floating-med {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .floating-med-alt {
          animation: floatSlowAlt 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
