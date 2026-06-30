import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  MapPin,
  Swords,
  Code2,
  Target,
  Globe,
  Mail,
  Share2,
  Palette,
  Users,
  TrendingUp,
  FlaskConical,
  Shield,
  FileText,
  Lightbulb,
  Rocket,
  Settings,
  Plug,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'GROWTH',
    items: [
      { label: 'Tableau de Bord', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'SEO', path: '/seo', icon: <Search size={20} /> },
      { label: 'Geo', path: '/geo', icon: <MapPin size={20} /> },
      { label: 'Competitors', path: '/competitors', icon: <Swords size={20} /> },
      { label: 'SiteBuilder', path: '/sitebuilder', icon: <Code2 size={20} /> },
    ],
  },
  {
    title: 'PAID',
    items: [
      { label: 'Google Ads', path: '/google-ads', icon: <Target size={20} /> },
      { label: 'Meta Ads', path: '/meta-ads', icon: <Globe size={20} /> },
      { label: 'Email', path: '/email', icon: <Mail size={20} /> },
      { label: 'Social', path: '/social', icon: <Share2 size={20} /> },
    ],
  },
  {
    title: 'CREATIF',
    items: [
      { label: 'Visual', path: '/visual', icon: <Palette size={20} /> },
      { label: 'CRM', path: '/crm', icon: <Users size={20} /> },
      { label: 'CPL / ROI', path: '/cpl-roi', icon: <TrendingUp size={20} /> },
      { label: 'A/B Testing', path: '/ab-testing', icon: <FlaskConical size={20} /> },
    ],
  },
  {
    title: 'SYSTEME',
    items: [
      { label: 'Cyber', path: '/cyber', icon: <Shield size={20} /> },
      { label: 'Reporting', path: '/reporting', icon: <FileText size={20} /> },
      { label: 'Strategy', path: '/strategy', icon: <Lightbulb size={20} /> },
      { label: 'Onboarding', path: '/onboarding', icon: <Rocket size={20} /> },
      { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ],
  },
  {
    title: 'CONNECT',
    items: [
      { label: 'CRM Connect', path: '/crm-connect', icon: <Plug size={20} /> },
      { label: 'Mission Control', path: '/mission-control', icon: <Terminal size={20} /> },
    ],
  },
];

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isActive =
    item.path === '/dashboard'
      ? location.pathname === '/' || location.pathname === '/dashboard'
      : location.pathname === item.path;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      style={{ textDecoration: 'none' }}
    >
      <div
        className={isActive ? 'sidebar-nav-active' : 'sidebar-nav-item'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 40,
          padding: collapsed ? '0 18px' : '0 16px',
          borderRadius: 8,
          background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
          color: isActive ? '#06B6D4' : '#8B8B9E',
          fontFamily: "'Inter', sans-serif",
          fontWeight: isActive ? 600 : 500,
          fontSize: 13,
          lineHeight: 1.4,
          borderLeft: isActive ? '3px solid #06B6D4' : '3px solid transparent',
          transition: 'background 0.15s ease, color 0.15s ease',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = '#1A1A2E';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#8B8B9E';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 20 }}>
          {item.icon}
        </span>
        {!collapsed && <span>{item.label}</span>}
      </div>
    </NavLink>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: collapsed ? 64 : 260,
        background: '#0A0A1A',
        borderRight: '1px solid #1E1E2D',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          height: 56,
          borderBottom: '1px solid #1E1E2D',
          flexShrink: 0,
        }}
      >
        <img
          src="/logo-nova.png"
          alt="NOVA"
          style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }}
        />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#06B6D4',
              letterSpacing: '-0.02em',
            }}
          >
            NOVA
          </motion.span>
        )}
      </div>

      {/* Nav Groups */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div
                style={{
                  padding: '4px 16px 8px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 11,
                  lineHeight: 1.4,
                  letterSpacing: '0.02em',
                  color: '#4A4A5E',
                  textTransform: 'uppercase',
                }}
              >
                {group.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => (
                <NavItemComponent key={item.path} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div
        style={{
          padding: '8px',
          borderTop: '1px solid #1E1E2D',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid #1E1E2D',
            borderRadius: 8,
            color: '#8B8B9E',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
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
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Reduire</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
