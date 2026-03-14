import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { useLanguage } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import StoryMode from './pages/StoryMode';
import HeroesChat from './pages/HeroesChat';
import Strategy from './pages/Strategy';
import Quiz from './pages/Quiz';

// Placeholder Timeline page
const Timeline = () => {
  const { t } = useLanguage();
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '1rem' }}>
        {t('nav.timeline')}
      </h2>
      <p>{t('lang.en') === 'English' ? 'Coming soon — the complete chronological story of Adwa.' : 'በቅርቡ ይመጣል።'}</p>
    </div>
  );
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/story"    element={<StoryMode />} />
          <Route path="/chat"     element={<HeroesChat />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/quiz"     element={<Quiz />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;
