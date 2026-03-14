import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Map, Sword, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StrategyPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const amFont = lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : undefined;
  const [activeTab, setActiveTab] = useState<'ethiopian' | 'italian' | 'geography'>('ethiopian');

  const strategies = {
    ethiopian: {
      title: t('strategy.eth_title'),
      icon: <Shield size={38} style={{ color: 'var(--gold)' }} />,
      color: '#d4af37',
      content: lang === 'am' ? [
        { topic: 'ኅብረትና ወታደር ማሰባሰብ', text: 'ዳግማዊ ዓፄ ምኒልክ ከ፻,ሺ በላይ ወታደሮችን ከሁሉም ብሔሮች ሰብስበው አሰለፉ — ቅኝ ሰርያዊ ኢጣሊያን ፊቷ ቀቋ።' },
        { topic: 'ምድር ማቃጠልና አቅርቦት', text: 'ኢትዮጵያን ምድሩን ጠንቅቀው ያውቁ ነበር — ኢጣሊያኖቹ ቀደም ብለው ወደ ሸለቆዎቹ ሲጓዙ አቅርቦቶቻቸው እያለቀ ሄዱ።' },
        { topic: 'የእቴጌ ጣይቱ ሚና', text: 'እቴጌ ጣይቱ ብጡል ራሳቸው ሰሜናቸውን ጣሉ — ኢጣሊያኖቹ ውሃ ሊጠጡ የሚረዱ ምንጭ ቆርጠው ዓድዋ ወደ ሚሄዱበት ቦታ አስገደዷቸው።' },
      ] : [
        { topic: 'Unity & Mobilization', text: 'Emperor Menelik II gathered over 100,000 troops from diverse ethnicities across Ethiopia, creating a unified front against colonialism.' },
        { topic: 'Scorched Earth & Logistics', text: 'Ethiopians used their knowledge of the land to deplete Italian provisions and led the enemy into a strategic trap.' },
        { topic: 'Role of Empress Taytu', text: 'Empress Taytu led her own battalion; cutting Italian water supply at Mekelle forced them toward Adwa under duress.' },
      ],
    },
    italian: {
      title: t('strategy.ita_title'),
      icon: <Sword size={38} style={{ color: '#8b0000' }} />,
      color: '#8b0000',
      content: lang === 'am' ? [
        { topic: 'የተሳሳተ መረጃ', text: 'ጄኔራል ባራቲዬሪ ስህተተኛ ካርታ ሲጫወቱ ሦስቱ ብርጌዶቻቸው ሌሊቱን ጠፋ — ሸለቆዎቹ እርሳቸውን አጣቷቸው።' },
        { topic: 'ዝቅ ማድረግ', text: 'ኢጣሊያኖቹ የኢትዮጵያ ጦርን አንጠፋሮ ደካሞ አድርጌ ነበር — ፻ ሺ ተዋጊ ሆነ የጠበቁት!።' },
        { topic: 'ተቀዳዳሚ ትዕዛዝ', text: 'ከሮም ጫና እና ከጄኔራሎቹ ሽቦ ሽቦ ሁኔታ አጥ ተቀናጀ ጥቃት አደረጉ።' },
      ] : [
        { topic: 'Faulty Intelligence', text: 'General Baratieri used inaccurate maps; three brigades lost contact during the night march across rugged terrain.' },
        { topic: 'Underestimation', text: 'Italians believed they faced a disorganized rabble — instead they met 100,000 well-equipped warriors.' },
        { topic: 'Divided Command', text: 'Political pressure from Rome and rivalry among generals led to a rushed, poorly coordinated offensive.' },
      ],
    },
    geography: {
      title: t('strategy.geo_title'),
      icon: <Map size={38} style={{ color: 'var(--green-soft)' }} />,
      color: '#2e8b57',
      content: lang === 'am' ? [
        { topic: 'ተራሮቹ', text: 'ዓድዋ ተዘበራርቆ ፣ ቋጥኝ ባለ ተራሮቿ ተጨናንቃ ትኖራለች — ይህ ምን ጥቅም ነበረው? ኢትዮጵያ ከፍ ካለ ቦታ ሆናቸው።' },
        { topic: 'የጠፉ ግንኙነቶች', text: 'ጥልቅ ሸለቆዎቹ የኢጣሊያ ብርጌዶቹ ሌሎቻቸውን ማየት አልቻሉም — ኢትዮጵያ አሁን ሁሉን በቀናቸው ጦርነቱ።' },
      ] : [
        { topic: 'The Mountains', text: 'Adwa is surrounded by jagged, volcanic mountains favoring Ethiopian high-ground positions and local knowledge.' },
        { topic: 'Communication Breakdown', text: 'Deep valleys and steep ridges prevented Italian columns from seeing or supporting each other.' },
      ],
    },
  };

  const current = strategies[activeTab];

  const tabs = [
    { key: 'ethiopian', label: t('strategy.tab_eth') },
    { key: 'italian',   label: t('strategy.tab_ita') },
    { key: 'geography', label: t('strategy.tab_geo') },
  ] as const;

  return (
    <div style={{ padding: '3rem 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="section-eyebrow" style={{ fontFamily: amFont }}>⚔️ {lang === 'am' ? 'ወታደራዊ ትንታኔ' : 'Military Analysis'}</div>
        <h2 className="section-title" style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : undefined }}>{t('strategy.title')}</h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 580, margin: '0 auto', lineHeight: 1.8, fontFamily: amFont }}>{t('strategy.subtitle')}</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '0.65rem 1.75rem', borderRadius: 99, fontWeight: 700, fontFamily: amFont,
              fontSize: lang === 'am' ? '0.85rem' : '0.9rem',
              transition: 'var(--transition)', cursor: 'pointer',
              background: activeTab === key ? `linear-gradient(135deg, ${strategies[key].color}, ${strategies[key].color}99)` : 'rgba(255,255,255,0.04)',
              color: activeTab === key ? (key === 'ethiopian' ? '#0a0800' : '#fff') : 'var(--text-dim)',
              border: activeTab === key ? 'none' : '1px solid var(--border-subtle)',
              boxShadow: activeTab === key ? `0 4px 20px ${strategies[key].color}40` : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content card */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'rgba(14,16,20,0.8)', border: `1px solid ${current.color}25`, borderRadius: 24, padding: '2.5rem', boxShadow: `0 0 40px ${current.color}08` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }} className="strategy-grid">
          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: `${current.color}12`, border: `1px solid ${current.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {current.icon}
            </div>
            <h3 style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
              {current.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', fontFamily: amFont, lineHeight: 1.7 }}>
              {t('strategy.quote')}
            </p>
          </div>

          {/* Right content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {current.content.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ padding: '1.25rem 1.5rem', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${current.color}40`; (e.currentTarget as HTMLElement).style.background = `${current.color}06`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div style={{ width: 4, height: 28, background: `linear-gradient(to bottom, ${current.color}, ${current.color}60)`, borderRadius: 99, flexShrink: 0 }} />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', fontFamily: amFont }}>{item.topic}</h4>
                </div>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: amFont, paddingLeft: '1.15rem' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Did you know */}
      <div style={{ marginTop: '2rem', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 18, padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <Info size={28} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem', fontFamily: amFont }}>{t('strategy.did_you_know')}</h4>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: amFont }}>{t('strategy.fun_fact')}</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .strategy-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default StrategyPage;
