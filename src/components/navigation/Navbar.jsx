import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, Coins, LogIn, LogOut, User, Menu, TrendingUp, Stars, Volume2, VolumeX, BookOpen, Calendar, FileText, Heart, Hexagon } from 'lucide-react';
import { CalendarDropdown } from './CalendarDropdown';
import { ArticleDropdown } from './ArticleDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { TransactionHistoryModal } from '../modals/TransactionHistoryModal';
import { ReadingHistoryModal } from '../modals/ReadingHistoryModal';
import { Drawer } from '../ui/Drawer';

export const Navbar = ({ isDark, setIsDark, resetGame, openCalendar, openArticle, credits, onOpenTopUp, isMuted, toggleMute }) => {
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showReadingHistory, setShowReadingHistory] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleOpenCalendar = (type) => {
        openCalendar(type);
        setIsDrawerOpen(false);
    };

    const handleOpenArticle = (id) => {
        openArticle(id);
        setIsDrawerOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="w-full px-4 sm:px-6 h-16 flex items-center">
                    <div className="flex items-center gap-4">
                        {/* Drawer Toggle Button - Visible only on Mobile */}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-2 -ml-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors md:hidden"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-2 cursor-pointer" onClick={resetGame}>
                            <img
                                src="/favicon.png"
                                alt="Tarot Oracle Logo"
                                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg rounded-xl"
                            />
                            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                ศาสตร์ดวงดาว
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 ml-auto">
                        <button
                            onClick={() => navigate('/zodiac')}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            <Stars size={18} />
                            <span className="text-sm font-medium">12 ราศี</span>
                        </button>

                        <button
                            onClick={() => navigate('/lotto')}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            <TrendingUp size={18} />
                            <span className="text-sm font-medium">LottoInsight</span>
                        </button>

                        <button
                            onClick={() => navigate('/soulmate')}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            <Heart size={18} />
                            <span className="text-sm font-medium">เนื้อคู่</span>
                        </button>

                        <button
                            onClick={() => navigate('/runes')}
                            className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            <Hexagon size={18} />
                            <span className="text-sm font-medium">รูน</span>
                        </button>

                        <CalendarDropdown isDark={isDark} openCalendar={openCalendar} />
                        <ArticleDropdown openArticle={openArticle} />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-6">
                        {/* Credit Display */}
                        {user && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                    <Coins size={14} />
                                </div>
                                <span className="font-bold text-amber-500">{credits}</span>
                            </div>
                        )}

                        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

                        {/* Desktop Quick Actions */}
                        {toggleMute && (
                            <button
                                onClick={toggleMute}
                                className="p-2 sm:p-2.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg hidden sm:flex"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        )}

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 sm:p-2.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg hidden sm:flex"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
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
                    </div>
                </div>
            </nav>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="เมนูหลัก"
                isDark={isDark}
            >
                <div className="space-y-6">
                    {/* User Section in Drawer (Mobile Only) */}
                    <div className="sm:hidden">
                        {!loading && (
                            user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => { navigate('/profile'); setIsDrawerOpen(false); }} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm border border-slate-700">
                                            <User size={16} /> โปรไฟล์
                                        </button>
                                        <button onClick={() => { signOut(); setIsDrawerOpen(false); }} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-900/20 text-red-400 text-sm border border-red-900/30">
                                            <LogOut size={16} /> ออกจากระบบ
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        signInWithGoogle();
                                        setIsDrawerOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-slate-900 font-bold shadow-lg"
                                >
                                    <LogIn size={20} />
                                    เข้าสู่ระบบ
                                </button>
                            )
                        )}
                    </div>

                    {/* Menu Items */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">การทำนาย</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => { navigate('/zodiac'); setIsDrawerOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl text-purple-400 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                    <Stars size={20} />
                                </div>
                                <span className="font-medium">ดวง 12 ราศี</span>
                            </button>

                            <button
                                onClick={() => { navigate('/lotto'); setIsDrawerOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-medium">LottoInsight</span>
                            </button>

                            <button
                                onClick={() => { navigate('/soulmate'); setIsDrawerOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl text-pink-400 hover:from-pink-500/20 hover:to-rose-500/20 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                                    <Heart size={20} />
                                </div>
                                <span className="font-medium">เนื้อคู่ & ความรัก</span>
                            </button>

                            <button
                                onClick={() => { navigate('/runes'); setIsDrawerOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <Hexagon size={20} />
                                </div>
                                <span className="font-medium">รูนโบราณ</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">ปฏิทิน & บทความ</h3>
                        <div className="space-y-2">
                            <CalendarDropdown isDark={isDark} openCalendar={handleOpenCalendar} isMobile={true} />
                            <ArticleDropdown openArticle={handleOpenArticle} isMobile={true} />
                        </div>
                    </div>

                    {/* Settings (Mobile Only) */}
                    <div className="sm:hidden pt-4 border-t border-slate-800">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={toggleMute}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                <span className="text-sm">เสียง</span>
                            </button>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                <span className="text-sm">ธีม</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Drawer>

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
