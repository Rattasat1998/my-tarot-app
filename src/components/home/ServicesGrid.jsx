import React, { useRef } from 'react';
import { Sparkles, Coins, ArrowRight } from 'lucide-react';
import { READING_TOPICS } from '../../constants/readingTopics';
import { getReadingCost } from '../../constants/costs';

export const ServicesGrid = ({
    topic,
    setTopic,
    readingType,
    setReadingType,
    startReading,
    isDark,
    credits,
    isDailyFreeAvailable
}) => {
    const readingRef = useRef(null);

    const handleSelectTopic = (topicId) => {
        setTopic(topicId);
        // Scroll to reading options
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
        <section className="w-full py-16 sm:py-20" id="services">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-5">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-xs uppercase tracking-[0.15em]">บริการของเรา</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white mb-3">
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
                            <h3 className={`font-bold text-sm ${isActive ? 'text-purple-200' : 'text-slate-900 dark:text-white'}`}>
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
                                                <Sparkles size={16} className={readingType === 'celtic-cross' ? 'text-slate-900 dark:text-white' : 'text-amber-500'} />
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
                        } else if (readingType === '2-cards' && topic !== 'monthly') {
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
        </section>
    );
};
