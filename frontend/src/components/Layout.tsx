import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Sword, Clock, HelpCircle, Menu, X, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps { children: ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Apply Amharic body class for font switching
  useEffect(() => {
    document.body.classList.toggle('lang-am', lang === 'am');
    document.documentElement.lang = lang === 'am' ? 'am' : 'en';
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const NAV_LINKS = [
    { to: '/',          label: t('nav.home'),     icon: <Home size={16} /> },
    { to: '/story',     label: t('nav.story'),    icon: <BookOpen size={16} /> },
    { to: '/chat',      label: t('nav.chat'),     icon: <MessageSquare size={16} /> },
    { to: '/strategy',  label: t('nav.strategy'), icon: <Sword size={16} /> },
    { to: '/timeline',  label: t('nav.timeline'), icon: <Clock size={16} /> },
    { to: '/quiz',      label: t('nav.quiz'),     icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Navigation ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.4s ease',
          background: scrolled ? 'rgba(8,10,12,0.92)' : 'rgba(8,10,12,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(212,175,55,0.18)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Ethiopian flag stripe */}
        <div style={{
          height: 3,
          background: 'linear-gradient(to right, #1a5c38 33.33%, #d4af37 33.33%, #d4af37 66.66%, #8b0000 66.66%)',
        }} />

        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 2rem' }}
        >
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #8b6914)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(212,175,55,0.35)', flexShrink: 0,
              overflow: 'hidden', border: '1.5px solid rgba(212,175,55,0.5)'
            }}>
              <img 
                src="/image/logo.png" 
                alt="Adwa AI Logo" 
                style={{ width: '110%', height: '110%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--gold)', letterSpacing: '0.02em' }}>
                {lang === 'am' ? 'ዓድዋ AI' : 'Adwa AI'}
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {lang === 'am' ? 'ትምህርት ማዕከል' : 'Learning Hub'}
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.42rem 0.85rem', borderRadius: 8,
                  fontSize: lang === 'am' ? '0.82rem' : '0.83rem',
                  fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--gold)' : 'var(--text-dim)',
                  background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                })}
              >
                {icon}
                <span className="hidden-xs">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right side: Language switcher + CTA + Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LanguageSwitcher />
            <NavLink
              to="/story"
              className="btn-primary"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: lang === 'am' ? '0.78rem' : '0.83rem',
                fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit',
              }}
            >
              {t('nav.cta')}
            </NavLink>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8, padding: '0.45rem',
                color: 'var(--text-dim)', display: 'none',
              }}
              className="mobile-only-btn"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(8,10,12,0.98)', borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
          }}>
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMobile}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 10,
                  fontSize: '0.95rem', fontWeight: 500,
                  fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit',
                  color: isActive ? 'var(--gold)' : 'var(--text-dim)',
                  background: isActive ? 'rgba(212,175,55,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                  textDecoration: 'none',
                })}
              >
                {icon} {label}
              </NavLink>
            ))}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Content ── */}
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', marginTop: '6rem', background: 'rgba(6,7,8,0.95)' }}>
        <div style={{ height: 4, background: 'linear-gradient(to right, #1a5c38 33.33%, #d4af37 33.33%, #d4af37 66.66%, #8b0000 66.66%)', opacity: 0.7 }} />

        <div className="container" style={{ padding: '3.5rem 2rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: 38, height: 38, borderRadius: '50%', 
                background: 'linear-gradient(135deg, #d4af37, #8b6914)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)'
              }}>
                <img 
                  src="/image/logo.png" 
                  alt="Adwa AI Logo" 
                  style={{ width: '110%', height: '110%', objectFit: 'cover' }} 
                />
              </div>
              <span style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>
                {lang === 'am' ? 'ዓድዋ AI ትምህርት ማዕከል' : 'Adwa AI Learning Hub'}
              </span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', maxWidth: 260, lineHeight: 1.7, fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit' }}>
              {t('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {['🇪🇹', '🏆', '⚔️'].map((em, i) => (<span key={i} style={{ fontSize: '1.2rem' }}>{em}</span>))}
            </div>
          </div>

          {/* Explore */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.25rem' }}>{t('footer.explore')}</span>
            {NAV_LINKS.slice(1).map(({ to, label }) => (
              <NavLink key={to} to={to} style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              >{label}</NavLink>
            ))}
          </div>

          {/* History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.25rem' }}>{t('footer.history')}</span>
            {[t('footer.context'), t('footer.leaders'), t('footer.victory'), t('footer.legacy')].map(item => (
              <a key={item} href="#" style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              >{item}</a>
            ))}
          </div>

          {/* About */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.25rem' }}>{t('footer.about')}</span>
            {[t('footer.mission'), t('footer.share'), t('footer.resources'), t('footer.feedback')].map(item => (
              <a key={item} href="#" style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              >{item}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : 'inherit' }}>
          {t('footer.copyright')}
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-only-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .hidden-xs { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
