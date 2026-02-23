import React from 'react';
import { Crown, Play, BookOpen, Video, Sparkles, Lock, Star } from 'lucide-react';
import { PremiumGate } from './PremiumGate';

const EXCLUSIVE_ITEMS = [
    {
        id: 'masterclass-tarot',
        type: 'video',
        title: 'Masterclass: เทคนิคอ่านไพ่ทาโรต์ขั้นสูง',
        description: 'เรียนรู้การตีความไพ่แบบมืออาชีพจากผู้เชี่ยวชาญ',
        duration: '45 นาที',
        icon: <Video className="w-5 h-5" />,
        gradient: 'from-violet-500/20 to-purple-500/20',
        border: 'border-violet-500/30',
        iconBg: 'bg-violet-500/20',
        iconColor: 'text-violet-400'
    },
    {
        id: 'celtic-cross-deep',
        type: 'article',
        title: 'เจาะลึก Celtic Cross Spread',
        description: 'วิเคราะห์ตำแหน่งทั้ง 10 อย่างละเอียดพร้อมตัวอย่างจริง',
        duration: '15 นาที อ่าน',
        icon: <BookOpen className="w-5 h-5" />,
        gradient: 'from-indigo-500/20 to-blue-500/20',
        border: 'border-indigo-500/30',
        iconBg: 'bg-indigo-500/20',
        iconColor: 'text-indigo-400'
    },
    {
        id: 'workshop-manifest',
        type: 'workshop',
        title: 'Workshop: การ Manifest ด้วยไพ่ทาโรต์',
        description: 'เวิร์กช็อปออนไลน์สำหรับการตั้งเป้าหมายและใช้ไพ่เป็นเครื่องมือ',
        duration: '60 นาที',
        icon: <Sparkles className="w-5 h-5" />,
        gradient: 'from-amber-500/20 to-orange-500/20',
        border: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400'
    },
    {
        id: 'moon-rituals',
        type: 'video',
        title: 'พิธีกรรมพระจันทร์เต็มดวง',
        description: 'เรียนรู้การใช้พลังจันทร์เสริมดวงและชำระล้างพลังงาน',
        duration: '30 นาที',
        icon: <Play className="w-5 h-5" />,
        gradient: 'from-cyan-500/20 to-teal-500/20',
        border: 'border-cyan-500/30',
        iconBg: 'bg-cyan-500/20',
        iconColor: 'text-cyan-400'
    },
    {
        id: 'astro-tarot',
        type: 'article',
        title: 'ไพ่ทาโรต์กับโหราศาสตร์: ความเชื่อมโยงที่ซ่อนเร้น',
        description: 'ค้นพบว่าไพ่ทาโรต์แต่ละใบเชื่อมโยงกับราศีและดาวเคราะห์อย่างไร',
        duration: '12 นาที อ่าน',
        icon: <Star className="w-5 h-5" />,
        gradient: 'from-rose-500/20 to-pink-500/20',
        border: 'border-rose-500/30',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-400'
    },
    {
        id: 'shadow-work',
        type: 'workshop',
        title: 'Shadow Work ด้วยไพ่ทาโรต์',
        description: 'สำรวจด้านมืดของตัวเองอย่างปลอดภัยผ่านไพ่ทาโรต์',
        duration: '50 นาที',
        icon: <Sparkles className="w-5 h-5" />,
        gradient: 'from-slate-500/20 to-zinc-500/20',
        border: 'border-slate-500/30',
        iconBg: 'bg-slate-500/20',
        iconColor: 'text-slate-400'
    }
];

export const ExclusiveContentSection = ({ className = '' }) => {
    return (
        <div className={className}>
            <PremiumGate feature="exclusiveContent" fallback={
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <Crown className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">เนื้อหาพิเศษ Premium</h3>
                                <p className="text-sm text-slate-400">วิดีโอ บทความ และเวิร์กช็อปเฉพาะสมาชิก</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full">
                            <Lock className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Premium Only</span>
                        </div>
                    </div>

                    {/* Preview Grid - Blurred */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {EXCLUSIVE_ITEMS.slice(0, 3).map((item) => (
                            <div
                                key={item.id}
                                className={`relative p-5 rounded-xl bg-gradient-to-br ${item.gradient} border ${item.border} blur-[2px] opacity-60`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs text-slate-400 uppercase font-medium">{item.type}</span>
                                </div>
                                <h4 className="font-bold text-white mb-2 text-sm">{item.title}</h4>
                                <p className="text-slate-400 text-xs mb-3">{item.description}</p>
                                <div className="text-xs text-slate-500">{item.duration}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center py-4">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('showPremiumUpgrade'))}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2 mx-auto"
                        >
                            <Crown className="w-5 h-5" />
                            ปลดล็อกเนื้อหาพิเศษทั้งหมด
                        </button>
                        <p className="text-slate-500 text-xs mt-3">รวม {EXCLUSIVE_ITEMS.length} เนื้อหาพิเศษ อัปเดตทุกสัปดาห์</p>
                    </div>
                </div>
            }>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <Crown className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">เนื้อหาพิเศษ Premium</h3>
                                <p className="text-sm text-slate-400">วิดีโอ บทความ และเวิร์กช็อปเฉพาะสมาชิก</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                            <Crown className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">Premium Access</span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {EXCLUSIVE_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`text-left p-5 rounded-xl bg-gradient-to-br ${item.gradient} border ${item.border} hover:scale-[1.02] transition-all group`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs text-slate-400 uppercase font-medium">{item.type}</span>
                                </div>
                                <h4 className="font-bold text-white mb-2 text-sm group-hover:text-purple-300 transition-colors">{item.title}</h4>
                                <p className="text-slate-400 text-xs mb-3">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">{item.duration}</span>
                                    <span className="text-xs text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        เปิดดู →
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </PremiumGate>
        </div>
    );
};
