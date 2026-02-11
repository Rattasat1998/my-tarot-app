import React, { useState, useRef } from 'react';
import { Sparkles, Eye, RotateCcw, Gift, ChevronDown, Users, Clock, Award, Coins, ArrowRight } from 'lucide-react';
import { getDailyFortune, getDailyCard } from '../../data/dailyFortune';
import { TAROT_CARDS } from '../../data/tarotCards';
import { READING_TOPICS } from '../../constants/readingTopics';
import { getReadingCost } from '../../constants/costs';

export const HeroSection = ({
    openDailyReward,
    topic,
    setTopic,
    readingType,
    setReadingType,
    startReading,
    isDark,
    credits,
    isDailyFreeAvailable
}) => {
    const fortune = getDailyFortune();
    const card = getDailyCard(TAROT_CARDS);
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const readingRef = useRef(null);

    const handleSelectTopic = (topicId) => {
        setTopic(topicId);
        setTimeout(() => {
            readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    // Service descriptions for topics
    const descriptions = {
        daily: 'ดูดวงรายวันของคุณ พร้อมคำแนะนำเริ่มต้นวันใหม่',
        love: 'ค้นหาคำตอบเรื่องความรัก คู่ครอง และความสัมพันธ์',
        work: 'ดวงการงาน อาชีพ และเส้นทางความสำเร็จ',
        finance: 'วิเคราะห์ดวงการเงิน โชคลาภ และการลงทุน',
        health: 'สุขภาพกายและใจ คำแนะนำเพื่อชีวิตที่สมดุล',
        fortune: 'ดวงชะตาโดยรวม โอกาส และสิ่งที่รออยู่ข้างหน้า',
        social: 'ความสัมพันธ์กับคนรอบข้าง มิตรภาพ และครอบครัว',
        monthly: 'ดวงรายเดือน ภาพรวมทั้งเดือนแบบเจาะลึก'
    };

    return (
        <section className="relative w-full flex flex-col items-center overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
            {/* ═══════════════════════════════════ */}
            {/* MYSTIC ANIMATED BACKGROUND */}
            {/* ═══════════════════════════════════ */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Zodiac circle - slow rotating */}
                <div className="absolute top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-[0.04]">
                    <div className="w-full h-full rounded-full border-2 border-purple-400 animate-spin-slow" />
                    <div className="absolute inset-8 rounded-full border border-indigo-400 animate-spin-slower" />
                    <div className="absolute inset-16 rounded-full border border-purple-300 animate-spin-reverse-slower" />
                </div>
                {/* Radial glow */}
                <div className="absolute top-[30vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] glow-pulse" />
                <div className="absolute top-[20vh] left-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-[80px] glow-pulse delay-1000" />
                <div className="absolute top-[50vh] right-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-[90px] glow-pulse delay-2000" />

                {/* Floating zodiac symbols */}
                {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((symbol, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const radius = 42;
                    const top = 35 + radius * Math.sin(angle) * 0.6;
                    const left = 50 + radius * Math.cos(angle);
                    return (
                        <span
                            key={i}
                            className="absolute text-purple-400/10 text-lg font-serif animate-pulse hidden sm:block"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                animationDelay: `${i * 0.3}s`
                            }}
                        >
                            {symbol}
                        </span>
                    );
                })}
            </div>

            {/* ═══════════════════════════════════ */}
            {/* HERO CONTENT */}
            {/* ═══════════════════════════════════ */}
            <div className="relative z-10 text-center max-w-4xl mx-auto pt-8 sm:pt-12 pb-12">
                {/* Online Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-purple-300 text-xs uppercase tracking-[0.2em] font-medium">ออนไลน์ • พร้อมให้บริการ 24 ชั่วโมง</span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                        ศาสตร์ดวงดาว
                    </span>
                    <br />
                    <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-normal">
                        ดูดวงไพ่ทาโรต์ออนไลน์ แม่นที่สุด
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                    ค้นหาคำตอบจากจิตวิญญาณด้วยไพ่ทาโรต์ 78 ใบ
                    <br className="hidden sm:block" />
                    ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วให้ไพ่นำทางคุณ
                </p>

                {/* Daily Fortune Card */}
                <div className="relative max-w-xl mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent blur-xl" />
                    <div className="relative bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/15 shadow-xl shadow-purple-900/10">
                        <div className="text-xs uppercase tracking-widest text-purple-400 mb-3 flex items-center justify-center gap-2">
                            <Sparkles size={12} className="text-yellow-400" />
                            คำพยากรณ์วันนี้
                            <Sparkles size={12} className="text-yellow-400" />
                        </div>
                        <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                            {fortune}
                        </p>
                    </div>
                </div>

                {/* Daily Card Preview */}
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-slate-700" />
                        ไพ่ประจำวันของคุณ
                        <span className="w-8 h-px bg-slate-700" />
                    </p>
                    <div className="relative inline-block">
                        <div
                            className="relative mx-auto w-28 h-44 sm:w-32 sm:h-48 cursor-pointer transition-all duration-700"
                            onClick={() => setIsCardRevealed(!isCardRevealed)}
                        >
                            {/* Card Back */}
                            <div className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-2xl shadow-purple-900/30 transition-all duration-500 ${isCardRevealed ? 'opacity-0 scale-90' : 'opacity-100 hover:scale-105 hover:shadow-purple-500/30'}`}>
                                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
                                    <div className="text-4xl animate-pulse">🔮</div>
                                </div>
                            </div>
                            {/* Card Front */}
                            <div className={`absolute inset-0 rounded-xl overflow-hidden border-2 border-yellow-500/40 shadow-2xl shadow-yellow-900/20 transition-all duration-500 ${isCardRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                {card.image ? (
                                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-amber-900 to-yellow-900 flex items-center justify-center text-white font-serif text-sm p-2 text-center">
                                        {card.name}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Glow */}
                        <div className={`absolute inset-0 w-28 h-44 sm:w-32 sm:h-48 rounded-xl mx-auto transition-all duration-500 pointer-events-none ${isCardRevealed ? 'bg-yellow-500/15 blur-xl' : 'bg-purple-500/15 blur-xl'}`} />
                    </div>
                    <div className="mt-3 min-h-[60px]">
                        {isCardRevealed ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <h4 className="text-base font-serif text-yellow-400 mb-1">{card.name}</h4>
                                <p className="text-xs text-slate-400 mb-2">{card.meaning || card.keywords?.upright?.slice(0, 3).join(' • ')}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsCardRevealed(false); }}
                                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto"
                                >
                                    <RotateCcw size={12} /> ซ่อนไพ่
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCardRevealed(true)}
                                className="text-sm text-purple-300 hover:text-white transition-colors flex items-center gap-2 mx-auto group"
                            >
                                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                                แตะเพื่อเปิดไพ่ประจำวัน
                            </button>
                        )}
                    </div>
                </div>

                {/* Check-in Button */}
                <button
                    onClick={openDailyReward}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-400 font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto mb-10"
                >
                    <Gift size={18} className="animate-bounce" />
                    เช็คอินรายวัน รับเครดิตฟรี
                </button>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users size={18} className="text-blue-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-base">10,000+</div>
                            <div className="text-xs text-slate-500">ผู้ใช้งาน</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Award size={18} className="text-purple-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-base">78 ใบ</div>
                            <div className="text-xs text-slate-500">ไพ่ทาโรต์ครบชุด</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Clock size={18} className="text-green-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-base">24/7</div>
                            <div className="text-xs text-slate-500">พร้อมให้บริการ</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════ */}
            {/* DIVIDER */}
            {/* ═══════════════════════════════════ */}
            <div className="relative z-10 w-full max-w-md mx-auto flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30" />
                <Sparkles size={16} className="text-purple-500/40" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
            </div>

            {/* ═══════════════════════════════════ */}
            {/* SERVICES GRID */}
            {/* ═══════════════════════════════════ */}
            <div className="relative z-10 w-full py-12 sm:py-16" id="services">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-5">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-purple-300 text-xs uppercase tracking-[0.15em]">บริการของเรา</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">
                        เลือก<span className="text-purple-400">หัวข้อ</span>ที่ต้องการคำทำนาย
                    </h2>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto">
                        ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วเลือกหัวข้อเพื่อเริ่มทำนาย
                    </p>
                </div>

                {/* Services Grid */}
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {READING_TOPICS.map((t) => {
                        const { cost, isDaily } = getReadingCost(t.id);
                        const showFree = isDaily && isDailyFreeAvailable;
                        const isActive = topic === t.id;

                        return (
                            <button
                                key={t.id}
                                onClick={() => handleSelectTopic(t.id)}
                                className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 text-center ${isActive
                                    ? 'bg-purple-500/15 border-purple-500/50 scale-[1.03] shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/30'
                                    : 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700 hover:scale-105'
                                    }`}
                            >
                                {/* Price Badge */}
                                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold ${showFree
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : isActive
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                                    }`}>
                                    {showFree ? '✨ FREE' : `${cost} เครดิต`}
                                </span>

                                {/* Icon */}
                                <div className={`text-3xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {t.icon}
                                </div>

                                {/* Title */}
                                <h3 className={`font-bold text-sm ${isActive ? 'text-purple-200' : 'text-white'}`}>
                                    {t.label}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                    {descriptions[t.id] || t.description}
                                </p>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Reading Options (shown when topic selected) */}
                {topic && (
                    <div ref={readingRef} className="max-w-3xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Selected Topic Description */}
                        <div className="text-center mb-6">
                            <p className="text-sm text-purple-300 font-medium italic">
                                "{READING_TOPICS.find(t => t.id === topic)?.description}"
                            </p>
                        </div>

                        {/* Reading Type Selection */}
                        {topic !== 'daily' && topic !== 'monthly' && topic !== 'love' && (
                            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 flex-wrap">
                                {(() => {
                                    const { cost } = getReadingCost(topic);
                                    const { cost: celticCost } = getReadingCost('celtic');

                                    return (
                                        <>
                                            <button
                                                onClick={() => setReadingType('2-cards')}
                                                className={`relative px-6 py-3.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === '2-cards'
                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600'
                                                    }`}
                                            >
                                                <span className="font-bold">แบบ 2 ใบ (สรุป)</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === '2-cards' ? 'bg-purple-500/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                    ใช้ {cost * 2} เครดิต
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setReadingType('1-card')}
                                                className={`relative px-6 py-3.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === '1-card'
                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600'
                                                    }`}
                                            >
                                                <span className="font-bold">ใบเดียว (เน้นๆ)</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === '1-card' ? 'bg-purple-500/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                    ใช้ {cost} เครดิต
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setReadingType('celtic-cross')}
                                                className={`relative px-6 py-3.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === 'celtic-cross'
                                                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-300/50'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800/60 hover:border-slate-600'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Sparkles size={16} className={readingType === 'celtic-cross' ? 'text-white' : 'text-amber-500'} />
                                                    <span className="font-bold">Celtic Cross (10 ใบ)</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === 'celtic-cross' ? 'bg-amber-500/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                    ใช้ {celticCost} เครดิต (จัดเต็ม)
                                                </span>
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Start Button */}
                        {(() => {
                            const { cost: baseCost, isDaily } = topic ? getReadingCost(topic) : { cost: 0, isDaily: false };
                            let cost = baseCost;
                            if (readingType === 'celtic-cross') {
                                cost = getReadingCost('celtic').cost;
                            } else if (readingType === '2-cards') {
                                cost = baseCost * 2;
                            }
                            const isFreeDaily = isDaily && isDailyFreeAvailable;
                            const canAfford = isFreeDaily || credits >= cost;
                            const isDisabled = !topic || !canAfford;

                            return (
                                <div className="text-center">
                                    <button
                                        onClick={() => startReading(cost, readingType)}
                                        disabled={isDisabled}
                                        className={`group relative px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl flex flex-col items-center gap-1 mx-auto ${isDisabled
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/25 hover:shadow-purple-500/40'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isDisabled && !topic ? 'เลือกหัวข้อก่อน' :
                                                isDisabled && !canAfford ? 'เครดิตไม่พอ' :
                                                    'เริ่มต้นทำนาย'}
                                            {topic && isFreeDaily && (
                                                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold animate-bounce">
                                                    FREE
                                                </span>
                                            )}
                                            {!isDisabled && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                        </span>

                                        {topic && (
                                            <span className="text-xs font-normal opacity-90 flex items-center gap-1.5">
                                                {isFreeDaily ? (
                                                    <>
                                                        <Sparkles size={14} className="text-yellow-300" />
                                                        <span>ใช้สิทธิ์สุ่มฟรี (เก็บแล้ว)</span>
                                                    </>
                                                ) : canAfford ? (
                                                    <>
                                                        <Coins size={14} className="text-amber-300" />
                                                        <span>ใช้ {cost} เครดิต (มี {credits})</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Coins size={14} className="text-slate-300" />
                                                        <span>เครดิตไม่พอ (ต้องการ {cost})</span>
                                                    </>
                                                )}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </section>
    );
};
