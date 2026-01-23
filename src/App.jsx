import React, { useState, useEffect } from 'react';
import { useTarotGame } from './hooks/useTarotGame';
import { useAudio } from './hooks/useAudio';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/layout/Footer';
import { MenuState } from './components/game/MenuState';
import { ShufflingState } from './components/game/ShufflingState';
import { CuttingState } from './components/game/CuttingState';
import { PickingState } from './components/game/PickingState';
import { ResultState } from './components/game/ResultState';
import { ThaiLunarCalendar } from './components/calendar/ThaiLunarCalendar';
import { BankHolidaysCalendar } from './components/calendar/BankHolidaysCalendar';
import { WanPhraCalendar } from './components/calendar/WanPhraCalendar';
import { AuspiciousCalendar } from './components/calendar/AuspiciousCalendar';
import { PakkhaCalendar } from './components/calendar/PakkhaCalendar';
import { ArticlePage } from './components/articles/ArticlePage';
import { FutureConfirmDialog } from './components/modals/FutureConfirmDialog';

function App() {
  const [isDark, setIsDark] = useState(true);

  // Initialize hooks
  const { playShuffleSound } = useAudio();
  const {
    gameState,
    deck,
    selectedCards,
    revealedIndices,
    readingType,
    topic,
    isDrawingFuture,
    showFutureDialog,
    requiredPickCount,
    isSelectionComplete,
    setTopic,
    setReadingType,
    setShowFutureDialog,
    setIsDrawingFuture,
    setGameState,
    resetGame,
    startReading,
    openCalendar,
    handleCardPick,
    confirmReading,
    onShuffleComplete,
    onCutComplete,
    manualShuffle,
    manualCut,
    calendarType,
    articleId,
    openArticle
  } = useTarotGame();

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle scroll to top on state change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameState, isDrawingFuture]);

  // Handle shuffle sound during animation
  useEffect(() => {
    if (gameState === 'SHUFFLING') {
      playShuffleSound();
    }
  }, [gameState, playShuffleSound]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Spectacular Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <img
          src="/bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90"></div>
        {/* Animated Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <Navbar isDark={isDark} setIsDark={setIsDark} resetGame={resetGame} openCalendar={openCalendar} openArticle={openArticle} />

      <main className="relative pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {gameState === 'MENU' && (
          <MenuState
            topic={topic}
            setTopic={setTopic}
            readingType={readingType}
            setReadingType={setReadingType}
            startReading={startReading}
            isDark={isDark}
            openArticle={openArticle}
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

      <Footer isDark={isDark} gameState={gameState} />

      {showFutureDialog && (
        <FutureConfirmDialog
          onConfirm={() => {
            setShowFutureDialog(false);
            setIsDrawingFuture(true);
            setGameState('SHUFFLING');
          }}
          onCancel={() => setShowFutureDialog(false)}
        />
      )}
    </div>
  );
}

export default App;
