import React from 'react';
import { READING_TOPICS } from '../../constants/readingTopics';
import { GoogleAdSlot } from '../ui/GoogleAdSlot';

export const MenuState = ({ topic, setTopic, readingType, setReadingType, startReading, isDark }) => (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4">ค้นหาคำตอบจากจิตวิญญาณ</h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
                ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วเลือกหัวข้อเพื่อเริ่มทำนาย
            </p>
        </header>

        {/* Topic Selection */}
        <div className="w-full max-w-3xl mx-auto mb-8">
            <h2 className="text-center text-sm uppercase tracking-widest text-slate-500 mb-4">เลือกหัวข้อคำทำนาย</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {READING_TOPICS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTopic(t.id)}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${topic === t.id
                            ? 'bg-purple-900/30 border-purple-500 text-purple-200 shadow-lg shadow-purple-900/20 scale-105'
                            : isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-sm font-medium">{t.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Reading Type Selection (Hidden for Daily, Monthly, and Love) */}
        {topic !== 'daily' && topic !== 'monthly' && topic !== 'love' && (
            <div className="w-full flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10">
                <button
                    onClick={() => setReadingType('2-cards')}
                    className={`px-6 py-2 rounded-full border transition-all ${readingType === '2-cards' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'border-slate-300 text-slate-700 hover:bg-slate-200/70'}`}
                >
                    แบบ 2 ใบ (อดีต/ปัจจุบัน)
                </button>
                <button
                    onClick={() => setReadingType('1-card')}
                    className={`px-6 py-2 rounded-full border transition-all ${readingType === '1-card' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'border-slate-300 text-slate-700 hover:bg-slate-200/70'}`}
                >
                    ใบเดียว
                </button>
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
        <button
            onClick={startReading}
            disabled={!topic}
            className={`group relative w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl transition-all shadow-xl ${topic
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
        >
            เริ่มต้นทำนาย
        </button>

        <GoogleAdSlot className="mt-12" />
    </div>
);
