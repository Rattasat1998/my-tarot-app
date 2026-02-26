import React from 'react';
import { Stars, TrendingUp, Calendar, BookOpen, Layers, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CALENDAR_CATEGORIES } from '../../constants/readingTopics';
import { ARTICLES } from '../../data/articles';

export const Sidebar = ({ isDark, openCalendar, openArticle }) => {
    const navigate = useNavigate();

    return (
        <aside className={`hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 z-30 border-r transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

                {/* Main Features */}
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>เมนูหลัก</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/zodiac')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}`}>
                                <Stars size={20} />
                            </div>
                            <span className={`font-medium ${isDark ? 'text-slate-300 group-hover:text-slate-900 dark:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>ดวง 12 ราศี</span>
                        </button>

                        <button
                            onClick={() => navigate('/lotto')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}`}>
                                <TrendingUp size={20} />
                            </div>
                            <span className={`font-medium ${isDark ? 'text-slate-300 group-hover:text-slate-900 dark:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>LottoInsight</span>
                        </button>
                    </div>
                </div>

                {/* Calendar Section */}
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ปฏิทินมงคล</h3>
                    <div className="space-y-1">
                        {CALENDAR_CATEGORIES.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => openCalendar(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg opacity-80">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Section */}
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>บทความน่ารู้</h3>
                    <div className="space-y-1">
                        {ARTICLES.slice(0, 5).map((article) => (
                            <button
                                key={article.id}
                                onClick={() => openArticle(article.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors group ${isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`font-medium mb-0.5 ${isDark ? 'text-slate-400 group-hover:text-amber-300' : 'text-slate-600 group-hover:text-amber-600'}`}>
                                    {article.title}
                                </div>
                                <div className={`text-xs truncate ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {article.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </aside>
    );
};
