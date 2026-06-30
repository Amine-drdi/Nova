import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Plus,
  RefreshCw,
  Pencil,
  Pause,
  Play,
  BarChart3,
  Trash2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  impressions: 1200 + Math.sin(i * 0.3) * 400 + Math.random() * 300,
  clicks: 45 + Math.sin(i * 0.3) * 20 + Math.random() * 15,
  conversions: 3 + Math.sin(i * 0.4) * 2 + Math.random() * 3,
}));

const budgetDonutData = [
  { name: 'Ete 2024', value: 3600, color: '#06B6D4' },
  { name: 'Retargeting', value: 2400, color: '#8B5CF6' },
  { name: 'Marque', value: 1200, color: '#22C55E' },
  { name: 'Non alloue', value: 1200, color: '#4A4A5E' },
];

const campaignsData = [
  { id: 1, name: 'Ete 2024', status: 'active', budget: 120, clicks: 4821, impressions: 89432, ctr: 5.4, cpc: 0.72, conversions: 142 },
  { id: 2, name: 'Retargeting', status: 'active', budget: 80, clicks: 3124, impressions: 45678, ctr: 6.8, cpc: 0.58, conversions: 98 },
  { id: 3, name: 'Marque', status: 'active', budget: 40, clicks: 8901, impressions: 12456, ctr: 71.5, cpc: 0.22, conversions: 45 },
  { id: 4, name: 'Test IA', status: 'paused', budget: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0, conversions: 0 },
  { id: 5, name: 'Display Q2', status: 'active', budget: 60, clicks: 1876, impressions: 34200, ctr: 5.5, cpc: 0.95, conversions: 67 },
  { id: 6, name: 'Shopping', status: 'active', budget: 90, clicks: 2345, impressions: 28900, ctr: 8.1, cpc: 1.12, conversions: 89 },
  { id: 7, name: 'Video YouTube', status: 'ended', budget: 0, clicks: 4567, impressions: 156000, ctr: 2.9, cpc: 0.45, conversions: 34 },
  { id: 8, name: 'Remarketing', status: 'active', budget: 55, clicks: 1234, impressions: 22100, ctr: 5.6, cpc: 0.68, conversions: 56 },
];

const keywordsData = [
  { keyword: 'agence marketing IA', clicks: 1245, cpc: 1.25, conversions: 45, score: 9 },
  { keyword: 'expert SEO Paris', clicks: 987, cpc: 0.95, conversions: 32, score: 8 },
  { keyword: 'consultant digital', clicks: 876, cpc: 0.82, conversions: 28, score: 7 },
  { keyword: 'strategie contenu', clicks: 754, cpc: 0.65, conversions: 24, score: 8 },
  { keyword: 'automation marketing', clicks: 621, cpc: 1.45, conversions: 19, score: 6 },
  { keyword: 'SEO technique', clicks: 598, cpc: 0.72, conversions: 21, score: 9 },
  { keyword: 'growth hacking', clicks: 534, cpc: 0.88, conversions: 15, score: 7 },
  { keyword: 'analytics web', clicks: 412, cpc: 0.55, conversions: 12, score: 8 },
  { keyword: 'CRO optimisation', clicks: 389, cpc: 1.15, conversions: 18, score: 7 },
  { keyword: 'marketing B2B', clicks: 356, cpc: 0.92, conversions: 14, score: 6 },
];

const aiRecommendations = [
  { id: 1, type: 'opportunity', color: '#22C55E', icon: <TrendingUp size={16} />, text: "Augmenter l'enchere de +15% sur 'agence marketing IA' — volume en hausse", impact: '+12 conversions est.', action: 'Appliquer' },
  { id: 2, type: 'warning', color: '#F59E0B', icon: <AlertTriangle size={16} />, text: "Reduire le CPC de -20% sur 'expert SEO' — sur-enchere detectee", impact: 'Economie: €180/mois', action: 'Appliquer' },
  { id: 3, type: 'info', color: '#06B6D4', icon: <CheckCircle2 size={16} />, text: "Ajouter 5 mots-cles negatifs a la campagne 'Ete 2024'", impact: 'Qualite +15%', action: 'Voir' },
  { id: 4, type: 'opportunity', color: '#8B5CF6', icon: <Sparkles size={16} />, text: "Creer une extension d'image pour la campagne 'Marque'", impact: 'CTR +25%', action: 'Creer' },
];

/* ------------------------------------------------------------------ */
/*  HELPER COMPONENTS                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    active: { cls: 'badge-glow-success', label: 'Active' },
    paused: { cls: 'badge-glow-warning', label: 'En pause' },
    ended: { cls: 'badge-glow-neutral', label: 'Terminee' },
  };
  const { cls, label } = map[status] || map.ended;
  return (
    <span className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {status === 'active' && <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />}
      {label}
    </span>
  );
}

function QualityBadge({ score }: { score: number }) {
  let cls = 'badge-glow-error';
  if (score >= 8) cls = 'badge-glow-success';
  else if (score >= 5) cls = 'badge-glow-warning';
  return <span className={cls}>{score}/10</span>;
}

/* ------------------------------------------------------------------ */
/*  CHART TOOLTIP                                                      */
/* ------------------------------------------------------------------ */

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip-glass" style={{ padding: '10px 14px' }}>
      <p style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Jour {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontSize: 11, margin: '2px 0' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function GoogleAds() {
  const [activeMetric, setActiveMetric] = useState<'clicks' | 'impressions' | 'conversions'>('clicks');

  const totalBudget = 6000;
  const spentBudget = 4800;
  const budgetPct = (spentBudget / totalBudget) * 100;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
      {/* ---- PAGE HEADER ---- */}
      <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
            Google Ads
          </h1>
          <p style={{ color: '#8B8B9E', fontSize: 13, marginTop: 6 }}>Gerez vos campagnes payantes et optimisez vos encheres</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px' }}>
            <RefreshCw size={14} /> Synchroniser
          </button>
          <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Nouvelle Campagne
          </button>
        </div>
      </motion.div>

      {/* ---- KPI ROW ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {/* Budget */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <Wallet size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Budget mensuel</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            €4,800
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>€1,200 restants</span>
            <span style={{ color: '#4A4A5E', fontSize: 12 }}>sur €6,000</span>
          </div>
          <div className="gal-progress-track" style={{ marginTop: 12 }}>
            <motion.div
              className="gal-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 1, ease }}
            />
          </div>
        </div>

        {/* Clics */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <MousePointerClick size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Clics totaux</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            18,452
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+22.4%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Ce mois</span>
          </div>
        </div>

        {/* CPC */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
              <TrendingDown size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>CPC moyen</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            €0.84
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>-12%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>En baisse</span>
          </div>
        </div>

        {/* ROAS */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <TrendingUp size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>ROAS</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            4.2x
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+0.8x</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Retour sur investissement</span>
          </div>
        </div>
      </motion.div>

      {/* ---- PERFORMANCE + BUDGET ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        {/* Performance Line Chart */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Performance</h3>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 3 }}>
              {(['clicks', 'impressions', 'conversions'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: activeMetric === m ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeMetric === m ? '#06B6D4' : '#8B8B9E',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {m === 'clicks' ? 'Clics' : m === 'impressions' ? 'Impressions' : 'Conversions'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
              {activeMetric === 'clicks' && <Line type="monotone" dataKey="clicks" name="Clics" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />}
              {activeMetric === 'impressions' && <Line type="monotone" dataKey="impressions" name="Impressions" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />}
              {activeMetric === 'conversions' && <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#22C55E" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Donut */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Repartition du Budget</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetDonutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                isAnimationActive
                animationDuration={1000}
              >
                {budgetDonutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: -20 }}>
            <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>€6,000</div>
            <div style={{ fontSize: 12, color: '#8B8B9E' }}>Budget total mensuel</div>
          </div>
        </div>
      </motion.div>

      {/* ---- CAMPAIGNS TABLE ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Campagnes</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge-glow-success">3 actives</span>
            <span className="badge-glow-warning">1 en pause</span>
            <span className="badge-glow-neutral">1 terminee</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gal-table">
            <thead>
              <tr>
                <th>Campagne</th>
                <th>Statut</th>
                <th>Budget/jour</th>
                <th>Clics</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>Conversions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <td style={{ color: '#FFFFFF', fontWeight: 500 }}>{c.name}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.budget > 0 ? `€${c.budget}` : '—'}</td>
                  <td>{c.clicks > 0 ? c.clicks.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.impressions > 0 ? c.impressions.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                  <td>{c.cpc > 0 ? `€${c.cpc.toFixed(2)}` : '—'}</td>
                  <td>{c.conversions > 0 ? c.conversions : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}><Pencil size={14} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}>{c.status === 'active' ? <Pause size={14} /> : <Play size={14} />}</button>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}><BarChart3 size={14} /></button>
                      {c.status === 'paused' && <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ---- KEYWORDS + AD PREVIEWS ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Top Keywords */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Mots-cles Performants</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="gal-table">
              <thead>
                <tr>
                  <th>Mot-cle</th>
                  <th>Clics</th>
                  <th>CPC</th>
                  <th>Conv.</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {keywordsData.map((k, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ color: '#FFFFFF', fontWeight: 500, fontSize: 12 }}>{k.keyword}</td>
                    <td>{k.clicks.toLocaleString('fr-FR')}</td>
                    <td>€{k.cpc.toFixed(2)}</td>
                    <td>{k.conversions}</td>
                    <td><QualityBadge score={k.score} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ad Previews */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Annonces</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { url: 'www.lnr-finance.fr/agence-marketing', title: 'Agence Marketing IA — LNR Finance', desc: 'Boostez votre croissance avec notre IA proprietaire. Resultats garantis des le premier mois.', ctr: '5.4%' },
              { url: 'www.lnr-finance.fr/expert-seo', title: 'Expert SEO Paris | LNR Finance', desc: 'Audit SEO gratuit. Premier page Google en 90 jours. Devis personnalise.', ctr: '6.8%' },
              { url: 'www.lnr-finance.fr/strategie-digitale', title: 'Strategie Digitale Complete', desc: 'SEO, SEA, Social Media & Email. Une equipe dediee pour votre croissance.', ctr: '4.2%' },
            ].map((ad, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(10, 10, 26, 0.6)',
                  borderRadius: 8,
                  padding: 14,
                  border: '1px solid #1E1E2D',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="badge-glow-warning" style={{ fontSize: 9, padding: '2px 6px' }}>Annonce</span>
                  <span style={{ color: '#22C55E', fontSize: 11 }}>{ad.url}</span>
                </div>
                <div style={{ color: '#3B82F6', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ad.title}</div>
                <div style={{ color: '#8B8B9E', fontSize: 12, lineHeight: 1.4 }}>{ad.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span className="badge-glow-info">CTR: {ad.ctr}</span>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Modifier</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---- AI BIDDING RECOMMENDATIONS ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ color: '#06B6D4' }}
          >
            <Sparkles size={20} />
          </motion.div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Opportunites d&apos;Encheres</h3>
          <span className="badge-glow-info" style={{ marginLeft: 'auto', fontSize: 10 }}>AI Powered</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {aiRecommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: 'rgba(10, 10, 26, 0.5)',
                borderRadius: 10,
                borderLeft: `3px solid ${rec.color}`,
              }}
            >
              <div style={{ color: rec.color }}>{rec.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>{rec.text}</div>
                <div style={{ color: '#8B8B9E', fontSize: 11, marginTop: 2 }}>{rec.impact}</div>
              </div>
              <button
                className={rec.action === 'Voir' || rec.action === 'Creer' ? 'btn-secondary' : 'btn-neon'}
                style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {rec.action} <ChevronRight size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
