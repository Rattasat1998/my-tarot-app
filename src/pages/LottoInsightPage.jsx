import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, TrendingUp, Users, Flame, ChevronRight, 
    Calendar, Trophy, Sparkles, FileText, Search, Target, 
    Moon, Cake, Share2, Star, LineChart, 
    MessageSquare, Activity, Compass, Loader2, ExternalLink, Clock,
    BarChart3, ShieldCheck,
} from 'lucide-react';
import * as lottoService from '../services/lottoService';
// Fallback to static data if database is not available
import { getUpcomingDraw as getStaticUpcoming, getPastDraws as getStaticPast } from '../data/lottoData';
import { usePageSEO } from '../hooks/usePageTitle';
import { getNextDrawDate, formatThaiDrawLabel } from '../utils/lottoDateUtils';
import { LuckyGeneratorModal } from '../components/modals/LuckyGeneratorModal';
import { DreamNumberModal } from '../components/modals/DreamNumberModal';
import { BirthdayNumberModal } from '../components/modals/BirthdayNumberModal';
import { TarotLottoModal } from '../components/modals/TarotLottoModal';
import { LottoSignalScannerModal } from '../components/modals/LottoSignalScannerModal';
import { LottoFortuneBoostModal } from '../components/modals/LottoFortuneBoostModal';


// Module-level cache to persist data across navigations
let cachedUpcoming = null;
let cachedPast = [];
let dataLoaded = false;

const calculateDrawCountdown = (drawDate) => {
    const now = new Date();
    const target = new Date(drawDate);
    target.setHours(0, 0, 0, 0);
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
};

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

    // Check if coming back from detail page (use cache) or from home (reload)
    const fromDetail = location.state?.fromDetail === true;
    const shouldUseCache = fromDetail && dataLoaded;

    const [activeTab, setActiveTab] = useState('historical');
    const [showLuckyModal, setShowLuckyModal] = useState(false);
    const [showDreamModal, setShowDreamModal] = useState(false);
    const [showBirthdayModal, setShowBirthdayModal] = useState(false);
    const [showTarotLottoModal, setShowTarotLottoModal] = useState(false);
    const [showSignalScannerModal, setShowSignalScannerModal] = useState(false);
    const [showFortuneBoostModal, setShowFortuneBoostModal] = useState(false);

    // Initialize from cache if coming from detail page
    const [loading, setLoading] = useState(!shouldUseCache);
    const [upcomingDraw, setUpcomingDraw] = useState(shouldUseCache ? cachedUpcoming : null);
    const [pastDraws, setPastDraws] = useState(shouldUseCache ? cachedPast : []);

    // Latest real draw results (from rayriffy API)
    const [latestDraw, setLatestDraw] = useState(null);
    const [loadingLatest, setLoadingLatest] = useState(true);

    // Countdown state for next draw
    const nextDrawDate = useMemo(() => getNextDrawDate(), []);
    const nextDrawLabel = useMemo(() => formatThaiDrawLabel(nextDrawDate), [nextDrawDate]);
    const [countdown, setCountdown] = useState(() => calculateDrawCountdown(nextDrawDate));

    // Fetch latest real lottery draw from API
    useEffect(() => {
        const fetchLatest = async () => {
            setLoadingLatest(true);
            try {
                const history = await lottoService.fetchDrawHistory();
                if (history && history.length > 0) {
                    const data = await lottoService.fetchDrawByIdFromApi(history[0].id);
                    if (data && data.prizes) setLatestDraw(data);
                }
            } catch (err) {
                console.error('Error fetching latest real draw:', err);
            }
            setLoadingLatest(false);
        };
        fetchLatest();
    }, []);

    // Countdown timer for next draw
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(calculateDrawCountdown(nextDrawDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [nextDrawDate]);

    // Fetch data from database, fallback to static data
    useEffect(() => {
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
                    upcomingData = getStaticUpcoming();
                }

                if (past && past.length > 0) {
                    pastData = past.map(d => lottoService.transformDrawForUI(d));
                } else {
                    pastData = getStaticPast();
                }

                cachedUpcoming = upcomingData;
                cachedPast = pastData;
                dataLoaded = true;

                setUpcomingDraw(upcomingData);
                setPastDraws(pastData);
            } catch (error) {
                console.error('Error fetching lotto data:', error);
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
    }, [shouldUseCache]);

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
        
        text += `\nดูบทวิเคราะห์หวย สถิติย้อนหลัง 22 ปีแบบจัดเต็มได้ฟรีที่:\n${window.location.origin}/lotto\n#หวย #เลขเด็ด #เลขงวดนี้ #เลข2ตัว #เลขดัง`;

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

    const tabConfig = [
        { id: 'historical', label: 'สถิติย้อนหลัง', icon: TrendingUp },
        { id: 'sources', label: 'สำนักดัง', icon: Users },
        { id: 'trends', label: 'กระแสสังคม', icon: Flame }
    ];

    const sourceColors = {
        green: { bg: 'bg-emerald-50', border: 'border-emerald-200/50', text: 'text-emerald-700', badge: 'bg-emerald-100/50 text-emerald-600' },
        pink: { bg: 'bg-rose-50', border: 'border-rose-200/50', text: 'text-rose-700', badge: 'bg-rose-100/50 text-rose-600' },
        blue: { bg: 'bg-indigo-50', border: 'border-indigo-200/50', text: 'text-indigo-700', badge: 'bg-indigo-100/50 text-indigo-600' }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-[3px] border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500 tracking-wider">LOADING INSIGHTS</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans selection:bg-amber-100 pb-20">
            {/* Elegant Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <ArrowLeft size={20} strokeWidth={1.5} />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                                LottoInsight
                            </h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                                Data-Driven Predictions
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowLuckyModal(true)}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                        >
                            <Sparkles size={16} strokeWidth={1.5} />
                            <span className="hidden sm:inline">สุ่มเลขมงคล</span>
                        </button>
                        <button
                            onClick={() => navigate('/lotto/check')}
                            className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors border border-slate-200 text-slate-700 bg-white shadow-sm active:scale-95"
                        >
                            <Search size={16} strokeWidth={1.5} />
                            <span className="hidden sm:inline">ตรวจรางวัล</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">

                {/* ─── ผลหวยงวดล่าสุด ─── */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-amber-500" strokeWidth={1.5} />
                            <h2 className="text-base font-semibold text-slate-800 tracking-wide">ผลหวยงวดล่าสุด</h2>
                        </div>
                        {latestDraw?.date && (
                            <span className="text-xs text-slate-500 font-medium tracking-wide">{latestDraw.date}</span>
                        )}
                    </div>

                    {loadingLatest ? (
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-10 flex flex-col items-center justify-center gap-3">
                            <Loader2 size={28} className="animate-spin text-amber-500" />
                            <p className="text-sm text-slate-400">กำลังโหลดผลรางวัล...</p>
                        </div>
                    ) : latestDraw ? (
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                            {/* Prize 1 Hero */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                                <div className="absolute top-6 right-6 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                                <div className="absolute bottom-4 left-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />

                                <p className="text-amber-300/80 text-[10px] font-bold tracking-[0.25em] uppercase mb-1 relative z-10">🏆 รางวัลที่ 1</p>
                                <p className="text-slate-500 text-xs mb-6 relative z-10">รางวัลละ 6,000,000 บาท</p>
                                <div className="text-6xl md:text-7xl font-light tracking-[0.25em] text-white font-mono relative z-10 select-all">
                                    {latestDraw.prizes?.find(p => p.id === 'prizeFirst')?.number?.[0] || '------'}
                                </div>

                                {/* Adjacent Numbers */}
                                {latestDraw.prizes?.find(p => p.id === 'prizeFirstNear')?.number?.length > 0 && (
                                    <div className="mt-6 relative z-10">
                                        <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3">เลขข้างเคียงรางวัลที่ 1 — รางวัลละ 100,000 บาท</p>
                                        <div className="flex justify-center gap-4">
                                            {latestDraw.prizes.find(p => p.id === 'prizeFirstNear').number.map((num, i) => (
                                                <span key={i} className="text-xl font-mono text-slate-300 tracking-widest">{num}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Running Numbers Row */}
                            <div className="grid grid-cols-3 divide-x divide-slate-100">
                                {/* Back 2 */}
                                <div className="p-5 text-center">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-blue-500 mb-1">เลขท้าย 2 ตัว</p>
                                    <p className="text-[10px] text-slate-400 mb-3">รางวัลละ 2,000 บาท</p>
                                    <p className="text-3xl font-light tracking-[0.2em] text-slate-900 font-mono">
                                        {latestDraw.runningNumbers?.find(r => r.id === 'runningNumberBackTwo')?.number?.[0] || '--'}
                                    </p>
                                </div>
                                {/* Front 3 */}
                                <div className="p-5 text-center">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-purple-500 mb-1">เลขหน้า 3 ตัว</p>
                                    <p className="text-[10px] text-slate-400 mb-3">รางวัลละ 4,000 บาท</p>
                                    <div className="flex flex-col gap-1 items-center">
                                        {(latestDraw.runningNumbers?.find(r => r.id === 'runningNumberFrontThree')?.number || []).map((num, i) => (
                                            <span key={i} className="text-xl font-mono text-slate-700 tracking-wider">{num}</span>
                                        ))}
                                    </div>
                                </div>
                                {/* Back 3 */}
                                <div className="p-5 text-center">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-purple-500 mb-1">เลขท้าย 3 ตัว</p>
                                    <p className="text-[10px] text-slate-400 mb-3">รางวัลละ 4,000 บาท</p>
                                    <div className="flex flex-col gap-1 items-center">
                                        {(latestDraw.runningNumbers?.find(r => r.id === 'runningNumberBackThree')?.number || []).map((num, i) => (
                                            <span key={i} className="text-xl font-mono text-slate-700 tracking-wider">{num}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="border-t border-slate-100 p-4">
                                <button
                                    onClick={() => navigate('/lotto/check')}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-2xl transition-colors"
                                >
                                    <Search size={15} strokeWidth={1.5} />
                                    ตรวจสอบสลากของคุณ
                                    <ExternalLink size={13} className="opacity-50" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 text-center">
                            <p className="text-slate-400 text-sm">ไม่พบข้อมูลผลรางวัล</p>
                        </div>
                    )}
                </section>

                {/* ─── งวดที่กำลังจะมาถึง ─── */}
                <section>
                    <div className="flex items-center gap-2 mb-6 px-1">
                        <Clock size={18} className="text-indigo-500" strokeWidth={1.5} />
                        <h2 className="text-base font-semibold text-slate-800 tracking-wide">งวดที่กำลังจะมาถึง</h2>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                        {/* Header strip */}
                        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-8 py-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent)]" />
                            <p className="text-indigo-200 text-[10px] font-bold tracking-[0.25em] uppercase mb-1 relative z-10">📅 งวดถัดไป</p>
                            <p className="text-white text-2xl font-semibold tracking-tight relative z-10">{nextDrawLabel}</p>
                        </div>

                        {/* Countdown Grid */}
                        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
                            {[
                                { value: countdown.days, label: 'วัน' },
                                { value: countdown.hours, label: 'ชั่วโมง' },
                                { value: countdown.minutes, label: 'นาที' },
                                { value: countdown.seconds, label: 'วินาที' },
                            ].map(({ value, label }) => (
                                <div key={label} className="p-5 text-center">
                                    <p className="text-3xl md:text-4xl font-light tabular-nums text-slate-900 font-mono">
                                        {String(value).padStart(2, '0')}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="p-4 flex flex-col sm:flex-row gap-3">
                            {upcomingDraw?.id && (
                                <button
                                    onClick={() => navigate(`/lotto/${upcomingDraw.id}`, { state: { fromDetail: true } })}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-2xl transition-colors border border-indigo-100"
                                >
                                    <Sparkles size={15} strokeWidth={1.5} />
                                    ดูบทวิเคราะห์งวดนี้
                                    <ChevronRight size={14} className="opacity-50" />
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/lotto/check')}
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-200"
                            >
                                <Search size={15} strokeWidth={1.5} />
                                ตรวจสลากงวดล่าสุด
                            </button>
                        </div>
                    </div>
                </section>

                {/* 1. Feature Tools - Bento Grid Style */}
                <section>
                    <div className="flex items-center gap-2 mb-6 px-1">
                        <Compass size={18} className="text-slate-400" strokeWidth={1.5} />
                        <h2 className="text-base font-semibold text-slate-800 tracking-wide">เครื่องมือวิเคราะห์ & เสริมดวง</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[140px]">
                        {/* Bento Item 1: Tarot (Large - spans 2 cols, 2 rows) */}
                        <button
                            onClick={() => setShowTarotLottoModal(true)}
                            className="group relative overflow-hidden rounded-3xl min-h-[280px] md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-left transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-700/50"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-amber-500/20" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white mb-6 backdrop-blur-md">
                                        <Star size={12} className="text-amber-300" fill="currentColor" />
                                        <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-50">Recommended</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">ไพ่ทาโรต์ทำนายเลข</h3>
                                    <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">
                                        เปิดไพ่ 3 ใบ เพื่อรับแนวทางตัวเลขมงคลประจำงวด ตามพื้นดวงของคุณ
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-8">
                                    <div className="flex -space-x-4">
                                        <div className="w-12 h-16 rounded-lg bg-slate-800 border border-slate-600 shadow-2xl rotate-[-10deg] transform transition-transform group-hover:rotate-[-15deg]" />
                                        <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 border border-amber-500 shadow-2xl z-10 transition-transform group-hover:-translate-y-2 flex items-center justify-center">
                                            <Star size={18} className="text-amber-100 opacity-50" />
                                        </div>
                                        <div className="w-12 h-16 rounded-lg bg-slate-800 border border-slate-600 shadow-2xl rotate-[10deg] transform transition-transform group-hover:rotate-[15deg]" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                                        <ChevronRight size={18} strokeWidth={2} />
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Bento Item 2: Dream (1 col, 1 row) */}
                        <button
                            onClick={() => setShowDreamModal(true)}
                            className="group relative overflow-hidden rounded-3xl bg-white p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-200/60"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
                                    <Moon size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">ทำนายฝัน</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">แก้ฝันเป็นเลขเด็ดตามตำราโบราณ</p>
                                </div>
                            </div>
                        </button>

                        {/* Bento Item 3: Birthday (1 col, 1 row) */}
                        <button
                            onClick={() => setShowBirthdayModal(true)}
                            className="group relative overflow-hidden rounded-3xl bg-white p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-200/60"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform">
                                    <Cake size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">เลขวันเกิด</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">คำนวณเลขมงคลประจำราศี</p>
                                </div>
                            </div>
                        </button>

                        {/* Bento Item 4: Generator (wide - 2 cols, 1 row) */}
                        <button
                            onClick={() => setShowLuckyModal(true)}
                            className="group md:col-span-2 relative overflow-hidden rounded-3xl min-h-[140px] bg-white p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-200/60 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform">
                                    <Activity size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">ระบบสุ่มเลข AI</h3>
                                    <p className="text-sm text-slate-500">วิเคราะห์ความน่าจะเป็นจากฐานข้อมูล</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                <ChevronRight size={16} className="text-slate-400" strokeWidth={2} />
                            </div>
                        </button>

                        {/* Bento Item 5: Signal Scanner */}
                        <button
                            onClick={() => setShowSignalScannerModal(true)}
                            className="group md:col-span-2 relative overflow-hidden rounded-3xl min-h-[140px] bg-white p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                    <BarChart3 size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">สแกนเลขชนข้อมูล</h3>
                                    <p className="text-sm text-slate-500">จัดอันดับเลขจากสถิติ สำนักดัง และกระแส</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {(upcomingDraw?.conclusion?.finalPicks?.twoDigit || []).slice(0, 3).map((num) => (
                                    <span key={num} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 font-mono">
                                        {num}
                                    </span>
                                ))}
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                    <ChevronRight size={16} className="text-slate-400" strokeWidth={2} />
                                </div>
                            </div>
                        </button>

                        {/* Bento Item 6: Fortune Boost */}
                        <button
                            onClick={() => setShowFortuneBoostModal(true)}
                            className="group md:col-span-2 relative overflow-hidden rounded-3xl min-h-[140px] bg-slate-950 p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-800 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-300/20 flex items-center justify-center text-emerald-300 group-hover:rotate-6 transition-transform">
                                    <ShieldCheck size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">ฤกษ์เสริมโชค</h3>
                                    <p className="text-sm text-slate-400">สีมงคล ทิศ เวลา และเลขเข้ากับวันเกิด</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center transition-transform group-hover:scale-110">
                                <ChevronRight size={16} strokeWidth={2} />
                            </div>
                        </button>
                    </div>
                </section>

                {/* 2. Main Prediction Card (Editorial Style) */}
                {upcomingDraw?.conclusion?.finalPicks && (
                    <section>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="flex items-center gap-2">
                                <Target size={18} className="text-slate-400" strokeWidth={1.5} />
                                <h2 className="text-base font-semibold text-slate-800 tracking-wide">สรุปเลขเด่นประจำงวด</h2>
                            </div>
                            <button
                                onClick={handleSharePrediction}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 bg-slate-100 transition-colors"
                            >
                                <Share2 size={14} />
                                <span>Share</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                            {/* Top part: The Numbers */}
                            <div className="p-8 md:p-10 bg-slate-900 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 opacity-80" />
                                <p className="text-amber-200/80 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Editor's Pick</p>
                                <h3 className="text-white text-2xl font-light tracking-tight mb-10">{upcomingDraw.label}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                                    {/* 2 Digits */}
                                    <div className="flex flex-col items-center pt-2 md:pt-0">
                                        <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase mb-6">สองตัวท้าย</p>
                                        <div className="flex flex-wrap justify-center gap-4 max-w-[280px]">
                                            {upcomingDraw.conclusion.finalPicks.twoDigit?.map((num, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl text-2xl font-light tracking-tight transition-all
                                                        ${idx === 0 
                                                            ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-110 font-medium z-10' 
                                                            : 'bg-slate-800/80 text-slate-300 border border-slate-700/50 group-hover:bg-slate-700'
                                                        }`}
                                                    >
                                                        {num}
                                                    </div>
                                                    {idx === 0 && (
                                                        <div className="absolute -top-1 -right-1 z-20">
                                                            <div className="bg-slate-900 text-amber-300 rounded-full p-0.5 border border-slate-800">
                                                                <Star size={10} fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3 Digits */}
                                    <div className="flex flex-col items-center pt-10 md:pt-0">
                                        <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase mb-6">สามตัว</p>
                                        <div className="flex flex-wrap justify-center gap-3 max-w-[280px]">
                                            {upcomingDraw.conclusion.finalPicks.threeDigit?.map((num, idx) => (
                                                <div key={idx} className={`px-5 py-3 md:px-6 md:py-3.5 rounded-2xl text-xl tracking-widest transition-all text-center
                                                    ${idx === 0 
                                                        ? 'bg-slate-50 text-slate-900 font-medium scale-105 shadow-lg border border-slate-200' 
                                                        : 'bg-slate-800/80 text-slate-300 font-light border border-slate-700/50'
                                                    }`}
                                                >
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom part: The Why (List) */}
                            <div className="p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                                {upcomingDraw.conclusion.statistical && (
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                            <LineChart size={14} className="text-amber-500" />
                                            เชิงสถิติ
                                        </h4>
                                        <ul className="space-y-3">
                                            {upcomingDraw.conclusion.statistical.numbers?.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm">
                                                    <span className="font-semibold text-slate-900 w-8 flex-shrink-0 text-right">{item.num}</span>
                                                    <span className="text-slate-500 leading-relaxed text-[13px]">{item.reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {upcomingDraw.conclusion.eventDriven && (
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                            <Flame size={14} className="text-rose-500" />
                                            กระแสสังคม
                                        </h4>
                                        <ul className="space-y-3">
                                            {upcomingDraw.conclusion.eventDriven.numbers?.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm">
                                                    <span className="font-semibold text-slate-900 w-8 flex-shrink-0 text-right">{item.num}</span>
                                                    <span className="text-slate-500 leading-relaxed text-[13px]">{item.reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {upcomingDraw.conclusion.consensus && (
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
                                            <MessageSquare size={14} className="text-indigo-500" />
                                            สำนักดัง
                                        </h4>
                                        <ul className="space-y-3">
                                            {upcomingDraw.conclusion.consensus.numbers?.slice(0, 3).map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm">
                                                    <span className="font-semibold text-slate-900 w-8 flex-shrink-0 text-right">{item.num}</span>
                                                    <span className="text-slate-500 leading-relaxed text-[13px]">{item.reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}


                {/* 3. Deep Dive Analysis (Tabs) */}
                {upcomingDraw && (
                    <section>
                        <div className="flex items-center gap-2 mb-6 px-1">
                            <Activity size={18} className="text-slate-400" strokeWidth={1.5} />
                            <h2 className="text-base font-semibold text-slate-800 tracking-wide">เจาะลึกข้อมูล</h2>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-3 transition-shadow hover:shadow-md">
                            {/* Segmented Control */}
                            <div className="flex bg-slate-50 rounded-2xl p-1 mb-6 border border-slate-100/50">
                                {tabConfig.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                            activeTab === tab.id
                                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="px-3 pb-6 min-h-[250px]">
                                {/* Historical */}
                                {activeTab === 'historical' && upcomingDraw.historical && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-8 px-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">ความถี่ของตัวเลข</h3>
                                                <p className="text-sm text-slate-500">วิเคราะห์จากฐานข้อมูลการออกรางวัลย้อนหลัง 22 ปี</p>
                                            </div>
                                            <div className="hidden md:flex text-amber-500/10">
                                                <LineChart size={48} strokeWidth={1} />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                            {upcomingDraw.historical.labels.map((num, idx) => (
                                                <div key={idx} className="group p-5 rounded-2xl border border-slate-100 bg-slate-50 text-center hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all">
                                                    <p className="text-4xl font-light tracking-tight text-slate-800 mb-3 group-hover:text-amber-500 transition-colors">{num}</p>
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 group-hover:bg-amber-50 transition-colors">
                                                        <Activity size={10} className="text-slate-400 group-hover:text-amber-500" />
                                                        <p className="text-[10px] font-bold text-slate-500 group-hover:text-amber-600 uppercase tracking-widest">
                                                            {upcomingDraw.historical.data[idx]} ครั้ง
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sources */}
                                {activeTab === 'sources' && upcomingDraw.sources && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                         <div className="flex items-center justify-between mb-8 px-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">เปรียบเทียบสำนักดัง</h3>
                                                <p className="text-sm text-slate-500">รวมรวมตัวเลขจากแหล่งอ้างอิงหลักประจำงวด</p>
                                            </div>
                                            <div className="hidden md:flex text-indigo-500/10">
                                                <Users size={48} strokeWidth={1} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                            {upcomingDraw.sources.map((source, idx) => {
                                                const colors = sourceColors[source.color] || sourceColors.blue;
                                                return (
                                                    <div key={idx} className={`rounded-2xl p-6 border transition-all hover:shadow-md bg-white ${colors.border}`}>
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.badge}`}>
                                                                    <MessageSquare size={14} />
                                                                </div>
                                                                <h4 className={`font-semibold tracking-wide ${colors.text}`}>{source.name}</h4>
                                                            </div>
                                                            <span className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100`}>{source.theme}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {source.numbers.map((num, nidx) => (
                                                                <div key={nidx} className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-medium border shadow-sm ${colors.bg} ${colors.border} ${colors.text}`}>
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
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-8 px-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">กระแสสังคม</h3>
                                                <p className="text-sm text-slate-500">การวิเคราะห์ keyword ที่ถูกพูดถึงมากที่สุด</p>
                                            </div>
                                            <div className="hidden md:flex text-rose-500/10">
                                                <Flame size={48} strokeWidth={1} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {upcomingDraw.trends.items.map((item, idx) => (
                                                <div key={idx} className={`group flex flex-col justify-between p-5 rounded-2xl bg-white border transition-all hover:shadow-md ${
                                                    idx === 0 ? 'border-amber-200/60 hover:border-amber-300 md:col-span-2 md:flex-row md:items-center' : 'border-slate-100 hover:border-slate-200'
                                                }`}>
                                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                                            ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-md' : 
                                                              'bg-slate-50 text-slate-400 border border-slate-100'}`}
                                                        >
                                                            #{item.rank}
                                                        </div>
                                                        <span className="text-slate-700 font-medium text-sm md:text-base leading-relaxed">{item.label.replace(/^[🔥📱✨🙏🚗⭐🧧]\s*/u, '')}</span>
                                                    </div>
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 text-center">
                                <button
                                    onClick={() => navigate(`/lotto/${upcomingDraw.id}`)}
                                    className="w-full inline-flex items-center justify-center gap-2 py-4 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-200/50"
                                >
                                    <FileText size={16} strokeWidth={1.5} />
                                    ดูรายงานการวิเคราะห์รอบเต็ม
                                    <ChevronRight size={16} className="opacity-50" />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Section: Past Draws */}
                {pastDraws.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-6 px-1">
                            <Calendar size={18} className="text-slate-400" strokeWidth={1.5} />
                            <h2 className="text-base font-semibold text-slate-800 tracking-wide">ผลรางวัลย้อนหลัง</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pastDraws.map((draw) => (
                                <div
                                    key={draw.id}
                                    onClick={() => navigate(`/lotto/${draw.id}`)}
                                    className="group rounded-3xl p-6 md:p-8 bg-white border border-slate-200/60 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-semibold text-slate-900">{draw.label}</h3>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors text-slate-400 group-hover:text-slate-700 border border-slate-100">
                                            <ChevronRight size={16} strokeWidth={2} />
                                        </div>
                                    </div>
                                    
                                    {draw.result && (
                                        <div className="flex items-center gap-6 md:gap-10 border-t border-slate-100 pt-6">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 block mb-2">รางวัลที่ 1</span>
                                                <p className="text-2xl md:text-3xl font-light tracking-widest text-slate-900">{draw.result.first}</p>
                                            </div>
                                            <div className="w-px h-10 bg-slate-100"></div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 block mb-2">2 ตัว</span>
                                                <p className="text-2xl md:text-3xl font-light tracking-widest text-slate-900">{draw.result.lastTwo}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <footer className="text-center pt-8 pb-4 border-t border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Disclaimer</p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                        ข้อมูลนี้เป็นการวิเคราะห์ทางสถิติและรวบรวมข้อมูลจากแหล่งอ้างอิงต่างๆ เพื่อเป็นแนวทางเบื้องต้นและเพื่อความบันเทิง<br/>
                        โปรดใช้วิจารณญาณ ไม่สนับสนุนการพนันที่ไม่ถูกกฎหมาย
                    </p>
                </footer>
            </main>

            <LuckyGeneratorModal
                isOpen={showLuckyModal}
                onClose={() => setShowLuckyModal(false)}
                isDark={false}
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
            <LottoSignalScannerModal
                isOpen={showSignalScannerModal}
                onClose={() => setShowSignalScannerModal(false)}
                draw={upcomingDraw}
            />
            <LottoFortuneBoostModal
                isOpen={showFortuneBoostModal}
                onClose={() => setShowFortuneBoostModal(false)}
                draw={upcomingDraw}
                nextDrawLabel={nextDrawLabel}
            />
        </div>
    );
};

export default LottoInsightPage;
