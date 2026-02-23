import React from 'react';
import { Sparkles, ArrowRight, Shuffle } from 'lucide-react';

export const QuickDrawButton = ({ onStartReading, isDark }) => {
    const handleQuickDraw = () => {
        // Auto-select daily topic and start reading immediately
        onStartReading('daily', '1-card');
    };

    return (
        <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl animate-pulse" />
            
            {/* Main Button */}
            <button
                onClick={handleQuickDraw}
                className="group relative px-8 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 border-2 border-purple-400/40 flex items-center gap-4 mx-auto overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 animate-shimmer" />
                
                {/* Button Content */}
                <div className="relative flex items-center gap-3">
                    {/* Icon Container */}
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm animate-pulse">
                        <Shuffle size={24} className="text-yellow-300" />
                    </div>
                    
                    {/* Text */}
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔮</span>
                            <span>สุ่มไพ่ทาโรต์</span>
                        </div>
                        <div className="text-sm font-normal opacity-90 flex items-center gap-1">
                            <Sparkles size={14} className="text-yellow-300" />
                            <span>คำแนะนำทันที • ฟรี</span>
                        </div>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </button>
            
            {/* Subtitle */}
            <p className="text-center text-slate-400 text-sm mt-4 font-medium">
                ไม่ต้องเลือกหัวข้อ • สุ่มไพ่ 1 ใบ • เริ่มทันที
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>พร้อมใช้งาน</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>รวดเร็ว</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>✨</span>
                    <span>แม่นยำ</span>
                </div>
            </div>
        </div>
    );
};
