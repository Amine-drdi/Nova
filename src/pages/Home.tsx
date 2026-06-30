import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import {
  Users, Target, Euro, Shield, Rocket, Sparkles, Search, ShieldAlert,
  MailPlus, UserPlus, FileText, Terminal, TrendingUp, TrendingDown,
  ChevronRight, Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
const trafficData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(2025, 0, i + 1), 'd MMM', { locale: fr }),
  organic: 800 + Math.floor(Math.random() * 600 + Math.sin(i * 0.3) * 200),
  paid: 400 + Math.floor(Math.random() * 300 + Math.cos(i * 0.2) * 100),
}));

const channelData = [
  { name: 'SEO', value: 18420, percentage: 38 },
  { name: 'Google Ads', value: 12150, percentage: 25 },
  { name: 'Meta Ads', value: 8730, percentage: 18 },
  { name: 'Email', value: 5820, percentage: 12 },
  { name: 'Social', value: 3171, percentage: 7 },
];

const funnelData = [
  { stage: 'Visiteurs', count: 48291, dropoff: null },
  { stage: 'Visites qualifiées', count: 14487, dropoff: -70 },
  { stage: 'Leads', count: 4829, dropoff: -66.7 },
  { stage: 'Opportunités', count: 1448, dropoff: -70 },
  { stage: 'Clients', count: 434, dropoff: -70 },
];

const activityData = [
  { icon: 'target', text: "Campagne Google Ads 'été2024' lancée", time: 'Il y a 2 min', color: '#06B6D4' },
  { icon: 'user', text: 'Nouveau lead qualifié: Dupont SARL', time: 'Il y a 15 min', color: '#8B5CF6' },
  { icon: 'shield', text: 'Audit cybersécurité terminé — Score: 94', time: 'Il y a 1h', color: '#22C55E' },
  { icon: 'share', text: 'Publication Instagram planifiée', time: 'Il y a 2h', color: '#EC4899' },
  { icon: 'mail', text: 'Newsletter Juin envoyée — Taux d\'ouverture: 91%', time: 'Il y a 3h', color: '#F59E0B' },
  { icon: 'search', text: 'Audit SEO quotidien terminé — 3 erreurs corrigées', time: 'Il y a 4h', color: '#06B6D4' },
  { icon: 'trending', text: 'CPL moyen réduit de €28.50 à €24.50', time: 'Il y a 5h', color: '#22C55E' },
  { icon: 'alert', text: 'Mise à jour de sécurité disponible', time: 'Il y a 6h', color: '#F59E0B' },
];

const campaignsData = [
  { name: 'Été 2024', platform: 'Google Ads', budget: 120, performance: 85, status: 'active' },
  { name: 'Retargeting', platform: 'Meta', budget: 80, performance: 72, status: 'active' },
  { name: 'Newsletter Juin', platform: 'Email', budget: 0, performance: 91, status: 'completed' },
  { name: 'SEO — Blog', platform: 'SEO', budget: 0, performance: 68, status: 'progress' },
];

const securityStatus = {
  score: 94,
  firewall: true,
  ssl: true,
  threats: 0,
  lastScan: 'Il y a 2h',
};

/* ── Whirlpool Canvas ── */
function WhirlpoolCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = 300;

    for (let i = 0; i < particleCount; i++) {
      const r = Math.random();
      let color: string;
      if (r < 0.33) color = `rgba(139, 92, 246, ${0.4 + Math.random() * 0.4})`;
      else if (r < 0.66) color = `rgba(6, 182, 212, ${0.4 + Math.random() * 0.4})`;
      else color = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 80 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.5),
        speed: 0.003 + Math.random() * 0.005,
        size: 0.5 + Math.random() * 2,
        opacity: Math.random(),
        color,
      });
    }

    let time = 0;
    const animate = () => {
      time++;
      ctx.fillStyle = 'rgba(5, 5, 14, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * (0.5 + mouseRef.current.x * 0.1);
      const cy = canvas.height * (0.5 + mouseRef.current.y * 0.1);

      particles.forEach((p) => {
        p.angle += p.speed * (200 / (p.radius + 10));
        p.radius -= 0.1;
        if (p.radius < 10) {
          p.radius = Math.max(canvas.width, canvas.height) * 0.5;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const twinkle = Math.sin(time * 0.02 + p.opacity * 10) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${twinkle * parseFloat(p.color.match(/[\d.]+\)$/)?.[0] || '0.5')})`);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

/* ── Security Gauge ── */
function SecurityGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * score));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth={12} />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <text x="100" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="36" fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
          {animatedScore}
        </text>
        <text x="100" y="118" textAnchor="middle" fill="#8B8B9E" fontSize="13" fontFamily="'Inter', sans-serif">
          / 100
        </text>
      </svg>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: '#22C55E',
        }}
      >
        Niveau: Excellent
      </span>
    </div>
  );
}

/* ── KPI Card ── */
interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
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
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: deltaPositive ? '#22C55E' : '#EF4444',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {deltaPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {delta}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#8B8B9E',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: '#FFFFFF',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: '#4A4A5E',
            marginTop: 4,
          }}
        >
          {subLabel}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Quick Action Card ── */
function QuickActionCard({ icon, label, accentColor, gradient, onClick, index }: {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  gradient?: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      variants={fadeUp}
      custom={index + 7}
      onClick={onClick}
      className="gal-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        background: 'rgba(18, 18, 31, 0.6)',
        border: `1px solid rgba(30, 30, 45, 0.8)`,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}66`;
        e.currentTarget.style.boxShadow = `0 0 16px ${accentColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(30, 30, 45, 0.8)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        color: gradient ? undefined : accentColor,
        background: gradient ? `linear-gradient(135deg, #06B6D4, #8B5CF6)` : undefined,
        WebkitBackgroundClip: gradient ? 'text' : undefined,
        WebkitTextFillColor: gradient ? 'transparent' : undefined,
        backgroundClip: gradient ? 'text' : undefined,
      }}>
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#8B8B9E',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/* ── Main Dashboard ── */
export default function Home() {
  const navigate = useNavigate();
  const today = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });

  const statusDot = useMemo(() => (
    <span
      className="pulse-dot"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#22C55E',
        display: 'inline-block',
      }}
    />
  ), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero Whirlpool */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        style={{
          position: 'relative',
          width: '100%',
          height: 240,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(30, 30, 45, 0.8)',
        }}
      >
        <WhirlpoolCanvas />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 32px',
          }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 36,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Tableau de Bord
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: '#8B8B9E',
                margin: '8px 0 0',
                lineHeight: 1.5,
              }}
            >
              Vue d&apos;ensemble de vos opérations de croissance et de sécurité
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease, delay: 0.6 }}
            style={{ textAlign: 'right' }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#06B6D4',
                marginBottom: 8,
              }}
            >
              {today}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              {statusDot}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#22C55E',
                }}
              >
                Tous les systèmes opérationnels
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Metrics Row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}
      >
        <KpiCard
          icon={<Users size={20} />}
          iconBg="rgba(6, 182, 212, 0.1)"
          iconColor="#06B6D4"
          label="Visites Totales"
          value={<AnimatedCounter target={48291} />}
          delta="+12.5%"
          deltaPositive
          subLabel="Ce mois"
          index={0}
        />
        <KpiCard
          icon={<Target size={20} />}
          iconBg="rgba(139, 92, 246, 0.1)"
          iconColor="#8B5CF6"
          label="Conversions"
          value={<AnimatedCounter target={1847} />}
          delta="+8.2%"
          deltaPositive
          subLabel="Taux: 3.82%"
          index={1}
        />
        <KpiCard
          icon={<Euro size={20} />}
          iconBg="rgba(236, 72, 153, 0.1)"
          iconColor="#EC4899"
          label="Coût par Lead"
          value={<AnimatedCounter target={24.5} prefix="€" decimals={2} />}
          delta="-15.3%"
          deltaPositive
          subLabel="Moyenne sectorielle: €32"
          index={2}
        />
        <KpiCard
          icon={<Shield size={20} />}
          iconBg="rgba(34, 197, 94, 0.1)"
          iconColor="#22C55E"
          label="Score Cybersécurité"
          value="94/100"
          delta="+2"
          deltaPositive
          subLabel="Niveau: Excellent"
          index={3}
        />
      </motion.div>

      {/* Traffic Evolution & Channels */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: 20,
        }}
      >
        {/* Traffic Chart */}
        <motion.div variants={fadeUp} custom={4} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>
              Évolution du Trafic
            </h3>
            <select
              style={{
                background: 'rgba(10, 10, 26, 0.8)',
                border: '1px solid #1E1E2D',
                borderRadius: 6,
                padding: '4px 10px',
                color: '#8B8B9E',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="7">7 jours</option>
              <option value="30" selected>30 jours</option>
              <option value="90">90 jours</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="organicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#4A4A5E', fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                axisLine={{ stroke: '#1E1E2D' }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#4A4A5E', fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                axisLine={{ stroke: '#1E1E2D' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(18, 18, 31, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 8,
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                }}
                labelStyle={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                itemStyle={{ color: '#8B8B9E', fontFamily: "'Inter', sans-serif", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="organic"
                name="Organique"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#organicGradient)"
                isAnimationActive
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="paid"
                name="Payant"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#paidGradient)"
                isAnimationActive
                animationDuration={1500}
                animationEasing="ease-in-out"
                animationBegin={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Channel Performance */}
        <motion.div variants={fadeUp} custom={5} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>
            Canaux Performants
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={channelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 74, 94, 0.15)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#4A4A5E', fontSize: 11 }}
                axisLine={{ stroke: '#1E1E2D' }}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: '#8B8B9E', fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                axisLine={{ stroke: '#1E1E2D' }}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(18, 18, 31, 0.9)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 8,
                }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#8B8B9E' }}
              />
              <Bar
                dataKey="value"
                name="Visites"
                fill="url(#barGradient)"
                radius={[0, 4, 4, 0]}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Conversion Funnel & Activity Feed */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        {/* Funnel */}
        <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 20px' }}>
            Entonnoir de Conversion
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {funnelData.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.8 + i * 0.15 }}
                style={{ transformOrigin: 'center' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      height: 40,
                      width: `${100 - i * 15}%`,
                      background: i === 0
                        ? 'linear-gradient(90deg, #06B6D4, #06B6D4)'
                        : i === funnelData.length - 1
                        ? 'linear-gradient(90deg, #8B5CF6, #8B5CF6)'
                        : `linear-gradient(90deg, #06B6D4 ${100 - i * 30}%, #8B5CF6)`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                      margin: '0 auto',
                      boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)',
                    }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 12, color: '#FFFFFF' }}>
                      {step.stage}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>
                      {step.count.toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
                {step.dropoff !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
                    style={{
                      textAlign: 'center',
                      fontSize: 11,
                      color: '#EF4444',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    ↓ {step.dropoff}% de perte
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#8B8B9E',
            }}
          >
            Taux de conversion global: <span style={{ color: '#22C55E', fontWeight: 600 }}>0.90%</span>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>
            Activité Récente
          </h3>
          <div
            style={{
              maxHeight: 400,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {activityData.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease, delay: 0.9 + i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < activityData.length - 1 ? '1px solid rgba(30, 30, 45, 0.5)' : undefined,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `${activity.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: activity.color,
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: '#FFFFFF',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {activity.text}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: '#4A4A5E',
                    }}
                  >
                    <Clock size={10} />
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h3
          variants={fadeUp}
          custom={7}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: '#FFFFFF',
            margin: '0 0 16px',
          }}
        >
          Actions Rapides
        </motion.h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          <QuickActionCard
            icon={<Rocket size={32} color="#06B6D4" />}
            label="Nouvelle Campagne"
            accentColor="#06B6D4"
            onClick={() => navigate('/google-ads')}
            index={0}
          />
          <QuickActionCard
            icon={<Sparkles size={32} color="#8B5CF6" />}
            label="Générer Contenu"
            accentColor="#8B5CF6"
            onClick={() => navigate('/visual')}
            index={1}
          />
          <QuickActionCard
            icon={<Search size={32} color="#06B6D4" />}
            label="Audit SEO"
            accentColor="#06B6D4"
            onClick={() => navigate('/seo')}
            index={2}
          />
          <QuickActionCard
            icon={<ShieldAlert size={32} color="#22C55E" />}
            label="Scan Cyber"
            accentColor="#22C55E"
            onClick={() => navigate('/cyber')}
            index={3}
          />
          <QuickActionCard
            icon={<MailPlus size={32} color="#EC4899" />}
            label="Créer Email"
            accentColor="#EC4899"
            onClick={() => navigate('/email')}
            index={4}
          />
          <QuickActionCard
            icon={<UserPlus size={32} color="#8B5CF6" />}
            label="Ajouter Lead"
            accentColor="#8B5CF6"
            onClick={() => navigate('/crm')}
            index={5}
          />
          <QuickActionCard
            icon={<FileText size={32} color="#F59E0B" />}
            label="Rapport Rapide"
            accentColor="#F59E0B"
            onClick={() => navigate('/reporting')}
            index={6}
          />
          <QuickActionCard
            icon={<Terminal size={32} />}
            label="Commande IA"
            accentColor="#06B6D4"
            gradient
            onClick={() => navigate('/mission-control')}
            index={7}
          />
        </div>
      </motion.div>

      {/* Active Campaigns & Security */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        {/* Active Campaigns */}
        <motion.div variants={fadeUp} custom={15} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>
              Campagnes Actives
            </h3>
            <button
              onClick={() => navigate('/google-ads')}
              style={{
                background: 'none',
                border: 'none',
                color: '#06B6D4',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <table className="gal-table">
            <thead>
              <tr>
                <th>Campagne</th>
                <th>Budget/jour</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map((campaign, i) => (
                <motion.tr
                  key={campaign.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 1 + i * 0.08 }}
                >
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{campaign.name}</span>
                      <span style={{ color: '#4A4A5E', fontSize: 11 }}>{campaign.platform}</span>
                    </div>
                  </td>
                  <td style={{ color: campaign.budget > 0 ? '#FFFFFF' : '#4A4A5E' }}>
                    {campaign.budget > 0 ? `€${campaign.budget}` : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="gal-progress-track" style={{ width: 80 }}>
                        <motion.div
                          className="gal-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${campaign.performance}%` }}
                          transition={{ duration: 1, ease, delay: 1.2 + i * 0.08 }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            campaign.performance >= 80
                              ? '#22C55E'
                              : campaign.performance >= 60
                              ? '#06B6D4'
                              : '#F59E0B',
                        }}
                      >
                        {campaign.performance}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Security Status */}
        <motion.div variants={fadeUp} custom={15} className="gal-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: '0 0 16px' }}>
            État de la Sécurité
          </h3>
          <div style={{ display: 'flex', gap: 20 }}>
            <SecurityGauge score={securityStatus.score} />
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                alignContent: 'center',
              }}
            >
              {[
                { label: 'Firewall', value: securityStatus.firewall ? 'Actif' : 'Inactif', color: '#22C55E' },
                { label: 'SSL', value: securityStatus.ssl ? 'Valide' : 'Expiré', color: '#22C55E' },
                { label: 'Menaces', value: `${securityStatus.threats} détectées`, color: '#22C55E' },
                { label: 'Dernier scan', value: securityStatus.lastScan, color: '#06B6D4' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 1.5 + i * 0.1 }}
                  style={{
                    padding: 12,
                    background: 'rgba(10, 10, 26, 0.6)',
                    borderRadius: 8,
                    border: '1px solid rgba(30, 30, 45, 0.5)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span
                      className="pulse-dot"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: item.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 11, color: '#4A4A5E', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
