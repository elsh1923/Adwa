import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCcw, HelpCircle, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { explainQuizAnswer } from '../services/gemini';

interface Question {
  q_en: string;
  q_am: string;
  options_en: string[];
  options_am: string[];
  correct: number;
  explanation_en: string;
  explanation_am: string;
}

const quizData: Question[] = [
  {
    q_en: 'In what year did the Battle of Adwa take place?',
    q_am: 'የዓድዋ ውጊያ የተካሄደው መቼ ነው?',
    options_en: ['1889', '1896', '1902', '1935'],
    options_am: ['፲፰፹፩', '፲፰፹፰', '፲፰፺፩', '፲፱፳፭'],
    correct: 1,
    explanation_en: 'The Battle of Adwa occurred on March 1, 1896, marking a significant victory for Ethiopia over the Italian invaders.',
    explanation_am: 'የዓድዋ ውጊያ የካሄደው መጋቢት ፩ ቀን ፲፰፹፰ ዓ.ም ነው — ኢትዮጵያ ቅኝ ሰሪ ኢጣሊያን ያሸነፈችበት ቀን።',
  },
  {
    q_en: 'Which treaty was the primary cause of conflict between Ethiopia and Italy?',
    q_am: 'ከኢጣሊያ ጋር ጦርነትን ያስከተለው ስምምነት ማነው?',
    options_en: ['Treaty of Addis Ababa', 'Treaty of Wuchale', 'Berlin Conference', 'Treaty of Rome'],
    options_am: ['የአዲስ አበባ ስምምነት', 'የዉቻሌ ስምምነት', 'የበርሊን ኮንፈረንስ', 'የሮም ስምምነት'],
    correct: 1,
    explanation_en: 'The Treaty of Wuchale (1889) had a discrepancy between the Amharic and Italian versions regarding Ethiopia\'s sovereignty.',
    explanation_am: 'የዉቻሌ ስምምነት (፲፰፹፩) በሁለቱ ቋንቋዎች ኢትዮጵያ ሉዓላዊ ናት ወይ ብለው ሲጨቃጨቁ ጦርነቱ ሆነ።',
  },
  {
    q_en: 'Who was the primary female military leader and strategist at Adwa?',
    q_am: 'ዓድዋ ላይ ዋናዋ ሴት ወታደራዊ መሪና ስትራቴጂስት ማናት?',
    options_en: ['Queen Sheba', 'Empress Taytu Betul', 'Zewditu', 'Mentewab'],
    options_am: ['ንግሥት ሳባ', 'እቴጌ ጣይቱ ብጡል', 'ዘዉዲቱ', 'ምኒትዋብ'],
    correct: 1,
    explanation_en: 'Empress Taytu Betul was a brilliant strategist who notably led the siege of Mekelle and cut off Italian water supplies.',
    explanation_am: 'እቴጌ ጣይቱ ብጡል ብርቱ ስትራቴጂስት ሲሆኑ፣ የመቀሌ ከበባ ዘምቶ ኢጣሊያኖቹ ውሃ ቆርጠዋቸው ሸሸሟቸሁ።',
  },
  {
    q_en: 'What key advantage did Ethiopian forces have at Adwa?',
    q_am: 'ኢትዮጵያ ዓድዋ ላይ ያላት ቁልፍ ጥቅም ምንድን ነው?',
    options_en: ['Superior navy', 'Knowledge of terrain', 'Foreign allies', 'Better communication technology'],
    options_am: ['የላቀ ባህር ኃይል', 'የምድሩ እውቀት', 'የውጭ ወዳጆች', 'የተሻለ ፌዴሬሽን'],
    correct: 1,
    explanation_en: 'Ethiopian fighters knew the rugged Adwa mountains intimately, using the terrain to isolate and defeat Italian columns one by one.',
    explanation_am: 'ኢትዮጵያ ተዋጊዎቹ የዓድዋ ተራሮቹን ጠንቅቀው ያውቁ ነበር — ኢጣሊያኖቹን ቦቃ ቦቃ አደርጓቸው።',
  },
  {
    q_en: 'What did the Battle of Adwa symbolize for colonized peoples worldwide?',
    q_am: 'የዓድዋ ውጊያ ለቅኝ ሰርያ ለነዚ ሕዝቦች ምን ምሳሌ ሆናቸው?',
    options_en: ['European supremacy', 'Hope and resistance against colonialism', 'End of African kingdoms', 'Start of WWI'],
    options_am: ['የአውሮፓ ኃይል', 'ቅኝ ሰርዮዎች ሊሸነፉ ይቻላቸዋል', 'የዓፍሪካ ሀገሮቱ ሽብርቃ', '፩ አለም ጦርነት ጅማሮ'],
    correct: 1,
    explanation_en: 'Adwa became a global symbol of resistance and hope, proving that colonized peoples could resist and defeat European powers.',
    explanation_am: 'ዓድዋ ለዓለም ሁሉ ቅኝ ሰርዮዎቹ ሊሸነፉ ይቻላቸዋል ብሎ ያስተማረ ምሳሌ ሆኗቸ።',
  },
  {
    q_en: 'Who commanded the vanguard forces during the victory at the Battle of Amba Alagi?',
    q_am: 'በአምባላጌ ጦርነት ግንባር ቀደም ጦሩን የመሩት አዛዥ ማን ናቸው?',
    options_en: ['Ras Alula', 'Ras Makonnen & Fitawrari Gebeyehu', 'Ras Mikael', 'Ras Mengesha'],
    options_am: ['ራስ አሉላ', 'ራስ መኮንን እና ፊታውራሪ ገበየሁ', 'ራስ ሚካኤል', 'ራስ መንገሻ'],
    correct: 1,
    explanation_en: 'Ras Makonnen and Fitawrari Gebeyehu led the forces that secured a decisive victory at Amba Alagi in December 1895.',
    explanation_am: 'በሕዳር ፲፰፻፹፰ ዓ.ም በአምባላጌ ጦርነት በራስ መኮንን እና በፊታውራሪ ገበየሁ የሚመራው ጦር ታላቅ ድል ተቀዳጅቷል።',
  },
  {
    q_en: 'Which Ethiopian general is known as the "Eagle of Ethiopia" and was a key strategist at Adwa?',
    q_am: 'የዓድዋ ውጊያ ቁልፍ ስትራቴጂስትና "የሰሜኑ አንበሳ" በሚል የሚታወቁት ጄኔራል ማን ናቸው?',
    options_en: ['Ras Alula Engida', 'Dejazmach Balcha', 'Fitawrari Habte Giyorgis', 'Ras Mikael'],
    options_am: ['ራስ አሉላ እንግዳ', 'ደጃዝማች ባልቻ', 'ፊታውራሪ ሀብተ ጊዮርጊስ', 'ራስ ሚካኤል'],
    correct: 0,
    explanation_en: 'Ras Alula Engida was a legendary military commander who designed the tactical formations that outmaneuvered the Italians at Adwa.',
    explanation_am: 'ራስ አሉላ እንግዳ የኢጣሊያን ጦር ከጥቅም ውጭ ያደረጉ ወታደራዊ ስልቶችን የቀረጹ ዝነኛ የጦር አዛዥ ናቸው።',
  },
  {
    q_en: 'Which peace treaty officially ended the First Italo-Ethiopian War?',
    q_am: 'የመጀመሪያውን የኢጣሊያ-ኢትዮጵያ ጦርነት በይፋ ያቆመው የሰላም ስምምነት የትኛው ነው?',
    options_en: ['Treaty of Versaille', 'Treaty of Wuchale', 'Treaty of Addis Ababa', 'Treaty of Rome'],
    options_am: ['የቨርሳይ ስምምነት', 'የውጫሌ ስምምነት', 'የአዲስ አበባ ስምምነት', 'የሮም ስምምነት'],
    correct: 2,
    explanation_en: 'The Treaty of Addis Ababa (Oct 1896) forced Italy to recognize Ethiopia\'s full independence and cancel the Treaty of Wuchale.',
    explanation_am: 'ጥቅምት ፲፮ ቀን ፲፰፻፹፱ ዓ.ም የተፈረመው የአዲስ አበባ ስምምነት ኢጣሊያ የኢትዮጵያን ሙሉ ነጻነት እንድታውቅ አስገድዷል።',
  },
  {
    q_en: 'Which ethnic group was famous for their powerful cavalry charge that shattered Italian formations?',
    q_am: 'በዓድዋ ውጊያ የኢጣሊያን ጦር መስመር የሰባበረው ዝነኛው ፈረሰኛ ጦር የትኛው ነው?',
    options_en: ['Wollo Oromo Cavalry', 'Begemder Infantry', 'Gojjam Forces', 'Tigray Lancers'],
    options_am: ['የወሎ ኦሮሞ ፈረሰኛ ጦር', 'የበጌምድር እግረኛ', 'የጎጃም ጦር', 'የትግራይ ተዋጊዎች'],
    correct: 0,
    explanation_en: 'Ras Mikael of Wollo led the legendary cavalry charges that were instrumental in breaking the Italian brigade lines.',
    explanation_am: 'በራስ ሚካኤል የሚመራው የወሎ ኦሮሞ ፈረሰኛ ጦር የኢጣሊያን ብርጌዶች በመበተን ረገድ ወሳኝ ሚና ተጫውቷል።',
  },
  {
    q_en: 'Who was the War Minister known as "Abba Mala" for his wisdom and tactical advice to Menelik II?',
    q_am: '"አባ መላ" በሚል ቅጽል ስም የሚታወቁት የዳግማዊ ምኒልክ ታማኝ የጦር ሚኒስትር ማን ናቸው?',
    options_en: ['Ras Makonnen', 'Fitawrari Habte Giyorgis', 'Ras Mikael', 'Ras Alula'],
    options_am: ['ራስ መኮንን', 'ፊታውራሪ ሀብተ ጊዮርጊስ', 'ራስ ሚካኤል', 'ራስ አሉላ'],
    correct: 1,
    explanation_en: 'Fitawrari Habte Giyorgis Dinagde was nicknamed "Abba Mala" (Father of Strategy) for his brilliant military advice and leadership.',
    explanation_am: 'ፊታውራሪ ሀብተ ጊዮርጊስ ዲናግዴ በብልህነታቸውና በመልካም ወታደራዊ ምክራቸው "አባ መላ" ተብለው ይጠሩ ነበር።',
  },
];

const Quiz: React.FC = () => {
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const q = quizData[currentStep];
  const question = q.q_en;
  const options   = q.options_en;
  const staticExplanation = q.explanation_en;

  const handleOptionClick = async (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);

    // Fetch Gemini explanation
    setLoadingAI(true);
    try {
      const reply = await explainQuizAnswer(question, options[q.correct]);
      setAiExplanation(reply);
    } catch {
      setAiExplanation(null); // fallback to static
    } finally {
      setLoadingAI(false);
    }
  };

  const nextQuestion = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setAiExplanation(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0); setScore(0); setShowResult(false);
    setSelectedOption(null); setIsAnswered(false); setAiExplanation(null);
  };

  const getScoreEmoji = () => {
    const pct = score / quizData.length;
    if (pct === 1) return '🏆';
    if (pct >= 0.7) return '⭐';
    if (pct >= 0.4) return '📚';
    return '💪';
  };

  // ── Result screen ──
  if (showResult) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: 560, margin: '4rem auto', background: 'rgba(14,16,20,0.9)', border: '1px solid var(--border)', borderRadius: 28, padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 0 60px rgba(212,175,55,0.1)' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
          {getScoreEmoji()}
        </div>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>{t('quiz.complete')}</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontFamily: 'inherit' }}>
            {t('quiz.score')} <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{score} / {quizData.length}</span>
          </p>
        </div>

        {/* Score bar */}
        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(score / quizData.length) * 100}%` }} transition={{ duration: 1, delay: 0.3 }}
            style={{ height: '100%', background: 'linear-gradient(to right, var(--gold), #c4902c)', borderRadius: 99 }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={resetQuiz} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}>
            <RefreshCcw size={16} /> {t('quiz.try_again')}
          </button>
          <NavLink to="/" className="btn-ghost" style={{ fontFamily: 'inherit' }}>
            {t('quiz.back_home')}
          </NavLink>
        </div>
      </motion.div>
    );
  }

  // ── Question screen ──
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ maxWidth: 760, margin: '3rem auto', padding: '0 0 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, color: 'var(--text)' }}>
          {t('quiz.title')}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 99, padding: '0.4rem 1rem', color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit', flexShrink: 0 }}>
          {t('quiz.question_of')} {currentStep + 1} {t('quiz.of')} {quizData.length}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginBottom: '2rem', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }} transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'linear-gradient(to right, var(--gold), #c4902c)', borderRadius: 99 }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          style={{ background: 'rgba(14,16,20,0.85)', border: '1px solid var(--border-subtle)', borderRadius: 22, padding: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            {question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.03)';
              let border = 'var(--border-subtle)';
              let color = 'var(--text)';
              if (isAnswered) {
                if (i === q.correct) { bg = 'rgba(46,139,87,0.12)'; border = 'rgba(46,139,87,0.5)'; color = '#4ade80'; }
                else if (i === selectedOption) { bg = 'rgba(139,0,0,0.12)'; border = 'rgba(139,0,0,0.5)'; color = '#f87171'; }
                else { color = 'var(--text-muted)'; }
              }

              return (
                <button key={i} disabled={isAnswered} onClick={() => handleOptionClick(i)}
                  style={{ padding: '1rem 1.25rem', borderRadius: 14, border: `1.5px solid ${border}`, background: bg, color, display: 'flex', alignItems: 'center', gap: '1rem', cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.25s', fontFamily: 'inherit', opacity: isAnswered && i !== q.correct && i !== selectedOption ? 0.45 : 1 }}
                  onMouseEnter={e => { if (!isAnswered) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.05)'; } }}
                  onMouseLeave={e => { if (!isAnswered) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; } }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, color }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{ fontSize: '1rem' }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanation + Next */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
            <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 18, padding: '1.5rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              {loadingAI
                ? <Loader2 size={18} style={{ color: 'var(--gold)', flexShrink: 0, animation: 'spin 1s linear infinite', marginTop: '0.1rem' }} />
                : <HelpCircle size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.1rem' }} />
              }
              <div>
                <p style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '0.35rem', fontSize: '0.85rem', fontFamily: 'inherit' }}>{t('quiz.ai_insight')}</p>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: 'inherit' }}>
                  {loadingAI ? 'Gemini is thinking…' : (aiExplanation ?? staticExplanation)}
                </p>
              </div>
            </div>

            <button onClick={nextQuestion} className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1rem', fontFamily: 'inherit' }}>
              {currentStep === quizData.length - 1 ? t('quiz.results') : t('quiz.next')} <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default Quiz;
