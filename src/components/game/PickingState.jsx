import React, { useState } from 'react';
import { RefreshCw, Maximize2, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { CardBack } from '../ui/CardBack';
import { MeditationDialog } from '../modals/MeditationDialog';

// Confirm Dialog Component
const ConfirmPickingDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel}></div>

            <div className="relative w-full max-w-sm rounded-2xl shadow-2xl bg-slate-900 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-600/20 to-transparent"></div>

                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-800 transition-colors z-10"
                >
                    <X size={18} className="text-slate-400" />
                </button>

                <div className="relative p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <CheckCircle className="text-slate-900 dark:text-white" size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ยืนยันการทำนาย?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        เมื่อยืนยันแล้ว ไพ่ที่คุณเลือกจะถูกเปิดเผยความหมาย
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20"
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PickingState = ({
    deck,
    selectedCards,
    handleCardPick,
    requiredPickCount,
    confirmReading,
    isSelectionComplete,
    isDark,
    manualShuffle,
    manualCut,
    resetGame,
    topic,
    readingType,
    isDrawingFuture,
    playSFX
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showMeditation, setShowMeditation] = useState(false);
    const [isGathering, setIsGathering] = useState(false);
    const [isShufflingCenter, setIsShufflingCenter] = useState(false);
    const [isCuttingCenter, setIsCuttingCenter] = useState(false);

    const handleConfirm = () => {
        setShowConfirmDialog(false);
        // Start meditation animation
        setShowMeditation(true);
    };

    const handleMeditationComplete = () => {
        setShowMeditation(false);
        confirmReading();
    };

    const handleVisualShuffle = () => {
        // Step 1: Gather (Slower: 1200ms)
        setIsGathering(true);

        setTimeout(() => {
            // Step 2: Shuffle at center (Slower: 2000ms)
            setIsShufflingCenter(true);

            manualShuffle();

            setTimeout(() => {
                setIsShufflingCenter(false);
                // Step 3: Spread (revert gather)
                setIsGathering(false);
            }, 2000); // Increased from 1500 to 2000

        }, 1200); // Increased from 1000 to 1200
    };

    const handleVisualCut = () => {
        setIsGathering(true);
        setTimeout(() => {
            setIsCuttingCenter(true);
            manualCut();
            setTimeout(() => {
                setIsCuttingCenter(false);
                setIsGathering(false);
            }, 2000);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto w-full h-full bg-slate-950 animate-in fade-in zoom-in duration-500">
            {/* Mystic Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-40 z-0"
                style={{
                    backgroundImage: 'url(/backgrounds/screensaver_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            {/* Overlay Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60 z-0" />

            <div className="relative z-10 w-full min-h-full flex flex-col items-center py-8">
                {/* Warning Banner */}
                <div className="w-full max-w-2xl mx-auto mb-6 px-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm">
                        <AlertTriangle className="text-amber-400 shrink-0" size={20} />
                        <p className="text-amber-300 text-xs sm:text-sm">
                            ⚠️ อย่าออกจากหน้านี้! เครดิตถูกใช้ไปแล้ว กรุณาเลือกไพ่และยืนยันคำทำนายให้เสร็จสิ้น
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif mb-2 text-center text-slate-900 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {isDrawingFuture
                        ? 'เลือกไพ่เพิ่มอีก 1 ใบเพื่อดูอนาคต'
                        : (topic === 'monthly' || readingType === 'celtic-cross' ? 'เลือกไพ่ 10 ใบ' : 'เลือกไพ่ที่ดึงดูดใจคุณที่สุด')}
                </h2>
                <p className="text-sm text-purple-200/70 mb-8 backdrop-blur-sm px-4 py-1 rounded-full border border-purple-500/20 bg-purple-900/10">
                    เลือกแล้ว {selectedCards.length}/{requiredPickCount} ใบ
                </p>

                {/* Controls */}
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={handleVisualShuffle}
                        disabled={isGathering}
                        className="flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/50 bg-purple-900/40 text-purple-100 hover:bg-purple-900/60 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                        <RefreshCw size={18} className={isGathering && isShufflingCenter ? 'animate-spin' : ''} /> สับไพ่
                    </button>
                    <button
                        onClick={handleVisualCut}
                        disabled={isGathering}
                        className="flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/50 bg-yellow-900/40 text-yellow-100 hover:bg-yellow-900/60 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    >
                        <div className={`transition-transform duration-500 ${isGathering && isCuttingCenter ? 'rotate-180' : 'rotate-90'}`}><Maximize2 size={18} /></div> ตัดไพ่
                    </button>
                </div>

                {/* Card Container */}
                <div className="w-full max-w-6xl mx-auto px-4 pb-32 relative min-h-[50vh]">
                    {/* Deck Pile (Visible when gathering) */}
                    <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 z-50 transition-all duration-300 ${isGathering ? 'opacity-100 scale-100 delay-500' : 'opacity-0 scale-50 pointer-events-none'}`}>
                        {/* Main Deck Stack - Hidden when animating specifics */}
                        <div className={`absolute inset-0 bg-purple-600 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.8)] border-2 border-purple-400 transition-opacity duration-300 ${isShufflingCenter || isCuttingCenter ? 'opacity-0' : 'opacity-100'}`}>
                            <CardBack />
                        </div>

                        {/* Shuffling Animation Cards */}
                        {isShufflingCenter && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-full h-full rounded-xl shadow-lg border-2 border-purple-400 bg-purple-600"
                                        style={{
                                            animation: `shuffleCard 1.5s infinite ease-in-out`,
                                            animationDelay: `${i * 0.15}s`,
                                            zIndex: i
                                        }}
                                    >
                                        <CardBack />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Cutting Animation Cards */}
                        {isCuttingCenter && (
                            <>
                                <div className="absolute inset-0 bg-purple-600 rounded-xl shadow-lg border-2 border-purple-400"
                                    style={{
                                        animationName: 'cutTop',
                                        animationDuration: '2s',
                                        animationTimingFunction: 'ease-in-out',
                                        animationIterationCount: 'infinite'
                                    }}>
                                    <CardBack />
                                </div>
                                <div className="absolute inset-0 bg-purple-600 rounded-xl shadow-lg border-2 border-purple-400"
                                    style={{
                                        animationName: 'cutBottom',
                                        animationDuration: '2s',
                                        animationTimingFunction: 'ease-in-out',
                                        animationIterationCount: 'infinite'
                                    }}>
                                    <div className="absolute inset-0 bg-black/20"></div> {/* Darken bottom packet */}
                                    <CardBack />
                                </div>
                            </>
                        )}
                    </div>

                    <div
                        className={`grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-y-12 justify-items-center transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isGathering ? 'scale-0 rotate-[720deg]' : 'scale-100 rotate-0'
                            }`}
                        style={{ perspective: '1000px', transformOrigin: 'center center' }}
                    >
                        {deck.map((card, i) => {
                            const cardIndex = selectedCards.findIndex(c => c.id === card.id);
                            const isSelected = cardIndex !== -1;
                            const originalCount = readingType === '1-card' ? 1 : 2;
                            const isLocked = isDrawingFuture && isSelected && cardIndex < originalCount;

                            // Calculate delay based on index for wave effect
                            const floatDelay = `${(i % 5) * 0.5}s`;
                            const dealDelay = `${i * 12}ms`; // Slower stagger

                            return (
                                <div
                                    key={card.id}
                                    onClick={() => {
                                        if (!isLocked && !isGathering) {
                                            playSFX?.('flip');
                                            handleCardPick(card);
                                        }
                                    }}
                                    className={`relative w-20 h-32 sm:w-28 sm:h-44 md:w-32 md:h-48 transition-all duration-300 ${isLocked ? 'cursor-not-allowed grayscale-[0.8] opacity-60' : 'cursor-pointer'} ${isSelected ? '-translate-y-10 scale-110 z-30' : 'hover:-translate-y-6 hover:scale-110 hover:z-20'}`}
                                    style={{
                                        zIndex: i,
                                        marginLeft: i % 10 === 0 ? 0 : '-50%',
                                        animationName: isGathering ? 'none' : 'dealCard',
                                        animationDuration: '0.8s',
                                        animationTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                                        animationFillMode: 'backwards',
                                        animationDelay: isGathering ? '0s' : dealDelay
                                    }}
                                >
                                    <div
                                        className={`w-full h-full shadow-2xl overflow-hidden transition-all duration-300 ${isSelected
                                            ? (isLocked ? 'ring-2 ring-slate-500' : 'ring-2 ring-white shadow-[0_0_30px_rgba(168,85,247,0.8)]')
                                            : 'brightness-90 hover:brightness-110'
                                            }`}
                                        style={{
                                            animationName: !isSelected && !isGathering ? 'floatCard' : 'none',
                                            animationDuration: '4s',
                                            animationTimingFunction: 'ease-in-out',
                                            animationIterationCount: 'infinite',
                                            animationDelay: floatDelay
                                        }}
                                    >
                                        <CardBack />
                                    </div>

                                    {isSelected && (
                                        <div className={`absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden ${isLocked ? 'bg-slate-900/70' : 'bg-purple-900/30'}`}>
                                            {!isLocked && (
                                                <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-purple-500/40 to-transparent mix-blend-overlay"></div>
                                            )}
                                            <div className={`${isLocked ? 'bg-slate-700' : 'bg-purple-600'} text-white w-8 h-8 flex items-center justify-center font-bold shadow-lg rounded-full scale-100 animate-in zoom-in duration-300 relative z-10 border-2 border-white/20`}>
                                                {cardIndex + 1}
                                            </div>
                                            {isLocked && (
                                                <div className="absolute top-2 right-2 bg-slate-900/80 p-1 text-slate-300 border border-slate-700 rounded-lg">
                                                    <Search size={10} className="opacity-70" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Floating Action Button (FAB) */}
                <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-40">
                    <button
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={!isSelectionComplete}
                        className={`group relative px-8 py-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 border border-white/20 ${isSelectionComplete
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-purple-500/50'
                            : 'bg-slate-800/80 text-slate-400 cursor-not-allowed grayscale opacity-80'
                            }`}
                    >
                        {isSelectionComplete && <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>}
                        <CheckCircle className={isSelectionComplete ? "text-slate-900 dark:text-white" : "text-slate-500"} size={24} />
                        <span className={`font-bold text-lg tracking-wide ${isSelectionComplete ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            ยืนยันการทำนาย
                        </span>
                    </button>
                    {!isSelectionComplete && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white/70 text-xs px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none border border-white/10">
                            เลือกอีก {requiredPickCount - selectedCards.length} ใบ
                        </div>
                    )}
                </div>

                {/* CSS for custom float animation */}
                <style>{`
                    @keyframes floatCard {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-6px) rotate(0.5deg); }
                    }
                    @keyframes dealCard {
                        from { opacity: 0; transform: scale(0.3); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes cutTop {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-30px); }
                        50% { transform: translateY(-30px) translateX(100px); }
                        75% { transform: translateY(30px) translateX(100px); }
                    }
                    @keyframes cutBottom {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(10px); }
                        50% { transform: translateY(-20px); }
                        75% { transform: translateY(-20px); }
                    }
                `}</style>
            </div>

            <ConfirmPickingDialog
                isOpen={showConfirmDialog}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmDialog(false)}
            />

            <MeditationDialog
                isOpen={showMeditation}
                onComplete={handleMeditationComplete}
            />
        </div>
    );
};
