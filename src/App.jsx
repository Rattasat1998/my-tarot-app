import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// Import pages
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';
import { LottoInsightPage } from './pages/LottoInsightPage';
import { LottoDetailPage } from './pages/LottoDetailPage';
import { LottoCheckPage } from './pages/LottoCheckPage';
import { ZodiacPage } from './pages/ZodiacPage';
import { SoulmatePage } from './pages/SoulmatePage';
import { RunePage } from './pages/RunePage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentCancelPage } from './pages/PaymentCancelPage';
import { BuddhistCeremonyPage } from './pages/BuddhistCeremonyPage';
import { ZodiacHoroscopePage } from './pages/ZodiacHoroscopePage';
import { AncientRunesPage } from './pages/AncientRunesPage';
import NumerologyPage from './pages/NumerologyPage';
import FengShuiPage from './pages/FengShuiPage';
import PalmistryPage from './pages/PalmistryPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import { LineCallbackPage } from './pages/LineCallbackPage';
import { MeditationPage } from './pages/MeditationPage';
import { MembershipPage } from './pages/MembershipPage';
import { ZodiacReportPage } from './pages/ZodiacReportPage';
import { JournalPage } from './pages/JournalPage';
import { SearchPage } from './pages/SearchPage';
import { CommunityPage } from './pages/CommunityPage';
import ShopPage from './pages/ShopPage';
import { DailyOraclePage } from './pages/DailyOraclePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { FortuneChatPage } from './pages/FortuneChatPage';
import { FloatingFortuneButton } from './components/ui/FloatingFortuneButton';

const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
const BASE_URL = 'https://satduangdao.com';
const NO_INDEX_ROUTES = new Set([
  '/auth/line-callback',
  '/community',
  '/fortune-chat',
  '/history',
  '/journal',
  '/meditation',
  '/membership',
  '/payment/cancel',
  '/payment/success',
  '/profile',
  '/search',
  '/shop',
  '/zodiac-report',
]);

const shouldNoIndexPath = (pathname) => (
  pathname.startsWith('/admin') || NO_INDEX_ROUTES.has(pathname)
);

function App() {
  const isDark = true; // Always dark mode
  const location = useLocation();
  const isFortuneChatPage = location.pathname === '/fortune-chat';

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const upsertMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', `${BASE_URL}${location.pathname}`);
    upsertMeta('robots', shouldNoIndexPath(location.pathname) ? 'noindex, follow' : DEFAULT_ROBOTS);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<GamePage isDark={isDark} />} />
        <Route path="/profile" element={<ProfilePage isDark={isDark} />} />
        <Route path="/history" element={<HistoryPage isDark={isDark} />} />
        <Route path="/lotto" element={<LottoInsightPage />} />
        <Route path="/lotto/check" element={<LottoCheckPage />} />
        <Route path="/lotto/:drawId" element={<LottoDetailPage />} />
        <Route path="/zodiac" element={<ZodiacPage />} />
        <Route path="/soulmate" element={<SoulmatePage />} />
        <Route path="/runes" element={<RunePage />} />
        <Route path="/ceremony" element={<BuddhistCeremonyPage />} />
        <Route path="/horoscope-2569" element={<ZodiacHoroscopePage />} />
        <Route path="/ancient-runes" element={<AncientRunesPage />} />
        <Route path="/numerology-article" element={<NumerologyPage />} />
        <Route path="/feng-shui-article" element={<FengShuiPage />} />
        <Route path="/palmistry-article" element={<PalmistryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/meditation" element={<MeditationPage isDark={isDark} />} />
        <Route path="/zodiac-report" element={<ZodiacReportPage isDark={isDark} />} />
        <Route path="/journal" element={<JournalPage isDark={isDark} />} />
        <Route path="/community" element={<CommunityPage isDark={isDark} />} />
        <Route path="/search" element={<SearchPage isDark={isDark} />} />
        <Route path="/shop" element={<ShopPage isDark={isDark} />} />
        <Route path="/membership" element={<MembershipPage isDark={isDark} />} />
        <Route path="/daily-oracle" element={<DailyOraclePage isDark={isDark} />} />
        <Route path="/fortune-chat" element={<FortuneChatPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage isDark={isDark} />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage isDark={isDark} />} />
        <Route path="/admin/*" element={<AdminPage isDark={isDark} />} />
        <Route path="/auth/line-callback" element={<LineCallbackPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage isDark={isDark} />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage isDark={isDark} />} />
      </Routes>
      {!isFortuneChatPage && <FloatingFortuneButton />}
    </>
  );
}

// Wrapper component to provide routing context
const AppWrapper = () => (
  <App />
);

export default AppWrapper;
