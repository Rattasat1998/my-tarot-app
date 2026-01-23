import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Star, Moon, Sun } from 'lucide-react';
import { getMonthDays, THAI_MONTHS, THAI_DAYS, getThaiLunarDate } from '../../utils/lunarUtils';

const getAuspiciousInfo = (date) => {
    const dayOfWeek = date.getDay();
    const lunarInfo = getThaiLunarDate(date);
    const phaseNum = parseInt(lunarInfo.phase.match(/\d+/)?.[0] || '0');
    const isWaxing = lunarInfo.phase.includes('ขึ้น');

    const auspiciousActivities = {
        0: { name: 'อาทิตย์', color: 'text-red-400', good: ['เริ่มต้นสิ่งใหม่', 'งานเกี่ยวกับผู้ใหญ่'], avoid: ['ทำนิติกรรม'] },
        1: { name: 'จันทร์', color: 'text-yellow-200', good: ['เดินทาง', 'งานสร้างสรรค์'], avoid: ['ขึ้นบ้านใหม่'] },
        2: { name: 'อังคาร', color: 'text-pink-400', good: ['งานต่อสู้', 'ใช้พลังงาน'], avoid: ['แต่งงาน'] },
        3: { name: 'พุธ', color: 'text-green-400', good: ['การศึกษา', 'การสื่อสาร'], avoid: ['เริ่มงานใหญ่'] },
        4: { name: 'พฤหัสบดี', color: 'text-orange-400', good: ['ทำบุญ', 'เรื่องการเงิน'], avoid: [] },
        5: { name: 'ศุกร์', color: 'text-sky-400', good: ['แต่งงาน', 'ความรัก'], avoid: ['ผ่าตัด'] },
        6: { name: 'เสาร์', color: 'text-purple-400', good: ['สร้างบ้าน', 'งานหนัก'], avoid: ['เดินทางไกล'] },
    };

    let score = 50;
    if (isWaxing && phaseNum <= 8) score += 20;
    if (lunarInfo.isWanPhra) score += 15;
    if (dayOfWeek === 4) score += 10;

    return { dayInfo: auspiciousActivities[dayOfWeek], score: Math.min(100, score), lunarPhase: lunarInfo.phase, isWaxing };
};

export const AuspiciousCalendar = ({ resetGame }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const { firstDay, daysInMonth } = getMonthDays(year, month);
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, type: 'prev', date: new Date(year, month - 1, prevMonthDays - i) });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, type: 'current', date: new Date(year, month, i) });
    for (let i = 1; i <= 42 - days.length; i++) days.push({ day: i, type: 'next', date: new Date(year, month + 1, i) });

    const selectedAuspicious = getAuspiciousInfo(selectedDate);

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col items-center mb-8">
                <button onClick={resetGame} className="self-start mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /><span>กลับสู่หน้าหลัก</span>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-yellow-500" size={32} />
                    <h2 className="text-3xl sm:text-4xl font-serif text-yellow-500">ปฏิทินฤกษ์มงคล</h2>
                </div>
                <p className="text-slate-400 text-sm">วันพระ ฤกษ์ดี และกิจกรรมเหมาะสมในแต่ละวัน</p>
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide mt-6">
                    <div className="flex items-center gap-2 min-w-max px-2">
                        {THAI_MONTHS.map((m, idx) => (
                            <button key={m} onClick={() => setCurrentDate(new Date(year, idx, 1))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${month === idx ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800'}`}>
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-6">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-800 rounded-full"><ChevronLeft size={24} /></button>
                    <div className="text-xl font-medium w-48 text-center">พ.ศ. {year + 543}</div>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-800 rounded-full"><ChevronRight size={24} /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 p-4 sm:p-6 rounded-3xl border border-slate-800">
                    <div className="grid grid-cols-7 mb-4">
                        {THAI_DAYS.map(day => <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">{day.substring(0, 3)}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {days.map((item, idx) => {
                            const auspicious = getAuspiciousInfo(item.date);
                            const isSelected = item.date.toDateString() === selectedDate.toDateString();
                            const scoreColor = auspicious.score >= 70 ? 'bg-green-900/30' : auspicious.score >= 50 ? 'bg-yellow-900/20' : '';
                            return (
                                <button key={idx} onClick={() => setSelectedDate(item.date)}
                                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${item.type !== 'current' ? 'opacity-20' : ''} ${isSelected ? 'bg-gradient-to-br from-yellow-600 to-orange-600 ring-2 ring-yellow-400 text-white' : scoreColor}`}>
                                    <span className="text-sm sm:text-lg font-medium">{item.day}</span>
                                    {auspicious.score >= 70 && !isSelected && <Star size={8} className="absolute top-1 right-1 text-green-400" fill="currentColor" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900/40 p-6 rounded-3xl border border-yellow-500/20">
                        <h3 className="text-slate-400 text-xs uppercase mb-4 font-bold">ฤกษ์ประจำวัน</h3>
                        <div className="text-2xl font-serif text-yellow-500 mb-1">{selectedDate.getDate()} {THAI_MONTHS[selectedDate.getMonth()]} พ.ศ. {selectedDate.getFullYear() + 543}</div>
                        <div className={`text-lg font-medium ${selectedAuspicious.dayInfo.color}`}>วัน{selectedAuspicious.dayInfo.name}</div>
                        <div className="mt-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                            <div className="flex justify-between mb-2"><span className="text-xs text-slate-500">คะแนนฤกษ์</span><span className={`text-lg font-bold ${selectedAuspicious.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>{selectedAuspicious.score}/100</span></div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${selectedAuspicious.score >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${selectedAuspicious.score}%` }} /></div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 p-3 bg-slate-800/50 rounded-xl">
                            {selectedAuspicious.isWaxing ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-400" />}
                            <span className="text-sm text-slate-300">{selectedAuspicious.lunarPhase}</span>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800">
                        <h4 className="text-xs text-green-400 uppercase mb-3 font-bold">กิจกรรมเหมาะสม</h4>
                        {selectedAuspicious.dayInfo.good.map((a, i) => <div key={i} className="flex items-center gap-2 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{a}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};
