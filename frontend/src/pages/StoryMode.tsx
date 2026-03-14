import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar, ScrollText, MapPin, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { narrateStoryScene } from '../services/gemini';

/* Static story scenes — bilingual content */
const storyScenes = {
  en: [
    { title: 'The Seeds of Conflict', period: '1889 – 1895', content: 'The story begins with the Treaty of Wuchale. A single word in Article XVII changed everything. In Amharic, it said Ethiopia could use Italy for foreign contacts. In Italian, it said Ethiopia must. This was a trick to turn Ethiopia into a protectorate.', aiNote: 'Emperor Menelik II discovered this deception and formally rejected the treaty in 1893, leading to inevitable war.' },
    { title: 'The Great Mobilization', period: 'Late 1895', content: 'Menelik issued a call to arms that resonated across the Highlands. From every corner of the empire, warriors gathered. Farmers became soldiers, bringing their own food and weapons. The army grew to over 100,000 strong — a miracle of logistics and unity.', aiNote: 'This was the largest unified African force ever assembled to face a European power at the time.' },
    { title: 'The Siege of Mekelle', period: 'January 1896', content: 'Before Adwa, there was Mekelle. Empress Taytu Betul personally led a force that besieged the Italian fort. Her most brilliant move? Cutting off the water line. The Italians were forced to negotiate and retreat, setting the stage for the final confrontation.', aiNote: "Taytu's leadership proved that the Ethiopian defense was a total national effort." },
    { title: 'The Dawn at Adwa', period: 'March 1, 1896', content: 'The Italians launched a surprise night march, but the rugged mountains caused them to lose their way and divide their forces. By dawn, the Ethiopian scouts had detected them. The battle was fierce, bloody, and decisive. From 6 AM to noon, the fate of Ethiopia was decided.', aiNote: "The Ethiopian 'Sheba' columns and high-ground positioning overwhelmed the fragmented Italian brigades." },
    { title: 'The Legacy of Victory', period: 'Aftermath', content: 'The news of the Italian defeat shocked the world. Ethiopia remained sovereign, the only African nation to decisively defeat a European power. Adwa became a symbol of pan-African resistance and hope for all colonized people.', aiNote: 'This victory ensured that Ethiopia would enter the 20th century as a recognized independent state.' },
  ],
  am: [
    { title: 'የግጭቱ ዘሮች', period: '፲፰፹፩ – ፲፰፹፰', content: 'ታሪኩ የሚጀምረው በዉቻሌ ስምምነት ነው። ምዕራፍ ዐራ ሰባት ላይ ያለ አንድ ቃል ሁሉን ነገር ቀይሮታል። በአማርኛ "ኢትዮጵያ ኢጣሊያን ለውጭ ዲፕሎማሲ መጠቀም ትችላለች" ይላል። በኢጣሊያኛ ግን "ኢትዮጵያ ኢጣሊያን መጠቀም አለባት" ይላል። ይህ ኢትዮጵያን ወደ ጥገኝነት ለመለወጥ የተጠቀሱ ሴራ ነበር።', aiNote: 'ዳግማዊ ዓፄ ምኒልክ ይህን ሴራ ሲያውቁ ስምምነቱን በ፲፰፹፭ ዓ.ም. ሙሉ በሙሉ ሰርዘዋል — ጦርነቱ የማይቀር ሆናቸው።' },
    { title: 'ታላቁ ጉዞ', period: 'የ፲፰፹፰ ዓ.ም. መጨረሻ', content: 'ምኒልክ ያደረጉት ጥሪ ሁሉ ያሰሙ ነበር። ከኢምፓየሩ ዳርቻ ሁሉ ተዋጊዎች ተናበቡ። አርሶ አደሮች ጊዜው ሲደርስ ወታደሮች ሆነው ምግባቸውን ይዘው ጦርነቱ ወደሚካሄድበት ቦታ ሮጡ። ጦሩ ፻,000 ከበለጠ — ይህ የፍቅር፣ የኅብረት እና የጽናት ድምር ነበር።', aiNote: 'ይህ ጊዜ ድረስ ከአፍሪካ ጦር ኃይሎች ሁሉ የአውሮፓ ኃይልን ለመፋለም ወደ ጦርነት ከገቡት ትልቁ ነበር።' },
    { title: 'የመቀሌ ከበባ', period: 'ጥር ፲፰፹፰', content: 'ዓድዋ ከመምጣቱ በፊት፣ መቀሌ ነበር። እቴጌ ጣይቱ ብጡል ኢጣሊያኖቹ ምሽጋቸውን እንዲለቁ ያስገደዷቸው እሳቸው ራሳቸው ነበሩ — ውሃ የሚያስቀርብ መስመሩን ቆረጡ። ይህ ነበር — ኢጣሊያኖቹ ምሽጋቸውን ለቀው ወደ ዓድዋ ሲጓዙ ወደ ሽንፈት ዘምቱ።', aiNote: 'የጣይቱ ብቃት ኢትዮጵያ ያደረገቼው ጦርነት ሕዝባዊ ትግል እንጂ የአንድ ሰው ጉዳይ አለመሆኑን አረጋግጧል።' },
    { title: 'ዓድዋ ዋዜማ', period: 'መጋቢት ፩ ቀን ፲፰፹፰', content: 'ኢጣሊያኖቹ ሌሊት ድፍረት ሞልቷቸው ሄዱ — ግን ዱካው ናቸው ጠፋ። ሦስቱ ብርጌዶቻቸው ተር ተሩ። ጎህ ሲቀድ ኢትዮጵያኑ ስካቲ ጠበቁ። ውጊያው ከ፮ ቀን ሌሊት ጀምሮ እስከ ቀን ፲ ሰዓት ድረስ ቀጠለ — ኢትዮጵያ ፈッサደ።', aiNote: 'ኢትዮጵያ የ"ሼባ" ቀበሌ ቀበሌ ከፍ ካለ ቦታ ሆና ነው ጠላቶቿን ዋጋ ያስከፈለቻቸው።' },
    { title: 'ድሎ ትሩፋት', period: 'ዘ ድሎ ምዕራፍ', content: 'ዜናው ዓለምን ናጠ። ኢትዮጵያ ሉዓላዊ ሆና ቀረች — ቅኝ ሰሪ አውሮፓዊን ወታደራዊ ሁኔታ ያሸነፈ ብቸኛ አፍሪካዊ ሀገር። ዓድዋ ለሁሉም ቅኝ ይዞሻ ህዝቦች የራስ ነጻነት ምሳሌ ሆናቸው።', aiNote: 'ይህ ድሎ ኢትዮጵያ ፳ኛ ምዕተ ዓመት የሚከሊ ሀገር ሆና እንድትቀጥል አረጋግጧል።' },
  ],
};

const StoryMode: React.FC = () => {
  const { t, lang } = useLanguage();
  const amFont = lang === 'am' ? 'Noto Serif Ethiopic, sans-serif' : undefined;
  const [currentScene, setCurrentScene] = useState(0);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const { speak, stop, isSpeaking } = useSpeech();

  const scenes = storyScenes[lang] ?? storyScenes.en;
  const scene = scenes[currentScene];
  const progress = ((currentScene + 1) / scenes.length) * 100;

  const next = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(c => c + 1);
      setAiReply(null);
      setAiError(null);
    }
  };
  const prev = () => {
    if (currentScene > 0) {
      setCurrentScene(c => c - 1);
      setAiReply(null);
      setAiError(null);
    }
  };

  const askAI = async () => {
    setLoadingAI(true);
    setAiReply(null);
    setAiError(null);
    try {
      const question = lang === 'am'
        ? 'ስለዚህ ምዕራፍ ተጨማሪ ታሪካዊ ዝርዝር ንገረኝ።'
        : 'Tell me more historical details about this chapter.';
      const reply = await narrateStoryScene(scene.title, scene.content, question, lang);
      setAiReply(reply);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', maxWidth: 1100, margin: '0 auto' }}>
      {/* Progress header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: amFont }}>
              {t('story.chapter')} {currentScene + 1}
            </span>
            <h2 style={{ fontFamily: lang === 'am' ? 'Noto Serif Ethiopic, serif' : 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--text)', marginTop: '0.2rem' }}>
              {scene.title}
            </h2>
          </div>
          <div style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.85rem', fontFamily: amFont }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
              <Calendar size={14} />
              <span>{scene.period}</span>
            </div>
            <span>{Math.round(progress)}{t('story.complete')}</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            style={{ height: '100%', background: 'linear-gradient(to right, var(--gold), #c4902c)', borderRadius: 99 }} />
        </div>
        {/* Chapter dots */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          {scenes.map((_, i) => (
            <button key={i} onClick={() => { setCurrentScene(i); setAiReply(null); }}
              style={{ width: i === currentScene ? 24 : 8, height: 8, borderRadius: 99, background: i === currentScene ? 'var(--gold)' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 380px)', gap: '1.5rem' }}
        className="story-grid">
        {/* Story card */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={currentScene} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              style={{ background: 'rgba(14,16,20,0.8)', border: '1px solid var(--border-subtle)', borderRadius: 22, padding: '2.5rem', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <ScrollText style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--gold)', opacity: 0.06 }} size={100} />
              <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', lineHeight: 1.9, color: 'var(--text)', position: 'relative', zIndex: 1, fontFamily: amFont }}>
                {scene.content}
              </p>
              <button 
                onClick={() => isSpeaking ? stop() : speak(scene.content, lang)}
                style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50%', padding: '0.6rem', color: 'var(--gold)', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={isSpeaking ? "Stop" : "Listen"}
              >
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button onClick={prev} disabled={currentScene === 0}
              style={{ flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: currentScene === 0 ? 'var(--text-muted)' : 'var(--text)', cursor: currentScene === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: amFont, transition: 'var(--transition)', opacity: currentScene === 0 ? 0.4 : 1 }}
              onMouseEnter={e => { if (currentScene > 0) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}>
              <ChevronLeft size={20} /> {t('story.prev')}
            </button>
            <button onClick={next} disabled={currentScene === scenes.length - 1}
              className="btn-primary"
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem', fontSize: '0.9rem', fontFamily: amFont, opacity: currentScene === scenes.length - 1 ? 0.4 : 1, cursor: currentScene === scenes.length - 1 ? 'not-allowed' : 'pointer' }}>
              {t('story.next')} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Historical Insight */}
          <div style={{ background: 'rgba(46,139,87,0.06)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 18, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: 'var(--green-soft)' }}>
              <div style={{ padding: '0.35rem', borderRadius: 8, background: 'rgba(46,139,87,0.15)' }}><MapPin size={16} /></div>
              <h4 style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: amFont }}>{t('story.insight_title')}</h4>
            </div>
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.75, fontSize: '0.9rem', fontFamily: amFont }}>
              "{scene.aiNote}"
            </p>
          </div>

          {/* AI ask panel */}
          <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 18, padding: '1.5rem', flexGrow: 1 }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontFamily: amFont }}>
              💬 {t('story.perspective')}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem', lineHeight: 1.7, fontFamily: amFont }}>
              {t('story.perspective_q')}
            </p>

            {aiReply && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1rem', marginBottom: '0.75rem', fontSize: '0.85rem', lineHeight: 1.75, color: 'var(--text)', fontFamily: amFont }}>
                {aiReply}
              </motion.div>
            )}
            {aiError && (
              <div style={{ fontSize: '0.82rem', color: '#ff6b6b', marginBottom: '0.75rem', fontFamily: amFont }}>⚠️ {aiError}</div>
            )}

            <button onClick={askAI} disabled={loadingAI}
              style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', cursor: loadingAI ? 'not-allowed' : 'pointer', padding: 0, fontFamily: amFont, opacity: loadingAI ? 0.6 : 1 }}>
              {loadingAI ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ChevronRight size={14} />}
              {t('story.ask_ai')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .story-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StoryMode;
