import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Calendar, Gift, Building2 } from 'lucide-react';
import { getMonthDays, THAI_MONTHS, THAI_DAYS } from '../../utils/lunarUtils';
import { ALL_HOLIDAYS_2026, getUpcomingHolidays, isHoliday } from '../../data/holidays';

export const BankHolidaysCalendar = ({ resetGame, isDark }) => {
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
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, type: 'prev', date: new Date(year, month - 1, prevMonthDays - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, type: 'current', date: new Date(year, month, i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, type: 'next', date: new Date(year, month + 1, i) });
    }

    const selectedHoliday = isHoliday(selectedDate);
    const upcomingHolidays = getUpcomingHolidays(new Date(), 6);

    // Get holidays for current month
    const monthHolidays = ALL_HOLIDAYS_2026.filter(h => {
        const hDate = new Date(h.date);
        return hDate.getMonth() === month && hDate.getFullYear() === year;
    });

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col items-center mb-8">
                <button onClick={resetGame} className="self-start mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>กลับสู่หน้าหลัก</span>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <Building2 className="text-yellow-500" size={32} />
                    <h2 className="text-3xl sm:text-4xl font-serif text-yellow-500">วันหยุดราชการ & ธนาคาร</h2>
                </div>
                <p className="text-slate-400 text-sm">ปฏิทินวันหยุดราชการและวันหยุดธนาคาร ปี พ.ศ.2569</p>

                {/* Month Tabbar */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide mt-6">
                    <div className="flex items-center gap-2 min-w-max px-2">
                        {THAI_MONTHS.map((m, idx) => (
                            <button
                                key={m}
                                onClick={() => setCurrentDate(new Date(year, idx, 1))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${month === idx
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
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
                            className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-full border border-slate-700 transition-all font-medium"
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
                            const holiday = isHoliday(item.date);
                            const isToday = item.date.toDateString() === new Date().toDateString();
                            const isSelected = item.date.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(item.date)}
                                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${item.type !== 'current' ? 'opacity-20 hover:opacity-40' : 'hover:bg-slate-800'} ${isSelected ? 'bg-emerald-600 ring-2 ring-emerald-400 text-white shadow-lg shadow-emerald-900/50' : isToday ? 'ring-1 ring-slate-700 bg-slate-800/50' : ''} ${holiday && !isSelected ? 'bg-red-900/30 text-red-300' : ''}`}
                                >
                                    <span className="text-sm sm:text-lg font-medium">{item.day}</span>
                                    {holiday && (
                                        <Gift size={10} className={`absolute top-1 right-1 sm:top-2 sm:right-2 ${isSelected ? 'text-yellow-200' : 'text-red-400'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Month Holidays List */}
                    {monthHolidays.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <h4 className="text-sm font-bold text-slate-400 mb-3">วันหยุดในเดือนนี้</h4>
                            <div className="space-y-2">
                                {monthHolidays.map((h, idx) => {
                                    const hDate = new Date(h.date);
                                    return (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                                            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-bold text-sm">
                                                {hDate.getDate()}
                                            </div>
                                            <div>
                                                <div className="text-sm text-white">{h.name}</div>
                                                <div className="text-xs text-slate-500">
                                                    {h.type === 'buddhist' ? 'วันสำคัญทางพุทธศาสนา' : h.type === 'bank' ? 'วันหยุดธนาคาร' : 'วันหยุดราชการ'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <div className="flex flex-col gap-4">
                    {/* Selected Date Info */}
                    <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900/20 to-slate-900/40 p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">วันที่เลือก</h3>
                        <div className="text-2xl font-serif text-yellow-500 mb-1">
                            {selectedDate.getDate()} {THAI_MONTHS[selectedDate.getMonth()]} พ.ศ. {selectedDate.getFullYear() + 543}
                        </div>
                        <div className="text-slate-400 text-sm mb-4">วัน{THAI_DAYS[selectedDate.getDay()]}</div>

                        {selectedHoliday ? (
                            <div className="p-4 bg-red-900/30 rounded-2xl border border-red-500/30">
                                <div className="flex items-center gap-3">
                                    <Gift className="text-red-400" size={24} />
                                    <div>
                                        <div className="text-red-100 font-bold">{selectedHoliday.name}</div>
                                        <div className="text-red-400/80 text-xs">
                                            {selectedHoliday.type === 'buddhist' ? 'วันสำคัญทางพุทธศาสนา' : selectedHoliday.type === 'bank' ? 'วันหยุดธนาคาร' : 'วันหยุดราชการ'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                                <div className="text-slate-400 text-sm text-center">ไม่มีวันหยุดในวันนี้</div>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Holidays */}
                    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex-1">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                            <Calendar size={14} />
                            วันหยุดที่กำลังจะมาถึง
                        </h3>
                        <div className="space-y-3">
                            {upcomingHolidays.map((h, idx) => {
                                const hDate = new Date(h.date);
                                const daysUntil = Math.ceil((hDate - new Date()) / (1000 * 60 * 60 * 24));
                                return (
                                    <div key={idx} className="flex items-center gap-3 group">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                                            <div className="text-xs text-slate-500">{THAI_MONTHS[hDate.getMonth()].substring(0, 3)}</div>
                                            <div className="text-lg font-bold text-white">{hDate.getDate()}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-white truncate">{h.name}</div>
                                            <div className="text-xs text-emerald-400">อีก {daysUntil} วัน</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
