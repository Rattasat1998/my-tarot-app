import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { HolographicCard } from '../ui/HolographicCard';

export const CardDetailModal = ({ isOpen, onClose, card, label }) => {
    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header Image Background */}
                <div className="relative h-32 bg-slate-950 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-purple-900/20 blur-xl"></div>
                    <img
                        src={card.img}
                        alt="Background"
                        className="absolute w-full h-full object-cover opacity-30 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-20 backdrop-blur-sm border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Container */}
                <div className="px-6 pb-6 -mt-12 flex flex-col items-center relative z-10 overflow-y-auto">
                    {/* Card Preview */}
                    <div className="w-32 sm:w-40 aspect-[2/3] shadow-2xl mb-4 shrink-0">
                        <HolographicCard className="w-full h-full">
                            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-yellow-500/30">
                                <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                            </div>
                        </HolographicCard>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <span className="px-3 py-1 bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-widest rounded-full mb-2 inline-block">
                            {label}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif text-yellow-500 font-bold drop-shadow-md mb-1">
                            {card.name}
                        </h2>
                        <div className="text-slate-400 text-sm">{card.nameThai}</div>
                    </div>

                    {/* Meaning */}
                    <div className="w-full bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-3 text-purple-300 font-bold border-b border-purple-500/20 pb-2">
                            <BookOpen size={18} />
                            <span>ความหมาย</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-light text-lg">
                            {card.description}
                        </p>
                    </div>

                    {/* Keywords (Mockup based on description if needed, or specific keywords if available later) */}
                    <div className="w-full mt-4 flex flex-wrap gap-2 justify-center">
                        <div className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>{card.suit ? card.suit : 'Major Arcana'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
