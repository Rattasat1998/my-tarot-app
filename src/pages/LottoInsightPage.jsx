import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Flame, ChevronRight, Calendar, Trophy, Sparkles, FileText, Search, Target, ChevronDown, ChevronUp, Moon, Cake, ShoppingBag, Crown, Share2 } from 'lucide-react';
import { LuckyGeneratorModal } from '../components/modals/LuckyGeneratorModal';
import { DreamNumberModal } from '../components/modals/DreamNumberModal';
import { BirthdayNumberModal } from '../components/modals/BirthdayNumberModal';
import { TarotLottoModal } from '../components/modals/TarotLottoModal';
import { LoginModal } from '../components/modals/LoginModal';

import * as lottoService from '../services/lottoService';
// Fallback to static data if database is not available
import { getUpcomingDraw as getStaticUpcoming, getPastDraws as getStaticPast } from '../data/lottoData';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';


// Module-level cache to persist data across navigations
let cachedUpcoming = null;
let cachedPast = [];
let dataLoaded = false;

export const LottoInsightPage = () => {
    usePageSEO({
        title: 'วิเคราะห์หวย สถิติย้อนหลัง',
        description: 'วิเคราะห์หวยรัฐบาล สถิติย้อนหลัง 22 ปี แนวทางจากสำนักดัง กระแสเลขเด็ดโซเชียล เลขมงคล สรุปเลขเด่นประจำงวด พร้อมระบบสุ่มเลขนำโชค',
        keywords: 'วิเคราะห์หวย, สถิติหวย, เลขเด็ด, สำนักดัง, หวยรัฐบาล, เลขมงคล, แนวทางหวย, สถิติย้อนหลัง',
        path: '/lotto',
        ogImage: 'https://satduangdao.com/lotto-hero.png', // สามารถเปลี่ยน URL รูปภาพตรงนี้ได้เลย
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();


    // Check if coming back from detail page (use cache) or from home (reload)
    const fromDetail = location.state?.fromDetail === true;
    const shouldUseCache = fromDetail && dataLoaded;

    // Always use light theme for LottoInsight page
    const isDark = false;
    const [activeTab, setActiveTab] = useState('historical');
    const [showLuckyModal, setShowLuckyModal] = useState(false);
    const [showDreamModal, setShowDreamModal] = useState(false);
    const [showBirthdayModal, setShowBirthdayModal] = useState(false);
    const [showTarotLottoModal, setShowTarotLottoModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [selectedDraw, setSelectedDraw] = useState(null);
    // Initialize from cache if coming from detail page
    const [loading, setLoading] = useState(!shouldUseCache);
    const [upcomingDraw, setUpcomingDraw] = useState(shouldUseCache ? cachedUpcoming : null);
    const [pastDraws, setPastDraws] = useState(shouldUseCache ? cachedPast : []);

    // Fetch data from database, fallback to static data
    // Only skip fetch if coming from detail page and cache exists
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        if (shouldUseCache) return; // Skip if coming from detail and cache exists

        const fetchData = async () => {
            setLoading(true);
            try {
                const [upcoming, past] = await Promise.all([
                    lottoService.getUpcomingDraw(),
                    lottoService.getPastDraws()
                ]);

                let upcomingData, pastData;

                if (upcoming && upcoming.kpi) {
                    upcomingData = lottoService.transformDrawForUI(upcoming);
                } else {
                    // DB returned no data or auto-generated minimal entry — use static
                    upcomingData = getStaticUpcoming();
                }

                if (past && past.length > 0) {
                    pastData = past.map(d => lottoService.transformDrawForUI(d));
                } else {
                    pastData = getStaticPast();
                }

                // Save to cache
                cachedUpcoming = upcomingData;
                cachedPast = pastData;
                dataLoaded = true;

                setUpcomingDraw(upcomingData);
                setPastDraws(pastData);
            } catch (error) {
                console.error('Error fetching lotto data:', error);
                // Fallback to static data
                const upcomingData = getStaticUpcoming();
                const pastData = getStaticPast();

                cachedUpcoming = upcomingData;
                cachedPast = pastData;
                dataLoaded = true;

                setUpcomingDraw(upcomingData);
                setPastDraws(pastData);
            }
            setLoading(false);
        };
        fetchData();
    }, [authLoading, user, shouldUseCache]);

    const handleSharePrediction = async () => {
        if (!upcomingDraw?.conclusion?.finalPicks) return;

        const { twoDigit, threeDigit } = upcomingDraw.conclusion.finalPicks;
        const drawLabel = upcomingDraw.label || '';

        let text = `🎯 สรุปเลขเด่นประจำงวด ${drawLabel}\n\n`;
        if (twoDigit && twoDigit.length > 0) {
            text += `เลข 2 ตัว: ${twoDigit.join(', ')}\n`;
        }
        if (threeDigit && threeDigit.length > 0) {
            text += `เลข 3 ตัว: ${threeDigit.join(', ')}\n`;
        }
        
        text += `\nดูบทวิเคราะห์หวย สถิติย้อนหลัง 22 ปีแบบจัดเต็มได้ฟรีที่:\n${window.location.origin}/lotto`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `เลขเด็ดงวดนี้ ${drawLabel}`,
                    text: text,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                alert('คัดลอกเลขเด็ดเรียบร้อยแล้ว! นำไปวางเพื่อแชร์ให้เพื่อนๆ ได้เลย 🍀');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const currentDraw = selectedDraw || upcomingDraw;

    const tabConfig = [
        { id: 'historical', label: 'สถิติย้อนหลัง', icon: TrendingUp },
        { id: 'sources', label: 'สำนักดัง', icon: Users },
        { id: 'trends', label: 'กระแสสังคม', icon: Flame }
    ];

    const sourceColors = {
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-600' },
        pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-600' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-600' }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                    </div>
                </div>
                <p className="mt-4 text-amber-600 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">LottoInsight ต้องเข้าสู่ระบบก่อน</h2>
                    <p className="text-slate-500 mb-6">
                        กรุณาเข้าสู่ระบบก่อนใช้งานเครื่องมือวิเคราะห์หวยและเลขมงคล
                    </p>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                        เข้าสู่ระบบ
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
                    >
                        ← กลับหน้าหลัก
                    </button>
                </div>

                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            </div>
        );
    }



    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
                <div className="relative">
                    {/* Spinning outer ring */}
                    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🔮</span>
                    </div>
                </div>
                <p className="mt-4 text-amber-600 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-amber-50 text-slate-800'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-amber-100'} border-b backdrop-blur-sm`}>
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-amber-100'} transition-colors`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                🔮 LottoInsight
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                วิเคราะห์แนวทางสลากกินแบ่งรัฐบาล
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowLuckyModal(true)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">สุ่มเลขมงคล</span>
                        </button>
                        <button
                            onClick={() => navigate('/lotto/check')}
                            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50'}`}
                        >
                            <Search size={16} />
                            <span className="hidden sm:inline">ตรวจหวย</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Section: Tools / Features */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-purple-500" />
                        <h2 className="text-lg font-bold">เครื่องมือเสริมดวง</h2>
                    </div>

                    {/* Hero Feature: Tarot × Lotto */}
                    <button
                        onClick={() => setShowTarotLottoModal(true)}
                        className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl mb-4 w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900" />
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-purple-500/15" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-indigo-500/10" />
                        {/* Floating cards deco */}
                        <div className="absolute top-3 right-4 text-4xl opacity-20 rotate-12">🃏</div>
                        <div className="absolute bottom-3 right-16 text-2xl opacity-15 -rotate-6">🔮</div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">แนะนำ</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">🃏</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white">ไพ่ทาโรต์ทำนายเลขเด็ด</h3>
                                    <p className="text-indigo-300 text-sm">เปิดไพ่ 3 ใบ รับเลขมงคลประจำงวด</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-11 rounded bg-gradient-to-br from-purple-500 to-indigo-600 border border-purple-400/50 shadow-md" />
                                    <div className="w-8 h-11 rounded bg-gradient-to-br from-indigo-500 to-blue-600 border border-indigo-400/50 shadow-md" />
                                    <div className="w-8 h-11 rounded bg-gradient-to-br from-violet-500 to-purple-600 border border-violet-400/50 shadow-md" />
                                </div>
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span className="text-white text-sm font-medium">เปิดไพ่เลย</span>
                                    <ChevronRight size={14} className="text-white/70" />
                                </div>
                            </div>
                        </div>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Dream to Number */}
                        <button
                            onClick={() => setShowDreamModal(true)}
                            className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Moon size={24} className="text-yellow-300" />
                                    <h3 className="text-lg font-bold text-white">ทำนายฝัน</h3>
                                </div>
                                <p className="text-indigo-200 text-sm leading-relaxed">
                                    ฝันเห็นอะไร? แปลงเป็นเลขเด็ดตามตำราโบราณ
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-medium">
                                    <span>เปิดเลย</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </button>

                        {/* Birthday Number */}
                        <button
                            onClick={() => setShowBirthdayModal(true)}
                            className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600" />
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Cake size={24} className="text-yellow-200" />
                                    <h3 className="text-lg font-bold text-white">เลขวันเกิด</h3>
                                </div>
                                <p className="text-amber-100 text-sm leading-relaxed">
                                    คำนวณเลขมงคลส่วนตัวจากวันเกิดและราศี
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-medium">
                                    <span>เปิดเลย</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </button>

                        {/* Lucky Generator */}
                        <button
                            onClick={() => setShowLuckyModal(true)}
                            className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles size={24} className="text-yellow-300" />
                                    <h3 className="text-lg font-bold text-white">สุ่มเลขมงคล</h3>
                                </div>
                                <p className="text-emerald-100 text-sm leading-relaxed">
                                    สุ่มเลขจากน้ำหนักสถิติและเลขชนสำนัก
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-medium">
                                    <span>เปิดเลย</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </button>

                        {/* Shop */}
                        <button
                            onClick={() => navigate('/shop')}
                            className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600" />
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShoppingBag size={24} className="text-yellow-200" />
                                    <h3 className="text-lg font-bold text-white">ร้านค้ามงคล</h3>
                                </div>
                                <p className="text-rose-100 text-sm leading-relaxed">
                                    วัตถุมงคล เสริมดวง เสริมโชคลาภ
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-medium">
                                    <span>เข้าชม</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Section: Upcoming Draw */}
                {upcomingDraw && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={20} className="text-amber-500" />
                            <h2 className="text-lg font-bold">งวดที่กำลังจะมาถึง</h2>
                        </div>

                        <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-lg`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-amber-500">{upcomingDraw.label}</h3>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        รวบรวมข้อมูลจากสถิติ 22 ปี, สำนักดัง, และโซเชียล
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/lotto/${upcomingDraw.id}`)}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md"
                                >
                                    <FileText size={16} />
                                    ดูวิเคราะห์แบบละเอียด
                                </button>
                            </div>

                            {/* KPI Cards */}
                            {upcomingDraw.kpi && (
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-amber-50'}`}>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>สถิติสูงสุด</p>
                                        <p className="text-2xl font-bold text-amber-500">{upcomingDraw.kpi.historical}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-blue-50'}`}>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>เลขชนสำนัก</p>
                                        <p className="text-2xl font-bold text-blue-500">{upcomingDraw.kpi.sources}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-red-50'}`}>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>กระแสมาแรง</p>
                                        <p className="text-2xl font-bold text-red-500">{upcomingDraw.kpi.trending}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tabs */}
                            <div className={`flex gap-2 p-1 rounded-lg mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                {tabConfig.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                            ? `${isDark ? 'bg-slate-700 text-white' : 'bg-white text-amber-600 shadow-sm'}`
                                            : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`
                                            }`}
                                    >
                                        <tab.icon size={14} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[200px]">
                                {/* Historical */}
                                {activeTab === 'historical' && upcomingDraw.historical && (
                                    <div className="space-y-4">
                                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <strong className="text-amber-500">บทวิเคราะห์:</strong> จากสถิติย้อนหลัง 10 ปี พบว่าเลขที่ออกบ่อยในงวดนี้ ได้แก่
                                        </p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {upcomingDraw.historical.labels.map((num, idx) => (
                                                <div key={idx} className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-amber-50'}`}>
                                                    <p className="text-2xl font-bold text-amber-500">{num}</p>
                                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {upcomingDraw.historical.data[idx]} ครั้ง
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sources */}
                                {activeTab === 'sources' && upcomingDraw.sources && (
                                    <div className="space-y-4">
                                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <strong className="text-blue-500">บทวิเคราะห์:</strong> เปรียบเทียบเลขเด็ดจาก 3 สำนัก พบว่าเลข <strong className="text-blue-500">{upcomingDraw.kpi.sources}</strong> ปรากฏในทุกสำนัก
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {upcomingDraw.sources.map((source, idx) => {
                                                const colors = sourceColors[source.color] || sourceColors.blue;
                                                return (
                                                    <div key={idx} className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className={`font-bold ${colors.text.replace('700', '800')}`}>{source.name}</h4>
                                                            <span className={`text-xs px-2 py-1 rounded ${colors.badge}`}>{source.theme}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 justify-center">
                                                            {source.numbers.map((num, nidx) => (
                                                                <div key={nidx} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-white ${colors.text} border ${colors.border} shadow-sm`}>
                                                                    {num}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Trends */}
                                {activeTab === 'trends' && upcomingDraw.trends && (
                                    <div className="space-y-4">
                                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <strong className="text-red-500">บทวิเคราะห์:</strong> กระแสโซเชียลมุ่งเน้นเลขที่เกี่ยวกับเหตุการณ์ปัจจุบัน
                                        </p>
                                        <div className="space-y-3">
                                            {upcomingDraw.trends.items.map((item, idx) => (
                                                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${idx === 0 ? 'bg-red-50 border border-red-100' :
                                                    idx === 1 ? 'bg-orange-50 border border-orange-100' :
                                                        'bg-yellow-50 border border-yellow-100'
                                                    }`}>
                                                    <span className="text-slate-700">{item.label}</span>
                                                    <span className={`text-sm font-semibold ${idx === 0 ? 'text-red-600' :
                                                        idx === 1 ? 'text-orange-600' :
                                                            'text-yellow-700'
                                                        }`}>
                                                        มาแรงอันดับ {item.rank}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detail Button - Mobile */}
                            <div className="mt-6 sm:hidden">
                                <button
                                    onClick={() => navigate(`/lotto/${upcomingDraw.id}`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium shadow-md"
                                >
                                    <FileText size={18} />
                                    ดูการวิเคราะห์แบบละเอียด
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Section: คาดเดางวดถัดไป (Next Draw Prediction) */}
                {upcomingDraw?.conclusion?.finalPicks && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Target size={20} className="text-orange-500" />
                                <h2 className="text-lg font-bold">🎯 คาดเดางวดถัดไป</h2>
                            </div>
                            <button
                                onClick={handleSharePrediction}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors border hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 text-amber-500 hover:bg-slate-700' : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50'}`}
                            >
                                <Share2 size={16} />
                                <span className="hidden sm:inline">แชร์เลขเด็ด</span>
                                <span className="sm:hidden">แชร์</span>
                            </button>
                        </div>

                        {/* Main Prediction Card */}
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white">
                                <div className="text-center mb-1">
                                    <p className="text-amber-100 text-sm font-medium">สรุปเลขเด่นประจำงวด</p>
                                    <p className="text-amber-200 text-xs">{upcomingDraw.label}</p>
                                </div>

                                {/* 2-digit predictions */}
                                <div className="mt-5">
                                    <p className="text-xs text-amber-100 mb-2 text-center">เลขท้าย 2 ตัว</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {upcomingDraw.conclusion.finalPicks.twoDigit?.map((num, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-transform hover:scale-110 ${idx === 0
                                                    ? 'bg-white text-orange-600 ring-2 ring-yellow-300'
                                                    : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                                                    }`}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3-digit predictions */}
                                <div className="mt-5">
                                    <p className="text-xs text-amber-100 mb-2 text-center">เลข 3 ตัว</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {upcomingDraw.conclusion.finalPicks.threeDigit?.map((num, idx) => (
                                            <div
                                                key={idx}
                                                className={`px-4 py-2 rounded-full font-bold text-sm shadow-md transition-transform hover:scale-110 ${idx === 0
                                                    ? 'bg-white text-orange-600 ring-2 ring-yellow-300'
                                                    : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                                                    }`}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Analysis Cards */}
                            <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 space-y-3`}>
                                {/* Statistical */}
                                {upcomingDraw.conclusion.statistical && (
                                    <div className="border border-amber-100 rounded-xl overflow-hidden">
                                        <div className="bg-amber-50 px-4 py-2 flex items-center gap-2">
                                            <span>{upcomingDraw.conclusion.statistical.icon}</span>
                                            <span className="text-sm font-bold text-amber-800">{upcomingDraw.conclusion.statistical.title}</span>
                                        </div>
                                        <div className="px-4 py-3 space-y-2">
                                            {upcomingDraw.conclusion.statistical.numbers?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-10 h-7 flex items-center justify-center bg-amber-100 text-amber-700 rounded font-bold text-sm">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Event-driven */}
                                {upcomingDraw.conclusion.eventDriven && (
                                    <div className="border border-red-100 rounded-xl overflow-hidden">
                                        <div className="bg-red-50 px-4 py-2 flex items-center gap-2">
                                            <span>{upcomingDraw.conclusion.eventDriven.icon}</span>
                                            <span className="text-sm font-bold text-red-800">{upcomingDraw.conclusion.eventDriven.title}</span>
                                        </div>
                                        <div className="px-4 py-3 space-y-2">
                                            {upcomingDraw.conclusion.eventDriven.numbers?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-10 h-7 flex items-center justify-center bg-red-100 text-red-700 rounded font-bold text-sm">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Consensus */}
                                {upcomingDraw.conclusion.consensus && (
                                    <div className="border border-purple-100 rounded-xl overflow-hidden">
                                        <div className="bg-purple-50 px-4 py-2 flex items-center gap-2">
                                            <span>{upcomingDraw.conclusion.consensus.icon}</span>
                                            <span className="text-sm font-bold text-purple-800">{upcomingDraw.conclusion.consensus.title}</span>
                                        </div>
                                        <div className="px-4 py-3 space-y-2">
                                            {upcomingDraw.conclusion.consensus.numbers?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-10 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded font-bold text-sm">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Section: Past Draws */}
                {pastDraws.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy size={20} className="text-slate-400" />
                            <h2 className="text-lg font-bold">งวดที่ผ่านมา</h2>
                        </div>

                        <div className="space-y-4">
                            {pastDraws.map((draw) => (
                                <div
                                    key={draw.id}
                                    onClick={() => navigate(`/lotto/${draw.id}`)}
                                    className={`rounded-xl p-4 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold">{draw.label}</h3>
                                            {draw.result && (
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div>
                                                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>รางวัลที่ 1</span>
                                                        <p className="text-lg font-mono font-bold text-amber-500">{draw.result.first}</p>
                                                    </div>
                                                    <div>
                                                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>เลขท้าย 2 ตัว</span>
                                                        <p className="text-lg font-mono font-bold text-blue-500">{draw.result.lastTwo}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-purple-500 hidden sm:inline">ดูวิเคราะห์</span>
                                            <ChevronRight size={20} className="text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Disclaimer */}
                <footer className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'} text-xs`}>
                    <p>ข้อมูลนี้เป็นเพียงการวิเคราะห์ทางสถิติเพื่อความบันเทิง</p>
                    <p>โปรดใช้วิจารณญาณในการรับชม ทางผู้จัดทำไม่สนับสนุนการพนัน</p>
                </footer>
            </main>

            <LuckyGeneratorModal
                isOpen={showLuckyModal}
                onClose={() => setShowLuckyModal(false)}
                isDark={isDark}
            />

            <DreamNumberModal
                isOpen={showDreamModal}
                onClose={() => setShowDreamModal(false)}
            />

            <BirthdayNumberModal
                isOpen={showBirthdayModal}
                onClose={() => setShowBirthdayModal(false)}
            />

            <TarotLottoModal
                isOpen={showTarotLottoModal}
                onClose={() => setShowTarotLottoModal(false)}
            />

        </div>
    );
};

export default LottoInsightPage;
