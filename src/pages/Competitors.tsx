import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, Legend,
} from 'recharts';
import {
  Swords, Users, PieChart, Lightbulb, TrendingUp, TrendingDown, Plus, RefreshCw,
  AlertTriangle, AlertCircle, CheckCircle, ChevronRight, Target, ArrowUp, ArrowDown,
  Minus, Zap, FileText, ExternalLink, ChevronDown, ChevronUp,
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

/* ── Mock Data ── */

// Positioning matrix
const positioningData = [
  { name: 'LNR Finance', x: 72, y: 34, z: 4200, fill: '#06B6D4', isYou: true },
  { name: 'Secretera Pro', x: 58, y: 28, z: 3100, fill: '#8B5CF6', isYou: false },
  { name: 'VirtualOffice FR', x: 88, y: 42, z: 6500, fill: '#A855F7', isYou: false },
  { name: 'CallCenter TN', x: 35, y: 15, z: 1800, fill: '#4A4A5E', isYou: false },
  { name: 'Assist\'Remote', x: 48, y: 22, z: 2400, fill: '#EC4899', isYou: false },
];

// Market share evolution (6 months)
const marketShareData = [
  { month: 'Jan', lnr: 28, secretera: 22, virtualoffice: 32, callcenter: 10, assistremote: 8 },
  { month: 'Fév', lnr: 29, secretera: 21, virtualoffice: 31, callcenter: 11, assistremote: 8 },
  { month: 'Mar', lnr: 30, secretera: 20, virtualoffice: 30, callcenter: 11, assistremote: 9 },
  { month: 'Avr', lnr: 32, secretera: 19, virtualoffice: 29, callcenter: 12, assistremote: 8 },
  { month: 'Mai', lnr: 33, secretera: 18, virtualoffice: 28, callcenter: 12, assistremote: 9 },
  { month: 'Juin', lnr: 34.2, secretera: 17.5, virtualoffice: 27.3, callcenter: 12.5, assistremote: 8.5 },
];

// SEO comparison (6 months)
const seoComparisonData = [
  { month: 'Jan', lnr: 42, secretera: 48, virtualoffice: 62, callcenter: 28 },
  { month: 'Fév', lnr: 45, secretera: 47, virtualoffice: 63, callcenter: 29 },
  { month: 'Mar', lnr: 48, secretera: 46, virtualoffice: 61, callcenter: 30 },
  { month: 'Avr', lnr: 52, secretera: 45, virtualoffice: 60, callcenter: 31 },
  { month: 'Mai', lnr: 56, secretera: 44, virtualoffice: 59, callcenter: 32 },
  { month: 'Juin', lnr: 62, secretera: 43, virtualoffice: 58, callcenter: 33 },
];

// Shared keywords
const sharedKeywords = [
  { keyword: 'télésecrétariat', lnr: 2, secretera: 5, virtualoffice: 1, callcenter: 8, volume: 5400 },
  { keyword: 'assistante virtuelle', lnr: 3, secretera: 4, virtualoffice: 2, callcenter: 12, volume: 8100 },
  { keyword: 'BPO Tunisie', lnr: 1, secretera: 8, virtualoffice: 3, callcenter: 4, volume: 3200 },
  { keyword: 'secrétariat distance', lnr: 4, secretera: 3, virtualoffice: 5, callcenter: 9, volume: 2900 },
  { keyword: 'call center offshore', lnr: 3, secretera: 7, virtualoffice: 4, callcenter: 2, volume: 4500 },
  { keyword: 'saisie données', lnr: 6, secretera: 6, virtualoffice: 8, callcenter: 5, volume: 1800 },
  { keyword: 'back office', lnr: 5, secretera: 9, virtualoffice: 6, callcenter: 7, volume: 2200 },
  { keyword: 'externalisation', lnr: 4, secretera: 5, virtualoffice: 3, callcenter: 10, volume: 3600 },
];

// Opportunities
const opportunities = [
  { keyword: 'marketing IA', volume: 2400, competition: 'faible', traffic: 420, competitors: 3 },
  { keyword: 'automatisation secrétariat', volume: 1800, competition: 'moyenne', traffic: 310, competitors: 2 },
  { keyword: 'standard téléphonique virtuel', volume: 3200, competition: 'faible', traffic: 580, competitors: 4 },
  { keyword: 'gestion rendez-vous', volume: 1500, competition: 'faible', traffic: 260, competitors: 2 },
  { keyword: 'secrétariat médical', volume: 4200, competition: 'moyenne', traffic: 720, competitors: 3 },
];

// Vulnerabilities
const vulnerabilities = [
  { keyword: 'télésecrétariat pas cher', lnr: 3, threat: 'Secretera Pro gagne +5 positions', severity: 'high' as const },
  { keyword: 'assistante virtuelle francophone', lnr: 4, threat: 'VirtualOffice FR passe #1', severity: 'high' as const },
  { keyword: 'BPO finance', lnr: 6, threat: 'Nouvel entrant à #4', severity: 'medium' as const },
];

// Alerts
const alertsData = [
  { id: 1, type: 'info' as const, text: 'VirtualOffice FR a publié 3 articles cette semaine sur le télésecrétariat', time: 'Il y a 2h', icon: <FileText size={14} /> },
  { id: 2, type: 'warning' as const, text: 'Secretera Pro gagne des positions sur "agence digitale Paris"', time: 'Il y a 4h', icon: <AlertTriangle size={14} /> },
  { id: 3, type: 'warning' as const, text: 'Nouveau backlink fort pour VirtualOffice FR (journaldunet.com)', time: 'Il y a 6h', icon: <Target size={14} /> },
  { id: 4, type: 'success' as const, text: 'Opportunité: "marketing IA" — faible compétition, vol. 2,400', time: 'Il y a 8h', icon: <Zap size={14} /> },
  { id: 5, type: 'error' as const, text: 'Votre position sur "SEO local Lyon" est menacée par Assist\'Remote', time: 'Il y a 12h', icon: <AlertCircle size={14} /> },
];

// Content gap
const contentGaps = [
  { topic: 'Guide Télésecrétariat 2025', hasContent: false, competitorsCovering: 4, traffic: 1200, priority: 'high' as const },
  { topic: 'Marketing IA pour PME', hasContent: true, old: true, competitorsCovering: 4, traffic: 3400, priority: 'high' as const },
  { topic: 'Audit Téléphonique Externalisé', hasContent: true, old: false, competitorsCovering: 2, traffic: 890, priority: 'medium' as const },
  { topic: 'ROI BPO : Comment Mesurer', hasContent: false, competitorsCovering: 3, traffic: 2100, priority: 'high' as const },
  { topic: 'Checklist Mise en Call Center', hasContent: true, old: false, competitorsCovering: 1, traffic: 650, priority: 'low' as const },
  { topic: 'Réglementation Données Offshore', hasContent: false, competitorsCovering: 2, traffic: 1800, priority: 'medium' as const },
];

type TabType = 'shared' | 'opportunities' | 'vulnerabilities';

/* ── KPI Card ── */
interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
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

/* ── Custom Scatter Dot ── */
function CustomScatterDot(props: any) {
  const { cx, cy, payload } = props;
  const size = payload.isYou ? 16 : 10;
  return (
    <g>
      {payload.isYou && (
        <circle cx={cx} cy={cy} r={size + 4} fill="none" stroke="#06B6D4" strokeWidth={1} opacity={0.4}>
          <animate attributeName="r" values={`${size + 4};${size + 10};${size + 4}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r={size} fill={payload.fill} opacity={0.8} stroke={payload.fill} strokeWidth={2} />
    </g>
  );
}

/* ── Main Competitors Page ── */
export default function Competitors() {
  const [activeTab, setActiveTab] = useState<TabType>('shared');
  const [visibleCompetitors, setVisibleCompetitors] = useState({ secretera: true, virtualoffice: true, callcenter: true });

  const lineColors = { lnr: '#06B6D4', secretera: '#8B5CF6', virtualoffice: '#EC4899', callcenter: '#F59E0B' };

  const toggleCompetitor = (key: keyof typeof visibleCompetitors) => {
    setVisibleCompetitors(prev => ({ ...prev, [key]: !prev[key] }));
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
            <Swords size={28} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: '#06B6D4' }} />
            Analyse Concurrentielle
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8B8B9E', margin: '8px 0 0', lineHeight: 1.5 }}>
            Surveillez vos concurrents et identifiez les opportunités
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px' }}>
            <RefreshCw size={14} /> Rafraîchir
          </button>
          <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Ajouter un Concurrent
          </button>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <KpiCard icon={<Users size={20} />} iconBg="rgba(6, 182, 212, 0.1)" iconColor="#06B6D4" label="Concurrents Suivis" value="5" delta="+1 ajouté" deltaPositive subLabel="Actifs" index={0} />
        <KpiCard icon={<PieChart size={20} />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8B5CF6" label="Part de Marché" value="34.2%" delta="+2.1%" deltaPositive subLabel="Estimée SEO" index={1} />
        <KpiCard icon={<Lightbulb size={20} />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" label="Opportunités" value="23" delta="3 prioritaires" deltaPositive={false} subLabel="Mots-clés" index={2} />
        <KpiCard icon={<TrendingUp size={20} />} iconBg="rgba(236, 72, 153, 0.1)" iconColor="#EC4899" label="Écart Moyen" value="-8.4" delta="En progression" deltaPositive subLabel="vs Top 3" index={3} />
      </motion.div>

      {/* ── Positioning Matrix + Market Share ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Positioning Matrix */}
        <motion.div variants={fadeUp} custom={4} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Matrice de Positionnement</h3>
          <div style={{ position: 'relative' }}>
            {/* Quadrant labels */}
            <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, color: 'rgba(34, 197, 94, 0.5)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Leaders</div>
            <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, color: 'rgba(6, 182, 212, 0.5)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Challengers</div>
            <div style={{ position: 'absolute', bottom: 28, left: 8, fontSize: 10, color: 'rgba(139, 92, 246, 0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Émergents</div>
            <div style={{ position: 'absolute', bottom: 28, right: 8, fontSize: 10, color: 'rgba(245, 158, 11, 0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Niches</div>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
                <XAxis type="number" dataKey="x" name="Visibilité SEO" domain={[0, 100]} tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} label={{ value: 'Visibilité SEO', position: 'bottom', fill: '#4A4A5E', fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Part de marché" domain={[0, 60]} tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} label={{ value: 'Part de marché (%)', angle: -90, position: 'insideLeft', fill: '#4A4A5E', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }}
                  labelStyle={{ color: '#FFFFFF' }}
                  itemStyle={{ color: '#8B8B9E' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'z') return [`${value} visites/mois`, 'Trafic estimé'];
                    if (name === 'x') return [`${value}/100`, 'Visibilité SEO'];
                    if (name === 'y') return [`${value}%`, 'Part de marché'];
                    return [value, name];
                  }}
                />
                <Scatter data={positioningData} shape={<CustomScatterDot />} isAnimationActive animationDuration={800} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8, justifyContent: 'center' }}>
            {positioningData.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.fill }} />
                <span style={{ fontSize: 11, color: '#8B8B9E' }}>{p.name} {p.isYou && '(Vous)'}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Share */}
        <motion.div variants={fadeUp} custom={5} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Évolution de la Part de Marché</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={marketShareData}>
              <defs>
                {['lnr', 'secretera', 'virtualoffice', 'callcenter', 'assistremote'].map((key, i) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={['#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#4A4A5E'][i]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={['#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#4A4A5E'][i]} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }} labelStyle={{ color: '#FFFFFF' }} itemStyle={{ color: '#8B8B9E' }} />
              <Area type="monotone" dataKey="lnr" name="LNR Finance" stackId="1" stroke="#06B6D4" fill="url(#grad-lnr)" isAnimationActive animationDuration={1500} />
              <Area type="monotone" dataKey="secretera" name="Secretera Pro" stackId="1" stroke="#8B5CF6" fill="url(#grad-secretera)" isAnimationActive animationDuration={1500} animationBegin={100} />
              <Area type="monotone" dataKey="virtualoffice" name="VirtualOffice FR" stackId="1" stroke="#EC4899" fill="url(#grad-virtualoffice)" isAnimationActive animationDuration={1500} animationBegin={200} />
              <Area type="monotone" dataKey="callcenter" name="CallCenter TN" stackId="1" stroke="#F59E0B" fill="url(#grad-callcenter)" isAnimationActive animationDuration={1500} animationBegin={300} />
              <Area type="monotone" dataKey="assistremote" name="Assist'Remote" stackId="1" stroke="#4A4A5E" fill="url(#grad-assistremote)" isAnimationActive animationDuration={1500} animationBegin={400} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* ── SEO Comparison ── */}
      <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Comparaison SEO</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'secretera', label: "Secretera Pro", color: '#8B5CF6' },
              { key: 'virtualoffice', label: "VirtualOffice FR", color: '#EC4899' },
              { key: 'callcenter', label: "CallCenter TN", color: '#F59E0B' },
            ].map(comp => (
              <button
                key={comp.key}
                onClick={() => toggleCompetitor(comp.key as keyof typeof visibleCompetitors)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, border: '1px solid',
                  borderColor: visibleCompetitors[comp.key as keyof typeof visibleCompetitors] ? comp.color : 'rgba(30, 30, 45, 0.8)',
                  background: visibleCompetitors[comp.key as keyof typeof visibleCompetitors] ? `${comp.color}20` : 'transparent',
                  color: visibleCompetitors[comp.key as keyof typeof visibleCompetitors] ? comp.color : '#4A4A5E',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: comp.color, opacity: visibleCompetitors[comp.key as keyof typeof visibleCompetitors] ? 1 : 0.3 }} />
                {comp.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={seoComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
            <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }} labelStyle={{ color: '#FFFFFF' }} itemStyle={{ color: '#8B8B9E' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
            <Line type="monotone" dataKey="lnr" name="LNR Finance" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4, fill: '#06B6D4' }} isAnimationActive animationDuration={1200} />
            {visibleCompetitors.secretera && <Line type="monotone" dataKey="secretera" name="Secretera Pro" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: '#8B5CF6' }} isAnimationActive animationDuration={1200} animationBegin={150} />}
            {visibleCompetitors.virtualoffice && <Line type="monotone" dataKey="virtualoffice" name="VirtualOffice FR" stroke="#EC4899" strokeWidth={2} dot={{ r: 3, fill: '#EC4899' }} isAnimationActive animationDuration={1200} animationBegin={300} />}
            {visibleCompetitors.callcenter && <Line type="monotone" dataKey="callcenter" name="CallCenter TN" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} isAnimationActive animationDuration={1200} animationBegin={450} />}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Keywords Tabs + Alerts ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Keywords Table with Tabs */}
        <motion.div variants={fadeUp} custom={7} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Mots-clés Partagés</h3>
            <div style={{ display: 'flex', background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(30, 30, 45, 0.8)' }}>
              {[
                { key: 'shared' as TabType, label: 'Partagés' },
                { key: 'opportunities' as TabType, label: 'Opportunités' },
                { key: 'vulnerabilities' as TabType, label: 'Vulnérabilités' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: activeTab === tab.key ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeTab === tab.key ? '#06B6D4' : '#8B8B9E', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'shared' && (
              <motion.div key="shared" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                <table className="gal-table">
                  <thead>
                    <tr>
                      <th>Mot-clé</th>
                      <th style={{ textAlign: 'center' }}>LNR</th>
                      <th style={{ textAlign: 'center' }}>Secretera</th>
                      <th style={{ textAlign: 'center' }}>VirtualOff.</th>
                      <th style={{ textAlign: 'center' }}>CallCtr</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedKeywords.map((kw, i) => (
                      <motion.tr key={kw.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                        <td style={{ fontWeight: 500, color: '#FFFFFF' }}>{kw.keyword}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: kw.lnr <= 3 ? '#22C55E' : '#06B6D4' }}>{kw.lnr}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#8B8B9E' }}>{kw.secretera}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#EC4899' }}>{kw.virtualoffice}</td>
                        <td style={{ textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#F59E0B' }}>{kw.callcenter}</td>
                        <td style={{ fontSize: 12 }}>{kw.volume.toLocaleString('fr-FR')}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'opportunities' && (
              <motion.div key="opportunities" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <table className="gal-table">
                  <thead>
                    <tr>
                      <th>Mot-clé</th>
                      <th>Volume</th>
                      <th>Compétition</th>
                      <th>Trafic estimé</th>
                      <th>Concurrents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map((opp, i) => (
                      <motion.tr key={opp.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <td style={{ fontWeight: 500, color: '#FFFFFF' }}>
                          {opp.keyword}
                          <span className="badge-glow-success" style={{ marginLeft: 8, fontSize: 10, padding: '2px 8px' }}>Opp.</span>
                        </td>
                        <td>{opp.volume.toLocaleString('fr-FR')}</td>
                        <td>
                          <span className={opp.competition === 'faible' ? 'badge-glow-success' : 'badge-glow-warning'} style={{ fontSize: 10, padding: '2px 8px' }}>
                            {opp.competition}
                          </span>
                        </td>
                        <td style={{ color: '#22C55E', fontWeight: 600 }}>~{opp.traffic}</td>
                        <td>{opp.competitors}/4</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'vulnerabilities' && (
              <motion.div key="vulnerabilities" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <table className="gal-table">
                  <thead>
                    <tr>
                      <th>Mot-clé</th>
                      <th>Votre pos.</th>
                      <th>Menace</th>
                      <th>Gravité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vulnerabilities.map((v, i) => (
                      <motion.tr key={v.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} style={{ background: v.severity === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)' }}>
                        <td style={{ fontWeight: 500, color: '#FFFFFF' }}>{v.keyword}</td>
                        <td style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#06B6D4' }}>#{v.lnr}</td>
                        <td style={{ fontSize: 12, color: '#8B8B9E' }}>{v.threat}</td>
                        <td>
                          <span className={v.severity === 'high' ? 'badge-glow-error' : 'badge-glow-warning'} style={{ fontSize: 10, padding: '2px 8px' }}>
                            {v.severity === 'high' ? 'Haute' : 'Moyenne'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Alerts Feed */}
        <motion.div variants={fadeUp} custom={8} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Alertes & Opportunités</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alertsData.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: 12,
                  background: 'rgba(10, 10, 26, 0.8)',
                  borderRadius: 8,
                  borderLeft: '3px solid',
                  borderLeftColor: alert.type === 'info' ? '#06B6D4' : alert.type === 'warning' ? '#F59E0B' : alert.type === 'success' ? '#22C55E' : '#EF4444',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: alert.type === 'info' ? '#06B6D4' : alert.type === 'warning' ? '#F59E0B' : alert.type === 'success' ? '#22C55E' : '#EF4444', marginTop: 2 }}>
                    {alert.icon}
                  </span>
                  <span style={{ fontSize: 12, color: '#FFFFFF', lineHeight: 1.5, flex: 1 }}>{alert.text}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 22 }}>
                  <Clock size={10} color="#4A4A5E" />
                  <span style={{ fontSize: 10, color: '#4A4A5E', fontFamily: "'JetBrains Mono', monospace" }}>{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Content Gap Analysis ── */}
      <motion.div variants={fadeUp} custom={9} className="gal-card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Analyse de l&apos;Écart de Contenu</h3>
        <table className="gal-table">
          <thead>
            <tr>
              <th>Sujet</th>
              <th>Votre contenu</th>
              <th>Concurrents</th>
              <th>Trafic estimé</th>
              <th>Priorité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contentGaps.map((gap, i) => (
              <motion.tr
                key={gap.topic}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <td style={{ fontWeight: 500, color: '#FFFFFF' }}>{gap.topic}</td>
                <td>
                  {gap.hasContent ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: gap.old ? '#F59E0B' : '#22C55E', fontSize: 12 }}>
                      {gap.old ? <><AlertTriangle size={12} /> Oui (ancien)</> : <><CheckCircle size={12} /> Oui</>}
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: 12 }}>
                      <X size={12} /> Non
                    </span>
                  )}
                </td>
                <td>{gap.competitorsCovering}/4</td>
                <td style={{ color: '#FFFFFF', fontWeight: 600 }}>{gap.traffic.toLocaleString('fr-FR')}/mois</td>
                <td>
                  <span className={gap.priority === 'high' ? 'badge-glow-error' : gap.priority === 'medium' ? 'badge-glow-warning' : 'badge-glow-neutral'} style={{ fontSize: 10, padding: '2px 8px' }}>
                    {gap.priority === 'high' ? 'Haute' : gap.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </td>
                <td>
                  <button className={gap.priority === 'high' ? 'btn-neon' : 'btn-secondary'} style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Plus size={12} /> Créer
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
