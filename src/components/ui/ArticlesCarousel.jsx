import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ARTICLES } from '../../data/articles';

export const ArticlesCarousel = ({ openArticle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const featuredArticles = ARTICLES.slice(0, 5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredArticles.length]);

    const goTo = (index) => setCurrentIndex(index);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
    const next = () => setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);

    const article = featuredArticles[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4 text-center">📚 บทความแนะนำ</h3>
            <div className="relative group">
                {/* Main Card */}
                <button
                    onClick={() => openArticle(article.id)}
                    className="w-full bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all text-left"
                >
                    <div className="flex flex-col sm:flex-row">
                        {article.image && (
                            <div className="sm:w-1/3 h-40 sm:h-auto overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                        <div className="flex-1 p-4 sm:p-5">
                            <span className="text-[10px] px-2 py-0.5 bg-amber-900/30 text-amber-300 rounded-full border border-amber-500/20">
                                {article.category}
                            </span>
                            <h4 className="text-lg font-serif text-white mt-2 mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                                {article.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                                {article.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={12} />
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Navigation Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {featuredArticles.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-purple-500 w-6' : 'bg-slate-700 hover:bg-slate-600'}`}
                    />
                ))}
            </div>
        </div>
    );
};
