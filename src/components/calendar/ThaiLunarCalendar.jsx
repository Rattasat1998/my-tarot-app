import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Bell } from 'lucide-react';
import { getMonthDays, THAI_MONTHS, THAI_DAYS, getThaiLunarDate } from '../../utils/lunarUtils';

export const ThaiLunarCalendar = ({ resetGame, isDark }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const { firstDay, daysInMonth } = getMonthDays(year, month);
    const prevMonthDays = new Date(year, month, 0).getDate();

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const days = [];
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, type: 'prev', date: new Date(year, month - 1, prevMonthDays - i) });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, type: 'current', date: new Date(year, month, i) });
    }
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, type: 'next', date: new Date(year, month + 1, i) });
    }

    const selectedLunarInfo = getThaiLunarDate(selectedDate);

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col items-center mb-8">
                <button onClick={resetGame} className="self-start mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>กลับสู่หน้าหลัก</span>
                </button>
                <h2 className="text-3xl sm:text-4xl font-serif text-yellow-500 mb-6">ปฏิทินจันทรคติไทย</h2>

                {/* Month Tabbar */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center gap-2 min-w-max px-2">
                        {THAI_MONTHS.map((m, idx) => (
                            <button
                                key={m}
                                onClick={() => setCurrentDate(new Date(year, idx, 1))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${month === idx
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"><ChevronLeft size={24} /></button>
                    <div className="flex flex-col items-center gap-1">
                        <div className="text-xl font-medium w-48 text-center">พ.ศ. {year + 543}</div>
                        <button
                            onClick={goToToday}
                            className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-full border border-slate-700 transition-all font-medium"
                        >
                            กลับไปวันนี้
                        </button>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"><ChevronRight size={24} /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-slate-900/40 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl">
                    <div className="grid grid-cols-7 mb-4">
                        {THAI_DAYS.map(day => (
                            <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest py-2">
                                {day.substring(0, 3)}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {days.map((item, idx) => {
                            const lunarInfo = getThaiLunarDate(item.date);
                            const isToday = item.date.toDateString() === new Date().toDateString();
                            const isSelected = item.date.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(item.date)}
                                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${item.type !== 'current' ? 'opacity-20 hover:opacity-40' : 'hover:bg-slate-800'} ${isSelected ? 'bg-purple-600 ring-2 ring-purple-400 text-white shadow-lg shadow-purple-900/50' : isToday ? 'ring-1 ring-slate-700 bg-slate-800/50' : ''}`}
                                >
                                    <span className="text-sm sm:text-lg font-medium">{item.day}</span>
                                    {lunarInfo.isWanPhra && (
                                        <Bell size={10} className={`absolute top-1 right-1 sm:top-2 sm:right-2 ${isSelected ? 'text-yellow-200' : 'text-yellow-500'} animate-pulse`} />
                                    )}
                                    <div className={`text-[8px] sm:text-[10px] mt-1 leading-tight text-center ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                                        {lunarInfo.phase.split(' ')[1]}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/40 p-6 rounded-3xl border border-purple-500/20 shadow-xl">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">ข้อมูลรายละเอียด</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-2xl font-serif text-yellow-500 mb-1">
                                    {selectedDate.getDate()} {THAI_MONTHS[selectedDate.getMonth()]} พ.ศ. {selectedDate.getFullYear() + 543}
                                </div>
                                <div className="text-slate-400 text-sm">วัน{THAI_DAYS[selectedDate.getDay()]}</div>
                            </div>

                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                <div className="text-xs text-slate-500 uppercase mb-2">ปฏิทินจันทรคติ</div>
                                <div className="text-lg text-purple-300 font-medium">{selectedLunarInfo.phase} {selectedLunarInfo.month}</div>
                            </div>

                            {selectedLunarInfo.isWanPhra && (
                                <div className="flex items-center gap-3 p-4 bg-yellow-900/20 rounded-2xl border border-yellow-500/30 animate-pulse">
                                    <Bell className="text-yellow-500" size={24} />
                                    <div>
                                        <div className="text-yellow-100 font-bold">วันพระ</div>
                                        <div className="text-yellow-500/80 text-xs">วันรักษาศีลและทำความดี</div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-slate-300">เหมาะสำหรับการทำบุญ รักษาศีล และเจริญภาวนา</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-slate-300">ช่วงเวลาแห่งการเปลี่ยนผ่านของดวงจันทร์</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 flex-1">
                        <p className="text-xs text-slate-500 leading-relaxed italic text-center">
                            "ขอให้ทุกวันเป็นวันที่ดี มีสติและปัญญาในการดำเนินชีวิต"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
