import React from 'react';

export const RuneStone = ({ rune, isRevealed, isReversed, onClick, size = 'md', delay = 0 }) => {
    const sizeClasses = {
        sm: 'w-20 h-24',
        md: 'w-28 h-36',
        lg: 'w-36 h-44'
    };

    const symbolSizes = {
        sm: 'text-3xl',
        md: 'text-5xl',
        lg: 'text-6xl'
    };

    return (
        <div
            className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000`}
            onClick={onClick}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Card Container - handles flip */}
            <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isRevealed ? 'rune-revealed' : 'rune-hidden'}`}>

                {/* Back Face - Stone texture */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl shadow-emerald-900/20">
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center relative">
                        {/* Stone texture overlay */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 50%)`
                            }} />
                        </div>
                        {/* Rune symbol on back */}
                        <div className="text-4xl text-emerald-400/30 animate-pulse">ᛟ</div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl rune-glow opacity-50" />
                    </div>
                </div>

                {/* Front Face - Revealed rune */}
                <div className="absolute inset-0 backface-hidden rune-front rounded-2xl overflow-hidden border-2 shadow-xl"
                    style={{ borderColor: rune?.color ? `${rune.color}50` : '#10B98130' }}>
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-3 relative">
                        {/* Background glow */}
                        <div className="absolute inset-0 opacity-20 rounded-2xl"
                            style={{
                                background: `radial-gradient(circle, ${rune?.color || '#10B981'}30 0%, transparent 70%)`
                            }}
                        />

                        {/* Rune Symbol */}
                        <span className={`${symbolSizes[size]} font-serif relative z-10 transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`}
                            style={{ color: rune?.color || '#10B981' }}>
                            {rune?.symbol || '?'}
                        </span>

                        {/* Rune Name */}
                        <div className="relative z-10 mt-2 text-center">
                            <p className="text-white font-bold text-sm">{rune?.name}</p>
                            <p className="text-slate-400 text-[10px]">{rune?.nameTh}</p>
                        </div>

                        {/* Reversed badge */}
                        {isReversed && (
                            <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                                กลับหัว
                            </span>
                        )}

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
};
