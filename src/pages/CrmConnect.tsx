import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Zap, CheckCircle, AlertTriangle, Plus, RefreshCw, Settings,
  FileText, Play, Edit2, Trash2, X, ChevronDown, Terminal, Webhook,
  Loader2, Search, Filter, StopCircle, Activity, Clock, ArrowRight,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { staggerChildren: 0.08 };

const statusBadge = (s: string) => {
  if (s === "Connecte" || s === "Succes") return <span className="badge-glow-success">{s}</span>;
  if (s === "En cours") return <span className="badge-glow-info">{s}</span>;
  if (s === "Deconnecte" || s === "Echec") return <span className="badge-glow-error">{s}</span>;
  if (s === "En attente") return <span className="badge-glow-warning">{s}</span>;
  return <span className="badge-glow-neutral">{s}</span>;
};

/* ─── KPI Card ─── */
function KpiCard({ icon, label, value, delta, deltaType, sub }: { icon: React.ReactNode; label: string; value: string; delta: string; deltaType: string; sub: string }) {
  return (
    <motion.div variants={fadeUp} className="gal-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.1)" }}>
          {icon}
        </div>
        <span className="text-xs uppercase tracking-wider text-[#8B8B9E]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={deltaType === "green" ? "text-[#22C55E]" : deltaType === "amber" ? "text-[#F59E0B]" : "text-[#8B8B9E]"}>{delta}</span>
        <span className="text-[#4A4A5E]">{sub}</span>
      </div>
    </motion.div>
  );
}

/* ─── Client Sites ─── */
function ClientSites() {
  const [sites, setSites] = useState([
    { id: 1, nom: "LNR Finance", url: "https://lnrfinance.fr", platform: "WordPress", status: "Connecte", lastSync: "Il y a 15 min", tasks: 24, health: 92, type: "API" },
    { id: 2, nom: "Clinique du Louvre", url: "https://cliniquedulouvre.fr", platform: "WordPress", status: "Connecte", lastSync: "Il y a 32 min", tasks: 18, health: 88, type: "Plugin" },
    { id: 3, nom: "Maison Dupont", url: "https://maisondupont.com", platform: "Shopify", status: "Sync en cours", lastSync: "En cours...", tasks: 31, health: 75, type: "API" },
    { id: 4, nom: "TechStart Paris", url: "https://techstart.fr", platform: "Webflow", status: "Deconnecte", lastSync: "Il y a 2j", tasks: 12, health: 45, type: "Webhook" },
  ]);
  const [testingId, setTestingId] = useState<number | null>(null);

  const testConnection = (id: number) => {
    setTestingId(id);
    setTimeout(() => setTestingId(null), 2000);
  };

  const platformColor = (p: string) => {
    const colors: Record<string, string> = { WordPress: "#06B6D4", Shopify: "#8B5CF6", Webflow: "#22C55E", Wix: "#F59E0B", Generic: "#8B8B9E" };
    return colors[p] || "#8B8B9E";
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {sites.map((site) => (
        <motion.div key={site.id} variants={fadeUp} className="gal-card p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white" style={{ background: platformColor(site.platform) }}>
                {site.platform[0]}
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{site.nom}</h4>
                <code className="text-[#06B6D4] text-xs font-mono">{site.url}</code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusBadge(site.status)}
              <span className="badge-glow-neutral text-[10px]">{site.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8B8B9E]">Sante</span>
                <span className={site.health > 80 ? "text-[#22C55E]" : site.health > 50 ? "text-[#F59E0B]" : "text-[#EF4444]"}>{site.health}%</span>
              </div>
              <div className="gal-progress-track">
                <div className="gal-progress-fill" style={{ width: `${site.health}%`, background: site.health > 80 ? "linear-gradient(90deg, #22C55E, #16a34a)" : site.health > 50 ? "linear-gradient(90deg, #F59E0B, #d97706)" : "linear-gradient(90deg, #EF4444, #dc2626)" }} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-[#8B8B9E]">
              <span className="flex items-center gap-1"><Clock size={12} /> {site.lastSync}</span>
              <span className="flex items-center gap-1"><Zap size={12} /> {site.tasks} taches ce mois</span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => testConnection(site.id)} disabled={testingId === site.id} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#06B6D4] transition-colors" title="Tester">
                {testingId === site.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              </button>
              <button className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors" title="Configurer"><Settings size={14} /></button>
              <button className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors" title="Logs"><FileText size={14} /></button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Task Queue ─── */
function TaskQueue() {
  const [tasks, setTasks] = useState([
    { id: 1, nom: "Sync leads", site: "lnrfinance.fr", type: "API", freq: "Toutes les 15min", lastExec: "14:23", status: "Succes", next: "14:38" },
    { id: 2, nom: "Backup SEO", site: "cliniquedulouvre.fr", type: "Plugin", freq: "Quotidien", lastExec: "03:00", status: "Succes", next: "Demain" },
    { id: 3, nom: "Update meta", site: "maisondupont.com", type: "API", freq: "Hebdo", lastExec: "10:00", status: "Succes", next: "Lun." },
    { id: 4, nom: "Scan securite", site: "techstart.fr", type: "Webhook", freq: "Mensuel", lastExec: "1er juin", status: "Echec", next: "1er juil." },
    { id: 5, nom: "Optimiser images", site: "lnrfinance.fr", type: "Plugin", freq: "Quotidien", lastExec: "06:00", status: "En cours", next: "..." },
    { id: 6, nom: "Gen. sitemap", site: "cliniquedulouvre.fr", type: "API", freq: "Hebdo", lastExec: "09:15", status: "Succes", next: "Lun." },
    { id: 7, nom: "Audit liens", site: "maisondupont.com", type: "API", freq: "Toutes les 6h", lastExec: "12:00", status: "En attente", next: "18:00" },
    { id: 8, nom: "Sync GA4", site: "techstart.fr", type: "API", freq: "Toutes les 30min", lastExec: "14:00", status: "Succes", next: "14:30" },
  ]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Taches Automatisees</h3>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"><Filter size={12} /> Filtrer</button>
          </div>
        </div>
        <table className="gal-table">
          <thead>
            <tr><th>Tache</th><th>Site</th><th>Type</th><th>Frequence</th><th>Derniere exec.</th><th>Statut</th><th>Prochaine</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <motion.tr key={t.id} variants={fadeUp} layout>
                <td className="text-white font-medium text-sm">{t.nom}</td>
                <td><code className="text-[#06B6D4] text-xs font-mono">{t.site}</code></td>
                <td><span className="badge-glow-neutral text-[10px]">{t.type}</span></td>
                <td className="text-[#8B8B9E] text-xs">{t.freq}</td>
                <td className="text-[#8B8B9E] text-xs">{t.lastExec}</td>
                <td>{statusBadge(t.status)}</td>
                <td className="text-[#8B8B9E] text-xs">{t.next}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#22C55E] transition-colors" title="Executer"><Play size={12} /></button>
                    <button className="p-1 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors" title="Modifier"><Edit2 size={12} /></button>
                    <button className="p-1 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#EF4444] transition-colors" title="Supprimer"><Trash2 size={12} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

/* ─── Task Executor ─── */
function TaskExecutor() {
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);

  const taskTypes = [
    "Audit SEO complet", "Optimiser meta tags", "Generer le sitemap", "Analyser keywords",
    "Audit performance", "Verifier les liens", "Optimiser images", "Mettre a jour Schema.org",
    "Sync leads", "Backup SEO", "Scan securite", "Sync GA4",
  ];

  const sites = ["lnrfinance.fr", "cliniquedulouvre.fr", "maisondupont.com", "techstart.fr"];

  const executeTask = () => {
    if (!selectedTask || !selectedSite) return;
    setIsExecuting(true);
    setProgress(0);
    setTerminalOutput([]);

    const lines = [
      `[${new Date().toLocaleTimeString("fr-FR")}] Connexion a ${selectedSite}...`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Authentification OK`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Execution : ${selectedTask}`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Analyse en cours...`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Traitement des donnees`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Finalisation`,
      `[${new Date().toLocaleTimeString("fr-FR")}] Succes - Tache terminee`,
    ];

    lines.forEach((line, i) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, line]);
        setProgress(((i + 1) / lines.length) * 100);
        if (i === lines.length - 1) {
          setTimeout(() => setIsExecuting(false), 500);
        }
      }, i * 800);
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Executer une Tache</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Type de tache</label>
            <select className="gal-input w-full" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              <option value="">Selectionner une tache...</option>
              {taskTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Site cible</label>
            <select className="gal-input w-full" value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
              <option value="">Selectionner un site...</option>
              {sites.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={executeTask} disabled={isExecuting || !selectedTask || !selectedSite} className="btn-neon w-full flex items-center justify-center gap-2">
            {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {isExecuting ? "Execution en cours..." : "Executer"}
          </button>

          <AnimatePresence>
            {(terminalOutput.length > 0 || isExecuting) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="gal-progress-track mb-3">
                  <motion.div className="gal-progress-fill" animate={{ width: `${progress}%` }} />
                </div>
                <div className="p-4 rounded-lg font-mono text-xs space-y-1 max-h-48 overflow-y-auto" style={{ background: "#0A0A1A", border: "1px solid #1E1E2D" }}>
                  {terminalOutput.map((line, i) => (
                    <div key={i} className="text-[#8B8B9E]">
                      <span className="text-[#06B6D4]">{line.match(/^\[[\d:]+\]/)?.[0]}</span>
                      <span>{line.replace(/^\[[\d:]+\]\s*/, " ")}</span>
                    </div>
                  ))}
                  {isExecuting && <div className="text-[#06B6D4] animate-pulse">_</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Webhook Manager ─── */
function WebhookManager() {
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: "Leads Webhook", url: "https://lnrfinance.fr/webhooks/leads", events: ["lead.created", "lead.updated"], status: true },
    { id: 2, name: "Reports Webhook", url: "https://lnrfinance.fr/webhooks/reports", events: ["report.generated"], status: true },
    { id: 3, name: "Campaigns Webhook", url: "https://lnrfinance.fr/webhooks/campaigns", events: ["campaign.updated", "campaign.ended"], status: false },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const toggleWebhook = (id: number) => {
    setWebhooks((prev) => prev.map((w) => w.id === id ? { ...w, status: !w.status } : w));
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Webhooks &amp; API</h3>
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-3 rounded-lg" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Webhook size={14} className="text-[#06B6D4]" />
                  <span className="text-white text-sm font-medium">{wh.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleWebhook(wh.id)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${wh.status ? "badge-glow-success" : "badge-glow-neutral"}`}>
                    {wh.status ? "Actif" : "Inactif"}
                  </button>
                  <button className="p-1 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
              <code className="text-[#06B6D4] text-xs font-mono block mb-2">{wh.url}</code>
              <div className="flex gap-1">
                {wh.events.map((e) => <span key={e} className="badge-glow-info text-[10px] px-1.5 py-0.5">{e}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid #1E1E2D" }}>
          <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Nouveau webhook URL</label>
          <div className="flex gap-2">
            <input className="gal-input flex-1" placeholder="https://votre-site.fr/webhook" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            <button className="btn-neon text-sm">Ajouter</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CRM CONNECT PAGE
   ═══════════════════════════════════════════════════════════ */
export default function CrmConnect() {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ nom: "", url: "", platform: "WordPress", apiKey: "", apiEndpoint: "" });

  const handleAddClient = () => {
    setShowModal(false);
    setNewClient({ nom: "", url: "", platform: "WordPress", apiKey: "", apiEndpoint: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CRM Connect</h1>
          <p className="text-[#8B8B9E] text-sm">Connectez vos sites clients et automatisez les taches</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-neon flex items-center gap-2">
          <Plus size={18} /> Ajouter un client
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard icon={<Globe size={20} className="text-[#06B6D4]" />} label="Sites Connectes" value="12" delta="1 en attente" deltaType="amber" sub="Actifs: 11" />
        <KpiCard icon={<Zap size={20} className="text-[#8B5CF6]" />} label="Taches Executees" value="4,821" delta="+156 aujourd'hui" deltaType="green" sub="Ce mois" />
        <KpiCard icon={<CheckCircle size={20} className="text-[#22C55E]" />} label="Sync Reussie" value="99.2%" delta="Dernier echec: il y a 3j" deltaType="green" sub="Healthy" />
        <KpiCard icon={<AlertTriangle size={20} className="text-[#F59E0B]" />} label="Alertes Connection" value="1" delta="Site B en timeout" deltaType="amber" sub="A investiguer" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Sites Clients</h3>
          <ClientSites />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Sante des Connexions</h3>
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="gal-card p-6">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { s: 92, c: "#22C55E" }, { s: 88, c: "#22C55E" }, { s: 75, c: "#F59E0B" },
                  { s: 45, c: "#EF4444" }, { s: 95, c: "#22C55E" }, { s: 82, c: "#22C55E" },
                  { s: 60, c: "#F59E0B" }, { s: 91, c: "#22C55E" }, { s: 78, c: "#22C55E" },
                  { s: 53, c: "#F59E0B" }, { s: 87, c: "#22C55E" }, { s: 71, c: "#22C55E" },
                ].map((cell, i) => (
                  <motion.div
                    key={i} variants={fadeUp}
                    className="aspect-square rounded-lg flex items-center justify-center"
                    style={{ background: `${cell.c}20`, border: `1px solid ${cell.c}40` }}
                    title={`Site ${i + 1}: ${cell.s}%`}
                  >
                    <span className="text-xs font-bold" style={{ color: cell.c }}>{cell.s}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]" /> 8 Healthy</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> 3 Warning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> 1 Critical</span>
                <span className="text-[#8B8B9E]">Moy: 234ms</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Task Queue */}
      <div className="mb-5">
        <TaskQueue />
      </div>

      {/* Bottom Grid: Executor + Webhooks */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <TaskExecutor />
        <WebhookManager />
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
            style={{ background: "rgba(5, 5, 14, 0.8)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
              className="gal-card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Ajouter un client</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Nom du site</label>
                  <input className="gal-input w-full" placeholder="Ex: Mon Site" value={newClient.nom} onChange={(e) => setNewClient((p) => ({ ...p, nom: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">URL</label>
                  <input className="gal-input w-full" placeholder="https://example.com" value={newClient.url} onChange={(e) => setNewClient((p) => ({ ...p, url: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Plateforme</label>
                  <select className="gal-input w-full" value={newClient.platform} onChange={(e) => setNewClient((p) => ({ ...p, platform: e.target.value }))}>
                    <option>WordPress</option><option>Shopify</option><option>Webflow</option><option>Wix</option><option>Generic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Cle API</label>
                  <input className="gal-input w-full" placeholder="sk_..." value={newClient.apiKey} onChange={(e) => setNewClient((p) => ({ ...p, apiKey: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Endpoint API</label>
                  <input className="gal-input w-full" placeholder="https://api.example.com/v1" value={newClient.apiEndpoint} onChange={(e) => setNewClient((p) => ({ ...p, apiEndpoint: e.target.value }))} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddClient} className="btn-neon flex-1">Ajouter</button>
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
