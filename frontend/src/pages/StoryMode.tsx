import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, ScrollText, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { API_BASE } from '../services/apiConfig';

const StoryMode: React.FC = () => {
  const { lang, t } = useLanguage();
  
  // Starting story narrative greeting
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stop, isSpeaking } = useSpeech();

  useEffect(() => {
    // Set initial message based on language
    setMessages([
      {
        role: 'assistant',
        content: lang === 'am' 
          ? "እንኳን ወደ የዓድዋ ጦርነት ታሪክ በደህና መጡ። በ1896 (በ1888 ዓ.ም.) በኢትዮጵያ ንጉሠ ነገሥት መንግሥት እና በኢጣሊያ ንጉሥ መንግሥት መካከል ያለው ውጥረት ከፍተኛ ደረጃ ላይ ደርሷል። ከታሪኩ የትኛውን ክፍል ማሰስ ይፈልጋሉ? ስለ መሪዎቹ፣ ስለ የጊዜ መስመሩ፣ ስለ ጦርነት ስልቶቹ ወይም ስለ አጠቃላይ እውነታዎች ሊጠይቁኝ ይችላሉ።"
          : "Welcome to the story of the Battle of Adwa. The date is 1896, and the tension between the Ethiopian Empire and the Kingdom of Italy has reached a breaking point. What part of the history would you like to explore? You can ask me about the leaders, the timeline, the battle strategies, or general facts."
      }
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/api/chat`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Use 'story' persona from the backend
        body: JSON.stringify({ hero: 'story', question: trimmed, lang })
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed (${response.status}). URL: ${url}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      console.error(`StoryMode fetch error at ${url}:`, err);
      setError(err.message || (lang === 'am' ? 'ታሪኩን ማምጣት አልተቻለም።' : 'Failed to retrieve story.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-eyebrow" style={{ fontFamily: 'inherit' }}>{t('nav.story')}</div>
        <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {t('story.page_title')}
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8, fontFamily: 'inherit' }}>
          {t('story.page_desc')}
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '65vh',
        background: 'rgba(14,16,20,0.85)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.05)',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          background: 'linear-gradient(to right, rgba(212,175,55,0.08), transparent)',
          display: 'flex', alignItems: 'center', gap: '0.8rem',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            <ScrollText size={20} />
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)' }}>
              {t('story.title')}
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
              {t('story.subtitle')}
            </div>
          </div>
        </div>

        {/* Messages Space */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.75rem', alignItems: 'flex-end' }}
              >
                {m.role === 'assistant' && (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--gold)' }}>
                     <ScrollText size={16} />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, var(--gold), #a88820)'
                    : 'rgba(255,255,255,0.03)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(212,175,55,0.15)',
                  color: m.role === 'user' ? '#0a0800' : 'var(--text)',
                  fontWeight: m.role === 'user' ? 600 : 400,
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  fontFamily: 'inherit',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                  
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => isSpeaking ? stop() : speak(m.content, 'male')}
                      style={{ 
                        display: 'block', 
                        marginTop: '0.6rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--gold)', 
                        cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 0.2s',
                        padding: 0
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                      title={isSpeaking ? "Stop" : "Listen"}
                    >
                      {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                  )}
                </div>

                {m.role === 'user' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} style={{ color: 'var(--text-dim)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <ScrollText size={16} />
              </div>
              <div style={{ display: 'flex', gap: '5px', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '20px 20px 20px 4px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', animation: `pulseGold 1.2s ease-in-out infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <div style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)', borderRadius: 12, padding: '0.8rem 1.2rem', fontSize: '0.85rem', color: '#ff6b6b', fontFamily: 'inherit' }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid rgba(212,175,55,0.15)', background: 'rgba(8,10,12,0.95)' }}>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={lang === 'am' ? "ስለ ጦርነቱ፣ ስለ መሪዎቹ ወይም ስለ ታሪካዊ ቀኖቹ ይጠይቁ..." : "Ask the storyteller about the battle, leaders, or events..."}
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 14,
                padding: '0.9rem 1.2rem',
                color: 'var(--text)',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'Outfit, sans-serif',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)')}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: 48, height: 48, borderRadius: 14,
                background: loading || !input.trim()
                  ? 'rgba(255,255,255,0.08)'
                  : 'linear-gradient(135deg, var(--gold), #a88820)',
                color: loading || !input.trim() ? 'var(--text-muted)' : '#0a0800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: loading || !input.trim() ? 'none' : '0 4px 15px rgba(212,175,55,0.4)',
                border: 'none'
              }}
              title={lang === 'am' ? "መልዕክት ይላኩ" : "Send your chronicle inquiry"}
            >
              {loading
                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={18} />
              }
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGold {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 10px var(--gold); }
        }
      `}</style>
    </div>
  );
};

export default StoryMode;
