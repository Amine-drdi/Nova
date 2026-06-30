import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Users, CreditCard, Bell, Plug, Key, Lock, Monitor, Cog,
  Copy, Eye, EyeOff, RefreshCw, Trash2, Edit2, UserPlus, Check,
  X, Shield, Smartphone, Download, AlertTriangle, Save, Send,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { staggerChildren: 0.08 };

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      className="relative flex items-center"
    >
      <motion.div
        animate={{ background: checked ? "linear-gradient(135deg, #06B6D4, #8B5CF6)" : "#1E1E2D" }}
        style={{ width: 40, height: 20, borderRadius: 10, position: "relative" }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            width: 16, height: 16, borderRadius: "50%", background: "white",
            position: "absolute", top: 2, left: checked ? 22 : 2,
          }}
        />
      </motion.div>
    </button>
  );
}

const tabs = [
  { key: "compte", label: "Compte", icon: <User size={18} /> },
  { key: "equipe", label: "Equipe", icon: <Users size={18} /> },
  { key: "facturation", label: "Facturation", icon: <CreditCard size={18} /> },
  { key: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { key: "integrations", label: "Integrations", icon: <Plug size={18} /> },
  { key: "api", label: "API", icon: <Key size={18} /> },
  { key: "securite", label: "Securite", icon: <Lock size={18} /> },
  { key: "affichage", label: "Affichage", icon: <Monitor size={18} /> },
  { key: "avance", label: "Avance", icon: <Cog size={18} /> },
];

const roleBadge = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "badge-glow-purple", Manager: "badge-glow-info",
    Editeur: "badge-glow-warning", Lecteur: "badge-glow-neutral",
  };
  return <span className={colors[role] || "badge-glow-neutral"}>{role}</span>;
};
const statusBadge = (status: string) => {
  if (status === "Actif") return <span className="badge-glow-success">{status}</span>;
  if (status === "En attente") return <span className="badge-glow-warning">{status}</span>;
  if (status === "Payee") return <span className="badge-glow-success">{status}</span>;
  return <span className="badge-glow-neutral">{status}</span>;
};

function CompteTab() {
  const [form, setForm] = useState({
    nom: "LNR Finance", email: "admin@lnrfinance.fr", telephone: "+33 1 23 45 67 89",
    langue: "fr", fuseau: "Europe/Paris", entreprise: "LNR Finance",
    siteWeb: "https://lnrfinance.fr", secteur: "services-financiers",
    adresse: "42 Avenue des Champs-Elysees\n75008 Paris, France",
  });
  const [saved, setSaved] = useState(false);
  const update = (k: string, v: string) => { setForm((p) => ({ ...p, [k]: v })); setSaved(false); };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 mb-5">
        <h3 className="text-lg font-semibold text-white mb-5">Informations Personnelles</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center text-white font-bold text-xl"
            style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}>
            LN
          </div>
          <button className="btn-secondary text-xs py-1.5 px-3">Changer la photo</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Nom</label>
            <input className="gal-input w-full" value={form.nom} onChange={(e) => update("nom", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Email</label>
            <input className="gal-input w-full" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Telephone</label>
            <input className="gal-input w-full" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Langue</label>
            <select className="gal-input w-full" value={form.langue} onChange={(e) => update("langue", e.target.value)}>
              <option value="fr">Francais</option><option value="en">English</option>
              <option value="es">Espanol</option><option value="de">Deutsch</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Fuseau horaire</label>
            <select className="gal-input w-full" value={form.fuseau} onChange={(e) => update("fuseau", e.target.value)}>
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New York (UTC-5)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6 mb-5">
        <h3 className="text-lg font-semibold text-white mb-5">Entreprise</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Nom de l'entreprise</label>
            <input className="gal-input w-full" value={form.entreprise} onChange={(e) => update("entreprise", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Site web</label>
            <input className="gal-input w-full" value={form.siteWeb} onChange={(e) => update("siteWeb", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Secteur</label>
            <select className="gal-input w-full" value={form.secteur} onChange={(e) => update("secteur", e.target.value)}>
              <option value="services-financiers">Services financiers</option>
              <option value="ecommerce">E-commerce</option>
              <option value="sante">Sante</option>
              <option value="immobilier">Immobilier</option>
              <option value="technologie">Technologie</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B8B9E] mb-1.5">Adresse</label>
            <textarea className="gal-input w-full" rows={3} value={form.adresse} onChange={(e) => update("adresse", e.target.value)} />
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6" style={{ border: "1px solid rgba(239, 68, 68, 0.3)" }}>
        <h3 className="text-lg font-semibold text-[#EF4444] mb-3 flex items-center gap-2">
          <AlertTriangle size={18} /> Zone de danger
        </h3>
        <p className="text-[#8B8B9E] text-sm mb-4">La suppression de votre compte est irreversible. Toutes vos donnees seront definitivement effacees.</p>
        <button className="btn-neon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444" }}>Supprimer le compte</button>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-5 flex justify-end">
        <button onClick={handleSave} className="btn-neon flex items-center gap-2">
          <Save size={16} /> {saved ? "Sauvegarde !" : "Sauvegarder"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function EquipeTab() {
  const [members, setMembers] = useState([
    { id: 1, nom: "Vous", email: "admin@lnrfinance.fr", role: "Admin", status: "Actif", you: true },
    { id: 2, nom: "Marie D.", email: "marie@lnrfinance.fr", role: "Manager", status: "Actif", you: false },
    { id: 3, nom: "Jean K.", email: "jean@lnrfinance.fr", role: "Editeur", status: "Actif", you: false },
    { id: 4, nom: "Lucie P.", email: "lucie@lnrfinance.fr", role: "Lecteur", status: "En attente", you: false },
    { id: 5, nom: "Pierre M.", email: "pierre@lnrfinance.fr", role: "Editeur", status: "Actif", you: false },
    { id: 6, nom: "Sophie L.", email: "sophie@lnrfinance.fr", role: "Manager", status: "Actif", you: false },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Lecteur");
  const removeMember = (id: number) => setMembers((m) => m.filter((x) => x.id !== id));
  const inviteMember = () => {
    if (!inviteEmail) return;
    setMembers((m) => [...m, { id: Date.now(), nom: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, status: "En attente", you: false }]);
    setInviteEmail(""); setShowInvite(false);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Gestion de l'Equipe</h3>
          <button onClick={() => setShowInvite(true)} className="btn-neon flex items-center gap-2 text-sm">
            <UserPlus size={16} /> Inviter un membre
          </button>
        </div>
        {showInvite && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 p-4 rounded-lg" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
            <div className="flex gap-3">
              <input className="gal-input flex-1" placeholder="Email du membre" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <select className="gal-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option>Admin</option><option>Manager</option><option>Editeur</option><option>Lecteur</option>
              </select>
              <button onClick={inviteMember} className="btn-neon"><Send size={16} /></button>
              <button onClick={() => setShowInvite(false)} className="btn-secondary"><X size={16} /></button>
            </div>
          </motion.div>
        )}
        <table className="gal-table">
          <thead><tr><th>Membre</th><th>Email</th><th>Role</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <motion.tr key={m.id} variants={fadeUp} layout>
                <td className="text-white font-medium">{m.nom} {m.you && <span className="text-[#06B6D4] text-xs">(vous)</span>}</td>
                <td>{m.email}</td><td>{roleBadge(m.role)}</td><td>{statusBadge(m.status)}</td>
                <td>
                  {!m.you && (
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => removeMember(m.id)} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#EF4444] transition-colors"><Trash2 size={14} /></button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

function FacturationTab() {
  const invoices = [
    { date: "15 juin 2024", numero: "INV-2024-0615", montant: "299.00", status: "Payee" },
    { date: "15 mai 2024", numero: "INV-2024-0515", montant: "299.00", status: "Payee" },
    { date: "15 avr. 2024", numero: "INV-2024-0415", montant: "299.00", status: "Payee" },
    { date: "15 mars 2024", numero: "INV-2024-0315", montant: "299.00", status: "Payee" },
    { date: "15 fev. 2024", numero: "INV-2024-0215", montant: "299.00", status: "Payee" },
    { date: "15 janv. 2024", numero: "INV-2024-0115", montant: "299.00", status: "Payee" },
  ];
  const usage = [
    { label: "Missions", used: 87, total: 100 },
    { label: "Sites clients", used: 12, total: 20 },
    { label: "Membres equipe", used: 6, total: 10 },
    { label: "Stockage", used: 45, total: 100 },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 mb-5" style={{ border: "1px solid rgba(139, 92, 246, 0.3)" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="badge-glow-purple text-sm px-3 py-1">Pro</span>
              <span className="text-[#8B8B9E] text-sm">Plan actuel</span>
            </div>
            <div className="text-3xl font-bold text-white">&euro;299<span className="text-base font-normal text-[#8B8B9E]">/mois</span></div>
            <p className="text-[#8B8B9E] text-sm mt-1">Renouvellement : 15 juillet 2024</p>
          </div>
          <button className="btn-secondary text-sm">Changer de plan</button>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {["Missions illimitees", "20 sites clients", "10 membres", "Support prioritaire", "Rapports avances"].map((f) => (
            <span key={f} className="flex items-center gap-1.5 text-sm text-[#8B8B9E]"><Check size={14} className="text-[#22C55E]" /> {f}</span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6 mb-5">
        <h3 className="text-lg font-semibold text-white mb-4">Utilisation</h3>
        <div className="grid grid-cols-2 gap-5">
          {usage.map((u) => (
            <div key={u.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#8B8B9E]">{u.label}</span>
                <span className="text-white">{u.used} / {u.total}</span>
              </div>
              <div className="gal-progress-track">
                <motion.div className="gal-progress-fill" initial={{ width: 0 }} animate={{ width: `${(u.used / u.total) * 100}%` }} transition={{ duration: 1, ease }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Historique de Factures</h3>
        <table className="gal-table">
          <thead><tr><th>Date</th><th>Numero</th><th>Montant</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.numero}>
                <td>{inv.date}</td>
                <td className="font-mono text-[#06B6D4] text-xs">{inv.numero}</td>
                <td className="text-white">&euro;{inv.montant}</td>
                <td>{statusBadge(inv.status)}</td>
                <td><button className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors"><Download size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6 mt-5">
        <h3 className="text-lg font-semibold text-white mb-3">Mode de Paiement</h3>
        <div className="flex items-center gap-4">
          <CreditCard size={24} className="text-[#8B5CF6]" />
          <div className="flex-1">
            <div className="text-white font-medium">**** **** **** 4242</div>
            <div className="text-[#8B8B9E] text-sm">Visa &mdash; Expire 12/2025</div>
          </div>
          <button className="btn-secondary text-sm">Modifier</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NotificationsTab() {
  const [channels, setChannels] = useState<Record<string, Record<string, boolean>>>({
    "Alertes de securite": { Email: true, "In-app": true, SMS: true, Slack: false },
    "Rapports automatiques": { Email: true, "In-app": true, SMS: false, Slack: true },
    "Nouveaux leads": { Email: true, "In-app": true, SMS: true, Slack: false },
    "Alertes campagnes": { Email: true, "In-app": true, SMS: false, Slack: true },
    "Alertes concurrents": { Email: false, "In-app": true, SMS: false, Slack: false },
    "Mises a jour produit": { Email: false, "In-app": false, SMS: false, Slack: false },
    "Newsletter": { Email: false, "In-app": false, SMS: false, Slack: false },
  });
  const toggleChannel = (event: string, channel: string) => {
    setChannels((prev) => ({ ...prev, [event]: { ...prev[event], [channel]: !prev[event][channel] } }));
  };
  const channelNames = ["Email", "In-app", "SMS", "Slack"];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Preferences de Notifications</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1E1E2D" }}>
                <th className="text-left text-xs uppercase tracking-wider text-[#8B8B9E] pb-3 pr-4">Type d'evenement</th>
                {channelNames.map((c) => (
                  <th key={c} className="text-center text-xs uppercase tracking-wider text-[#8B8B9E] pb-3 px-3" style={{ minWidth: 80 }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(channels).map(([event, chs], i) => (
                <tr key={event} style={{ borderBottom: "1px solid #1E1E2D", height: 56 }}>
                  <td className="pr-4">
                    <span className="text-white text-sm">{event}</span>
                    {i === 0 && <span className="text-[#8B8B9E] text-xs ml-2">(requis)</span>}
                  </td>
                  {channelNames.map((c) => (
                    <td key={c} className="text-center px-3">
                      <Toggle checked={chs[c]} onChange={() => toggleChannel(event, c)} disabled={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState([
    { name: "Google Analytics 4", desc: "Suivi web et analyse d'audience", status: "Connecte" },
    { name: "Google Ads", desc: "Gestion de campagnes PPC", status: "Connecte" },
    { name: "Meta Business", desc: "Facebook & Instagram Ads", status: "Connecte" },
    { name: "LinkedIn", desc: "Campagnes B2B professionnelles", status: "Deconnecte" },
    { name: "Mailchimp", desc: "Email marketing et newsletters", status: "Connecte" },
    { name: "WordPress", desc: "CMS et gestion de contenu", status: "Connecte" },
    { name: "HubSpot", desc: "CRM et automation marketing", status: "Deconnecte" },
    { name: "Salesforce", desc: "CRM enterprise", status: "Erreur" },
  ]);
  const toggleStatus = (name: string) => {
    setIntegrations((prev) => prev.map((i) => ({
      ...i,
      status: i.name === name ? (i.status === "Connecte" ? "Deconnecte" : "Connecte") : i.status,
    })));
  };
  const intBadge = (s: string) => {
    if (s === "Connecte") return <span className="badge-glow-success">{s}</span>;
    if (s === "Deconnecte") return <span className="badge-glow-neutral">{s}</span>;
    return <span className="badge-glow-error">{s}</span>;
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Integrations</h3>
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((i) => (
            <motion.div key={i.name} variants={fadeUp} className="gal-card p-4" whileHover={{ scale: 1.02 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.1)" }}>
                  <Plug size={18} className="text-[#06B6D4]" />
                </div>
                {intBadge(i.status)}
              </div>
              <h4 className="text-white font-medium text-sm mb-1">{i.name}</h4>
              <p className="text-[#8B8B9E] text-xs mb-4">{i.desc}</p>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs py-1.5 px-3 flex-1">Configurer</button>
                <button onClick={() => toggleStatus(i.name)} className="btn-secondary text-xs py-1.5 px-3" style={{ color: "#EF4444", borderColor: "rgba(239,68,68,0.3)" }}>
                  {i.status === "Connecte" ? "Deconnecter" : "Connecter"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ApiTab() {
const [keys, setKeys] = useState([
  {
    id: 1,
    name: "Production",
    key: "Aucune clé configurée",
    created: "12 janv. 2024",
    lastUsed: "Il y a 2 min",
  },
  {
    id: 2,
    name: "Staging",
   key: "Aucune clé configurée",
    created: "15 mars 2024",
    lastUsed: "Il y a 1h",
  },
  {
    id: 3,
    name: "Développement",
    key: "Aucune clé configurée",
    
    created: "1 juin 2024",
    lastUsed: "Il y a 3j",
  },
]);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const regenerateKey = (id: number) => {
    setKeys((prev) => prev.map((k) =>
      k.id === id ? { ...k, key: "sk_" + k.name.toLowerCase().slice(0, 4) + "_" + Math.random().toString(36).slice(2, 24) } : k
    ));
  };
  const maskKey = (k: string) => k.slice(0, 7) + "**********************" + k.slice(-4);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Cles API</h3>
          <button className="btn-neon flex items-center gap-2 text-sm"><Key size={16} /> Generer une cle</button>
        </div>
        <table className="gal-table">
          <thead><tr><th>Nom</th><th>Cle</th><th>Creee le</th><th>Dernier usage</th><th>Actions</th></tr></thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td className="text-white font-medium">{k.name}</td>
                <td><code className="text-[#06B6D4] text-xs font-mono">{revealed[k.id] ? k.key : maskKey(k.key)}</code></td>
                <td>{k.created}</td>
                <td>{k.lastUsed}</td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setRevealed((p) => ({ ...p, [k.id]: !p[k.id] }))} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors">
                      {revealed[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copyToClipboard(k.key)} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-white transition-colors"><Copy size={14} /></button>
                    <button onClick={() => regenerateKey(k.id)} className="p-1.5 rounded hover:bg-[#1A1A2E] text-[#8B8B9E] hover:text-[#F59E0B] transition-colors"><RefreshCw size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Webhooks</h3>
          <button className="btn-neon text-sm">Ajouter un webhook</button>
        </div>
        <div className="space-y-3">
          {[
            { url: "https://lnrfinance.fr/webhooks/leads", events: ["lead.created", "lead.updated"], status: "Actif" },
            { url: "https://lnrfinance.fr/webhooks/reports", events: ["report.generated"], status: "Actif" },
            { url: "https://lnrfinance.fr/webhooks/campaigns", events: ["campaign.updated", "campaign.ended"], status: "Inactif" },
          ].map((wh, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
              <div>
                <code className="text-[#06B6D4] text-xs font-mono">{wh.url}</code>
                <div className="flex gap-1.5 mt-1.5">
                  {wh.events.map((e) => <span key={e} className="badge-glow-info text-[10px] px-2 py-0.5">{e}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={wh.status === "Actif" ? "badge-glow-success" : "badge-glow-neutral"}>{wh.status}</span>
                <button className="btn-secondary text-xs py-1 px-2">Tester</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SecuriteTab() {
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome - macOS", location: "Paris, France", ip: "192.168.1.45", lastActive: "Actuellement", current: true },
    { id: 2, device: "Safari - iOS", location: "Paris, France", ip: "192.168.1.102", lastActive: "Il y a 2h", current: false },
    { id: 3, device: "Firefox - Windows", location: "Lyon, France", ip: "10.0.0.15", lastActive: "Il y a 3j", current: false },
  ]);
  const revokeSession = (id: number) => setSessions((s) => s.filter((x) => x.id !== id));

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Authentification a deux facteurs</h3>
            <p className="text-[#8B8B9E] text-sm">Securisez votre compte avec une couche de protection supplementaire.</p>
          </div>
          <Toggle checked={tfaEnabled} onChange={setTfaEnabled} />
        </div>
        <AnimatePresence>
          {tfaEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4" style={{ borderTop: "1px solid #1E1E2D" }}>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg flex items-center justify-center" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
                  <Shield size={48} className="text-[#06B6D4]" />
                </div>
                <div>
                  <p className="text-white text-sm mb-2">Scannez ce QR code avec votre application d'authentification</p>
                  <div className="flex gap-2">
                    <input className="gal-input w-48" placeholder="Code de verification" maxLength={6} />
                    <button className="btn-neon text-sm">Verifier</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={fadeUp} className="gal-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sessions actives</h3>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(10,10,26,0.8)", border: "1px solid #1E1E2D" }}>
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-[#8B8B9E]" />
                <div>
                  <div className="text-white text-sm">{s.device} {s.current && <span className="text-[#06B6D4] text-xs">(cette session)</span>}</div>
                  <div className="text-[#8B8B9E] text-xs">{s.location} &bull; {s.ip} &bull; {s.lastActive}</div>
                </div>
              </div>
              {!s.current && (
                <button onClick={() => revokeSession(s.id)} className="text-xs px-3 py-1 rounded" style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>Revoquer</button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AffichageTab() {
  const [theme, setTheme] = useState("sombre");
  const [densite, setDensite] = useState("standard");
  const [reduireAnimations, setReduireAnimations] = useState(false);
  const [sidebarToujoursDeployee, setSidebarToujoursDeployee] = useState(true);

  const Segment = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #1E1E2D" }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o.toLowerCase())}
          className="px-4 py-2 text-sm transition-all"
          style={{
            background: value === o.toLowerCase() ? "linear-gradient(135deg, #06B6D4, #8B5CF6)" : "transparent",
            color: value === o.toLowerCase() ? "white" : "#8B8B9E",
            borderRight: "1px solid #1E1E2D",
          }}>{o}</button>
      ))}
    </div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white mb-2">Parametres d'Affichage</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Theme</div>
            <div className="text-[#8B8B9E] text-xs">Choisissez l'apparence de l'interface</div>
          </div>
          <Segment options={["Sombre", "Auto", "Clair"]} value={theme} onChange={setTheme} />
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Densite</div>
            <div className="text-[#8B8B9E] text-xs">Ajuste l'espacement des elements</div>
          </div>
          <Segment options={["Compact", "Standard", "Confortable"]} value={densite} onChange={setDensite} />
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Langue</div>
            <div className="text-[#8B8B9E] text-xs">Langue de l'interface</div>
          </div>
          <select className="gal-input"><option>Francais</option><option>English</option></select>
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Reduire les animations</div>
            <div className="text-[#8B8B9E] text-xs">Pour l'accessibilite et les performances</div>
          </div>
          <Toggle checked={reduireAnimations} onChange={setReduireAnimations} />
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Sidebar toujours deployee</div>
            <div className="text-[#8B8B9E] text-xs">Garde la sidebar ouverte par defaut</div>
          </div>
          <Toggle checked={sidebarToujoursDeployee} onChange={setSidebarToujoursDeployee} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AvanceTab() {
  const [debugMode, setDebugMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="gal-card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white mb-2">Parametres Avances</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Exporter toutes mes donnees</div>
            <div className="text-[#8B8B9E] text-xs">Telechargez une archive complete de vos donnees (format GDPR)</div>
          </div>
          <button className="btn-secondary text-sm flex items-center gap-2"><Download size={16} /> Exporter</button>
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Vider le cache</div>
            <div className="text-[#8B8B9E] text-xs">Supprime les donnees en cache et force la synchronisation</div>
          </div>
          <button className="btn-secondary text-sm">Vider</button>
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Mode debug</div>
            <div className="text-[#8B8B9E] text-xs">Affiche des informations techniques supplementaires</div>
          </div>
          <Toggle checked={debugMode} onChange={setDebugMode} />
        </div>
        <div style={{ borderTop: "1px solid #1E1E2D" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Reinitialiser les parametres</div>
            <div className="text-[#8B8B9E] text-xs">Restaure tous les parametres par defaut</div>
          </div>
          <button onClick={() => setShowResetConfirm(true)} className="btn-secondary text-sm" style={{ color: "#EF4444", borderColor: "rgba(239,68,68,0.3)" }}>Reinitialiser</button>
        </div>
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 p-4 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <p className="text-[#EF4444] text-sm mb-3">Etes-vous sur ? Cette action est irreversible.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowResetConfirm(false)} className="btn-neon text-sm">Confirmer</button>
                <button onClick={() => setShowResetConfirm(false)} className="btn-secondary text-sm">Annuler</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("compte");
  const tabComponents: Record<string, React.ReactNode> = {
    compte: <CompteTab />, equipe: <EquipeTab />, facturation: <FacturationTab />,
    notifications: <NotificationsTab />, integrations: <IntegrationsTab />,
    api: <ApiTab />, securite: <SecuriteTab />, affichage: <AffichageTab />, avance: <AvanceTab />,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }} style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Parametres Systeme</h1>
        <p className="text-[#8B8B9E] text-sm">Gerez vos preferences, equipe et configuration</p>
      </div>
      <div className="flex gap-6">
        <div style={{ width: 240, flexShrink: 0 }}>
          <div className="gal-card p-2 space-y-1" style={{ position: "sticky", top: 80 }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                style={{
                  background: activeTab === t.key ? "rgba(6, 182, 212, 0.1)" : "transparent",
                  color: activeTab === t.key ? "#06B6D4" : "#8B8B9E",
                  borderLeft: activeTab === t.key ? "3px solid #06B6D4" : "3px solid transparent",
                  fontWeight: activeTab === t.key ? 600 : 500, fontSize: 13,
                }}
                onMouseEnter={(e) => { if (activeTab !== t.key) { e.currentTarget.style.background = "#1A1A2E"; e.currentTarget.style.color = "#FFFFFF"; } }}
                onMouseLeave={(e) => { if (activeTab !== t.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B8B9E"; } }}>
                {t.icon}<span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2, ease }}>
              {tabComponents[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
