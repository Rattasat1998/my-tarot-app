import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown, Clock } from 'lucide-react';
import { ARTICLES } from '../../data/articles';

export const ArticleDropdown = ({ openArticle, isMobile = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isMobile) return; // Don't auto-close on click outside for mobile accordion
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile]);

    return (
        <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isMobile ? 'w-full justify-between' : ''} ${isOpen ? 'bg-amber-900/30 border-amber-500 text-amber-200' : 'border-slate-800 text-slate-400 hover:text-white'}`}
            >
                <div className="flex items-center gap-2">
                    <BookOpen size={20} />
                    <span className={`${!isMobile ? 'hidden sm:inline' : ''} font-medium text-sm`}>บทความ</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`${isMobile
                    ? 'relative mt-2 w-full bg-slate-900/50 border border-slate-800 rounded-xl'
                    : 'absolute top-full right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3'
                    } animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto z-50`}>
                    <div className="px-5 py-2 mb-3 border-b border-slate-800">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">บทความน่าอ่าน</div>
                        <div className="text-lg font-serif text-amber-300">เรียนรู้เคล็ดลับไพ่ทาโรต์</div>
                    </div>
                    <div className="space-y-1">
                        {ARTICLES.map((article) => (
                            <button
                                key={article.id}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 transition-colors group"
                                onClick={() => {
                                    if (!isMobile) setIsOpen(false);
                                    openArticle(article.id);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium group-hover:text-amber-300 transition-colors leading-snug">
                                            {article.title}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                            {article.description}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                                                {article.category}
                                            </span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Clock size={10} />
                                                {article.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
