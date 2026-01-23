import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { CalendarDropdown } from './CalendarDropdown';
import { ArticleDropdown } from './ArticleDropdown';

export const Navbar = ({ isDark, setIsDark, resetGame, openCalendar, openArticle }) => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetGame}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <Sparkles className="text-white" size={24} />
                </div>
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    TAROT ORACLE
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <ArticleDropdown openArticle={openArticle} />
                <CalendarDropdown isDark={isDark} openCalendar={openCalendar} />
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 sm:p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    </nav>
);
