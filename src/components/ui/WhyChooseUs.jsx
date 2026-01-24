import React from 'react';
import { Shield, Zap, Lock, Clock, Award, CheckCircle, Smartphone, Globe } from 'lucide-react';

export const WhyChooseUs = () => {
    const features = [
        {
            icon: Shield,
            title: 'ปลอดภัย 100%',
            description: 'ข้อมูลส่วนตัวเข้ารหัสและไม่เปิดเผยแก่บุคคลที่สาม',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            icon: Zap,
            title: 'ผลทันที',
            description: 'รับคำทำนายทันทีหลังเลือกไพ่ ไม่ต้องรอ',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10'
        },
        {
            icon: Lock,
            title: 'ส่วนตัว',
            description: 'ดูดวงได้ทุกที่ทุกเวลา ไม่ต้องเปิดเผยตัวตน',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            icon: Clock,
            title: '24/7',
            description: 'เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            icon: Award,
            title: 'คุณภาพสูง',
            description: 'ไพ่ 78 ใบ พร้อมความหมายละเอียดครบถ้วน',
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10'
        },
        {
            icon: Smartphone,
            title: 'ใช้งานง่าย',
            description: 'ออกแบบให้ใช้งานง่าย ทั้งมือถือและคอมพิวเตอร์',
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-500/10'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-green-300 text-xs uppercase tracking-widest">ทำไมต้องเลือกเรา</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                    บริการ<span className="text-purple-400">ดูดวงออนไลน์</span>ที่คุณวางใจได้
                </h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                    เราให้ความสำคัญกับประสบการณ์ผู้ใช้และความเป็นส่วนตัวของคุณ
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
                    >
                        <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <feature.icon className={feature.color} size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/30">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Shield className="text-green-400" size={16} />
                    </div>
                    <span className="text-slate-300">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Lock className="text-blue-400" size={16} />
                    </div>
                    <span className="text-slate-300">PDPA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Globe className="text-purple-400" size={16} />
                    </div>
                    <span className="text-slate-300">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Award className="text-yellow-400" size={16} />
                    </div>
                    <span className="text-slate-300">ผู้ใช้ 10,000+</span>
                </div>
            </div>
        </div>
    );
};
