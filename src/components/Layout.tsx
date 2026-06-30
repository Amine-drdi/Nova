import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import SpaceBackground from './SpaceBackground';
import Sidebar from './Sidebar';
import KimiWidget from './KimiWidget';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const pageNames: Record<string, string> = {
  '/': 'Tableau de Bord',
  '/dashboard': 'Tableau de Bord',
  '/seo': 'SEO',
  '/geo': 'Géolocalisation',
  '/competitors': 'Compétiteurs',
  '/sitebuilder': 'SiteBuilder',
  '/google-ads': 'Google Ads',
  '/meta-ads': 'Meta Ads',
  '/email': 'Email Marketing',
  '/social': 'Social Media',
  '/visual': 'Création Visuelle',
  '/crm': 'CRM',
  '/cpl-roi': 'CPL / ROI',
  '/ab-testing': 'A/B Testing',
  '/cyber': 'Cybersécurité',
  '/reporting': 'Reporting',
  '/strategy': 'Stratégie',
  '/onboarding': 'Onboarding',
  '/settings': 'Paramètres',
  '/crm-connect': 'CRM Connect',
  '/mission-control': 'Mission Control',
};

export default function Layout() {
  const location = useLocation();
  const pageTitle = pageNames[location.pathname] || 'Page';
  const [searchValue, setSearchValue] = useState('');

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ minHeight: '100dvh', background: '#05050e', position: 'relative' }}>
      {/* Cosmic Background */}
      <SpaceBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease, delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 260,
          right: 0,
          height: 56,
          background: '#0A0A1A',
          borderBottom: '1px solid #1E1E2D',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Breadcrumb / Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {pageTitle}
          </h1>
        </div>

        {/* Center: Search */}
        <div className="search-pill" style={{ width: 360 }}>
          <Search size={16} color="#4A4A5E" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Rechercher..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              width: '100%',
            }}
          />
        </div>

        {/* Right: Notification + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid #1E1E2D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#8B8B9E',
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              e.currentTarget.style.color = '#06B6D4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1E1E2D';
              e.currentTarget.style.color = '#8B8B9E';
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#EF4444',
                border: '2px solid #0A0A1A',
              }}
              className="pulse-dot"
            />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: '#FFFFFF',
              }}
            >
              LN
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                  color: '#FFFFFF',
                }}
              >
                LNR Finance
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: '#4A4A5E',
                }}
              >
                {today}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease, delay: 0.3 }}
        style={{
          marginLeft: 260,
          paddingTop: 56,
          minHeight: '100dvh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
          <Outlet />
        </div>
      </motion.main>

      {/* Contextual Dock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.5 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 260,
          right: 0,
          height: 64,
          background: '#0A0A1A',
          borderTop: '1px solid #1E1E2D',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#4A4A5E',
            }}
          >
            {location.pathname === '/dashboard' || location.pathname === '/'
              ? 'Vue d\'ensemble active'
              : `Module: ${pageTitle}`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className="pulse-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22C55E',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: '#8B8B9E',
              }}
            >
              Tous les systèmes opérationnels
            </span>
          </div>
          <div
            style={{
              width: 1,
              height: 20,
              background: '#1E1E2D',
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#4A4A5E',
            }}
          >
            Dernière sync: il y a 2 min
          </span>
        </div>

        <button className="btn-neon">Nouvelle Action</button>
      </motion.div>

      {/* Kimi AI Widget */}
      <KimiWidget />
    </div>
  );
}
