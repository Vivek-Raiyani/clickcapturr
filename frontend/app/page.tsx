"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  accentClass,
}: {
  icon: string;
  title: string;
  description: string;
  accentClass: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "1.25rem",
      padding: "1.75rem",
      transition: "all 0.3s",
    }}>
      <div style={{
        width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.25rem", marginBottom: "1.25rem",
        background: accentClass,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: "rgba(255,251,242,0.5)", lineHeight: 1.65 }}>{description}</p>
    </div>
  );
}

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"signin" | "signup">("signin");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openAuthModal = (view: "signin" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  // Shared button styles
  const btnPrimary: React.CSSProperties = {
    background: "var(--yellow)", color: "var(--black)",
    padding: "0.875rem 2rem", borderRadius: "999px",
    fontSize: "1rem", fontWeight: 700, cursor: "pointer", border: "none",
    transition: "all 0.25s", display: "inline-flex", alignItems: "center",
    textDecoration: "none",
  };
  const btnGhost: React.CSSProperties = {
    background: "transparent", border: "1px solid rgba(255,251,242,0.25)",
    color: "var(--cream)", padding: "0.875rem 2rem", borderRadius: "999px",
    fontSize: "1rem", fontWeight: 500, cursor: "pointer",
    transition: "all 0.25s", display: "inline-flex", alignItems: "center",
    textDecoration: "none",
  };

  return (
    <>
      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.4); } }
        @keyframes float-up   { 0%,100% { transform:translateY(0);  } 50% { transform:translateY(-10px); } }
        .lp-nav-btn-primary { background:var(--yellow); color:var(--black); padding:0.5rem 1.25rem; border-radius:999px; font-size:0.875rem; font-weight:700; cursor:pointer; border:none; transition:all 0.2s; text-decoration:none; }
        .lp-nav-btn-primary:hover { filter:brightness(1.1); }
        .lp-nav-btn-ghost { background:transparent; border:1px solid rgba(255,251,242,0.2); color:var(--cream); padding:0.5rem 1.25rem; border-radius:999px; font-size:0.875rem; font-weight:500; cursor:pointer; transition:all 0.2s; text-decoration:none; }
        .lp-nav-btn-ghost:hover { border-color:var(--cream); }
        .lp-feature-card:hover { border-color:rgba(255,255,255,0.18) !important; transform:translateY(-4px); }
        .lp-testimonial-card:hover { border-color:rgba(255,255,255,0.18) !important; }
        .lp-campaign-card:hover { border-color:rgba(255,255,255,0.18) !important; transform:translateX(4px); }
        .lp-qr-card:hover { border-color:rgba(254,220,135,0.5) !important; transform:scale(1.05); }
        .lp-pricing-card:hover { transform:translateY(-6px); }
        .lp-btn-primary-lg:hover { filter:brightness(1.1); transform:translateY(-2px); box-shadow:0 12px 32px rgba(254,220,135,0.4); }
        .lp-btn-ghost-lg:hover { border-color:var(--cream) !important; background:rgba(255,251,242,0.06) !important; }
        .lp-nav-link { color:rgba(255,251,242,0.6); font-size:0.875rem; font-weight:500; text-decoration:none; transition:color 0.2s; }
        .lp-nav-link:hover { color:var(--cream); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--cream)", fontFamily: "var(--font-geist-sans), sans-serif" }}>

        {/* ── Nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 2.5rem", height: "4.5rem",
          background: scrolled ? "rgba(26,26,26,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
          transition: "all 0.3s",
        }}>
          <a href="/" style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--cream)", textDecoration: "none" }}>
            Click<span style={{ color: "var(--yellow)" }}>Capturr</span>
          </a>
          <div style={{ display: "flex", gap: "2rem" }}>
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how-it-works" className="lp-nav-link">How It Works</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {!isLoading && user ? (
              <>
                <Link href="/dashboard" className="lp-nav-btn-ghost">Dashboard</Link>
                <button onClick={logout} className="lp-nav-btn-primary">Sign Out</button>
              </>
            ) : !isLoading && (
              <>
                <button onClick={() => openAuthModal("signin")} className="lp-nav-btn-ghost">Sign In</button>
                <button onClick={() => openAuthModal("signup")} className="lp-nav-btn-primary">Get Started Free</button>
              </>
            )}
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{
          paddingTop: "9rem", paddingBottom: "5rem",
          maxWidth: "78rem", margin: "0 auto", padding: "9rem 2.5rem 5rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center",
        }}>
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(254,220,135,0.1)", border: "1px solid rgba(254,220,135,0.3)",
              color: "var(--yellow)", padding: "0.3rem 0.9rem", borderRadius: "999px",
              fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", animation: "pulse-dot 2s infinite" }} />
              Smart QR Campaigns
            </div>
            <h1 style={{
              fontFamily: "var(--font-bespoke-serif), serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.03em",
              marginBottom: "1.5rem", color: "var(--cream)",
            }}>
              Capture leads with <em style={{ fontStyle: "italic", color: "var(--yellow)" }}>smart</em> links &amp; QR codes
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,251,242,0.6)", lineHeight: 1.7, maxWidth: "28rem", marginBottom: "2.5rem" }}>
              Create stunning landing pages, trackable QR codes, and smart campaigns — then watch your leads and analytics roll in.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {user ? (
                <Link href="/dashboard" className="lp-btn-primary-lg" style={btnPrimary}>Go to Dashboard →</Link>
              ) : (
                <button onClick={() => openAuthModal("signup")} className="lp-btn-primary-lg" style={btnPrimary}>Start for Free →</button>
              )}
              <Link href="/pricing" className="lp-btn-ghost-lg" style={btnGhost}>See Pricing</Link>
            </div>
            {/* Social proof */}
            <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex" }}>
                {["MK","RJ","AL","SB"].map((init, i) => (
                  <div key={init} style={{
                    width: "2rem", height: "2rem", borderRadius: "50%",
                    border: "2px solid var(--black)", marginLeft: i === 0 ? 0 : "-0.5rem",
                    background: "var(--charcoal)", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--cream)",
                  }}>{init}</div>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,251,242,0.5)" }}>
                <strong style={{ color: "var(--cream)" }}>2,400+</strong> marketers trust ClickCapturr
              </p>
            </div>
          </div>

          {/* Hero Mockup */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1.5rem", padding: "1.5rem",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Topbar */}
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", alignItems: "center" }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 24, display: "flex", alignItems: "center", padding: "0 0.75rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                  clickcapturr.io/s/abc123
                </div>
              </div>
              {/* Stats card */}
              <div style={{ background: "linear-gradient(135deg,#1e1e1e,#2a2a2a)", borderRadius: "1rem", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "linear-gradient(135deg,var(--burgundy),var(--rose))" }} />
                  <div>
                    <div style={{ height: 10, background: "rgba(255,255,255,0.15)", borderRadius: 4, width: "8rem", marginBottom: 4 }} />
                    <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, width: "5rem" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" }}>
                  {[["1,240","Clicks"],["89","Scans"],["312","Leads"]].map(([v, l]) => (
                    <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "0.5rem", padding: "0.6rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--yellow)", marginBottom: 2 }}>{v}</div>
                      <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* QR + Links */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ width: 72, height: 72, borderRadius: "0.75rem", background: "linear-gradient(135deg,var(--sage),#b6d48a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", color: "var(--black)", fontWeight: 700, textAlign: "center", flexShrink: 0 }}>QR<br/>Code</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, height: 26, display: "flex", alignItems: "center", padding: "0 0.6rem", gap: "0.4rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--burgundy)", flexShrink: 0 }} />
                      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", flex: 1 }} />
                      <div style={{ height: 14, width: 28, borderRadius: 3, background: "rgba(254,220,135,0.15)", flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div style={{
              position: "absolute", top: "-1rem", right: "-2rem",
              background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem", padding: "0.6rem 1rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              animation: "float-up 4s ease-in-out infinite",
            }}>
              <span style={{ fontSize: "1rem" }}>⚡</span>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>+24 clicks</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,251,242,0.5)" }}>last hour</div>
              </div>
            </div>
            <div style={{
              position: "absolute", bottom: "2rem", left: "-2rem",
              background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem", padding: "0.6rem 1rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              animation: "float-up 4s ease-in-out infinite 2s",
            }}>
              <span style={{ fontSize: "1rem" }}>📱</span>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>QR Scanned</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,251,242,0.5)" }}>Mumbai, IN</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trusted By ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem" }}>
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "rgba(255,251,242,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.75rem" }}>Trusted by marketers at</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
            {["Notion","Shopify","Mailchimp","HubSpot","Canva","Stripe"].map(brand => (
              <span key={brand} style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,251,242,0.18)", letterSpacing: "-0.02em" }}>{brand}</span>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <section id="features" style={{ padding: "7rem 2.5rem" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>Features</p>
            <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "1rem" }}>
              Everything you need to capture &amp; convert
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,251,242,0.55)", maxWidth: "38rem", lineHeight: 1.7, marginBottom: "3.5rem" }}>
              From a single QR code to a full multi-channel campaign — ClickCapturr handles it all in one elegant platform.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {[
                { icon: "🔗", title: "Smart Short Links",    desc: "Generate branded short links that track clicks, locations, and devices. Share anywhere and watch the data pour in.",        accent: "rgba(254,220,135,0.15)" },
                { icon: "▦",  title: "Custom QR Codes",     desc: "Design stunning QR codes with your brand colors, logos, and patterns. Solid, gradient, dots — you choose the style.",      accent: "rgba(218,233,196,0.15)" },
                { icon: "📄", title: "Landing Pages",       desc: "Build beautiful, conversion-focused landing pages with a drag-and-drop editor. No code needed.",                           accent: "rgba(224,204,203,0.15)" },
                { icon: "📣", title: "Campaigns",           desc: "Bundle links and pages into campaigns to track their collective performance. Perfect for product launches.",                 accent: "rgba(136,79,78,0.25)"  },
                { icon: "👥", title: "Lead Capture",        desc: "Embed contact forms on your pages and automatically save every lead. Export contacts with one click.",                      accent: "rgba(100,149,237,0.15)" },
                { icon: "📊", title: "Deep Analytics",      desc: "Real-time dashboards with click maps, device breakdowns, and platform stats. Know your audience.",                          accent: "rgba(56,178,172,0.15)"  },
              ].map(({ icon, title, desc, accent }) => (
                <div key={title} className="lp-feature-card" style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.25rem", padding: "1.75rem", transition: "all 0.3s",
                }}>
                  <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1.25rem", background: accent }}>{icon}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.5rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,251,242,0.5)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" style={{ padding: "7rem 2.5rem", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>How It Works</p>
            <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "1rem" }}>Live in under 5 minutes</h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,251,242,0.55)", maxWidth: "38rem", lineHeight: 1.7, marginBottom: "4rem" }}>No complicated setup. Just create, share, and track.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }}>
              {[
                { n: "01", title: "Create Your Page",       desc: "Design a beautiful landing page with our editor. Add your brand colors, content blocks, and lead forms." },
                { n: "02", title: "Generate Links & QR",    desc: "Get your smart short link and a stunning custom QR code automatically generated for each page." },
                { n: "03", title: "Track & Convert",        desc: "Share everywhere. Watch real-time analytics flow in. Capture leads. Grow your audience." },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "rgba(254,220,135,0.1)", border: "1px solid rgba(254,220,135,0.3)", color: "var(--yellow)", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>{n}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.75rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,251,242,0.5)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ padding: "5rem 2.5rem", background: "var(--yellow)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }}>
            {[
              { target: 2400,    suffix: "+", label: "Active Users"       },
              { target: 18000,   suffix: "+", label: "QR Codes Generated" },
              { target: 4500000, suffix: "+", label: "Clicks Tracked"     },
              { target: 98,      suffix: "%", label: "Uptime SLA"         },
            ].map(({ target, suffix, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "3rem", fontWeight: 700, color: "var(--black)", lineHeight: 1, marginBottom: "0.5rem" }}>
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(26,26,26,0.6)" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QR Showcase ── */}
        <section style={{ padding: "7rem 2.5rem" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>QR Customization</p>
              <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "1rem" }}>QR codes that actually look good</h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,251,242,0.55)", lineHeight: 1.7, marginBottom: "2rem" }}>Ditch the ugly black-and-white squares. Design QR codes that match your brand with gradients, logos, and custom patterns.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["Solid & gradient color palettes","Squares, dots, and circle patterns","Rounded, square, or circular shapes","Embed your logo in the center","Custom background images with opacity"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "rgba(255,251,242,0.7)" }}>
                    <span style={{ color: "var(--yellow)", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
              {[
                { label: "Classic",   bg: "linear-gradient(135deg,#1a1a1a,#333)",                                icon: "▦", active: false },
                { label: "Gradient",  bg: "linear-gradient(135deg,var(--burgundy),var(--rose))",                 icon: "◈", active: true  },
                { label: "Dots",      bg: "linear-gradient(135deg,var(--sage),#a0c46a)",                         icon: "⬟", active: false },
                { label: "Rounded",   bg: "linear-gradient(135deg,#4a90d9,#7b68ee)",                             icon: "◻", active: false },
                { label: "Logo",      bg: "linear-gradient(135deg,#2d2d2d,#444)",                                icon: "⊕", active: false },
                { label: "Custom BG", bg: "linear-gradient(135deg,#3d1f3f,#6b3c6b)",                            icon: "◈", active: false },
              ].map(({ label, bg, icon, active }) => (
                <div key={label} className="lp-qr-card" style={{
                  background: active ? "rgba(254,220,135,0.06)" : "var(--charcoal)",
                  border: `1px solid ${active ? "rgba(254,220,135,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "1rem", padding: "1rem", textAlign: "center", transition: "all 0.3s", cursor: "pointer",
                }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: "0.5rem", background: bg, marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "2rem" }}>{icon}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,251,242,0.5)", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Campaigns ── */}
        <section style={{ padding: "7rem 2.5rem", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { name: "Summer Product Launch",   meta: "3 pages · 5 links", val: "4,821", bg: "linear-gradient(135deg,var(--yellow),#f5a623)",       emoji: "🚀" },
                { name: "Instagram Bio Campaign",  meta: "1 page · 2 links",  val: "2,103", bg: "linear-gradient(135deg,var(--rose),var(--burgundy))",   emoji: "📸" },
                { name: "Email Newsletter Drive",  meta: "2 pages · 4 links", val: "6,540", bg: "linear-gradient(135deg,var(--sage),#7bc47f)",           emoji: "✉️" },
              ].map(({ name, meta, val, bg, emoji }) => (
                <div key={name} className="lp-campaign-card" style={{
                  background: "var(--charcoal)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.25rem", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", transition: "all 0.25s",
                }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>{emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.25rem" }}>{name}</div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(255,251,242,0.4)" }}>{meta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--yellow)" }}>{val}</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,251,242,0.35)" }}>total clicks</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>Campaigns</p>
              <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "1rem" }}>Run multi-channel campaigns effortlessly</h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,251,242,0.55)", lineHeight: 1.7, marginBottom: "2rem" }}>Group your pages and links into campaigns. Track combined performance, manage leads, and see which channels convert best.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["Bundle multiple pages and links","Unified analytics dashboard","Per-campaign lead capture","Share with your team","Export full campaign reports"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "rgba(255,251,242,0.7)" }}>
                    <span style={{ color: "var(--yellow)", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ padding: "7rem 2.5rem" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>Testimonials</p>
            <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "3rem" }}>Loved by marketers &amp; creators</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {[
                { text: "ClickCapturr completely changed how I run campaigns. The QR code designer alone is worth it — my clients are blown away every time.",             name: "Priya Mehta",   role: "Marketing Consultant",  init: "PM", color: "var(--sage)"    },
                { text: "I set up a full landing page with lead capture in 10 minutes. Got 80 leads in the first day of my product launch. Absolutely incredible.",          name: "Jordan Lee",    role: "Indie Founder",         init: "JL", color: "var(--yellow)"  },
                { text: "The analytics are insane. I can see exactly where my audience comes from, what device they use, and how many scanned vs clicked.",                 name: "Aisha Rauf",    role: "Content Creator",       init: "AR", color: "var(--rose)"    },
                { text: "Finally a tool that doesn't feel like it was designed in 2012. ClickCapturr is beautiful and the UX is buttery smooth.",                            name: "Marcus Webb",   role: "Brand Strategist",      init: "MW", color: "var(--burgundy)" },
                { text: "Replaced 3 separate tools with just ClickCapturr. QR, landing pages, and lead management all in one place. My workflow is so much cleaner.",      name: "Tanvi Sharma",  role: "Growth Marketer",       init: "TS", color: "var(--charcoal)" },
                { text: "The campaign feature is a game changer. I can see ROI of each campaign at a glance without digging through spreadsheets.",                         name: "Chris O'Brien", role: "E-commerce Manager",    init: "CO", color: "var(--sage)"    },
              ].map(({ text, name, role, init, color }) => (
                <div key={name} className="lp-testimonial-card" style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.25rem", padding: "1.75rem", transition: "all 0.3s",
                }}>
                  <div style={{ color: "var(--yellow)", fontSize: "0.85rem", marginBottom: "1rem" }}>★★★★★</div>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,251,242,0.75)", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic" }}>"{text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "var(--black)", flexShrink: 0 }}>{init}</div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cream)" }}>{name}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,251,242,0.4)" }}>{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" style={{ padding: "7rem 2.5rem", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "1rem" }}>Pricing</p>
            <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--cream)", marginBottom: "3.5rem" }}>Simple, transparent pricing</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
              {[
                {
                  tier: "Free", price: "$0", period: "/mo", desc: "Perfect for getting started",
                  features: ["3 Landing Pages","Unlimited Contacts","100 MB Storage","Basic Analytics"],
                  featured: false, btnLabel: "Get Started Free",
                },
                {
                  tier: "Pro", price: "$29", period: "/mo", desc: "For serious marketers",
                  features: ["50 Landing Pages","Unlimited Contacts","1 GB Storage","Advanced Analytics","1 Campaign"],
                  featured: true, btnLabel: "Start Pro Trial",
                },
                {
                  tier: "Studio", price: "$99", period: "/mo", desc: "For agencies & power users",
                  features: ["Unlimited Pages","Unlimited Contacts","10 GB Storage","Advanced Analytics","10 Campaigns"],
                  featured: false, btnLabel: "Go Studio",
                },
              ].map(({ tier, price, period, desc, features, featured, btnLabel }) => (
                <div key={tier} className="lp-pricing-card" style={{
                  position: "relative",
                  background: featured ? "rgba(254,220,135,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${featured ? "rgba(254,220,135,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "1.5rem", padding: "2.25rem", transition: "all 0.3s",
                }}>
                  {featured && (
                    <div style={{
                      position: "absolute", top: "-0.75rem", left: "50%", transform: "translateX(-50%)",
                      background: "var(--yellow)", color: "var(--black)",
                      padding: "0.2rem 0.85rem", borderRadius: "999px",
                      fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>Most Popular</div>
                  )}
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,242,0.5)", marginBottom: "1rem" }}>{tier}</div>
                  <div style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "3rem", fontWeight: 500, color: "var(--cream)", lineHeight: 1, marginBottom: "0.25rem" }}>
                    {price}<span style={{ fontSize: "1rem", color: "rgba(255,251,242,0.4)" }}>{period}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,251,242,0.45)", marginBottom: "1.75rem", marginTop: "0.5rem" }}>{desc}</div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                    {features.map(f => (
                      <li key={f} style={{ fontSize: "0.875rem", color: "rgba(255,251,242,0.65)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--yellow)", fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openAuthModal("signup")}
                    style={{
                      background: featured ? "var(--yellow)" : "transparent",
                      color: featured ? "var(--black)" : "var(--cream)",
                      border: featured ? "none" : "1px solid rgba(255,255,255,0.2)",
                      width: "100%", padding: "0.75rem", borderRadius: "999px",
                      fontWeight: featured ? 700 : 600, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s",
                    }}
                  >{btnLabel}</button>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "rgba(255,251,242,0.3)" }}>
              All plans include custom QR codes, smart short links, and lead capture. No credit card required for Free plan.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          padding: "8rem 2.5rem", textAlign: "center",
          background: "linear-gradient(135deg,#1a1a1a 0%,#2a1f1f 50%,#1a1a1a 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", width: "40rem", height: "40rem", borderRadius: "50%",
            background: "radial-gradient(ellipse,rgba(136,79,78,0.18) 0%,transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
          }} />
          <div style={{ maxWidth: "48rem", margin: "0 auto", position: "relative" }}>
            <h2 style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 500, color: "var(--cream)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
              Ready to capture your first lead?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,251,242,0.55)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
              Join 2,400+ marketers who use ClickCapturr to create stunning campaigns, track every click, and convert visitors into customers.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {user ? (
                <Link href="/dashboard" className="lp-btn-primary-lg" style={{ ...btnPrimary, fontSize: "1.05rem", padding: "1rem 2.5rem" }}>
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <button onClick={() => openAuthModal("signup")} className="lp-btn-primary-lg" style={{ ...btnPrimary, fontSize: "1.05rem", padding: "1rem 2.5rem" }}>
                    Start Free — No Card Needed →
                  </button>
                  <button onClick={() => openAuthModal("signin")} className="lp-btn-ghost-lg" style={{ ...btnGhost, fontSize: "1.05rem", padding: "1rem 2.5rem" }}>
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ padding: "3rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--font-bespoke-serif), serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--cream)" }}>
              Click<span style={{ color: "var(--yellow)" }}>Capturr</span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {[["#features","Features"],["#pricing","Pricing"],["#how-it-works","How It Works"],].map(([href, label]) => (
                <a key={label} href={href} style={{ fontSize: "0.85rem", color: "rgba(255,251,242,0.4)", textDecoration: "none" }}>{label}</a>
              ))}
              <Link href="/dashboard" style={{ fontSize: "0.85rem", color: "rgba(255,251,242,0.4)", textDecoration: "none" }}>Dashboard</Link>
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,251,242,0.25)" }}>© {new Date().getFullYear()} ClickCapturr. All rights reserved.</div>
          </div>
        </footer>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView={authModalView}
        />
      </div>
    </>
  );
}
