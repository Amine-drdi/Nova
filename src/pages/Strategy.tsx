import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Target, CheckCircle, Map, Sparkles, TrendingUp, TrendingDown,
  Calendar, User, Clock, Zap, Lightbulb, ArrowRight, Star, Circle,
  AlertTriangle, Shield, Search, Euro, Users, FileText
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
const quarters = [
  { q: 'Q1', label: 'Jan — Mar', status: 'past', progress: 100, milestones: [{ label: 'Audit SEO', done: true }, { label: 'Setup GA4', done: true }, { label: 'Campagne H1', done: true }] },
  { q: 'Q2', label: 'Avr — Jun', status: 'current', progress: 63, milestones: [{ label: 'Lancement Meta', done: true }, { label: 'Optimisation CPL', done: false }, { label: 'Contenu blog x10', done: false }] },
  { q: 'Q3', label: 'Jul — Sep', status: 'future', progress: 0, milestones: [{ label: 'Expansion SEO', done: false }, { label: 'Retargeting', done: false }, { label: 'Partenariats', done: false }] },
  { q: 'Q4', label: 'Oct — Dec', status: 'future', progress: 0, milestones: [{ label: 'Black Friday', done: false }, { label: 'Bilan annuel', done: false }, { label: 'Plan 2026', done: false }] },
];

const goals = [
  { name: 'Trafic organique', category: 'SEO', current: 28000, target: 50000, unit: 'visites', deadline: '30 juin', status: 'in_progress', owner: 'Marie L.', color: '#06B6D4' },
  { name: 'CPL moyen', category: 'Ads', current: 24.5, target: 20.0, unit: '€', deadline: '15 juillet', status: 'at_risk', owner: 'Thomas B.', color: '#8B5CF6' },
  { name: 'Leads qualifiés', category: 'Conversion', current: 350, target: 500, unit: 'leads', deadline: '31 août', status: 'in_progress', owner: 'Sophie D.', color: '#22C55E' },
  { name: 'Score cybersécurité', category: 'Cyber', current: 94, target: 98, unit: '/100', deadline: '30 sept.', status: 'almost', owner: 'Lucas P.', color: '#F59E0B' },
];

const aiRecommendations = [
  { id: 1, priority: 'high', title: 'Augmenter le budget SEO de 30%', desc: 'Meilleur CPL de tous les canaux — opportunité saisissable', impact: '+15% conversion estimée', effort: 'quick', effortLabel: 'Rapide', category: 'SEO' },
  { id: 2, priority: 'high', title: 'Campagne lookalike Meta', desc: 'Lancer avec votre liste clients qualifiés (4,800 contacts)', impact: '-20% CPL potentiel', effort: 'medium', effortLabel: 'Moyen', category: 'Ads' },
  { id: 3, priority: 'medium', title: 'Mise à jour horaires GBP', desc: 'Mettre à jour pour la saison estivale + photos', impact: '+8% appels locaux', effort: 'quick', effortLabel: 'Rapide', category: 'SEO' },
  { id: 4, priority: 'medium', title: '3 landing pages dédiées', desc: 'Créer pour vos mots-clés à fort volume (achat intent)', impact: '+25% taux conversion', effort: 'large', effortLabel: 'Important', category: 'Conversion' },
  { id: 5, priority: 'low', title: 'Retargeting panier abandonné', desc: 'Série email automatisée pour paniers abandonnés', impact: '+12% revenus email', effort: 'medium', effortLabel: 'Moyen', category: 'Conversion' },
];

const swot = {
  forces: [
    { text: 'Expertise SEO prouvée', impact: 'Haut' },
    { text: 'Score cybersécurité élevé', impact: 'Haut' },
    { text: 'ROI campagnes >4x', impact: 'Haut' },
    { text: 'Base email qualifiée', impact: 'Moyen' },
  ],
  faiblesses: [
    { text: 'Faible présence TikTok', impact: 'Moyen' },
    { text: 'CPL Meta Ads élevé', impact: 'Haut' },
    { text: 'Contenu blog irrégulier', impact: 'Moyen' },
    { text: 'Temps de chargement', impact: 'Haut' },
  ],
  opportunites: [
    { text: 'IA générative contenu', impact: 'Haut' },
    { text: 'Marché SEO local', impact: 'Moyen' },
    { text: 'Nouveaux formats Meta', impact: 'Moyen' },
    { text: 'Expansion européenne', impact: 'Haut' },
  ],
  menaces: [
    { text: 'Concurrence Google Ads', impact: 'Haut' },
    { text: 'Changements algorithmes', impact: 'Haut' },
    { text: 'Coût CPC en hausse', impact: 'Moyen' },
    { text: 'Réglementation NIS2', impact: 'Moyen' },
  ],
};

const calendarMonths = ['Juin', 'Juillet', 'Août', 'Sept', 'Oct', 'Nov'];
const calendarEvents = [
  { month: 0, day: 15, type: 'milestone', label: 'Audit Q2' },
  { month: 0, day: 28, type: 'launch', label: 'Campagne été' },
  { month: 1, day: 10, type: 'review', label: 'Revue KPIs' },
  { month: 2, day: 5, type: 'milestone', label: 'Back-to-school' },
  { month: 3, day: 20, type: 'launch', label: 'Nouveau produit' },
  { month: 4, day: 1, type: 'review', label: 'Planning Q4' },
  { month: 5, day: 15, type: 'milestone', label: 'Black Friday' },
];

const budgetData = [
  { name: 'SEO', value: 3500, color: '#06B6D4' },
  { name: 'Google Ads', value: 2800, color: '#8B5CF6' },
  { name: 'Meta Ads', value: 2200, color: '#EC4899' },
  { name: 'Content', value: 1500, color: '#22C55E' },
  { name: 'Email', value: 800, color: '#F59E0B' },
  { name: 'Outils', value: 700, color: '#3B82F6' },
];

/* ── Components ── */
function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    high: { cls: 'badge-glow-error', label: 'Haute' },
    medium: { cls: 'badge-glow-warning', label: 'Moyenne' },
    low: { cls: 'badge-glow-info', label: 'Basse' },
  };
  const p = map[priority] || map.low;
  return <span className={p.cls}>{p.label}</span>;
}

function EffortBadge({ effort, label }: { effort: string; label: string }) {
  const colors: Record<string, string> = {
    quick: '#22C55E',
    medium: '#F59E0B',
    large: '#EF4444',
  };
  return (
    <span style={{
      background: `${colors[effort]}15`, color: colors[effort],
      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

function GoalStatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    in_progress: { cls: 'badge-glow-info', label: 'En cours' },
    at_risk: { cls: 'badge-glow-error', label: 'En retard' },
    almost: { cls: 'badge-glow-success', label: 'Presque' },
  };
  const s = map[status] || map.in_progress;
  return <span className={s.cls}>{s.label}</span>;
}

export default function Strategy() {
  return (
    <div>
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Stratégie Digitale</h1>
          <p className="text-sm" style={{ color: '#4A4A5E' }}>Planifiez, suivez et optimisez votre stratégie de croissance</p>
        </div>
        <button className="btn-neon flex items-center gap-2">
          <Target size={16} /> Nouvel Objectif
        </button>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { icon: Target, label: 'Objectifs Actifs', value: '8', delta: '3 en retard', deltaColor: '#F59E0B', sub: 'Sur 12 définis', iconColor: '#06B6D4' },
          { icon: CheckCircle, label: 'Taux de Réussite', value: '67%', delta: '+8%', deltaColor: '#22C55E', sub: 'Ce trimestre', iconColor: '#22C55E' },
          { icon: Map, label: 'Roadmap', value: 'Q2 2025', delta: '63% complété', deltaColor: '#8B5CF6', sub: '3 jalons restants', iconColor: '#8B5CF6' },
          { icon: Sparkles, label: 'Recommandations IA', value: '5', delta: '2 prioritaires', deltaColor: '#EC4899', sub: 'À examiner', iconColor: '#EC4899' },
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

      {/* Roadmap + Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Roadmap */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-6">Feuille de Route 2025</h3>

            {/* Timeline */}
            <div className="relative mb-6 px-4">
              {/* Connector line */}
              <div className="absolute top-5 left-12 right-12 h-0.5" style={{ background: '#1E1E2D' }}>
                <motion.div
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg, #22C55E, #06B6D4)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '63%' }}
                  transition={{ duration: 1.5, ease }}
                />
              </div>

              <div className="flex justify-between relative z-10">
                {quarters.map((q, i) => (
                  <motion.div
                    key={q.q}
                    custom={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="flex items-center justify-center mb-2"
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: q.status === 'past' ? '#22C55E' : q.status === 'current' ? '#06B6D4' : 'transparent',
                        border: q.status === 'future' ? '2px solid #1E1E2D' : 'none',
                        boxShadow: q.status === 'current' ? '0 0 12px rgba(6,182,212,0.5)' : 'none',
                      }}
                    >
                      {q.status === 'past' ? <CheckCircle size={20} color="white" /> :
                        q.status === 'current' ? <motion.div className="pulse-dot" style={{ width: 16, height: 16, borderRadius: '50%', background: 'white' }} /> :
                        <span style={{ color: '#4A4A5E', fontSize: 14, fontWeight: 600 }}>{i + 1}</span>
                      }
                    </div>
                    <span className="text-xs font-semibold" style={{ color: q.status === 'future' ? '#4A4A5E' : '#FFFFFF' }}>{q.q}</span>
                    <span className="text-xs" style={{ color: '#4A4A5E' }}>{q.label}</span>
                    {q.status !== 'future' && (
                      <span className="text-xs mt-1" style={{ color: q.status === 'past' ? '#22C55E' : '#06B6D4', fontWeight: 600 }}>{q.progress}%</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current quarter milestones */}
            <div className="p-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: '#06B6D4' }}>Q2 2025 — En cours</div>
              <div className="space-y-2">
                {quarters[1].milestones.map((m, i) => (
                  <motion.div
                    key={m.label}
                    custom={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {m.done ? <CheckCircle size={14} color="#22C55E" /> : <Circle size={14} color="#4A4A5E" />}
                    <span className="text-sm" style={{ color: m.done ? '#FFFFFF' : '#8B8B9E' }}>{m.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Goals */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Objectifs en Cours</h3>
            <div className="space-y-4">
              {goals.map((g, i) => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <motion.div
                    key={g.name}
                    custom={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease }}
                    className="gal-card p-3"
                    style={{ borderLeft: `3px solid ${g.color}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{g.name}</span>
                        <span style={{
                          background: `${g.color}15`, color: g.color,
                          padding: '1px 6px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                        }}>
                          {g.category}
                        </span>
                      </div>
                      <GoalStatusBadge status={g.status} />
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#8B8B9E' }}>{g.current.toLocaleString()} / {g.target.toLocaleString()} {g.unit}</span>
                        <span style={{ color: g.color, fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div className="gal-progress-track">
                        <motion.div
                          className="gal-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}
                          style={{ background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#4A4A5E' }}>
                      <span className="flex items-center gap-1"><Clock size={10} /> {g.deadline}</span>
                      <span className="flex items-center gap-1"><User size={10} /> {g.owner}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="gal-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} color="#EC4899" className="pulse-dot" />
            <h3 className="text-lg font-semibold text-white">Recommandations IA</h3>
          </div>
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                custom={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease }}
                className="gal-card p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={rec.priority} />
                    <EffortBadge effort={rec.effort} label={rec.effortLabel} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{rec.title}</div>
                    <div className="text-xs" style={{ color: '#8B8B9E' }}>{rec.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>{rec.impact}</span>
                    <button className="btn-neon text-xs py-1 px-3">Appliquer</button>
                    <button className="btn-secondary text-xs py-1 px-3">Ignorer</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SWOT + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* SWOT */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Analyse SWOT</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Forces */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="gal-card p-3" style={{ background: 'rgba(34,197,94,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} color="#22C55E" />
                  <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>FORCES</span>
                </div>
                {swot.forces.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }} className="text-xs mb-1" style={{ color: '#FFFFFF' }}>
                    • {f.text} <span style={{ color: '#4A4A5E' }}>({f.impact})</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Faiblesses */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="gal-card p-3" style={{ background: 'rgba(239,68,68,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={14} color="#EF4444" />
                  <span className="text-xs font-semibold" style={{ color: '#EF4444' }}>FAIBLESSES</span>
                </div>
                {swot.faiblesses.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.08 }} className="text-xs mb-1" style={{ color: '#FFFFFF' }}>
                    • {f.text} <span style={{ color: '#4A4A5E' }}>({f.impact})</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Opportunités */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="gal-card p-3" style={{ background: 'rgba(6,182,212,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} color="#06B6D4" />
                  <span className="text-xs font-semibold" style={{ color: '#06B6D4' }}>OPPORTUNITÉS</span>
                </div>
                {swot.opportunites.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }} className="text-xs mb-1" style={{ color: '#FFFFFF' }}>
                    • {f.text} <span style={{ color: '#4A4A5E' }}>({f.impact})</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Menaces */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="gal-card p-3" style={{ background: 'rgba(245,158,11,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} color="#F59E0B" />
                  <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>MENACES</span>
                </div>
                {swot.menaces.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 + i * 0.08 }} className="text-xs mb-1" style={{ color: '#FFFFFF' }}>
                    • {f.text} <span style={{ color: '#4A4A5E' }}>({f.impact})</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Strategic Calendar + Budget */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Calendrier Stratégique</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {calendarMonths.map((m, mi) => (
                <motion.div
                  key={m}
                  custom={mi}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.05 }}
                  className="gal-card p-2"
                >
                  <div className="text-xs font-semibold mb-2" style={{ color: '#8B8B9E' }}>{m}</div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 14 }, (_, di) => {
                      const event = calendarEvents.find(e => e.month === mi && e.day === di + 1);
                      return (
                        <div
                          key={di}
                          className="aspect-square rounded flex items-center justify-center"
                          style={{
                            background: event ? `${event.type === 'milestone' ? '#06B6D4' : event.type === 'launch' ? '#EC4899' : '#F59E0B'}20` : 'transparent',
                          }}
                        >
                          {event ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + mi * 0.1, type: 'spring' }}
                            >
                              {event.type === 'milestone' && <Circle size={8} color="#06B6D4" fill="#06B6D4" />}
                              {event.type === 'launch' && <Star size={8} color="#EC4899" fill="#EC4899" />}
                              {event.type === 'review' && <Circle size={8} color="#F59E0B" />}
                            </motion.div>
                          ) : (
                            <span className="text-xs" style={{ color: '#4A4A5E' }}>{di + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upcoming events */}
            <div className="mb-4">
              <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#4A4A5E' }}>Événements à venir</h4>
              {calendarEvents.slice(0, 5).map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-2 mb-1"
                >
                  {e.type === 'milestone' && <Circle size={10} color="#06B6D4" fill="#06B6D4" />}
                  {e.type === 'launch' && <Star size={10} color="#EC4899" fill="#EC4899" />}
                  {e.type === 'review' && <Circle size={10} color="#F59E0B" />}
                  <span className="text-xs text-white">{calendarMonths[e.month]} {e.day} — {e.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Budget Allocation Pie */}
            <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#4A4A5E' }}>Allocation Budget Mensuel</h4>
            <div className="flex items-center gap-4">
              <div style={{ width: 120, height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" stroke="none">
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#12121F', border: '1px solid #1E1E2D', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                {budgetData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs" style={{ color: '#8B8B9E' }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{d.value.toLocaleString()}€</span>
                  </div>
                ))}
                <div className="mt-1 pt-1" style={{ borderTop: '1px solid #1E1E2D' }}>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: '#4A4A5E' }}>Total</span>
                    <span className="text-xs font-bold" style={{ color: '#06B6D4' }}>{budgetData.reduce((a, b) => a + b.value, 0).toLocaleString()}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
