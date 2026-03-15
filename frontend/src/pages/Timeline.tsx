import React from 'react';
import { motion } from 'framer-motion';

import { Calendar, Shield, Sword, Award, Flag, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../services/apiConfig';

interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

import { useState, useEffect } from 'react';

const TimelinePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTimelineInfo = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/knowledge/timeline`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        // Map the backend JSON to the frontend object structure dynamically
        const iconChoices = [<Award size={24} />, <Flag size={24} />, <Sword size={24} />, <MapPin size={24} />, <Shield size={24} />, <CheckCircle2 size={24} />, <Calendar size={24} />];
        const colorChoices = ['#d4af37', '#1a5c38', '#8b0000', '#2e8b57', '#d4af37'];
        
        const mappedEvents = data.map((item: any, idx: number) => {
          const title = typeof item.event === 'object' ? (item.event[lang] || item.event['en']) : (item.event || item.title || 'Significant Event');
          const desc = typeof item.details === 'object' ? (item.details[lang] || item.details['en']) : (item.details || item.description || '');
          const date = item.year || item.date || 'Unknown Date';

          return {
            date,
            title,
            desc,
            icon: iconChoices[idx % iconChoices.length],
            color: colorChoices[idx % colorChoices.length]
          };
        });
        
        setEvents(mappedEvents);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTimelineInfo();
  }, [lang]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--gold)' }}>{lang === 'am' ? 'የጊዜ መስመር ከ RAG እውቀት ማከማቻ በመጫን ላይ...' : 'Loading Timeline from RAG Knowledge Base...'}</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: '#ff6b6b' }}>{lang === 'am' ? 'የጊዜ መስመሩን መጫን አልተቻለም። እባክዎ የጀርባ አገልጋዩ መስራቱን ያረጋግጡ።' : 'Failed to load timeline. Please ensure the backend is running.'}</div>;

  return (
    <div style={{ padding: '4rem 0', minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-eyebrow" style={{ fontFamily: 'inherit' }}>
              {t('feature.timeline.sub')}
            </div>
            <h1 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('feature.timeline.title')}
            </h1>
            <p style={{ color: 'var(--text-dim)', maxWidth: 660, margin: '0 auto', lineHeight: 1.8, fontFamily: 'inherit' }}>
              {t('feature.timeline.desc')}
            </p>
          </motion.div>
        </div>

        {/* Timeline Line */}
        <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            top: 0, 
            bottom: 0, 
            width: 2, 
            background: 'linear-gradient(to bottom, transparent, var(--gold) 10%, var(--gold) 90%, transparent)', 
            opacity: 0.2 
          }} className="timeline-line-center" />

          {/* Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {events.map((event, index) => (
              <TimelineEventItem 
                key={index} 
                event={event} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-line-center { left: 24px !important; transform: none !important; }
          .timeline-grid { grid-template-columns: 1fr !important; }
          .timeline-spacer { display: none !important; }
          .timeline-dot { left: 24px !important; transform: translateX(-50%) !important; }
          .timeline-content-wrapper { padding-left: 3.5rem !important; text-align: left !important; }
        }
      `}</style>
    </div>
  );
};

const TimelineEventItem: React.FC<{ 
  event: TimelineEvent, 
  index: number 
}> = ({ event, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* Central Dot */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '20px', 
          transform: 'translateX(-50%)', 
          width: 48, 
          height: 48, 
          borderRadius: '50%', 
          background: 'var(--bg-card)', 
          border: `2px solid ${event.color}`, 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: event.color,
          boxShadow: `0 0 20px ${event.color}40`,
        }}
        className="timeline-dot"
      >
        {event.icon}
      </motion.div>

      {/* Grid wrapper */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          alignItems: 'start' 
        }} 
        className="timeline-grid"
      >
        {/* Left Side */}
        {isLeft ? (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ textAlign: 'right' }}
            className="timeline-content-wrapper"
          >
            <EventCard event={event} isLeft={true} />
          </motion.div>
        ) : <div className="timeline-spacer" />}

        {/* Right Side */}
        {!isLeft ? (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ textAlign: 'left' }}
            className="timeline-content-wrapper"
          >
            <EventCard event={event} isLeft={false} />
          </motion.div>
        ) : <div className="timeline-spacer" />}
      </div>
    </div>
  );
};

const EventCard: React.FC<{ 
  event: TimelineEvent, 
  isLeft: boolean 
}> = ({ event, isLeft }) => {
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: 20, 
      padding: '2rem',
      position: 'relative',
      transition: 'var(--transition)'
    }} 
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${event.color}40`; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
    >
      <div style={{ 
        display: 'inline-block', 
        fontSize: '0.75rem', 
        fontWeight: 700, 
        color: event.color, 
        background: `${event.color}15`, 
        padding: '0.4rem 0.8rem', 
        borderRadius: 99, 
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: 'inherit'
      }}>
        <Calendar size={12} style={{ display: 'inline', marginRight: '0.5rem', marginBottom: '2px' }} />
        {event.date}
      </div>
      <h3 style={{ 
        fontFamily: 'Cormorant Garamond, serif', 
        fontSize: '1.5rem', 
        fontWeight: 700, 
        color: 'var(--text)', 
        marginBottom: '0.75rem' 
      }}>
        {event.title}
      </h3>
      <p style={{ 
        color: 'var(--text-dim)', 
        lineHeight: 1.8, 
        fontSize: '0.95rem', 
        fontFamily: 'inherit' 
      }}>
        {event.desc}
      </p>

      {/* Connector line for desktop */}
      <div style={{
        position: 'absolute',
        top: '40px',
        [isLeft ? 'right' : 'left']: '-4rem',
        width: '4rem',
        height: 2,
        background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, ${event.color}, transparent)`,
        opacity: 0.3
      }} className="hidden-xs" />
    </div>
  );
};

export default TimelinePage;
