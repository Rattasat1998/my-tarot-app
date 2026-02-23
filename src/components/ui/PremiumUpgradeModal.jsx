import React from 'react';
import { Crown, Sparkles, Zap, Brain, Star, CheckCircle, X } from 'lucide-react';

export const PremiumUpgradeModal = ({ isOpen, onClose, onUpgrade, isDark }) => {
    if (!isOpen) return null;

    const premiumFeatures = [
        { icon: <Zap className="w-5 h-5" />, text: "Unlimited Tarot Readings" },
        { icon: <Brain className="w-5 h-5" />, text: "Premium Meditation (15-30 นาที)" },
        { icon: <Star className="w-5 h-5" />, text: "Monthly Zodiac Reports" },
        { icon: <Sparkles className="w-5 h-5" />, text: "Personal Growth Journal" },
        { icon: <CheckCircle className="w-5 h-5" />, text: "Ad-Free Experience" }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30' : 'bg-white border border-purple-200'} overflow-hidden animate-in zoom-in duration-300`}>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 transition-all z-10"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                                <Crown className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                อัปเกรดเป็น Premium
                            </h2>
                        </div>
                        <p className="text-slate-300">
                            เปิดรับสิทธิพิเศษและเนื้อหาพรีเมียมทั้งหมด
                        </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-purple-300">299</span>
                            <span className="text-slate-400">บาท/เดือน</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full mt-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">ยกเลิกได้ทุกเมื่อ</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                        {premiumFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400">
                                    {feature.icon}
                                </div>
                                <span className="text-slate-200">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onUpgrade}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                        >
                            <Crown className="w-5 h-5" />
                            อัปเกรดเป็น Premium
                        </button>
                        
                        <button
                            onClick={onClose}
                            className={`w-full px-6 py-3 rounded-xl border transition-all font-medium ${
                                isDark 
                                    ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            ไว้ทีหลัง
                        </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="text-center mt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-blue-400 text-sm font-medium">1,200+ สมาชิก Premium แล้ว</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
