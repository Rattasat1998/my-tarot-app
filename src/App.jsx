import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Import pages
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';
import { LottoInsightPage } from './pages/LottoInsightPage';
import { LottoDetailPage } from './pages/LottoDetailPage';
import { LottoCheckPage } from './pages/LottoCheckPage';
import { ZodiacPage } from './pages/ZodiacPage';

function App() {
  const [isDark, setIsDark] = useState(true);

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <>
      <Routes>
        <Route path="/" element={<GamePage isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/profile" element={<ProfilePage isDark={isDark} />} />
        <Route path="/history" element={<HistoryPage isDark={isDark} />} />
        <Route path="/lotto" element={<LottoInsightPage />} />
        <Route path="/lotto/check" element={<LottoCheckPage />} />
        <Route path="/lotto/:drawId" element={<LottoDetailPage />} />
        <Route path="/zodiac" element={<ZodiacPage />} />
        <Route path="/admin/*" element={<AdminPage isDark={isDark} />} />
      </Routes>

    </>
  );
}

export default App;
