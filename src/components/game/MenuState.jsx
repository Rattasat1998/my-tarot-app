import React from 'react';
import { Coins, Sparkles, Gift } from 'lucide-react';
import { READING_TOPICS } from '../../constants/readingTopics';
import { getReadingCost } from '../../constants/costs';
import { GoogleAdSlot } from '../ui/GoogleAdSlot';
import { DailyCard } from '../ui/DailyCard';
import { DailyFortune } from '../ui/DailyFortune';
import { ArticlesCarousel } from '../ui/ArticlesCarousel';
import { StatsCounter } from '../ui/StatsCounter';
import { FloatingCards } from '../ui/FloatingCards';
import { AncientWisdom } from '../ui/AncientWisdom';
import { Testimonials } from '../ui/Testimonials';
import { WhyChooseUs } from '../ui/WhyChooseUs';
import { HowItWorks } from '../ui/HowItWorks';

export const MenuState = ({ topic, setTopic, readingType, setReadingType, startReading, isDark, openArticle, credits, isDailyFreeAvailable, openDailyReward }) => (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Floating Cards Background */}
        <FloatingCards />

        {/* Daily Fortune Banner */}
        <DailyFortune />

        {/* Hero Section with Daily Card */}
        <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4">ค้นหาคำตอบจากจิตวิญญาณ</h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
                ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วเลือกหัวข้อเพื่อเริ่มทำนาย
            </p>
        </header>

        {/* Daily Check-in Button */}
        <button
            onClick={openDailyReward}
            className="mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
            <Gift size={20} className="animate-bounce" />
            <span>เช็คอินรายวัน</span>
        </button>

        {/* Topic Selection */}
        <div className="w-full max-w-3xl mx-auto mb-8">
            <h2 className="text-center text-sm uppercase tracking-widest text-slate-500 mb-4">เลือกหัวข้อคำทำนาย</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {READING_TOPICS.map((t) => {
                    const { cost, isDaily } = getReadingCost(t.id);
                    const showFree = isDaily && isDailyFreeAvailable;

                    return (
                        <button
                            key={t.id}
                            onClick={() => setTopic(t.id)}
                            className={`relative p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${topic === t.id
                                ? 'bg-purple-900/30 border-purple-500 text-purple-200 shadow-lg shadow-purple-900/20 scale-105'
                                : isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm ${showFree
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : isDark
                                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                {showFree ? 'FREE' : cost}
                            </span>
                            <span className="text-2xl">{t.icon}</span>
                            <span className="text-sm font-medium">{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Reading Type Selection (Hidden for Daily, Monthly, and Love) */}
        {topic !== 'daily' && topic !== 'monthly' && topic !== 'love' && (
            <div className="w-full flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
                {(() => {
                    const { cost } = getReadingCost(topic);
                    const { cost: celticCost } = getReadingCost('celtic');

                    return (
                        <>
                            <button
                                onClick={() => setReadingType('2-cards')}
                                className={`relative px-6 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === '2-cards' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'bg-slate-900/40 border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span className="font-bold">แบบ 2 ใบ (สรุป)</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === '2-cards' ? 'bg-purple-500/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    ใช้ {cost * 2} เครดิต
                                </span>
                            </button>
                            <button
                                onClick={() => setReadingType('1-card')}
                                className={`relative px-6 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === '1-card' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'bg-slate-900/40 border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span className="font-bold">ใบเดียว (เน้นๆ)</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === '1-card' ? 'bg-purple-500/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    ใช้ {cost} เครดิต
                                </span>
                            </button>
                            <button
                                onClick={() => setReadingType('celtic-cross')}
                                className={`relative px-6 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${readingType === 'celtic-cross' ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-300/50' : isDark ? 'bg-slate-900/40 border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className={readingType === 'celtic-cross' ? 'text-white' : 'text-amber-500'} />
                                    <span className="font-bold">Celtic Cross (10 ใบ)</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${readingType === 'celtic-cross' ? 'bg-amber-500/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    ใช้ {celticCost} เครดิต (จัดเต็ม)
                                </span>
                            </button>
                        </>
                    );
                })()}
            </div>
        )}

        {/* Description of Selected Topic */}
        {topic && (
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm sm:text-base text-purple-300 font-medium italic max-w-md mx-auto px-4">
                    "{READING_TOPICS.find(t => t.id === topic)?.description}"
                </p>
            </div>
        )}

        {/* Start Button */}
        {/* Start Button */}
        {(() => {
            const { cost: baseCost, isDaily } = topic ? getReadingCost(topic) : { cost: 0, isDaily: false };
            // Adjust cost based on readingType
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
                <button
                    onClick={() => startReading(cost, readingType)}
                    disabled={isDisabled}
                    className={`group relative w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl transition-all shadow-xl flex flex-col items-center gap-1 ${isDisabled
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/20'
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
                    </span>

                    {topic && (
                        <span className="text-xs sm:text-sm font-normal opacity-90 flex items-center gap-1.5">
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
            );
        })()}

        {/* Stats Counter */}
        <div className="mt-12 w-full">
            <StatsCounter />
        </div>

        {/* Ancient Wisdom Section */}
        <div className="mt-16 w-full">
            <AncientWisdom openArticle={openArticle} />
        </div>

        {/* Testimonials */}
        <div className="mt-16 w-full">
            <Testimonials />
        </div>

        {/* How It Works */}
        <div className="mt-16 w-full">
            <HowItWorks />
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 w-full">
            <WhyChooseUs />
        </div>

        {/* Featured Articles Carousel */}
        {openArticle && (
            <div className="mt-16 w-full">
                <ArticlesCarousel openArticle={openArticle} />
            </div>
        )}

        <GoogleAdSlot className="mt-12" />
    </div>
);

