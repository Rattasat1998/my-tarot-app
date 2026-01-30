import React from 'react';
import { ELEMENTS } from '../../data/zodiacData';

export const ZodiacCard = ({ zodiac, onClick, isSelected }) => {
    const element = ELEMENTS[zodiac.element];

    return (
        <button
            onClick={onClick}
            className={`relative group w-full p-4 rounded-2xl border transition-all duration-300 overflow-hidden
                ${isSelected
                    ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-500 shadow-lg shadow-purple-500/20 scale-105'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 hover:scale-102'
                }`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.elementColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            {/* Element Badge */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${element.bg} ${element.color} ${element.border} border`}>
                {element.icon} {zodiac.element}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                {/* Symbol */}
                <div className={`text-4xl sm:text-5xl mb-1 bg-gradient-to-br ${zodiac.elementColor} bg-clip-text text-transparent`}>
                    {zodiac.symbol}
                </div>

                {/* Emoji */}
                <div className="text-2xl">{zodiac.emoji}</div>

                {/* Names */}
                <div className="text-center">
                    <h3 className="font-bold text-white text-lg">{zodiac.nameTh}</h3>
                    <p className="text-xs text-slate-400">{zodiac.nameEn}</p>
                </div>

                {/* Date Range */}
                <p className="text-[11px] text-slate-500 mt-1">
                    {zodiac.dateRange}
                </p>

                {/* Ruling Planet */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>☆</span>
                    <span>{zodiac.rulingPlanet}</span>
                </div>
            </div>

            {/* Hover Arrow */}
            <div className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`}>
                <span className="text-purple-400 text-sm">→</span>
            </div>
        </button>
    );
};
