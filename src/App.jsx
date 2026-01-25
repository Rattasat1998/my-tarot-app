import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Import pages
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';

import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { DailyRewardModal } from './components/modals/DailyRewardModal';

function App() {
  const [isDark, setIsDark] = useState(true);
  const { user } = useAuth();

  // Daily Reward State
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState({ streak: 0, checked_in_today: false });

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Check Daily Login Status
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('get_daily_checkin_status');
        if (error) throw error;

        // data: { streak: int, checked_in_today: boolean, is_streak_broken: boolean }
        if (data) {
          setRewardData({ streak: data.streak, checked_in_today: data.checked_in_today });
          // Auto-open modal if not checked in today
          if (!data.checked_in_today) {
            setShowRewardModal(true);
          }
        }
      } catch (err) {
        console.error('Error checking status:', err);
      }
    };

    checkStatus();
  }, [user]);

  return (
    <>
      <Routes>
        <Route path="/" element={<GamePage isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/profile" element={<ProfilePage isDark={isDark} />} />
        <Route path="/history" element={<HistoryPage isDark={isDark} />} />
        <Route path="/admin/*" element={<AdminPage isDark={isDark} />} />
      </Routes>

      <DailyRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        streak={rewardData.streak}
        checked_in_today={rewardData.checked_in_today}
        isDark={isDark}
      />
    </>
  );
}

export default App;
