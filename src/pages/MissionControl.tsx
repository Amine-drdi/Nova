import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Terminal, ArrowUp, Mic, RefreshCw, Trash2, X,
  Search, Tag, FileCode, BarChart3, Gauge, Link2, Image,
  Code2, CheckCircle2, Loader2, AlertCircle, Clock, Zap,
  Pause, Activity, TrendingUp, ChevronDown, ChevronUp,
  Send, Shield, Sparkles, Target, Layout, FileText,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { staggerChildren: 0.08 };

/* ─── Typewriter Hook ─── */
function useTypewriter(texts: string[], typeSpeed = 50, deleteSpeed = 30, pause = 2000) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fullText = texts[index];
    let timer: ReturnType<typeof setTimeout>;
    if (isDeleting) {
      timer = setTimeout(() => {
        setText((t) => t.slice(0, -1));
        if (text === "") { setIsDeleting(false); setIndex((i) => (i + 1) % texts.length); }
      }, deleteSpeed);
    } else {
      timer = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
        if (text.length + 1 >= fullText.length) {
          timer = setTimeout(() => setIsDeleting(true), pause);
        }
      }, typeSpeed);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, texts, typeSpeed, deleteSpeed, pause]);

  return { text, isDeleting, showCursor: true };
}

/* ─── Priority Badge ─── */
const priorityConfig: Record<string, { color: string; bg: string }> = {
  Basse: { color: "#8B8B9E", bg: "rgba(74, 74, 94, 0.2)" },
  Moyenne: { color: "#06B6D4", bg: "rgba(6, 182, 212, 0.15)" },
  Haute: { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.15)" },
  Critique: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.15)" },
};

/* ─── Status Badge ─── */
const statusConfig: Record<string, { cls: string; label: string }> = {
  running: { cls: "badge-glow-info", label: "En cours" },
  completed: { cls: "badge-glow-success", label: "Terminee" },
  failed: { cls: "badge-glow-error", label: "Echec" },
  queued: { cls: "badge-glow-warning", label: "En attente" },
};

/* ─── Mission Type ─── */
interface Mission {
  id: number;
  title: string;
  status: "running" | "completed" | "failed" | "queued";
  priority: string;
  progress: number;
  total: number;
  created: string;
  expanded: boolean;
  tasks: string[];
}

/* ─── Quick Chips ─── */
const quickChips = [
  { label: "Audit SEO complet", icon: <Search size={14} /> },
  { label: "Optimiser les meta tags", icon: <Tag size={14} /> },
  { label: "Generer le sitemap", icon: <FileCode size={14} /> },
  { label: "Analyse keywords", icon: <BarChart3 size={14} /> },
  { label: "Audit performance", icon: <Gauge size={14} /> },
  { label: "Verifier les liens", icon: <Link2 size={14} /> },
  { label: "Optimiser images", icon: <Image size={14} /> },
  { label: "Mettre a jour Schema.org", icon: <Code2 size={14} /> },
];

/* ═══════════════════════════════════════════════════════════
   STATS CARDS
   ═══════════════════════════════════════════════════════════ */
function StatsCards({ stats }: { stats: { total: number; running: number; completed: number; rate: number } }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {[
        { label: "Missions totales", value: stats.total, icon: <Activity size={20} className="text-[#06B6D4]" />, delta: "+12 ce mois" },
        { label: "En cours", value: stats.running, icon: <Loader2 size={20} className="text-[#8B5CF6]" />, delta: "Actives" },
        { label: "Completees", value: stats.completed, icon: <CheckCircle2 size={20} className="text-[#22C55E]" />, delta: "+89 ce mois" },
        { label: "Taux de succes", value: `${stats.rate}%`, icon: <TrendingUp size={20} className="text-[#F59E0B]" />, delta: "+2.3% vs mois dernier" },
      ].map((card, i) => (
        <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: i * 0.08 }} className="gal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.1)" }}>{card.icon}</div>
            <span className="text-xs uppercase tracking-wider text-[#8B8B9E]">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
          <div className="text-[#8B8B9E] text-xs">{card.delta}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO COMMAND INTERFACE
   ═══════════════════════════════════════════════════════════ */
function CommandInterface({ onExecute, isExecuting }: { onExecute: (query: string, priority: string) => void; isExecuting: boolean }) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typewriter = useTypewriter([
    "Lance un audit SEO complet sur LNR Finance avec focus sur les mots-cles 'telesecretariat Paris' et 'standard externalise'...",
    "Cree une campagne Meta Ads pour l'ete ciblant les 25-45 ans en region parisienne...",
    "Genere 5 images pour les reseaux sociaux sur le theme 'immobilier de luxe'...",
    "Analyse mes concurrents sur 'marketing digital' et genere un rapport comparatif...",
    "Scanne la securite de tous mes sites et envoie un rapport a l'equipe...",
    "Genere un rapport mensuel et envoie-le a l'equipe par email...",
  ]);

  const handleChipClick = (label: string) => {
    setQuery(label);
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!query.trim() || isExecuting) return;
    onExecute(query, priority);
  };

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="visible"
      className="mb-8"
    >
      {/* Title */}
      <motion.div variants={fadeUp} className="text-center mb-6">
        <h1
          className="text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          Mission Control
        </h1>
        <div className="text-[#8B8B9E] text-lg h-8">
          <span className="text-[#06B6D4]">&gt;</span> {typewriter.text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-2 h-4 bg-[#06B6D4] ml-1 align-middle"
          />
        </div>
      </motion.div>

      {/* Command Input */}
      <motion.div
        variants={fadeUp}
        className="gal-card p-6 max-w-4xl mx-auto"
        style={{
          border: focused ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid var(--glass-border)",
          boxShadow: focused ? "0 0 30px rgba(6, 182, 212, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)" : undefined,
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Textarea */}
        <div className="relative mb-4">
          <Terminal size={20} className="absolute left-3 top-3 text-[#06B6D4]" />
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Decrivez votre mission en langage naturel..."
            className="gal-input w-full pl-12 pr-12 resize-none"
            style={{
              minHeight: 120,
              fontSize: 16,
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              lineHeight: 1.5,
            }}
          />
          <button className="absolute right-3 top-3 p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors">
            <Mic size={16} />
          </button>
        </div>

        {/* Priority Selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-wider text-[#8B8B9E]">Priorite :</span>
          {Object.entries(priorityConfig).map(([label, cfg]) => (
            <button
              key={label}
              onClick={() => setPriority(label)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: priority === label ? cfg.bg : "transparent",
                color: priority === label ? cfg.color : "#8B8B9E",
                border: `1px solid ${priority === label ? cfg.color : "#1E1E2D"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Execute Button */}
        <button
          onClick={handleSubmit}
          disabled={isExecuting || !query.trim()}
          className="btn-neon w-full flex items-center justify-center gap-2 py-3"
          style={{ opacity: isExecuting || !query.trim() ? 0.6 : 1 }}
        >
          {isExecuting ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
          {isExecuting ? "EXECUTION EN COURS..." : "EXECUTER LA MISSION"}
        </button>
      </motion.div>

      {/* Quick Command Chips */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mt-4 max-w-4xl mx-auto">
        {quickChips.map((chip, i) => (
          <motion.button
            key={chip.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.04, duration: 0.3, ease }}
            onClick={() => handleChipClick(chip.label)}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "#8B8B9E",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.3)"; e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.color = "#8B8B9E"; }}
          >
            {chip.icon}
            {chip.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MISSION HISTORY
   ═══════════════════════════════════════════════════════════ */
function MissionHistory({ missions, onToggleExpand, onCancel, onDelete }: {
  missions: Mission[];
  onToggleExpand: (id: number) => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Commandes Recentes</h3>
          <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"><RefreshCw size={12} /> Rafraichir</button>
        </div>
        <div className="space-y-2">
          {missions.map((m) => (
            <motion.div key={m.id} variants={fadeUp} layout className="rounded-lg overflow-hidden" style={{ border: "1px solid #1E1E2D" }}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[rgba(6,182,212,0.02)] transition-colors"
                onClick={() => onToggleExpand(m.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: m.status === "running" ? "#06B6D4" : m.status === "completed" ? "#22C55E" : m.status === "failed" ? "#EF4444" : "#F59E0B" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{m.title}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={statusConfig[m.status].cls}>{statusConfig[m.status].label}</span>
                      <span className="text-[#8B8B9E] text-xs" style={{ color: priorityConfig[m.priority]?.color }}>{m.priority}</span>
                      <span className="text-[#4A4A5E] text-xs">{m.progress}/{m.total} taches</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[#4A4A5E] text-xs">{m.created}</span>
                  {m.status === "running" && (
                    <button onClick={(e) => { e.stopPropagation(); onCancel(m.id); }} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#EF4444] transition-colors" title="Annuler">
                      <X size={14} />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onDelete(m.id); }} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#EF4444] transition-colors" title="Supprimer">
                    <Trash2 size={14} />
                  </button>
                  <button className="p-1 rounded text-[#8B8B9E]">
                    {m.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {m.expanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4" style={{ borderTop: "1px solid #1E1E2D", marginLeft: 20 }}>
                    <div className="pt-3 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-[#8B8B9E] mb-2">Detail des taches</div>
                      {m.tasks.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#8B8B9E]">
                          {i < m.progress ? <CheckCircle2 size={14} className="text-[#22C55E]" /> : <Clock size={14} className="text-[#4A4A5E]" />}
                          <span className={i < m.progress ? "text-[#8B8B9E] line-through" : ""}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIVE EXECUTION PANEL
   ═══════════════════════════════════════════════════════════ */
function ExecutionPanel({ visible, command, terminalLines, progress, step, onCancel }: {
  visible: boolean;
  command: string;
  terminalLines: string[];
  progress: number;
  step: string;
  onCancel: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const steps = [
    { key: "analysis", label: "Analyse de la requete...", icon: <Search size={14} /> },
    { key: "generation", label: "Generation des taches...", icon: <Sparkles size={14} /> },
    { key: "execution", label: "Execution en cours...", icon: <Zap size={14} /> },
    { key: "done", label: "Termine", icon: <CheckCircle2 size={14} /> },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease }}
          className="gal-card p-6 mb-6"
          style={{
            border: "1px solid rgba(6, 182, 212, 0.3)",
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.1), 0 4px 24px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity size={18} className="text-[#06B6D4]" />
              Execution en Cours
            </h3>
            <button onClick={onCancel} className="btn-secondary text-xs py-1 px-3" style={{ color: "#EF4444", borderColor: "rgba(239,68,68,0.3)" }}>
              <X size={12} className="inline mr-1" /> Annuler
            </button>
          </div>

          {/* Command display */}
          <div className="mb-4 p-3 rounded-lg italic text-[#8B8B9E] text-sm" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
            &ldquo;{command}&rdquo;
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: i <= currentStepIndex ? "rgba(6, 182, 212, 0.15)" : "rgba(74, 74, 94, 0.2)",
                    border: `1px solid ${i <= currentStepIndex ? "#06B6D4" : "#1E1E2D"}`,
                    color: i <= currentStepIndex ? "#06B6D4" : "#4A4A5E",
                  }}
                >
                  {i < currentStepIndex ? <CheckCircle2 size={14} className="text-[#22C55E]" /> : s.icon}
                </div>
                <span className="text-xs" style={{ color: i <= currentStepIndex ? "#FFFFFF" : "#4A4A5E" }}>{s.label}</span>
                {i < steps.length - 1 && <ArrowRight size={12} className="text-[#4A4A5E]" />}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#8B8B9E]">Progression</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="gal-progress-track" style={{ height: 8 }}>
              <motion.div
                className="gal-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>
          </div>

          {/* Terminal output */}
          <div
            ref={scrollRef}
            className="p-4 rounded-lg font-mono text-xs space-y-1 max-h-64 overflow-y-auto"
            style={{ background: "#0A0A1A", border: "1px solid #1E1E2D" }}
          >
            {terminalLines.map((line, i) => {
              const isTimestamp = line.match(/^\[\d{2}:\d{2}:\d{2}\]/);
              const isError = line.includes("ERREUR") || line.includes("erreur");
              const isSuccess = line.includes("SUCCES") || line.includes("Termine");
              const isWarning = line.includes("ATTENTION");
              return (
                <div key={i}>
                  {isTimestamp && <span className="text-[#06B6D4]">{line.match(/^\[\d{2}:\d{2}:\d{2}\]/)?.[0]} </span>}
                  <span style={{
                    color: isError ? "#EF4444" : isSuccess ? "#22C55E" : isWarning ? "#F59E0B" : "#8B8B9E",
                  }}>
                    {line.replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, "")}
                  </span>
                </div>
              );
            })}
            {progress < 100 && <div className="text-[#06B6D4] animate-pulse">_</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACTIVE AGENTS PANEL
   ═══════════════════════════════════════════════════════════ */
function ActiveAgents() {
  const agents = [
    { name: "Agent SEO", task: "Analyse de 47 pages...", progress: 65, step: "3 sur 7", color: "#06B6D4", eta: "~2 min" },
    { name: "Agent Ads", task: "Optimisation des encheres...", progress: 40, step: "2 sur 5", color: "#8B5CF6", eta: "~5 min" },
    { name: "Agent Content", task: "Generation d'articles...", progress: 80, step: "4 sur 5", color: "#EC4899", eta: "~1 min" },
    { name: "Agent Security", task: "Scan de vulnerabilites...", progress: 25, step: "1 sur 4", color: "#22C55E", eta: "~8 min" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-[#8B5CF6]" />
          Agents Actifs
        </h3>
        <div className="space-y-4">
          {agents.map((agent) => (
            <motion.div key={agent.name} variants={fadeUp} className="p-3 rounded-lg" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1px solid ${agent.color}`, borderTopColor: "transparent" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-1 rounded-full"
                      style={{ border: `1px solid ${agent.color}40`, borderBottomColor: "transparent" }}
                    />
                  </div>
                  <span className="text-white text-sm font-medium">{agent.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4A4A5E] text-xs">{agent.eta}</span>
                  <button className="p-1 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#EF4444] transition-colors"><X size={12} /></button>
                </div>
              </div>
              <div className="text-[#8B8B9E] text-xs mb-2">{agent.task}</div>
              <div className="flex items-center gap-2">
                <div className="gal-progress-track flex-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${agent.color}, ${agent.color}80)` }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 1, ease }}
                  />
                </div>
                <span className="text-xs text-[#8B8B9E]">{agent.progress}%</span>
              </div>
              <div className="text-[#4A4A5E] text-xs mt-1">Etape {agent.step}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN MISSION CONTROL PAGE
   ═══════════════════════════════════════════════════════════ */
export default function MissionControl() {
  const [stats, setStats] = useState({ total: 156, running: 3, completed: 142, rate: 97 });
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: "Audit SEO complet - LNR Finance", status: "completed", priority: "Haute", progress: 5, total: 5, created: "Il y a 2h", expanded: false, tasks: ["Analyse technique", "Analyse mots-cles", "Analyse backlinks", "Analyse concurrentielle", "Generation du rapport"] },
    { id: 2, title: "Optimiser meta tags - Clinique du Louvre", status: "running", priority: "Moyenne", progress: 2, total: 4, created: "Il y a 15 min", expanded: false, tasks: ["Analyse des pages", "Optimisation des titres", "Optimisation descriptions", "Validation"] },
    { id: 3, title: "Generer sitemap - Maison Dupont", status: "queued", priority: "Basse", progress: 0, total: 3, created: "Il y a 5 min", expanded: false, tasks: ["Crawler le site", "Generer le XML", "Soumettre a Google"] },
    { id: 4, title: "Audit performance - TechStart", status: "failed", priority: "Haute", progress: 1, total: 4, created: "Il y a 1h", expanded: false, tasks: ["Analyse Lighthouse", "Optimiser le LCP", "Compresser les assets", "Verifier le cache"] },
    { id: 5, title: "Analyse keywords - LNR Finance", status: "completed", priority: "Moyenne", progress: 3, total: 3, created: "Il y a 3h", expanded: false, tasks: ["Recherche de mots-cles", "Analyse de la concurrence", "Rapport final"] },
    { id: 6, title: "Verifier les liens - tous les sites", status: "completed", priority: "Basse", progress: 2, total: 2, created: "Hier", expanded: false, tasks: ["Scan des liens casses", "Generer le rapport"] },
  ]);

  const [executionVisible, setExecutionVisible] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("analysis");
  const [isExecuting, setIsExecuting] = useState(false);

  const simulateExecution = (command: string, _priority: string) => {
    setIsExecuting(true);
    setExecutionVisible(true);
    setCurrentCommand(command);
    setTerminalLines([]);
    setExecutionProgress(0);
    setCurrentStep("analysis");

    const logSequence = [
      { step: "analysis", delay: 0, lines: [`[${new Date().toLocaleTimeString("fr-FR")}] Analyse de la commande: "${command}"`, `[${new Date().toLocaleTimeString("fr-FR")}] Decomposition en sous-taches...`] },
      { step: "generation", delay: 1500, lines: [`[${new Date().toLocaleTimeString("fr-FR")}] Generation du plan d'execution`, `[${new Date().toLocaleTimeString("fr-FR")}] 5 etapes identifiees`] },
      { step: "execution", delay: 3000, lines: [`[${new Date().toLocaleTimeString("fr-FR")}] Etape 1/5: Analyse technique du site`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 47 pages analysees`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 3 erreurs critiques detectees`, `[${new Date().toLocaleTimeString("fr-FR")}] Etape 2/5: Analyse des mots-cles`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 312 mots-cles suivis`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 23 opportunites identifiees`, `[${new Date().toLocaleTimeString("fr-FR")}] Etape 3/5: Analyse des backlinks`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 3,842 backlinks trouves`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 89% dofollow`, `[${new Date().toLocaleTimeString("fr-FR")}] Etape 4/5: Analyse concurrentielle`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 5 concurrents analyses`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> 14 opportunites de contenu`, `[${new Date().toLocaleTimeString("fr-FR")}] Etape 5/5: Generation du rapport`, `[${new Date().toLocaleTimeString("fr-FR")}]   -> Rapport PDF genere: 24 pages`] },
      { step: "done", delay: 12000, lines: [`[${new Date().toLocaleTimeString("fr-FR")}] TERMINE - Rapport disponible dans Reporting`] },
    ];

    logSequence.forEach(({ step, delay, lines }) => {
      setTimeout(() => {
        setCurrentStep(step);
        lines.forEach((line, i) => {
          setTimeout(() => {
            setTerminalLines((prev) => [...prev, line]);
          }, i * 300);
        });
        const progressMap: Record<string, number> = { analysis: 15, generation: 30, execution: 80, done: 100 };
        setExecutionProgress(progressMap[step] || 0);

        if (step === "done") {
          setTimeout(() => {
            setIsExecuting(false);
            setStats((s) => ({ ...s, total: s.total + 1, completed: s.completed + 1 }));
            setMissions((prev) => [
              { id: Date.now(), title: command, status: "completed", priority: "Moyenne", progress: 5, total: 5, created: "A l'instant", expanded: false, tasks: ["Analyse technique", "Analyse mots-cles", "Analyse backlinks", "Analyse concurrentielle", "Generation du rapport"] },
              ...prev,
            ]);
          }, 1000);
        }
      }, delay);
    });
  };

  const toggleExpand = (id: number) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, expanded: !m.expanded } : m));
  };

  const cancelMission = (id: number) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, status: "failed" as const } : m));
    if (executionVisible) {
      setIsExecuting(false);
      setTerminalLines((prev) => [...prev, `[${new Date().toLocaleTimeString("fr-FR")}] MISSION ANNULEE PAR L'UTILISATEUR`]);
      setCurrentStep("done");
      setExecutionProgress(100);
    }
  };

  const deleteMission = (id: number) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }}>
      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Hero Command */}
      <CommandInterface onExecute={simulateExecution} isExecuting={isExecuting} />

      {/* Execution Panel */}
      <ExecutionPanel
        visible={executionVisible}
        command={currentCommand}
        terminalLines={terminalLines}
        progress={executionProgress}
        step={currentStep}
        onCancel={() => { setExecutionVisible(false); setIsExecuting(false); }}
      />

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <MissionHistory missions={missions} onToggleExpand={toggleExpand} onCancel={cancelMission} onDelete={deleteMission} />
        <ActiveAgents />
      </div>
    </motion.div>
  );
}
