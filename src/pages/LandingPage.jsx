// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-4 text-center">Welcome to ThinkVerge LMS</h1>
      <p className="mb-8 text-lg max-w-xl text-center">
        Learn, teach, and manage courses easily. Access your dashboard, track progress, and enroll in courses all in one place.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}


// // src/pages/LandingPage.jsx
// import { useState, useEffect, useRef } from "react";

// // ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
// const FontLoader = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');
//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     html { scroll-behavior: smooth; }
//     body { font-family: 'DM Sans', sans-serif; }
//     h1,h2,h3,h4 { font-family: 'Sora', sans-serif; }
//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(28px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes scroll-test {
//       0%   { transform: translateX(0); }
//       100% { transform: translateX(-50%); }
//     }
//     .test-track { animation: scroll-test 36s linear infinite; }
//     .test-track:hover { animation-play-state: paused; }
//     .fade-up { animation: fadeUp 0.7s ease both; }
//     .fade-up-1 { animation-delay: 0.1s; }
//     .fade-up-2 { animation-delay: 0.22s; }
//     .fade-up-3 { animation-delay: 0.34s; }
//     .fade-up-4 { animation-delay: 0.46s; }
//     @media(max-width:900px){
//       .two-col   { grid-template-columns: 1fr !important; }
//       .three-col { grid-template-columns: 1fr 1fr !important; }
//       .nav-desk  { display: none !important; }
//       .ham-btn   { display: flex !important; }
//       .hero-banner { height: 260px !important; }
//     }
//     @media(max-width:600px){
//       .three-col   { grid-template-columns: 1fr !important; }
//       .footer-grid { grid-template-columns: 1fr !important; }
//       .stats-row   { gap: 1.2rem !important; }
//       .step-grid   { grid-template-columns: 1fr 1fr !important; }
//     }
//   `}</style>
// );

// // ─── PALETTE ──────────────────────────────────────────────────────────────────
// const C = {
//   primary:  "#1a56db",
//   pLight:   "#dbeafe",
//   pDark:    "#1e3a8a",
//   accent:   "#f59e0b",
//   dark:     "#0b1120",
//   text:     "#0f172a",
//   muted:    "#64748b",
//   border:   "#e2e8f0",
//   white:    "#ffffff",
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// function Tag({ children, color = C.primary, bg = C.pLight }) {
//   return (
//     <span style={{
//       display: "inline-block", fontSize: 11, fontWeight: 700,
//       letterSpacing: "0.09em", textTransform: "uppercase",
//       color, background: bg, padding: "5px 14px",
//       borderRadius: 999, marginBottom: 14,
//       fontFamily: "'Sora', sans-serif",
//     }}>{children}</span>
//   );
// }

// function Stars({ n = 5 }) {
//   return <span style={{ color: C.accent, fontSize: 14, letterSpacing: 1 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
// }

// function Modal({ open, onClose, children, maxWidth = 480 }) {
//   useEffect(() => {
//     const fn = (e) => { if (e.key === "Escape") onClose(); };
//     if (open) document.addEventListener("keydown", fn);
//     return () => document.removeEventListener("keydown", fn);
//   }, [open, onClose]);

//   if (!open) return null;
//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 500,
//       background: "rgba(11,17,32,0.65)", backdropFilter: "blur(6px)",
//       display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: C.white, borderRadius: 22, padding: 36,
//         width: "100%", maxWidth, position: "relative",
//         maxHeight: "92vh", overflowY: "auto",
//         boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
//       }}>
//         <button onClick={onClose} style={{
//           position: "absolute", top: 16, right: 16, width: 32, height: 32,
//           borderRadius: "50%", border: "none", background: "#f1f5f9",
//           cursor: "pointer", fontSize: 15, color: C.muted,
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>✕</button>
//         {children}
//       </div>
//     </div>
//   );
// }

// // ─── NAVBAR ───────────────────────────────────────────────────────────────────

// function Navbar({ onLogin, onSignup }) {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userMenu, setUserMenu] = useState(false);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 30);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   const links = [
//     ["About", "about"], ["How it works", "howitworks"],
//     ["Testimonials", "testimonials"], ["Instructors", "instructors"],
//     ["FAQ", "faq"], ["Contact", "contact"],
//   ];

//   const go = (id) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//     setMenuOpen(false);
//   };

//   return (
//     <>
//       <nav style={{
//         position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
//         height: 64,
//         background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
//         backdropFilter: scrolled ? "blur(14px)" : "none",
//         borderBottom: scrolled ? `1px solid ${C.border}` : "none",
//         padding: "0 2.5rem",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         transition: "all 0.35s",
//       }}>
//         {/* Logo */}
//         <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
//           <div style={{
//             width: 36, height: 36, borderRadius: 10,
//             background: "linear-gradient(135deg,#1a56db,#6366f1)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//               <path d="M4 6h12M4 10h8M4 14h10" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/>
//             </svg>
//           </div>
//           <span style={{
//             fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800,
//             color: scrolled ? C.text : "#fff", letterSpacing: -0.4,
//             transition: "color 0.35s",
//           }}>ThinkVerge</span>
//         </div>

//         {/* Desktop Links */}
//         <div className="nav-desk" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
//           {links.map(([label, id]) => (
//             <button key={id} onClick={() => go(id)} style={{
//               background: "none", border: "none", fontSize: 14, fontWeight: 500,
//               color: scrolled ? C.muted : "rgba(255,255,255,0.85)",
//               cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
//               transition: "color 0.2s", padding: "4px 0",
//             }}
//               onMouseEnter={e => e.target.style.color = scrolled ? C.primary : "#fff"}
//               onMouseLeave={e => e.target.style.color = scrolled ? C.muted : "rgba(255,255,255,0.85)"}
//             >{label}</button>
//           ))}
//         </div>

//         {/* User icon dropdown */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{ position: "relative" }}>
//             <button onClick={() => setUserMenu(!userMenu)} title="Account" style={{
//               width: 40, height: 40, borderRadius: "50%",
//               background: scrolled ? C.pLight : "rgba(255,255,255,0.15)",
//               border: scrolled ? `1.5px solid ${C.border}` : "1.5px solid rgba(255,255,255,0.3)",
//               cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               transition: "all 0.2s",
//             }}
//               onMouseEnter={e => e.currentTarget.style.background = scrolled ? "#bfdbfe" : "rgba(255,255,255,0.25)"}
//               onMouseLeave={e => e.currentTarget.style.background = scrolled ? C.pLight : "rgba(255,255,255,0.15)"}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill={scrolled ? C.primary : "#fff"}>
//                 <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
//               </svg>
//             </button>

//             {userMenu && (
//               <div style={{
//                 position: "absolute", top: 48, right: 0,
//                 background: C.white, borderRadius: 14,
//                 border: `1px solid ${C.border}`,
//                 boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
//                 minWidth: 190, overflow: "hidden", zIndex: 400,
//               }}>
//                 <div style={{ padding: 6 }}>
//                   {[
//                     { label: "Login",   icon: "→", action: () => { onLogin();  setUserMenu(false); } },
//                     { label: "Sign up", icon: "✦", action: () => { onSignup(); setUserMenu(false); } },
//                   ].map(({ label, icon, action }) => (
//                     <button key={label} onClick={action} style={{
//                       width: "100%", textAlign: "left", padding: "10px 14px",
//                       display: "flex", alignItems: "center", gap: 10,
//                       background: "none", border: "none", borderRadius: 9,
//                       fontSize: 14, fontWeight: 500, cursor: "pointer", color: C.text,
//                       fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
//                     }}
//                       onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
//                       onMouseLeave={e => e.currentTarget.style.background = "none"}
//                     >
//                       <span style={{
//                         width: 28, height: 28, background: C.pLight, borderRadius: 7,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         fontSize: 13, color: C.primary, fontWeight: 700,
//                       }}>{icon}</span>
//                       {label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Hamburger */}
//           <button className="ham-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
//             background: "none", border: "none", cursor: "pointer",
//             display: "none", flexDirection: "column", gap: 5, padding: 4,
//           }}>
//             {[0,1,2].map(i => (
//               <span key={i} style={{
//                 display: "block", width: 22, height: 2,
//                 background: scrolled ? C.text : "#fff", borderRadius: 2, transition: "all 0.3s",
//               }} />
//             ))}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div style={{
//           position: "fixed", top: 64, left: 0, right: 0, zIndex: 299,
//           background: C.white, borderBottom: `1px solid ${C.border}`,
//           padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 4,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//         }}>
//           {links.map(([label, id]) => (
//             <button key={id} onClick={() => go(id)} style={{
//               background: "none", border: "none", textAlign: "left",
//               padding: "10px 8px", fontSize: 15, fontWeight: 500,
//               color: C.muted, cursor: "pointer", borderRadius: 8,
//               fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = C.primary; }}
//               onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.muted; }}
//             >{label}</button>
//           ))}
//           <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
//             <button onClick={() => { onLogin(); setMenuOpen(false); }} style={{ flex: 1, padding: 10, border: `1.5px solid ${C.border}`, borderRadius: 9, background: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Login</button>
//             <button onClick={() => { onSignup(); setMenuOpen(false); }} style={{ flex: 1, padding: 10, border: "none", borderRadius: 9, background: C.primary, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign up</button>
//           </div>
//         </div>
//       )}

//       {userMenu && <div onClick={() => setUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 298 }} />}
//     </>
//   );
// }

// // ─── HERO ─────────────────────────────────────────────────────────────────────

// function HeroSection({ onSignup }) {
//   return (
//     <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//       {/* Full-bleed Banner */}
//       <div className="hero-banner" style={{ position: "relative", width: "100%", height: 560, overflow: "hidden", flexShrink: 0 }}>
//         <img
//           src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format&fit=crop"
//           alt="Students learning together"
//           style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
//         />
//         <div style={{
//           position: "absolute", inset: 0,
//           background: "linear-gradient(to bottom, rgba(11,17,32,0.45) 0%, rgba(11,17,32,0.65) 50%, rgba(11,17,32,0.95) 100%)",
//         }} />
//         {/* Hero text */}
//         <div style={{
//           position: "absolute", inset: 0,
//           display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//           textAlign: "center", padding: "80px 2rem 2rem",
//         }}>
//           <span className="fade-up fade-up-1" style={{
//             display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 18px",
//             borderRadius: 999, background: "rgba(245,158,11,0.18)",
//             border: "1px solid rgba(245,158,11,0.45)", color: "#fcd34d",
//             fontSize: 13, fontWeight: 600, fontFamily: "'Sora',sans-serif", marginBottom: 22,
//           }}>
//             <span style={{ width: 7, height: 7, background: "#f59e0b", borderRadius: "50%", display: "inline-block" }} />
//             #1 Learning Management Platform in India
//           </span>

//           <h1 className="fade-up fade-up-2" style={{
//             fontFamily: "'Sora',sans-serif",
//             fontSize: "clamp(2.2rem,5.5vw,4rem)",
//             fontWeight: 800, lineHeight: 1.1,
//             color: "#fff", marginBottom: 20, letterSpacing: -1.5, maxWidth: 760,
//           }}>
//             Unlock your potential with{" "}
//             <span style={{ color: "#fbbf24" }}>world-class</span>{" "}
//             online learning
//           </h1>

//           <p className="fade-up fade-up-3" style={{
//             fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,0.75)",
//             lineHeight: 1.75, maxWidth: 560, marginBottom: 36,
//           }}>
//             Expert-led courses, live sessions, and verified certificates — all in one beautifully designed platform built for modern learners.
//           </p>

//           <div className="fade-up fade-up-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
//             <button onClick={onSignup} style={{
//               padding: "14px 36px", background: C.primary, color: "#fff",
//               border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
//               cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all 0.2s",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
//               onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
//               Get started free →
//             </button>
//             <button onClick={() => document.getElementById("howitworks")?.scrollIntoView({ behavior: "smooth" })} style={{
//               padding: "14px 28px", background: "rgba(255,255,255,0.12)", color: "#fff",
//               border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10,
//               fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all 0.2s",
//             }}
//               onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
//               onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
//               ▶ How it works
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats ribbon */}
//       <div style={{ background: "#fff", borderTop: `4px solid ${C.primary}`, padding: "2.25rem 2rem", flex: 1 }}>
//         <div className="stats-row" style={{
//           maxWidth: 900, margin: "0 auto",
//           display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1.5rem",
//         }}>
//           {[
//             ["50K+", "Active Students",   "#1a56db"],
//             ["1,200+", "Expert Courses",  "#7c3aed"],
//             ["98%", "Satisfaction Rate",  "#059669"],
//             ["200+", "Top Instructors",   "#d97706"],
//           ].map(([num, lbl, color]) => (
//             <div key={lbl} style={{ textAlign: "center" }}>
//               <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color }}>{num}</div>
//               <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 500 }}>{lbl}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── ABOUT ────────────────────────────────────────────────────────────────────

// function AboutSection() {
//   const feats = [
//     ["Expert-curated content",  "Every course reviewed and updated by industry professionals."],
//     ["Self-paced learning",     "Study at your own speed with lifetime access to enrolled courses."],
//     ["Live sessions",           "Join weekly live workshops and Q&A sessions with instructors."],
//     ["Certificates",            "Earn recognized certificates upon completion to boost your career."],
//     ["Community forums",        "Connect with peers, share projects, and get peer feedback."],
//   ];
//   return (
//     <section id="about" style={{ padding: "6rem 2rem", background: "#fff8f2" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <Tag color="#c2410c" bg="#ffedd5">About us</Tag>
//         <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: C.text, marginBottom: 12, letterSpacing: -0.5 }}>Empowering learners worldwide</h2>
//         <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 560, marginBottom: 52 }}>
//           ThinkVerge was built to make quality education accessible to everyone. We combine cutting-edge technology with expert instructors to deliver transformative learning experiences.
//         </p>
//         <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" }}>
//           <div style={{ borderRadius: 22, overflow: "hidden", height: 360, boxShadow: "0 16px 48px rgba(194,65,12,0.12)" }}>
//             <img
//               src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&auto=format&fit=crop"
//               alt="Learning environment"
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             {feats.map(([title, desc]) => (
//               <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//                 <div style={{ width: 24, height: 24, background: "#ffedd5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
//                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="#c2410c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
//                 </div>
//                 <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.65 }}>
//                   <strong style={{ fontWeight: 600, color: C.text }}>{title}</strong> — {desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── MISSION & VISION ─────────────────────────────────────────────────────────

// function MissionSection() {
//   return (
//     <section id="mission" style={{
//       padding: "6rem 2rem",
//       background: "linear-gradient(160deg,#0b1120 0%,#1e1b4b 50%,#0b1120 100%)",
//       position: "relative", overflow: "hidden",
//     }}>
//       <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />
//       <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
//       <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
//         <Tag color="#a5b4fc" bg="rgba(165,180,252,0.15)">Mission & Vision</Tag>
//         <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 52, letterSpacing: -0.5 }}>What drives us forward</h2>
//         <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
//           {[
//             { emoji: "🎯", title: "Our Mission", textColor: "#a5b4fc", borderColor: "rgba(165,180,252,0.25)", bgColor: "rgba(165,180,252,0.07)", body: "To democratize access to quality education by delivering affordable, expert-led courses that empower individuals to grow their skills, advance their careers, and unlock new opportunities — regardless of geography or background." },
//             { emoji: "🔭", title: "Our Vision",  textColor: "#fde68a", borderColor: "rgba(253,230,138,0.25)", bgColor: "rgba(253,230,138,0.06)", body: "A future where every person on the planet has access to a world-class education. We envision a global community of curious, skilled learners who continuously grow, collaborate, and shape a better tomorrow through knowledge." },
//           ].map(({ emoji, title, textColor, borderColor, bgColor, body }) => (
//             <div key={title} style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 22, padding: "2.5rem" }}>
//               <div style={{ fontSize: 36, marginBottom: 18 }}>{emoji}</div>
//               <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: textColor, marginBottom: 14 }}>{title}</h3>
//               <p style={{ fontSize: 15, color: "#c7d2fe", lineHeight: 1.85 }}>{body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

// function HowItWorksSection() {
//   const steps = [
//     { n: "01", title: "Create an account",    desc: "Sign up for free in under 60 seconds. No credit card required to explore courses." },
//     { n: "02", title: "Browse & enroll",      desc: "Discover courses across technology, design, business, and more. Enroll with one click." },
//     { n: "03", title: "Learn at your pace",   desc: "Access video lessons, assignments, and live sessions anytime, on any device." },
//     { n: "04", title: "Earn your certificate",desc: "Complete the course and download your certificate to share on LinkedIn." },
//   ];
//   return (
//     <section id="howitworks" style={{ padding: "6rem 2rem", background: "#f0fdf4" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 56 }}>
//           <Tag color="#065f46" bg="#d1fae5">How it works</Tag>
//           <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Start learning in 4 easy steps</h2>
//         </div>
//         <div className="step-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
//           {steps.map(({ n, title, desc }, i) => (
//             <div key={n} style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2rem 1.5rem", position: "relative" }}>
//               <div style={{ fontSize: 48, fontWeight: 900, color: "#bbf7d0", lineHeight: 1, marginBottom: 14, fontFamily: "'Sora',sans-serif" }}>{n}</div>
//               <div style={{ position: "absolute", top: 18, right: 18, width: 28, height: 28, background: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{i + 1}</span>
//               </div>
//               <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</h3>
//               <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>{desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
// // Fetched from backend; falls back to mock data in development

// const MOCK_TESTIMONIALS = [
//   { id: 1, name: "Priya Sharma",  role: "Frontend Developer", company: "Infosys",    initials: "PS", color: "#6d28d9", bg: "#ede9fe", quote: "ThinkVerge completely changed how I approach learning. The structured courses helped me land my first developer job in just 6 months.", stars: 5 },
//   { id: 2, name: "Rahul Nair",    role: "Data Scientist",     company: "TCS",        initials: "RN", color: "#0369a1", bg: "#e0f2fe", quote: "The data science track is incredibly well-structured. From Python basics to ML models — industry-ready in under a year.", stars: 5 },
//   { id: 3, name: "Divya Menon",   role: "UX Designer",        company: "Wipro",      initials: "DM", color: "#b45309", bg: "#fef3c7", quote: "Instructor feedback on my projects was thoughtful and actionable. I now lead the UX team at my company.", stars: 5 },
//   { id: 4, name: "Karthik Rajan", role: "Backend Engineer",   company: "Zoho",       initials: "KR", color: "#047857", bg: "#d1fae5", quote: "The Node.js and AWS courses are top-notch. Well-paced, real-world examples, and the community forums are incredibly helpful.", stars: 4 },
//   { id: 5, name: "Sneha Iyer",    role: "Product Manager",    company: "Freshworks", initials: "SI", color: "#be123c", bg: "#ffe4e6", quote: "Used ThinkVerge to upskill from engineering to product management. Mentors are genuinely invested in your success.", stars: 5 },
//   { id: 6, name: "Vikram Pillai", role: "DevOps Engineer",    company: "HCL",        initials: "VP", color: "#6d28d9", bg: "#ede9fe", quote: "Best investment I've made in my career. The DevOps certification opened doors I didn't even know existed.", stars: 5 },
// ];

// function useFetchTestimonials() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const ctrl = new AbortController();
//     // ➜ Replace with your real API: fetch("https://api.thinkverge.com/testimonials")
//     fetch("/api/testimonials", { signal: ctrl.signal })
//       .then(r => { if (!r.ok) throw new Error(); return r.json(); })
//       .then(json => { setData(json); setLoading(false); })
//       .catch(err => { if (err.name !== "AbortError") { setData(MOCK_TESTIMONIALS); setLoading(false); } });
//     return () => ctrl.abort();
//   }, []);
//   return { data, loading };
// }

// function TestimonialsSection() {
//   const { data: list, loading } = useFetchTestimonials();
//   const [selected, setSelected] = useState(null);
//   const items = list.length ? list : MOCK_TESTIMONIALS;

//   return (
//     <section id="testimonials" style={{ padding: "6rem 0", background: "#0f172a", overflow: "hidden" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", marginBottom: 44 }}>
//         <Tag color="#fcd34d" bg="rgba(252,211,77,0.12)">Testimonials</Tag>
//         <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 10 }}>What our students say</h2>
//         <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7 }}>Real stories from learners who transformed their careers with ThinkVerge.</p>
//       </div>

//       {loading ? (
//         <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading testimonials…</div>
//       ) : (
//         <div style={{ overflow: "hidden", position: "relative" }}>
//           <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right,#0f172a,transparent)", zIndex: 2, pointerEvents: "none" }} />
//           <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left,#0f172a,transparent)", zIndex: 2, pointerEvents: "none" }} />
//           <div className="test-track" style={{ display: "flex", gap: 20, width: "max-content", padding: "8px 0" }}>
//             {[...items, ...items].map((t, i) => (
//               <div key={i} onClick={() => setSelected(t)}
//                 style={{ width: 310, flexShrink: 0, background: "#1e293b", border: "1px solid #334155", borderRadius: 18, padding: "1.75rem", cursor: "pointer", transition: "all 0.22s" }}
//                 onMouseEnter={e => { e.currentTarget.style.background = "#253347"; e.currentTarget.style.borderColor = "#4f6080"; e.currentTarget.style.transform = "translateY(-4px)"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "none"; }}
//               >
//                 <Stars n={t.stars} />
//                 <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, margin: "12px 0 18px", fontStyle: "italic" }}>"{t.quote}"</p>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                   <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: t.color, flexShrink: 0 }}>{t.initials}</div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{t.name}</div>
//                     <div style={{ fontSize: 12, color: "#64748b" }}>{t.role} · {t.company}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Modal open={!!selected} onClose={() => setSelected(null)} maxWidth={460}>
//         {selected && (
//           <>
//             <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
//               <div style={{ width: 64, height: 64, borderRadius: "50%", background: selected.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: selected.color }}>{selected.initials}</div>
//               <div>
//                 <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{selected.name}</p>
//                 <p style={{ fontSize: 14, color: C.muted, margin: "3px 0 6px" }}>{selected.role} · {selected.company}</p>
//                 <Stars n={selected.stars} />
//               </div>
//             </div>
//             <blockquote style={{ fontSize: 15, color: "#374151", lineHeight: 1.85, borderLeft: `3px solid ${C.primary}`, paddingLeft: 18, margin: "20px 0 0", fontStyle: "italic" }}>"{selected.quote}"</blockquote>
//           </>
//         )}
//       </Modal>
//     </section>
//   );
// }

// // ─── INSTRUCTORS ──────────────────────────────────────────────────────────────
// // Fetched from backend; falls back to mock data in development

// const MOCK_INSTRUCTORS = [
//   { id: 1, name: "Dr. Anjali Mehta",  subject: "Data Science & ML",  initials: "AM", color: "#6d28d9", bg: "#ede9fe", courses: 18, students: 12400, rating: 4.9, bio: "PhD from IIT Bombay. 12 years in AI research at ISRO. Published 30+ papers on machine learning and NLP.", topics: ["Python","TensorFlow","Statistics","NLP"] },
//   { id: 2, name: "Suresh Krishnan",   subject: "Full Stack Dev",      initials: "SK", color: "#0369a1", bg: "#e0f2fe", courses: 12, students: 9800,  rating: 4.8, bio: "15 years as senior engineer at Google and Flipkart. Specialist in React, Node.js, and cloud-native architectures.", topics: ["React","Node.js","AWS","MongoDB"] },
//   { id: 3, name: "Meera Balaji",      subject: "UI/UX Design",        initials: "MB", color: "#b45309", bg: "#fef3c7", courses: 9,  students: 7200,  rating: 4.9, bio: "Lead designer at Adobe for 8 years. Expert in Figma, design systems, and user research methodology.", topics: ["Figma","Prototyping","Research","Accessibility"] },
//   { id: 4, name: "Arun Venkat",       subject: "DevOps & Cloud",      initials: "AV", color: "#047857", bg: "#d1fae5", courses: 14, students: 10100, rating: 4.7, bio: "AWS Certified Solutions Architect. Previously at Amazon Web Services and Mindtree. Loves automating everything.", topics: ["AWS","Docker","Kubernetes","CI/CD"] },
// ];

// function useFetchInstructors() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const ctrl = new AbortController();
//     // ➜ Replace with your real API: fetch("https://api.thinkverge.com/instructors")
//     fetch("/api/instructors", { signal: ctrl.signal })
//       .then(r => { if (!r.ok) throw new Error(); return r.json(); })
//       .then(json => { setData(json); setLoading(false); })
//       .catch(err => { if (err.name !== "AbortError") { setData(MOCK_INSTRUCTORS); setLoading(false); } });
//     return () => ctrl.abort();
//   }, []);
//   return { data, loading };
// }

// function InstructorsSection() {
//   const { data: list, loading } = useFetchInstructors();
//   const [selected, setSelected] = useState(null);
//   const items = list.length ? list : MOCK_INSTRUCTORS;

//   return (
//     <section id="instructors" style={{ padding: "6rem 2rem", background: "#f5f3ff" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <Tag color="#6d28d9" bg="#ede9fe">Instructors</Tag>
//           <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 10 }}>Learn from the best</h2>
//           <p style={{ fontSize: 16, color: C.muted }}>Working professionals with years of real-world industry experience.</p>
//         </div>

//         {loading ? (
//           <div style={{ textAlign: "center", padding: "3rem", color: C.muted }}>Loading instructors…</div>
//         ) : (
//           <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
//             {items.map((ins) => (
//               <div key={ins.id} onClick={() => setSelected(ins)}
//                 style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 20, padding: "2rem 1.5rem", textAlign: "center", cursor: "pointer", transition: "all 0.25s" }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(124,58,237,0.13)"; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
//               >
//                 <div style={{ width: 76, height: 76, borderRadius: "50%", background: ins.bg, color: ins.color, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>{ins.initials}</div>
//                 <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: C.text, margin: "0 0 4px" }}>{ins.name}</p>
//                 <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, marginBottom: 16 }}>{ins.subject}</p>
//                 <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
//                   {[["Courses", ins.courses], ["Students", `${(ins.students / 1000).toFixed(1)}K`], ["Rating", ins.rating]].map(([l, v]) => (
//                     <div key={l}>
//                       <div style={{ fontSize: 15, fontWeight: 700, color: "#7c3aed", fontFamily: "'Sora',sans-serif" }}>{v}</div>
//                       <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{l}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Modal open={!!selected} onClose={() => setSelected(null)} maxWidth={460}>
//         {selected && (
//           <>
//             <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
//               <div style={{ width: 64, height: 64, borderRadius: "50%", background: selected.bg, color: selected.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>{selected.initials}</div>
//               <div>
//                 <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{selected.name}</p>
//                 <p style={{ fontSize: 14, color: "#7c3aed", fontWeight: 600, margin: "3px 0 0" }}>{selected.subject}</p>
//               </div>
//             </div>
//             <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>{selected.bio}</p>
//             <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
//               {[["Courses", selected.courses], ["Students", `${(selected.students / 1000).toFixed(1)}K`], ["Rating", selected.rating]].map(([l, v]) => (
//                 <div key={l} style={{ flex: 1, textAlign: "center", background: "#f5f3ff", borderRadius: 12, padding: "14px 8px" }}>
//                   <div style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed", fontFamily: "'Sora',sans-serif" }}>{v}</div>
//                   <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{l}</div>
//                 </div>
//               ))}
//             </div>
//             <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>Topics covered</p>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//               {selected.topics.map(t => <span key={t} style={{ background: "#ede9fe", color: "#5b21b6", padding: "5px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500 }}>{t}</span>)}
//             </div>
//           </>
//         )}
//       </Modal>
//     </section>
//   );
// }

// // ─── FAQ ──────────────────────────────────────────────────────────────────────

// const FAQS = [
//   { q: "Is ThinkVerge free to use?",                    a: "Yes! Sign up for free and explore beginner courses at no cost. Premium courses and certificates start at ₹499/month." },
//   { q: "Do I get a certificate after completing a course?", a: "Every completed course earns you a shareable digital certificate you can add to LinkedIn or your resume." },
//   { q: "Can I learn at my own pace?",                   a: "All courses are self-paced with lifetime access. Watch videos, complete assignments, and revisit content whenever you want." },
//   { q: "Are the instructors verified professionals?",   a: "Every ThinkVerge instructor is a working professional with at least 5 years of industry experience, vetted by our team." },
//   { q: "What devices can I use ThinkVerge on?",         a: "ThinkVerge works on all devices — desktop, tablet, and mobile. We also have dedicated iOS and Android apps." },
//   { q: "How do live sessions work?",                    a: "Live sessions are scheduled weekly by instructors. Join via video, ask questions in real time, and access recordings if you miss them." },
// ];

// function FAQSection() {
//   const [open, setOpen] = useState(null);
//   return (
//     <section id="faq" style={{ padding: "6rem 2rem", background: "#fffbeb" }}>
//       <div style={{ maxWidth: 760, margin: "0 auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <Tag color="#92400e" bg="#fef3c7">FAQ</Tag>
//           <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Frequently asked questions</h2>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {FAQS.map((f, i) => (
//             <div key={i} style={{ background: "#fff", border: `1px solid ${open === i ? "#fcd34d" : "#fde68a"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
//               <button onClick={() => setOpen(open === i ? null : i)} style={{
//                 width: "100%", textAlign: "left", padding: "18px 24px",
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//                 fontSize: 15, fontWeight: 600, color: C.text,
//                 background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
//               }}>
//                 <span>{f.q}</span>
//                 <span style={{ fontSize: 22, color: "#f59e0b", transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>+</span>
//               </button>
//               {open === i && <div style={{ padding: "0 24px 18px", fontSize: 14.5, color: C.muted, lineHeight: 1.8 }}>{f.a}</div>}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── CONTACT ─────────────────────────────────────────────────────────────────

// function ContactSection() {
//   const [sent, setSent] = useState(false);
//   const infos = [
//     { emoji: "✉️", title: "Email us",   value: "hello@thinkverge.com",  sub: "We reply within 24 hours" },
//     { emoji: "📞", title: "Call us",    value: "+91 98765 43210",        sub: "Mon–Sat, 9am–6pm IST" },
//     { emoji: "📍", title: "Visit us",   value: "Chennai, Tamil Nadu",    sub: "India" },
//     { emoji: "💬", title: "Live chat",  value: "Available in-app",       sub: "Instant student support" },
//   ];
//   const iStyle = {
//     width: "100%", padding: "11px 14px",
//     border: "1.5px solid #bae6fd", borderRadius: 10,
//     fontSize: 14, fontFamily: "'DM Sans',sans-serif",
//     outline: "none", background: "#fff", color: C.text,
//     transition: "border-color 0.2s", boxSizing: "border-box",
//   };
//   const focus = (e) => { e.target.style.borderColor = C.primary; };
//   const blur  = (e) => { e.target.style.borderColor = "#bae6fd"; };

//   return (
//     <section id="contact" style={{ padding: "6rem 2rem", background: "#f0f9ff" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>

//         {/* Header */}
//         <div style={{ textAlign: "center", marginBottom: 56 }}>
//           <Tag color="#075985" bg="#e0f2fe">Contact us</Tag>
//           <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 12 }}>We'd love to hear from you</h2>
//           <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Whether you have a question, partnership idea, or just want to say hi — our team is here for you.</p>
//         </div>

//         {/* Info cards */}
//         <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 52 }}>
//           {infos.map(({ emoji, title, value, sub }) => (
//             <div key={title}
//               style={{ background: "#fff", border: "1px solid #bae6fd", borderRadius: 18, padding: "1.6rem 1.25rem", textAlign: "center", transition: "all 0.2s" }}
//               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(3,105,161,0.1)"; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
//             >
//               <div style={{ fontSize: 30, marginBottom: 10 }}>{emoji}</div>
//               <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 5 }}>{title}</p>
//               <p style={{ fontSize: 14, color: "#0369a1", fontWeight: 500, marginBottom: 3 }}>{value}</p>
//               <p style={{ fontSize: 12, color: C.muted }}>{sub}</p>
//             </div>
//           ))}
//         </div>

//         {/* Form + Sidebar */}
//         <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 36, alignItems: "start" }}>

//           {/* Form */}
//           <div style={{ background: "#fff", border: "1px solid #bae6fd", borderRadius: 24, padding: "2.5rem", boxShadow: "0 8px 32px rgba(3,105,161,0.06)" }}>
//             <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 26 }}>Send us a message</h3>
//             {sent ? (
//               <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
//                 <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
//                 <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 19, fontWeight: 700, color: "#065f46", marginBottom: 8 }}>Message sent!</p>
//                 <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>We'll get back to you within 24 hours.</p>
//                 <button onClick={() => setSent(false)} style={{ fontSize: 14, color: C.primary, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif" }}>Send another message</button>
//               </div>
//             ) : (
//               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//                   {[["First name","Arjun"],["Last name","Kumar"]].map(([l,p]) => (
//                     <label key={l} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//                       {l}
//                       <input type="text" placeholder={p} style={iStyle} onFocus={focus} onBlur={blur} />
//                     </label>
//                   ))}
//                 </div>
//                 <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//                   Email address
//                   <input type="email" placeholder="arjun@example.com" style={iStyle} onFocus={focus} onBlur={blur} />
//                 </label>
//                 <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//                   Subject
//                   <select style={{ ...iStyle }}>
//                     <option>General inquiry</option>
//                     <option>Course question</option>
//                     <option>Partnership</option>
//                     <option>Technical support</option>
//                   </select>
//                 </label>
//                 <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//                   Message
//                   <textarea rows={5} placeholder="Tell us how we can help…" style={{ ...iStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} />
//                 </label>
//                 <button onClick={() => setSent(true)} style={{
//                   padding: 14, background: "linear-gradient(135deg,#0369a1,#1a56db)", color: "#fff",
//                   border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
//                   cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "opacity 0.2s",
//                 }}
//                   onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
//                   Send message →
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             {/* Office photo */}
//             <div style={{ borderRadius: 20, overflow: "hidden", height: 220, position: "relative", boxShadow: "0 8px 28px rgba(3,105,161,0.1)" }}>
//               <img
//                 src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop"
//                 alt="ThinkVerge office"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//               <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(3,105,161,0.65),transparent)" }} />
//               <div style={{ position: "absolute", bottom: 16, left: 18 }}>
//                 <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>ThinkVerge HQ</p>
//                 <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Chennai, Tamil Nadu, India</p>
//               </div>
//             </div>

//             {/* Social */}
//             <div style={{ background: "#fff", border: "1px solid #bae6fd", borderRadius: 18, padding: "1.5rem 1.5rem" }}>
//               <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Connect with us</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                 {[
//                   ["𝕏 Twitter",   "#e7f5ff","#0369a1"],
//                   ["in LinkedIn",  "#e0f2fe","#0369a1"],
//                   ["▶ YouTube",   "#fff0f0","#dc2626"],
//                   ["◈ Instagram", "#fdf2f8","#9333ea"],
//                 ].map(([name, bg, color]) => (
//                   <span key={name} style={{
//                     display: "inline-flex", alignItems: "center", gap: 6,
//                     padding: "7px 14px", background: bg, borderRadius: 9,
//                     fontSize: 13, fontWeight: 600, color, cursor: "pointer", transition: "opacity 0.2s",
//                   }}
//                     onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
//                     onMouseLeave={e => e.currentTarget.style.opacity = "1"}
//                   >{name}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Quick support */}
//             <div style={{ background: "linear-gradient(135deg,#0369a1,#1a56db)", borderRadius: 18, padding: "1.5rem", color: "#fff" }}>
//               <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Need help right now?</p>
//               <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 14 }}>Our support team is available Mon–Sat 9am–6pm IST for live assistance.</p>
//               <button style={{ padding: "9px 20px", background: "rgba(255,255,255,0.18)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
//                 Start live chat →
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── FOOTER ───────────────────────────────────────────────────────────────────

// function Footer() {
//   const cols = [
//     { heading: "Platform", links: ["Courses","Instructors","Certifications","Live sessions","Community","Dashboard"] },
//     { heading: "Company",  links: ["About us","Careers","Blog","Press","Investors"] },
//     { heading: "Support",  links: ["Help centre","Contact us","Privacy policy","Terms of service","Cookie policy"] },
//   ];

//   return (
//     <footer style={{ background: "#020617" }}>
//       {/* Wave */}
//       <div style={{ background: "#f0f9ff", height: 44, position: "relative", overflow: "hidden" }}>
//         <svg viewBox="0 0 1440 44" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}>
//           <path d="M0,44 C360,0 1080,44 1440,0 L1440,44 Z" fill="#020617"/>
//         </svg>
//       </div>

//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 2rem" }}>
//         {/* Main grid */}
//         <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 40, marginBottom: 52 }}>

//           {/* Brand */}
//           <div>
//             <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//               style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
//               <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#1a56db,#6366f1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 6h12M4 10h8M4 13h10" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/></svg>
//               </div>
//               <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>ThinkVerge</span>
//             </div>
//             <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 24, maxWidth: 280 }}>
//               The modern LMS platform for learners and educators who want more from online education. Trusted by 50,000+ students across India.
//             </p>

//             {/* Newsletter */}
//             <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 10, fontFamily: "'Sora',sans-serif" }}>Get weekly learning tips</p>
//             <div style={{ display: "flex" }}>
//               <input type="email" placeholder="your@email.com" style={{
//                 flex: 1, padding: "10px 14px",
//                 border: "1px solid #1e293b", borderRight: "none",
//                 borderRadius: "9px 0 0 9px", background: "#0f172a",
//                 color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none",
//               }} />
//               <button style={{
//                 padding: "10px 18px", background: C.primary, color: "#fff",
//                 border: "none", borderRadius: "0 9px 9px 0",
//                 fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif",
//               }}>Subscribe</button>
//             </div>
//           </div>

//           {/* Link columns */}
//           {cols.map(({ heading, links }) => (
//             <div key={heading}>
//               <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 18, letterSpacing: "0.08em", textTransform: "uppercase" }}>{heading}</h4>
//               <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
//                 {links.map(item => (
//                   <li key={item}>
//                     <a href="#" style={{ fontSize: 14, color: "#334155", textDecoration: "none", transition: "color 0.2s" }}
//                       onMouseEnter={e => e.target.style.color = "#f1f5f9"} onMouseLeave={e => e.target.style.color = "#334155"}>{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Divider */}
//         <div style={{ borderTop: "1px solid #0f172a", marginBottom: 28 }} />

//         {/* Bottom bar */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
//           <div>
//             <p style={{ fontSize: 13, color: "#334155" }}>© 2025 ThinkVerge Technologies Pvt. Ltd. All rights reserved.</p>
//             <p style={{ fontSize: 12, color: "#1e293b", marginTop: 4 }}>Made with ❤️ in Chennai, India</p>
//           </div>
//           <div style={{ display: "flex", gap: 10 }}>
//             {[
//               { label: "Twitter",  d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195A4.929 4.929 0 0016.08 2.8c-2.74 0-4.96 2.22-4.96 4.96 0 .39.044.766.128 1.128C7.69 8.664 4.066 6.7 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.19 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z" },
//               { label: "LinkedIn", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
//               { label: "YouTube",  d: "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
//             ].map(({ label, d }) => (
//               <a key={label} href="#" title={label} style={{
//                 width: 36, height: 36, background: "#0f172a",
//                 border: "1px solid #1e293b", borderRadius: 9,
//                 display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
//               }}
//                 onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.borderColor = C.primary; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#1e293b"; }}
//               >
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="#64748b"><path d={d}/></svg>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// // ─── SCROLL TO TOP ────────────────────────────────────────────────────────────

// function ScrollTop() {
//   const [vis, setVis] = useState(false);
//   useEffect(() => {
//     const fn = () => setVis(window.scrollY > 500);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);
//   if (!vis) return null;
//   return (
//     <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
//       position: "fixed", bottom: 28, right: 28, width: 46, height: 46,
//       background: "linear-gradient(135deg,#1a56db,#6366f1)",
//       border: "none", borderRadius: "50%",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       cursor: "pointer", zIndex: 250,
//       boxShadow: "0 6px 20px rgba(26,86,219,0.4)", transition: "transform 0.2s",
//     }}
//       onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.07)"}
//       onMouseLeave={e => e.currentTarget.style.transform = "none"}
//     >
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
//     </button>
//   );
// }

// // ─── AUTH MODALS ──────────────────────────────────────────────────────────────

// function AuthModal({ type, open, onClose, onSwitch }) {
//   const isLogin = type === "login";
//   const iStyle = {
//     width: "100%", padding: "11px 14px",
//     border: "1.5px solid #e2e8f0", borderRadius: 10,
//     fontSize: 14, fontFamily: "'DM Sans',sans-serif",
//     outline: "none", color: C.text, background: "#fff",
//     transition: "border-color 0.2s", boxSizing: "border-box",
//   };
//   const focus = (e) => e.target.style.borderColor = C.primary;
//   const blur  = (e) => e.target.style.borderColor = "#e2e8f0";

//   return (
//     <Modal open={open} onClose={onClose} maxWidth={400}>
//       <div style={{ textAlign: "center", marginBottom: 28 }}>
//         <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#1a56db,#6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
//         </div>
//         <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>
//           {isLogin ? "Welcome back" : "Join ThinkVerge"}
//         </h3>
//         <p style={{ fontSize: 14, color: C.muted }}>{isLogin ? "Log in to continue your learning journey" : "Start learning for free today"}</p>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//         {!isLogin && (
//           <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//             Full name
//             <input type="text" placeholder="Arjun Kumar" style={iStyle} onFocus={focus} onBlur={blur} />
//           </label>
//         )}
//         <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//           Email address
//           <input type="email" placeholder="you@example.com" style={iStyle} onFocus={focus} onBlur={blur} />
//         </label>
//         <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>
//           Password
//           <input type="password" placeholder="••••••••" style={iStyle} onFocus={focus} onBlur={blur} />
//         </label>
//         <button style={{
//           padding: 13, marginTop: 4,
//           background: "linear-gradient(135deg,#1a56db,#6366f1)", color: "#fff",
//           border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
//           cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "opacity 0.2s",
//         }}
//           onMouseEnter={e => e.currentTarget.style.opacity = "0.88"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
//           {isLogin ? "Log in →" : "Create account →"}
//         </button>
//         <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 4 }}>
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <span onClick={onSwitch} style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}>
//             {isLogin ? "Sign up" : "Log in"}
//           </span>
//         </p>
//       </div>
//     </Modal>
//   );
// }

// // ─── ROOT ─────────────────────────────────────────────────────────────────────

// export default function LandingPage() {
//   const [authModal, setAuthModal] = useState(null);
//   return (
//     <>
//       <FontLoader />
//       <Navbar
//         onLogin={()  => setAuthModal("login")}
//         onSignup={() => setAuthModal("signup")}
//       />
//       <HeroSection       onSignup={() => setAuthModal("signup")} />
//       <AboutSection />
//       <MissionSection />
//       <HowItWorksSection />
//       <TestimonialsSection />
//       <InstructorsSection />
//       <FAQSection />
//       <ContactSection />
//       <Footer />
//       <ScrollTop />
//       <AuthModal
//         type={authModal}
//         open={!!authModal}
//         onClose={() => setAuthModal(null)}
//         onSwitch={() => setAuthModal(a => a === "login" ? "signup" : "login")}
//       />
//     </>
//   );
// }