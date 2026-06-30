import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Euro, TrendingUp, UserPlus, Infinity, Download, ArrowUpRight,
  ArrowDownRight, Minus, Zap, ChevronUp, ChevronDown, Sparkles,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease, delay: i * 0.08 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Mock Data ── */
const kpiData = [
  { label: 'CPL MOYEN', value: '€24.50', delta: '-15.3%', deltaColor: '#22C55E', sub: 'Moyenne secteur: €32', icon: Euro, iconColor: '#06B6D4' },
  { label: 'ROI GLOBAL', value: '4.2x', delta: '+0.8x', deltaColor: '#22C55E', sub: 'Sur toutes les campagnes', icon: TrendingUp, iconColor: '#22C55E' },
  { label: 'CAC', value: '€142', delta: '-8%', deltaColor: '#22C55E', sub: 'Client payant', icon: UserPlus, iconColor: '#8B5CF6' },
  { label: 'LTV:CAC', value: '5.8x', delta: '+0.3x', deltaColor: '#22C55E', sub: 'Healthy > 3x', icon: Infinity, iconColor: '#EC4899' },
];

const cplEvolutionData = Array.from({ length: 30 }, (_, i) => ({
  day: `J${i + 1}`,
  google: 18 + Math.random() * 8 + Math.sin(i * 0.3) * 3,
  meta: 14 + Math.random() * 10 + Math.cos(i * 0.25) * 4,
  seo: 3 + Math.random() * 4 + Math.sin(i * 0.2) * 1.5,
  email: 3.5 + Math.random() * 3 + Math.cos(i * 0.15) * 1,
  direct: 0,
}));

const attributionData = [
  { name: 'Premier Clic', google: 45, meta: 25, seo: 20, email: 7, direct: 3 },
  { name: 'Dernier Clic', google: 35, meta: 30, seo: 15, email: 15, direct: 5 },
  { name: 'Linéaire', google: 38, meta: 28, seo: 18, email: 11, direct: 5 },
];

const cplTableData = [
  { channel: 'SEO', budget: 2400, leads: 487, cpl: 4.93, conversions: 73, cpa: 32.88, roi: 8.2, trend: 'up' },
  { channel: 'Google Ads', budget: 4800, leads: 285, cpl: 16.84, conversions: 95, cpa: 50.53, roi: 4.1, trend: 'stable' },
  { channel: 'Meta Ads', budget: 3200, leads: 198, cpl: 16.16, conversions: 42, cpa: 76.19, roi: 2.8, trend: 'down' },
  { channel: 'Email', budget: 800, leads: 156, cpl: 5.13, conversions: 31, cpa: 25.81, roi: 6.5, trend: 'up' },
  { channel: 'Direct', budget: 0, leads: 89, cpl: 0.00, conversions: 22, cpa: 0.00, roi: Infinity, trend: 'up' },
];

const roiCampaignData = [
  { name: 'Google Search Q2', roi: 5.2 },
  { name: 'Meta Retargeting', roi: 3.8 },
  { name: 'SEO Blog', roi: 8.5 },
  { name: 'Email Nurturing', roi: 6.2 },
  { name: 'Display Branding', roi: 1.8 },
  { name: 'YouTube Ads', roi: 2.9 },
  { name: 'LinkedIn B2B', roi: 4.1 },
];

const budgetRecommendations = [
  { text: 'Réallouer €400 de Meta Ads vers SEO', impact: '+23% ROI estimé', level: 'Haute', color: '#EF4444' },
  { text: 'Augmenter le budget Google Ads de 20%', impact: '+15 leads', level: 'Moyenne', color: '#F59E0B' },
  { text: 'Email sous-investi — CPL le plus bas', impact: '€5.13/CPL', level: 'Haute', color: '#22C55E' },
  { text: 'Réduire les enchères CPC "marque"', impact: '-30% sans perte', level: 'Basse', color: '#06B6D4' },
];

const funnelData = [
  { stage: 'Impressions', count: 1247000, cost: 12400, cplLabel: '', rate: null },
  { stage: 'Clics', count: 48291, cost: 12400, cplLabel: 'CPC: €0.26', rate: '3.9%' },
  { stage: 'Leads', count: 1847, cost: 12400, cplLabel: 'CPL: €6.71', rate: '3.8%' },
  { stage: 'Opportunités', count: 434, cost: 12400, cplLabel: 'CPA: €28.57', rate: '23.5%' },
  { stage: 'Clients', count: 89, cost: 12400, cplLabel: 'CAC: €139.33', rate: '20.5%' },
  { stage: 'Revenu', count: 58100, cost: null, cplLabel: 'ROI: 4.7x', rate: null },
];

type SortKey = 'channel' | 'budget' | 'leads' | 'cpl' | 'conversions' | 'cpa' | 'roi';
type SortDir = 'asc' | 'desc';

/* ── Component ── */
export default function CplRoi() {
  const [period, setPeriod] = useState('90j');
  const [attributionModel, setAttributionModel] = useState(2);
  const [sortKey, setSortKey] = useState<SortKey>('cpl');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [simBudgets, setSimBudgets] = useState({ seo: 2400, google: 4800, meta: 3200, email: 800 });

  const periods = ['7j', '30j', '90j', '1 an'];
  const attrModels = ['Premier Clic', 'Dernier Clic', 'Linéaire', 'Position basée', 'Déclin temporel'];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedTable = [...cplTableData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDir === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp size={14} color="#22C55E" />;
    if (trend === 'down') return <ChevronDown size={14} color="#EF4444" />;
    return <Minus size={14} color="#8B8B9E" />;
  };

  const roiColor = (roi: number) => {
    if (roi >= 5) return '#22C55E';
    if (roi >= 3) return '#06B6D4';
    if (roi >= 1) return '#F59E0B';
    return '#EF4444';
  };

  const totalSimBudget = Object.values(simBudgets).reduce((s, v) => s + v, 0);
  const estLeads = Math.floor(
    (simBudgets.seo / 4.93) + (simBudgets.google / 16.84) + (simBudgets.meta / 16.16) + (simBudgets.email / 5.13)
  );
  const estCpl = totalSimBudget / estLeads;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ── Page Header ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between mb-6"
      >
        <motion.div variants={fadeUp} custom={0}>
          <h1 className="font-display text-[36px] font-bold text-white tracking-tight">CPL / ROI</h1>
          <p className="text-[#8B8B9E] text-[13px] mt-1">
            Analysez votre rentabilité et optimisez vos investissements
          </p>
        </motion.div>
        <motion.div variants={fadeUp} custom={1} className="flex rounded-lg overflow-hidden border border-[#1E1E2D]">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 text-[12px] font-medium transition-all"
              style={{
                background: period === p ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: period === p ? '#06B6D4' : '#8B8B9E',
              }}
            >
              {p}
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"
      >
        {kpiData.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            custom={i}
            className="gal-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${kpi.iconColor}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <kpi.icon size={20} color={kpi.iconColor} />
              </div>
              <span className="text-[11px] font-semibold" style={{ color: kpi.deltaColor }}>
                {kpi.delta}
              </span>
            </div>
            <div className="font-display text-[28px] font-bold text-white leading-tight">
              {kpi.value}
            </div>
            <div className="text-[11px] text-[#8B8B9E] uppercase tracking-wider mt-1">
              {kpi.label}
            </div>
            <div className="text-[11px] text-[#4A4A5E] mt-0.5">{kpi.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── CPL Evolution + Attribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* CPL Evolution Line Chart */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Évolution du CPL — {period}
            </h3>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cplEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
                  <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 10 }} axisLine={{ stroke: '#1E1E2D' }} />
                  <YAxis tick={{ fill: '#4A4A5E', fontSize: 10 }} axisLine={{ stroke: '#1E1E2D' }} unit="€" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(18, 18, 31, 0.9)', border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 8, fontSize: 12,
                    }}
                  />
                  <ReferenceLine y={32} stroke="#4A4A5E" strokeDasharray="6 3" label={{ value: 'Secteur: €32', fill: '#4A4A5E', fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="google" stroke="#06B6D4" strokeWidth={2} dot={false} name="Google Ads" />
                  <Line type="monotone" dataKey="meta" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Meta Ads" />
                  <Line type="monotone" dataKey="seo" stroke="#22C55E" strokeWidth={2} dot={false} name="SEO" />
                  <Line type="monotone" dataKey="email" stroke="#EC4899" strokeWidth={2} dot={false} name="Email" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              {[
                { color: '#06B6D4', label: 'Google Ads' },
                { color: '#8B5CF6', label: 'Meta Ads' },
                { color: '#22C55E', label: 'SEO' },
                { color: '#EC4899', label: 'Email' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px] text-[#8B8B9E]">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Attribution Model */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-3">
              Attribution Multi-Touch
            </h3>

            <select
              className="gal-input w-full mb-4 text-[12px]"
              value={attributionModel}
              onChange={(e) => setAttributionModel(Number(e.target.value))}
            >
              {attrModels.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>

            {/* Attribution Flow */}
            <div className="space-y-3 mb-4">
              {[
                { name: 'Google', value: attributionData[attributionModel].google, color: '#06B6D4', icon: 'G' },
                { name: 'Meta', value: attributionData[attributionModel].meta, color: '#8B5CF6', icon: 'M' },
                { name: 'SEO', value: attributionData[attributionModel].seo, color: '#22C55E', icon: 'S' },
                { name: 'Email', value: attributionData[attributionModel].email, color: '#EC4899', icon: 'E' },
                { name: 'Direct', value: attributionData[attributionModel].direct, color: '#F59E0B', icon: 'D' },
              ].map((src, i) => (
                <motion.div
                  key={src.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                    style={{ background: `${src.color}30`, color: src.color, border: `1px solid ${src.color}50` }}
                  >
                    {src.icon}
                  </div>
                  <span className="text-[12px] text-white w-12">{src.name}</span>
                  <div className="flex-1 gal-progress-track">
                    <motion.div
                      className="gal-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${src.value}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      style={{ background: `linear-gradient(90deg, ${src.color}, ${src.color}80)` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold w-10 text-right" style={{ color: src.color }}>
                    {src.value}%
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Summary mini-table */}
            <div className="border-t border-[#1E1E2D] pt-3">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-[#4A4A5E]">
                    <th className="text-left font-medium pb-1">Canal</th>
                    <th className="text-right font-medium pb-1">Attrib.</th>
                    <th className="text-right font-medium pb-1">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Google', color: '#06B6D4', attr: `${attributionData[attributionModel].google}%`, conv: '95' },
                    { name: 'Meta', color: '#8B5CF6', attr: `${attributionData[attributionModel].meta}%`, conv: '42' },
                    { name: 'SEO', color: '#22C55E', attr: `${attributionData[attributionModel].seo}%`, conv: '73' },
                    { name: 'Email', color: '#EC4899', attr: `${attributionData[attributionModel].email}%`, conv: '31' },
                  ].map((row) => (
                    <tr key={row.name}>
                      <td className="flex items-center gap-1.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.color }} />
                        <span className="text-[#8B8B9E]">{row.name}</span>
                      </td>
                      <td className="text-right text-white">{row.attr}</td>
                      <td className="text-right text-[#8B8B9E]">{row.conv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── CPL by Channel Table ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-[16px] font-semibold text-white">
              Coût par Lead par Canal
            </h3>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1E1E2D] text-[11px] text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] transition-colors">
              <Download size={12} />
              CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="gal-table">
              <thead>
                <tr>
                  {[
                    { key: 'channel', label: 'Canal' },
                    { key: 'budget', label: 'Dépenses' },
                    { key: 'leads', label: 'Leads' },
                    { key: 'cpl', label: 'CPL' },
                    { key: 'conversions', label: 'Conv.' },
                    { key: 'cpa', label: 'CPA' },
                    { key: 'roi', label: 'ROI' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as SortKey)}
                      className="cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        )}
                      </div>
                    </th>
                  ))}
                  <th>Tendance</th>
                </tr>
              </thead>
              <tbody>
                {sortedTable.map((row, i) => {
                  const isBestCpl = row.cpl === Math.min(...cplTableData.map((r) => r.cpl).filter((c) => c > 0));
                  const isWorstCpl = row.cpl === Math.max(...cplTableData.map((r) => r.cpl));
                  const isBestRoi = row.roi === Math.max(...cplTableData.map((r) => r.roi).filter((r) => r !== Infinity));
                  return (
                    <motion.tr
                      key={row.channel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        background: isBestCpl ? 'rgba(34, 197, 94, 0.04)' : isWorstCpl ? 'rgba(239, 68, 68, 0.04)' : undefined,
                      }}
                    >
                      <td className="text-[13px] text-white font-medium">{row.channel}</td>
                      <td className="text-[12px]">€{row.budget.toLocaleString()}</td>
                      <td className="text-[12px] text-white">{row.leads}</td>
                      <td className="text-[12px] font-medium" style={{ color: isBestCpl ? '#22C55E' : isWorstCpl ? '#EF4444' : '#FFFFFF' }}>
                        €{row.cpl.toFixed(2)}
                      </td>
                      <td className="text-[12px] text-white">{row.conversions}</td>
                      <td className="text-[12px]">€{row.cpa.toFixed(2)}</td>
                      <td>
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: roiColor(row.roi === Infinity ? 10 : row.roi) }}
                        >
                          {row.roi === Infinity ? '∞' : `${row.roi}x`}
                        </span>
                      </td>
                      <td>{getTrendIcon(row.trend)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* ── ROI by Campaign + Budget Optimization ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* ROI Campaign Bar Chart */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              ROI par Campagne
            </h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiCampaignData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
                  <XAxis type="number" tick={{ fill: '#4A4A5E', fontSize: 10 }} axisLine={{ stroke: '#1E1E2D' }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#8B8B9E', fontSize: 10 }} axisLine={{ stroke: '#1E1E2D' }} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(18, 18, 31, 0.9)', border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 8, fontSize: 12,
                    }}
                  />
                  <ReferenceLine x={1} stroke="#4A4A5E" strokeDasharray="6 3" />
                  <Bar dataKey="roi" radius={[0, 4, 4, 0]} barSize={16}>
                    {roiCampaignData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={roiColor(entry.roi)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              {[
                { color: '#22C55E', label: 'Excellent (>5x)' },
                { color: '#06B6D4', label: 'Bon (3-5x)' },
                { color: '#F59E0B', label: 'Correct (1-3x)' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[10px] text-[#8B8B9E]">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Budget Optimization */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="neon-text-cyan" />
              <h3 className="font-display text-[16px] font-semibold text-white">
                Optimisation du Budget
              </h3>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 mb-5">
              {budgetRecommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-3 rounded-lg border border-[#1E1E2D] hover:border-[rgba(6,182,212,0.2)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[12px] text-white font-medium">{rec.text}</p>
                      <p className="text-[11px] text-[#8B8B9E] mt-0.5">{rec.impact}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${rec.color}15`, color: rec.color }}
                      >
                        {rec.level}
                      </span>
                      <button className="text-[10px] px-2 py-1 rounded bg-[rgba(6,182,212,0.15)] text-[#06B6D4] hover:bg-[rgba(6,182,212,0.25)] transition-colors">
                        Appliquer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Budget Simulator */}
            <div className="border-t border-[#1E1E2D] pt-4">
              <h4 className="text-[13px] font-semibold text-white mb-3">Simulateur de Budget</h4>
              {[
                { key: 'seo', label: 'SEO', color: '#22C55E' },
                { key: 'google', label: 'Google Ads', color: '#06B6D4' },
                { key: 'meta', label: 'Meta Ads', color: '#8B5CF6' },
                { key: 'email', label: 'Email', color: '#EC4899' },
              ].map((ch) => (
                <div key={ch.key} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#8B8B9E]">{ch.label}</span>
                    <span className="text-[11px] text-white font-medium">
                      €{simBudgets[ch.key as keyof typeof simBudgets].toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={8000}
                    step={100}
                    value={simBudgets[ch.key as keyof typeof simBudgets]}
                    onChange={(e) =>
                      setSimBudgets((prev) => ({ ...prev, [ch.key]: Number(e.target.value) }))
                    }
                    className="w-full"
                    style={{ accentColor: ch.color }}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E1E2D]">
                <div>
                  <p className="text-[10px] text-[#4A4A5E]">Budget total</p>
                  <p className="text-[16px] font-display font-bold text-white">€{totalSimBudget.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#4A4A5E]">Leads estimés</p>
                  <p className="text-[16px] font-display font-bold text-[#06B6D4]">{estLeads}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#4A4A5E]">CPL estimé</p>
                  <p className="text-[16px] font-display font-bold text-[#22C55E]">€{estCpl.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── ROI Funnel ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
          <h3 className="font-display text-[16px] font-semibold text-white mb-5">
            Funnel de Rentabilité
          </h3>

          <div className="space-y-3">
            {funnelData.map((stage, i) => {
              const widthPercent = i === 0 ? 100 : i === funnelData.length - 1 ? 30 : 100 - (i * 18);
              const isRevenue = i === funnelData.length - 1;

              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease }}
                  style={{ transformOrigin: 'center' }}
                  className="flex items-center gap-4"
                >
                  <span className="text-[11px] text-[#8B8B9E] w-24 text-right flex-shrink-0">
                    {stage.stage}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-9 rounded-lg flex items-center px-3 relative overflow-hidden"
                      style={{
                        width: `${widthPercent}%`,
                        background: isRevenue
                          ? 'linear-gradient(90deg, #22C55E, #22C55E80)'
                          : 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
                        boxShadow: isRevenue ? '0 0 16px rgba(34, 197, 94, 0.3)' : '0 0 8px rgba(6, 182, 212, 0.15)',
                      }}
                    >
                      <span className="text-[12px] font-semibold text-white">
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 w-48">
                    {stage.cplLabel && (
                      <span className={`text-[11px] ${isRevenue ? 'text-[#22C55E] font-semibold' : 'text-[#8B8B9E]'}`}>
                        {stage.cplLabel}
                      </span>
                    )}
                    {stage.rate && (
                      <span className="text-[10px] text-[#4A4A5E]">Taux: {stage.rate}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
