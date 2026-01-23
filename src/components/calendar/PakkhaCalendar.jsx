import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Moon } from 'lucide-react';
import { getMonthDays, THAI_MONTHS, THAI_DAYS, getThaiLunarDate } from '../../utils/lunarUtils';

export const PakkhaCalendar = ({ resetGame }) => {
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

    const selectedLunarInfo = getThaiLunarDate(selectedDate);

    // วันอุโบสถ (วันพระ) ในเดือน
    const uposathaDays = days.filter(d => d.type === 'current' && getThaiLunarDate(d.date).isWanPhra);

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col items-center mb-8">
                <button onClick={resetGame} className="self-start mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /><span>กลับสู่หน้าหลัก</span>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📿</span>
                    <h2 className="text-3xl sm:text-4xl font-serif text-yellow-500">ปฏิทินปักขคณนา</h2>
                </div>
                <p className="text-slate-400 text-sm">วันอุโบสถ ปาติโมกข์ และการนับปักข์ตามหลักพุทธศาสนา</p>

                <div className="w-full overflow-x-auto pb-2 scrollbar-hide mt-6">
                    <div className="flex items-center gap-2 min-w-max px-2">
                        {THAI_MONTHS.map((m, idx) => (
                            <button key={m} onClick={() => setCurrentDate(new Date(year, idx, 1))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${month === idx ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800'}`}>
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
                            const lunarInfo = getThaiLunarDate(item.date);
                            const isSelected = item.date.toDateString() === selectedDate.toDateString();
                            return (
                                <button key={idx} onClick={() => setSelectedDate(item.date)}
                                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${item.type !== 'current' ? 'opacity-20' : ''} ${isSelected ? 'bg-indigo-600 ring-2 ring-indigo-400 text-white' : lunarInfo.isWanPhra ? 'bg-indigo-900/30' : 'hover:bg-slate-800'}`}>
                                    <span className="text-sm sm:text-lg font-medium">{item.day}</span>
                                    {lunarInfo.isWanPhra && <Moon size={8} className={`absolute top-1 right-1 ${isSelected ? 'text-yellow-200' : 'text-indigo-400'}`} />}
                                    <div className={`text-[8px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{lunarInfo.phase.split(' ')[1]}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Uposatha List */}
                    {uposathaDays.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <h4 className="text-sm font-bold text-indigo-400 mb-3">วันอุโบสถในเดือนนี้ ({uposathaDays.length} วัน)</h4>
                            <div className="flex flex-wrap gap-2">
                                {uposathaDays.map((d, idx) => (
                                    <button key={idx} onClick={() => setSelectedDate(d.date)}
                                        className="px-3 py-2 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-lg border border-indigo-500/20">
                                        <div className="text-lg font-bold text-indigo-400">{d.day}</div>
                                        <div className="text-[10px] text-slate-400">{getThaiLunarDate(d.date).phase.split(' ')[1]}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 p-6 rounded-3xl border border-indigo-500/20">
                        <h3 className="text-slate-400 text-xs uppercase mb-4 font-bold">ข้อมูลปักขคณนา</h3>
                        <div className="text-2xl font-serif text-yellow-500 mb-1">{selectedDate.getDate()} {THAI_MONTHS[selectedDate.getMonth()]} พ.ศ. {selectedDate.getFullYear() + 543}</div>
                        <div className="p-4 mt-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase mb-2">จันทรคติ</div>
                            <div className="text-lg text-indigo-300 font-medium">{selectedLunarInfo.phase} {selectedLunarInfo.month}</div>
                        </div>
                        {selectedLunarInfo.isWanPhra && (
                            <div className="mt-4 p-4 bg-indigo-900/30 rounded-2xl border border-indigo-500/30 animate-pulse">
                                <div className="text-indigo-100 font-bold">วันอุโบสถ</div>
                                <div className="text-indigo-400/80 text-xs">วันสวดปาติโมกข์ของพระสงฆ์</div>
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 flex-1">
                        <h4 className="text-xs text-indigo-400 uppercase mb-3 font-bold">ความหมายวันอุโบสถ</h4>
                        <div className="space-y-3 text-sm text-slate-300">
                            <p>• วันอุโบสถ คือ วันพระ เป็นวันที่พระสงฆ์สวดปาติโมกข์</p>
                            <p>• ทุกกึ่งเดือน (ขึ้น 15 ค่ำ และแรม 15 ค่ำ)</p>
                            <p>• เป็นวันสำหรับฆราวาสรักษาศีล 8</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
