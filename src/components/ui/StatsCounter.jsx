import React, { useEffect, useState } from 'react';
import { Eye, Layers, Calendar } from 'lucide-react';
import { getStats } from '../../data/dailyFortune';

export const StatsCounter = () => {
    const [stats, setStats] = useState({ totalReadings: 0, cardsRevealed: 0, activeDays: 0 });
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setStats(getStats());
        setTimeout(() => setAnimated(true), 100);
    }, []);

    const counters = [
        { icon: Eye, label: 'การทำนาย', value: stats.totalReadings, suffix: '+' },
        { icon: Layers, label: 'ไพ่ที่เปิด', value: stats.cardsRevealed, suffix: '+' },
        { icon: Calendar, label: 'วันที่ให้บริการ', value: stats.activeDays, suffix: '' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
                {counters.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 text-center hover:border-purple-500/30 transition-all group"
                    >
                        <item.icon className="w-5 h-5 mx-auto mb-2 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        <div className={`text-2xl font-bold text-white transition-all duration-1000 ${animated ? 'opacity-100' : 'opacity-0'}`}>
                            {animated ? item.value.toLocaleString() : 0}{item.suffix}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
