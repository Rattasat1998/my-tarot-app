import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const MeditationDialog = ({ isOpen, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(5);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-1000"></div>

            <div className="relative w-full max-w-lg text-center animate-in mb-12">
                {/* Mystic Circle Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
                    <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-8 border border-white/5 rounded-full animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-8">
                    <div className="w-32 h-32 mx-auto relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[50px] animate-pulse"></div>
                        <Sparkles
                            size={128}
                            className="text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse mx-auto"
                            strokeWidth={1}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 animate-pulse">
                            กรุณาตั้งจิตอธิษฐาน
                        </h2>
                        <p className="text-purple-200/60 text-lg tracking-wider font-light">
                            รวบรวมสมาธิ... เชื่อมต่อกับพลังงานจักรวาล
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full transition-all duration-500 ${i < (5 - timeLeft)
                                        ? 'bg-purple-400 scale-110 shadow-[0_0_10px_rgba(192,132,252,0.8)]'
                                        : 'bg-slate-800'
                                    }`}
                            />
                        ))}
                    </div>

                    <p className="text-slate-500 text-sm mt-4">
                        กำลังเปิดเผยคำทำนายใน {timeLeft}...
                    </p>
                </div>
            </div>
        </div>
    );
};
