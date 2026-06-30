import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Heart,
  Eye,
  FileImage,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2 as ShareIcon,
  Bookmark,
  BarChart3,
  ThumbsUp,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Clock,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from 'recharts';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  PLATFORMS CONFIG                                                   */
/* ------------------------------------------------------------------ */

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={18} />, connected: true },
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={18} />, connected: true },
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={18} />, connected: true },
  { id: 'twitter', name: 'Twitter', icon: <Twitter size={18} />, connected: true },
  { id: 'tiktok', name: 'TikTok', icon: <Layers size={18} />, connected: false },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={18} />, connected: true },
];

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const followersGrowth = Array.from({ length: 90 }, (_, i) => ({
  day: `${i + 1}`,
  abonnes: 20000 + i * 52 + Math.sin(i * 0.15) * 300 + Math.random() * 100,
  desabonnements: 20 + Math.sin(i * 0.3) * 15 + Math.random() * 10,
}));

const engagementByType = [
  { type: 'Carrousel', likes: 452, comments: 89, shares: 45, saves: 78 },
  { type: 'Image', likes: 321, comments: 56, shares: 32, saves: 45 },
  { type: 'Video', likes: 678, comments: 134, shares: 89, saves: 56 },
  { type: 'Reel/Short', likes: 892, comments: 167, shares: 123, saves: 92 },
  { type: 'Texte', likes: 189, comments: 78, shares: 56, saves: 23 },
];

const calendarDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const calendarSlots = [
  [
    { time: '09:00', title: 'Post inspiration', platform: 'linkedin', status: 'published' },
    { time: '14:00', title: 'Carousel tips SEO', platform: 'instagram', status: 'scheduled' },
    { time: '17:00', title: 'Story quotidienne', platform: 'instagram', status: 'draft' },
  ],
  [
    { time: '10:00', title: 'Article blog promo', platform: 'facebook', status: 'published' },
    { time: '15:00', title: 'Video tuto', platform: 'youtube', status: 'scheduled' },
    { time: null, title: null, platform: null, status: null },
  ],
  [
    { time: '09:30', title: 'Statistiques secteur', platform: 'linkedin', status: 'published' },
    { time: '13:00', title: 'Reel tendance', platform: 'instagram', status: 'scheduled' },
    { time: '18:00', title: 'Thread Twitter', platform: 'twitter', status: 'draft' },
  ],
  [
    { time: '11:00', title: 'Temoignage client', platform: 'facebook', status: 'published' },
    { time: '16:00', title: 'Short IA marketing', platform: 'youtube', status: 'scheduled' },
    { time: null, title: null, platform: null, status: null },
  ],
  [
    { time: '09:00', title: 'Infographie veille', platform: 'linkedin', status: 'scheduled' },
    { time: '14:30', title: 'Story sondage', platform: 'instagram', status: 'scheduled' },
    { time: '17:00', title: 'Post engageant', platform: 'twitter', status: 'draft' },
  ],
  [
    { time: '10:00', title: 'Behind the scenes', platform: 'instagram', status: 'scheduled' },
    { time: null, title: null, platform: null, status: null },
    { time: null, title: null, platform: null, status: null },
  ],
  [
    { time: '11:00', title: 'Weekly recap', platform: 'linkedin', status: 'draft' },
    { time: null, title: null, platform: null, status: null },
    { time: null, title: null, platform: null, status: null },
  ],
];

const recentPosts = [
  { id: 1, caption: '5 astuces SEO pour doubler votre trafic en 30 jours. Thread complet ci-dessous 👇', platform: 'linkedin', likes: 423, comments: 67, shares: 89, date: 'Il y a 2h' },
  { id: 2, caption: 'Notre nouvelle fonctionnalite IA est en ligne ! Decouvrez comment elle revolutionne...', platform: 'instagram', likes: 892, comments: 134, shares: 45, date: 'Il y a 5h' },
  { id: 3, caption: 'Pourquoi le marketing de contenu est essentiel en B2B ? On vous explique tout.', platform: 'twitter', likes: 234, comments: 45, shares: 78, date: 'Il y a 8h' },
  { id: 4, caption: 'Tutoriel complet : configurer vos campagnes Google Ads en 2024', platform: 'youtube', likes: 1234, comments: 234, shares: 156, date: 'Hier' },
  { id: 5, caption: 'Les tendances digitales du mois de juin : ce qu\'il faut retenir', platform: 'facebook', likes: 345, comments: 56, shares: 34, date: 'Hier' },
];

const platformColors: Record<string, string> = {
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  instagram: '#8B5CF6',
  twitter: '#8B8B9E',
  youtube: '#FF0000',
  tiktok: '#EC4899',
};

const statusColors: Record<string, { bg: string; border: string; label: string }> = {
  published: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', label: 'Publié' },
  scheduled: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', label: 'Planifié' },
  draft: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', label: 'Brouillon' },
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };
const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

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
/*  SENTIMENT GAUGE                                                    */
/* ------------------------------------------------------------------ */

function SentimentGauge({ score }: { score: number }) {
  const radius = 70;
  const startAngle = 180;
  const endAngle = 0;
  const totalAngle = startAngle - endAngle;
  const currentAngle = startAngle - (score / 100) * totalAngle;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(angleRad), y: cy - r * Math.sin(angleRad) };
  };

  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startPt = polarToCartesian(cx, cy, r, start);
    const endPt = polarToCartesian(cx, cy, r, end);
    const largeArc = end - start <= 180 ? 0 : 1;
    return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
  };

  const needleEnd = polarToCartesian(100, 90, 60, currentAngle);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="200" height="100" viewBox="0 0 200 100">
        <path d={describeArc(100, 90, 70, 180, 0)} fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth="12" strokeLinecap="round" />
        <path d={describeArc(100, 90, 70, 180, 120)} fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="12" strokeLinecap="round" />
        <path d={describeArc(100, 90, 70, 120, 60)} fill="none" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="12" strokeLinecap="round" />
        <path d={describeArc(100, 90, 70, 60, 0)} fill="none" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="12" strokeLinecap="round" />
        <motion.line
          x1="100" y1="90" x2={needleEnd.x} y2={needleEnd.y}
          stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"
          initial={{ x2: polarToCartesian(100, 90, 60, 180).x, y2: polarToCartesian(100, 90, 60, 180).y }}
          animate={{ x2: needleEnd.x, y2: needleEnd.y }}
          transition={{ duration: 1.2, ease }}
        />
        <circle cx="100" cy="90" r="5" fill="#FFFFFF" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: 160, marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#EF4444' }}>Negatif</span>
        <span style={{ fontSize: 10, color: '#F59E0B' }}>Neutre</span>
        <span style={{ fontSize: 10, color: '#22C55E' }}>Positif</span>
      </div>
      <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginTop: 12 }}>{score}%</div>
      <span className="badge-glow-success">Positif</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

export default function Social() {
  const [activePlatform, setActivePlatform] = useState('linkedin');

  const platformData = {
    linkedin: { abonnes: '18,452', engagement: '3.8%', portee: '6,234', publications: '12' },
    facebook: { abonnes: '24,681', engagement: '4.2%', portee: '8,421', publications: '18' },
    instagram: { abonnes: '31,245', engagement: '5.6%', portee: '12,890', publications: '24' },
    twitter: { abonnes: '8,921', engagement: '2.4%', portee: '3,456', publications: '45' },
    tiktok: { abonnes: '—', engagement: '—', portee: '—', publications: '—' },
    youtube: { abonnes: '12,678', engagement: '6.2%', portee: '15,234', publications: '6' },
  };

  const currentData = platformData[activePlatform as keyof typeof platformData];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
      {/* ---- HEADER ---- */}
      <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
            Social Media
          </h1>
          <p style={{ color: '#8B8B9E', fontSize: 13, marginTop: 6 }}>Gerez votre presence sur tous les reseaux sociaux</p>
        </div>
        <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarPlus size={14} /> Planifier une Publication
        </button>
      </motion.div>

      {/* ---- PLATFORM TABS ---- */}
      <motion.div variants={staggerItem} style={{
        display: 'flex',
        gap: 4,
        background: 'rgba(18, 18, 31, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(30, 30, 45, 0.8)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
      }}>
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: activePlatform === p.id ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: activePlatform === p.id ? '#06B6D4' : p.connected ? '#8B8B9E' : '#4A4A5E',
              fontSize: 13,
              fontWeight: activePlatform === p.id ? 600 : 500,
              cursor: p.connected ? 'pointer' : 'not-allowed',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            {p.icon}
            <span>{p.name}</span>
            {p.connected ? (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            ) : (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A4A5E', display: 'inline-block' }} />
            )}
          </button>
        ))}
      </motion.div>

      {/* ---- KPI ROW (per platform) ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}
        >
          <div className="gal-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
                <Users size={20} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Abonnes</span>
            </div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{currentData.abonnes}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+1,234 ce mois</span>
            </div>
          </div>

          <div className="gal-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
                <Heart size={20} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Engagement</span>
            </div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{currentData.engagement}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+0.3%</span>
              <span style={{ color: '#8B8B9E', fontSize: 12 }}>Moyenne: 3.8%</span>
            </div>
          </div>

          <div className="gal-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                <Eye size={20} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Portee moyenne</span>
            </div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{currentData.portee}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ color: '#22C55E', fontSize: 13, fontWeight: 600 }}>+12%</span>
              <span style={{ color: '#8B8B9E', fontSize: 12 }}>Par publication</span>
            </div>
          </div>

          <div className="gal-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                <FileImage size={20} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8B8B9E' }}>Publications ce mois</span>
            </div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF' }}>{currentData.publications}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <span style={{ color: '#8B8B9E', fontSize: 12 }}>6 planifiees</span>
              <span style={{ color: '#4A4A5E', fontSize: 12 }}>2 par semaine</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ---- GROWTH + ENGAGEMENT ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Croissance</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={followersGrowth}>
              <defs>
                <linearGradient id="growthCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="day" tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
              <Area type="monotone" dataKey="abonnes" name="Abonnes" stroke="#06B6D4" fill="url(#growthCyan)" strokeWidth={2} isAnimationActive animationDuration={1500} />
              <Area type="monotone" dataKey="desabonnements" name="Desabonnements" stroke="#EF4444" fill="transparent" strokeWidth={1} strokeDasharray="4 4" isAnimationActive animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Engagement par Type</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={engagementByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis dataKey="type" tick={{ fill: '#4A4A5E', fontSize: 10 }} axisLine={{ stroke: '#1E1E2D' }} />
              <YAxis tick={{ fill: '#4A4A5E', fontSize: 11 }} axisLine={{ stroke: '#1E1E2D' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
              <Bar dataKey="likes" name="J'aime" fill="#EC4899" radius={[4, 4, 0, 0]} isAnimationActive />
              <Bar dataKey="comments" name="Commentaires" fill="#06B6D4" radius={[4, 4, 0, 0]} isAnimationActive />
              <Bar dataKey="shares" name="Partages" fill="#8B5CF6" radius={[4, 4, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ---- CONTENT CALENDAR ---- */}
      <motion.div variants={staggerItem} className="gal-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Calendrier de Contenu</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'transparent', border: '1px solid #1E1E2D', borderRadius: 8, padding: '6px 10px', color: '#8B8B9E', cursor: 'pointer' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>Semaine du 17 - 23 juin</span>
            <button style={{ background: 'transparent', border: '1px solid #1E1E2D', borderRadius: 8, padding: '6px 10px', color: '#8B8B9E', cursor: 'pointer' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {calendarDays.map((day, dayIdx) => (
            <div key={day} style={{ minWidth: 0 }}>
              <div style={{
                textAlign: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #1E1E2D',
                marginBottom: 10,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}>{day}</div>
                <div style={{ fontSize: 10, color: '#4A4A5E' }}>{17 + dayIdx} juin</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {calendarSlots[dayIdx].map((slot, slotIdx) => (
                  <div key={slotIdx}>
                    {slot.title ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayIdx * 0.03 + slotIdx * 0.03 }}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          background: statusColors[slot.status]?.bg || 'rgba(10, 10, 26, 0.5)',
                          border: `1px solid ${statusColors[slot.status]?.border || '#1E1E2D'}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <span style={{ color: platformColors[slot.platform || ''] || '#8B8B9E' }}>
                            {slot.platform === 'linkedin' && <Linkedin size={12} />}
                            {slot.platform === 'facebook' && <Facebook size={12} />}
                            {slot.platform === 'instagram' && <Instagram size={12} />}
                            {slot.platform === 'twitter' && <Twitter size={12} />}
                            {slot.platform === 'youtube' && <Youtube size={12} />}
                          </span>
                          <span style={{ fontSize: 9, color: '#4A4A5E' }}>{slot.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.3 }}>{slot.title}</div>
                        <span className={slot.status === 'published' ? 'badge-glow-info' : slot.status === 'scheduled' ? 'badge-glow-warning' : 'badge-glow-neutral'} style={{ fontSize: 8, marginTop: 4 }}>
                          {statusColors[slot.status]?.label}
                        </span>
                      </motion.div>
                    ) : (
                      <div style={{
                        height: 60,
                        borderRadius: 8,
                        border: '1px dashed rgba(30, 30, 45, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ color: '#4A4A5E', fontSize: 16 }}>+</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ---- RECENT POSTS + SENTIMENT ---- */}
      <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Recent Posts */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Publications Recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: 12,
                  background: 'rgba(10, 10, 26, 0.5)',
                  borderRadius: 10,
                  border: '1px solid #1E1E2D',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  <FileImage size={24} style={{ color: '#4A4A5E' }} />
                  <div style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: platformColors[post.platform] || '#4A4A5E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {post.platform === 'linkedin' && <Linkedin size={10} color="#fff" />}
                    {post.platform === 'instagram' && <Instagram size={10} color="#fff" />}
                    {post.platform === 'twitter' && <Twitter size={10} color="#fff" />}
                    {post.platform === 'youtube' && <Youtube size={10} color="#fff" />}
                    {post.platform === 'facebook' && <Facebook size={10} color="#fff" />}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#FFFFFF', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.caption}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: '#EC4899', display: 'flex', alignItems: 'center', gap: 3 }}><Heart size={10} /> {post.likes}</span>
                    <span style={{ fontSize: 11, color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 3 }}><MessageCircle size={10} /> {post.comments}</span>
                    <span style={{ fontSize: 11, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 3 }}><ShareIcon size={10} /> {post.shares}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#4A4A5E', marginTop: 4 }}>{post.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sentiment */}
        <div className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>Analyse des Sentiments</h3>
          <SentimentGauge score={78} />
          <div style={{ marginTop: 20 }}>
            {[
              { label: 'Positif', value: 78, color: '#22C55E' },
              { label: 'Neutre', value: 15, color: '#F59E0B' },
              { label: 'Negatif', value: 7, color: '#EF4444' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#8B8B9E', width: 60 }}>{item.label}</span>
                <div className="gal-progress-track" style={{ flex: 1 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease }}
                    style={{
                      height: '100%',
                      borderRadius: 9999,
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}40`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF', width: 36, textAlign: 'right' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
