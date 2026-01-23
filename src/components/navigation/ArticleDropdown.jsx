import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown, Clock } from 'lucide-react';
import { ARTICLES } from '../../data/articles';

export const ArticleDropdown = ({ openArticle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isOpen ? 'bg-amber-900/30 border-amber-500 text-amber-200' : 'border-slate-800 text-slate-400 hover:text-white'}`}
            >
                <BookOpen size={20} />
                <span className="hidden sm:inline font-medium text-sm">บทความ</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
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
                                    setIsOpen(false);
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
