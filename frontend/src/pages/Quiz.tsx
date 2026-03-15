import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCcw, HelpCircle, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { explainQuizAnswer } from '../services/gemini';
import { API_BASE } from '../services/apiConfig';

interface Question {
  q_en: string;
  options_en: string[];
  correct: number;
  explanation_en: string;
}

// Removed static quizData - we will generate it dynamically.

const Quiz: React.FC = () => {
  const { t } = useLanguage();

  const [quizData, setQuizData] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const loadQuiz = async () => {
    setLoadingQuiz(true);
    setFetchError(false);
    const url = `${API_BASE}/api/quiz`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const data = await resp.json();
      
      const processed = data.map((q: any) => ({
        ...q,
      }));
      setQuizData(processed);
    } catch (e: any) {
      console.error(`Quiz fetch error at ${url}:`, e);
      setFetchError(true);
    } finally {
      setLoadingQuiz(false);
    }
  };

  React.useEffect(() => {
    loadQuiz();
  }, []);

  if (loadingQuiz) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--gold)' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontFamily: 'Outfit, sans-serif' }}>
           Generating questions from Adwa knowledge base...
        </p>
      </div>
    );
  }

  if (fetchError || quizData.length === 0) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: '#ff6b6b' }}>
        <p style={{ fontFamily: 'Outfit, sans-serif' }}>Failed to generate the quiz. Ensure the backend is running.</p>
        <button onClick={loadQuiz} className="btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  const q = quizData[currentStep];
  const question = q.q_en;
  const options = q.options_en;
  const staticExplanation = q.explanation_en;

  const handleOptionClick = async (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);

    // Fetch Gemini explanation
    setLoadingAI(true);
    try {
      // Pass preferred language to explanation service if possible
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
    loadQuiz(); // fetch a brand new quiz from the AI backend!
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
        style={{ maxWidth: 560, margin: '4rem auto', background: 'transparent', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
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
          style={{ background: 'transparent', padding: '1rem 0', marginBottom: '1rem' }}>
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
