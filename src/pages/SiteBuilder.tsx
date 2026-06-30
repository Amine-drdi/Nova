import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Globe, Clock, BarChart3, Plus, Layout, LayoutTemplate,
  ChevronDown, ChevronRight, Eye, Pencil, Copy, Trash2, Check,
  Search, X, CheckCircle2, AlertCircle, Smartphone, Monitor, Tablet,
  ExternalLink, Download, Upload, Sparkles, Settings, Code,
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

// Template library
const templates = [
  { id: 1, name: 'Landing Vente', category: 'Landing', description: 'Page de vente avec CTA optimisé' },
  { id: 2, name: 'Article Blog', category: 'Blog', description: 'Mise en page éditoriale complète' },
  { id: 3, name: 'Page Produit', category: 'Produit', description: 'Fiche produit avec galeries' },
  { id: 4, name: 'Page Service', category: 'Service', description: 'Présentation de service B2B' },
  { id: 5, name: 'Contact', category: 'Contact', description: 'Formulaire de contact + carte' },
  { id: 6, name: 'À Propos', category: 'Landing', description: 'Histoire et équipe' },
  { id: 7, name: 'FAQ', category: 'Service', description: 'Questions fréquentes interactives' },
  { id: 8, name: 'Témoignages', category: 'Landing', description: 'Page avis clients' },
  { id: 9, name: 'Coming Soon', category: 'Landing', description: 'Page de lancement' },
];

// Site tree structure
interface TreeNode {
  name: string;
  status?: 'published' | 'draft' | 'review';
  children?: TreeNode[];
}

const siteTree: TreeNode[] = [
  {
    name: 'Accueil',
    status: 'published',
    children: [],
  },
  {
    name: 'Services',
    status: 'published',
    children: [
      { name: 'Télésecrétariat', status: 'published' },
      { name: 'Assistance Virtuelle', status: 'published' },
      { name: 'Call Center', status: 'draft' },
      { name: 'Back Office', status: 'published' },
    ],
  },
  {
    name: 'Secteurs',
    status: 'published',
    children: [
      { name: 'Médical', status: 'published' },
      { name: 'Immobilier', status: 'draft' },
      { name: 'E-commerce', status: 'review' },
    ],
  },
  {
    name: 'Ressources',
    status: 'published',
    children: [
      { name: 'Blog', status: 'published', children: [
        { name: 'Guide SEO 2025', status: 'published' },
        { name: 'Télésecrétariat vs AV', status: 'published' },
        { name: 'ROI BPO', status: 'draft' },
      ]},
      { name: 'Études de cas', status: 'published' },
      { name: 'Webinaires', status: 'draft' },
    ],
  },
  {
    name: 'Entreprise',
    status: 'published',
    children: [
      { name: 'À propos', status: 'published' },
      { name: 'Carrières', status: 'review' },
      { name: 'Contact', status: 'published' },
    ],
  },
];

// Recent pages
const recentPages = [
  { id: 1, title: 'Services Marketing IA', type: 'Service', status: 'published' as const, seoScore: 92, date: '15 juin 2025', author: 'Système' },
  { id: 2, title: 'Guide SEO Local 2024', type: 'Blog', status: 'published' as const, seoScore: 85, date: '14 juin 2025', author: 'Marie D.' },
  { id: 3, title: 'Landing Été 2024', type: 'Landing', status: 'draft' as const, seoScore: 0, date: '13 juin 2025', author: 'Jean K.' },
  { id: 4, title: 'Page Contact V2', type: 'Contact', status: 'review' as const, seoScore: 71, date: '12 juin 2025', author: 'Système' },
  { id: 5, title: 'Fiche Produit Premium', type: 'Produit', status: 'published' as const, seoScore: 88, date: '11 juin 2025', author: 'Marie D.' },
  { id: 6, title: 'Témoignages Clients', type: 'Landing', status: 'published' as const, seoScore: 79, date: '10 juin 2025', author: 'Jean K.' },
  { id: 7, title: 'FAQ Télésecrétariat', type: 'Service', status: 'published' as const, seoScore: 95, date: '9 juin 2025', author: 'Système' },
  { id: 8, title: 'Blog : Marketing IA', type: 'Blog', status: 'draft' as const, seoScore: 0, date: '8 juin 2025', author: 'Marie D.' },
];

/* ── Helpers ── */
function getStatusBadge(status: 'published' | 'draft' | 'review') {
  if (status === 'published') return <span className="badge-glow-success" style={{ fontSize: 10, padding: '2px 8px' }}>Publié</span>;
  if (status === 'draft') return <span className="badge-glow-warning" style={{ fontSize: 10, padding: '2px 8px' }}>Brouillon</span>;
  return <span className="badge-glow-error" style={{ fontSize: 10, padding: '2px 8px' }}>En révision</span>;
}

function getStatusDot(status: 'published' | 'draft' | 'review') {
  const color = status === 'published' ? '#22C55E' : status === 'draft' ? '#F59E0B' : '#EF4444';
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}60` }} />;
}

type FilterCategory = 'Tous' | 'Landing' | 'Blog' | 'Produit' | 'Service' | 'Contact';

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
          {deltaPositive ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
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

function TrendingUpIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
}

function TrendingDownIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>;
}

/* ── Tree Node Component ── */
function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer',
          width: '100%', paddingLeft: depth * 20,
        }}
      >
        {hasChildren ? (
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={14} color="#8B8B9E" />
          </motion.div>
        ) : (
          <div style={{ width: 14 }} />
        )}
        {node.status && getStatusDot(node.status)}
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: depth === 0 ? '#06B6D4' : '#FFFFFF',
          fontWeight: depth === 0 ? 700 : 500,
        }}>
          {node.name}
        </span>
      </motion.button>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            style={{ overflow: 'hidden' }}
          >
            {node.children!.map((child, i) => (
              <motion.div
                key={child.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <TreeNodeComponent node={child} depth={depth + 1} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SEO Score Ring ── */
function SeoScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#22C55E' : score >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(74, 74, 94, 0.2)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
      <text x={size / 2} y={size / 2 - 2} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize={size * 0.3} fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
        {score}
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="#4A4A5E" fontSize={size * 0.12} fontFamily="'Inter', sans-serif">
        /100
      </text>
    </svg>
  );
}

/* ── Main SiteBuilder Page ── */
export default function SiteBuilder() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [seoMetaTitle, setSeoMetaTitle] = useState('Télésecrétariat Tunisie | LNR Finance');
  const [seoMetaDesc, setSeoMetaDesc] = useState('Externalisez votre secrétariat avec LNR Finance. Assistance virtuelle francophone depuis la Tunisie. Devis gratuit en 24h.');
  const [seoSlug, setSeoSlug] = useState('telesecretariat-tunisie');
  const [seoH1, setSeoH1] = useState('Télésecrétariat en Tunisie — Assistance Virtuelle Francophone');
  const [seoSchema, setSeoSchema] = useState('Service');
  const [seoIndex, setSeoIndex] = useState(true);
  const [seoScore, setSeoScore] = useState(82);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const filteredTemplates = activeCategory === 'Tous' ? templates : templates.filter(t => t.category === activeCategory);

  const filteredPages = statusFilter === 'Tous' ? recentPages : recentPages.filter(p => p.status === statusFilter.toLowerCase());

  const titleLen = seoMetaTitle.length;
  const descLen = seoMetaDesc.length;

  const categories: FilterCategory[] = ['Tous', 'Landing', 'Blog', 'Produit', 'Service', 'Contact'];

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
            <Layout size={28} style={{ display: 'inline', marginRight: 12, verticalAlign: 'middle', color: '#06B6D4' }} />
            SiteBuilder
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8B8B9E', margin: '8px 0 0', lineHeight: 1.5 }}>
            Créez et optimisez vos pages avec l&apos;IA
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Exporter
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Upload size={14} /> Importer
          </button>
          <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Créer une Page
          </button>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <KpiCard icon={<FileText size={20} />} iconBg="rgba(6, 182, 212, 0.1)" iconColor="#06B6D4" label="Pages Créées" value="47" delta="+3 cette semaine" deltaPositive subLabel="Total" index={0} />
        <KpiCard icon={<Globe size={20} />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8B5CF6" label="Pages Publiées" value="38" delta="9 brouillons" deltaPositive={false} subLabel="80.9% publiées" index={1} />
        <KpiCard icon={<Clock size={20} />} iconBg="rgba(236, 72, 153, 0.1)" iconColor="#EC4899" label="Temps Moyen" value="18 min" delta="-5 min" deltaPositive subLabel="Avec l'IA" index={2} />
        <KpiCard icon={<BarChart3 size={20} />} iconBg="rgba(34, 197, 94, 0.1)" iconColor="#22C55E" label="Score SEO Moyen" value="78/100" delta="+4" deltaPositive subLabel="Sur les pages actives" index={3} />
      </motion.div>

      {/* ── Template Library + Site Tree ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Template Library */}
        <motion.div variants={fadeUp} custom={4} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Bibliothèque de Modèles</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: '1px solid',
                    borderColor: activeCategory === cat ? 'rgba(6, 182, 212, 0.4)' : 'rgba(30, 30, 45, 0.8)',
                    background: activeCategory === cat ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    color: activeCategory === cat ? '#06B6D4' : '#8B8B9E', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
            >
              {filteredTemplates.map((tmpl, i) => (
                <motion.div
                  key={tmpl.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="gal-card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    height: 90, background: 'linear-gradient(135deg, #0A0A1A, #12121F)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
                  }}>
                    <LayoutTemplate size={32} color="#1E1E2D" />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(139, 92, 246, 0.05))',
                      opacity: 0, transition: 'opacity 0.2s',
                    }} className="template-overlay" />
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#FFFFFF' }}>{tmpl.name}</span>
                      <span className="badge-glow-info" style={{ fontSize: 10, padding: '2px 8px' }}>{tmpl.category}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#4A4A5E', margin: '0 0 8px', lineHeight: 1.4 }}>{tmpl.description}</p>
                    <button className="btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: 11 }}>
                      Utiliser
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Site Tree */}
        <motion.div variants={fadeUp} custom={5} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Structure du Site</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Tout déplier</button>
              <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Tout replier</button>
            </div>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto', padding: '4px 8px' }}>
            {siteTree.map((node, i) => (
              <motion.div key={node.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <TreeNodeComponent node={node} />
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', borderTop: '1px solid rgba(30, 30, 45, 0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 11, color: '#8B8B9E' }}>Publié</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontSize: 11, color: '#8B8B9E' }}>Brouillon</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
              <span style={{ fontSize: 11, color: '#8B8B9E' }}>Révision</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Recent Pages Table ── */}
      <motion.div variants={fadeUp} custom={6} className="gal-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Pages Récentes</h3>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Tous', 'Publié', 'Brouillon', 'En révision'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid',
                  borderColor: statusFilter === f ? 'rgba(6, 182, 212, 0.4)' : 'rgba(30, 30, 45, 0.8)',
                  background: statusFilter === f ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  color: statusFilter === f ? '#06B6D4' : '#8B8B9E', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <table className="gal-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Score SEO</th>
              <th>Date</th>
              <th>Auteur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.map((page, i) => (
              <motion.tr
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td style={{ fontWeight: 600, color: '#FFFFFF' }}>{page.title}</td>
                <td><span className="badge-glow-neutral" style={{ fontSize: 10, padding: '2px 8px' }}>{page.type}</span></td>
                <td>{getStatusBadge(page.status)}</td>
                <td>
                  {page.seoScore > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 50, height: 4, background: 'rgba(74, 74, 94, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${page.seoScore}%`, height: '100%', background: page.seoScore >= 85 ? '#22C55E' : page.seoScore >= 70 ? '#F59E0B' : '#EF4444', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 12, color: '#FFFFFF' }}>{page.seoScore}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#4A4A5E', fontSize: 12 }}>—</span>
                  )}
                </td>
                <td style={{ fontSize: 12 }}>{page.date}</td>
                <td>{page.author}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(10, 10, 26, 0.8)', border: '1px solid rgba(30, 30, 45, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B8B9E' }}>
                      <Pencil size={12} />
                    </button>
                    <button style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(10, 10, 26, 0.8)', border: '1px solid rgba(30, 30, 45, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B8B9E' }}>
                      <Eye size={12} />
                    </button>
                    <button style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(10, 10, 26, 0.8)', border: '1px solid rgba(30, 30, 45, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8B8B9E' }}>
                      <Copy size={12} />
                    </button>
                    <button style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── Visual Preview + SEO Settings ── */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Visual Preview */}
        <motion.div variants={fadeUp} custom={7} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Aperçu</h3>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, padding: 2, border: '1px solid rgba(30, 30, 45, 0.8)' }}>
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([vp, Icon]) => (
                <button
                  key={vp}
                  onClick={() => setViewport(vp)}
                  style={{
                    padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: viewport === vp ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                    color: viewport === vp ? '#06B6D4' : '#4A4A5E',
                  }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
          {/* Browser frame */}
          <motion.div
            layout
            transition={{ duration: 0.3, ease }}
            style={{
              margin: '0 auto',
              width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px',
              border: '1px solid rgba(30, 30, 45, 0.8)',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#0A0A1A',
            }}
          >
            {/* Address bar */}
            <div style={{ height: 32, background: '#12121F', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, borderBottom: '1px solid rgba(30, 30, 45, 0.8)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
              </div>
              <div style={{ flex: 1, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 4, padding: '2px 8px', fontSize: 10, color: '#4A4A5E', fontFamily: "'JetBrains Mono', monospace" }}>
                https://lnr-finance.fr/{seoSlug}
              </div>
            </div>
            {/* Preview content */}
            <div style={{ padding: 20, minHeight: 200 }}>
              <div style={{ height: 8, width: '60%', background: 'rgba(6, 182, 212, 0.3)', borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 6, width: '100%', background: 'rgba(74, 74, 94, 0.2)', borderRadius: 3, marginBottom: 6 }} />
              <div style={{ height: 6, width: '90%', background: 'rgba(74, 74, 94, 0.2)', borderRadius: 3, marginBottom: 6 }} />
              <div style={{ height: 6, width: '80%', background: 'rgba(74, 74, 94, 0.2)', borderRadius: 3, marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ height: 60, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 6, border: '1px solid rgba(139, 92, 246, 0.2)' }} />
                <div style={{ height: 60, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 6, border: '1px solid rgba(6, 182, 212, 0.2)' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* SEO Settings */}
        <motion.div variants={fadeUp} custom={8} className="gal-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#FFFFFF', margin: 0 }}>Paramètres SEO</h3>
            <SeoScoreRing score={seoScore} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Meta title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Meta Titre</label>
                <span style={{ fontSize: 11, color: titleLen <= 60 ? '#22C55E' : titleLen <= 70 ? '#F59E0B' : '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>{titleLen}/60</span>
              </div>
              <input
                type="text"
                value={seoMetaTitle}
                onChange={(e) => setSeoMetaTitle(e.target.value)}
                className="gal-input"
                style={{ width: '100%', fontSize: 13 }}
                maxLength={80}
              />
            </div>
            {/* Meta description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Meta Description</label>
                <span style={{ fontSize: 11, color: descLen <= 160 ? '#22C55E' : descLen <= 170 ? '#F59E0B' : '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>{descLen}/160</span>
              </div>
              <textarea
                value={seoMetaDesc}
                onChange={(e) => setSeoMetaDesc(e.target.value)}
                className="gal-input"
                style={{ width: '100%', minHeight: 60, resize: 'vertical', fontSize: 13 }}
                maxLength={200}
              />
            </div>
            {/* URL Slug */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ fontSize: 12, color: '#4A4A5E', fontFamily: "'JetBrains Mono', monospace", padding: '8px 10px', background: 'rgba(10, 10, 26, 0.8)', border: '1px solid rgba(30, 30, 45, 0.8)', borderRight: 'none', borderRadius: '8px 0 0 8px' }}>/</span>
                <input
                  type="text"
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                  className="gal-input"
                  style={{ borderRadius: '0 8px 8px 0', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", flex: 1 }}
                />
              </div>
            </div>
            {/* H1 */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Balise H1</label>
              <input
                type="text"
                value={seoH1}
                onChange={(e) => setSeoH1(e.target.value)}
                className="gal-input"
                style={{ width: '100%', fontSize: 13 }}
              />
            </div>
            {/* Schema.org */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#8B8B9E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Schema.org</label>
              <select
                value={seoSchema}
                onChange={(e) => setSeoSchema(e.target.value)}
                className="gal-input"
                style={{ width: '100%', fontSize: 13, cursor: 'pointer' }}
              >
                <option value="Article">Article</option>
                <option value="Product">Produit</option>
                <option value="Service">Service</option>
                <option value="FAQ">FAQ</option>
                <option value="LocalBusiness">LocalBusiness</option>
              </select>
            </div>
            {/* Index toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, color: '#FFFFFF' }}>Indexation</label>
              <button
                onClick={() => setSeoIndex(!seoIndex)}
                style={{
                  width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: seoIndex ? 'linear-gradient(135deg, #06B6D4, #8B5CF6)' : '#4A4A5E',
                  display: 'flex', alignItems: 'center', padding: 2,
                  justifyContent: seoIndex ? 'flex-end' : 'flex-start',
                  transition: 'background 0.2s ease',
                }}
              >
                <motion.div layout style={{ width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF' }} />
              </button>
            </div>
          </div>

          {/* SEO Suggestions */}
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(10, 10, 26, 0.8)', borderRadius: 8, border: '1px solid rgba(30, 30, 45, 0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Sparkles size={14} color="#06B6D4" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#06B6D4' }}>Suggestions IA</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Ajouter le mot-clé "télésecrétariat" dans les 100 premiers caractères',
                'La balise H1 pourrait être plus descriptive (ajouter un bénéfice)',
                'Considerer l\'ajout de schema.org FAQ pour cette page',
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#8B8B9E', lineHeight: 1.5 }}
                >
                  <ChevronRight size={12} color="#06B6D4" style={{ marginTop: 2, flexShrink: 0 }} />
                  {s}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
