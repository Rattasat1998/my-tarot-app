import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Sun, Moon, Coins, Plus, LogIn, LogOut, User, Clock, BookOpen } from 'lucide-react';
import { CalendarDropdown } from './CalendarDropdown';
import { ArticleDropdown } from './ArticleDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { TransactionHistoryModal } from '../modals/TransactionHistoryModal';
import { ReadingHistoryModal } from '../modals/ReadingHistoryModal';

export const Navbar = ({ isDark, setIsDark, resetGame, openCalendar, openArticle, credits, onOpenTopUp }) => {
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showReadingHistory, setShowReadingHistory] = useState(false);

    return (
        <>
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
                        {/* Credit Display (Only show if logged in or has credits) */}
                        {(user || credits > 0) && (
                            <button
                                onClick={onOpenTopUp}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all group"
                            >
                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                    <Coins size={14} />
                                </div>
                                <span className="font-bold text-amber-500">{credits}</span>
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                    <Plus size={12} />
                                </div>
                            </button>
                        )}

                        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

                        <div className="hidden sm:block">
                            <ArticleDropdown openArticle={openArticle} />
                        </div>
                        <div className="hidden sm:block">
                            <CalendarDropdown isDark={isDark} openCalendar={openCalendar} />
                        </div>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 sm:p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Auth Button */}
                        {!loading && (
                            user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="p-1 pl-2 pr-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-2 hover:bg-slate-700 transition-all"
                                    >
                                        <span className="text-xs text-slate-300 font-medium hidden sm:block truncate max-w-[80px]">
                                            {user.email?.split('@')[0]}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-slate-900">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full rounded-full" />
                                            ) : (
                                                user.email?.[0].toUpperCase() || <User size={16} />
                                            )}
                                        </div>
                                    </button>

                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="px-4 py-3 border-b border-slate-800">
                                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">สมาชิกทั่วไป</p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setShowReadingHistory(true);
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors border-b border-slate-800"
                                                >
                                                    <BookOpen size={16} />
                                                    ประวัติการทำนาย
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowHistory(true);
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                                                >
                                                    <Clock size={16} />
                                                    ประวัติการเติมเงิน
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        signOut();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"
                                                >
                                                    <LogOut size={16} />
                                                    ออกจากระบบ
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={signInWithGoogle}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 transition-all shadow-lg shadow-white/10"
                                >
                                    <LogIn size={16} />
                                    <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </nav>

            <TransactionHistoryModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                isDark={isDark}
            />

            <ReadingHistoryModal
                isOpen={showReadingHistory}
                onClose={() => setShowReadingHistory(false)}
                isDark={isDark}
            />
        </>
    );
};
