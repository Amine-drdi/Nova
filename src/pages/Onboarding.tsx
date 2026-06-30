import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Link2, Search, Users, Rocket, ChevronRight, ChevronLeft,
  Check, Globe, Target, BarChart3, Megaphone, Hash, Mail,
  Linkedin, Zap, X, Plus, Sparkles, Shield, TrendingUp, FileText,
  Eye, Trash2
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
const steps = [
  { key: 'profile', label: 'Profil', icon: Building2 },
  { key: 'tools', label: 'Outils', icon: Link2 },
  { key: 'seo', label: 'Config SEO', icon: Search },
  { key: 'team', label: 'Équipe', icon: Users },
  { key: 'launch', label: 'Lancement', icon: Rocket },
];

const integrations = [
  { id: 'ga4', name: 'Google Analytics 4', icon: BarChart3, desc: 'Tracking web & conversions', connected: true },
  { id: 'gsc', name: 'Google Search Console', icon: Search, desc: 'Performance SEO & indexation', connected: true },
  { id: 'gads', name: 'Google Ads', icon: Target, desc: 'Campagnes PPC & remarketing', connected: false },
  { id: 'meta', name: 'Meta Ads', icon: Megaphone, desc: 'Facebook & Instagram ads', connected: false },
  { id: 'hubspot', name: 'HubSpot', icon: Mail, desc: 'CRM & email marketing', connected: false },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: Linkedin, desc: 'Campagnes B2B professionnelles', connected: false },
];

const sectors = [
  'E-commerce', 'SaaS', 'Services', 'Immobilier', 'Restauration',
  'Santé', 'Finance', 'Éducation', 'Tourisme', 'Industrie',
  'Automobile', 'Mode', 'Technologie', 'Agroalimentaire', 'Autre',
];

/* ── Confetti Component ── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    color: string; size: number; rotation: number; rotSpeed: number;
  }>>([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#06B6D4', '#8B5CF6', '#22C55E', '#EC4899', '#F59E0B', '#3B82F6', '#EF4444'];
    particlesRef.current = Array.from({ length: 150 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 25 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
    }));

    const gravity = 0.4;
    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (frame < 300) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 200, pointerEvents: 'none',
      }}
    />
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [launched, setLaunched] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [website, setWebsite] = useState('');
  const [targetCountry, setTargetCountry] = useState('France');
  const [budget, setBudget] = useState('');

  const [connectedTools, setConnectedTools] = useState<Record<string, boolean>>({
    ga4: true, gsc: true, gads: false, meta: false, hubspot: false, linkedin: false,
  });

  const [keywords, setKeywords] = useState<string[]>(['agence marketing digital', 'référencement Paris']);
  const [keywordInput, setKeywordInput] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['competiteur1.fr', 'competiteur2.fr']);
  const [competitorInput, setCompetitorInput] = useState('');

  const [teamMembers, setTeamMembers] = useState<{ email: string; role: string }[]>([
    { email: '', role: 'Manager' },
  ]);

  const goNext = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const toggleTool = (id: string) => {
    setConnectedTools(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (k: string) => {
    setKeywords(keywords.filter(kw => kw !== k));
  };

  const addCompetitor = () => {
    if (competitorInput.trim() && !competitors.includes(competitorInput.trim())) {
      setCompetitors([...competitors, competitorInput.trim()]);
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (c: string) => {
    setCompetitors(competitors.filter(comp => comp !== c));
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { email: '', role: 'Éditeur' }]);
  };

  const updateTeamMember = (idx: number, field: 'email' | 'role', value: string) => {
    const next = [...teamMembers];
    next[idx][field] = value;
    setTeamMembers(next);
  };

  const removeTeamMember = (idx: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleLaunch = () => {
    setLaunched(true);
    setTimeout(() => {
      // Would redirect to dashboard
    }, 2500);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="max-w-[720px] mx-auto">
      <ConfettiCanvas active={launched} />

      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {launched ? 'Bienvenue sur NOVA !' : 'Configuration'}
        </h1>
        <p className="text-sm" style={{ color: '#4A4A5E' }}>
          {launched ? 'Votre plateforme est prête. Redirection en cours...' : "Configurez votre compte en quelques étapes"}
        </p>
      </motion.div>

      {/* Stepper */}
      {!launched && (
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="flex items-center justify-center"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: i < step ? '#22C55E' : i === step ? '#06B6D4' : 'transparent',
                      border: i > step ? '2px solid #1E1E2D' : 'none',
                      boxShadow: i === step ? '0 0 12px rgba(6,182,212,0.5)' : 'none',
                    }}
                    animate={i === step ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {i < step ? <Check size={18} color="white" /> :
                      i === step ? <s.icon size={18} color="white" /> :
                      <span style={{ color: '#4A4A5E', fontSize: 14, fontWeight: 600 }}>{i + 1}</span>
                    }
                  </motion.div>
                  <span className="text-xs mt-1" style={{
                    color: i === step ? '#06B6D4' : i < step ? '#22C55E' : '#4A4A5E',
                    fontWeight: i === step ? 600 : 400,
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 mb-5" style={{ width: 40, height: 2, background: i < step ? '#22C55E' : '#1E1E2D' }} />
                )}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="gal-progress-track mt-4 mx-auto" style={{ maxWidth: 400 }}>
            <motion.div
              className="gal-progress-fill"
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
          <div className="text-center mt-2 text-xs" style={{ color: '#4A4A5E' }}>
            Étape {step + 1} sur 5
          </div>
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease }}
        >
          {step === 0 && (
            <div className="gal-card p-6">
              <h2 className="text-xl font-semibold text-white mb-1">Parlez-nous de votre entreprise</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A5E' }}>Ces informations nous aideront à personnaliser votre expérience</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block" style={{ color: '#8B8B9E' }}>Nom de l'entreprise *</label>
                  <input className="gal-input w-full" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Mon Entreprise SAS" />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block" style={{ color: '#8B8B9E' }}>Site web</label>
                  <input className="gal-input w-full" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.monentreprise.fr" />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block" style={{ color: '#8B8B9E' }}>Secteur d'activité</label>
                  <select className="gal-input w-full" value={sector} onChange={e => setSector(e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider mb-1 block" style={{ color: '#8B8B9E' }}>Pays cible</label>
                    <select className="gal-input w-full" value={targetCountry} onChange={e => setTargetCountry(e.target.value)}>
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Canada</option>
                      <option>Luxembourg</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider mb-1 block" style={{ color: '#8B8B9E' }}>Budget mensuel estimé (€)</label>
                    <input className="gal-input w-full" value={budget} onChange={e => setBudget(e.target.value)} placeholder="5000" type="number" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="gal-card p-6">
              <h2 className="text-xl font-semibold text-white mb-1">Connectez vos outils</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A5E' }}>Liez vos comptes pour une vue centralisée</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrations.map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    custom={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="gal-card p-4 flex items-center gap-3"
                    style={{
                      border: connectedTools[tool.id] ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(30,30,45,0.8)',
                    }}
                  >
                    <tool.icon size={24} color={connectedTools[tool.id] ? '#22C55E' : '#8B8B9E'} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{tool.name}</div>
                      <div className="text-xs" style={{ color: '#4A4A5E' }}>{tool.desc}</div>
                    </div>
                    {connectedTools[tool.id] ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                        <Check size={16} color="#22C55E" />
                        <span className="badge-glow-success" style={{ fontSize: 10 }}>Connecté</span>
                      </motion.div>
                    ) : (
                      <button className="btn-secondary text-xs py-1 px-3" onClick={() => toggleTool(tool.id)}>Connecter</button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="gal-card p-6">
              <h2 className="text-xl font-semibold text-white mb-1">Configurez vos campagnes</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A5E' }}>Définissez vos premiers objectifs et paramètres</p>

              <div className="space-y-6">
                {/* SEO Config */}
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: '#8B8B9E' }}>Mots-clés cibles (5-10 recommandés)</label>
                  <div className="gal-input w-full flex flex-wrap gap-1 items-center min-h-[42px] p-1">
                    {keywords.map(k => (
                      <motion.span
                        key={k}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 badge-glow-info"
                        style={{ fontSize: 11, padding: '2px 8px' }}
                      >
                        {k}
                        <X size={10} className="cursor-pointer" onClick={() => removeKeyword(k)} />
                      </motion.span>
                    ))}
                    <input
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm min-w-[120px]"
                      style={{ color: '#FFFFFF' }}
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      placeholder="Entrer un mot-clé..."
                    />
                  </div>
                </div>

                {/* Competitors */}
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: '#8B8B9E' }}>Concurrents à surveiller (3 recommandés)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="gal-input flex-1"
                      value={competitorInput}
                      onChange={e => setCompetitorInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                      placeholder="example.com"
                    />
                    <button className="btn-secondary py-2 px-3" onClick={addCompetitor}><Plus size={16} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {competitors.map(c => (
                      <motion.span
                        key={c}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 badge-glow-neutral"
                        style={{ fontSize: 11 }}
                      >
                        {c}
                        <X size={10} className="cursor-pointer" onClick={() => removeCompetitor(c)} />
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Objectif */}
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: '#8B8B9E' }}>Objectif principal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Trafic', 'Conversions', 'Notoriété'].map(obj => (
                      <button key={obj} className="gal-card p-2 text-center text-sm text-white hover:border-[#06B6D4] transition-colors">
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="gal-card p-6">
              <h2 className="text-xl font-semibold text-white mb-1">Invitez votre équipe</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A5E' }}>Ajoutez des collaborateurs avec des droits adaptés</p>

              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-2 items-center"
                  >
                    <input
                      className="gal-input flex-1"
                      placeholder="email@entreprise.fr"
                      value={member.email}
                      onChange={e => updateTeamMember(i, 'email', e.target.value)}
                      type="email"
                    />
                    <select
                      className="gal-input"
                      value={member.role}
                      onChange={e => updateTeamMember(i, 'role', e.target.value)}
                      style={{ width: 120 }}
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Éditeur</option>
                      <option>Lecteur</option>
                    </select>
                    {teamMembers.length > 1 && (
                      <button className="btn-secondary py-2 px-2" onClick={() => removeTeamMember(i)}><Trash2 size={14} color="#EF4444" /></button>
                    )}
                  </motion.div>
                ))}
                <button className="btn-secondary text-xs flex items-center gap-1" onClick={addTeamMember}>
                  <Plus size={14} /> Ajouter un membre
                </button>
              </div>

              {/* Permission matrix */}
              <div className="mt-6">
                <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#4A4A5E' }}>Matrice des permissions</h4>
                <div className="overflow-x-auto">
                  <table className="gal-table">
                    <thead>
                      <tr>
                        <th>Page</th>
                        <th>Admin</th>
                        <th>Manager</th>
                        <th>Éditeur</th>
                        <th>Lecteur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Tableau de bord', 'SEO', 'Google Ads', 'Meta Ads', 'Reporting'].map(page => (
                        <tr key={page}>
                          <td className="text-white text-sm">{page}</td>
                          <td><Check size={14} color="#22C55E" /></td>
                          <td><Check size={14} color="#22C55E" /></td>
                          <td>{page === 'Reporting' ? <X size={14} color="#EF4444" /> : <Check size={14} color="#22C55E" />}</td>
                          <td><Check size={14} color="#22C55E" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="gal-card p-6">
              <h2 className="text-xl font-semibold text-white mb-1">Tout est prêt !</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A5E' }}>Vérifiez vos paramètres avant de lancer</p>

              <div className="space-y-3">
                {/* Profile summary */}
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="gal-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} color="#06B6D4" />
                      <span className="text-sm font-medium text-white">Profil Entreprise</span>
                    </div>
                    <button className="text-xs" style={{ color: '#06B6D4' }} onClick={() => setStep(0)}>Modifier</button>
                  </div>
                  <div className="text-xs" style={{ color: '#8B8B9E' }}>
                    {companyName || 'Non renseigné'} — {sector || 'Secteur non défini'} — {targetCountry}
                  </div>
                </motion.div>

                {/* Tools summary */}
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="gal-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Link2 size={16} color="#8B5CF6" />
                      <span className="text-sm font-medium text-white">Connexions</span>
                    </div>
                    <button className="text-xs" style={{ color: '#06B6D4' }} onClick={() => setStep(1)}>Modifier</button>
                  </div>
                  <div className="text-xs" style={{ color: '#8B8B9E' }}>
                    {Object.values(connectedTools).filter(Boolean).length} / 6 outils connectés
                  </div>
                </motion.div>

                {/* SEO summary */}
                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="gal-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Search size={16} color="#22C55E" />
                      <span className="text-sm font-medium text-white">Configuration</span>
                    </div>
                    <button className="text-xs" style={{ color: '#06B6D4' }} onClick={() => setStep(2)}>Modifier</button>
                  </div>
                  <div className="text-xs" style={{ color: '#8B8B9E' }}>
                    {keywords.length} mots-clés — {competitors.length} concurrents — Budget: {budget || '0'}€
                  </div>
                </motion.div>

                {/* Team summary */}
                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="gal-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} color="#F59E0B" />
                      <span className="text-sm font-medium text-white">Équipe</span>
                    </div>
                    <button className="text-xs" style={{ color: '#06B6D4' }} onClick={() => setStep(3)}>Modifier</button>
                  </div>
                  <div className="text-xs" style={{ color: '#8B8B9E' }}>
                    {teamMembers.filter(m => m.email).length} membre(s) invité(s)
                  </div>
                </motion.div>
              </div>

              {/* Launch Button */}
              <motion.button
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={handleLaunch}
                className="btn-neon w-full mt-6 flex items-center justify-center gap-2 py-4 text-lg"
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket size={20} /> Lancer NOVA
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!launched && (
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mt-6">
          <button
            onClick={goBack}
            className="btn-secondary flex items-center gap-1"
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={16} /> Retour
          </button>
          <button onClick={goNext} className="btn-neon flex items-center gap-1">
            {step === 4 ? 'Terminer' : 'Continuer'} <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
