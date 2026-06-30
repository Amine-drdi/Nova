import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Image, Calendar, Clock, CreditCard, Download,
  Pencil, Copy, Maximize, Heart, Search, ChevronLeft,
  ChevronRight, FolderOpen, FileImage, FileVideo, Layers,
  Type, Palette, Upload, Check, Wand2, Zap, X,
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
  { label: 'ASSETS CRÉÉS', value: '1,247', delta: '+89 ce mois', deltaColor: '#22C55E', sub: 'Total historique', icon: Image, iconColor: '#06B6D4' },
  { label: 'CE MOIS', value: '89', delta: '+23%', deltaColor: '#22C55E', sub: 'Images + Vidéos', icon: Calendar, iconColor: '#8B5CF6' },
  { label: 'TEMPS MOYEN', value: '45s', delta: '-12s', deltaColor: '#22C55E', sub: 'Par génération', icon: Clock, iconColor: '#EC4899' },
  { label: 'CRÉDITS RESTANTS', value: '342', delta: 'Recharge: 1er juillet', deltaColor: '#F59E0B', sub: 'Sur 500/mois', icon: CreditCard, iconColor: '#F59E0B' },
];

const stylePresets = ['Réaliste', '3D', 'Vectoriel', 'Aquarelle', 'Néon', 'Minimaliste', 'Corporate', 'Social Media'];
const ratios = ['1:1', '16:9', '9:16', '4:3', '3:2'];

const generatedImages = [
  { id: 1, prompt: 'Bannière futuriste agence marketing, tons bleu violet', time: '2 min', ratio: '16:9', color: '#1A1A3E' },
  { id: 2, prompt: 'Illustration 3D isométrique données financières', time: '3 min', ratio: '1:1', color: '#0E2A3A' },
  { id: 3, prompt: 'Mockup smartphone application bancaire sombre', time: '1 min', ratio: '9:16', color: '#1A0E2A' },
  { id: 4, prompt: 'Logo minimaliste LNR Finance, style néon cyan', time: '4 min', ratio: '1:1', color: '#0A1A1A' },
  { id: 5, prompt: 'Infographie croissance ROI, style corporate', time: '2 min', ratio: '16:9', color: '#1E1E3E' },
  { id: 6, prompt: 'Visuel réseaux sociaux offre été 2024', time: '3 min', ratio: '1:1', color: '#2A1A0E' },
];

const assetLibrary = [
  { name: 'hero-banner-q2.png', type: 'image', size: '2.4 MB', date: '28 juin 2025', color: '#1A1A3E' },
  { name: 'product-demo.mp4', type: 'video', size: '18.7 MB', date: '27 juin 2025', color: '#0E2A3A' },
  { name: 'logo-primary.svg', type: 'image', size: '12 KB', date: '25 juin 2025', color: '#1A0E2A' },
  { name: 'newsletter-header.png', type: 'template', size: '1.8 MB', date: '24 juin 2025', color: '#0A1A1A' },
  { name: 'social-pack-juin.zip', type: 'template', size: '8.3 MB', date: '22 juin 2025', color: '#1E1E3E' },
  { name: 'testimonial-bg.jpg', type: 'image', size: '3.1 MB', date: '20 juin 2025', color: '#2A1A0E' },
];

const templates = [
  { name: 'Post Instagram Pro', category: 'Social Post', color: '#1A1A3E' },
  { name: 'Story Événement', category: 'Story', color: '#0E2A3A' },
  { name: 'Bannière LinkedIn', category: 'Bannière', color: '#1A0E2A' },
  { name: 'Flyer Promotion', category: 'Flyer', color: '#0A1A1A' },
  { name: 'Présentation Q3', category: 'Présentation', color: '#1E1E3E' },
  { name: 'Logo Minimal', category: 'Logo', color: '#2A1A0E' },
  { name: 'Carte de Visite', category: 'Print', color: '#1A2A1A' },
  { name: 'Thumbnail YouTube', category: 'Social Post', color: '#2A1A2A' },
];

const brandColors = [
  { name: 'Primary', hex: '#06B6D4' },
  { name: 'Secondary', hex: '#8B5CF6' },
  { name: 'Accent', hex: '#22C55E' },
  { name: 'Warning', hex: '#F59E0B' },
  { name: 'Danger', hex: '#EF4444' },
  { name: 'Dark', hex: '#0A0A1A' },
];

const generationSteps = [
  'Analyse du prompt...',
  'Génération en cours...',
  'Finalisation...',
  'Terminé !',
];

/* ── Component ── */
export default function Visual() {
  const [selectedPresets, setSelectedPresets] = useState<string[]>(['Néon']);
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [imageCount, setImageCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState(0);
  const [showResults, setShowResults] = useState(true);
  const [assetFilter, setAssetFilter] = useState('Tous');
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState('coord');
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const assetFilters = ['Tous', 'Images', 'Vidéos', 'Templates'];

  const togglePreset = (p: string) => {
    setSelectedPresets((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setGenProgress(0);
    setGenStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setGenProgress(step * 25);
      setGenStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setShowResults(true);
        }, 500);
      }
    }, 800);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredAssets = assetFilter === 'Tous'
    ? assetLibrary
    : assetLibrary.filter((a) =>
        assetFilter === 'Images'
          ? a.type === 'image'
          : assetFilter === 'Vidéos'
          ? a.type === 'video'
          : a.type === 'template'
      );

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
            Création Visuelle
          </h1>
          <p className="text-[#8B8B9E] text-[13px] mt-1">
            Générez des visuels et gérez vos assets créatifs
          </p>
        </motion.div>
        <motion.button variants={fadeUp} custom={1} className="btn-neon flex items-center gap-2">
          <Sparkles size={16} className="spin-slow" style={{ animationDuration: '8s' }} />
          Générer un Visuel
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
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${kpi.iconColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <kpi.icon size={20} color={kpi.iconColor} />
              </div>
              <span
                className="text-[11px] font-semibold"
                style={{ color: kpi.deltaColor }}
              >
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

      {/* ── AI Generation Studio ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 size={18} className="neon-text-cyan" />
            <h2 className="font-display text-[18px] font-semibold text-white">
              Studio de Génération IA
            </h2>
          </div>

          {/* Prompt Input */}
          <textarea
            className="gal-input w-full mb-4 resize-none"
            rows={3}
            placeholder="Décrivez l'image que vous souhaitez générer... (ex: 'Bannière professionnelle pour une agence marketing, style futuriste, tons bleu et violet')"
            defaultValue="Bannière futuriste pour LNR Finance, style galactique avec néons cyan et violet, ambiance premium dark"
          />

          {/* Style Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {stylePresets.map((preset) => {
              const isSelected = selectedPresets.includes(preset);
              return (
                <button
                  key={preset}
                  onClick={() => togglePreset(preset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200"
                  style={{
                    border: `1px solid ${isSelected ? '#06B6D4' : '#1E1E2D'}`,
                    background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    color: isSelected ? '#06B6D4' : '#8B8B9E',
                  }}
                >
                  {isSelected && <Check size={12} />}
                  {preset}
                </button>
              );
            })}
          </div>

          {/* Options Row */}
          <div className="flex flex-wrap items-center gap-4 mb-5">
            {/* Ratio Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8B8B9E] uppercase tracking-wider">Ratio</span>
              <div className="flex rounded-lg overflow-hidden border border-[#1E1E2D]">
                {ratios.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRatio(r)}
                    className="px-3 py-1.5 text-[12px] font-medium transition-all"
                    style={{
                      background: selectedRatio === r ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      color: selectedRatio === r ? '#06B6D4' : '#8B8B9E',
                      borderRight: r !== '3:2' ? '1px solid #1E1E2D' : 'none',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Stepper */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8B8B9E] uppercase tracking-wider">Nombre</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImageCount(Math.max(1, imageCount - 1))}
                  className="w-7 h-7 rounded-md border border-[#1E1E2D] flex items-center justify-center text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] transition-colors"
                >
                  <X size={12} />
                </button>
                <span className="text-[13px] text-white font-medium w-4 text-center">{imageCount}</span>
                <button
                  onClick={() => setImageCount(Math.min(4, imageCount + 1))}
                  className="w-7 h-7 rounded-md border border-[#1E1E2D] flex items-center justify-center text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] transition-colors"
                >
                  <Sparkles size={12} />
                </button>
              </div>
            </div>

            {/* Quality Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8B8B9E] uppercase tracking-wider">Qualité</span>
              <div className="flex rounded-lg overflow-hidden border border-[#1E1E2D]">
                <button className="px-3 py-1.5 text-[12px] font-medium bg-[rgba(6,182,212,0.15)] text-[#06B6D4]">
                  HD
                </button>
                <button className="px-3 py-1.5 text-[12px] font-medium text-[#8B8B9E] hover:text-white transition-colors">
                  Standard
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={startGeneration}
            disabled={isGenerating}
            className="btn-neon w-full flex items-center justify-center gap-2 py-3 relative overflow-hidden"
            style={{ opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? (
              <>
                <Zap size={16} className="animate-pulse" />
                {generationSteps[Math.min(genStep, 3)]}
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Générer
              </>
            )}
          </button>

          {/* Generation Progress */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="gal-progress-track">
                  <motion.div
                    className="gal-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${genProgress}%` }}
                    transition={{ duration: 0.5, ease }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-[#8B8B9E]">
                    {generationSteps[Math.min(genStep, 3)]}
                  </span>
                  <span className="text-[11px] text-[#06B6D4] font-mono-data">
                    {genProgress}%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Results Grid + Asset Library ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Generation Results */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-[16px] font-semibold text-white">
                Résultats
              </h3>
              <span className="text-[11px] text-[#4A4A5E]">{generatedImages.length} générations</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {showResults && generatedImages.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.1 }}
                    className="group relative rounded-lg overflow-hidden cursor-pointer"
                    style={{ aspectRatio: selectedRatio === '9:16' ? '9/16' : selectedRatio === '16:9' ? '16/9' : '1/1' }}
                  >
                    {/* Placeholder Image */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: img.color }}
                    >
                      <Image size={32} color="#4A4A5E" opacity={0.5} />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[rgba(5,5,14,0.75)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-2">
                        {[Download, Pencil, Copy, Maximize].map((Icon, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(6,182,212,0.3)] transition-colors"
                          >
                            <Icon size={14} />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(img.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(5,5,14,0.5)] flex items-center justify-center transition-colors"
                    >
                      <Heart
                        size={13}
                        color={favorites.includes(img.id) ? '#EF4444' : '#8B8B9E'}
                        fill={favorites.includes(img.id) ? '#EF4444' : 'none'}
                      />
                    </button>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[rgba(5,5,14,0.9)] to-transparent">
                      <p className="text-[10px] text-[#8B8B9E] truncate">{img.prompt}</p>
                      <span className="text-[10px] text-[#4A4A5E]">{img.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Asset Library */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5 h-full">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-display text-[16px] font-semibold text-white">
                Bibliothèque
              </h3>
              <div className="flex items-center gap-2">
                {/* Filter Tabs */}
                <div className="flex rounded-lg overflow-hidden border border-[#1E1E2D]">
                  {assetFilters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setAssetFilter(f)}
                      className="px-2.5 py-1 text-[11px] font-medium transition-all"
                      style={{
                        background: assetFilter === f ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                        color: assetFilter === f ? '#06B6D4' : '#8B8B9E',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="search-pill mb-3 w-full">
              <Search size={14} color="#4A4A5E" />
              <input
                type="text"
                placeholder="Rechercher un asset..."
                className="bg-transparent border-none outline-none text-white text-[12px] w-full"
              />
            </div>

            {/* Asset List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={assetFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredAssets.map((asset, i) => (
                  <motion.div
                    key={asset.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[rgba(6,182,212,0.04)] transition-colors group cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: asset.color }}
                    >
                      {asset.type === 'image' ? <FileImage size={16} color="#06B6D4" /> :
                       asset.type === 'video' ? <FileVideo size={16} color="#8B5CF6" /> :
                       <Layers size={16} color="#F59E0B" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white font-medium truncate">{asset.name}</p>
                      <p className="text-[11px] text-[#4A4A5E]">{asset.size} · {asset.date}</p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background:
                          asset.type === 'image' ? 'rgba(6, 182, 212, 0.15)' :
                          asset.type === 'video' ? 'rgba(139, 92, 246, 0.15)' :
                          'rgba(245, 158, 11, 0.15)',
                        color:
                          asset.type === 'image' ? '#06B6D4' :
                          asset.type === 'video' ? '#8B5CF6' :
                          '#F59E0B',
                      }}
                    >
                      {asset.type === 'image' ? 'Image' : asset.type === 'video' ? 'Vidéo' : 'Template'}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center text-[#8B8B9E] hover:text-white hover:bg-[rgba(255,255,255,0.1)]">
                      <Download size={13} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Templates + Brand Kit ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Recent Templates */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-[16px] font-semibold text-white">
                Modèles Récents
              </h3>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-lg border border-[#1E1E2D] flex items-center justify-center text-[#8B8B9E] hover:text-white transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-7 h-7 rounded-lg border border-[#1E1E2D] flex items-center justify-center text-[#8B8B9E] hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((tmpl, i) => (
                <motion.div
                  key={tmpl.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTemplate(i)}
                >
                  <div
                    className="rounded-lg aspect-video mb-2 flex items-center justify-center relative overflow-hidden border border-[#1E1E2D] group-hover:border-[rgba(6,182,212,0.3)] transition-colors"
                    style={{ background: tmpl.color }}
                  >
                    <Palette size={20} color="#4A4A5E" opacity={0.5} />
                    <div className="absolute inset-0 bg-[rgba(5,5,14,0.6)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[11px] text-white font-medium">Utiliser</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-white font-medium truncate">{tmpl.name}</p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5"
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#8B5CF6',
                    }}
                  >
                    {tmpl.category}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Brand Kit */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={1} className="gal-card p-5">
            <h3 className="font-display text-[16px] font-semibold text-white mb-4">
              Kit de Marque
            </h3>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-[11px] text-[#8B8B9E] uppercase tracking-wider mb-2">Couleurs</p>
              <div className="flex gap-3">
                {brandColors.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-white transition-colors"
                      style={{ background: c.hex, boxShadow: `0 0 8px ${c.hex}40` }}
                      title={`${c.name}: ${c.hex}`}
                    />
                    <span className="text-[9px] text-[#4A4A5E] font-mono-data">{c.hex}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="mb-4">
              <p className="text-[11px] text-[#8B8B9E] uppercase tracking-wider mb-2">Typographies</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Type size={14} color="#06B6D4" />
                  <div>
                    <p className="text-[13px] text-white font-display">Space Grotesk</p>
                    <p className="text-[10px] text-[#4A4A5E]">Titres, headings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Type size={14} color="#8B5CF6" />
                  <div>
                    <p className="text-[13px] text-white" style={{ fontFamily: 'Inter' }}>Inter</p>
                    <p className="text-[10px] text-[#4A4A5E]">Corps de texte, UI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div>
              <p className="text-[11px] text-[#8B8B9E] uppercase tracking-wider mb-2">Logo</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}
                >
                  <span className="font-display text-[14px] font-bold text-white">LNR</span>
                </div>
                <div className="flex gap-2">
                  {['Clair', 'Sombre', 'Icône'].map((variant) => (
                    <div
                      key={variant}
                      className="w-8 h-8 rounded border border-[#1E1E2D] flex items-center justify-center cursor-pointer hover:border-[#06B6D4] transition-colors"
                      style={{ background: variant === 'Clair' ? '#FFFFFF' : '#0A0A1A' }}
                    >
                      <span
                        className="font-display text-[8px] font-bold"
                        style={{ color: variant === 'Clair' ? '#0A0A1A' : '#FFFFFF' }}
                      >
                        LNR
                      </span>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-[#1E1E2D] text-[10px] text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] transition-colors ml-auto">
                  <Upload size={10} />
                  Importer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Quick Editor ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} custom={0} className="gal-card p-5">
          <h3 className="font-display text-[16px] font-semibold text-white mb-4">
            Éditeur Rapide
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Recadrer', icon: Maximize },
              { label: 'Filtres', icon: Palette },
              { label: 'Texte', icon: Type },
              { label: 'Ajuster', icon: Zap },
              { label: 'Retoucher IA', icon: Wand2 },
            ].map((tool) => (
              <button
                key={tool.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1E1E2D] text-[12px] text-[#8B8B9E] hover:text-white hover:border-[#06B6D4] hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all"
              >
                <tool.icon size={14} />
                {tool.label}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-[#1E1E2D] flex items-center justify-center py-12">
            <div className="text-center">
              <Image size={32} color="#4A4A5E" className="mx-auto mb-2" />
              <p className="text-[13px] text-[#8B8B9E]">Sélectionnez un asset pour commencer l'édition</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
