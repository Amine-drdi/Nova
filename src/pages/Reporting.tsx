import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import {
  FileText, Clock, Send, Download, FilePlus, Search,
  RefreshCw, Pencil, Share2, Play, CheckCircle, AlertCircle,
  Grip, Settings, Trash2, ChevronRight, Eye, X, Loader
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
const myReports = [
  { id: 1, name: 'Rapport SEO Mensuel', type: 'PDF', desc: 'Performance organique, backlinks, keywords', date: '14 juin 2025', size: '2.4 MB', pages: 12, recipients: 3, status: 'up_to_date' },
  { id: 2, name: 'Analyse Campagnes PPC', type: 'Tableau de bord', desc: 'Google Ads + Meta Ads consolidé', date: '12 juin 2025', size: '—', pages: 8, recipients: 5, status: 'needs_gen' },
  { id: 3, name: 'Audit Cybersécurité', type: 'PDF', desc: 'Score sécurité, vulnérabilités, conformité', date: '10 juin 2025', size: '1.8 MB', pages: 6, recipients: 2, status: 'up_to_date' },
  { id: 4, name: 'KPIs Globaux Q2', type: 'XLSX', desc: 'Tous les KPIs consolidés par canal', date: '8 juin 2025', size: '856 KB', pages: 24, recipients: 8, status: 'up_to_date' },
  { id: 5, name: 'Rapport Conversions', type: 'PDF', desc: 'Funnel conversion, attribution, CPL', date: '5 juin 2025', size: '3.1 MB', pages: 15, recipients: 4, status: 'needs_gen' },
  { id: 6, name: 'Benchmark Concurrentiel', type: 'PDF', desc: 'Positionnement vs 5 concurrents', date: '1 juin 2025', size: '4.2 MB', pages: 20, recipients: 6, status: 'up_to_date' },
];

const scheduledReports = [
  { id: 1, name: 'Rapport SEO Hebdo', frequency: 'Hebdo', nextRun: 'Dans 2j 4h', recipients: 3, format: 'PDF', active: true },
  { id: 2, name: 'KPIs Quotidiens', frequency: 'Quotidien', nextRun: 'Dans 4h 23min', recipients: 5, format: 'PDF', active: true },
  { id: 3, name: 'Audit Sécurité Mensuel', frequency: 'Mensuel', nextRun: 'Dans 12j', recipients: 2, format: 'PDF', active: true },
  { id: 4, name: 'Rapport PPC Bi-mensuel', frequency: 'Mensuel', nextRun: 'Dans 18j', recipients: 4, format: 'XLSX', active: false },
];

const widgetPalette = [
  { category: 'KPIs', items: ['Carte métrique', 'Comparaison', 'Tendance'] },
  { category: 'Graphiques', items: ['Courbe', 'Barres', 'Camembert', 'Radar'] },
  { category: 'Tableaux', items: ['Données brutes', 'Classement'] },
  { category: 'Texte', items: ['Titre', 'Paragraphe', 'Note'] },
];

const templates = [
  { name: 'Rapport Mensuel SEO', desc: 'Trafic, rankings, backlinks, actions', icon: Search },
  { name: 'Rapport Campagnes PPC', desc: 'Google Ads, Meta, budget, ROAS', icon: FileText },
  { name: 'Rapport Cybersécurité', desc: 'Score, menaces, conformité', icon: AlertCircle },
  { name: 'Rapport Global Executive', desc: 'KPIs clés, résumé stratégique', icon: FileText },
  { name: 'Rapport Conversions', desc: 'Funnel, attribution, recettes', icon: FileText },
  { name: 'Rapport Social Media', desc: 'Engagement, reach, publications', icon: FileText },
  { name: 'Rapport Email', desc: 'Ouvertures, clics, conversions', icon: FileText },
  { name: 'Rapport Concurrentiel', desc: 'Positionnement, parts de marché', icon: FileText },
];

const formatOptions = [
  { key: 'pdf', label: 'PDF', desc: 'Document paginé, idéal pour impression', icon: FileText },
  { key: 'csv', label: 'CSV', desc: 'Données brutes, importable partout', icon: FileText },
  { key: 'xlsx', label: 'XLSX', desc: 'Excel avec tableaux et graphiques', icon: FileText },
  { key: 'pptx', label: 'PPTX', desc: 'Présentation PowerPoint', icon: FileText },
];

const COLORS = ['#06B6D4', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899', '#3B82F6'];

function StatusBadge({ status }: { status: string }) {
  return status === 'up_to_date'
    ? <span className="badge-glow-success">À jour</span>
    : <span className="badge-glow-warning">Génération requise</span>;
}

function FrequencyBadge({ freq }: { freq: string }) {
  const colors: Record<string, string> = {
    'Quotidien': '#06B6D4',
    'Hebdo': '#8B5CF6',
    'Mensuel': '#F59E0B',
  };
  return (
    <span style={{
      background: `${colors[freq] || '#8B8B9E'}15`, color: colors[freq] || '#8B8B9E',
      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
    }}>
      {freq}
    </span>
  );
}

export default function Reporting() {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [canvasWidgets, setCanvasWidgets] = useState<string[]>([]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  const addToCanvas = (widget: string) => {
    setCanvasWidgets(prev => [...prev, widget]);
  };

  const removeFromCanvas = (idx: number) => {
    setCanvasWidgets(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Reporting</h1>
          <p className="text-sm" style={{ color: '#4A4A5E' }}>Créez, planifiez et partagez vos rapports personnalisés</p>
        </div>
        <button className="btn-neon flex items-center gap-2">
          <FilePlus size={16} /> Créer un Rapport
        </button>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { icon: FileText, label: 'Rapports Créés', value: '24', delta: '+3 ce mois', deltaColor: '#22C55E', sub: 'Personnalisés', iconColor: '#06B6D4' },
          { icon: Clock, label: 'Rapports Automatiques', value: '8', delta: '3 actifs', deltaColor: '#06B6D4', sub: 'Planifiés', iconColor: '#8B5CF6' },
          { icon: Send, label: 'Dernier Envoi', value: 'Il y a 2j', delta: '15 destinataires', deltaColor: '#8B8B9E', sub: "Taux d'ouverture: 78%", iconColor: '#22C55E' },
          { icon: Download, label: 'Formats Disponibles', value: 'PDF, CSV, XLSX', delta: '+ White-label', deltaColor: '#F59E0B', sub: 'Multi-format', iconColor: '#F59E0B' },
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

      {/* My Reports + Scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* My Reports */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3">
          <div className="gal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Mes Rapports</h3>
              <div className="flex items-center gap-2">
                <div className="search-pill" style={{ width: 180, padding: '4px 10px' }}>
                  <Search size={12} color="#4A4A5E" />
                  <input type="text" placeholder="Rechercher..." className="gal-input" style={{ padding: 0, border: 'none', fontSize: 12 }} />
                </div>
              </div>
            </div>
            <div className="space-y-3" style={{ maxHeight: 500, overflowY: 'auto' }}>
              {myReports.map((r, i) => (
                <motion.div
                  key={r.id} custom={i} initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4, ease }}
                  className="gal-card p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{r.name}</h4>
                      <span className="badge-glow-info" style={{ fontSize: 10, padding: '1px 6px' }}>{r.type}</span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#4A4A5E' }}>{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#8B8B9E' }}>
                      <span className="flex items-center gap-1"><Clock size={10} /> {r.date}</span>
                      <span>{r.size !== '—' ? r.size : '—'}</span>
                      <span>{r.pages} widgets</span>
                      <span>{r.recipients} destinataires</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"><RefreshCw size={10} /> Générer</button>
                      <button className="btn-secondary text-xs py-1 px-2"><Pencil size={10} /></button>
                      <button className="btn-secondary text-xs py-1 px-2"><Download size={10} /></button>
                      <button className="btn-secondary text-xs py-1 px-2"><Share2 size={10} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scheduled Reports */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Rapports Planifiés</h3>
            <div className="space-y-4">
              {scheduledReports.map((sr, i) => (
                <motion.div
                  key={sr.id} custom={i} initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.4, ease }}
                  className="gal-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{sr.name}</span>
                      <FrequencyBadge freq={sr.frequency} />
                    </div>
                    <div
                      onClick={() => {}}
                      className="cursor-pointer"
                      style={{
                        width: 36, height: 20, borderRadius: 9999,
                        background: sr.active ? 'linear-gradient(135deg, #06B6D4, #8B5CF6)' : '#1E1E2D',
                        position: 'relative', transition: 'background 0.2s',
                      }}
                    >
                      <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{
                          width: 16, height: 16, borderRadius: '50%', background: 'white',
                          position: 'absolute', top: 2, left: sr.active ? 18 : 2,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#8B8B9E' }}>Prochaine exécution</span>
                      <span style={{ color: '#06B6D4', fontWeight: 600 }}>{sr.nextRun}</span>
                    </div>
                    <div className="gal-progress-track" style={{ height: 4 }}>
                      <div className="gal-progress-fill" style={{ width: `${Math.random() * 60 + 20}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#4A4A5E' }}>{sr.recipients} destinataires • {sr.format}</span>
                    <button className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"><Play size={10} /> Exécuter</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Builder */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="gal-card p-5" style={{ border: canvasWidgets.length > 0 ? '1px solid rgba(6,182,212,0.3)' : undefined }}>
          <h3 className="text-lg font-semibold text-white mb-4">Constructeur de Rapport</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Widget Palette */}
            <div className="lg:col-span-1">
              <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4A4A5E' }}>Widgets</h4>
              <div className="space-y-3">
                {widgetPalette.map((cat) => (
                  <div key={cat.category}>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#8B8B9E' }}>{cat.category}</div>
                    {cat.items.map(item => (
                      <motion.button
                        key={item}
                        onClick={() => addToCanvas(item)}
                        whileHover={{ scale: 1.02 }}
                        className="w-full text-left gal-card p-2 mb-1 flex items-center gap-2"
                        style={{ cursor: 'pointer' }}
                      >
                        <Grip size={12} color="#4A4A5E" />
                        <span className="text-xs text-white">{item}</span>
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Canvas */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4A4A5E' }}>Aperçu</h4>
              <div
                className="gal-card p-4 min-h-[300px]"
                style={{ background: 'rgba(10,10,26,0.5)', borderStyle: 'dashed' }}
              >
                <AnimatePresence>
                  {canvasWidgets.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-[260px]"
                    >
                      <Eye size={32} color="#4A4A5E" className="mb-2" />
                      <p className="text-sm" style={{ color: '#4A4A5E' }}>Cliquez sur un widget pour l'ajouter</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {canvasWidgets.map((w, i) => (
                        <motion.div
                          key={`${w}-${i}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="gal-card p-3 relative group"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Grip size={12} color="#4A4A5E" />
                            <span className="text-xs text-white">{w}</span>
                          </div>
                          <div className="h-16 rounded flex items-center justify-center" style={{ background: 'rgba(18,18,31,0.8)' }}>
                            <span className="text-xs" style={{ color: '#4A4A5E' }}>[Prévisualisation {w}]</span>
                          </div>
                          <button
                            onClick={() => removeFromCanvas(i)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} color="#EF4444" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Templates + Export Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Templates */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Modèles de Rapports</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t, i) => (
                <motion.div
                  key={t.name} custom={i} initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4, ease }}
                  className="gal-card p-3 group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <t.icon size={16} color="#06B6D4" />
                    <span className="text-sm font-medium text-white truncate">{t.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#4A4A5E' }}>{t.desc}</p>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(5,5,14,0.7)' }}>
                    <button className="btn-neon text-xs">Utiliser</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Export Settings */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
          <div className="gal-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Paramètres d'Export</h3>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: '#4A4A5E' }}>Format</label>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map(fmt => (
                  <button
                    key={fmt.key}
                    onClick={() => setSelectedFormat(fmt.key)}
                    className={selectedFormat === fmt.key ? 'gal-card p-3 text-left' : 'gal-card p-3 text-left'}
                    style={{
                      border: selectedFormat === fmt.key ? '1px solid #06B6D4' : '1px solid rgba(30,30,45,0.8)',
                      boxShadow: selectedFormat === fmt.key ? '0 0 8px rgba(6,182,212,0.2)' : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <fmt.icon size={16} color={selectedFormat === fmt.key ? '#06B6D4' : '#8B8B9E'} />
                      <span className="text-sm font-medium text-white">{fmt.label}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#4A4A5E' }}>{fmt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* White-label toggle */}
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(10,10,26,0.5)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">White-label</span>
                <div
                  onClick={() => setWhiteLabel(!whiteLabel)}
                  className="cursor-pointer"
                  style={{
                    width: 40, height: 20, borderRadius: 9999,
                    background: whiteLabel ? 'linear-gradient(135deg, #06B6D4, #8B5CF6)' : '#1E1E2D',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <motion.div
                    layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      width: 16, height: 16, borderRadius: '50%', background: 'white',
                      position: 'absolute', top: 2, left: whiteLabel ? 22 : 2,
                    }}
                  />
                </div>
              </div>
              <AnimatePresence>
                {whiteLabel && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-2 pt-2">
                      <input className="gal-input w-full text-sm" placeholder="Nom de l'entreprise" />
                      <input className="gal-input w-full text-sm" placeholder="Couleur principale (#06B6D4)" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-neon w-full flex items-center justify-center gap-2"
            >
              {generating ? <><Loader size={16} className="spin-slow" /> Génération en cours...</> : <><Download size={16} /> Générer et Envoyer</>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
