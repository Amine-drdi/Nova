import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Target, TrendingUp, Euro, UserPlus, Phone,
  Mail, Calendar, CheckCircle, Search, Filter,
  MoreHorizontal, Edit, Eye, MapPin, Link2, Clock,
  MessageSquare, FileText, ChevronRight,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
const kpiData = [
  { label: 'LEADS TOTAUX', value: '1,847', delta: '+43 ce mois', deltaColor: '#22C55E', sub: 'Actifs: 1,523', icon: Users, iconColor: '#06B6D4' },
  { label: 'OPPORTUNITÉS', value: '156', delta: 'Valeur: €284K', deltaColor: '#8B5CF6', sub: 'Pipeline', icon: Target, iconColor: '#8B5CF6' },
  { label: 'TAUX DE CONVERSION', value: '23.4%', delta: '+2.1%', deltaColor: '#22C55E', sub: 'Prospect → Client', icon: TrendingUp, iconColor: '#22C55E' },
  { label: 'CA PIPELINE', value: '€284,500', delta: '€42K attendu ce mois', deltaColor: '#F59E0B', sub: 'Pondéré', icon: Euro, iconColor: '#F59E0B' },
];

interface Lead {
  id: number;
  name: string;
  company: string;
  source: string;
  score: number;
  status: string;
  value: string;
  assigned: string;
  days: number;
  email: string;
  phone: string;
}

const kanbanColumns = [
  { key: 'nouveau', label: 'Nouveau', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  { key: 'qualifie', label: 'Qualifié', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)' },
  { key: 'proposition', label: 'Proposition', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' },
  { key: 'gagne', label: 'Gagné', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)' },
];

const leadsData: Lead[] = [
  { id: 1, name: 'Jean Dupont', company: 'Dupont SARL', source: 'Google Ads', score: 87, status: 'qualifie', value: '€15,000', assigned: 'Marie', days: 3, email: 'j.dupont@dupont.fr', phone: '+33 6 12 34 56 78' },
  { id: 2, name: 'Sophie Martin', company: 'TechFlow', source: 'SEO', score: 72, status: 'nouveau', value: '€8,000', assigned: 'Jean', days: 1, email: 's.martin@techflow.io', phone: '+33 6 23 45 67 89' },
  { id: 3, name: 'Pierre Lefebvre', company: 'BuildCorp', source: 'Meta Ads', score: 91, status: 'proposition', value: '€24,000', assigned: 'Marie', days: 7, email: 'p.lefebvre@buildcorp.fr', phone: '+33 6 34 56 78 90' },
  { id: 4, name: 'Marie Chen', company: 'DataStart', source: 'Email', score: 65, status: 'nouveau', value: '€5,500', assigned: 'Lucas', days: 0, email: 'm.chen@datastart.eu', phone: '+33 6 45 67 89 01' },
  { id: 5, name: 'Alain Bernard', company: 'FinSys', source: 'Direct', score: 94, status: 'gagne', value: '€32,000', assigned: 'Marie', days: 14, email: 'a.bernard@finsys.fr', phone: '+33 6 56 78 90 12' },
  { id: 6, name: 'Claire Rousseau', company: 'GreenEnergy', source: 'Google Ads', score: 78, status: 'qualifie', value: '€12,000', assigned: 'Jean', days: 5, email: 'c.rousseau@greenenergy.fr', phone: '+33 6 67 89 01 23' },
  { id: 7, name: 'Thomas Petit', company: 'CloudNet', source: 'SEO', score: 83, status: 'proposition', value: '€18,000', assigned: 'Lucas', days: 9, email: 't.petit@cloudnet.fr', phone: '+33 6 78 90 12 34' },
  { id: 8, name: 'Nathalie Girard', company: 'MediaPro', source: 'Meta Ads', score: 56, status: 'nouveau', value: '€6,000', assigned: 'Jean', days: 2, email: 'n.girard@mediapro.fr', phone: '+33 6 89 01 23 45' },
  { id: 9, name: 'François Moreau', company: 'SafeGuard', source: 'Email', score: 88, status: 'qualifie', value: '€20,000', assigned: 'Marie', days: 4, email: 'f.moreau@safeguard.fr', phone: '+33 6 90 12 34 56' },
  { id: 10, name: 'Isabelle Blanc', company: 'AutoTech', source: 'Direct', score: 96, status: 'gagne', value: '€45,000', assigned: 'Lucas', days: 21, email: 'i.blanc@autotech.fr', phone: '+33 6 01 23 45 67' },
];

const sourceData = [
  { name: 'Google Ads', value: 35, color: '#06B6D4' },
  { name: 'SEO', value: 28, color: '#22C55E' },
  { name: 'Meta Ads', value: 20, color: '#8B5CF6' },
  { name: 'Email', value: 10, color: '#EC4899' },
  { name: 'Direct', value: 7, color: '#F59E0B' },
];

const activityData = [
  { time: '09:00', text: 'Appel avec Jean Dupont', detail: 'Dupont SARL — Qualification initiale', icon: Phone, color: '#06B6D4' },
  { time: '10:30', text: 'Email envoyé à Sophie Martin', detail: 'TechFlow — Envoi de la proposition', icon: Mail, color: '#8B5CF6' },
  { time: '11:15', text: 'Nouveau lead qualifié', detail: 'François Moreau — SafeGuard (Score: 88)', icon: UserPlus, color: '#22C55E' },
  { time: '14:00', text: 'Réunion BuildCorp', detail: 'Pierre Lefebvre — Présentation solution', icon: Calendar, color: '#F59E0B' },
  { time: '15:30', text: 'Suivi proposition CloudNet', detail: 'Thomas Petit — Relance après 9 jours', icon: MessageSquare, color: '#06B6D4' },
  { time: '16:00', text: 'Contrat signé AutoTech', detail: 'Isabelle Blanc — €45,000', icon: CheckCircle, color: '#22C55E' },
  { time: '17:00', text: 'Mise à jour CRM', detail: 'Mise à jour des 12 fiches leads', icon: FileText, color: '#8B5CF6' },
  { time: '17:30', text: 'Nouveau lead entrant', detail: 'Nathalie Girard — MediaPro (Source: Meta)', icon: UserPlus, color: '#EC4899' },
];

const leadDetailTabs = ['Coordonnées', 'Historique', 'Notes', 'Tâches'];

const historyData = [
  { date: '28 juin', action: 'Appel de qualification', user: 'Marie', duration: '15 min' },
  { date: '27 juin', action: 'Email de prospection', user: 'Système', duration: null },
  { date: '25 juin', action: 'Visite du site (3 pages)', user: null, duration: null },
  { date: '24 juin', action: 'Téléchargement ebook', user: null, duration: null },
  { date: '20 juin', action: 'Première visite — Google Ads', user: null, duration: null },
];

const tasksData = [
  { text: 'Envoyer la proposition détaillée', done: false, due: '30 juin' },
  { text: 'Relancer par téléphone', done: false, due: '2 juillet' },
  { text: 'Qualifier le besoin budget', done: true, due: '28 juin' },
];

function ScoreCircle({ score, size = 16 }: { score: number; size?: number }) {
  const color = score < 50 ? '#EF4444' : score < 75 ? '#F59E0B' : '#22C55E';
  const circumference = 2 * Math.PI * (size - 3);
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 2, height: size * 2 }}>
      <svg width={size * 2} height={size * 2} className="-rotate-90">
        <circle cx={size} cy={size} r={size - 3} fill="none" stroke="rgba(74, 74, 94, 0.3)" strokeWidth={2.5} />
        <circle
          cx={size} cy={size} r={size - 3}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span className="absolute text-[9px] font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

/* ── Component ── */
export default function Crm() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leadsData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState(0);

  const filteredLeads = leadsData.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      nouveau: 'badge-glow-warning',
      qualifie: 'badge-glow-info',
      proposition: 'badge-glow-neutral',
      gagne: 'badge-glow-success',
    };
    return map[status] || 'badge-glow-neutral';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      nouveau: 'Nouveau',
      qualifie: 'Qualifié',
      proposition: 'Proposition',
      gagne: 'Gagné',
    };
    return map[status] || status;
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
          <h1 className="font-display text-[36px] font-bold text-white tracking-tight">
            CRM — Gestion des Leads
          </h1>
          <p className="text-[#8B8B9E] text-[13px] mt-1">
            Gérez vos leads et suivez vos opportunités commerciales
          </p>
        </motion.div>
        <motion.button variants={fadeUp} custom={1} className="btn-neon flex items-center gap-2">
          <UserPlus size={16} />
          Ajouter un Lead
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

      {/* ── Pipeline Kanban ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-[16px] font-semibold text-white">Pipeline</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1E1E2D] text-[11px] text-[#8B8B9E] hover:text-white transition-colors">
                <Filter size={12} />
                Filtrer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanColumns.map((col, colIdx) => {
              const colLeads = leadsData.filter((l) => l.status === col.key);
              const totalValue = colLeads.reduce((sum, l) => sum + parseInt(l.value.replace(/[^0-9]/g, '')), 0);

              return (
                <motion.div
                  key={col.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: colIdx * 0.1 }}
                  className="rounded-lg p-3"
                  style={{ background: col.bg, border: `1px solid ${col.color}20` }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                      <span className="text-[13px] font-semibold text-white">{col.label}</span>
                      <span
                        className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${col.color}20`, color: col.color }}
                      >
                        {colLeads.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8B8B9E]">€{totalValue.toLocaleString()}</span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {colLeads.map((lead, i) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        onClick={() => setSelectedLead(lead)}
                        className="gal-card p-3 cursor-pointer"
                        style={{
                          borderLeft: selectedLead?.id === lead.id ? `3px solid ${col.color}` : '3px solid transparent',
                        }}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <p className="text-[13px] font-semibold text-white">{lead.name}</p>
                            <p className="text-[11px] text-[#8B8B9E]">{lead.company}</p>
                          </div>
                          <ScoreCircle score={lead.score} size={14} />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]">
                            {lead.source}
                          </span>
                          <span className="text-[10px] text-[#4A4A5E]">{lead.value}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}
                            >
                              {lead.assigned[0]}
                            </div>
                            <span className="text-[10px] text-[#4A4A5E]">{lead.assigned}</span>
                          </div>
                          <span className="text-[10px] text-[#4A4A5E]">J+{lead.days}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {colLeads.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-[11px] text-[#4A4A5E]">Aucun lead</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Recent Leads + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Recent Leads Table */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-[16px] font-semibold text-white">Leads Récents</h3>
              <div className="search-pill">
                <Search size={14} color="#4A4A5E" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-[12px] w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="gal-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Entreprise</th>
                    <th>Source</th>
                    <th>Score</th>
                    <th>Statut</th>
                    <th>Valeur</th>
                    <th>Assigné</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer"
                      style={{
                        background: selectedLead?.id === lead.id ? 'rgba(6, 182, 212, 0.06)' : undefined,
                      }}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[rgba(139,92,246,0.2)] flex items-center justify-center text-[10px] font-bold text-[#8B5CF6]">
                            {lead.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-[13px] text-white">{lead.name}</span>
                        </div>
                      </td>
                      <td className="text-[12px]">{lead.company}</td>
                      <td>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(6,182,212,0.15)] text-[#06B6D4]">
                          {lead.source}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <ScoreCircle score={lead.score} size={12} />
                          <span className="text-[11px] ml-1">{lead.score}</span>
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadge(lead.status)}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="text-[12px] text-white font-medium">{lead.value}</td>
                      <td>
                        <span className="text-[11px] text-[#8B8B9E]">{lead.assigned}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Activité du Jour
            </h3>

            <div className="relative pl-4">
              {/* Timeline line */}
              <div
                className="absolute left-[19px] top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, #06B6D4, #8B5CF6, #22C55E)' }}
              />

              <div className="space-y-4">
                {activityData.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-3 items-start relative"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ background: `${act.color}20`, border: `2px solid ${act.color}40` }}
                    >
                      <act.icon size={12} color={act.color} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[12px] text-white font-medium">{act.text}</p>
                      <p className="text-[11px] text-[#4A4A5E]">{act.detail}</p>
                      <p className="text-[10px] text-[#4A4A5E] mt-0.5">{act.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Lead Sources + Detail ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Lead Sources */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Sources de Leads
            </h3>

            <div className="flex items-center justify-center mb-4" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(18, 18, 31, 0.9)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {sourceData.map((src, i) => (
                <motion.div
                  key={src.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
                  <span className="text-[12px] text-white flex-1">{src.name}</span>
                  <div className="flex-1 mx-2">
                    <div className="gal-progress-track">
                      <motion.div
                        className="gal-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${src.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8B8B9E] w-8 text-right">{src.value}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Selected Lead Detail */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <AnimatePresence mode="wait">
              {selectedLead ? (
                <motion.div
                  key={selectedLead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-[rgba(139,92,246,0.2)] flex items-center justify-center text-[16px] font-bold text-[#8B5CF6] flex-shrink-0">
                      {selectedLead.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-0.5">
                        <h4 className="font-display text-[18px] font-semibold text-white">
                          {selectedLead.name}
                        </h4>
                        <span className={getStatusBadge(selectedLead.status)}>
                          {getStatusLabel(selectedLead.status)}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#8B8B9E]">{selectedLead.company}</p>
                      <p className="text-[13px] text-white font-medium mt-1">
                        {selectedLead.value} potentiel
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <ScoreCircle score={selectedLead.score} size={20} />
                        <span className="text-[9px] text-[#8B8B9E] mt-0.5 block">Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-5">
                    {[
                      { label: 'Appeler', icon: Phone },
                      { label: 'Email', icon: Mail },
                      { label: 'Planifier', icon: Calendar },
                      { label: 'Déplacer', icon: ChevronRight },
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E1E2D] text-[11px] text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] transition-colors"
                      >
                        <action.icon size={12} />
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#1E1E2D] mb-4">
                    {leadDetailTabs.map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveDetailTab(i)}
                        className="px-4 py-2 text-[12px] font-medium transition-colors relative"
                        style={{
                          color: activeDetailTab === i ? '#06B6D4' : '#8B8B9E',
                        }}
                      >
                        {tab}
                        {activeDetailTab === i && (
                          <motion.div
                            layoutId="crm-tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#06B6D4]"
                            style={{ boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeDetailTab === 0 && (
                      <motion.div
                        key="coord"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <Mail size={14} color="#06B6D4" />
                          <span className="text-[13px] text-white">{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={14} color="#8B5CF6" />
                          <span className="text-[13px] text-white">{selectedLead.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={14} color="#F59E0B" />
                          <span className="text-[13px] text-[#8B8B9E]">Paris, France</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link2 size={14} color="#22C55E" />
                          <span className="text-[13px] text-[#8B8B9E]">www.{selectedLead.company.toLowerCase().replace(/\s/g, '')}.fr</span>
                        </div>
                      </motion.div>
                    )}

                    {activeDetailTab === 1 && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                      >
                        {historyData.map((h, i) => (
                          <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[rgba(6,182,212,0.04)]">
                            <Clock size={12} color="#4A4A5E" className="mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-[12px] text-white">{h.action}</p>
                              <p className="text-[10px] text-[#4A4A5E]">
                                {h.date} {h.user && `· ${h.user}`} {h.duration && `· ${h.duration}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeDetailTab === 2 && (
                      <motion.div
                        key="notes"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <textarea
                          className="gal-input w-full text-[13px] resize-none"
                          rows={4}
                          placeholder="Ajouter une note..."
                          defaultValue={`Lead très intéressé par la solution NOVA. Budget confirmé à ${selectedLead.value}. Décision prévue sous 2 semaines.`}
                        />
                        <div className="flex justify-end mt-2">
                          <button className="btn-neon text-[11px] py-1.5 px-3">Enregistrer</button>
                        </div>
                      </motion.div>
                    )}

                    {activeDetailTab === 3 && (
                      <motion.div
                        key="tasks"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                      >
                        {tasksData.map((task, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[rgba(6,182,212,0.04)]"
                          >
                            <div
                              className="w-4 h-4 rounded border flex items-center justify-center cursor-pointer flex-shrink-0"
                              style={{
                                borderColor: task.done ? '#22C55E' : '#1E1E2D',
                                background: task.done ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                              }}
                            >
                              {task.done && <CheckCircle size={12} color="#22C55E" />}
                            </div>
                            <span
                              className="text-[12px] flex-1"
                              style={{
                                color: task.done ? '#4A4A5E' : '#FFFFFF',
                                textDecoration: task.done ? 'line-through' : 'none',
                              }}
                            >
                              {task.text}
                            </span>
                            <span className="text-[10px] text-[#F59E0B]">{task.due}</span>
                          </div>
                        ))}
                        <button className="w-full py-2 rounded-lg border border-dashed border-[#1E1E2D] text-[11px] text-[#4A4A5E] hover:text-[#8B8B9E] hover:border-[#4A4A5E] transition-colors mt-2">
                          + Ajouter une tâche
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Users size={32} color="#4A4A5E" className="mx-auto mb-2" />
                  <p className="text-[13px] text-[#8B8B9E]">Sélectionnez un lead pour voir les détails</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
