import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  MousePointer,
  Send,
  MailPlus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Copy,
  Smartphone,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  ouvertures: 800 + Math.sin(i * 0.25) * 200 + Math.random() * 150,
  clics: 120 + Math.sin(i * 0.3) * 40 + Math.random() * 25,
  desinscriptions: 15 + Math.sin(i * 0.2) * 8 + Math.random() * 5,
}));

const typeDonutData = [
  { name: 'Newsletter', value: 40, color: '#06B6D4' },
  { name: 'Promotionnel', value: 30, color: '#EC4899' },
  { name: 'Automatise', value: 20, color: '#8B5CF6' },
  { name: 'Transactionnel', value: 10, color: '#F59E0B' },
];

const campaignsData = [
  { id: 1, name: 'Newsletter Juin', type: 'newsletter', status: 'sent', sent: 11234, opens: 3421, clicks: 892, openRate: 30.4, clickRate: 7.9, date: '15 juin' },
  { id: 2, name: 'Promo Ete -20%', type: 'promo', status: 'sent', sent: 11234, opens: 2890, clicks: 1245, openRate: 25.7, clickRate: 11.1, date: '10 juin' },
  { id: 3, name: 'Bienvenue V2', type: 'auto', status: 'active', sent: 0, opens: 0, clicks: 0, openRate: 0, clickRate: 0, date: 'Continue' },
  { id: 4, name: 'Panier abandonne', type: 'auto', status: 'active', sent: 0, opens: 0, clicks: 0, openRate: 45.2, clickRate: 12.8, date: 'Continue' },
  { id: 5, name: 'Lancement Produit', type: 'promo', status: 'planned', sent: 0, opens: 0, clicks: 0, openRate: 0, clickRate: 0, date: '20 juin' },
  { id: 6, name: 'Newsletter Mai', type: 'newsletter', status: 'sent', sent: 10892, opens: 3102, clicks: 789, openRate: 28.5, clickRate: 7.2, date: '15 mai' },
  { id: 7, name: 'Flash Sale', type: 'promo', status: 'sent', sent: 11234, opens: 3890, clicks: 1567, openRate: 34.6, clickRate: 13.9, date: '1 juin' },
  { id: 8, name: 'Reactivation', type: 'auto', status: 'active', sent: 0, opens: 0, clicks: 0, openRate: 22.1, clickRate: 5.4, date: 'Continue' },
];

const deliverabilityChecks = [
  { name: 'Authentification SPF', status: 'pass' },
  { name: 'Authentification DKIM', status: 'pass' },
  { name: 'Authentification DMARC', status: 'pass' },
  { name: 'Liste de desinscription', status: 'pass' },
  { name: 'Ratio texte/image', status: 'pass' },
  { name: 'Taux de plainte > 0.1%', status: 'warning' },
  { name: 'Pas de mots spam', status: 'pass' },
];

const templatesData = [
  { id: 1, name: 'Newsletter Mensuelle', category: 'Newsletter', usage: '12 envois' },
  { id: 2, name: 'Promo Flash', category: 'Promotion', usage: '4 envois' },
  { id: 3, name: 'Bienvenue Client', category: 'Automation', usage: 'Continue' },
  { id: 4, name: 'Panier Abandonne', category: 'Automation', usage: 'Continue' },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };
const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    sent: { cls: 'badge-glow-success', label: 'Envoyee' },
    active: { cls: 'badge-glow-info', label: 'Active' },
    planned: { cls: 'badge-glow-warning', label: 'Planifiee' },
    draft: { cls: 'badge-glow-neutral', label: 'Brouillon' },
  };
  const { cls, label } = map[status] || map.draft;
  return (
    <span className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {status === 'active' && <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06B6D4', display: 'inline-block' }} />}
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    newsletter: 'badge-glow-info',
    promo: 'badge-glow-error',
    auto: 'badge-glow-success',
    transactionnel: 'badge-glow-warning',
  };
  const labels: Record<string, string> = {
    newsletter: 'Newsletter',
    promo: 'Promo',
    auto: 'Auto',
    transactionnel: 'Trans.',
  };
  return <span className={map[type] || 'badge-glow-neutral'} style={{ fontSize: 10 }}>{labels[type] || type}</span>;
}

function CheckBadge({ status }: { status: string }) {
  if (status === 'pass') return <CheckCircle2 size={16} style={{ color: '#22C55E' }} />;
  if (status === 'warning') return <AlertTriangle size={16} style={{ color: '#F59E0B' }} />;
  return <XCircle size={16} style={{ color: '#EF4444' }} />;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip-glass" style={{ padding: '10px 14px' }}>
      <p style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Jour {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontSize: 11, margin: '2px 0' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(0) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  DELIVERABILITY GAUGE                                               */
/* ------------------------------------------------------------------ */

function DeliverabilityGauge({ score }: { score: number }) {
  const radius = 50;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M 20 70 A 50 50 0 0 1 120 70" fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d="M 20 70 A 50 50 0 0 1 120 70"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease }}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginTop: -10 }}>{score}</div>
      <div style={{ fontSize: 11, color: '#8B8B9E' }}>/ 100</div>
      <span className="badge-glow-success" style={{ marginTop: 8 }}>Excellent</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

export default function Email() {
  const [activeMetric, setActiveMetric] = useState<'opens' | 'clicks' | 'unsubs'>('opens');

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
      {/* ---- HEADER ---- */}
      <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
            Email Marketing
          </h1>
          <p style={{ color: '#8B8B9E', fontSize: 13, marginTop: 6 }}>Creez, envoyez et analysez vos campagnes d&apos;emailing</p>
        </div>
        <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MailPlus size={14} /> Nouvelle Campagne
        </button>
      </motion.div>

      {/* ---- KPI ROW ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <Users size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Contacts</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>12,847</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+234 ce mois</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Actifs: 11,923</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Eye size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Taux d&apos;ouverture</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>28.4%</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+3.2%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Moyenne sectorielle: 21%</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
              <MousePointer size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Taux de clic</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>4.8%</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+0.6%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Taux de reactivite</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <Send size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Campagnes envoyees</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>24</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Ce mois</span>
            <span style={{ color: '#4A4A5E', fontSize: 12 }}>3 planifiees</span>
          </div>
        </div>
      </motion.div>

      {/* ---- PERFORMANCE AREA CHART + TYPE DONUT ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Performances</h3>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 3 }}>
              {(['opens', 'clicks', 'unsubs'] as const).map((m) => (
                <button key={m} onClick={() => setActiveMetric(m)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none',
                    background: activeMetric === m ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeMetric === m ? '#06B6D4' : '#8B8B9E',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  {m === 'opens' ? 'Ouvertures' : m === 'clicks' ? 'Clics' : 'Desabonnements'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
              {activeMetric === 'opens' && <Area type="monotone" dataKey="ouvertures" name="Ouvertures" stroke="#06B6D4" fill="url(#gradCyan)" strokeWidth={2} isAnimationActive animationDuration={1500} />}
              {activeMetric === 'clicks' && <Area type="monotone" dataKey="clics" name="Clics" stroke="#8B5CF6" fill="url(#gradPurple)" strokeWidth={2} isAnimationActive animationDuration={1500} />}
              {activeMetric === 'unsubs' && <Area type="monotone" dataKey="desinscriptions" name="Desabonnements" stroke="#EF4444" fill="url(#gradRed)" strokeWidth={2} isAnimationActive animationDuration={1500} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Repartition par Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" isAnimationActive animationDuration={1000}>
                {typeDonutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {typeDonutData.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: 12, color: '#8B8B9E' }}>{t.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---- CAMPAIGNS TABLE ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Campagnes</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge-glow-success">4 envoyees</span>
            <span className="badge-glow-info">3 actives</span>
            <span className="badge-glow-warning">1 planifiee</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gal-table">
            <thead>
              <tr>
                <th>Campaigne</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Envoyes</th>
                <th>Ouverts</th>
                <th>Clics</th>
                <th>Tx Ouv.</th>
                <th>Tx Clic</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td style={{ color: '#FFFFFF', fontWeight: 500 }}>{c.name}</td>
                  <td><TypeBadge type={c.type} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.sent > 0 ? c.sent.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.opens > 0 ? c.opens.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.clicks > 0 ? c.clicks.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.openRate > 0 ? `${c.openRate}%` : '—'}</td>
                  <td>{c.clickRate > 0 ? `${c.clickRate}%` : '—'}</td>
                  <td style={{ fontSize: 12 }}>{c.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ---- DELIVERABILITY ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 20 }}>Delivrabilite</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {/* Gauge */}
          <DeliverabilityGauge score={94} />

          {/* Reputation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reputation</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8B8B9E' }}>Sender Score</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>98/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8B8B9E' }}>Reputation</span>
              <span className="badge-glow-success">Elevee</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8B8B9E' }}>Domaine</span>
              <span className="badge-glow-success">Elevee</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8B8B9E' }}>IP</span>
              <span className="badge-glow-success">Elevee</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {['SPF', 'DKIM', 'DMARC'].map((auth) => (
                <span key={auth} className="badge-glow-success" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={10} /> {auth}
                </span>
              ))}
            </div>
          </div>

          {/* Checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B8B9E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verifications</h4>
            {deliverabilityChecks.map((check, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <CheckBadge status={check.status} />
                <span style={{ fontSize: 12, color: check.status === 'warning' ? '#F59E0B' : '#8B8B9E', flex: 1 }}>{check.name}</span>
                {check.status === 'warning' && <span className="badge-glow-warning" style={{ fontSize: 9 }}>Surveiller</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---- TEMPLATES ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Modeles Rapides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {templatesData.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="gal-card"
              style={{
                padding: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{
                height: 80,
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #1E1E2D',
              }}>
                <MailPlus size={24} style={{ color: '#4A4A5E' }} />
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TypeBadge type={t.category === 'Newsletter' ? 'newsletter' : t.category === 'Promotion' ? 'promo' : 'auto'} />
                <span style={{ fontSize: 11, color: '#4A4A5E' }}>{t.usage}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
