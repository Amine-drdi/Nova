import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, CheckCircle, Sigma, TrendingUp, Play, Pause,
  Trophy, AlertTriangle, XCircle, BarChart3, Eye, Layers,
  MousePointer, Timer, ArrowUpRight, ArrowDownRight, Minus,
  ChevronRight, Target, Percent, DollarSign, Plus,
} from 'lucide-react';

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
  { label: 'TESTS ACTIFS', value: '4', delta: '1 en attente', deltaColor: '#F59E0B', sub: 'En cours de collecte', icon: FlaskConical, iconColor: '#06B6D4' },
  { label: 'TAUX DE RÉUSSITE', value: '68%', delta: '+12%', deltaColor: '#22C55E', sub: 'Tests gagnants', icon: CheckCircle, iconColor: '#22C55E' },
  { label: 'SIGNIFICANCE MOY.', value: '97.2%', delta: 'Seuil: 95%', deltaColor: '#22C55E', sub: 'Niveau de confiance', icon: Sigma, iconColor: '#8B5CF6' },
  { label: 'GAINS CUMULÉS', value: '+23.4%', delta: 'Conversion moy.', deltaColor: '#22C55E', sub: 'Depuis le début', icon: TrendingUp, iconColor: '#EC4899' },
];

const activeExperiments = [
  {
    id: 1,
    name: 'CTA Hero V3 — "Commencer" vs "Essayer Gratuit"',
    type: 'Landing',
    status: 'running',
    statusLabel: 'En cours',
    day: 8,
    totalDays: 14,
    confidence: 87,
    variantA: { name: 'Contrôle', rate: 2.4, visitors: 2451 },
    variantB: { name: 'Variante B', rate: 2.9, visitors: 2370 },
    winner: null,
    needsDays: 6,
  },
  {
    id: 2,
    name: 'Couleur Bouton Primaire — Cyan vs Vert',
    type: 'Page',
    status: 'running',
    statusLabel: 'En cours',
    day: 12,
    totalDays: 21,
    confidence: 94,
    variantA: { name: 'Contrôle', rate: 3.1, visitors: 5102 },
    variantB: { name: 'Variante B', rate: 3.6, visitors: 4987 },
    winner: null,
    needsDays: 4,
  },
  {
    id: 3,
    name: 'Titre Landing — Version Émotion vs Rational',
    type: 'Landing',
    status: 'ready',
    statusLabel: 'Prêt à déployer',
    day: 21,
    totalDays: 21,
    confidence: 99,
    variantA: { name: 'Contrôle', rate: 1.8, visitors: 8214 },
    variantB: { name: 'Variante B', rate: 2.7, visitors: 8091 },
    winner: 'B',
    needsDays: 0,
  },
  {
    id: 4,
    name: 'Formulaire Checkout — 3 champs vs 5 champs',
    type: 'Page',
    status: 'waiting',
    statusLabel: 'En attente',
    day: 3,
    totalDays: 14,
    confidence: 62,
    variantA: { name: 'Contrôle', rate: 4.2, visitors: 892 },
    variantB: { name: 'Variante B', rate: 4.5, visitors: 901 },
    winner: null,
    needsDays: 11,
  },
];

const testHistory = [
  { name: 'CTA Hero V2', element: 'Bouton Hero', variantA: 'En savoir plus', variantB: 'Commencer', winner: 'A', gain: '+18.2%', significance: 98.5, date: '10 juin', status: 'gagnant' },
  { name: 'Sujet Email V1', element: 'Objet email', variantA: 'Offre spéciale', variantB: 'Votre accès VIP', winner: 'B', gain: '+12.4%', significance: 96.2, date: '5 juin', status: 'gagnant' },
  { name: 'Image Hero', element: 'Visuel landing', variantA: 'Produit', variantB: 'Personne', winner: 'A', gain: '+8.7%', significance: 94.1, date: '28 mai', status: 'gagnant' },
  { name: 'Page Prix V3', element: 'Tableau tarifs', variantA: '3 formules', variantB: '2 formules', winner: 'A', gain: '-3.1%', significance: 91.3, date: '1 juin', status: 'perdant' },
  { name: 'Couleur Bouton', element: 'CTA', variantA: 'Bleu', variantB: 'Vert', winner: 'B', gain: '+5.2%', significance: 97.8, date: '25 mai', status: 'gagnant' },
  { name: 'Témoignages', element: 'Section social proof', variantA: 'Carrousel', variantB: 'Grille', winner: null, gain: '+1.2%', significance: 78.4, date: '20 mai', status: 'inconclusif' },
  { name: 'Barre Navigation', element: 'Menu sticky', variantA: 'Transparent', variantB: 'Solid', winner: 'B', gain: '+6.8%', significance: 95.6, date: '15 mai', status: 'gagnant' },
  { name: 'Pop-up Sortie', element: 'Exit intent', variantA: '-10%', variantB: 'Bonus gratuit', winner: 'B', gain: '+15.3%', significance: 99.1, date: '8 mai', status: 'gagnant' },
];

const variantMetrics = [
  { label: 'Visiteurs', a: 2451, b: 2370, icon: Eye },
  { label: 'Conversions', a: 59, b: 69, icon: Target },
  { label: 'Taux de conv.', a: '2.4%', b: '2.9%', icon: Percent },
  { label: 'Bounce rate', a: '45%', b: '38%', icon: ArrowDownRight },
  { label: 'Temps/page', a: '1:24', b: '1:47', icon: Timer },
];

const metricImpacts = [
  { label: 'Taux de conversion', before: 2.4, after: 2.9, unit: '%', positive: true },
  { label: 'CTR', before: 4.1, after: 5.2, unit: '%', positive: true },
  { label: 'Revenu/visiteur', before: 1.85, after: 2.28, unit: '€', positive: true },
  { label: 'Bounce rate', before: 45, after: 38, unit: '%', positive: true },
  { label: 'Pages/session', before: 2.1, after: 2.6, unit: '', positive: true },
];

/* ── Gauge Component ── */
function ConfidenceGauge({ value }: { value: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const zoneColor = value >= 95 ? '#22C55E' : value >= 80 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg width={120} height={120} className="-rotate-90">
        {/* Background arc */}
        <circle cx={60} cy={60} r={radius} fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth={8} />
        {/* Red zone (0-80) */}
        <circle cx={60} cy={60} r={radius} fill="none" stroke="#EF4444" strokeWidth={8}
          strokeDasharray={`${0.8 * circumference} ${circumference}`} strokeDashoffset={0} opacity={0.3} />
        {/* Amber zone (80-95) */}
        <circle cx={60} cy={60} r={radius} fill="none" stroke="#F59E0B" strokeWidth={8}
          strokeDasharray={`${0.15 * circumference} ${circumference}`} strokeDashoffset={-0.8 * circumference} opacity={0.3} />
        {/* Green zone (95-100) */}
        <circle cx={60} cy={60} r={radius} fill="none" stroke="#22C55E" strokeWidth={8}
          strokeDasharray={`${0.05 * circumference} ${circumference}`} strokeDashoffset={-0.95 * circumference} opacity={0.3} />
        {/* Value arc */}
        <circle cx={60} cy={60} r={radius} fill="none" stroke={zoneColor} strokeWidth={8}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${zoneColor}60)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-display font-bold text-white">{value}%</span>
        <span className="text-[9px] text-[#4A4A5E]">confiance</span>
      </div>
    </div>
  );
}

/* ── Component ── */
export default function AbTest() {
  const [selectedExp, setSelectedExp] = useState(activeExperiments[0]);
  const [historyFilter, setHistoryFilter] = useState('Tous');

  const historyFilters = ['Tous', 'Gagnant', 'Perdant', 'Inconclusif'];

  const filteredHistory = historyFilter === 'Tous'
    ? testHistory
    : testHistory.filter((t) => t.status === historyFilter.toLowerCase());

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      running: 'badge-glow-info',
      waiting: 'badge-glow-warning',
      ready: 'badge-glow-success',
    };
    return map[status] || 'badge-glow-neutral';
  };

  const getResultBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      gagnant: 'badge-glow-success',
      perdant: 'badge-glow-error',
      inconclusif: 'badge-glow-neutral',
    };
    return map[status] || 'badge-glow-neutral';
  };

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
          <h1 className="font-display text-[36px] font-bold text-white tracking-tight">A/B Testing</h1>
          <p className="text-[#8B8B9E] text-[13px] mt-1">
            Testez, mesurez et optimisez avec la méthode scientifique
          </p>
        </motion.div>
        <motion.button variants={fadeUp} custom={1} className="btn-neon flex items-center gap-2">
          <FlaskConical size={16} />
          Nouveau Test
        </motion.button>
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

      {/* ── Active Tests + History ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Active Experiments */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Tests en Cours
            </h3>

            <div className="space-y-3">
              {activeExperiments.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedExp(exp)}
                  className="p-4 rounded-lg border border-[#1E1E2D] hover:border-[rgba(6,182,212,0.2)] transition-all cursor-pointer"
                  style={{
                    background: selectedExp.id === exp.id ? 'rgba(6, 182, 212, 0.04)' : undefined,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-semibold text-white truncate">
                          {exp.name}
                        </h4>
                        {exp.winner === 'B' && (
                          <Trophy size={14} color="#F59E0B" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#8B5CF6',
                          }}
                        >
                          {exp.type}
                        </span>
                        <span className={getStatusBadge(exp.status)}>
                          {exp.statusLabel}
                        </span>
                        {exp.status === 'running' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] pulse-dot" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button className="text-[10px] px-2 py-1 rounded text-[#8B8B9E] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        Voir
                      </button>
                      {exp.status === 'ready' ? (
                        <button className="text-[10px] px-2 py-1 rounded bg-[rgba(34,197,94,0.15)] text-[#22C55E] hover:bg-[rgba(34,197,94,0.25)] transition-colors">
                          Déployer
                        </button>
                      ) : (
                        <button className="text-[10px] px-2 py-1 rounded text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors">
                          Arrêter
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] text-[#4A4A5E] flex-shrink-0">
                      Jour {exp.day} / {exp.totalDays}
                    </span>
                    <div className="flex-1 gal-progress-track">
                      <motion.div
                        className="gal-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(exp.day / exp.totalDays) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                    <span className="text-[10px] text-[#8B8B9E] flex-shrink-0">
                      {exp.confidence}%
                    </span>
                  </div>

                  {/* Variants comparison */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-[rgba(74,74,94,0.1)] border border-[#1E1E2D]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] px-1 py-0.5 rounded bg-[rgba(74,74,94,0.2)] text-[#8B8B9E]">
                          {exp.variantA.name}
                        </span>
                      </div>
                      <p className="text-[14px] font-display font-bold text-white">
                        {exp.variantA.rate}%
                      </p>
                      <p className="text-[10px] text-[#4A4A5E]">
                        {exp.variantA.visitors.toLocaleString()} visiteurs
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.2)]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] px-1 py-0.5 rounded bg-[rgba(6,182,212,0.15)] text-[#06B6D4]">
                          {exp.variantB.name}
                        </span>
                        {exp.winner === 'B' && (
                          <Trophy size={10} color="#F59E0B" />
                        )}
                      </div>
                      <p className="text-[14px] font-display font-bold text-[#06B6D4]">
                        {exp.variantB.rate}%
                      </p>
                      <p className="text-[10px] text-[#4A4A5E]">
                        {exp.variantB.visitors.toLocaleString()} visiteurs
                      </p>
                    </div>
                  </div>

                  {exp.winner === null && exp.needsDays > 0 && (
                    <p className="text-[10px] text-[#F59E0B] mt-2">
                      <AlertTriangle size={10} className="inline mr-1" />
                      Besoin de +{exp.needsDays} jours pour atteindre 95% de confiance
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Test History */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-[16px] font-semibold text-white">
                Historique
              </h3>
              <div className="flex rounded-lg overflow-hidden border border-[#1E1E2D]">
                {historyFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className="px-2 py-1 text-[10px] font-medium transition-all"
                    style={{
                      background: historyFilter === f ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      color: historyFilter === f ? '#06B6D4' : '#8B8B9E',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={historyFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredHistory.map((test, i) => (
                  <motion.div
                    key={test.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-3 rounded-lg border border-[#1E1E2D] hover:border-[rgba(6,182,212,0.15)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-white">{test.name}</span>
                        <span
                          className="text-[8px] px-1 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#8B5CF6',
                          }}
                        >
                          {test.element}
                        </span>
                      </div>
                      <span className={getResultBadgeClass(test.status)}>
                        {test.status === 'gagnant' ? 'Gagnant' : test.status === 'perdant' ? 'Perdant' : 'Inconclusif'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#4A4A5E]">
                          {test.variantA}
                          <span className="mx-1 text-[#8B8B9E]">vs</span>
                          {test.variantB}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-semibold"
                          style={{
                            color: test.gain.startsWith('+') ? '#22C55E' : '#EF4444',
                          }}
                        >
                          {test.gain}
                        </span>
                        <span className="text-[10px] text-[#4A4A5E]">{test.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[9px] text-[#4A4A5E]">Significance: {test.significance}%</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Variant Comparison ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
          <h3 className="font-display text-[16px] font-semibold text-white mb-4">
            Comparaison des Variantes — {selectedExp.name}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Variant A */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="p-5 rounded-l-lg border border-[#1E1E2D] bg-[rgba(74,74,94,0.05)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(74,74,94,0.2)] text-[#8B8B9E]">
                  Contrôle
                </span>
              </div>

              {/* Preview Placeholder */}
              <div
                className="rounded-lg aspect-video mb-4 flex items-center justify-center border border-[#1E1E2D]"
                style={{ background: '#0A0A1A' }}
              >
                <Layers size={28} color="#4A4A5E" />
              </div>

              <div className="space-y-2">
                {variantMetrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <m.icon size={12} color="#4A4A5E" />
                      <span className="text-[11px] text-[#8B8B9E]">{m.label}</span>
                    </div>
                    <span className="text-[12px] text-white font-medium">{m.a}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center py-4 lg:py-0 relative">
              <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-[#1E1E2D]" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
                }}
              >
                <span className="text-[11px] font-bold text-white">VS</span>
              </motion.div>
            </div>

            {/* Variant B */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="p-5 rounded-r-lg border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.04)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(6,182,212,0.15)] text-[#06B6D4]">
                  Variante B
                </span>
                {selectedExp.winner === 'B' && (
                  <span className="flex items-center gap-1 text-[10px] text-[#F59E0B]">
                    <Trophy size={12} />
                    Gagnant
                  </span>
                )}
              </div>

              {/* Preview Placeholder */}
              <div
                className="rounded-lg aspect-video mb-4 flex items-center justify-center border border-[rgba(6,182,212,0.2)]"
                style={{ background: '#0A0A1A' }}
              >
                <Layers size={28} color="#06B6D4" opacity={0.5} />
              </div>

              <div className="space-y-2">
                {variantMetrics.map((m, i) => {
                  const isBetter = i < 3 || i === 5;
                  return (
                    <div key={m.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <m.icon size={12} color="#06B6D4" />
                        <span className="text-[11px] text-[#8B8B9E]">{m.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] text-white font-medium">{m.b}</span>
                        {isBetter && (
                          <ArrowUpRight size={12} color="#22C55E" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Significance + Metric Impact ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Statistical Significance */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Significance Statistique
            </h3>

            <div className="flex items-center gap-6 mb-4">
              <ConfidenceGauge value={selectedExp.confidence} />
              <div className="space-y-2 flex-1">
                <div>
                  <p className="text-[10px] text-[#4A4A5E] uppercase">P-value</p>
                  <p className="text-[16px] font-mono-data text-[#22C55E]">
                    p = 0.032
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A4A5E] uppercase">Puissance</p>
                  <p className="text-[14px] text-white font-medium">80%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A4A5E] uppercase">Durée estimée</p>
                  <p className="text-[14px] text-[#F59E0B]">+{selectedExp.needsDays} jours recommandés</p>
                </div>
              </div>
            </div>

            {/* Sample size progress */}
            <div className="border-t border-[#1E1E2D] pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#8B8B9E]">Taille d'échantillon</span>
                <span className="text-[11px] text-white">
                  {(selectedExp.variantA.visitors + selectedExp.variantB.visitors).toLocaleString()} / 5,000 recommandés
                </span>
              </div>
              <div className="gal-progress-track">
                <motion.div
                  className="gal-progress-fill"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, ((selectedExp.variantA.visitors + selectedExp.variantB.visitors) / 5000) * 100)}%`,
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Zone legend */}
            <div className="flex items-center gap-4 mt-3">
              {[
                { color: '#EF4444', label: 'Insuffisant (0-80%)' },
                { color: '#F59E0B', label: 'Approche (80-95%)' },
                { color: '#22C55E', label: 'Significatif (95-100%)' },
              ].map((z) => (
                <div key={z.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: z.color, opacity: 0.6 }} />
                  <span className="text-[9px] text-[#4A4A5E]">{z.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Metric Impact */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Impact sur les Métriques
            </h3>

            <div className="space-y-4">
              {metricImpacts.map((metric, i) => {
                const pctChange = ((metric.after - metric.before) / metric.before) * 100;
                const maxVal = Math.max(metric.before, metric.after) * 1.3;
                const beforeWidth = (metric.before / maxVal) * 100;
                const afterWidth = (metric.after / maxVal) * 100;

                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] text-white font-medium">{metric.label}</span>
                      <span className="text-[11px] text-[#22C55E] font-semibold">
                        +{pctChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#4A4A5E] w-10 text-right">Avant</span>
                      <div className="flex-1 h-5 bg-[rgba(74,74,94,0.15)] rounded-md overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${beforeWidth}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full rounded-md"
                          style={{ background: '#4A4A5E' }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium">
                          {metric.before}{metric.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#06B6D4] w-10 text-right">Après</span>
                      <div className="flex-1 h-5 bg-[rgba(6,182,212,0.1)] rounded-md overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${afterWidth}%` }}
                          transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                          className="h-full rounded-md"
                          style={{ background: '#06B6D4', boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)' }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium">
                          {metric.after}{metric.unit}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
