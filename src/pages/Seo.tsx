import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  Search, Globe, ListOrdered, Link2, Award, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, Minus, Plus, Check, X, AlertTriangle,
  AlertCircle, Info, ChevronDown, ChevronUp, Clock,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay: i * 0.08 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Mock Data: LNR Finance (Telesecretariat BPO) ── */

// 90-day organic traffic data
const organicTrafficData = Array.from({ length: 90 }, (_, i) => {
  const base = 280 + Math.sin(i * 0.1) * 80 + (i * 1.5);
  return {
    day: `J${i + 1}`,
    date: `${(i % 30) + 1} ${['jan', 'fév', 'mar', 'avr', 'mai', 'jun'][Math.floor(i / 15) % 6]}`,
    clicks: Math.floor(base + Math.random() * 50),
    impressions: Math.floor((base + Math.random() * 50) * 28),
  };
});

// Search engine distribution
const engineData = [
  { name: 'Google', value: 87, color: '#06B6D4' },
  { name: 'Bing', value: 8, color: '#8B5CF6' },
  { name: 'Yahoo', value: 3, color: '#EC4899' },
  { name: 'DuckDuckGo', value: 2, color: '#F59E0B' },
];

// Keyword tracking - LNR Finance telesecretariat keywords
const keywordsData = [
  { keyword: 'télésecrétariat Tunisie', position: 2, evolution: -1, volume: 2400, url: '/telesecretariat-tunisie', trend: [3, 3, 2, 2, 2, 2, 1, 2, 2, 2] },
  { keyword: 'secrétariat à distance France', position: 4, evolution: +2, volume: 1800, url: '/secretariat-distance-france', trend: [6, 5, 5, 4, 4, 3, 4, 4, 4, 4] },
  { keyword: 'assistante virtuelle francophone', position: 3, evolution: -2, volume: 3200, url: '/assistante-virtuelle-francophone', trend: [1, 1, 2, 3, 3, 3, 3, 3, 3, 3] },
  { keyword: 'BPO centre d\'appel Tunisie', position: 1, evolution: 0, volume: 1500, url: '/bpo-centre-appel-tunisie', trend: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { keyword: 'saisie de données externalisée', position: 7, evolution: +3, volume: 900, url: '/saisie-donnees-externalisee', trend: [12, 11, 10, 9, 8, 8, 7, 7, 7, 7] },
  { keyword: 'gestion administrative à distance', position: 5, evolution: +1, volume: 1100, url: '/gestion-administrative-distance', trend: [8, 8, 7, 6, 6, 5, 5, 5, 5, 5] },
  { keyword: 'back office externalisé', position: 8, evolution: -2, volume: 750, url: '/back-office-externalise', trend: [5, 5, 6, 6, 7, 8, 8, 8, 8, 8] },
  { keyword: 'télésecrétariat tarif horaire', position: 12, evolution: +4, volume: 650, url: '/telesecretariat-tarif', trend: [18, 17, 16, 15, 14, 13, 13, 12, 12, 12] },
  { keyword: 'call center francophone', position: 6, evolution: +2, volume: 2100, url: '/call-center-francophone', trend: [10, 9, 8, 8, 7, 7, 6, 6, 6, 6] },
  { keyword: 'externalisation secrétariat prix', position: 15, evolution: -3, volume: 480, url: '/externalisation-secretariat-prix', trend: [11, 12, 13, 14, 14, 15, 15, 15, 15, 15] },
  { keyword: 'service client externalisé', position: 9, evolution: +1, volume: 1300, url: '/service-client-externalise', trend: [12, 11, 10, 10, 9, 9, 9, 9, 9, 9] },
  { keyword: 'opérateur téléphonique offshore', position: 22, evolution: +5, volume: 380, url: '/operateur-telephonique-offshore', trend: [30, 29, 28, 27, 26, 25, 24, 23, 22, 22] },
];

// Backlink data
const backlinkMonthly = [
  { month: 'Jan', backlinks: 98, new: 32, lost: 5 },
  { month: 'Fév', backlinks: 112, new: 28, lost: 3 },
  { month: 'Mar', backlinks: 134, new: 41, lost: 8 },
  { month: 'Avr', backlinks: 156, new: 38, lost: 4 },
  { month: 'Mai', backlinks: 178, new: 45, lost: 7 },
  { month: 'Juin', backlinks: 156, new: 38, lost: 12 },
];

const referringDomains = [
  { domain: 'lesentreprises.com', da: 72, type: 'dofollow', links: 142 },
  { domain: 'journaldunet.com', da: 85, type: 'dofollow', links: 89 },
  { domain: 'linkedin.com', da: 98, type: 'nofollow', links: 234 },
  { domain: 'bpo-insider.fr', da: 45, type: 'dofollow', links: 67 },
  { domain: 'tunisie-annuaire.com', da: 38, type: 'dofollow', links: 45 },
];

// Technical audit
const auditCategories = [
  {
    name: 'Vitesse de chargement', score: 78, items: [
      { status: 'ok', text: 'Compression GZIP activée', severity: 'info' },
      { status: 'warn', text: 'Images non optimisées (3 trouvées)', severity: 'warning' },
      { status: 'error', text: 'JavaScript bloquant le rendu', severity: 'error' },
    ]
  },
  {
    name: 'Mobile-friendly', score: 95, items: [
      { status: 'ok', text: 'Viewport correctement configuré', severity: 'info' },
      { status: 'ok', text: 'Touch targets suffisamment grands', severity: 'info' },
    ]
  },
  {
    name: 'Balises meta', score: 88, items: [
      { status: 'ok', text: 'Titres uniques sur toutes les pages', severity: 'info' },
      { status: 'ok', text: 'Meta descriptions présentes', severity: 'info' },
      { status: 'warn', text: 'Titres trop longs (2 pages)', severity: 'warning' },
      { status: 'warn', text: 'Open Graph tags incomplètes', severity: 'warning' },
      { status: 'ok', text: 'Balises canoniques correctes', severity: 'info' },
    ]
  },
  {
    name: 'Structure URL', score: 92, items: [
      { status: 'ok', text: 'URLs propres et descriptives', severity: 'info' },
      { status: 'ok', text: 'Sitemap XML valide', severity: 'info' },
      { status: 'warn', text: 'Redirections 301 manquantes (3)', severity: 'warning' },
    ]
  },
  {
    name: 'Schema.org', score: 65, items: [
      { status: 'ok', text: 'LocalBusiness markup présent', severity: 'info' },
      { status: 'warn', text: 'FAQ schema manquant', severity: 'warning' },
      { status: 'error', text: 'Review aggregate invalide', severity: 'error' },
      { status: 'warn', text: 'BreadcrumbList incomplète', severity: 'warning' },
    ]
  },
  {
    name: 'Sécurité HTTPS', score: 100, items: [
      { status: 'ok', text: 'Certificat SSL valide', severity: 'info' },
    ]
  },
];

// Top performing pages
const topPages = [
  { title: 'Télésecrétariat Tunisie — LNR Finance', url: '/telesecretariat-tunisie', traffic: 8420, keywords: 47, backlinks: 156, score: 92 },
  { title: 'Assistante Virtuelle Francophone', url: '/assistante-virtuelle-francophone', traffic: 6780, keywords: 38, backlinks: 124, score: 88 },
  { title: 'BPO Centre d\'Appel', url: '/bpo-centre-appel', traffic: 5430, keywords: 32, backlinks: 98, score: 85 },
  { title: 'Externalisation Secrétariat', url: '/externalisation-secretariat', traffic: 4210, keywords: 28, backlinks: 87, score: 81 },
  { title: 'Tarifs Télésecrétariat', url: '/tarifs-telesecretariat', traffic: 3890, keywords: 24, backlinks: 65, score: 78 },
  { title: 'Service Client Externalisé', url: '/service-client-externalise', traffic: 3150, keywords: 21, backlinks: 54, score: 76 },
  { title: 'Call Center Francophone', url: '/call-center-francophone', traffic: 2890, keywords: 19, backlinks: 48, score: 74 },
  { title: 'Back Office Externalisé', url: '/back-office-externalise', traffic: 2340, keywords: 16, backlinks: 42, score: 71 },
];

/* ── Helpers ── */
function getPositionColor(pos: number) {
  if (pos <= 3) return '#22C55E';
  if (pos <= 10) return '#06B6D4';
  if (pos <= 20) return '#8B8B9E';
  if (pos <= 50) return '#F59E0B';
  return '#EF4444';
}

function getPositionBg(pos: number) {
  if (pos <= 3) return 'rgba(34, 197, 94, 0.05)';
  if (pos <= 10) return 'rgba(6, 182, 212, 0.05)';
  if (pos <= 20) return 'transparent';
  if (pos <= 50) return 'rgba(245, 158, 11, 0.05)';
  return 'rgba(239, 68, 68, 0.05)';
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60;
  const h = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#22C55E' : score >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize={size * 0.28} fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
        {score}
      </text>
    </svg>
  );
}

/* ── KPI Card ── */
interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
  delta: string;
  deltaPositive: boolean;
  subLabel: string;
  index: number;
}

function KpiCard({ icon, iconBg, iconColor, label, value, delta, deltaPositive, subLabel, index }: KpiCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="gal-card"
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: deltaPositive ? '#22C55E' : '#EF4444', fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
          {deltaPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {delta}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, color: '#FFFFFF', lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#4A4A5E', marginTop: 4 }}>{subLabel}</div>
      </div>
    </motion.div>
  );
}

/* ── Audit Accordion Item ── */
function AuditAccordion({ category, index }: { category: typeof auditCategories[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const scoreColor = category.score >= 90 ? '#22C55E' : category.score >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <motion.div
      variants={fadeUp}
      custom={index + 6}
      style={{ borderBottom: '1px solid rgba(30, 30, 45, 0.8)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: scoreColor, minWidth: 36 }}>{category.score}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#FFFFFF' }}>{category.name}</span>
          <span className={category.score >= 90 ? 'badge-glow-success' : category.score >= 70 ? 'badge-glow-warning' : 'badge-glow-error'} style={{ fontSize: 10, padding: '2px 8px' }}>
            {category.items.length} items
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} color="#8B8B9E" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 0 12px 48px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {category.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.status === 'ok' ? <Check size={14} color="#22C55E" /> : item.status === 'warn' ? <AlertTriangle size={14} color="#F59E0B" /> : <X size={14} color="#EF4444" />}
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8B8B9E', flex: 1 }}>{item.text}</span>
                  <span className={item.severity === 'info' ? 'badge-glow-info' : item.severity === 'warning' ? 'badge-glow-warning' : 'badge-glow-error'} style={{ fontSize: 10, padding: '2px 8px' }}>
                    {item.severity === 'info' ? 'OK' : item.severity === 'warning' ? 'Avert.' : 'Critique'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main SEO Page ── */
export default function Seo() {
  const [dateRange, setDateRange] = useState('90');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [sortCol, setSortCol] = useState<string>('position');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredKeywords = useMemo(() => {
    let data = keywordsData.filter(k => k.keyword.toLowerCase().includes(keywordFilter.toLowerCase()));
    data = [...data].sort((a, b) => {
      const valA = sortCol === 'position' ? a.position : sortCol === 'volume' ? a.volume : a.keyword;
      const valB = sortCol === 'position' ? b.position : sortCol === 'volume' ? b.volume : b.keyword;
      if (typeof valA === 'number' && typeof valB === 'number') return sortAsc ? valA - valB : valB - valA;
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
    return data;
  }, [keywordFilter, sortCol, sortAsc]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 36, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
            <Search size={28} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: '#06B6D4' }} />
            SEO — Référencement Naturel
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8B8B9E', margin: '8px 0 0', lineHeight: 1.5 }}>
            Suivez votre performance organique et optimisez votre visibilité
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', background: 'rgba(18, 18, 31, 0.6)', borderRadius: 8, border: '1px solid rgba(30, 30, 45, 0.8)', overflow: 'hidden' }}>
            {['7', '30', '90'].map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                style={{
                  padding: '6px 14px', fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer', border: 'none', background: dateRange === r ? 'rgba(6, 182, 212, 0.15)' : 'transparent', color: dateRange === r ? '#06B6D4' : '#8B8B9E',
                }}
              >
                {r}j
              </button>
            ))}
          </div>
          <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}>
            <Search size={14} />
            Lancer un Audit
          </button>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <KpiCard icon={<Globe size={20} />} iconBg="rgba(6, 182, 212, 0.1)" iconColor="#06B6D4" label="Visites Organiques" value="28,456" delta="+18.3%" deltaPositive subLabel="Ce mois" index={0} />
        <KpiCard icon={<ListOrdered size={20} />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8B5CF6" label="Mots-clés TOP 10" value="147" delta="+23" deltaPositive subLabel="Sur 312 suivis" index={1} />
        <KpiCard icon={<Link2 size={20} />} iconBg="rgba(236, 72, 153, 0.1)" iconColor="#EC4899" label="Backlinks Totaux" value="3,842" delta="+156" deltaPositive subLabel="Dont 89% dofollow" index={2} />
        <KpiCard icon={<Award size={20} />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" label="Domain Authority" value="52" delta="+3" deltaPositive subLabel="Sur 100 (Moz)" index={3} />
      </motion.div>

      {/* ── Charts Row: Organic Traffic + Engine Distribution ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <motion.div variants={fadeUp} custom={4} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Trafic Organique</h3>
            <span className="badge-glow-info">{dateRange} jours</span>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={organicTrafficData}>
              <defs>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="date" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} interval={14} />
              <YAxis yAxisId="left" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8, boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)' }}
                labelStyle={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                itemStyle={{ color: '#8B8B9E', fontFamily: "'Inter', sans-serif", fontSize: 12 }}
              />
              <Area yAxisId="left" type="monotone" dataKey="clicks" name="Clics" stroke="#06B6D4" strokeWidth={2} fill="url(#clicksGrad)" isAnimationActive animationDuration={1500} />
              <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions (/100)" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#impressionsGrad)" isAnimationActive animationDuration={1500} animationBegin={300} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} className="gal-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Répartition par Moteur</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={engineData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none" isAnimationActive animationDuration={1000}>
                {engineData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#8B8B9E' }}
                formatter={(value: number) => [`${value}%`, 'Part']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {engineData.map((e) => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8B8B9E' }}>{e.name}</span>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, color: '#FFFFFF' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Keyword Tracking Table ── */}
      <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Suivi des Mots-clés</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              placeholder="Filtrer les mots-clés..."
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="gal-input"
              style={{ width: 240, fontSize: 12, padding: '6px 12px' }}
            />
            <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 12 }}>
              <Plus size={14} />
              Ajouter
            </button>
          </div>
        </div>
        <table className="gal-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('keyword')}>Mot-clé {sortCol === 'keyword' && (sortAsc ? <ChevronUp size={10} style={{ display: 'inline' }} /> : <ChevronDown size={10} style={{ display: 'inline' }} />)}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('position')}>Position {sortCol === 'position' && (sortAsc ? <ChevronUp size={10} style={{ display: 'inline' }} /> : <ChevronDown size={10} style={{ display: 'inline' }} />)}</th>
              <th>Évolution</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('volume')}>Volume {sortCol === 'volume' && (sortAsc ? <ChevronUp size={10} style={{ display: 'inline' }} /> : <ChevronDown size={10} style={{ display: 'inline' }} />)}</th>
              <th>URL cible</th>
              <th>Tendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeywords.slice(0, 10).map((kw, i) => (
              <motion.tr
                key={kw.keyword}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{ background: getPositionBg(kw.position) }}
              >
                <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{kw.keyword}</td>
                <td style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: getPositionColor(kw.position) }}>{kw.position}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: kw.evolution < 0 ? '#22C55E' : kw.evolution > 0 ? '#EF4444' : '#8B8B9E', fontSize: 13, fontWeight: 600 }}>
                    {kw.evolution < 0 ? <ArrowUp size={14} /> : kw.evolution > 0 ? <ArrowDown size={14} /> : <Minus size={14} />}
                    {Math.abs(kw.evolution)}
                  </span>
                </td>
                <td>{kw.volume.toLocaleString('fr-FR')}/mois</td>
                <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#06B6D4' }}>{kw.url}</span></td>
                <td><MiniSparkline data={kw.trend} color={getPositionColor(kw.position)} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── Backlinks + Technical Audit ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Backlink Analysis */}
        <motion.div variants={fadeUp} custom={7} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Analyse des Backlinks</h3>
          {/* Mini metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#FFFFFF' }}>3,842</div>
              <div style={{ fontSize: 11, color: '#8B8B9E', marginTop: 4 }}>Total</div>
            </div>
            <div style={{ background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#22C55E' }}>3,419</div>
              <div style={{ fontSize: 11, color: '#8B8B9E', marginTop: 4 }}>Dofollow (89%)</div>
            </div>
            <div style={{ background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#06B6D4' }}>+156</div>
              <div style={{ fontSize: 11, color: '#8B8B9E', marginTop: 4 }}>Nouveaux (30j)</div>
            </div>
          </div>
          {/* Backlink chart */}
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={backlinkMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }} labelStyle={{ color: '#FFFFFF' }} itemStyle={{ color: '#8B8B9E' }} />
              <Bar dataKey="backlinks" name="Backlinks" fill="#06B6D4" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
          {/* Referring domains */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>Domaines référents</h4>
            {referringDomains.map((rd, i) => (
              <motion.div key={rd.domain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.05 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FFFFFF', flex: 1 }}>{rd.domain}</span>
                <div style={{ width: 60, height: 4, background: 'rgba(74, 74, 94, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${rd.da}%`, height: '100%', background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: '#8B8B9E', minWidth: 24 }}>{rd.da}</span>
                <span className={rd.type === 'dofollow' ? 'badge-glow-success' : 'badge-glow-neutral'} style={{ fontSize: 10, padding: '2px 8px' }}>{rd.type}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Audit */}
        <motion.div variants={fadeUp} custom={8} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Audit Technique</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScoreRing score={85} />
            </div>
          </div>
          <div>
            {auditCategories.map((cat, i) => (
              <AuditAccordion key={cat.name} category={cat} index={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Top Performing Pages ── */}
      <motion.div variants={fadeUp} custom={9} className="gal-card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Pages les Plus Performantes</h3>
        <table className="gal-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Trafic</th>
              <th>Mots-clés</th>
              <th>Backlinks</th>
              <th>Score SEO</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page, i) => (
              <motion.tr
                key={page.url}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <td>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 13 }}>{page.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#06B6D4' }}>{page.url}</div>
                </td>
                <td style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#FFFFFF' }}>{page.traffic.toLocaleString('fr-FR')}</td>
                <td>{page.keywords}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{page.backlinks}</span>
                    <div style={{ width: 40, height: 4, background: 'rgba(74, 74, 94, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(page.backlinks / 2, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)', borderRadius: 2 }} />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={page.score >= 85 ? 'badge-glow-success' : page.score >= 70 ? 'badge-glow-warning' : 'badge-glow-error'}>{page.score}/100</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
