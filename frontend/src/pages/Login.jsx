import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function makeParticle(W, H, init) {
  const x = Math.random() * W;
  const y = init ? Math.random() * H : H + 8;
  return {
    x, y, bx: x, by: y,
    r: 1 + Math.random() * 2,
    a: 0.1 + Math.random() * 0.25,
    sp: 0.12 + Math.random() * 0.28,
    ang: Math.random() * Math.PI * 2,
    wob: (Math.random() - 0.5) * 0.011,
    hue: 138 + Math.random() * 25,
    vx: 0, vy: 0,
  };
}

function ParticleCanvas({ panelRef }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0;

    function resize() {
      W = canvas.width = panel.offsetWidth;
      H = canvas.height = panel.offsetHeight;
    }

    function init() {
      particlesRef.current = Array.from({ length: 60 }, () => makeParticle(W, H, true));
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      const { x: mx, y: my } = mouseRef.current;
      if (mx > 0 && mx < W) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 140);
        g.addColorStop(0, "rgba(52,211,153,0.08)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ripplesRef.current = ripplesRef.current.filter((r) => r.a > 0.01);
      ripplesRef.current.forEach((r) => {
        r.r += 2.2; r.a *= 0.92;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110,231,183,${r.a})`; ctx.lineWidth = 1; ctx.stroke();
      });
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 75) {
            ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(110,231,183,${0.055 * (1 - d / 75)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      ps.forEach((p) => {
        p.ang += p.wob; p.by -= p.sp; p.bx += Math.sin(p.ang) * 0.35;
        const dx = mouseRef.current.x - p.bx, dy = mouseRef.current.y - p.by;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 0) {
          const f = (90 - dist) / 90;
          p.vx -= (dx / dist) * f * 2; p.vy -= (dy / dist) * f * 2;
        }
        p.vx *= 0.88; p.vy *= 0.88;
        p.x = p.bx + p.vx; p.y = p.by + p.vy;
        if (p.by < -8) Object.assign(p, makeParticle(W, H, false));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},65%,62%,${p.a})`; ctx.fill();
      });
      rafRef.current = requestAnimationFrame(frame);
    }

    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      const s = e.touches ? e.touches[0] : e;
      return { x: s.clientX - r.left, y: s.clientY - r.top };
    }

    const onMove = (e) => { mouseRef.current = getPos(e); };
    const onLeave = () => { mouseRef.current = { x: -999, y: -999 }; };
    const onClick = (e) => {
      const p = getPos(e);
      ripplesRef.current.push({ x: p.x, y: p.y, r: 0, a: 0.4 });
    };
    const onResize = () => { resize(); init(); };

    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);
    panel.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    resize(); init(); frame();

    return () => {
      cancelAnimationFrame(rafRef.current);
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
      panel.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(username, password);
      if (res.success) {
        toast.success("Connexion réussie !");
        navigate("/");
      } else {
        setError(res.error || "Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "12px 14px 12px 42px",
    border: "1.5px solid #e5e7eb", borderRadius: 10,
    fontFamily: "inherit", fontSize: 14, color: "#111827",
    background: "#fff", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 500, textTransform: "uppercase",
    letterSpacing: "0.1em", color: "#374151",
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        ref={panelRef}
        style={{
          position: "relative", overflow: "hidden",
          background: "radial-gradient(160deg, #0d2b12 0%, #0a1f0e 50%, #071508 100%)",
          padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}
      >
        <ParticleCanvas panelRef={panelRef} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 60%, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div className="animate-sway" style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(52,211,153,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#ecfdf5", letterSpacing: "0.06em" }}>
            INS<span style={{ color: "#34d399" }}>PYRA</span>
          </span>
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.18em", color: "#34d399", marginBottom: "1.2rem" }}>
            <div style={{ width: 20, height: 1, background: "#34d399" }} />
            Boutique végétale premium
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.2, color: "#f0fdf4", marginBottom: "1rem" }}>
            Des plantes qui<br />transforment votre<br />
            <em style={{ fontStyle: "italic", color: "#6ee7b7" }}>espace de vie.</em>
          </h2>
          <p style={{ fontSize: 13, color: "rgba(167,243,208,0.6)", lineHeight: 1.7, maxWidth: 320 }}>
            Plus de 2 400 espèces rares livrées avec soin. Chaque commande, un geste pour la planète.
          </p>
        </div>

        {/* Social proof */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex" }}>
              {["S", "M", "A", "+"].map((l, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #0a1f0e", background: "linear-gradient(135deg,#065f46,#34d399)", marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "#ecfdf5" }}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(167,243,208,0.65)" }}>
                <strong style={{ color: "#ecfdf5", fontWeight: 500 }}>+12 000 clients</strong> nous font confiance
              </div>
              <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ width: 10, height: 10, background: "#fbbf24", clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Paiement sécurisé", "Livraison 48h", "Satisfait ou remboursé"].map((label) => (
              <div key={label} style={{ fontSize: 10, color: "rgba(167,243,208,0.5)", padding: "5px 10px", border: "0.5px solid rgba(52,211,153,0.15)", borderRadius: 20 }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ background: "#fff", padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: "#052e16", marginBottom: 6, fontWeight: 700 }}>
            Bon retour parmi nous
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Pas encore client ?{" "}
            <Link to="/register" style={{ color: "#059669", textDecoration: "none", fontWeight: 500 }}>Créer un compte gratuit</Link>
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: "1rem", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#dc2626" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>Nom d'utilisateur</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <User size={16} />
                </svg>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="votre_nom" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }} />
              </div>
            </div>
          </div>

          <Link to="/forgot-password" style={{ textAlign: "right", fontSize: 12, color: "#059669", textDecoration: "none", fontWeight: 500, display: "block", marginBottom: "1.25rem" }}>
            Mot de passe oublié ?
          </Link>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#6ee7b7" : "#059669", color: "#fff", border: "none", borderRadius: 10, fontFamily: "inherit", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s, transform 0.15s" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#047857"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#059669"; }}>
            {loading ? "Connexion en cours..." : (
              <>
                Accéder à mon espace
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.25rem 0" }}>
          <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>ou continuer avec</span>
          <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
          {["Google", "Facebook"].map((label) => (
            <button key={label} style={{ padding: "10px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", fontFamily: "inherit", fontSize: 13, color: "#374151", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}>
              {label}
            </button>
          ))}
        </div>

        {/* Welcome offer */}
        <div style={{ padding: "12px 14px", background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, background: "#059669", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#064e3b", marginBottom: 2 }}>Offre de bienvenue — 15% de réduction</div>
            <div style={{ fontSize: 11, color: "#065f46", lineHeight: 1.5 }}>Connectez-vous et profitez de votre remise sur votre prochaine commande.</div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "1.25rem" }}>
          En continuant, vous acceptez nos{" "}
          <Link to="/terms" style={{ color: "#059669", textDecoration: "none", fontWeight: 500 }}>Conditions</Link>{" "}
          et notre{" "}
          <Link to="/privacy" style={{ color: "#059669", textDecoration: "none", fontWeight: 500 }}>Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}