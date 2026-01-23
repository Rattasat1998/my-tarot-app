import React from 'react';
import { getDailyFortune } from '../../data/dailyFortune';

export const DailyFortune = () => {
    const fortune = getDailyFortune();

    return (
        <div className="w-full max-w-xl mx-auto text-center mb-6">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-xl"></div>
                <div className="relative bg-slate-900/40 rounded-2xl p-4 border border-purple-500/20">
                    <div className="text-xs uppercase tracking-widest text-purple-400 mb-2">🔮 คำพยากรณ์วันนี้</div>
                    <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                        {fortune}
                    </p>
                </div>
            </div>
        </div>
    );
};
