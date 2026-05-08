import { useState, useEffect, useRef, useCallback } from "react";

// ─── STRIPE CONFIG ────────────────────────────────────────────────────────────
const STRIPE_PK = "pk_live_51TUw64Pi6VPpqQfXwrq0lWI8lGo16CLawyG68cBl2yJ9R0Dyr9Gu7XbQFvctruIzakQC6O2Tzpr0Juerie6BqRTC00nS0OedEv";
const STRIPE_PRICES = {
  weekly:  "price_1TUwO1Pi6VPpqQfXo98DB0QU",
  monthly: "price_1TUwOzPi6VPpqQfXEkkC8CEf",
  yearly:  "price_1TUwPhPi6VPpqQfXaQX3MDe9",
};

async function redirectToStripe(planId) {
  const priceId = STRIPE_PRICES[planId];
  if (!priceId) return;
  try {
    const stripe = window.Stripe(STRIPE_PK);
    await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      successUrl: window.location.origin + "?success=1",
      cancelUrl: window.location.origin + "?cancelled=1",
    });
  } catch (e) {
    console.error("Stripe error:", e);
    alert("Erreur de paiement, réessaie dans un instant.");
  }
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  void:     "#04040E",
  deep:     "#080818",
  card:     "#0D0D22",
  cardAlt:  "#111128",
  border:   "#1E1E42",
  borderHi: "#2E2E62",
  gold:     "#E8C56A",
  goldSoft: "rgba(232,197,106,0.12)",
  goldGlow: "rgba(232,197,106,0.25)",
  nebula:   "#7B9CFF",
  nebulaSoft:"rgba(123,156,255,0.12)",
  rose:     "#FF7EB3",
  roseSoft: "rgba(255,126,179,0.12)",
  teal:     "#4ECDC4",
  tealSoft: "rgba(78,205,196,0.12)",
  text:     "#EEEDff",
  textMid:  "#8888BB",
  textDim:  "#44446A",
  white:    "#FFFFFF",
};

// ─── STAR FIELD ───────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = 0.3 + 0.6 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r > 1 ? "232,197,106" : "180,180,255"},${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.7,
      }}
    />
  );
}

// ─── FLOATING ORBS ────────────────────────────────────────────────────────────
function Orbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { size: 320, x: -80, y: -80, color: "rgba(123,156,255,0.06)", delay: "0s" },
        { size: 250, x: "60%", y: "30%", color: "rgba(232,197,106,0.05)", delay: "3s" },
        { size: 200, x: "20%", y: "70%", color: "rgba(255,126,179,0.05)", delay: "6s" },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            animation: `orbFloat 12s ease-in-out ${o.delay} infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── SAMPLE DREAMS (initial data) ────────────────────────────────────────────
const SAMPLE_DREAMS = [
  {
    id: 1, date: "2026-05-07",
    title: "La bibliothèque infinie",
    text: "Je marchais dans une immense bibliothèque dont les étagères montaient jusqu'au ciel. Chaque livre que j'ouvrais contenait des images de ma vie passée.",
    mood: "mystérieux", moodEmoji: "🌀",
    tags: ["bibliothèque", "infini", "mémoire"],
    analysis: "Ce rêve évoque un désir de connaissance de soi et d'exploration de ton histoire personnelle. La bibliothèque infinie symbolise l'inconscient vaste et inépuisable. Les livres contenant ta vie passée suggèrent une phase d'introspection profonde.",
    lucid: false, recurring: false,
  },
  {
    id: 2, date: "2026-05-05",
    title: "Vol au-dessus des nuages",
    text: "Je volais librement au-dessus d'un océan de nuages dorés. Aucune peur, juste une sensation de légèreté absolue.",
    mood: "euphorique", moodEmoji: "✨",
    tags: ["vol", "liberté", "nuages"],
    analysis: "Voler dans les rêves est l'un des symboles les plus positifs — il représente la liberté, la transcendance des obstacles et une grande confiance en soi. La teinte dorée renforce ce sentiment de plénitude.",
    lucid: true, recurring: false,
  },
];

const DREAM_MOODS = [
  { id: "serein", emoji: "😌", label: "Serein", color: C.teal },
  { id: "mystérieux", emoji: "🌀", label: "Mystérieux", color: C.nebula },
  { id: "euphorique", emoji: "✨", label: "Euphorique", color: C.gold },
  { id: "angoissant", emoji: "😰", label: "Angoissant", color: C.rose },
  { id: "étrange", emoji: "🌙", label: "Étrange", color: "#AA88FF" },
  { id: "épique", emoji: "⚔️", label: "Épique", color: "#FF9A50" },
];

const SYMBOLS = [
  { symbol: "Eau", meaning: "Émotions, inconscient, transformation", icon: "🌊" },
  { symbol: "Voler", meaning: "Liberté, ambitions, transcendance", icon: "🦅" },
  { symbol: "Maison", meaning: "Soi, identité, sécurité intérieure", icon: "🏚️" },
  { symbol: "Chute", meaning: "Perte de contrôle, anxiété, lâcher-prise", icon: "🌪️" },
  { symbol: "Poursuite", meaning: "Évitement d'un problème ou d'une émotion", icon: "👁️" },
  { symbol: "Dents", meaning: "Anxiété sociale, peur du jugement", icon: "😬" },
];

const PLANS = [
  { id: "weekly",   name: "Hebdo",   price: "2,99€",  period: "/semaine", tag: null,       color: C.nebula },
  { id: "monthly",  name: "Mensuel", price: "6,99€",  period: "/mois",    tag: "⭐ Pop",   color: C.gold },
  { id: "yearly",   name: "Annuel",  price: "2,99€",  period: "/mois",    tag: "🔥 -57%", color: C.teal },
];

const ADS = [
  { icon: "🌿", brand: "SomniHerb", text: "Herbes naturelles pour des rêves plus intenses et lucides", cta: "Découvrir", color: C.teal },
  { icon: "🎧", brand: "DreamWave", text: "Sons binauraux pour induire des rêves lucides — essai 7 jours", cta: "Écouter", color: C.nebula },
  { icon: "📖", brand: "LucidBook", text: "Le guide complet des rêves lucides — ebook à 4,99€", cta: "Voir", color: C.gold },
];

// ─── AI DREAM ANALYSIS ────────────────────────────────────────────────────────
async function analyzeDream(dreamText, mood) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 350,
      system: `Tu es un expert en psychologie des rêves, combinant Jung, Freud et la neurologie moderne. 
Analyse les rêves en français de façon poétique, profonde et personnalisée en 3-4 phrases. 
Identifie les symboles clés et leur signification émotionnelle. Ton : mystérieux et bienveillant.
Commence directement l'analyse sans formule d'intro comme "Ce rêve..." ou "Votre rêve...". Commence par le symbole principal.`,
      messages: [{ role: "user", content: `Rêve : "${dreamText}"\nTon émotionnel : ${mood}` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Un rêve riche en symboles qui mérite une exploration plus profonde.";
}

// ─── AD BANNER ────────────────────────────────────────────────────────────────
function AdBanner({ idx }) {
  const [gone, setGone] = useState(false);
  const ad = ADS[idx % ADS.length];
  if (gone) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.cardAlt}, ${C.card})`,
      border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "12px 14px",
      marginBottom: 14, display: "flex", alignItems: "center", gap: 12,
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 5, right: 8, fontSize: 9, color: C.textDim, letterSpacing: 1 }}>SPONSORISÉ</div>
      <span style={{ fontSize: 26 }}>{ad.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: ad.color, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>{ad.brand}</div>
        <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.4 }}>{ad.text}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ background: `${ad.color}22`, color: ad.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, cursor: "pointer", border: "none", whiteSpace: "nowrap" }}>
          {ad.cta}
        </div>
        <button onClick={() => setGone(true)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 10 }}>✕</button>
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function Paywall({ onClose, onBuy }) {
  const [sel, setSel] = useState("monthly");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(180deg, ${C.cardAlt} 0%, ${C.card} 100%)`,
        borderRadius: "26px 26px 0 0", padding: "32px 24px 40px",
        width: "100%", maxWidth: 440,
        border: `1px solid ${C.borderHi}`, borderBottom: "none",
      }}>
        {/* Stars deco */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🌙</div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 26, fontWeight: 700,
            background: `linear-gradient(135deg, ${C.gold}, ${C.nebula})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>DreamLens Infinity</div>
          <div style={{ color: C.textMid, fontSize: 13, lineHeight: 1.5 }}>
            Plonge sans limites dans l'univers de tes rêves
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 20, background: C.card, borderRadius: 14, padding: "14px 16px" }}>
          {[
            ["🤖", "Analyses IA illimitées & approfondies"],
            ["📚", "Bibliothèque de 200+ symboles décodés"],
            ["🎯", "Détection de patterns sur 30/90 jours"],
            ["🌀", "Guide rêves lucides complet"],
            ["🚫", "Zéro publicité"],
            ["☁️", "Sync cloud & backup automatique"],
          ].map(([icon, txt]) => (
            <div key={txt} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
              <span>{icon}</span>
              <span style={{ fontSize: 13, color: C.textMid }}>{txt}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        {PLANS.map(p => (
          <div key={p.id} onClick={() => setSel(p.id)} style={{
            background: sel === p.id ? `${p.color}18` : C.cardAlt,
            border: `2px solid ${sel === p.id ? p.color : C.border}`,
            borderRadius: 14, padding: "13px 16px", marginBottom: 10,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            transition: "all 0.2s",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, display: "flex", alignItems: "center", gap: 7 }}>
                {p.name}
                {p.tag && <span style={{ background: `${p.color}25`, color: p.color, fontSize: 10, padding: "2px 7px", borderRadius: 20 }}>{p.tag}</span>}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{p.period}</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: p.color }}>{p.price}</div>
          </div>
        ))}


        <button onClick={() => redirectToStripe(sel)} style={{
          width: "100%", padding: 16, borderRadius: 14, border: "none", cursor: "pointer",
          background: `linear-gradient(135deg, ${C.gold}, ${C.nebula})`,
          color: C.void, fontWeight: 800, fontSize: 16,
          boxShadow: `0 6px 30px ${C.goldGlow}`,
          marginTop: 6, letterSpacing: 0.3,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          Commencer mon voyage ✨
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: 13, borderRadius: 14, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, cursor: "pointer", marginTop: 8, fontSize: 13, fontFamily: "inherit" }}>
          Continuer gratuitement
        </button>
        <div style={{ textAlign: "center", fontSize: 10, color: C.textDim, marginTop: 10 }}>
          Annulable à tout moment · SSL · RGPD
        </div>
      </div>
    </div>
  );
}

// ─── NEW DREAM MODAL ──────────────────────────────────────────────────────────
function NewDreamModal({ onClose, onSave, isPremium, analysesLeft }) {
  const [step, setStep] = useState(1); // 1=write, 2=mood, 3=analysis
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState("");
  const [lucid, setLucid] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setStep(3);
    setLoading(true);
    try {
      const a = await analyzeDream(text, mood?.label || "neutre");
      setAnalysis(a);
    } catch {
      setAnalysis("Les étoiles murmurent que ce rêve recèle des mystères profonds liés à ton inconscient.");
    }
    setLoading(false);
  };

  const save = () => {
    const dream = {
      id: Date.now(), date: new Date().toISOString().slice(0, 10),
      title: title || "Rêve sans titre",
      text, mood: mood?.id || "neutre", moodEmoji: mood?.emoji || "🌙",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      analysis, lucid, recurring,
    };
    onSave(dream);
    onClose();
  };

  const inputStyle = {
    width: "100%", background: C.cardAlt, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14,
    resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 998, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{
        background: `linear-gradient(180deg, #0E0E24, ${C.card})`,
        borderRadius: "26px 26px 0 0", padding: "28px 22px 36px",
        width: "100%", maxWidth: 440,
        border: `1px solid ${C.borderHi}`, borderBottom: "none",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.gold }}>
            {step === 1 ? "✍️ Nouveau rêve" : step === 2 ? "🎭 Ambiance" : "🔮 Analyse"}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? `linear-gradient(90deg, ${C.gold}, ${C.nebula})` : C.border, transition: "background 0.4s" }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre du rêve (optionnel)" style={{ ...inputStyle, marginBottom: 12 }} />
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Décris ton rêve avec le maximum de détails — chaque image, sensation, personnage compte pour l'analyse..." style={{ ...inputStyle, minHeight: 140 }} rows={6} />
            <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 16 }}>
              {[["🌀 Lucide", lucid, setLucid], ["🔄 Récurrent", recurring, setRecurring]].map(([label, val, setter]) => (
                <div key={label} onClick={() => setter(!val)} style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  background: val ? `${C.gold}18` : C.cardAlt,
                  border: `1.5px solid ${val ? C.gold : C.border}`,
                  textAlign: "center", fontSize: 12, fontWeight: val ? 700 : 400, color: val ? C.gold : C.textMid,
                  transition: "all 0.2s",
                }}>
                  {label}
                </div>
              ))}
            </div>
            <button disabled={text.length < 20} onClick={() => setStep(2)} style={{
              width: "100%", padding: 15, borderRadius: 14, border: "none", cursor: text.length >= 20 ? "pointer" : "not-allowed",
              background: text.length >= 20 ? `linear-gradient(135deg, ${C.nebula}, ${C.gold})` : C.cardAlt,
              color: text.length >= 20 ? C.void : C.textDim, fontWeight: 700, fontSize: 15, fontFamily: "inherit",
            }}>
              Continuer →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 14, color: C.textMid, marginBottom: 16 }}>Quelle était l'ambiance émotionnelle ?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {DREAM_MOODS.map(m => (
                <div key={m.id} onClick={() => setMood(m)} style={{
                  padding: "14px 8px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                  background: mood?.id === m.id ? `${m.color}20` : C.cardAlt,
                  border: `2px solid ${mood?.id === m.id ? m.color : C.border}`,
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 24 }}>{m.emoji}</div>
                  <div style={{ fontSize: 11, color: mood?.id === m.id ? m.color : C.textMid, marginTop: 5, fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags : eau, forêt, ami, maison… (séparés par ,)" style={{ ...inputStyle, marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 14, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, cursor: "pointer", fontFamily: "inherit" }}>← Retour</button>
              <button disabled={!mood} onClick={runAnalysis} style={{
                flex: 2, padding: 13, borderRadius: 14, border: "none",
                background: mood ? `linear-gradient(135deg, ${C.gold}, ${C.nebula})` : C.cardAlt,
                color: mood ? C.void : C.textDim, fontWeight: 700, cursor: mood ? "pointer" : "not-allowed", fontFamily: "inherit",
              }}>
                {isPremium || analysesLeft > 0 ? "🔮 Analyser avec l'IA →" : "🔒 Analyse Premium"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 42, marginBottom: 16, animation: "spin 3s linear infinite" }}>🔮</div>
                <div style={{ color: C.textMid, fontSize: 14 }}>Les astres déchiffrent ton rêve…</div>
              </div>
            ) : (
              <>
                <div style={{
                  background: `linear-gradient(135deg, ${C.cardAlt}, ${C.card})`,
                  border: `1px solid ${C.gold}44`,
                  borderRadius: 16, padding: 20, marginBottom: 16,
                  boxShadow: `0 0 30px ${C.goldGlow}`,
                }}>
                  <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>✦ INTERPRÉTATION IA</div>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.75, fontStyle: "italic" }}>{analysis}</div>
                </div>
                <button onClick={save} style={{
                  width: "100%", padding: 15, borderRadius: 14, border: "none",
                  background: `linear-gradient(135deg, ${C.teal}, ${C.nebula})`,
                  color: C.void, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
                }}>
                  Sauvegarder ce rêve 🌙
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── DREAM CARD ───────────────────────────────────────────────────────────────
function DreamCard({ dream, onClick }) {
  const mood = DREAM_MOODS.find(m => m.id === dream.mood) || DREAM_MOODS[0];
  const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div onClick={() => onClick(dream)} style={{
      background: `linear-gradient(135deg, ${C.card}, ${C.cardAlt})`,
      border: `1px solid ${C.border}`,
      borderRadius: 18, padding: "16px 18px", marginBottom: 12, cursor: "pointer",
      transition: "transform 0.2s, border-color 0.2s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = mood.color + "88"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${mood.color}15, transparent 70%)`, borderRadius: "0 18px 0 80px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{dream.moodEmoji}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.text }}>{dream.title}</span>
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>{fmtDate(dream.date)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          {dream.lucid && <div style={{ background: `${C.gold}22`, color: C.gold, fontSize: 9, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>LUCIDE</div>}
          {dream.recurring && <div style={{ background: `${C.rose}22`, color: C.rose, fontSize: 9, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>RÉCURRENT</div>}
        </div>
      </div>
      <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {dream.text}
      </div>
      {dream.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {dream.tags.map(t => (
            <span key={t} style={{ background: C.cardAlt, color: C.textDim, fontSize: 10, padding: "2px 8px", borderRadius: 20, border: `1px solid ${C.border}` }}>#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DREAM DETAIL ─────────────────────────────────────────────────────────────
function DreamDetail({ dream, onClose }) {
  const mood = DREAM_MOODS.find(m => m.id === dream.mood) || DREAM_MOODS[0];
  return (
    <div style={{ position: "fixed", inset: 0, background: C.void, zIndex: 997, overflowY: "auto", padding: "0 0 40px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 20px" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMid, cursor: "pointer", fontSize: 24, padding: "20px 0 10px", display: "block" }}>←</button>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>{new Date(dream.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>{dream.title}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ background: `${mood.color}22`, color: mood.color, fontSize: 12, padding: "5px 12px", borderRadius: 20, fontWeight: 600 }}>{dream.moodEmoji} {dream.mood}</div>
          {dream.lucid && <div style={{ background: `${C.gold}22`, color: C.gold, fontSize: 12, padding: "5px 12px", borderRadius: 20, fontWeight: 600 }}>🌀 Lucide</div>}
          {dream.recurring && <div style={{ background: `${C.rose}22`, color: C.rose, fontSize: 12, padding: "5px 12px", borderRadius: 20, fontWeight: 600 }}>🔄 Récurrent</div>}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16, fontSize: 14, color: C.text, lineHeight: 1.8 }}>
          {dream.text}
        </div>
        {dream.analysis && (
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.cardAlt})`, border: `1px solid ${C.gold}44`, borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: `0 0 24px ${C.goldGlow}` }}>
            <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>✦ INTERPRÉTATION IA</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, fontStyle: "italic" }}>{dream.analysis}</div>
          </div>
        )}
        {dream.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {dream.tags.map(t => (
              <span key={t} style={{ background: C.cardAlt, color: C.textMid, fontSize: 12, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}` }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function JournalTab({ dreams, onAdd, onView, isPremium, onUnlock, analysesLeft }) {
  const totalLucid = dreams.filter(d => d.lucid).length;
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20, marginTop: 18 }}>
        {[
          { v: dreams.length, l: "Rêves", c: C.nebula },
          { v: totalLucid, l: "Lucides", c: C.gold },
          { v: `${Math.min(dreams.length * 7, 100)}%`, l: "Rappel", c: C.teal },
        ].map(s => (
          <div key={s.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 0", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 3, fontWeight: 600, letterSpacing: 0.5 }}>{s.l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {!isPremium && <AdBanner idx={0} />}

      {/* CTA add */}
      <button onClick={onAdd} style={{
        width: "100%", padding: 16, borderRadius: 16, border: `1.5px dashed ${C.borderHi}`,
        background: `${C.gold}08`, color: C.gold, cursor: "pointer",
        fontFamily: "'Playfair Display', serif", fontSize: 15, marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>✦</span> Capturer un rêve
      </button>

      {!isPremium && (
        <div style={{ background: C.card, border: `1px solid ${C.gold}33`, borderRadius: 14, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: C.textMid }}>🔮 Analyses IA gratuites</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{analysesLeft} / 3</div>
        </div>
      )}

      {dreams.map(d => <DreamCard key={d.id} dream={d} onClick={onView} />)}

      {!isPremium && (
        <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.cardAlt})`, border: `1px solid ${C.nebula}44`, borderRadius: 18, padding: 24, textAlign: "center", marginTop: 6 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 8, color: C.gold }}>Analyses illimitées</div>
          <div style={{ fontSize: 13, color: C.textMid, marginBottom: 16, lineHeight: 1.5 }}>Débloque l'IA sans restriction + patterns + guide rêves lucides</div>
          <button onClick={onUnlock} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.gold}, ${C.nebula})`, color: C.void, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            Débloquer Infinity ✦
          </button>
        </div>
      )}
    </div>
  );
}

function SymbolsTab({ isPremium, onUnlock }) {
  const [search, setSearch] = useState("");
  const filtered = SYMBOLS.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ marginTop: 18, marginBottom: 14 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Chercher un symbole…"
          style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
        />
      </div>
      {!isPremium && <AdBanner idx={1} />}
      <div style={{ background: C.card, border: `1px solid ${C.gold}33`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>✦ SYMBOLES UNIVERSELS</div>
        {filtered.map((s, i) => (
          <div key={s.symbol} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3 }}>{s.symbol}</div>
              <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{s.meaning}</div>
            </div>
          </div>
        ))}
      </div>
      {!isPremium && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, marginBottom: 6, color: C.gold }}>194 autres symboles</div>
          <div style={{ fontSize: 12, color: C.textMid, marginBottom: 14 }}>Archétypes junguiens, symboles culturels, figures récurrentes…</div>
          <button onClick={onUnlock} style={{ width: "100%", padding: 13, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.gold}, ${C.nebula})`, color: C.void, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Tout débloquer
          </button>
        </div>
      )}
    </div>
  );
}

function InsightsTab({ dreams, isPremium, onUnlock }) {
  const moodCounts = DREAM_MOODS.map(m => ({
    ...m, count: dreams.filter(d => d.mood === m.id).length,
  })).filter(m => m.count > 0);
  const total = dreams.length || 1;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ marginTop: 18 }}>
        {!isPremium && <AdBanner idx={2} />}

        {/* Mood pie-like */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>AMBIANCES DOMINANTES</div>
          {moodCounts.length === 0 ? (
            <div style={{ color: C.textDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Aucun rêve enregistré</div>
          ) : moodCounts.map(m => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: C.textMid }}>{m.emoji} {m.label}</span>
                <span style={{ color: m.color, fontWeight: 700 }}>{Math.round(m.count / total * 100)}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: C.cardAlt }}>
                <div style={{ height: "100%", width: `${Math.round(m.count / total * 100)}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`, borderRadius: 3, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Freq card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>FRÉQUENCE 7 DERNIERS JOURS</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
            {[2,1,3,1,2,1,dreams.length > 0 ? 2 : 0].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: v * 16, borderRadius: "5px 5px 0 0", background: v > 0 ? `linear-gradient(180deg, ${C.nebula}, ${C.nebula}66)` : C.cardAlt }} />
                <span style={{ fontSize: 10, color: C.textDim }}>{"LMMJVSD"[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {!isPremium ? (
          <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.cardAlt})`, border: `1px solid ${C.rose}44`, borderRadius: 18, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🔒</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.gold, marginBottom: 8 }}>Insights profonds Premium</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 16, lineHeight: 1.6 }}>
              • Patterns récurrents détectés par IA<br />
              • Corrélations humeur/sommeil<br />
              • Évolution sur 30 et 90 jours<br />
              • Rapport mensuel PDF
            </div>
            <button onClick={onUnlock} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.rose}, ${C.nebula})`, color: C.white, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              Voir mes patterns →
            </button>
          </div>
        ) : (
          <div style={{ background: `${C.teal}15`, border: `1px solid ${C.teal}44`, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 13, color: C.teal, fontWeight: 700, marginBottom: 6 }}>✦ Pattern détecté</div>
            <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>Tu rêves plus souvent de lieux inconnus les lundis et mardis — probablement lié au stress du début de semaine.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("journal");
  const [dreams, setDreams] = useState(SAMPLE_DREAMS);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [viewDream, setViewDream] = useState(null);
  const [analysesLeft, setAnalysesLeft] = useState(3);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSaveDream = (dream) => {
    setDreams(prev => [dream, ...prev]);
    if (!isPremium) setAnalysesLeft(a => Math.max(0, a - 1));
    showToast("🌙 Rêve sauvegardé !");
  };

  const handleBuy = (planId) => {
    setIsPremium(true);
    setShowPaywall(false);
    const p = PLANS.find(x => x.id === planId);
    showToast(`✨ Infinity activé — ${p.name} ${p.price}`);
  };

  const NAV = [
    { id: "journal",  icon: "📖", label: "Journal" },
    { id: "symbols",  icon: "🔮", label: "Symboles" },
    { id: "insights", icon: "✦",  label: "Insights" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.void}; overflow: hidden; }
        ::-webkit-scrollbar { display: none; }
        @keyframes orbFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(20px, 30px) scale(1.08); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shimmer { 0%,100% { opacity:0.7 } 50% { opacity:1 } }
      `}</style>

      <StarField />
      <Orbs />

      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "transparent", height: "100vh", maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* HEADER */}
        <div style={{ padding: "20px 22px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, background: `linear-gradient(135deg, ${C.gold}, #FFF8E1, ${C.nebula})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              DreamLens
            </div>
            <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1 }}>JOURNAL IA DES RÊVES</div>
          </div>
          {isPremium
            ? <div style={{ background: `${C.gold}22`, color: C.gold, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.gold}44` }}>✦ INFINITY</div>
            : <button onClick={() => setShowPaywall(true)} style={{ background: `linear-gradient(135deg, ${C.gold}33, ${C.nebula}33)`, color: C.gold, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.gold}55`, cursor: "pointer" }}>✦ INFINITY</button>
          }
        </div>

        {/* PAGE TITLE */}
        <div style={{ padding: "0 22px 10px", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.text }}>
            {tab === "journal" ? "Mes rêves" : tab === "symbols" ? "Dictionnaire des symboles" : "Mes patterns oniriques"}
          </div>
        </div>

        {/* CONTENT */}
        {tab === "journal" && <JournalTab dreams={dreams} onAdd={() => setShowNew(true)} onView={setViewDream} isPremium={isPremium} onUnlock={() => setShowPaywall(true)} analysesLeft={analysesLeft} />}
        {tab === "symbols" && <SymbolsTab isPremium={isPremium} onUnlock={() => setShowPaywall(true)} />}
        {tab === "insights" && <InsightsTab dreams={dreams} isPremium={isPremium} onUnlock={() => setShowPaywall(true)} />}

        {/* NAV */}
        <div style={{ display: "flex", background: `${C.card}EE`, borderTop: `1px solid ${C.border}`, backdropFilter: "blur(20px)", flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              flex: 1, padding: "13px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer",
              color: tab === n.id ? C.gold : C.textDim,
            }}>
              <span style={{ fontSize: tab === n.id ? 20 : 18, transition: "font-size 0.2s", animation: tab === n.id ? "shimmer 2s ease infinite" : "none" }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: tab === n.id ? 700 : 400, letterSpacing: 0.5 }}>{n.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onBuy={handleBuy} />}
      {showNew && <NewDreamModal onClose={() => setShowNew(false)} onSave={handleSaveDream} isPremium={isPremium} analysesLeft={analysesLeft} />}
      {viewDream && <DreamDetail dream={viewDream} onClose={() => setViewDream(null)} />}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: C.card, border: `1px solid ${C.gold}66`, color: C.gold,
          padding: "11px 20px", borderRadius: 14, fontSize: 13, fontWeight: 700,
          zIndex: 9999, whiteSpace: "nowrap", boxShadow: `0 4px 30px ${C.goldGlow}`,
          animation: "slideUp 0.3s ease", fontFamily: "'DM Sans', sans-serif",
        }}>{toast}</div>
      )}
    </>
  );
}
