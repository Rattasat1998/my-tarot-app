import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Layers } from 'lucide-react';
import { CALENDAR_CATEGORIES } from '../../constants/readingTopics';

export const CalendarDropdown = ({ isDark, openCalendar }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isOpen ? 'bg-purple-900/30 border-purple-500 text-purple-200' : 'border-slate-800 text-slate-400 hover:text-white'}`}
            >
                <Calendar size={20} />
                <span className="hidden sm:inline font-medium text-sm">ปฏิทิน</span>
                <Layers size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-2 mb-3 border-b border-slate-800">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">เมนูหลัก</div>
                        <div className="text-lg font-serif text-purple-300">ปฏิทิน พ.ศ.2569</div>
                    </div>
                    <div className="space-y-1">
                        {CALENDAR_CATEGORIES.map((item) => (
                            <button
                                key={item.id}
                                className="w-full text-left px-5 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3"
                                onClick={() => {
                                    setIsOpen(false);
                                    openCalendar(item.id);
                                }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
