import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';

export const CTASection = ({ onScrollToTop }) => {
    return (
        <section className="w-full py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center">
                {/* CTA Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/50 border border-purple-500/20 p-10 sm:p-14">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="text-5xl mb-6">🔮</div>
                        <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white mb-4">
                            พร้อมค้นหา<span className="text-purple-400">คำตอบ</span>แล้วหรือยัง?
                        </h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                            ไพ่ทาโรต์พร้อมเผยความลับที่ซ่อนอยู่ในใจคุณ
                            เริ่มต้นง่ายๆ เลือกหัวข้อแล้วเปิดไพ่เลย
                        </p>

                        <button
                            onClick={onScrollToTop}
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Sparkles size={20} />
                            เริ่มทำนายตอนนี้
                            <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                        </button>

                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
                            <span>🔒 ปลอดภัย 100%</span>
                            <span>⚡ ผลทันที</span>
                            <span>🎴 ไพ่ครบ 78 ใบ</span>
                            <span>💜 ฟรีรายวัน</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
