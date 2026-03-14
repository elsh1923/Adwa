import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      id="language-switcher"
      role="group"
      aria-label="Language selector"
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: 99,
        padding: '3px',
        gap: '2px',
        flexShrink: 0,
      }}
    >
      <button
        id="lang-en-btn"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        title="Switch to English"
        style={{
          padding: '0.35rem 0.75rem',
          borderRadius: 99,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          transition: 'all 0.25s ease',
          background: lang === 'en' ? 'linear-gradient(135deg, #d4af37, #a88820)' : 'transparent',
          color: lang === 'en' ? '#0a0800' : 'var(--text-dim)',
          boxShadow: lang === 'en' ? '0 2px 8px rgba(212,175,55,0.35)' : 'none',
        }}
      >
        EN
      </button>
      <button
        id="lang-am-btn"
        onClick={() => setLang('am')}
        aria-pressed={lang === 'am'}
        title="ወደ አማርኛ ቀይር"
        style={{
          padding: '0.35rem 0.75rem',
          borderRadius: 99,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          fontFamily: 'Noto Serif Ethiopic, serif',
          transition: 'all 0.25s ease',
          background: lang === 'am' ? 'linear-gradient(135deg, #d4af37, #a88820)' : 'transparent',
          color: lang === 'am' ? '#0a0800' : 'var(--text-dim)',
          boxShadow: lang === 'am' ? '0 2px 8px rgba(212,175,55,0.35)' : 'none',
        }}
      >
        አማ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
