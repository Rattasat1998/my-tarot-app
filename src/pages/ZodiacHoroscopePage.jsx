import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles, Star, Calendar, TrendingUp, Heart, Shield } from 'lucide-react';
import {
    HOROSCOPE_OVERVIEW,
    PLANET_ANALYSIS,
    ASTRO_EVENTS,
    ZODIAC_SIGNS,
    LUCKY_COLORS_BY_DAY,
    LUCKY_NUMBERS_BY_YEAR,
    ZODIAC_GROUPS,
    CLOSING_MESSAGE
} from '../data/zodiacHoroscopeData';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

const ZodiacCard = ({ sign, isExpanded, onToggle }) => {
    return (
        <div
            id={sign.id}
            className="scroll-mt-24 mb-6"
        >
            <div
                className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/60 overflow-hidden hover:border-slate-700/60 transition-all duration-300"
                style={{ borderTopColor: sign.color, borderTopWidth: '3px' }}
            >
                {/* Card Header */}
                <button
                    onClick={onToggle}
                    className="w-full text-left p-5 sm:p-6 flex items-center gap-4 hover:bg-slate-800/30 transition-colors"
                >
                    <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0"
                        style={{ background: `${sign.color}20`, border: `1px solid ${sign.color}40` }}
                    >
                        {sign.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{sign.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{sign.element}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{sign.dateRange}</p>
                        <p className="text-sm font-medium mt-1" style={{ color: sign.color }}>{sign.yearTitle}</p>
                    </div>
                    <div className="flex-shrink-0 text-slate-500">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="border-t border-slate-800 pt-5" />

                        {/* Overview */}
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                                __html: sign.overview.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                            }} />
                        </div>

                        {/* Monthly Predictions */}
                        {sign.monthly && sign.monthly.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Calendar size={14} /> พยากรณ์รายเดือน
                                </h4>
                                <div className="grid gap-2">
                                    {sign.monthly.map((m, i) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60">
                                            <span className="text-xs font-bold text-amber-300 w-16 sm:w-20 flex-shrink-0 pt-0.5">{m.period}</span>
                                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{m.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Work Overview (for signs without monthly) */}
                        {sign.workOverview && (
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                                    <TrendingUp size={14} /> การงาน
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{sign.workOverview}</p>
                            </div>
                        )}

                        {/* Finance */}
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                <Sparkles size={14} /> การเงินและโชคลาภ
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{sign.finance}</p>
                        </div>

                        {/* Love (if exists) */}
                        {sign.love && (
                            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                                <h4 className="text-sm font-bold text-pink-400 mb-2 flex items-center gap-2">
                                    <Heart size={14} /> ความรัก
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{sign.love}</p>
                            </div>
                        )}

                        {/* Health */}
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <h4 className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                                <Shield size={14} /> สุขภาพและการเสริมดวง
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{sign.health}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export function ZodiacHoroscopePage() {
    const navigate = useNavigate();
    const [expandedSigns, setExpandedSigns] = useState(new Set());
    const [activeTab, setActiveTab] = useState('zodiac');
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    usePageSEO({
        title: 'ดูดวงราศี 12 ราศี ปี 2569 แม่นที่สุด',
        description: 'พยากรณ์ดวงชะตา 12 ราศี ประจำปี 2569 วิเคราะห์อิทธิพลดาวประธาน สีมงคลประจำวัน เลขนำโชคตามปีนักษัตร พร้อมพยากรณ์รายเดือน การเงิน ความรัก สุขภาพ',
        keywords: 'ดูดวงราศี, ดวง 12 ราศี 2569, พยากรณ์ดวงชะตา, สีมงคล, เลขนำโชค, โหราศาสตร์ไทย, ดวงรายเดือน',
        ogImage: 'https://satduangdao.com/zodiac-hero.png',
        path: '/zodiac-horoscope',
    });

    const toggleSign = (id) => {
        setExpandedSigns(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const expandAll = () => {
        if (expandedSigns.size === ZODIAC_SIGNS.length) {
            setExpandedSigns(new Set());
        } else {
            setExpandedSigns(new Set(ZODIAC_SIGNS.map(s => s.id)));
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-700 mb-6 shadow-xl">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        กรุณาเข้าสู่ระบบเพื่ออ่านดวง 12 ราศีประจำปี
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Hero Section */}
            <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden">
                <img
                    src={HOROSCOPE_OVERVIEW.heroImage}
                    alt="ดวงดาว"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30" />

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-sm"
                >
                    <ArrowLeft size={16} />
                    กลับหน้าหลัก
                </button>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                                โหราศาสตร์ไทย 2569
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs">
                                อ่าน ~20 นาที
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                            {HOROSCOPE_OVERVIEW.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-amber-400 font-medium">
                            {HOROSCOPE_OVERVIEW.tagline}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* Intro */}
                <section className="mb-10">
                    <div className="bg-slate-900/40 rounded-2xl border border-slate-800/50 p-6 sm:p-8">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base" dangerouslySetInnerHTML={{
                            __html: HOROSCOPE_OVERVIEW.intro.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                        }} />
                    </div>
                </section>

                {/* Planet Analysis */}
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Star className="text-amber-400" size={24} />
                        อิทธิพลของดาวประธาน ปี 2569
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {PLANET_ANALYSIS.map((planet) => (
                            <div
                                key={planet.id}
                                className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-5 hover:border-slate-700/50 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{planet.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{planet.planet}</h3>
                                        <p className="text-xs" style={{ color: planet.color }}>{planet.title}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{
                                    __html: planet.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
                                }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Astro Events Table */}
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Calendar className="text-amber-400" size={24} />
                        เหตุการณ์สำคัญทางดาราศาสตร์พยากรณ์
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-800/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-800/60">
                                    <th className="text-left p-3 sm:p-4 text-amber-400 font-bold text-xs">ปรากฏการณ์</th>
                                    <th className="text-left p-3 sm:p-4 text-amber-400 font-bold text-xs">วันที่</th>
                                    <th className="text-left p-3 sm:p-4 text-amber-400 font-bold text-xs">ตำแหน่ง</th>
                                    <th className="text-left p-3 sm:p-4 text-amber-400 font-bold text-xs hidden sm:table-cell">นัยสำคัญ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ASTRO_EVENTS.map((event, i) => (
                                    <tr key={i} className="border-t border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-3 sm:p-4 text-white font-medium text-xs sm:text-sm">{event.event}</td>
                                        <td className="p-3 sm:p-4 text-slate-400 text-xs sm:text-sm">{event.date}</td>
                                        <td className="p-3 sm:p-4 text-indigo-300 text-xs sm:text-sm">{event.position}</td>
                                        <td className="p-3 sm:p-4 text-slate-500 text-xs hidden sm:table-cell">{event.significance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'zodiac', label: '🔮 12 ราศี', },
                        { id: 'colors', label: '🎨 สีมงคล' },
                        { id: 'numbers', label: '🔢 เลขนำโชค' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                                : 'bg-slate-800/50 border border-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: 12 Zodiac Signs */}
                {activeTab === 'zodiac' && (
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                                วิเคราะห์เจาะลึก 12 ราศี
                            </h2>
                            <button
                                onClick={expandAll}
                                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                            >
                                {expandedSigns.size === ZODIAC_SIGNS.length ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}
                            </button>
                        </div>

                        {/* Quick Nav */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {ZODIAC_SIGNS.map(sign => (
                                <button
                                    key={sign.id}
                                    onClick={() => {
                                        setExpandedSigns(prev => new Set([...prev, sign.id]));
                                        document.getElementById(sign.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105"
                                    style={{
                                        borderColor: `${sign.color}40`,
                                        color: sign.color,
                                        background: `${sign.color}10`,
                                    }}
                                >
                                    <span>{sign.icon}</span>
                                    <span>{sign.nameTh}</span>
                                </button>
                            ))}
                        </div>

                        {ZODIAC_SIGNS.map(sign => (
                            <ZodiacCard
                                key={sign.id}
                                sign={sign}
                                isExpanded={expandedSigns.has(sign.id)}
                                onToggle={() => toggleSign(sign.id)}
                            />
                        ))}
                    </section>
                )}

                {/* Tab: Lucky Colors */}
                {activeTab === 'colors' && (
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                            🎨 สีเสื้อมงคลประจำวัน พ.ศ. 2569
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-800/60">
                                        <th className="text-left p-3 text-amber-400 font-bold text-xs">วัน</th>
                                        <th className="text-left p-3 text-blue-400 font-bold text-xs">การงาน</th>
                                        <th className="text-left p-3 text-emerald-400 font-bold text-xs">โชคลาภ</th>
                                        <th className="text-left p-3 text-yellow-400 font-bold text-xs">การเงิน</th>
                                        <th className="text-left p-3 text-pink-400 font-bold text-xs">เมตตา</th>
                                        <th className="text-left p-3 text-red-400 font-bold text-xs">หลีกเลี่ยง</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {LUCKY_COLORS_BY_DAY.map((row, i) => (
                                        <tr key={i} className="border-t border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-3 text-white font-medium text-xs">{row.day}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.work}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.luck}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.money}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.charm}</td>
                                            <td className="p-3 text-red-400/70 text-xs">{row.avoid}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Tab: Lucky Numbers */}
                {activeTab === 'numbers' && (
                    <section className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                            🔢 เลขมงคลและทิศเสริมโชค ปีนักษัตร
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800/50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-800/60">
                                        <th className="text-left p-3 text-amber-400 font-bold text-xs">ปีนักษัตร</th>
                                        <th className="text-left p-3 text-emerald-400 font-bold text-xs">เลขนำโชค</th>
                                        <th className="text-left p-3 text-blue-400 font-bold text-xs">ทิศมงคล</th>
                                        <th className="text-left p-3 text-pink-400 font-bold text-xs">สีมงคล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {LUCKY_NUMBERS_BY_YEAR.map((row, i) => (
                                        <tr key={i} className="border-t border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-3 text-white font-medium text-xs">{row.year}</td>
                                            <td className="p-3 text-amber-300 font-bold text-sm tracking-wider">{row.numbers}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.direction}</td>
                                            <td className="p-3 text-slate-300 text-xs">{row.colors}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Strategy Groups */}
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                        ยุทธศาสตร์สำหรับแต่ละกลุ่มราศี
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {ZODIAC_GROUPS.map((group, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-5">
                                <div className="text-2xl mb-2">{group.icon}</div>
                                <h3 className="text-sm font-bold text-amber-300 mb-1">{group.name}</h3>
                                <p className="text-xs text-indigo-300 mb-2">{group.signs}</p>
                                <p className="text-xs text-slate-400 leading-relaxed">{group.advice}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Closing */}
                <section className="mb-16">
                    <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 p-8 text-center">
                        <div className="text-4xl mb-4">✨</div>
                        <p className="text-lg sm:text-xl font-medium text-amber-300 leading-relaxed max-w-2xl mx-auto">
                            {CLOSING_MESSAGE}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
