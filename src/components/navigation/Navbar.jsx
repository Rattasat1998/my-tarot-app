import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, Coins, Plus, LogIn, LogOut, User, Clock, BookOpen, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { CalendarDropdown } from './CalendarDropdown';
import { ArticleDropdown } from './ArticleDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { TransactionHistoryModal } from '../modals/TransactionHistoryModal';
import { ReadingHistoryModal } from '../modals/ReadingHistoryModal';

export const Navbar = ({ isDark, setIsDark, resetGame, openCalendar, openArticle, credits, onOpenTopUp, isMuted, toggleMute }) => {
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showReadingHistory, setShowReadingHistory] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={resetGame}>
                        <img
                            src="/favicon.png"
                            alt="Tarot Oracle Logo"
                            className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg rounded-xl"
                        />
                        <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            ศาสตร์ดวงดาว
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Credit Display (No TopUp - just display) */}
                        {(user || credits > 0) && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                    <Coins size={14} />
                                </div>
                                <span className="font-bold text-amber-500">{credits}</span>
                            </div>
                        )}

                        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

                        <div className="hidden sm:block">
                            <ArticleDropdown openArticle={openArticle} />
                        </div>
                        <div className="hidden sm:block">
                            <CalendarDropdown isDark={isDark} openCalendar={openCalendar} />
                        </div>

                        {toggleMute && (
                            <button
                                onClick={toggleMute}
                                className="p-2 sm:p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg hidden sm:flex"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        )}

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 sm:p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg hidden sm:flex"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Auth Button */}
                        {!loading && (
                            user ? (
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="p-1 pl-2 pr-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-2 hover:bg-slate-700 transition-all"
                                    >
                                        <span className="text-xs text-slate-300 font-medium truncate max-w-[80px]">
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
                                                        navigate('/profile');
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors border-b border-slate-800"
                                                >
                                                    <User size={16} />
                                                    แก้ไขข้อมูลส่วนตัว
                                                </button>

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

                                                {/* Transaction History - TEMPORARILY HIDDEN
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
                                                */}

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
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 transition-all shadow-lg shadow-white/10"
                                >
                                    <LogIn size={16} />
                                    <span>เข้าสู่ระบบ</span>
                                </button>
                            )
                        )}

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="sm:hidden p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top-4">
                        <div className="p-4 space-y-4">
                            {/* Mobile Auth Section */}
                            {!loading && (
                                user ? (
                                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full rounded-full" />
                                            ) : (
                                                user.email?.[0].toUpperCase() || <User size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{user.email}</p>
                                            <p className="text-xs text-slate-400">สมาชิกทั่วไป</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            signInWithGoogle();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-slate-900 font-bold mb-4"
                                    >
                                        <LogIn size={20} />
                                        เข้าสู่ระบบ
                                    </button>
                                )
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">เมนูหลัก</p>
                                    <div className="space-y-2">
                                        <ArticleDropdown openArticle={(id) => { openArticle(id); setIsMobileMenuOpen(false); }} isMobile={true} />
                                        <CalendarDropdown isDark={isDark} openCalendar={(type) => { openCalendar(type); setIsMobileMenuOpen(false); }} isMobile={true} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => { toggleMute?.(); }}
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    <span>{isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
                                </button>

                                <button
                                    onClick={() => { setIsDark(!isDark); }}
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                                >
                                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                    <span>{isDark ? 'โหมดสว่าง' : 'โหมดมืด'}</span>
                                </button>
                            </div>

                            {user && (
                                <div className="pt-4 border-t border-slate-800">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">บัญชีผู้ใช้</p>
                                    <div className="space-y-2">
                                        <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-800 flex items-center gap-3">
                                            <User size={18} /> ข้อมูลส่วนตัว
                                        </button>
                                        <button onClick={() => { setShowReadingHistory(true); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-800 flex items-center gap-3">
                                            <BookOpen size={18} /> ประวัติการทำนาย
                                        </button>
                                        {/* Transaction History - TEMPORARILY HIDDEN
                                        <button onClick={() => { setShowHistory(true); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-800 flex items-center gap-3">
                                            <Clock size={18} /> ประวัติการเติมเงิน
                                        </button>
                                        */}
                                        <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/30 flex items-center gap-3 border border-red-900/30">
                                            <LogOut size={18} /> ออกจากระบบ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
