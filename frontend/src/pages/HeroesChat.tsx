import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ArrowLeft, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { chatWithHero } from '../services/gemini';
import type { GeminiMessage } from '../services/gemini';

interface Leader {
  id: string;
  name: string;
  role: string;
  desc: string;
  color: string;
  emoji: string;
  image: string;
}

const HeroesChat: React.FC = () => {
  const { t, lang } = useLanguage();
  const amFont = lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : undefined;

  const leaders: Leader[] = [
    {
      id: 'menelik',
      name: t('hero.menelik.name'),
      role: t('chat.menelik.role'),
      desc: t('chat.menelik.desc'),
      color: '#d4af37',
      emoji: '👑',
      image: '/image/menelik_portrait.png',
    },
    {
      id: 'taytu',
      name: t('hero.taytu.name'),
      role: t('chat.taytu.role'),
      desc: t('chat.taytu.desc'),
      color: '#2e8b57',
      emoji: '🌿',
      image: '/image/taytu_portrait.jpg',
    },
    {
      id: 'alula',
      name: t('hero.alula.name'),
      role: t('chat.alula.role'),
      desc: t('chat.alula.desc'),
      color: '#8b0000',
      emoji: '⚔️',
      image: '/image/alula_portrait.jpg',
    },
    {
      id: 'mengesha',
      name: t('hero.mengesha.name'),
      role: t('chat.mengesha.role'),
      desc: t('chat.mengesha.desc'),
      color: '#4169e1',
      emoji: '🛡️',
      image: '/image/mengesha_portrait.jpg',
    },
  ];

  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiHistory = useRef<GeminiMessage[]>([]);

  const { speak, stop, isSpeaking } = useSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectLeader = (leader: Leader) => {
    setSelectedLeader(leader);
    setMessages([]);
    setError(null);
    geminiHistory.current = [];
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !selectedLeader) return;

    const userMsg = { role: 'user' as const, content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const reply = await chatWithHero(
        selectedLeader.id,
        geminiHistory.current,
        trimmed,
        lang,
      );

      // Update Gemini conversation history
      geminiHistory.current = [
        ...geminiHistory.current,
        { role: 'user',  parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: reply }] },
      ];

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to get response.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Leader selection screen ──
  if (!selectedLeader) {
    return (
      <div style={{ padding: '3rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-eyebrow" style={{ fontFamily: amFont }}>{t('heroes.eyebrow')}</div>
          <h2 className="section-title" style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : undefined }}>{t('chat.title')}</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8, fontFamily: amFont }}>
            {t('chat.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
          {leaders.map(leader => (
            <motion.div
              key={leader.id}
              whileHover={{ y: -8 }}
              onClick={() => handleSelectLeader(leader)}
              style={{
                background: 'rgba(14,16,20,0.8)',
                border: `1px solid ${leader.color}25`,
                borderRadius: 20,
                padding: '2rem',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = leader.color + '66';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${leader.color}15`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = leader.color + '25';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: `radial-gradient(circle, ${leader.color}22, ${leader.color}08)`,
                border: `2px solid ${leader.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${leader.color}20`,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div>
                <h3 style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
                  {leader.name}
                </h3>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: leader.color, fontFamily: amFont }}>
                  {leader.role}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', lineHeight: 1.7, fontFamily: amFont }}>
                {leader.desc}
              </p>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.8rem', fontWeight: 700, color: leader.color,
                padding: '0.5rem 1.25rem', borderRadius: 99,
                background: leader.color + '12',
                border: `1px solid ${leader.color}30`,
                fontFamily: amFont,
              }}>
                {t('heroes.chat_btn')} →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── Chat interface ──
  return (
    <div style={{ padding: '2rem 0', maxWidth: 860, margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '75vh',
        background: 'rgba(10,12,14,0.9)',
        border: `1px solid ${selectedLeader.color}30`,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: `0 0 40px ${selectedLeader.color}10, 0 20px 60px rgba(0,0,0,0.5)`,
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: `1px solid ${selectedLeader.color}20`,
          background: `linear-gradient(to right, ${selectedLeader.color}08, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => { setSelectedLeader(null); setMessages([]); setError(null); geminiHistory.current = []; }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.4rem', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={t('chat.back')}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `radial-gradient(circle, ${selectedLeader.color}22, ${selectedLeader.color}08)`, border: `2px solid ${selectedLeader.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              {selectedLeader.emoji}
            </div>
            <div>
              <div style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                {selectedLeader.name}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: selectedLeader.color, fontFamily: amFont }}>
                {selectedLeader.role}
              </div>
            </div>
          </div>

          {/* AI powered badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 99, padding: '0.3rem 0.75rem' }}>
            <Bot size={12} />
            Powered by Gemini
          </div>
        </div>

        {/* Messages */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem', opacity: 0.5 }}>{selectedLeader.emoji}</div>
              <p style={{ fontFamily: amFont, lineHeight: 1.7, maxWidth: 300 }}>
                {t('chat.start_hint')} <em style={{ color: selectedLeader.color }}>{selectedLeader.name}</em>…
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.6rem', alignItems: 'flex-end' }}
              >
                {m.role === 'assistant' && (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${selectedLeader.color}15`, border: `1px solid ${selectedLeader.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    <img 
                      src={selectedLeader.image} 
                      alt={selectedLeader.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div style={{
                  maxWidth: '72%',
                  padding: '0.85rem 1.2rem',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, var(--gold), #a88820)`
                    : `rgba(255,255,255,0.04)`,
                  border: m.role === 'user' ? 'none' : `1px solid ${selectedLeader.color}20`,
                  color: m.role === 'user' ? '#0a0800' : 'var(--text)',
                  fontWeight: m.role === 'user' ? 600 : 400,
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  fontFamily: amFont,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                  
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => isSpeaking ? stop() : speak(m.content, lang)}
                      style={{ 
                        display: 'block', 
                        marginTop: '0.5rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: selectedLeader.color, 
                        cursor: 'pointer',
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                      title={isSpeaking ? "Stop" : "Listen"}
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
                {m.role === 'user' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${selectedLeader.color}15`, border: `1px solid ${selectedLeader.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                {selectedLeader.emoji}
              </div>
              <div style={{ display: 'flex', gap: '4px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${selectedLeader.color}20`, borderRadius: '18px 18px 18px 4px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: `${selectedLeader.color}80`, animation: `pulseGold 1.2s ease-in-out infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)', borderRadius: 12, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#ff6b6b', fontFamily: amFont }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${selectedLeader.color}15`, background: 'rgba(8,10,12,0.8)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`${t('chat.placeholder').replace('…', '')} ${selectedLeader.name}…`}
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedLeader.color}25`,
                borderRadius: 12,
                padding: '0.8rem 1.1rem',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: amFont ?? 'Outfit, sans-serif',
                transition: 'var(--transition)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = selectedLeader.color + '60')}
              onBlur={e => (e.currentTarget.style.borderColor = selectedLeader.color + '25')}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: loading || !input.trim()
                  ? 'rgba(255,255,255,0.08)'
                  : `linear-gradient(135deg, ${selectedLeader.color}, ${selectedLeader.color}99)`,
                color: loading || !input.trim() ? 'var(--text-muted)' : '#0a0800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'var(--transition)',
                boxShadow: loading || !input.trim() ? 'none' : `0 4px 15px ${selectedLeader.color}40`,
              }}
              title={t('chat.send')}
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
      `}</style>
    </div>
  );
};

export default HeroesChat;
