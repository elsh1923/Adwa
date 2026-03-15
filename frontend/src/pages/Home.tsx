import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare, Sword, Clock, HelpCircle,
  ArrowRight, Play, ChevronDown, Zap, Shield, Globe,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

/* ── animation variants ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

/* ── Animated counter ── */
const AnimatedCounter: React.FC<{ target: string }> = ({ target }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const isNum = /^\d+/.test(target);
    if (!isNum) { setDisplayed(target); return; }
    const num = parseInt(target);
    const suffix = target.replace(/^\d+/, '');
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setDisplayed(start + suffix);
      if (start >= num) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{displayed}</span>;
};


/* ────────────────────────────────
   HOME PAGE COMPONENT
   ──────────────────────────────── */
const Home: React.FC = () => {
  const { t } = useLanguage();

  const STATS = [
    { value: '100K+', label: t('stats.warriors'), icon: '⚔️' },
    { value: '1896',  label: t('stats.year'),     icon: '🏆' },
    { value: '5',     label: t('stats.experiences'), icon: '🤖' },
    { value: '130+',  label: t('stats.years'),    icon: '🌍' },
  ];

  const FEATURES = [
    {
      id: 'story', path: '/story', emoji: '📖', color: '#d4af37',
      title: t('feature.story.title'), subtitle: t('feature.story.sub'),
      desc: t('feature.story.desc'),   badge: t('feature.story.badge'),
    },
    {
      id: 'chat', path: '/chat', emoji: '👑', color: '#2e8b57',
      title: t('feature.chat.title'), subtitle: t('feature.chat.sub'),
      desc: t('feature.chat.desc'),   badge: t('feature.chat.badge'),
    },
    {
      id: 'strategy', path: '/strategy', emoji: '⚔️', color: '#8b0000',
      title: t('feature.strategy.title'), subtitle: t('feature.strategy.sub'),
      desc: t('feature.strategy.desc'),   badge: t('feature.strategy.badge'),
    },
    {
      id: 'timeline', path: '/timeline', emoji: '🗓️', color: '#c47a00',
      title: t('feature.timeline.title'), subtitle: t('feature.timeline.sub'),
      desc: t('feature.timeline.desc'),   badge: t('feature.timeline.badge'),
    },
    {
      id: 'quiz', path: '/quiz', emoji: '🧠', color: '#5e35d4',
      title: t('feature.quiz.title'), subtitle: t('feature.quiz.sub'),
      desc: t('feature.quiz.desc'),   badge: t('feature.quiz.badge'),
    },
  ];

  const HEROES = [
    { key: 'menelik', color: '#d4af37', emoji: '👑', image: '/image/menelik_portrait.png',
      name: t('hero.menelik.name'), role: t('hero.menelik.role'), desc: t('hero.menelik.desc') },
    { key: 'taytu',   color: '#2e8b57', emoji: '🌿', image: '/image/taytu_portrait.jpg',
      name: t('hero.taytu.name'),   role: t('hero.taytu.role'),   desc: t('hero.taytu.desc') },
    { key: 'alula',   color: '#8b0000', emoji: '⚔️', image: '/image/alula_portrait.jpg',
      name: t('hero.alula.name'),   role: t('hero.alula.role'),   desc: t('hero.alula.desc') },
    { key: 'mengesha', color: '#4169e1', emoji: '🛡️', image: '/image/mengesha_portrait.png',
      name: t('hero.mengesha.name'), role: t('hero.mengesha.role'), desc: t('hero.mengesha.desc') },
    { key: 'mikael',   color: '#ffa500', emoji: '🏇', image: '/image/mikael_portrait.png',
      name: t('hero.mikael.name'),   role: t('hero.mikael.role'),   desc: t('hero.mikael.desc') },
    { key: 'habtegiyorgis', color: '#808080', emoji: '🎖️', image: '/image/habtegiyorgis_portrait.jpg',
      name: t('hero.habtegiyorgis.name'), role: t('hero.habtegiyorgis.role'), desc: t('hero.habtegiyorgis.desc') },
  ];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0, background: 'transparent' }}>
      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* High-visibility landing page version of the epic battle image */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'url("/image/hero_epic.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6, 
          filter: 'brightness(0.9) contrast(1.4) saturate(1.05)', 
          zIndex: 1 
        }} />
        
        {/* Atmospheric overlays for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,10,12,0.15) 0%, rgba(8,10,12,0.5) 50%, rgba(8,10,12,0.95) 100%)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '6rem', paddingBottom: '8rem' }}>
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 99, padding: '0.45rem 1.2rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'inherit' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulseGold 2s ease-in-out infinite' }} />
                {t('home.badge')}
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulseGold 2s ease-in-out infinite 0.5s' }} />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp}>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 700, lineHeight: 1.05, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                <span style={{ display: 'block', background: 'linear-gradient(135deg, #f0d060 0%, #d4af37 40%, #c4902c 80%, #8b6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {t('home.title1')}
                </span>
                {t('home.title2') && (
                  <span style={{ display: 'block', color: 'var(--text)', fontSize: '0.65em', fontWeight: 600, marginTop: '0.1em', opacity: 0.9 }}>
                    {t('home.title2')}
                  </span>
                )}
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 400 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4))' }} />
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.4))' }} />
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--text-dim)', maxWidth: 660, lineHeight: 1.8, fontFamily: 'inherit' }}>
              {t('home.subtitle')}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <NavLink to="/story" className="btn-primary" id="cta-start-story" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem', fontFamily: 'inherit' }}>
                <Play size={18} fill="currentColor" />
                {t('home.cta1')}
              </NavLink>
              <NavLink to="/chat" className="btn-outline" id="cta-chat-heroes" style={{ fontFamily: 'inherit' }}>
                <MessageSquare size={18} />
                {t('home.cta2')}
              </NavLink>
              <NavLink to="/quiz" className="btn-ghost" id="cta-take-quiz" style={{ fontFamily: 'inherit' }}>
                <HelpCircle size={16} />
                {t('home.cta3')}
              </NavLink>
            </motion.div>

            {/* Secondary pill links */}
            <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginTop: '0.25rem' }}>
              {[
                { to: '/strategy', label: t('home.cta4'), icon: <Sword size={14} /> },
                { to: '/timeline', label: t('home.cta5'), icon: <Clock size={14} /> },
              ].map(({ to, label, icon }) => (
                <NavLink key={to} to={to}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dim)', padding: '0.4rem 0.9rem', borderRadius: 99, border: '1px solid var(--border-subtle)', transition: 'var(--transition)', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  {icon} {label}
                </NavLink>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Heroes Gallery at bottom of Hero Section */}
        <div style={{ position: 'absolute', bottom: '6rem', left: 0, right: 0, zIndex: 12 }}>
          <div className="container" style={{ overflow: 'visible' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 1.5rem)', flexWrap: 'wrap' }}
            >
              {HEROES.map((h) => (
                <motion.div 
                  key={h.key}
                  whileHover={{ y: -10, scale: 1.1 }}
                  style={{ position: 'relative', width: 'clamp(50px, 8vw, 75px)', height: 'clamp(50px, 8vw, 75px)', borderRadius: '50%', border: `2px solid ${h.color}40`, background: 'rgba(0,0,0,0.4)', overflow: 'hidden', boxShadow: `0 10px 25px rgba(0,0,0,0.3), 0 0 15px ${h.color}20`, cursor: 'pointer' }}
                >
                  <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${h.color}30 0%, transparent 60%)`, pointerEvents: 'none' }} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'inherit' }}
            >
              The Heroes of Adwa
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', animation: 'floatY 2.5s ease-in-out infinite', zIndex: 2 }}>
          <ChevronDown size={18} />
        </div>

        {/* Ethiopian flag stripe at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #1a5c38 33.33%, #d4af37 33.33%, #d4af37 66.66%, #8b0000 66.66%)', zIndex: 3 }} />
      </section>

      {/* ═══ STATS ═══ */}
      <section id="stats" style={{ padding: '4rem 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
            {STATS.map(({ value, label, icon }) => (
              <motion.div key={label} variants={fadeUp}
                style={{ textAlign: 'center', padding: '1.75rem 1rem', borderRadius: 16, background: 'rgba(18,20,24,0.6)', border: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}
                whileHover={{ borderColor: 'rgba(212,175,55,0.3)', boxShadow: '0 0 30px rgba(212,175,55,0.1)', y: -4 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1.1 }}>
                  <AnimatedCounter target={value} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.3rem', fontFamily: 'inherit', letterSpacing: '0.08em' }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '6rem 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div variants={fadeUp} className="section-eyebrow" style={{ fontFamily: 'inherit' }}>{t('features.eyebrow')}</motion.div>
            <motion.h2 variants={fadeUp} className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{t('features.title')}</motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--text-dim)', maxWidth: 580, margin: '0 auto', lineHeight: 1.8, fontFamily: 'inherit' }}>{t('features.subtitle')}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ id, title, subtitle, desc, path, color, badge, emoji }) => (
              <motion.div key={id} variants={fadeUp} whileHover={{ y: -8 }}
                style={{ background: 'rgba(14,16,20,0.7)', border: '1px solid var(--border-subtle)', borderRadius: 22, padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'var(--transition)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color + '55'; el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${color}18`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-subtle)'; el.style.boxShadow = 'none'; }}>

                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at top right, ${color}12, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, background: color + '18', border: `1px solid ${color}35`, borderRadius: 99, padding: '0.2rem 0.6rem', fontFamily: 'inherit' }}>
                  {badge}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${color}22, ${color}0a)`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem' }}>
                    {emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.15rem', fontFamily: 'inherit' }}>{subtitle}</div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
                  </div>
                </div>

                <div style={{ height: 1, background: `linear-gradient(to right, ${color}30, transparent)` }} />
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.8, flexGrow: 1, fontFamily: 'inherit' }}>{desc}</p>

                <NavLink to={path} id={`feature-link-${id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color, marginTop: 'auto', transition: 'var(--transition)', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.gap = '0.75rem')}
                  onMouseLeave={e => (e.currentTarget.style.gap = '0.4rem')}>
                  {t('features.explore')} {title} <ArrowRight size={16} />
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HEROES SPOTLIGHT ═══ */}
      <section id="heroes-spotlight" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, rgba(8,10,12,0.1), rgba(14,12,8,0.4), rgba(8,10,12,0.1))', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-eyebrow" style={{ fontFamily: 'inherit' }}>{t('heroes.eyebrow')}</div>
              <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{t('heroes.title')}</h2>
              <p style={{ color: 'var(--text-dim)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontFamily: 'inherit' }}>{t('heroes.subtitle')}</p>
            </motion.div>

            <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {HEROES.map(({ key, name, role, desc, color, image }) => (
                <motion.div key={key} variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }}
                  style={{ background: 'rgba(14,16,20,0.8)', border: `1px solid ${color}25`, borderRadius: 20, padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'var(--transition)', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color + '66'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}15`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = color + '25'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>

                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${color}22, ${color}08)`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 0 20px ${color}20` }}>
                    <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>{name}</h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color, fontFamily: 'inherit' }}>{role}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', lineHeight: 1.7, fontFamily: 'inherit' }}>{desc}</p>
                  <NavLink to="/chat"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color, padding: '0.5rem 1.25rem', borderRadius: 99, background: color + '12', border: `1px solid ${color}30`, transition: 'var(--transition)', marginTop: '0.25rem', fontFamily: 'inherit' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = color + '25')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = color + '12')}>
                    <MessageSquare size={14} /> {t('heroes.chat_btn')}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
              <NavLink to="/chat" className="btn-outline" id="see-all-heroes" style={{ padding: '0.9rem 2.5rem', fontFamily: 'inherit' }}>
                <MessageSquare size={18} />
                {t('heroes.all_btn')}
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="mission" style={{ padding: '6rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(10,9,6,0.35)', position: 'relative', overflow: 'hidden', zIndex: 5 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            
            {/* Image Side */}
            <motion.div variants={fadeUp} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-10px', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 24, transform: 'rotate(-2deg)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: '-10px', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 24, transform: 'rotate(2deg)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img 
                  src="/image/mission_portrait.png" 
                  alt="Menelik II and Taytu Betul" 
                  style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.5s ease' }}
                  className="hover-zoom"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)', pointerEvents: 'none' }} />
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div variants={fadeUp}>
              <div className="section-eyebrow" style={{ fontFamily: 'inherit' }}>{t('mission.eyebrow')}</div>
              <h2 className="section-title" style={{ textAlign: 'left', fontFamily: 'Cormorant Garamond, serif', marginBottom: '2rem' }}>{t('mission.title')}</h2>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '1.5rem', fontFamily: 'inherit' }}>{t('mission.p1')}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                {[
                  { icon: <Zap size={18} />,    titleKey: 'mission.ai' },
                  { icon: <Shield size={18} />,  titleKey: 'mission.accurate' },
                  { icon: <Globe size={18} />,   titleKey: 'mission.pan' },
                ].map(({ icon, titleKey }) => (
                  <div key={titleKey} style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.95rem' }}>
                    <div style={{ color: 'var(--gold)', flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontWeight: 600 }}>{t(titleKey)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="cta-banner" style={{ padding: '6rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden', zIndex: 5 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <motion.div variants={fadeUp} style={{ fontSize: '3rem', animation: 'floatY 3s ease-in-out infinite' }}>🏆</motion.div>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, background: 'linear-gradient(135deg, var(--gold-light), var(--gold), #c4902c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', maxWidth: 700, lineHeight: 1.25 }}>
              {t('cta.title')}
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: 520, lineHeight: 1.8, fontFamily: 'inherit' }}>
              {t('cta.subtitle')}
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <NavLink to="/story" className="btn-primary" id="final-cta-story" style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontFamily: 'inherit' }}>
                <Play size={18} fill="currentColor" /> {t('home.cta1')}
              </NavLink>
              <NavLink to="/chat" className="btn-outline" id="final-cta-chat" style={{ padding: '1rem 2.5rem', fontFamily: 'inherit' }}>
                <MessageSquare size={18} /> {t('home.cta2')}
              </NavLink>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', opacity: 0.3, fontSize: '1.4rem', color: 'var(--gold)' }}>
              &nbsp;
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
