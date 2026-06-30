import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, Bug, Activity,
  Lock, Globe, Server, Database, Cloud, HardDrive, Wifi, Clock,
  CheckCircle, XCircle, AlertCircle, Info, ChevronRight, Search,
  FileText, Play, Filter, Download
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay: i * 0.08 },
  }),
};

/* ── Data ── */
const radarData = [
  { dim: 'Firewall', score: 95 },
  { dim: 'SSL', score: 100 },
  { dim: 'Patch', score: 88 },
  { dim: 'Access', score: 92 },
  { dim: 'Backup', score: 85 },
  { dim: 'Monitor', score: 98 },
];

const subScores = [
  { label: 'SSL', score: 100, color: '#22C55E' },
  { label: 'Firewall', score: 95, color: '#22C55E' },
  { label: 'Headers HTTP', score: 88, color: '#22C55E' },
  { label: 'Cookies', score: 92, color: '#22C55E' },
  { label: 'Formulaires', score: 85, color: '#F59E0B' },
  { label: 'Fichiers', score: 98, color: '#22C55E' },
];

const threats = [
  { id: 1, title: 'Tentative XSS détectée', severity: 'high', ip: '203.0.113.45', time: '14:23', status: 'blocked' },
  { id: 2, title: 'Scan de ports', severity: 'medium', ip: '198.51.100.12', time: '13:45', status: 'investigating' },
  { id: 3, title: 'Brute force SSH', severity: 'critical', ip: '192.168.1.99', time: '12:10', status: 'blocked' },
  { id: 4, title: 'Fuite d\'info potentielle', severity: 'medium', ip: '172.16.0.5', time: '11:32', status: 'investigating' },
  { id: 5, title: 'Requête anormale API', severity: 'low', ip: '10.0.0.23', time: '10:15', status: 'resolved' },
  { id: 6, title: 'Cookie non sécurisé', severity: 'low', ip: '—', time: '09:48', status: 'resolved' },
];

const cves = [
  { id: 'CVE-2024-7841', title: 'Injection SQL potentielle', severity: 'critical', cvss: 9.1, system: 'API /auth', date: '14 juin', status: 'En cours' },
  { id: 'CVE-2024-6502', title: 'XSS réfléchi dans formulaire', severity: 'high', cvss: 7.5, system: 'Form contact', date: '13 juin', status: 'À corriger' },
  { id: 'CVE-2024-5419', title: 'Fuite d\'information headers', severity: 'moderate', cvss: 5.8, system: 'Headers HTTP', date: '12 juin', status: 'À corriger' },
  { id: 'CVE-2024-4328', title: 'CSRF sur endpoint admin', severity: 'high', cvss: 8.2, system: 'Panel admin', date: '11 juin', status: 'En cours' },
  { id: 'CVE-2024-3217', title: 'Dépendance obsolète lodash', severity: 'moderate', cvss: 6.4, system: 'Package npm', date: '10 juin', status: 'À corriger' },
  { id: 'CVE-2024-2105', title: 'Configuration TLS faible', severity: 'moderate', cvss: 5.3, system: 'SSL Config', date: '9 juin', status: 'Corrigé' },
  { id: 'CVE-2024-1098', title: 'Exposition de chemin fichier', severity: 'low', cvss: 3.9, system: 'Upload server', date: '8 juin', status: 'Corrigé' },
  { id: 'CVE-2024-0567', title: 'Timeout session trop long', severity: 'low', cvss: 4.2, system: 'Auth service', date: '7 juin', status: 'Corrigé' },
];

const complianceFrameworks = [
  {
    key: 'RGPD',
    label: 'RGPD',
    progress: 92,
    items: [
      { name: 'Consentement utilisateurs', desc: 'Bannière cookies + préférences', status: 'conforme' },
      { name: 'Droit à l\'oubli', desc: 'Suppression compte automatisée', status: 'conforme' },
      { name: 'Portabilité des données', desc: 'Export CSV/JSON disponible', status: 'conforme' },
      { name: 'Registre des traitements', desc: 'Documentation à jour', status: 'partiel' },
      { name: 'DPO désigné', desc: 'Délégué à la protection', status: 'conforme' },
    ],
  },
  {
    key: 'ISO 27001',
    label: 'ISO 27001',
    progress: 78,
    items: [
      { name: 'Politique sécurité', desc: 'Document validé par direction', status: 'conforme' },
      { name: 'Gestion des accès', desc: 'RBAC + MFA activés', status: 'conforme' },
      { name: 'Gestion des incidents', desc: 'Procédure documentée', status: 'partiel' },
      { name: 'Audits internes', desc: 'Trimestriel recommandé', status: 'non-conforme' },
      { name: 'Continuité activité', desc: 'Plan de reprise à jour', status: 'partiel' },
    ],
  },
  {
    key: 'SOC2',
    label: 'SOC 2',
    progress: 85,
    items: [
      { name: 'Sécurité (CC6.1)', desc: 'Contrôles d\'accès logiques', status: 'conforme' },
      { name: 'Disponibilité (A1.2)', desc: 'Monitoring uptime 99.9%', status: 'conforme' },
      { name: 'Intégrité (CC1.3)', desc: 'Hashing + signatures', status: 'conforme' },
      { name: 'Confidentialité (C1.1)', desc: 'Chiffrement données', status: 'partiel' },
      { name: 'Vie privée (P1.1)', desc: 'Collecte minimale', status: 'conforme' },
    ],
  },
  {
    key: 'NIS2',
    label: 'NIS 2',
    progress: 64,
    items: [
      { name: 'Cartographie des risques', desc: 'Analyse mensuelle', status: 'partiel' },
      { name: 'Signalement incidents', desc: 'Notification 24h à ANSSI', status: 'non-conforme' },
      { name: 'Test d\'intrusion', desc: 'Pen test annuel', status: 'conforme' },
      { name: 'Formation équipe', desc: 'Sensibilisation cybersécurité', status: 'partiel' },
      { name: 'Chiffrement des flux', desc: 'TLS 1.3 + certificats', status: 'conforme' },
    ],
  },
];

const systems = [
  { name: 'Web Server', icon: Globe, status: 'operational', detail: 'Nginx 1.24' },
  { name: 'Database', icon: Database, status: 'operational', detail: 'PostgreSQL 16' },
  { name: 'CDN', icon: Cloud, status: 'operational', detail: 'CloudFront' },
  { name: 'API Gateway', icon: Server, status: 'operational', detail: 'Kong 3.5' },
  { name: 'SSL Certificate', icon: Lock, status: 'operational', detail: 'Expire dans 45j' },
  { name: 'DNS', icon: Wifi, status: 'operational', detail: 'Route 53' },
  { name: 'Firewall', icon: Shield, status: 'operational', detail: 'WAF actif' },
  { name: 'Backup', icon: HardDrive, status: 'operational', detail: 'Il y a 2h' },
];

const uptimeData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
  uptime: 99.5 + Math.random() * 0.49,
}));

const securityLogs = [
  { ts: '15/06 14:23:41', type: 'Auth', ip: '192.168.1.42', desc: 'Connexion réussie: admin', severity: 'info' },
  { ts: '15/06 14:20:12', type: 'Access', ip: '203.0.113.78', desc: 'POST /api/contact 200 OK', severity: 'info' },
  { ts: '15/06 14:15:33', type: 'Auth', ip: '198.51.100.15', desc: 'Échec connexion (tentative x3)', severity: 'warning' },
  { ts: '15/06 13:45:01', type: 'Error', ip: '—', desc: 'Tentative XSS bloquée — script filter', severity: 'error' },
  { ts: '15/06 13:30:22', type: 'Access', ip: '203.0.113.45', desc: 'GET /api/users 401 Unauthorized', severity: 'warning' },
  { ts: '15/06 13:15:55', type: 'Auth', ip: '192.168.1.10', desc: 'Déconnexion: session expirée', severity: 'info' },
  { ts: '15/06 12:58:18', type: 'Error', ip: '172.16.0.8', desc: 'Scan de ports détecté sur 22, 80, 443', severity: 'error' },
  { ts: '15/06 12:45:00', type: 'Access', ip: '10.0.0.23', desc: 'POST /api/payment 200 OK — webhook Stripe', severity: 'info' },
];

/* ── Components ── */

function AnimatedGauge({ value, size = 140 }: { value: number; size?: number }) {
  const [current, setCurrent] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius * 0.75;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        setCurrent(Math.min(start, value));
        if (start >= value) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  const progress = (current / 100) * circumference;
  const color = current >= 90 ? '#22C55E' : current >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(74,74,94,0.2)" strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={0}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color }}>
          {current}
        </div>
        <div style={{ fontSize: 11, color: '#4A4A5E' }}>/100</div>
      </div>
    </div>
  );
}

function ThreatBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'badge-glow-error',
    high: 'badge-glow-warning',
    medium: 'badge-glow-info',
    low: 'badge-glow-neutral',
  };
  const labels: Record<string, string> = {
    critical: 'Critique', high: 'Élevée', medium: 'Moyenne', low: 'Faible',
  };
  return <span className={map[severity] || 'badge-glow-neutral'}>{labels[severity] || severity}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    blocked: { cls: 'badge-glow-success', label: 'Bloquée' },
    investigating: { cls: 'badge-glow-warning', label: 'En investigation' },
    resolved: { cls: 'badge-glow-neutral', label: 'Résolue' },
  };
  const s = map[status] || { cls: 'badge-glow-neutral', label: status };
  return <span className={s.cls}>{s.label}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'badge-glow-error',
    high: 'badge-glow-warning',
    moderate: 'badge-glow-warning',
    low: 'badge-glow-neutral',
  };
  const labels: Record<string, string> = {
    critical: 'Critique', high: 'Élevée', moderate: 'Modérée', low: 'Faible',
  };
  return <span className={map[severity] || 'badge-glow-neutral'}>{labels[severity] || severity}</span>;
}

function ComplianceStatusIcon({ status }: { status: string }) {
  if (status === 'conforme') return <CheckCircle size={16} color="#22C55E" />;
  if (status === 'partiel') return <AlertCircle size={16} color="#F59E0B" />;
  return <XCircle size={16} color="#EF4444" />;
}

function LogSeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    info: '#06B6D4',
    warning: '#F59E0B',
    error: '#EF4444',
  };
  return (
    <span style={{
      background: `${colors[severity]}20`, color: colors[severity],
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
    }}>
      {severity === 'info' ? 'Info' : severity === 'warning' ? 'Avert.' : 'Erreur'}
    </span>
  );
}

export default function Cyber() {
  const [complianceTab, setComplianceTab] = useState(0);
  const [logFilter, setLogFilter] = useState('all');
  const [animatedScores, setAnimatedScores] = useState<number[]>(subScores.map(() => 0));

  useEffect(() => {
    subScores.forEach((_, idx) => {
      setTimeout(() => {
        setAnimatedScores(prev => {
          const next = [...prev];
          next[idx] = subScores[idx].score;
          return next;
        });
      }, 800 + idx * 80);
    });
  }, []);

  const filteredLogs = logFilter === 'all' ? securityLogs : securityLogs.filter(l => l.type.toLowerCase() === logFilter);

  return (
    <div>
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cybersécurité</h1>
          <p className="text-sm" style={{ color: '#4A4A5E' }}>Surveillez, détectez et protégez votre infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-glow-success flex items-center gap-1">
            <span className="pulse-dot inline-block w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
            Dernier scan: il y a 2h
          </span>
          <button className="btn-neon flex items-center gap-2">
            <ShieldAlert size={16} /> Lancer un Scan
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { icon: ShieldCheck, label: 'Score de Sécurité', value: '94/100', delta: '+2 cette semaine', deltaColor: '#22C55E', sub: 'Niveau: Excellent', iconColor: '#22C55E' },
          { icon: AlertTriangle, label: 'Menaces Détectées', value: '0', delta: 'Aucune active', deltaColor: '#22C55E', sub: 'Dernière: il y a 3j', iconColor: '#EF4444' },
          { icon: Bug, label: 'Vulnérabilités', value: '3', delta: '1 critique', deltaColor: '#EF4444', sub: '2 modérées', iconColor: '#F59E0B' },
          { icon: Activity, label: 'Uptime', value: '99.97%', delta: '+0.01%', deltaColor: '#22C55E', sub: '30 derniers jours', iconColor: '#06B6D4' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
            <div className="gal-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 10, background: `${kpi.iconColor}15` }}>
                  <kpi.icon size={20} color={kpi.iconColor} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#4A4A5E' }}>{kpi.label}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{kpi.value}</div>
              <div className="flex items-center gap-2">
                <span style={{ color: kpi.deltaColor, fontSize: 12, fontWeight: 600 }}>{kpi.delta}</span>
                <span className="text-xs" style={{ color: '#4A4A5E' }}>{kpi.sub}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Score Gauge + Threat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Security Score */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Score de Sécurité</h3>
            <div className="flex flex-col items-center mb-4">
              <AnimatedGauge value={94} />
              <div className="mt-3 text-sm" style={{ color: '#8B8B9E' }}>Excellent — au-dessus de la moyenne</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {subScores.map((s, i) => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(18,18,31,0.6)' }}>
                  <div className="text-xs mb-1" style={{ color: '#8B8B9E' }}>{s.label}</div>
                  <motion.div className="text-sm font-bold" style={{ color: s.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}>
                    {animatedScores[i]}/100
                  </motion.div>
                </div>
              ))}
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(74,74,94,0.2)" />
                  <PolarAngleAxis dataKey="dim" tick={{ fill: '#8B8B9E', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Threat Feed */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Menaces Récentes</h3>
              <div className="flex gap-1">
                {['Toutes', 'Actives', 'Résolues'].map(f => (
                  <button key={f} className="btn-secondary text-xs py-1 px-2">{f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3" style={{ maxHeight: 520, overflowY: 'auto' }}>
              {threats.map((t, i) => (
                <motion.div
                  key={t.id} custom={i} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: t.status === 'resolved' ? 0.6 : 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease }}
                  className="gal-card p-3"
                  style={{ borderLeft: t.severity === 'critical' ? '3px solid #EF4444' : t.severity === 'high' ? '3px solid #F59E0B' : '1px solid rgba(30,30,45,0.8)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <ThreatBadge severity={t.severity} />
                      <span className="text-sm font-medium text-white">{t.title}</span>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#4A4A5E' }}>
                    <span>IP: {t.ip} — {t.time}</span>
                    <button className="flex items-center gap-1" style={{ color: '#06B6D4', fontSize: 11 }}>Détails <ChevronRight size={12} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CVE Table */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="gal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Vulnérabilités</h3>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs flex items-center gap-1"><Filter size={12} /> Filtrer</button>
              <button className="btn-secondary text-xs flex items-center gap-1"><Download size={12} /> Exporter</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gal-table">
              <thead>
                <tr>
                  <th>CVE</th>
                  <th>Titre</th>
                  <th>Sévérité</th>
                  <th>CVSS</th>
                  <th>Système affecté</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cves.map((cve, i) => (
                  <motion.tr key={cve.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                    <td><code style={{ color: '#06B6D4', fontSize: 12 }}>{cve.id}</code></td>
                    <td className="text-white text-sm">{cve.title}</td>
                    <td><SeverityBadge severity={cve.severity} /></td>
                    <td><span className="font-mono text-sm" style={{ color: cve.cvss >= 7 ? '#EF4444' : cve.cvss >= 5 ? '#F59E0B' : '#8B8B9E' }}>{cve.cvss}</span></td>
                    <td style={{ color: '#8B8B9E', fontSize: 12 }}>{cve.system}</td>
                    <td style={{ color: '#4A4A5E', fontSize: 12 }}>{cve.date}</td>
                    <td>
                      <span className={cve.status === 'Corrigé' ? 'badge-glow-success' : cve.status === 'En cours' ? 'badge-glow-warning' : 'badge-glow-error'} style={{ fontSize: 10 }}>
                        {cve.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn-secondary text-xs py-1 px-2">Détails</button>
                        {cve.status !== 'Corrigé' && <button className="btn-neon text-xs py-1 px-2">Patch</button>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Compliance + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Compliance */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-3">Conformité</h3>
            <div className="flex gap-1 mb-4" style={{ borderBottom: '1px solid #1E1E2D', paddingBottom: 8 }}>
              {complianceFrameworks.map((f, i) => (
                <button
                  key={f.key}
                  onClick={() => setComplianceTab(i)}
                  className={complianceTab === i ? 'btn-neon text-xs py-1 px-3' : 'btn-secondary text-xs py-1 px-3'}
                  style={{ opacity: complianceTab === i ? 1 : 0.7 }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={complianceTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: '#8B8B9E' }}>Progression globale</span>
                    <span className="text-sm font-bold" style={{ color: '#06B6D4' }}>{complianceFrameworks[complianceTab].progress}%</span>
                  </div>
                  <div className="gal-progress-track">
                    <motion.div className="gal-progress-fill" initial={{ width: 0 }} animate={{ width: `${complianceFrameworks[complianceTab].progress}%` }} transition={{ duration: 1, ease }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {complianceFrameworks[complianceTab].items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: 'rgba(10,10,26,0.5)' }}
                    >
                      <ComplianceStatusIcon status={item.status} />
                      <div className="flex-1">
                        <div className="text-sm text-white">{item.name}</div>
                        <div className="text-xs" style={{ color: '#4A4A5E' }}>{item.desc}</div>
                      </div>
                      <span className={item.status === 'conforme' ? 'badge-glow-success' : item.status === 'partiel' ? 'badge-glow-warning' : 'badge-glow-error'} style={{ fontSize: 10 }}>
                        {item.status === 'conforme' ? 'Conforme' : item.status === 'partiel' ? 'Partiel' : 'Non conforme'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">État des Systèmes</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {systems.map((sys, i) => (
                <motion.div
                  key={sys.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="gal-card p-3 flex items-center gap-3"
                >
                  <sys.icon size={18} color={sys.status === 'operational' ? '#22C55E' : '#EF4444'} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{sys.name}</div>
                    <div className="text-xs" style={{ color: '#4A4A5E' }}>{sys.detail}</div>
                  </div>
                  <span className="pulse-dot inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#22C55E' }} />
                </motion.div>
              ))}
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(74,74,94,0.15)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
                  <YAxis domain={[98, 100]} tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
                  <Tooltip contentStyle={{ background: '#12121F', border: '1px solid #1E1E2D', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="uptime" stroke="#22C55E" fill="url(#uptimeGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Logs */}
      <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
        <div className="gal-card p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-white">Logs de Sécurité</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['all', 'auth', 'access', 'error'].map(f => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={logFilter === f ? 'btn-neon text-xs py-1 px-2' : 'btn-secondary text-xs py-1 px-2'}
                  >
                    {f === 'all' ? 'Tous' : f === 'auth' ? 'Auth' : f === 'access' ? 'Accès' : 'Erreurs'}
                  </button>
                ))}
              </div>
              <button className="btn-secondary text-xs flex items-center gap-1"><Download size={12} /> Exporter</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gal-table">
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Type</th>
                  <th>IP</th>
                  <th>Description</th>
                  <th>Sévérité</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4A4A5E' }}>{log.ts}</td>
                    <td><span className="badge-glow-neutral" style={{ fontSize: 10 }}>{log.type}</span></td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8B8B9E' }}>{log.ip}</td>
                    <td className="text-white text-sm">{log.desc}</td>
                    <td><LogSeverityBadge severity={log.severity} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
