import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import {
  MapPin, Store, Phone, Star, Eye, TrendingUp, TrendingDown,
  ChevronDown, ChevronUp, Check, Send, X, MessageSquare,
  ThumbsUp, ThumbsDown, Minus, AlertCircle, Plus, Clock,
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

// GBP traffic evolution (90 days)
const gbpTrafficData = Array.from({ length: 30 }, (_, i) => ({
  day: `J${i + 1}`,
  directes: 120 + Math.floor(Math.sin(i * 0.2) * 30 + Math.random() * 20),
  decouverte: 85 + Math.floor(Math.cos(i * 0.15) * 25 + Math.random() * 15),
  actions: 45 + Math.floor(Math.sin(i * 0.1) * 15 + Math.random() * 10),
}));

// Local rankings by city
const localKeywords = [
  { keyword: 'télésecrétariat Paris', paris: 2, lyon: 5, marseille: 4, bordeaux: 6, lille: 7 },
  { keyword: 'assistante virtuelle France', paris: 3, lyon: 3, marseille: 5, bordeaux: 4, lille: 5 },
  { keyword: 'BPO centre d\'appel', paris: 1, lyon: 4, marseille: 3, bordeaux: 5, lille: 6 },
  { keyword: 'secrétariat à distance', paris: 4, lyon: 6, marseille: 7, bordeaux: 8, lille: 9 },
  { keyword: 'externalisation administrative', paris: 5, lyon: 7, marseille: 6, bordeaux: 7, lille: 8 },
  { keyword: 'call center francophone', paris: 2, lyon: 5, marseille: 4, bordeaux: 5, lille: 6 },
  { keyword: 'saisie de données externalisée', paris: 6, lyon: 8, marseille: 9, bordeaux: 10, lille: 11 },
  { keyword: 'back office offshore', paris: 3, lyon: 6, marseille: 5, bordeaux: 6, lille: 7 },
];

// Reviews
const reviewsData = [
  { id: 1, author: 'Marie D.', platform: 'Google', rating: 5, date: '18 juin 2025', text: 'Excellent service de télésecrétariat ! L\'équipe de LNR Finance est réactive et professionnelle. Je recommande vivement pour toute externalisation administrative.', sentiment: 'positive' as const, reply: '' },
  { id: 2, author: 'Jean-Pierre L.', platform: 'Google', rating: 4, date: '15 juin 2025', text: 'Très satisfait de la qualité du service. L\'assistante virtuelle assignede parle parfaitement français et est très efficace.', sentiment: 'positive' as const, reply: '' },
  { id: 3, author: 'Sophie M.', platform: 'Facebook', rating: 5, date: '12 juin 2025', text: 'Nous avons externalisé notre service client avec LNR Finance. Résultat impeccable, nos clients sont satisfaits.', sentiment: 'positive' as const, reply: '' },
  { id: 4, author: 'Philippe R.', platform: 'Google', rating: 3, date: '10 juin 2025', text: 'Bon service dans l\'ensemble. Quelques délais de mise en route au début mais maintenant tout fonctionne bien.', sentiment: 'neutral' as const, reply: '' },
  { id: 5, author: 'Claire B.', platform: 'TripAdvisor', rating: 4, date: '8 juin 2025', text: 'Service client très professionnel. L\'équipe tunisienne maîtrise parfaitement la langue française.', sentiment: 'positive' as const, reply: '' },
  { id: 6, author: 'Nicolas T.', platform: 'Google', rating: 2, date: '5 juin 2025', text: 'Le service est correct mais j\'ai eu des difficultés à contacter le support technique. À améliorer.', sentiment: 'negative' as const, reply: '' },
];

// Action checklist
const initialActions = [
  { id: 1, text: 'Mettre à jour les horaires d\'été', done: false, due: '3j', priority: 'warning' as const },
  { id: 2, text: 'Ajouter 5 photos au profil Paris', done: true, due: '', priority: 'success' as const },
  { id: 3, text: 'Répondre aux 3 avis non traités', done: false, due: '7j', priority: 'warning' as const },
  { id: 4, text: 'Publier un post Q&A', done: true, due: '', priority: 'success' as const },
  { id: 5, text: 'Ajouter un produit/service', done: false, due: '14j', priority: 'neutral' as const },
  { id: 6, text: 'Vérifier la cohérence NAP', done: false, due: '7j', priority: 'error' as const },
  { id: 7, text: 'Optimiser la description GBP Lyon', done: false, due: '5j', priority: 'warning' as const },
  { id: 8, text: 'Demander 5 nouveaux avis clients', done: false, due: '10j', priority: 'neutral' as const },
];

// Local competitors
const localCompetitors = [
  { name: 'LNR Finance', rating: 4.7, reviews: 486, photos: 52, posts: 4.2, visibility: 78, isYou: true },
  { name: 'Secretera Pro', rating: 4.3, reviews: 312, photos: 28, posts: 2.1, visibility: 65, isYou: false },
  { name: 'VirtualOffice France', rating: 4.9, reviews: 891, photos: 78, posts: 6.3, visibility: 92, isYou: false },
  { name: 'CallCenter Tunisie', rating: 3.8, reviews: 124, photos: 15, posts: 0.8, visibility: 41, isYou: false },
  { name: 'Assist\'Remote', rating: 4.1, reviews: 203, photos: 22, posts: 1.5, visibility: 58, isYou: false },
];

// Locations
const locations = [
  { name: 'Showroom Paris 8e', address: '15 Av. des Champs-Élysées, 75008 Paris', status: 'active' as const },
  { name: 'Agence Lyon', address: '42 Rue de la République, 69002 Lyon', status: 'active' as const },
  { name: 'Bureau Marseille', address: '7 La Canebière, 13001 Marseille', status: 'pending' as const },
];

/* ── Helpers ── */
function getPosColor(pos: number) {
  if (pos <= 3) return '#22C55E';
  if (pos <= 10) return '#06B6D4';
  return '#F59E0B';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} fill={i <= rating ? '#F59E0B' : 'none'} color={i <= rating ? '#F59E0B' : '#4A4A5E'} />
      ))}
    </div>
  );
}

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

/* ── Main Geo Page ── */
export default function Geo() {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [actions, setActions] = useState(initialActions);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const toggleAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const completedCount = actions.filter(a => a.done).length;
  const progress = (completedCount / actions.length) * 100;

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
            <MapPin size={28} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: '#06B6D4' }} />
            SEO Local — Géo
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8B8B9E', margin: '8px 0 0', lineHeight: 1.5 }}>
            Optimisez votre visibilité dans les recherches géolocalisées
          </p>
        </div>
        <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} />
          Paris, 75008
        </button>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <KpiCard icon={<Store size={20} />} iconBg="rgba(6, 182, 212, 0.1)" iconColor="#06B6D4" label="Visites GBP" value="12,847" delta="+22.1%" deltaPositive subLabel="Ce mois" index={0} />
        <KpiCard icon={<Phone size={20} />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8B5CF6" label="Appels" value="1,243" delta="+15.8%" deltaPositive subLabel="Depuis GBP" index={1} />
        <KpiCard icon={<Star size={20} />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" label="Avis" value="486" delta="+12" deltaPositive subLabel="4.7/5 moyenne" index={2} />
        <KpiCard icon={<Eye size={20} />} iconBg="rgba(236, 72, 153, 0.1)" iconColor="#EC4899" label="Score de Visibilité" value="78/100" delta="+5" deltaPositive subLabel="Local Pack" index={3} />
      </motion.div>

      {/* ── Local Rankings + Locations ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Local Rankings Table */}
        <motion.div variants={fadeUp} custom={4} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Classement Local par Ville</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="gal-table">
              <thead>
                <tr>
                  <th>Mot-clé local</th>
                  <th style={{ textAlign: 'center' }}>Paris</th>
                  <th style={{ textAlign: 'center' }}>Lyon</th>
                  <th style={{ textAlign: 'center' }}>Marseille</th>
                  <th style={{ textAlign: 'center' }}>Bordeaux</th>
                  <th style={{ textAlign: 'center' }}>Lille</th>
                </tr>
              </thead>
              <tbody>
                {localKeywords.map((kw, i) => (
                  <motion.tr key={kw.keyword} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ fontWeight: 500, color: '#FFFFFF', minWidth: 180 }}>{kw.keyword}</td>
                    {([kw.paris, kw.lyon, kw.marseille, kw.bordeaux, kw.lille] as number[]).map((pos, j) => (
                      <td key={j} style={{ textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: getPosColor(pos) }}>
                        {pos}
                        {j === 0 && (
                          <span style={{ marginLeft: 4, fontSize: 10 }}>
                            {pos <= 3 ? <ArrowUp size={10} style={{ display: 'inline', color: '#22C55E' }} /> : pos <= 6 ? <Minus size={10} style={{ display: 'inline', color: '#8B8B9E' }} /> : <ArrowDown size={10} style={{ display: 'inline', color: '#F59E0B' }} />}
                          </span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Locations Card */}
        <motion.div variants={fadeUp} custom={5} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Vos Établissements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  padding: 14,
                  background: 'rgba(10, 10, 26, 0.8)',
                  borderRadius: 10,
                  border: '1px solid rgba(30, 30, 45, 0.8)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: loc.status === 'active' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MapPin size={16} color={loc.status === 'active' ? '#06B6D4' : '#F59E0B'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 13 }}>{loc.name}</span>
                    <span className={loc.status === 'active' ? 'badge-glow-success' : 'badge-glow-warning'} style={{ fontSize: 10, padding: '2px 8px' }}>
                      {loc.status === 'active' ? 'Actif' : 'Config. requise'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#8B8B9E', marginTop: 2 }}>{loc.address}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mini map placeholder */}
          <div style={{
            marginTop: 16, height: 160, borderRadius: 10, background: 'linear-gradient(135deg, #0A0A1A, #12121F)',
            border: '1px solid rgba(30, 30, 45, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '2px dashed rgba(6, 182, 212, 0.2)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '1px dashed rgba(139, 92, 246, 0.15)', top: '40%', left: '45%' }} />
            {/* Map pins */}
            {[{ top: '35%', left: '48%', color: '#06B6D4', label: 'Paris' }, { top: '50%', left: '55%', color: '#8B5CF6', label: 'Lyon' }, { top: '65%', left: '60%', color: '#F59E0B', label: 'Marseille' }].map((pin, i) => (
              <motion.div
                key={pin.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.2, type: 'spring', stiffness: 200 }}
                style={{ position: 'absolute', top: pin.top, left: pin.left, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className="pulse-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: pin.color, boxShadow: `0 0 12px ${pin.color}80` }} />
                <span style={{ fontSize: 9, color: '#8B8B9E', marginTop: 2 }}>{pin.label}</span>
              </motion.div>
            ))}
            <span style={{ fontSize: 11, color: '#4A4A5E' }}>Carte interactive</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── GBP Traffic Chart ── */}
      <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Visites Google Business Profile</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={gbpTrafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
            <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(18, 18, 31, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8 }}
              labelStyle={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              itemStyle={{ color: '#8B8B9E', fontFamily: "'Inter', sans-serif", fontSize: 12 }}
            />
            <Bar dataKey="directes" name="Recherches directes" fill="#06B6D4" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
            <Bar dataKey="decouverte" name="Recherches découverte" fill="#8B5CF6" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} animationBegin={200} />
            <Line type="monotone" dataKey="actions" name="Total actions" stroke="#EC4899" strokeWidth={2} dot={false} isAnimationActive animationDuration={1200} animationBegin={400} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Reviews + Action Checklist ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Reviews */}
        <motion.div variants={fadeUp} custom={7} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Avis Récents</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Tous', 'Google', 'Facebook'].map(f => (
                <button key={f} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480, overflowY: 'auto' }}>
            {reviewsData.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ padding: 12, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 10, border: '1px solid rgba(30, 30, 45, 0.8)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, color: '#FFFFFF',
                  }}>
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#FFFFFF' }}>{review.author}</span>
                      <span className="badge-glow-neutral" style={{ fontSize: 10, padding: '2px 8px' }}>{review.platform}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <StarRating rating={review.rating} />
                      <span style={{ fontSize: 11, color: '#4A4A5E' }}>{review.date}</span>
                    </div>
                  </div>
                  <span className={review.sentiment === 'positive' ? 'badge-glow-success' : review.sentiment === 'neutral' ? 'badge-glow-warning' : 'badge-glow-error'} style={{ fontSize: 10, padding: '2px 8px' }}>
                    {review.sentiment === 'positive' ? 'Positif' : review.sentiment === 'neutral' ? 'Neutre' : 'Négatif'}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#8B8B9E', lineHeight: 1.5, margin: '0 0 8px' }}>
                  {review.text.length > 100 && expandedReview !== review.id ? review.text.slice(0, 100) + '...' : review.text}
                  {review.text.length > 100 && (
                    <button onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)} style={{ background: 'none', border: 'none', color: '#06B6D4', cursor: 'pointer', fontSize: 11 }}>
                      {expandedReview === review.id ? ' Voir moins' : ' Voir plus'}
                    </button>
                  )}
                </p>
                {replyingTo === review.id ? (
                  <AnimatePresence>
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Votre réponse..."
                        className="gal-input"
                        style={{ width: '100%', minHeight: 60, resize: 'vertical', fontSize: 12 }}
                      />
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setReplyingTo(null)}>Annuler</button>
                        <button className="btn-neon" style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setReplyingTo(null)}>
                          <Send size={12} /> Envoyer
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <MessageSquare size={12} /> Répondre
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Checklist */}
        <motion.div variants={fadeUp} custom={8} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Actions à Suivre</h3>
            <span className="badge-glow-info" style={{ fontSize: 11 }}>{completedCount}/{actions.length}</span>
          </div>
          {/* Progress bar */}
          <div className="gal-progress-track" style={{ marginBottom: 16, height: 8 }}>
            <motion.div
              className="gal-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: action.done ? 'rgba(34, 197, 94, 0.05)' : 'rgba(10, 10, 26, 0.8)',
                  borderRadius: 8, border: '1px solid rgba(30, 30, 45, 0.8)',
                  opacity: action.done ? 0.7 : 1,
                }}
              >
                <button
                  onClick={() => toggleAction(action.id)}
                  style={{
                    width: 20, height: 20, borderRadius: 5, border: action.done ? '2px solid #22C55E' : '2px solid #4A4A5E',
                    background: action.done ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease',
                  }}
                >
                  {action.done && <Check size={14} color="#FFFFFF" />}
                </button>
                <span style={{
                  flex: 1, fontSize: 13,
                  color: action.done ? '#4A4A5E' : '#FFFFFF',
                  textDecoration: action.done ? 'line-through' : 'none',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {action.text}
                </span>
                {action.due && (
                  <span className={action.priority === 'warning' ? 'badge-glow-warning' : action.priority === 'error' ? 'badge-glow-error' : 'badge-glow-neutral'} style={{ fontSize: 10, padding: '2px 8px' }}>
                    <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                    {action.due}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Local Competitors ── */}
      <motion.div variants={fadeUp} custom={9} className="gal-card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>Concurrents Locaux</h3>
        <table className="gal-table">
          <thead>
            <tr>
              <th>Concurrent</th>
              <th>Note</th>
              <th>Avis</th>
              <th>Photos</th>
              <th>Posts/mois</th>
              <th>Visibilité</th>
            </tr>
          </thead>
          <tbody>
            {localCompetitors.map((comp, i) => (
              <motion.tr
                key={comp.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={comp.isYou ? { borderLeft: '3px solid #06B6D4', background: 'rgba(6, 182, 212, 0.04)' } : {}}
              >
                <td style={{ fontWeight: 600, color: comp.isYou ? '#06B6D4' : '#FFFFFF' }}>
                  {comp.name} {comp.isYou && <span className="badge-glow-info" style={{ fontSize: 10, marginLeft: 6 }}>Vous</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{comp.rating}</span>
                  </div>
                </td>
                <td>{comp.reviews}</td>
                <td>{comp.photos}</td>
                <td>{comp.posts}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(74, 74, 94, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${comp.visibility}%`, height: '100%', background: comp.visibility >= 80 ? 'linear-gradient(90deg, #22C55E, #06B6D4)' : comp.visibility >= 60 ? 'linear-gradient(90deg, #06B6D4, #8B5CF6)' : 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 12, color: '#FFFFFF' }}>{comp.visibility}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
