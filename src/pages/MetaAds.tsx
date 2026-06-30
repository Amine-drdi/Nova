import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Pointer,
  DollarSign,
  ShoppingBag,
  Plus,
  Pencil,
  Pause,
  Play,
  BarChart3,
  Crown,
  Eye,
  Users,
  Target,
  Layers,
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
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const platformPerformance = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  facebook: 420 + Math.sin(i * 0.25) * 150 + Math.random() * 80,
  instagram: 310 + Math.sin(i * 0.3) * 120 + Math.random() * 60,
  audience: 45 + Math.sin(i * 0.2) * 20 + Math.random() * 15,
}));

const platformDonutData = [
  { name: 'Facebook', value: 55, color: '#1877F2' },
  { name: 'Instagram', value: 38, color: '#8B5CF6' },
  { name: 'Audience Network', value: 7, color: '#EC4899' },
];

const campaignsData = [
  { id: 1, name: 'Lookalike V1', platform: 'FB+IG', status: 'active', budget: 100, clicks: 8421, ctr: 2.8, cpc: 0.89, conversions: 124, roas: 4.2 },
  { id: 2, name: 'Retargeting Panier', platform: 'FB', status: 'active', budget: 60, clicks: 5234, ctr: 4.1, cpc: 0.62, conversions: 89, roas: 5.1 },
  { id: 3, name: 'Stories Ete', platform: 'IG', status: 'active', budget: 40, clicks: 6891, ctr: 3.2, cpc: 0.41, conversions: 45, roas: 2.8 },
  { id: 4, name: 'Test Video', platform: 'FB+IG', status: 'paused', budget: 0, clicks: 0, ctr: 0, cpc: 0, conversions: 0, roas: 0 },
  { id: 5, name: 'Carousel Produits', platform: 'IG', status: 'active', budget: 75, clicks: 3456, ctr: 2.9, cpc: 0.95, conversions: 67, roas: 3.6 },
  { id: 6, name: 'Reels Promo', platform: 'IG', status: 'active', budget: 55, clicks: 4567, ctr: 3.8, cpc: 0.52, conversions: 78, roas: 4.5 },
  { id: 7, name: 'Lead Gen B2B', platform: 'FB', status: 'active', budget: 85, clicks: 2134, ctr: 2.1, cpc: 1.25, conversions: 92, roas: 3.2 },
  { id: 8, name: 'Black Friday', platform: 'FB+IG', status: 'ended', budget: 0, clicks: 12345, ctr: 5.2, cpc: 0.38, conversions: 234, roas: 6.8 },
];

const audiencesData = [
  { id: 1, name: 'Lookalike 1% Acheteurs', type: 'Lookalike', size: '245K', cpm: '€4.20', ctr: '3.2%', reach: 82, color: '#06B6D4' },
  { id: 2, name: 'Interets Marketing', type: 'Interet', size: '1.2M', cpm: '€3.80', ctr: '2.1%', reach: 65, color: '#8B5CF6' },
  { id: 3, name: 'Visiteurs 30j', type: 'Personnalisee', size: '89K', cpm: '€2.90', ctr: '4.5%', reach: 91, color: '#22C55E' },
  { id: 4, name: 'Panier abandonne', type: 'Retargeting', size: '12K', cpm: '€1.80', ctr: '8.2%', reach: 95, color: '#F59E0B' },
];

const creativesData = [
  { id: 1, format: 'Carousel', ctr: '4.2%', roas: 5.1, spend: '€420', top: true },
  { id: 2, format: 'Video', ctr: '3.8%', roas: 4.5, spend: '€380', top: false },
  { id: 3, format: 'Image', ctr: '2.9%', roas: 3.2, spend: '€290', top: false },
  { id: 4, format: 'Story', ctr: '3.5%', roas: 3.8, spend: '€310', top: false },
  { id: 5, format: 'Reel', ctr: '5.1%', roas: 4.8, spend: '€450', top: false },
  { id: 6, format: 'Carousel', ctr: '3.2%', roas: 3.5, spend: '€340', top: false },
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

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip-glass" style={{ padding: '10px 14px' }}>
      <p style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Jour {label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontSize: 11, margin: '2px 0' }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(0) : p.value}</p>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

export default function MetaAds() {
  const [activeMetric, setActiveMetric] = useState<'clicks' | 'conversions' | 'spend'>('clicks');

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
      {/* ---- HEADER ---- */}
      <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
            Meta Ads
          </h1>
          <p style={{ color: '#8B8B9E', fontSize: 13, marginTop: 6 }}>Facebook &amp; Instagram — Gerez vos campagnes sociales payantes</p>
        </div>
        <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Nouvelle Campagne
        </button>
      </motion.div>

      {/* ---- KPI ROW ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <CreditCard size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Depenses du mois</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>€3,200</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>€800 restants</span>
            <span style={{ color: '#4A4A5E', fontSize: 12 }}>Sur €4,000</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Pointer size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Clics</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>24,681</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+31.2%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Facebook + Instagram</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
              <DollarSign size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>CPM moyen</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>€4.82</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>-8%</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>En baisse</span>
          </div>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <ShoppingBag size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>ROAS</span>
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>3.8x</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+0.5x</span>
            <span style={{ color: '#8B8B9E', fontSize: 12 }}>Meilleur: Instagram</span>
          </div>
        </div>
      </motion.div>

      {/* ---- PERFORMANCE + PLATFORM DONUT ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Performance</h3>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 3 }}>
              {(['clicks', 'conversions', 'spend'] as const).map((m) => (
                <button key={m} onClick={() => setActiveMetric(m)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none',
                    background: activeMetric === m ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: activeMetric === m ? '#06B6D4' : '#8B8B9E',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  {m === 'clicks' ? 'Clics' : m === 'conversions' ? 'Conversions' : 'Depenses'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={platformPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
              <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />
              <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />
              <Line type="monotone" dataKey="audience" name="Audience Network" stroke="#EC4899" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Repartition par Plateforme</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={platformDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" isAnimationActive animationDuration={1000}>
                {platformDonutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: -10 }}>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>€3,200</div>
            <div style={{ fontSize: 11, color: '#8B8B9E' }}>Total depense</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
            {[
              { label: 'FB', clicks: '15.2K', ctr: '3.1%', roas: '3.5x' },
              { label: 'IG', clicks: '8.9K', ctr: '3.8%', roas: '4.2x' },
              { label: 'AN', clicks: '581', ctr: '1.9%', roas: '2.1x' },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{p.label}</div>
                <div style={{ fontSize: 10, color: '#8B8B9E' }}>{p.clicks}</div>
                <div style={{ fontSize: 10, color: '#06B6D4' }}>{p.ctr}</div>
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
            <span className="badge-glow-success">5 actives</span>
            <span className="badge-glow-warning">1 en pause</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gal-table">
            <thead>
              <tr>
                <th>Campagne</th>
                <th>Plateforme</th>
                <th>Statut</th>
                <th>Budget/j</th>
                <th>Clics</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>Conv.</th>
                <th>ROAS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td style={{ color: '#FFFFFF', fontWeight: 500 }}>{c.name}</td>
                  <td>
                    <span className="badge-glow-info" style={{ fontSize: 10 }}>{c.platform}</span>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.budget > 0 ? `€${c.budget}` : '—'}</td>
                  <td>{c.clicks > 0 ? c.clicks.toLocaleString('fr-FR') : '—'}</td>
                  <td>{c.ctr > 0 ? `${c.ctr}%` : '—'}</td>
                  <td>{c.cpc > 0 ? `€${c.cpc.toFixed(2)}` : '—'}</td>
                  <td>{c.conversions > 0 ? c.conversions : '—'}</td>
                  <td>{c.roas > 0 ? <span style={{ color: '#22C55E', fontWeight: 600 }}>{c.roas}x</span> : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}><Pencil size={14} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}>{c.status === 'active' ? <Pause size={14} /> : <Play size={14} />}</button>
                      <button style={{ background: 'transparent', border: 'none', color: '#8B8B9E', cursor: 'pointer', padding: 4 }}><BarChart3 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ---- AUDIENCES + CREATIVES ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Audiences */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Audiences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {audiencesData.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease }}
                style={{
                  padding: '14px 16px',
                  background: 'rgba(10, 10, 26, 0.5)',
                  borderRadius: 10,
                  borderLeft: `3px solid ${a.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>{a.name}</span>
                    <span className="badge-glow-info" style={{ fontSize: 9 }}>{a.type}</span>
                  </div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>{a.size} <span style={{ fontSize: 12, fontWeight: 400, color: '#8B8B9E' }}>personnes</span></div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: '#8B8B9E' }}>CPM: <span style={{ color: '#FFFFFF' }}>{a.cpm}</span></span>
                    <span style={{ fontSize: 11, color: '#8B8B9E' }}>CTR: <span style={{ color: '#FFFFFF' }}>{a.ctr}</span></span>
                  </div>
                  <div className="gal-progress-track" style={{ marginTop: 8 }}>
                    <motion.div
                      className="gal-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${a.reach}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease }}
                    />
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: 11 }}>Modifier</button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Creatives Grid */}
        <div className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Creatifs</h3>
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 11 }}>Ajouter</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {creativesData.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  position: 'relative',
                  background: 'rgba(10, 10, 26, 0.6)',
                  borderRadius: 10,
                  border: c.top ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid #1E1E2D',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {c.top && (
                  <div style={{
                    position: 'absolute', top: 8, left: 8, zIndex: 2,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Crown size={12} style={{ color: '#F59E0B' }} />
                    <span className="badge-glow-warning" style={{ fontSize: 9 }}>Top performer</span>
                  </div>
                )}
                <div style={{
                  height: 90,
                  background: `linear-gradient(135deg, ${c.top ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.08)'} 0%, rgba(10, 10, 26, 0.8) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Layers size={28} style={{ color: c.top ? '#F59E0B' : '#4A4A5E', opacity: 0.5 }} />
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge-glow-info" style={{ fontSize: 9 }}>{c.format}</span>
                    <span style={{ fontSize: 10, color: '#8B8B9E' }}>{c.spend}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#8B8B9E' }}>CTR</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{c.ctr}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#8B8B9E' }}>ROAS</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>{c.roas}x</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
