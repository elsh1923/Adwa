import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../services/apiConfig';

interface StrategyItem {
  strategy_name: string;
  description: string;
}

const StrategyPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/knowledge/strategies`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        const mappedStrategies = data.map((item: any) => ({
          strategy_name: typeof item.strategy_name === 'object' ? (item.strategy_name[lang] || item.strategy_name['en']) : item.strategy_name,
          description: typeof item.description === 'object' ? (item.description[lang] || item.description['en']) : item.description,
        }));

        setStrategies(mappedStrategies);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStrategies();
  }, [lang]);

  return (
    <div style={{ padding: '3rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="section-eyebrow" style={{ fontFamily: 'inherit' }}>{lang === 'am' ? '⚔️ ወታደራዊ ትንተና' : '⚔️ Military Analysis'}</div>
        <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{t('strategy.title') || 'Strategies of Adwa'}</h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 580, margin: '0 auto', lineHeight: 1.8, fontFamily: 'inherit' }}>
          {t('strategy.subtitle')}
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--gold)' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          {lang === 'am' ? 'እውቀት ማከማቻ በመጫን ላይ...' : 'Loading Knowledge Base...'}
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: '#ff6b6b' }}>
          {lang === 'am' ? 'ስልቶችን መጫን አልተቻለም። የጀርባ አገልጋዩ መስራቱን ያረጋግጡ።' : 'Failed to load strategies. Ensure the backend RAG server is running.'}
        </div>
      )}

      {!loading && !error && strategies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(14,16,20,0.8)', border: `1px solid #d4af3725`, borderRadius: 24, padding: '2.5rem', boxShadow: `0 0 40px #d4af3708` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '3rem', alignItems: 'start' }} className="strategy-grid">
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ width: 200, height: 200, marginBottom: '0.5rem' }}>
                <img src="/image/logo-removebg-preview (1).png" alt="Ethiopian Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(212,175,55,0.4))' }} />
              </motion.div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                 {lang === 'am' ? 'ታሪካዊ ስልቶች' : 'Historical Tactics'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', fontFamily: 'inherit', lineHeight: 1.7 }}>
                "{strategies[0]?.description.substring(0, 70)}..."
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {strategies.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ padding: '1.25rem 1.5rem', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `#d4af3740`; (e.currentTarget as HTMLElement).style.background = `#d4af3706`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ width: 4, height: 28, background: `linear-gradient(to bottom, #d4af37, #d4af3760)`, borderRadius: 99, flexShrink: 0 }} />
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', fontFamily: 'inherit' }}>{item.strategy_name}</h4>
                  </div>
                  <p style={{ color: 'var(--text-dim)', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: 'inherit', paddingLeft: '1.15rem' }}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ marginTop: '2rem', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 18, padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <Info size={28} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem', fontFamily: 'inherit' }}>{lang === 'am' ? 'የእውቀት ማከማቻ ውህደት' : 'Knowledge Base Integration'}</h4>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: 'inherit' }}>
            {lang === 'am' ? 'ይህ ገጽ ሙሉ በሙሉ በእርስዎ RAG Node የጀርባ አገልጋይ በሚስተናገዱ የኢውቀት ይዘቶች የተሞላ ነው።' : 'This page is now populated entirely by the custom JSON models hosted by your RAG Node backend.'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .strategy-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default StrategyPage;
