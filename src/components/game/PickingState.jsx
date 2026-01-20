import React from 'react';
import { RefreshCw, Maximize2, ArrowLeft, Search } from 'lucide-react';
import { CardBack } from '../ui/CardBack';

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
    isDrawingFuture
}) => (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <h2 className="text-2xl sm:text-3xl font-serif mb-4 text-center">
            {isDrawingFuture
                ? 'เลือกไพ่เพิ่มอีก 1 ใบเพื่อดูอนาคต'
                : (topic === 'monthly' ? 'เลือกไพ่ 10 ใบ' : 'เลือกไพ่ที่ดึงดูดใจคุณที่สุด')}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
            เลือกแล้ว {selectedCards.length}/{requiredPickCount}
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
            <button
                onClick={manualShuffle}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/50 bg-purple-900/20 text-purple-200 hover:bg-purple-900/40 transition-colors"
            >
                <RefreshCw size={18} /> สับไพ่
            </button>
            <button
                onClick={manualCut}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/50 bg-yellow-900/20 text-yellow-200 hover:bg-yellow-900/40 transition-colors"
            >
                <div className="rotate-90"><Maximize2 size={18} /></div> ตัดไพ่
            </button>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 pb-12">
            <div className="grid grid-cols-10 gap-y-8 sm:gap-y-12 justify-items-center">
                {deck.map((card, i) => {
                    const cardIndex = selectedCards.findIndex(c => c.id === card.id);
                    const isSelected = cardIndex !== -1;
                    const originalCount = readingType === '1-card' ? 1 : 2;
                    const isLocked = isDrawingFuture && isSelected && cardIndex < originalCount;

                    return (
                        <div
                            key={card.id}
                            onClick={() => !isLocked && handleCardPick(card)}
                            className={`relative w-20 h-[120px] sm:w-32 sm:h-[208px] md:w-36 md:h-[234px] transition-all duration-300 ${isLocked ? 'cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'} ${isSelected ? '-translate-y-6 scale-110 z-30' : 'hover:-translate-y-4 hover:scale-105 hover:z-20'}`}
                            style={{
                                zIndex: i,
                                marginLeft: i % 10 === 0 ? 0 : '-50%',
                                animation: 'dealCard 0.4s ease-out backwards',
                                animationDelay: `${i * 15}ms`
                            }}
                        >
                            <div className={`w-full h-full shadow-lg overflow-hidden transition-all duration-300 ${isSelected ? (isLocked ? 'ring-4 ring-slate-500 shadow-[0_0_25px_rgba(100,116,139,0.4)]' : 'ring-4 ring-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]') : 'opacity-100'}`}>
                                <CardBack />
                            </div>
                            {isSelected && (
                                <div className={`absolute inset-0 flex items-center justify-center ${isLocked ? 'bg-slate-900/40' : 'bg-purple-900/10'}`}>
                                    <div className={`${isLocked ? 'bg-slate-600' : 'bg-purple-600'} text-white w-8 h-8 flex items-center justify-center font-bold shadow-lg scale-100 animate-in zoom-in duration-300`}>
                                        {cardIndex + 1}
                                    </div>
                                    {isLocked && (
                                        <div className="absolute top-2 right-2 bg-slate-900/80 p-1 text-slate-300 border border-slate-700">
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

        <div className="mt-4 flex flex-col items-center gap-3">
            <button
                onClick={confirmReading}
                disabled={!isSelectionComplete}
                className={`px-8 py-3 rounded-full font-medium transition-all ${isSelectionComplete
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'}`}
            >
                ยืนยันการทำนาย
            </button>
            {!isSelectionComplete && (
                <p className="text-xs text-slate-500">
                    กรุณาเลือกไพ่ให้ครบจำนวนเพื่อยืนยัน
                </p>
            )}
        </div>

        <button onClick={resetGame} className="mt-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> ย้อนกลับ
        </button>
    </div>
);
