import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import StoryMode from './pages/StoryMode';
import HeroesChat from './pages/HeroesChat';
import Strategy from './pages/Strategy';
import Quiz from './pages/Quiz';
import Timeline from './pages/Timeline';

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
