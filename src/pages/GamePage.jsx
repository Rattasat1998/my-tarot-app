import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { READING_TOPICS } from '../constants/readingTopics';
import { Navbar } from '../components/navigation/Navbar';
import { MenuState } from '../components/game/MenuState';
import { ShufflingState } from '../components/game/ShufflingState';
import { CuttingState } from '../components/game/CuttingState';
import { PickingState } from '../components/game/PickingState';
import { ResultState } from '../components/game/ResultState';
import { Footer } from '../components/layout/Footer';
import { ThaiLunarCalendar } from '../components/calendar/ThaiLunarCalendar';
import { BankHolidaysCalendar } from '../components/calendar/BankHolidaysCalendar';
import { WanPhraCalendar } from '../components/calendar/WanPhraCalendar';
import { AuspiciousCalendar } from '../components/calendar/AuspiciousCalendar';
import { PakkhaCalendar } from '../components/calendar/PakkhaCalendar';
import { ArticlePage } from '../components/articles/ArticlePage';
import { TopUpModal } from '../components/modals/TopUpModal';
import { FutureConfirmDialog } from '../components/modals/FutureConfirmDialog';
import { TermsModal } from '../components/modals/TermsModal';
import { PrivacyModal } from '../components/modals/PrivacyModal';
import { AgeVerificationModal } from '../components/modals/AgeVerificationModal';
import { WarpTransition } from '../components/ui/WarpTransition';
import { ConfirmReadingDialog } from '../components/modals/ConfirmReadingDialog';
import { Screensaver } from '../components/ui/Screensaver';
import { useTarotGame } from '../hooks/useTarotGame';
import { useCredits } from '../hooks/useCredits';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext'; // Import useSound
import { supabase } from '../lib/supabase';

// Helper to determine cost
const getReadingCost = (topic) => {
    if (topic === 'daily') return { cost: 1, isDaily: true };
    if (topic === 'monthly') return { cost: 10, isDaily: false };
    if (topic === 'love') return { cost: 5, isDaily: false };
    return { cost: 3, isDaily: false }; // work, finance, health, social, fortune
};

export function GamePage({ isDark, setIsDark }) {
    const navigate = useNavigate();
    const { isMuted, toggleMute, playBGM, playSFX } = useSound(); // Initialize Hook
    const [calendarType, setCalendarType] = useState('lunar');
    const [articleId, setArticleId] = useState(null);

    // Initial BGM Start
    useEffect(() => {
        const handleInteraction = () => {
            playBGM();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [playBGM]);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [showFutureDialog, setShowFutureDialog] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [showAgeVerification, setShowAgeVerification] = useState(() => {
        // Check if user already accepted age verification
        return localStorage.getItem('ageVerified') !== 'true';
    });
    const [currentReadingId, setCurrentReadingId] = useState(null);
    const [showWarp, setShowWarp] = useState(false);
    const [pendingReading, setPendingReading] = useState(false);
    const [showConfirmReading, setShowConfirmReading] = useState(false);
    const [pendingCreditCost, setPendingCreditCost] = useState(0);
    const [pendingIsFreeDaily, setPendingIsFreeDaily] = useState(false);

    // Use ref for saving lock to prevent duplicates
    const isSavingRef = useRef(false);

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
        handleStartReading: gameStartReading,
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

    const {
        credits,
        isLoading: creditsLoading,
        useCredit,
        addCredits,
        checkDailyFree,
        isDailyFreeAvailable
    } = useCredits();
    const { user, isAdmin } = useAuth();

    // Sound effects for shuffling
    useEffect(() => {
        if (gameState === 'SHUFFLING') {
            playSFX('shuffle');
        }
    }, [gameState, playSFX]);

    // Scroll to top when game state changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [gameState]);

    const handleStartReading = () => {
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

        // Store pending info and show confirmation dialog
        setPendingCreditCost(cost);
        setPendingIsFreeDaily(isFreeDaily);
        setShowConfirmReading(true);
    };

    const handleConfirmReadingStart = async () => {
        setShowConfirmReading(false);

        const effectiveCost = pendingIsFreeDaily ? 0 : pendingCreditCost;
        const treatAsDaily = pendingIsFreeDaily;

        // Check if user has enough credits or it's free
        if (pendingIsFreeDaily || credits >= pendingCreditCost) {
            const result = await useCredit(effectiveCost, treatAsDaily);
            if (result.success) {
                // Show warp animation first
                setShowWarp(true);
                setPendingReading(true);
            } else {
                // Handle failure
                if (result.message === 'Daily reading allowed once per day') {
                    alert('คุณใช้สิทธิ์ดูดวงรายวันฟรีไปแล้ว จะใช้เครดิตแทน');
                } else {
                    alert(`เกิดข้อผิดพลาด: ${result.message}`);
                    setIsTopUpOpen(true);
                }
            }
        } else {
            setIsTopUpOpen(true);
        }
    };

    const resetGame = () => {
        gameReset();
        setArticleId(null);
        setCurrentReadingId(null);
    };

    const handleWarpComplete = () => {
        setShowWarp(false);
        if (pendingReading) {
            manualShuffle();
            setGameState('PICKING');
            setPendingReading(false);
        }
    };

    const openCalendar = (type) => {
        setCalendarType(type);
        setGameState('CALENDAR');
        setArticleId(null);
    };

    const openArticle = (id) => {
        setArticleId(id);
        setGameState('ARTICLE');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Save reading to history
    const saveReadingResult = async (currentSelectedCards, isFutureUpdate = false) => {
        if (isSavingRef.current) return;
        isSavingRef.current = true;

        if (!user) {
            isSavingRef.current = false;
            return;
        }

        try {
            if (isFutureUpdate && currentReadingId) {
                const { error } = await supabase
                    .from('reading_history')
                    .update({
                        cards: currentSelectedCards
                    })
                    .eq('id', currentReadingId);

                if (error) throw error;
            } else {
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
                if (data) {
                    setCurrentReadingId(data.id);
                }
            }
        } catch (err) {
            console.error('Error saving reading:', err);
        } finally {
            setTimeout(() => {
                isSavingRef.current = false;
            }, 500);
        }
    };

    const confirmReading = () => {
        setGameState('RESULT');
        saveReadingResult(selectedCards, isDrawingFuture);
        playSFX('reveal');
    };

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
                isMuted={isMuted}
                toggleMute={toggleMute}
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
                        playSFX={playSFX}
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

            <Footer
                isDark={isDark}
                gameState={gameState}
                onOpenAdmin={() => navigate('/admin')}
                isAdmin={isAdmin}
                onOpenTerms={() => setIsTermsOpen(true)}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
            />

            {showFutureDialog && (
                <FutureConfirmDialog
                    onConfirm={async () => {
                        const cost = 1;
                        if (credits >= cost) {
                            const result = await useCredit(cost, false);
                            if (result.success) {
                                setShowFutureDialog(false);
                                setIsDrawingFuture(true);
                                manualShuffle();
                                setGameState('PICKING');
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

            <TermsModal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                isDark={isDark}
            />

            <PrivacyModal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
                isDark={isDark}
            />

            <AgeVerificationModal
                isOpen={showAgeVerification}
                onAccept={() => {
                    localStorage.setItem('ageVerified', 'true');
                    setShowAgeVerification(false);
                }}
                onDecline={() => {
                    window.location.href = 'https://www.google.com';
                }}
            />

            <WarpTransition isActive={showWarp} onComplete={handleWarpComplete} />

            <ConfirmReadingDialog
                isOpen={showConfirmReading}
                onConfirm={handleConfirmReadingStart}
                onCancel={() => setShowConfirmReading(false)}
                topic={topic}
                readingType={readingType}
                creditCost={pendingCreditCost}
                currentCredits={credits}
                isFreeDaily={pendingIsFreeDaily}
                topicLabel={READING_TOPICS.find(t => t.id === topic)?.label || topic}
                isDark={isDark}
            />

            <Screensaver />
        </div>
    );
}
