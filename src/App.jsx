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
    manualCut
  } = useTarotGame();

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle shuffle sound during animation
  useEffect(() => {
    if (gameState === 'SHUFFLING') {
      playShuffleSound();
    }
  }, [gameState, playShuffleSound]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      <Navbar isDark={isDark} setIsDark={setIsDark} resetGame={resetGame} openCalendar={openCalendar} />

      <main className="relative pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {gameState === 'MENU' && (
          <MenuState
            topic={topic}
            setTopic={setTopic}
            readingType={readingType}
            setReadingType={setReadingType}
            startReading={startReading}
            isDark={isDark}
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
          <ThaiLunarCalendar resetGame={resetGame} isDark={isDark} />
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
