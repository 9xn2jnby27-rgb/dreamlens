import { useState, useEffect, useRef } from "react";

// ─── STRIPE ───────────────────────────────────────────────────────────────────
const STRIPE_LINKS = {
  weekly:  "https://buy.stripe.com/5kQ7sN7LbfBo3gEdqU57W00",
  monthly: "https://buy.stripe.com/aFa9AV7Lb1KycRe86A57W01",
  yearly:  "https://buy.stripe.com/4gMl4p8Pfdtg18w72w57W02",
};
const pay = (id) => { if (STRIPE_LINKS[id]) window.location.href = STRIPE_LINKS[id]; };

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#04040E", card:"#0D0D22", cardAlt:"#111128", border:"#1E1E42", borderHi:"#2E2E62",
  gold:"#E8C56A", nebula:"#7B9CFF", rose:"#FF7EB3", teal:"#4ECDC4",
  text:"#EEEDff", mid:"#8888BB", dim:"#44446A", void:"#04040E", white:"#FFFFFF",
};

// ─── ANALYSIS ENGINE ──────────────────────────────────────────────────────────
const KB = [
  { keys:["dents","dent","tombent","mâchoire","sourire","bouche","craquer","cassé"],
    i:[
      "Les dents qui tombent est l'un des rêves les plus universels de l'humanité — des millions de personnes le font, toutes cultures confondues, et Jung y voyait un signal particulièrement puissant de l'inconscient. Les dents symbolisent ta puissance personnelle, ta capacité à t'affirmer dans le monde et l'image que tu projettes aux autres. Les perdre en rêve traduit une peur profonde de perdre le contrôle sur quelque chose d'important — une relation, une situation, ou l'image que tu renvoies aux gens qui comptent pour toi. Ce rêve est extrêmement fréquent chez les étudiants en période d'examens — il traduit directement la peur du jugement et la pression de la performance. La bonne nouvelle : ce rêve n'annonce rien de concret. C'est ton inconscient qui traite une tension réelle, ce qui signifie que tu es en train de la traverser, pas de la fuir.",
      "Les dents qui tombent parlent de ton rapport à l'image de toi-même et à ta place dans le regard des autres. Freud y voyait une anxiété liée à l'apparence sociale ; Jung, une perte temporaire de puissance intérieure. Ce rêve survient souvent quand tu traverses une période où tu te sens jugée ou évaluée — examens, entretiens, nouvelles rencontres. Il peut aussi signaler quelque chose que tu n'oses pas encore dire à voix haute. Ton inconscient te demande de retrouver confiance en ta propre valeur, indépendamment du regard extérieur.",
    ]},
  { keys:["vol","voler","volais","envol","planer","ailes","décollais","planais"],
    i:[
      "L'envol est le symbole le plus puissant de l'inconscient — Jung y voyait la transcendance de l'ego, le dépassement des limites que tu t'imposes toi-même. Cette sensation de légèreté absolue traduit une libération en cours dans ta vie réelle. Quelque chose qui te pesait commence à se dissoudre. La hauteur que tu atteignes indique l'ampleur de cette transformation intérieure.",
      "Voler en rêve est l'expression directe d'une ambition ou d'un désir de liberté que tu n'oses peut-être pas encore pleinement revendiquer à l'état de veille. L'absence de peur dans cet envol révèle une confiance intérieure qui grandit. Freud associait ce type de rêve à la volonté de puissance et au dépassement des contraintes. Ton inconscient te dit que tu es capable de bien plus que tu ne le crois.",
    ]},
  { keys:["eau","mer","océan","rivière","lac","pluie","nager","vague","noyé","plonger","marée","ruisseau"],
    i:[
      "L'eau est le langage maternel de l'inconscient — sa présence signale une période de transformation émotionnelle profonde. Selon Jung, l'étendue d'eau représente la totalité de la psyché : ses profondeurs sont tes émotions non explorées, sa surface ce que tu montres au monde. La clarté ou la turbulence de cette eau te parle directement de ton état émotionnel actuel.",
      "Symbole universel des émotions et de la vie inconsciente, l'eau de ton rêve porte un message sur ta vie affective. Les eaux profondes évoquent ce que tu n'oses pas encore ressentir pleinement ; les eaux agitées, des émotions en mouvement qui demandent à être accueillies. Ce rêve t'invite à plonger dans ce que tu ressens vraiment, sans le filtrer.",
    ]},
  { keys:["maison","chambre","pièce","couloir","escalier","porte","fenêtre","grenier","cave","appartement"],
    i:[
      "La maison est l'archétype du Soi selon Jung — chaque pièce représente une facette de ta personnalité. Le couloir que tu traverses, les portes fermées que tu rencontres : tout cela est une cartographie précise de ton monde intérieur. Les pièces inconnues symbolisent des potentiels encore inexploités. Ton inconscient t'invite à explorer des aspects de toi-même que tu n'as pas encore eu le courage de regarder.",
      "Rêver d'une maison — surtout si elle recèle des espaces inconnus — est un signe que ton psyché est en pleine expansion. Les pièces secrètes représentent les pensées refoulées, les escaliers le passage entre différents états de conscience. La façon dont tu navigues dans cet espace révèle comment tu gères ta propre complexité intérieure.",
    ]},
  { keys:["chute","tomber","tombais","précipice","vide","abîme","glisser","vertige"],
    i:[
      "La chute est l'un des rêves les plus universels — elle traduit une perte de maîtrise ressentie quelque part dans ta vie éveillée. Mais ce rêve est rarement un mauvais présage : il exprime souvent un lâcher-prise nécessaire. Ton inconscient te signale qu'il est temps de relâcher le contrôle sur quelque chose qui t'épuise. La chute précède toujours un nouveau sol, une nouvelle fondation.",
      "Tomber en rêve révèle une tension entre ce que tu contrôles et ce qui t'échappe. Ce vertige symbolique est le langage de l'anxiété transformée en image. Paradoxalement, les personnes qui touchent le sol dans leur rêve de chute font preuve d'une grande résilience — elles sont capables d'affronter le pire. Ton inconscient te prépare à atterrir en douceur.",
    ]},
  { keys:["poursuite","poursuivi","fuir","fuite","courir","chassé","monstre","danger","attaque"],
    i:[
      "Être poursuivi est le miroir de ce que tu fuis dans ta vie éveillée — une décision difficile, une émotion douloureuse, une conversation que tu repousses. Ton poursuivant n'est autre qu'une partie de toi-même que tu refuses d'intégrer. Plus il est terrifiant, plus ce que tu évites est important. La solution n'est jamais de courir plus vite, mais de se retourner et regarder en face.",
      "La fuite onirique est le langage universel de l'évitement psychologique. Ton inconscient met en scène sous forme de danger ce que tu n'oses pas encore affronter consciemment. L'identité de ton poursuivant est une clé précieuse. Freud y voyait souvent des figures d'autorité refoulées ; Jung, des aspects de l'ombre personnelle à intégrer.",
    ]},
  { keys:["mort","mourir","décès","enterrement","fantôme","disparaître","cadavre"],
    i:[
      "Contrairement à la crainte qu'il inspire, rêver de mort est presque universellement un symbole de transformation — jamais un présage littéral. Jung en faisait le symbole ultime du renouveau : quelque chose doit mourir symboliquement pour qu'une version plus authentique de toi puisse émerger. Une phase de ta vie touche à sa fin. C'est un rêve de renaissance, pas de fin.",
      "La mort dans les rêves est la métaphore la plus puissante du changement. Elle célèbre une transition. Les traditions chamaniques du monde entier voyaient dans ce type de rêve une initiation, le passage vers un niveau de conscience supérieur. Ton inconscient te prépare à laisser partir quelque chose qui ne te sert plus.",
    ]},
  { keys:["enfant","bébé","enfance","jouet","école","petit","bambin"],
    i:[
      "L'enfant qui apparaît dans tes rêves incarne l'archétype jungien de l'enfant divin — la part de toi qui conserve la créativité originelle et la spontanéité. Sa présence suggère soit un besoin de reconnecter avec tes aspirations les plus authentiques, soit une blessure ancienne qui demande à être guérie. L'état de cet enfant dans ton rêve est un miroir direct de ton enfant intérieur.",
      "Rêver d'enfance traduit un appel à revenir à l'essentiel, à ce que tu étais avant que le monde te demande d'être autrement. Freud y voyait le retour du désir refoulé ; Jung, le potentiel inexploité qui attend d'éclore. Si tu prends soin de cet enfant dans ton rêve, c'est que tu commences à prendre soin de tes propres besoins profonds.",
    ]},
  { keys:["loup","lion","serpent","oiseau","chat","chien","cheval","araignée","tigre","ours","aigle","animal"],
    i:[
      "Les animaux dans les rêves sont des messagers de l'inconscient profond — ils parlent le langage des instincts que la civilisation nous a appris à taire. Cet animal porte une symbolique millénaire : il représente une force ou une qualité que tu as en toi et que tu n'as pas encore pleinement reconnue. Sa présence dit quelque chose sur ta relation à tes propres instincts.",
      "Selon Jung, les animaux apparaissant en rêve incarnent l'ombre — ces forces primaires que la raison ne contrôle pas. La façon dont tu interagis avec cet animal révèle comment tu vis tes propres pulsions. Le dominer symbolise la maîtrise de soi ; le fuir, la peur de ta propre puissance ; l'apprivoiser, l'intégration de ta nature profonde.",
    ]},
  { keys:["forêt","bois","arbres","montagne","désert","île","jardin","nature","jungle"],
    i:[
      "Les grands espaces naturels dans les rêves sont le territoire de l'inconscient non domestiqué. Cette forêt ou ce paysage représente les étendues de ta psyché encore inexplorées — à la fois inquiétantes et chargées de promesses. Jung voyait dans la forêt le symbole de l'inconscient collectif, ce trésor commun de l'humanité auquel ton âme a accès.",
      "La nature dans les rêves parle à l'âme dans son langage originel. Ce paysage n'est pas un décor — c'est un reflet exact de ton état intérieur profond. La beauté ou l'hostilité du lieu, la lumière ou l'obscurité qui y règne : tout cela traduit ce que tu vis en ce moment à un niveau que les mots ne peuvent pas encore exprimer.",
    ]},
  { keys:["lumière","soleil","étoile","feu","flamme","briller","obscurité","ténèbres","ombre"],
    i:[
      "La lumière en rêve est le symbole universel de la conscience qui s'éveille. Sa présence signale une prise de conscience imminente — quelque chose qui était dans l'ombre de ton psyché commence à être éclairé. Freud associait les rêves lumineux à la libido sublimée ; Jung, à l'émergence du Soi. Cette clarté que tu perçois est le reflet d'une clarté intérieure qui grandit.",
      "Le jeu de lumière et d'ombre dans ton rêve touche aux archétypes les plus fondamentaux de la psyché. La flamme représente à la fois la destruction créatrice et la chaleur vitale. Ce feu ou cette lumière parle de ta vitalité, de ta passion, de ce qui te fait brûler de l'intérieur.",
    ]},
  { keys:["amour","embrasser","baiser","séduction","couple","ex","partenaire","rencontre","attirer"],
    i:[
      "Les rêves amoureux mettent en scène l'anima ou l'animus jungien — ces figures intérieures qui incarnent les qualités que nous cherchons à intégrer. La personne que tu rencontres symbolise souvent une qualité — la douceur, la force, la liberté — que tu veux développer en toi-même. Ce n'est pas forcément du désir littéral, mais un désir de réconciliation intérieure.",
      "L'amour dans les rêves parle de tes besoins d'intimité, de connexion et de reconnaissance les plus profonds. Si tu ressens une joie intense, c'est que tu es proche d'une forme d'harmonie intérieure. Freud y voyait la libido ; Jung, quelque chose de plus vaste — le désir de totalité et d'intégration psychique.",
    ]},
  { keys:["travail","bureau","patron","collègue","licencié","examen","raté","note","test","échoué"],
    i:[
      "Les rêves liés au travail ou aux examens traduisent le syndrome de l'imposteur — cette voix intérieure qui doute de ta valeur. Ton inconscient met en scène tes peurs professionnelles pour te permettre de les traverser en sécurité pendant ton sommeil. C'est une répétition psychologique qui te prépare à affronter les défis réels avec plus de confiance.",
      "Rater un examen ou être en difficulté au travail en rêve est extrêmement courant — et presque toujours le signe d'une pression que tu te mets à toi-même. Ton inconscient te parle de perfectionnisme ou de peur du jugement. La bonne nouvelle : ce type de rêve survient quand tu as les ressources nécessaires pour faire face.",
    ]},
];

const MOOD_EXTRA = {
  "serein":"Cette sérénité ressentie est un signal précieux — ton inconscient te confirme que tu es sur la bonne voie, en harmonie avec toi-même.",
  "mystérieux":"Le mystère de ce rêve est intentionnel — l'inconscient parle en énigmes quand le message est trop important pour être dit directement.",
  "euphorique":"Cette euphorie onirique reflète un alignement intérieur fort qui cherche à s'exprimer dans ta vie quotidienne.",
  "angoissant":"L'angoisse de ce rêve est un signal bienveillant — ton inconscient attire ton attention sur quelque chose qui mérite d'être regardé en face.",
  "étrange":"L'étrangeté est la force de ce rêve — l'inconscient parle en métaphores absurdes pour contourner la résistance de ta pensée rationnelle.",
  "épique":"La dimension épique traduit des enjeux intérieurs majeurs. Ton inconscient te met en scène comme héros de ta propre odyssée.",
};

function analyzeDream(text, mood) {
  return new Promise(resolve => {
    setTimeout(() => {
      const t = text.toLowerCase();
      const found = KB.find(e => e.keys.some(k => t.includes(k)));
      if (found) {
        resolve(found.i[Math.floor(Math.random() * found.i.length)]);
      } else {
        const extra = MOOD_EXTRA[mood] || MOOD_EXTRA["mystérieux"];
        const generic = [
          " Ton rêve convoque des images personnelles qui échappent aux catégories communes — signe qu'il touche à quelque chose de très particulier dans ta psyché. Les détails qui t'ont frappé au réveil portent le plus de sens. Note-les : ils forment un langage unique que tu apprendras à déchiffrer au fil du temps et des rêves.",
          " Ce rêve parle un langage qui t'appartient en propre — son originalité même est sa richesse. Plutôt que de chercher une interprétation unique, laisse-le résonner en toi. Sa signification se révélera progressivement, souvent dans les jours qui suivent, à travers des coïncidences ou des intuitions soudaines.",
        ];
        resolve(extra + generic[Math.floor(Math.random() * generic.length)]);
      }
    }, 2400);
  });
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FREE_LIMIT = 3;

const MOODS = [
  { id:"serein",     emoji:"😌", label:"Serein",     color:C.teal },
  { id:"mystérieux", emoji:"🌀", label:"Mystérieux", color:C.nebula },
  { id:"euphorique", emoji:"✨", label:"Euphorique", color:C.gold },
  { id:"angoissant", emoji:"😰", label:"Angoissant", color:C.rose },
  { id:"étrange",    emoji:"🌙", label:"Étrange",    color:"#AA88FF" },
  { id:"épique",     emoji:"⚔️", label:"Épique",     color:"#FF9A50" },
];

const SYMBOLS = [
  { s:"Eau",        m:"Émotions, inconscient, transformation profonde",     i:"🌊" },
  { s:"Voler",      m:"Liberté, transcendance, ambitions qui s'élèvent",    i:"🦅" },
  { s:"Maison",     m:"Le Soi, identité, psyché dans sa totalité",          i:"🏚️" },
  { s:"Chute",      m:"Perte de contrôle, lâcher-prise nécessaire",         i:"🌪️" },
  { s:"Poursuite",  m:"Évitement d'une émotion ou d'une décision difficile",i:"👁️" },
  { s:"Mort",       m:"Transformation, fin d'un cycle, renaissance",        i:"🌑" },
  { s:"Serpent",    m:"Sagesse cachée, guérison, énergie vitale",           i:"🐍" },
  { s:"Labyrinthe", m:"Confusion intérieure, quête de sens",                i:"🔮" },
  { s:"Miroir",     m:"Conscience de soi, vérité cachée, identité",         i:"🪞" },
  { s:"Pont",       m:"Transition, passage vers un nouvel état de vie",     i:"🌉" },
];

const PLANS = [
  { id:"weekly",  name:"Hebdo",   price:"2,99€", period:"/semaine", tag:null,      color:C.nebula },
  { id:"monthly", name:"Mensuel", price:"6,99€", period:"/mois",    tag:"⭐ Pop",  color:C.gold },
  { id:"yearly",  name:"Annuel",  price:"2,99€", period:"/mois",    tag:"🔥 -57%", color:C.teal },
];

const ADS = [
  { icon:"🌿", brand:"SomniHerb",  text:"Complément naturel pour rêves lucides — formule brevetée", cta:"Découvrir", color:C.teal,   url:"https://somniherb.com" },
  { icon:"🎧", brand:"BrainWave",  text:"Sons binauraux scientifiques pour induire les rêves lucides",cta:"Écouter",  color:C.nebula, url:"https://brainwave.app" },
  { icon:"📖", brand:"LucidGuide", text:"Le guide complet Jung & rêves lucides — PDF à 4,99€",       cta:"Voir",     color:C.gold,   url:"https://lucidguide.fr" },
];

// ─── STARS ────────────────────────────────────────────────────────────────────
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const stars = Array.from({length:130}, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      r:Math.random()*1.4+0.2, speed:Math.random()*0.004+0.001,
      phase:Math.random()*Math.PI*2,
    }));
    let raf;
    const draw = t => {
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => {
        const a = 0.25+0.6*Math.abs(Math.sin(s.phase+t*s.speed));
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${s.r>1?"232,197,106":"160,170,255"},${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:0.65}}/>;
}

function Orbs() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {[
        {size:300,x:-60,y:-60,c:"rgba(123,156,255,0.07)",d:"0s"},
        {size:220,x:"65%",y:"25%",c:"rgba(232,197,106,0.05)",d:"4s"},
        {size:180,x:"15%",y:"65%",c:"rgba(255,126,179,0.05)",d:"8s"},
      ].map((o,i) => (
        <div key={i} style={{
          position:"absolute", width:o.size, height:o.size, left:o.x, top:o.y,
          borderRadius:"50%", background:`radial-gradient(circle,${o.c},transparent 70%)`,
          animation:`orbF 14s ease-in-out ${o.d} infinite alternate`,
        }}/>
      ))}
    </div>
  );
}

// ─── AD BANNER ────────────────────────────────────────────────────────────────
function AdBanner({ idx }) {
  const [gone, setGone] = useState(false);
  const ad = ADS[idx % ADS.length];
  if (gone) return null;
  return (
    <div style={{
      background:`linear-gradient(135deg,${C.cardAlt},${C.card})`,
      border:`1px solid ${C.border}`, borderRadius:16,
      padding:"12px 14px", marginBottom:14,
      display:"flex", alignItems:"center", gap:12, position:"relative",
    }}>
      <div style={{position:"absolute",top:5,right:8,fontSize:9,color:C.dim,letterSpacing:1}}>SPONSORISÉ</div>
      <span style={{fontSize:26,flexShrink:0}}>{ad.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:10,color:ad.color,fontWeight:700,letterSpacing:0.5,marginBottom:2}}>{ad.brand}</div>
        <div style={{fontSize:12,color:C.mid,lineHeight:1.4}}>{ad.text}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end",flexShrink:0}}>
        <button onClick={() => window.open(ad.url,"_blank")} style={{
          background:`${ad.color}25`,color:ad.color,fontSize:11,fontWeight:700,
          padding:"5px 12px",borderRadius:20,cursor:"pointer",
          border:`1px solid ${ad.color}44`,whiteSpace:"nowrap",
        }}>{ad.cta}</button>
        <button onClick={() => setGone(true)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:10}}>✕ Fermer</button>
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function Paywall({ onClose, reason }) {
  const [sel, setSel] = useState("monthly");
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:`linear-gradient(180deg,#0E0E24,${C.card})`,
        borderRadius:"26px 26px 0 0", padding:"28px 22px 40px",
        width:"100%", maxWidth:440,
        border:`1px solid ${C.borderHi}`, borderBottom:"none",
        maxHeight:"90vh", overflowY:"auto",
      }}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:40,marginBottom:10}}>🌙</div>
          <div style={{
            fontFamily:"'Playfair Display',Georgia,serif", fontSize:24, fontWeight:700,
            background:`linear-gradient(135deg,${C.gold},${C.nebula})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8,
          }}>DreamLens Infinity</div>
          {reason==="limit" ? (
            <div style={{background:`${C.rose}18`,border:`1px solid ${C.rose}44`,borderRadius:12,padding:"10px 14px",marginBottom:10}}>
              <div style={{fontSize:13,color:C.rose,fontWeight:700,marginBottom:3}}>🔒 Limite gratuite atteinte</div>
              <div style={{fontSize:12,color:C.mid}}>Tu as utilisé tes 3 analyses gratuites. Passe à Infinity pour continuer sans limite.</div>
            </div>
          ) : (
            <div style={{color:C.mid,fontSize:13,lineHeight:1.5}}>Plonge sans limites dans l'univers de tes rêves</div>
          )}
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:18}}>
          {[["🔮","Analyses illimitées & approfondies"],["📚","200+ symboles décodés"],["🎯","Patterns sur 30/90 jours"],["🌀","Guide rêves lucides complet"],["🚫","Zéro publicité"],["☁️","Sync & backup automatique"]].map(([ic,t]) => (
            <div key={t} style={{display:"flex",gap:10,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
              <span>{ic}</span><span style={{fontSize:13,color:C.mid}}>{t}</span>
            </div>
          ))}
        </div>
        {PLANS.map(p => (
          <div key={p.id} onClick={() => setSel(p.id)} style={{
            background:sel===p.id?`${p.color}18`:C.cardAlt,
            border:`2px solid ${sel===p.id?p.color:C.border}`,
            borderRadius:14, padding:"13px 16px", marginBottom:10,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
            transition:"all 0.2s",
          }}>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,display:"flex",alignItems:"center",gap:7}}>
                {p.name}
                {p.tag && <span style={{background:`${p.color}25`,color:p.color,fontSize:10,padding:"2px 7px",borderRadius:20}}>{p.tag}</span>}
              </div>
              <div style={{fontSize:11,color:C.dim,marginTop:2}}>{p.period}</div>
            </div>
            <div style={{fontSize:20,fontWeight:800,color:p.color}}>{p.price}</div>
          </div>
        ))}
        <button onClick={() => pay(sel)} style={{
          width:"100%", padding:16, borderRadius:14, border:"none", cursor:"pointer",
          background:`linear-gradient(135deg,${C.gold},${C.nebula})`,
          color:C.void, fontWeight:800, fontSize:16,
          boxShadow:"0 6px 30px rgba(232,197,106,0.25)",
          marginTop:6, fontFamily:"'DM Sans',sans-serif",
        }}>Commencer mon voyage ✨</button>
        <button onClick={onClose} style={{
          width:"100%", padding:13, borderRadius:14,
          border:`1px solid ${C.border}`, background:"transparent",
          color:C.mid, cursor:"pointer", marginTop:8, fontSize:13, fontFamily:"inherit",
        }}>{reason==="limit"?"Non merci":"Continuer gratuitement"}</button>
        <div style={{textAlign:"center",fontSize:10,color:C.dim,marginTop:10}}>Annulable à tout moment · SSL · RGPD</div>
      </div>
    </div>
  );
}

// ─── NEW DREAM MODAL ──────────────────────────────────────────────────────────
function NewDreamModal({ onClose, onSave, dreamsCount, isPremium, onNeedUpgrade }) {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState("");
  const [lucid, setLucid] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const goAnalyze = async () => {
    if (!isPremium && dreamsCount >= FREE_LIMIT) { onClose(); onNeedUpgrade(); return; }
    setStep(3); setLoading(true);
    const a = await analyzeDream(text, mood?.id || "mystérieux");
    setAnalysis(a); setLoading(false);
  };

  const handleSave = () => {
    onSave({ id:Date.now(), date:new Date().toISOString().slice(0,10),
      title:title||"Rêve sans titre", text, mood:mood?.id||"mystérieux",
      moodEmoji:mood?.emoji||"🌙",
      tags:tags.split(",").map(t=>t.trim()).filter(Boolean),
      analysis, lucid, recurring });
    onClose();
  };

  const inp = { width:"100%", background:C.cardAlt, border:`1px solid ${C.border}`,
    borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14,
    resize:"none", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:998,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{
        background:`linear-gradient(180deg,#0E0E24,${C.card})`,
        borderRadius:"26px 26px 0 0", padding:"28px 22px 36px",
        width:"100%", maxWidth:440,
        border:`1px solid ${C.borderHi}`, borderBottom:"none",
        maxHeight:"92vh", overflowY:"auto",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.gold}}>
            {step===1?"✍️ Décris ton rêve":step===2?"🎭 Ambiance émotionnelle":"🔮 Interprétation"}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:20}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {[1,2,3].map(s => (
            <div key={s} style={{flex:1,height:3,borderRadius:2,
              background:s<=step?`linear-gradient(90deg,${C.gold},${C.nebula})`:C.border,
              transition:"background 0.4s"}}/>
          ))}
        </div>

        {step===1 && <>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre du rêve (optionnel)" style={{...inp,marginBottom:12}}/>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder="Décris ton rêve avec un maximum de détails — chaque image, sensation, personnage, couleur compte pour l'interprétation..."
            style={{...inp,minHeight:150}} rows={6}/>
          <div style={{display:"flex",gap:10,margin:"12px 0"}}>
            {[["🌀 Lucide",lucid,setLucid],["🔄 Récurrent",recurring,setRecurring]].map(([label,val,setter]) => (
              <div key={label} onClick={()=>setter(!val)} style={{
                flex:1,padding:10,borderRadius:10,cursor:"pointer",textAlign:"center",
                background:val?`${C.gold}18`:C.cardAlt, border:`1.5px solid ${val?C.gold:C.border}`,
                fontSize:12,fontWeight:val?700:400,color:val?C.gold:C.mid,transition:"all 0.2s",
              }}>{label}</div>
            ))}
          </div>
          <button disabled={text.length<15} onClick={()=>setStep(2)} style={{
            width:"100%",padding:15,borderRadius:14,border:"none",
            background:text.length>=15?`linear-gradient(135deg,${C.nebula},${C.gold})`:C.cardAlt,
            color:text.length>=15?C.void:C.dim,
            fontWeight:700,fontSize:15,cursor:text.length>=15?"pointer":"not-allowed",fontFamily:"inherit",
          }}>Continuer →</button>
        </>}

        {step===2 && <>
          <div style={{fontSize:13,color:C.mid,marginBottom:14}}>Quelle était l'ambiance émotionnelle principale ?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {MOODS.map(m => (
              <div key={m.id} onClick={()=>setMood(m)} style={{
                padding:"14px 8px",borderRadius:14,cursor:"pointer",textAlign:"center",
                background:mood?.id===m.id?`${m.color}20`:C.cardAlt,
                border:`2px solid ${mood?.id===m.id?m.color:C.border}`,transition:"all 0.2s",
              }}>
                <div style={{fontSize:24}}>{m.emoji}</div>
                <div style={{fontSize:11,color:mood?.id===m.id?m.color:C.mid,marginTop:5,fontWeight:600}}>{m.label}</div>
              </div>
            ))}
          </div>
          <input value={tags} onChange={e=>setTags(e.target.value)}
            placeholder="Tags : eau, forêt, maison… (séparés par ,)"
            style={{...inp,marginBottom:14}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setStep(1)} style={{flex:1,padding:13,borderRadius:14,border:`1px solid ${C.border}`,background:"transparent",color:C.mid,cursor:"pointer",fontFamily:"inherit"}}>← Retour</button>
            <button disabled={!mood} onClick={goAnalyze} style={{
              flex:2,padding:13,borderRadius:14,border:"none",
              background:mood?`linear-gradient(135deg,${C.gold},${C.nebula})`:C.cardAlt,
              color:mood?C.void:C.dim,fontWeight:700,cursor:mood?"pointer":"not-allowed",fontFamily:"inherit",
            }}>🔮 Analyser →</button>
          </div>
        </>}

        {step===3 && <>
          {loading?(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:44,marginBottom:16,animation:"spin 3s linear infinite"}}>🔮</div>
              <div style={{color:C.mid,fontSize:14}}>Les astres déchiffrent ton rêve…</div>
              <div style={{color:C.dim,fontSize:12,marginTop:6}}>Analyse psychologique en cours</div>
            </div>
          ):(
            <>
              <div style={{
                background:`linear-gradient(135deg,${C.cardAlt},${C.card})`,
                border:`1px solid ${C.gold}44`,borderRadius:16,padding:20,marginBottom:16,
                boxShadow:"0 0 30px rgba(232,197,106,0.15)",
              }}>
                <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1.5,marginBottom:10}}>✦ INTERPRÉTATION PSYCHOLOGIQUE</div>
                <div style={{fontSize:14,color:C.text,lineHeight:1.8,fontStyle:"italic"}}>{analysis}</div>
              </div>
              <button onClick={handleSave} style={{
                width:"100%",padding:15,borderRadius:14,border:"none",
                background:`linear-gradient(135deg,${C.teal},${C.nebula})`,
                color:C.void,fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",
              }}>Sauvegarder ce rêve 🌙</button>
            </>
          )}
        </>}
      </div>
    </div>
  );
}

// ─── DREAM CARD ───────────────────────────────────────────────────────────────
function DreamCard({ dream, onClick }) {
  const mood = MOODS.find(m=>m.id===dream.mood)||MOODS[0];
  const fmt = d => new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
  return (
    <div onClick={()=>onClick(dream)} style={{
      background:`linear-gradient(135deg,${C.card},${C.cardAlt})`,
      border:`1px solid ${C.border}`, borderRadius:18, padding:"16px 18px",
      marginBottom:12, cursor:"pointer", transition:"border-color 0.2s",
      position:"relative", overflow:"hidden",
    }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=mood.color+"88"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
    >
      <div style={{position:"absolute",top:0,right:0,width:70,height:70,
        background:`radial-gradient(circle,${mood.color}15,transparent 70%)`,
        borderRadius:"0 18px 0 70px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:18}}>{dream.moodEmoji}</span>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:C.text}}>{dream.title}</span>
          </div>
          <div style={{fontSize:11,color:C.dim}}>{fmt(dream.date)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
          {dream.lucid&&<span style={{background:`${C.gold}22`,color:C.gold,fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:700}}>LUCIDE</span>}
          {dream.recurring&&<span style={{background:`${C.rose}22`,color:C.rose,fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:700}}>RÉCURRENT</span>}
        </div>
      </div>
      <div style={{fontSize:13,color:C.mid,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{dream.text}</div>
      {dream.tags?.length>0&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
          {dream.tags.map(t=>(
            <span key={t} style={{background:C.cardAlt,color:C.dim,fontSize:10,padding:"2px 8px",borderRadius:20,border:`1px solid ${C.border}`}}>#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DREAM DETAIL ─────────────────────────────────────────────────────────────
function DreamDetail({ dream, onClose }) {
  const m = MOODS.find(x=>x.id===dream.mood)||MOODS[0];
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:997,overflowY:"auto",padding:"0 0 40px"}}>
      <div style={{maxWidth:440,margin:"0 auto",padding:"0 20px"}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.mid,cursor:"pointer",fontSize:24,padding:"20px 0 10px",display:"block"}}>←</button>
        <div style={{fontSize:11,color:C.dim,marginBottom:6}}>
          {new Date(dream.date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.text,marginBottom:12,lineHeight:1.3}}>{dream.title}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
          <span style={{background:`${m.color}22`,color:m.color,fontSize:12,padding:"5px 12px",borderRadius:20,fontWeight:600}}>{dream.moodEmoji} {dream.mood}</span>
          {dream.lucid&&<span style={{background:`${C.gold}22`,color:C.gold,fontSize:12,padding:"5px 12px",borderRadius:20,fontWeight:600}}>🌀 Lucide</span>}
          {dream.recurring&&<span style={{background:`${C.rose}22`,color:C.rose,fontSize:12,padding:"5px 12px",borderRadius:20,fontWeight:600}}>🔄 Récurrent</span>}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:18,marginBottom:16,fontSize:14,color:C.text,lineHeight:1.8}}>{dream.text}</div>
        {dream.analysis&&(
          <div style={{background:`linear-gradient(135deg,${C.card},${C.cardAlt})`,border:`1px solid ${C.gold}44`,borderRadius:16,padding:18,marginBottom:16,boxShadow:"0 0 24px rgba(232,197,106,0.12)"}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1.5,marginBottom:10}}>✦ INTERPRÉTATION</div>
            <div style={{fontSize:14,color:C.text,lineHeight:1.8,fontStyle:"italic"}}>{dream.analysis}</div>
          </div>
        )}
        {dream.tags?.length>0&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {dream.tags.map(t=>(<span key={t} style={{background:C.cardAlt,color:C.mid,fontSize:12,padding:"4px 12px",borderRadius:20,border:`1px solid ${C.border}`}}>#{t}</span>))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function JournalTab({ dreams, onAdd, onView, isPremium, onUnlock }) {
  const left = Math.max(0, FREE_LIMIT - dreams.length);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:18,marginBottom:18}}>
        {[
          {v:dreams.length,l:"Rêves",c:C.nebula},
          {v:dreams.filter(d=>d.lucid).length,l:"Lucides",c:C.gold},
          {v:isPremium?"∞":left+"/3",l:"Analyses",c:C.teal},
        ].map(s=>(
          <div key={s.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 0",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:C.dim,marginTop:3,fontWeight:600,letterSpacing:0.5}}>{s.l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {!isPremium && <AdBanner idx={0}/>}

      {!isPremium && dreams.length >= FREE_LIMIT && (
        <div style={{
          background:`linear-gradient(135deg,${C.card},${C.cardAlt})`,
          border:`2px solid ${C.rose}55`,borderRadius:16,
          padding:"16px 18px",marginBottom:16,
          display:"flex",alignItems:"center",gap:14,
        }}>
          <span style={{fontSize:28}}>🔒</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:C.rose,marginBottom:4}}>Limite gratuite atteinte</div>
            <div style={{fontSize:12,color:C.mid,lineHeight:1.4}}>Tu as utilisé tes 3 analyses gratuites. Passe à Infinity pour continuer.</div>
          </div>
          <button onClick={onUnlock} style={{
            background:`linear-gradient(135deg,${C.gold},${C.nebula})`,
            color:C.void,fontWeight:800,fontSize:12,
            padding:"8px 14px",borderRadius:12,border:"none",cursor:"pointer",whiteSpace:"nowrap",
          }}>Débloquer</button>
        </div>
      )}

      <button onClick={onAdd} style={{
        width:"100%",padding:16,borderRadius:16,
        border:`1.5px dashed ${C.borderHi}`,background:`${C.gold}08`,
        color:C.gold,cursor:"pointer",
        fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:18,
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,
      }}><span style={{fontSize:20}}>✦</span> Capturer un rêve</button>

      {dreams.length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:C.dim}}>
          <div style={{fontSize:40,marginBottom:12}}>🌙</div>
          <div style={{fontSize:14,lineHeight:1.6}}>Ton journal est vide.<br/>Capture ton premier rêve ce matin !</div>
        </div>
      )}

      {dreams.map(d=><DreamCard key={d.id} dream={d} onClick={onView}/>)}

      {!isPremium&&dreams.length>0&&dreams.length<FREE_LIMIT&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:C.mid}}>🔮 Analyses gratuites restantes</div>
          <div style={{fontSize:14,fontWeight:700,color:C.gold}}>{left} / {FREE_LIMIT}</div>
        </div>
      )}

      {!isPremium&&(
        <div style={{background:`linear-gradient(135deg,${C.card},${C.cardAlt})`,border:`1px solid ${C.nebula}44`,borderRadius:18,padding:24,textAlign:"center",marginTop:6}}>
          <div style={{fontSize:30,marginBottom:10}}>✨</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:8,color:C.gold}}>Analyses illimitées</div>
          <div style={{fontSize:13,color:C.mid,marginBottom:16,lineHeight:1.5}}>Débloque l'analyse sans restriction + patterns + guide rêves lucides</div>
          <button onClick={onUnlock} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.nebula})`,color:C.void,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Débloquer Infinity ✦</button>
        </div>
      )}
    </div>
  );
}

function SymbolsTab({ isPremium, onUnlock }) {
  const [q,setQ]=useState("");
  const filtered=SYMBOLS.filter(s=>s.s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
      <div style={{marginTop:18,marginBottom:14}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Chercher un symbole…"
          style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      </div>
      {!isPremium&&<AdBanner idx={1}/>}
      <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:16,padding:16,marginBottom:16}}>
        <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1,marginBottom:12}}>✦ SYMBOLES UNIVERSELS</div>
        {filtered.map((s,i)=>(
          <div key={s.s} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 0",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}}>
            <span style={{fontSize:24,flexShrink:0}}>{s.i}</span>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:3}}>{s.s}</div>
              <div style={{fontSize:12,color:C.mid,lineHeight:1.5}}>{s.m}</div>
            </div>
          </div>
        ))}
      </div>
      {!isPremium&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:8}}>🔒</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:6,color:C.gold}}>190 autres symboles</div>
          <div style={{fontSize:12,color:C.mid,marginBottom:14}}>Archétypes junguiens, symboles culturels, animaux, lieux…</div>
          <button onClick={onUnlock} style={{width:"100%",padding:13,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gold},${C.nebula})`,color:C.void,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Tout débloquer</button>
        </div>
      )}
    </div>
  );
}

function InsightsTab({ dreams, isPremium, onUnlock }) {
  const total=dreams.length||1;
  const moodCounts=MOODS.map(m=>({...m,count:dreams.filter(d=>d.mood===m.id).length})).filter(m=>m.count>0);
  return (
    <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
      <div style={{marginTop:18}}>
        {!isPremium&&<AdBanner idx={2}/>}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:20,marginBottom:14}}>
          <div style={{fontSize:11,color:C.dim,fontWeight:700,letterSpacing:1.5,marginBottom:14}}>AMBIANCES DOMINANTES</div>
          {moodCounts.length===0?(
            <div style={{color:C.dim,fontSize:13,textAlign:"center",padding:"20px 0"}}>Aucun rêve enregistré encore</div>
          ):moodCounts.map(m=>(
            <div key={m.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span style={{color:C.mid}}>{m.emoji} {m.label}</span>
                <span style={{color:m.color,fontWeight:700}}>{Math.round(m.count/total*100)}%</span>
              </div>
              <div style={{height:6,borderRadius:3,background:C.cardAlt}}>
                <div style={{height:"100%",width:`${Math.round(m.count/total*100)}%`,background:`linear-gradient(90deg,${m.color},${m.color}88)`,borderRadius:3,transition:"width 1s ease"}}/>
              </div>
            </div>
          ))}
        </div>
        {!isPremium?(
          <div style={{background:`linear-gradient(135deg,${C.card},${C.cardAlt})`,border:`1px solid ${C.rose}44`,borderRadius:18,padding:22,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:10}}>🔒</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:8}}>Insights Premium</div>
            <div style={{fontSize:13,color:C.mid,marginBottom:16,lineHeight:1.6}}>• Patterns récurrents détectés<br/>• Corrélations humeur / sommeil<br/>• Évolution sur 30 et 90 jours<br/>• Rapport mensuel PDF</div>
            <button onClick={onUnlock} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.rose},${C.nebula})`,color:C.white,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Voir mes patterns →</button>
          </div>
        ):(
          <div style={{background:`${C.teal}15`,border:`1px solid ${C.teal}44`,borderRadius:16,padding:18}}>
            <div style={{fontSize:13,color:C.teal,fontWeight:700,marginBottom:6}}>✦ Pattern détecté</div>
            <div style={{fontSize:13,color:C.mid,lineHeight:1.6}}>Tu rêves plus souvent de thèmes liés à {moodCounts[0]?.label||"l'inconscient"} — un signe que cette énergie est active dans ta vie en ce moment.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("journal");
  const [dreams,setDreams]=useState(()=>load("dl_dreams",[]));
  const [isPremium,setIsPremium]=useState(()=>load("dl_premium",false));
  const [showPaywall,setShowPaywall]=useState(false);
  const [paywallReason,setPaywallReason]=useState("explore");
  const [showNew,setShowNew]=useState(false);
  const [viewDream,setViewDream]=useState(null);
  const [toast,setToast]=useState("");

  useEffect(()=>{save("dl_dreams",dreams);},[dreams]);
  useEffect(()=>{save("dl_premium",isPremium);},[isPremium]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    if(p.get("success")==="1"){
      setIsPremium(true);
      setToast("✨ Infinity activé — Bienvenue !");
      window.history.replaceState({},"","/");
    }
  },[]);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),3500); };

  const handleAdd = () => {
    if(!isPremium && dreams.length >= FREE_LIMIT){ setPaywallReason("limit"); setShowPaywall(true); }
    else setShowNew(true);
  };

  const openPaywall = (reason="explore") => { setPaywallReason(reason); setShowPaywall(true); };

  const NAV=[{id:"journal",icon:"📖",label:"Journal"},{id:"symbols",icon:"🔮",label:"Symboles"},{id:"insights",icon:"✦",label:"Insights"}];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};overflow:hidden}
        ::-webkit-scrollbar{display:none}
        @keyframes orbF{from{transform:translate(0,0) scale(1)}to{transform:translate(20px,30px) scale(1.08)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
      <StarField/><Orbs/>
      <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"transparent",height:"100vh",maxWidth:440,margin:"0 auto",position:"relative",zIndex:1,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 22px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,background:`linear-gradient(135deg,${C.gold},#FFF8E1,${C.nebula})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DreamLens</div>
            <div style={{fontSize:10,color:C.dim,letterSpacing:1}}>JOURNAL IA DES RÊVES</div>
          </div>
          {isPremium
            ?<div style={{background:`${C.gold}22`,color:C.gold,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,border:`1px solid ${C.gold}44`}}>✦ INFINITY</div>
            :<button onClick={()=>openPaywall("explore")} style={{background:`linear-gradient(135deg,${C.gold}33,${C.nebula}33)`,color:C.gold,fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.gold}55`,cursor:"pointer"}}>✦ INFINITY</button>
          }
        </div>

        {tab==="journal"&&<JournalTab dreams={dreams} onAdd={handleAdd} onView={setViewDream} isPremium={isPremium} onUnlock={()=>openPaywall("explore")}/>}
        {tab==="symbols"&&<SymbolsTab isPremium={isPremium} onUnlock={()=>openPaywall("explore")}/>}
        {tab==="insights"&&<InsightsTab dreams={dreams} isPremium={isPremium} onUnlock={()=>openPaywall("explore")}/>}

        <div style={{display:"flex",background:`${C.card}EE`,borderTop:`1px solid ${C.border}`,backdropFilter:"blur(20px)",flexShrink:0}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"13px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:tab===n.id?C.gold:C.dim}}>
              <span style={{fontSize:tab===n.id?20:18,transition:"font-size 0.2s"}}>{n.icon}</span>
              <span style={{fontSize:10,fontWeight:tab===n.id?700:400,letterSpacing:0.5}}>{n.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {showPaywall&&<Paywall onClose={()=>setShowPaywall(false)} reason={paywallReason}/>}
      {showNew&&<NewDreamModal onClose={()=>setShowNew(false)} onSave={d=>{setDreams(p=>[d,...p]);showToast("🌙 Rêve sauvegardé !");}} dreamsCount={dreams.length} isPremium={isPremium} onNeedUpgrade={()=>{setPaywallReason("limit");setShowPaywall(true);}}/>}
      {viewDream&&<DreamDetail dream={viewDream} onClose={()=>setViewDream(null)}/>}
      {toast&&<div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:C.card,border:`1px solid ${C.gold}66`,color:C.gold,padding:"11px 20px",borderRadius:14,fontSize:13,fontWeight:700,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 30px rgba(232,197,106,0.22)",animation:"slideUp 0.3s ease",fontFamily:"'DM Sans',sans-serif"}}>{toast}</div>}
    </>
  );
}
