import React, { useState } from 'react';
import { Sparkles, Eye, RotateCcw } from 'lucide-react';
import { TAROT_CARDS } from '../../data/tarotCards';
import { getDailyCard } from '../../data/dailyFortune';

export const DailyCard = () => {
    const [isRevealed, setIsRevealed] = useState(false);
    const card = getDailyCard(TAROT_CARDS);

    return (
        <div className="w-full max-w-sm mx-auto text-center mb-8">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-yellow-500" />
                ไพ่ประจำวันของคุณ
            </h3>

            <div className="relative">
                {/* Card Container */}
                <div
                    className={`relative mx-auto w-32 h-48 cursor-pointer transition-all duration-700 transform-gpu preserve-3d ${isRevealed ? 'rotate-y-180' : 'hover:scale-105'}`}
                    onClick={() => setIsRevealed(!isRevealed)}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                    {/* Card Back */}
                    <div
                        className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-2xl shadow-purple-900/40 transition-all duration-500 ${isRevealed ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
                            <div className="text-4xl animate-pulse">🔮</div>
                        </div>
                        <div className="absolute inset-0 bg-[url('/bg.png')] opacity-20"></div>
                    </div>

                    {/* Card Front */}
                    <div
                        className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-yellow-500/50 shadow-2xl shadow-yellow-900/30 transition-all duration-500 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        {card.image ? (
                            <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-900 to-yellow-900 flex items-center justify-center text-white font-serif text-sm p-2 text-center">
                                {card.name}
                            </div>
                        )}
                    </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 mx-auto w-32 h-48 rounded-xl transition-all duration-500 ${isRevealed ? 'bg-yellow-500/20 blur-xl' : 'bg-purple-500/20 blur-xl'}`}></div>
            </div>

            {/* Card Info */}
            <div className="mt-4 min-h-[80px]">
                {isRevealed ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h4 className="text-lg font-serif text-yellow-500 mb-1">{card.name}</h4>
                        <p className="text-xs text-slate-400 mb-3">{card.meaning || card.keywords?.upright?.slice(0, 3).join(' • ')}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto"
                        >
                            <RotateCcw size={12} /> ซ่อนไพ่
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsRevealed(true)}
                        className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2 mx-auto group"
                    >
                        <Eye size={16} className="group-hover:scale-110 transition-transform" />
                        แตะเพื่อเปิดไพ่
                    </button>
                )}
            </div>
        </div>
    );
};
