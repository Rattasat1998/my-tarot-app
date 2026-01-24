import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { MenuState } from './components/game/MenuState';
import { ShufflingState } from './components/game/ShufflingState';
import { CuttingState } from './components/game/CuttingState';
import { PickingState } from './components/game/PickingState';
import { ResultState } from './components/game/ResultState';
import { Footer } from './components/layout/Footer';
import { ThaiLunarCalendar } from './components/calendar/ThaiLunarCalendar';
import { BankHolidaysCalendar } from './components/calendar/BankHolidaysCalendar';
import { WanPhraCalendar } from './components/calendar/WanPhraCalendar';
import { AuspiciousCalendar } from './components/calendar/AuspiciousCalendar';
import { PakkhaCalendar } from './components/calendar/PakkhaCalendar';
import { ArticlePage } from './components/articles/ArticlePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TopUpModal } from './components/modals/TopUpModal';
import { FutureConfirmDialog } from './components/modals/FutureConfirmDialog';
import { useTarotGame } from './hooks/useTarotGame';
import { useAudio } from './hooks/useAudio';
import { useCredits } from './hooks/useCredits';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

// Helper to determine cost
const getReadingCost = (topic) => {
  if (topic === 'daily') return { cost: 1, isDaily: true };
  if (topic === 'monthly') return { cost: 10, isDaily: false };
  if (topic === 'love') return { cost: 5, isDaily: false };
  return { cost: 3, isDaily: false }; // work, finance, health, social, fortune
};

function App() {
  const [isDark, setIsDark] = useState(true);
  const [calendarType, setCalendarType] = useState('lunar');
  const [articleId, setArticleId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [showFutureDialog, setShowFutureDialog] = useState(false);
  const [currentReadingId, setCurrentReadingId] = useState(null);

  const {
    gameState,
    setGameState,
    topic,
    setTopic,
    readingType,
    setReadingType,
    deck,
    selectedCards,
    requiredPickCount,
    revealedIndices,
    handleCardPick,
    handleStartReading: gameStartReading, // Rename to avoid conflict
    confirmReading: gameConfirmReading,
    onShuffleComplete,
    onCutComplete,
    resetGame: gameReset,
    manualShuffle,
    manualCut,
    isSelectionComplete,
    isDrawingFuture,
    setIsDrawingFuture
  } = useTarotGame();

  const { playShuffleSound, playRevealSound } = useAudio();
  const { credits, isLoading: creditsLoading, useCredit, addCredits, checkDailyFree } = useCredits();
  const { user, isAdmin } = useAuth();

  // Daily Free Check State
  const [isDailyFreeAvailable, setIsDailyFreeAvailable] = useState(false);

  useEffect(() => {
    if (user) {
      checkDailyFree().then(setIsDailyFreeAvailable);
    }
  }, [user, checkDailyFree, gameState]); // Re-check when game state changes (e.g. back to menu)

  // Sound effects for shuffling
  useEffect(() => {
    if (gameState === 'SHUFFLING') {
      playShuffleSound();
    }
  }, [gameState, playShuffleSound]);

  const handleStartReading = async () => {
    // Determine credit cost based on topic
    let { cost, isDaily } = getReadingCost(topic);

    // User Request: 2-card reading costs double
    // Only apply if the topic SUPPORTS 2-card readings (i.e., not daily, monthly, or love)
    const fixedTopics = ['daily', 'monthly', 'love'];
    if (readingType === '2-cards' && !fixedTopics.includes(topic)) {
      cost = cost * 2;
    }

    // Check if this is a free daily reading or a paid reading
    const isFreeDaily = isDaily && isDailyFreeAvailable;

    // If daily free is available OR user has credits, proceed
    if (isFreeDaily || credits >= cost) {
      // If free daily, cost is 0 and we mark it as daily
      // If paid (including paid daily after free is used), cost applies and isDaily=false
      const effectiveCost = isFreeDaily ? 0 : cost;
      const treatAsDaily = isFreeDaily; // Only treat as daily if it's actually the free daily

      const result = await useCredit(effectiveCost, treatAsDaily);
      if (result.success) {
        setGameState('SHUFFLING');
        // IMPORTANT: Play sound is handled by useEffect above
      } else {
        // Handle failure (e.g. daily limit reached or insufficient credits)
        if (result.message === 'Daily reading allowed once per day') {
          // This shouldn't happen now, but just in case
          alert('คุณใช้สิทธิ์ดูดวงรายวันฟรีไปแล้ว จะใช้เครดิตแทน');
        } else {
          // Insufficient credits
          alert(`เครดิตไม่พอ? \nServer Message: ${result.message}\nApp thinks: Credits=${credits}, Cost=${cost}\nPlease tell the developer this message.`);
          setIsTopUpOpen(true);
        }
      }
    } else {
      // Otherwise open top up modal
      setIsTopUpOpen(true);
    }
  };

  const resetGame = () => {
    gameReset();
    setArticleId(null);
    setCurrentReadingId(null);
  };

  const openCalendar = (type) => {
    setCalendarType(type);
    setGameState('CALENDAR');
    setArticleId(null);
  };

  const openArticle = (id) => {
    setArticleId(id);
    setGameState('ARTICLE');
  };

  // Save reading to history (or update existing if drawing future)
  const saveReadingResult = async (currentSelectedCards, isFutureUpdate = false) => {
    console.log('saveReadingResult called:', {
      isFutureUpdate,
      currentReadingId,
      cardCount: currentSelectedCards.length,
      cardNames: currentSelectedCards.map(c => c.name),
      isDrawingFuture
    });
    if (!user) return; // Only save if logged in

    try {
      if (isFutureUpdate && currentReadingId) {
        console.log('Updating reading with ID:', currentReadingId);
        console.log('Cards to save:', JSON.stringify(currentSelectedCards, null, 2));
        // Update existing reading with the new future card
        const { error } = await supabase
          .from('reading_history')
          .update({
            cards: currentSelectedCards
          })
          .eq('id', currentReadingId);

        if (error) throw error;
        console.log('Reading updated with future card');
      } else {
        // Create new reading
        const { data, error } = await supabase
          .from('reading_history')
          .insert({
            user_id: user.id,
            topic: topic,
            reading_type: readingType,
            cards: currentSelectedCards,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        // Store the reading ID for potential future update
        if (data) {
          setCurrentReadingId(data.id);
        }
        console.log('Reading saved to history with id:', data?.id);
      }
    } catch (err) {
      console.error('Error saving reading:', err);
    }
  };

  const confirmReading = () => {
    console.log('confirmReading - selectedCards:', selectedCards.map(c => c.name));
    console.log('confirmReading - isDrawingFuture:', isDrawingFuture);
    setGameState('RESULT');
    saveReadingResult(selectedCards, isDrawingFuture);
    playRevealSound();
  };

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900 font-sans'}`}>
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-10'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
      </div>

      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        resetGame={resetGame}
        openCalendar={openCalendar}
        openArticle={openArticle}
        credits={credits}
        onOpenTopUp={() => setIsTopUpOpen(true)}
      />

      <main className="relative pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {gameState === 'MENU' && (
          <MenuState
            topic={topic}
            setTopic={setTopic}
            readingType={readingType}
            setReadingType={setReadingType}
            startReading={handleStartReading}
            isDark={isDark}
            openArticle={openArticle}
            credits={credits}
            isDailyFreeAvailable={isDailyFreeAvailable}
          />
        )}

        {gameState === 'SHUFFLING' && (
          <ShufflingState onShuffleComplete={onShuffleComplete} />
        )}

        {gameState === 'CUTTING' && (
          <CuttingState onCutComplete={onCutComplete} />
        )}

        {gameState === 'PICKING' && (
          <PickingState
            deck={deck}
            selectedCards={selectedCards}
            handleCardPick={handleCardPick}
            requiredPickCount={requiredPickCount}
            confirmReading={confirmReading}
            isSelectionComplete={isSelectionComplete}
            isDark={isDark}
            manualShuffle={manualShuffle}
            manualCut={manualCut}
            resetGame={resetGame}
            topic={topic}
            readingType={readingType}
            isDrawingFuture={isDrawingFuture}
          />
        )}

        {gameState === 'RESULT' && (
          <ResultState
            topic={topic}
            readingType={readingType}
            selectedCards={selectedCards}
            revealedIndices={revealedIndices}
            resetGame={resetGame}
            isDrawingFuture={isDrawingFuture}
            setShowFutureDialog={setShowFutureDialog}
            credits={credits}
          />
        )}

        {gameState === 'CALENDAR' && (
          <>
            {calendarType === 'lunar' && <ThaiLunarCalendar resetGame={resetGame} isDark={isDark} />}
            {calendarType === 'holidays' && <BankHolidaysCalendar resetGame={resetGame} isDark={isDark} />}
            {calendarType === 'wanphra' && <WanPhraCalendar resetGame={resetGame} isDark={isDark} />}
            {calendarType === 'auspicious' && <AuspiciousCalendar resetGame={resetGame} isDark={isDark} />}
            {calendarType === 'pakkha' && <PakkhaCalendar resetGame={resetGame} isDark={isDark} />}
          </>
        )}

        {gameState === 'ARTICLE' && (
          <ArticlePage articleId={articleId} resetGame={resetGame} openArticle={openArticle} />
        )}
      </main>

      <Footer isDark={isDark} gameState={gameState} onOpenAdmin={() => setIsAdminOpen(true)} isAdmin={isAdmin} />

      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} isDark={isDark} />
      )}

      {showFutureDialog && (
        <FutureConfirmDialog
          onConfirm={async () => {
            // Future cost is fixed at 1 credit for now
            const cost = 1;

            if (credits >= cost) {
              const result = await useCredit(cost, false); // isDaily = false
              if (result.success) {
                setShowFutureDialog(false);
                setIsDrawingFuture(true);
                setGameState('SHUFFLING');
              } else {
                alert('เกิดข้อผิดพลาดในการตัดเครดิต: ' + result.message);
              }
            } else {
              alert('เครดิตไม่พอสำหรับดูอนาคต (ตัองการ 1 เครดิต)');
              setShowFutureDialog(false);
              setIsTopUpOpen(true);
            }
          }}
          onCancel={() => setShowFutureDialog(false)}
          isDark={isDark}
        />
      )}

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}

export default App;
