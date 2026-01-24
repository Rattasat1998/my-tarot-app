import React from 'react';
import { Sparkles, Moon, Star, History, BookOpen, Heart, Eye, Zap, ArrowRight } from 'lucide-react';

export const AncientWisdom = ({ openArticle }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Main Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-900/40 border border-purple-500/20 p-8 md:p-12">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

                {/* Floating Stars */}
                <div className="absolute top-8 right-12 text-yellow-400/30 animate-pulse">
                    <Star size={20} />
                </div>
                <div className="absolute top-16 right-24 text-purple-400/30 animate-pulse delay-300">
                    <Sparkles size={16} />
                </div>
                <div className="absolute bottom-12 left-16 text-indigo-400/30 animate-pulse delay-500">
                    <Moon size={18} />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                        <History size={14} className="text-purple-400" />
                        <span className="text-purple-300 text-xs uppercase tracking-widest font-medium">ศาสตร์โบราณ</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                        ไพ่ทาโรต์ <span className="text-purple-400">ศาสตร์แห่งจิตวิญญาณ</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                        มรดกทางปัญญาที่สืบทอดมากว่า <span className="text-yellow-400 font-bold">500 ปี</span>
                        <br className="hidden sm:block" />
                        เครื่องมือสะท้อนจิตใต้สำนึกที่ช่วยค้นหาคำตอบภายในตัวคุณเอง
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                            <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                            <p className="text-xs text-slate-400">78 ไพ่</p>
                            <p className="text-sm text-white font-medium">ความหมายลึกซึ้ง</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                            <Eye className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                            <p className="text-xs text-slate-400">เลือกด้วยใจ</p>
                            <p className="text-sm text-white font-medium">สัญชาตญาณนำทาง</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                            <Heart className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                            <p className="text-xs text-slate-400">กระจกสะท้อน</p>
                            <p className="text-sm text-white font-medium">จิตใจของคุณ</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                            <p className="text-xs text-slate-400">แรงบันดาลใจ</p>
                            <p className="text-sm text-white font-medium">ชีวิตที่ดีกว่า</p>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800/30 max-w-xl mx-auto mb-6">
                        <p className="text-slate-300 italic text-sm leading-relaxed">
                            "ไพ่ทาโรต์ไม่ได้บอกอนาคต แต่ช่วยให้คุณเข้าใจปัจจุบัน
                            และมองเห็นทางเลือกที่ซ่อนอยู่ในใจ"
                        </p>
                        <p className="text-purple-400 text-xs mt-3">— หลักปรัชญาไพ่ทาโรต์</p>
                    </div>

                    {/* Read More Button */}
                    {openArticle && (
                        <button
                            onClick={() => openArticle('tarot-history')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
                        >
                            <BookOpen size={18} />
                            อ่านประวัติศาสตร์ไพ่ทาโรต์ 500 ปี
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Trust Points */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <span className="text-purple-400">✦</span> ไม่ใช่การพยากรณ์
                </span>
                <span className="flex items-center gap-1">
                    <span className="text-purple-400">✦</span> เครื่องมือสะท้อนใจ
                </span>
                <span className="flex items-center gap-1">
                    <span className="text-purple-400">✦</span> ความบันเทิงเชิงปัญญา
                </span>
                <span className="flex items-center gap-1">
                    <span className="text-purple-400">✦</span> แรงบันดาลใจชีวิต
                </span>
            </div>
        </div>
    );
};
