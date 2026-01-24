import React from 'react';
import { Hand, Sparkles, Eye, Gift, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: Hand,
            title: 'เลือกหัวข้อ',
            description: 'เลือกเรื่องที่ต้องการทราบ เช่น ความรัก การงาน การเงิน',
            color: 'from-blue-500 to-blue-600'
        },
        {
            number: '02',
            icon: Sparkles,
            title: 'สับไพ่ด้วยใจ',
            description: 'ตั้งจิตอธิษฐาน สับไพ่และเลือกด้วยสัญชาตญาณ',
            color: 'from-purple-500 to-purple-600'
        },
        {
            number: '03',
            icon: Eye,
            title: 'เปิดไพ่',
            description: 'ไพ่ที่คุณเลือกจะเผยความหมายที่ซ่อนอยู่ในใจ',
            color: 'from-indigo-500 to-indigo-600'
        },
        {
            number: '04',
            icon: Gift,
            title: 'รับคำทำนาย',
            description: 'อ่านความหมายละเอียด พร้อมแนวทางในชีวิต',
            color: 'from-pink-500 to-pink-600'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-300 text-xs uppercase tracking-widest">วิธีใช้งาน</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                    เริ่มต้น<span className="text-purple-400">ง่ายๆ</span>ใน 4 ขั้นตอน
                </h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                    ไม่ต้องมีความรู้เรื่องไพ่ทาโรต์มาก่อน ใครก็ใช้ได้
                </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative group">
                        {/* Connector Line */}
                        {idx < steps.length - 1 && (
                            <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-700 to-transparent z-0">
                                <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            </div>
                        )}

                        <div className="relative z-10 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 text-center">
                            {/* Step Number */}
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                <step.icon className="text-white" size={28} />
                            </div>

                            {/* Number Badge */}
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-purple-400">{step.number}</span>
                            </div>

                            <h4 className="font-bold text-white mb-2">{step.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Note */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                    <span className="w-12 h-px bg-slate-700"></span>
                    ทั้งหมดใช้เวลาไม่ถึง 2 นาที
                    <span className="w-12 h-px bg-slate-700"></span>
                </p>
            </div>
        </div>
    );
};
