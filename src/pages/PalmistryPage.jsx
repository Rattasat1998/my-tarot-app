import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { palmistryData } from '../data/palmistryData';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

const SectionTitle = ({ emoji, title, subtitle }) => (
    <div className="mb-8 mt-16">
        <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{emoji}</span>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
                {title}
            </h2>
        </div>
        {subtitle && <p className="text-slate-400 text-sm sm:text-base ml-12">{subtitle}</p>}
    </div>
);

const PalmistryPage = () => {
    const navigate = useNavigate();
    const d = palmistryData;

    usePageSEO({
        title: 'ศาสตร์ลายมือ: หัตถศาสตร์เชิงบูรณาการ',
        description: 'เรียนรู้ศาสตร์ลายมือครบทุกมิติ ประวัติศาสตร์ ประเภทมือตามธาตุ เนินฝ่ามือ 7 เนิน เส้นหลัก 4 เส้น เครื่องหมายพิเศษ หัตถศาสตร์ไทย ติตถิวิทยา AI กับอนาคตลายมือ',
        keywords: 'ศาสตร์ลายมือ, ดูลายมือ, หัตถศาสตร์, เส้นชีวิต, เส้นสมอง, เส้นหัวใจ, เนินฝ่ามือ, palmistry, ลายนิ้วมือ',
        ogImage: 'https://satduangdao.com/palmistry-hero.png',
        path: '/palmistry-article',
    });

    const { user, loading: authLoading } = useAuth();

    // State for interactive elements
    const [activeLineTab, setActiveLineTab] = useState(0);
    const [expandedEra, setExpandedEra] = useState(null);
    const [expandedMount, setExpandedMount] = useState(null);
    const [showMysticCross, setShowMysticCross] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const lineColors = {
        rose: { bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-500/30', text: 'text-rose-300', dot: 'bg-rose-500', tab: 'bg-rose-500/20 text-rose-300', tabActive: 'bg-rose-500 text-white' },
        cyan: { bg: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/30', text: 'text-cyan-300', dot: 'bg-cyan-500', tab: 'bg-cyan-500/20 text-cyan-300', tabActive: 'bg-cyan-500 text-white' },
        purple: { bg: 'from-purple-500/10 to-violet-500/10', border: 'border-purple-500/30', text: 'text-purple-300', dot: 'bg-purple-500', tab: 'bg-purple-500/20 text-purple-300', tabActive: 'bg-purple-500 text-white' },
        amber: { bg: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-500/30', text: 'text-amber-300', dot: 'bg-amber-500', tab: 'bg-amber-500/20 text-amber-300', tabActive: 'bg-amber-500 text-white' },
    };

    const handCardColors = {
        amber: { bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-300' },
        blue: { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300' },
        cyan: { bg: 'from-cyan-500/10 to-teal-500/10', border: 'border-cyan-500/30', badge: 'bg-cyan-500/20 text-cyan-300' },
        rose: { bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-500/30', badge: 'bg-rose-500/20 text-rose-300' },
    };

    if (authLoading) {
        return (
            <div className={`min-h-screen bg-[#0B0D17] flex items-center justify-center`}>
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`min-h-screen bg-[#0B0D17] text-white flex flex-col items-center justify-center p-6`}>
                <div className="max-w-md text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-700 mb-6 shadow-xl`}>
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className={`text-slate-400 mb-6 leading-relaxed`}>
                        กรุณาเข้าสู่ระบบเพื่ออ่านบทความศาสตร์ลายมือ
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white`}
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0D17] text-white">
            {/* Hero Section */}
            <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
                <img src="/palmistry-hero.png" alt="Palmistry" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-[#0B0D17]/60 to-transparent" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🖐️</span>
                        <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Palmistry</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 bg-clip-text text-transparent leading-tight">
                        {d.title}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl">{d.subtitle}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
                {/* Introduction */}
                <div className="mt-8">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl mt-1">🔮</span>
                            <p className="text-purple-200 italic text-lg leading-relaxed">{d.introduction.quote}</p>
                        </div>
                    </div>
                    {d.introduction.paragraphs.map((p, i) => (
                        <p key={i} className="text-slate-300 leading-relaxed mb-4 text-base">{p}</p>
                    ))}
                </div>

                {/* ==============================
            ประวัติศาสตร์ — Timeline
           ============================== */}
                <SectionTitle emoji="📜" title="รากฐานและวิวัฒนาการทางประวัติศาสตร์" subtitle="จากอินเดียโบราณสู่ยุคดิจิทัล" />
                <p className="text-slate-300 leading-relaxed mb-8">{d.history.intro}</p>

                <div className="space-y-3">
                    {d.history.eras.map((era, i) => (
                        <div
                            key={i}
                            className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${expandedEra === i ? 'border-purple-500/40 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                            onClick={() => setExpandedEra(expandedEra === i ? null : i)}
                        >
                            <div className="flex items-center gap-4 p-4">
                                <span className="text-2xl w-10 text-center flex-shrink-0">{era.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-bold text-white">{era.era}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{era.period}</span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{era.role}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className={`text-slate-500 transition-transform flex-shrink-0 ${expandedEra === i ? 'rotate-180' : ''}`}
                                ><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                            {expandedEra === i && (
                                <div className="px-4 pb-4 border-t border-slate-800/50">
                                    <div className="pt-3 pl-14">
                                        <p className="text-slate-300 text-sm leading-relaxed mb-2">{era.detail}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-purple-400">อิทธิพลสำคัญ:</span>
                                            <span className="text-xs text-slate-400">{era.influence}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ==============================
            ประเภทมือตามธาตุ
           ============================== */}
                <SectionTitle emoji="✋" title="กายวิภาคของมือและธาตุเจ้าเรือน" subtitle="โครงสร้างกระดูก ความยาวนิ้ว และสัดส่วนฝ่ามือ" />
                <p className="text-slate-300 leading-relaxed mb-8">{d.handTypes.intro}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {d.handTypes.western.map((hand, i) => {
                        const c = handCardColors[hand.color];
                        return (
                            <div key={i} className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{hand.emoji}</span>
                                    <div>
                                        <h4 className="font-bold text-white">มือธาตุ{hand.element}</h4>
                                        <span className="text-xs text-slate-500">{hand.elementEn} Hand</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20 flex-shrink-0">ฝ่ามือ:</span>
                                        <span className="text-slate-300">{hand.palmShape}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20 flex-shrink-0">นิ้วมือ:</span>
                                        <span className="text-slate-300">{hand.fingerLength}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20 flex-shrink-0">ผิวสัมผัส:</span>
                                        <span className="text-slate-300">{hand.skinTexture}</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-2 mt-2">
                                        <p className="text-slate-300">{hand.personality}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-20 flex-shrink-0">อาชีพ:</span>
                                        <span className="text-slate-300">{hand.career}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>💪 {hand.strength}</span>
                                    </div>
                                    <p className="text-xs text-rose-400/70 mt-1">⚠️ {hand.weakness}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chinese Extra Elements */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-5 mb-8">
                    <h4 className="font-bold text-white mb-3 text-sm">
                        🇨🇳 ธาตุเพิ่มเติมในระบบจีน
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {d.handTypes.chineseExtra.map((ex, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                                <span className="text-xl">{ex.emoji}</span>
                                <div>
                                    <span className="font-semibold text-white text-sm">ธาตุ{ex.element} ({ex.elementEn})</span>
                                    <p className="text-xs text-slate-400 mt-1">{ex.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ==============================
            เนินบนฝ่ามือ
           ============================== */}
                <SectionTitle emoji="🗺️" title="เนินบนฝ่ามือ: แผนผังพลังงาน" subtitle="แหล่งกักเก็บพลังงานของลักษณะนิสัยเฉพาะด้าน" />
                <p className="text-slate-300 leading-relaxed mb-6">{d.mounts.intro}</p>

                {/* Palm diagram */}
                <div className="flex justify-center mb-8">
                    <img src="/palm-diagram.png" alt="Palm diagram showing main lines" className="w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-2xl border border-slate-800 bg-slate-900/50" />
                </div>

                {/* Mounts grid */}
                <div className="space-y-3 mb-8">
                    {d.mounts.list.map((mount, i) => (
                        <div
                            key={i}
                            className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${expandedMount === i ? 'border-purple-500/40 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                            onClick={() => setExpandedMount(expandedMount === i ? null : i)}
                        >
                            <div className="flex items-center gap-4 p-4">
                                <span className="text-2xl w-10 text-center flex-shrink-0">{mount.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-white text-sm">{mount.name}</span>
                                        <span className="text-xs text-slate-500">({mount.nameEn})</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{mount.position} • {mount.planet}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className={`text-slate-500 transition-transform flex-shrink-0 ${expandedMount === i ? 'rotate-180' : ''}`}
                                ><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                            {expandedMount === i && (
                                <div className="px-4 pb-4 border-t border-slate-800/50">
                                    <div className="pt-3 pl-14 space-y-2">
                                        <p className="text-slate-300 text-sm">{mount.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {mount.traits.split(', ').map((t, j) => (
                                                <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">{t}</span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                                                <p className="text-xs text-emerald-400 font-semibold mb-1">✨ เนินเด่น</p>
                                                <p className="text-xs text-slate-300">{mount.strong}</p>
                                            </div>
                                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3">
                                                <p className="text-xs text-rose-400 font-semibold mb-1">⚠️ เนินบาง</p>
                                                <p className="text-xs text-slate-300">{mount.weak}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mount table */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-3 text-slate-400 font-medium">เนิน</th>
                                <th className="text-left py-3 px-3 text-slate-400 font-medium">ตำแหน่ง</th>
                                <th className="text-left py-3 px-3 text-slate-400 font-medium">ดาว</th>
                                <th className="text-left py-3 px-3 text-slate-400 font-medium">ลักษณะนิสัย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.mounts.list.map((mount, i) => (
                                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 px-3">
                                        <span className="flex items-center gap-2">
                                            <span>{mount.emoji}</span>
                                            <span className="text-white font-medium">{mount.name}</span>
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-slate-400">{mount.position}</td>
                                    <td className="py-3 px-3 text-purple-300 text-xs">{mount.planet}</td>
                                    <td className="py-3 px-3 text-slate-300 text-xs">{mount.traits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ==============================
            เส้นหลัก 4 เส้น — Tabs
           ============================== */}
                <SectionTitle emoji="〰️" title="เส้นหลัก: แผนที่การเดินทางของชีวิต" subtitle={d.mainLines.intro} />

                {/* Line tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {d.mainLines.lines.map((line, i) => {
                        const c = lineColors[line.color];
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveLineTab(i)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeLineTab === i ? c.tabActive : c.tab + ' hover:opacity-80'}`}
                            >
                                <span>{line.emoji}</span>
                                <span>{line.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active line content */}
                {(() => {
                    const line = d.mainLines.lines[activeLineTab];
                    const c = lineColors[line.color];
                    return (
                        <div className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-6 mb-8`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{line.emoji}</span>
                                <div>
                                    <h4 className="text-xl font-bold text-white">{line.name}</h4>
                                    <span className="text-sm text-slate-400">{line.nameEn}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-black/20 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">ตำแหน่ง</p>
                                    <p className="text-sm text-slate-300">{line.position}</p>
                                </div>
                                <div className="bg-black/20 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">ความหมาย</p>
                                    <p className="text-sm text-slate-300">{line.meaning}</p>
                                </div>
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                                    <p className="text-xs text-amber-400 mb-1">💡 ข้อควรรู้</p>
                                    <p className="text-sm text-amber-200/80">{line.notMean}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                        <p className="text-xs text-emerald-400 font-semibold mb-2">✨ ลักษณะเด่น</p>
                                        <p className="text-xs text-slate-300">{line.deep}</p>
                                    </div>
                                    <div className="bg-slate-500/5 border border-slate-500/20 rounded-xl p-4">
                                        <p className="text-xs text-slate-400 font-semibold mb-2">📏 ลักษณะอื่น</p>
                                        <p className="text-xs text-slate-300">{line.short}</p>
                                    </div>
                                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                                        <p className="text-xs text-rose-400 font-semibold mb-2">⚡ การขาดช่วง</p>
                                        <p className="text-xs text-slate-300">{line.broken}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* ==============================
            เครื่องหมายพิเศษ
           ============================== */}
                <SectionTitle emoji="✨" title="เครื่องหมายพิเศษและสัญญะลึกลับ" subtitle={d.specialMarks.intro} />

                {/* Mystic Cross */}
                <div
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 mb-6 cursor-pointer ${showMysticCross ? 'border-purple-500/40 bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'border-slate-800 hover:border-purple-500/30'}`}
                    onClick={() => setShowMysticCross(!showMysticCross)}
                >
                    <div className="flex items-center gap-4 p-5">
                        <span className="text-3xl">{d.specialMarks.mysticCross.emoji}</span>
                        <div className="flex-1">
                            <h4 className="font-bold text-white">{d.specialMarks.mysticCross.name}</h4>
                            <p className="text-sm text-purple-400">{d.specialMarks.mysticCross.position}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className={`text-purple-400 transition-transform ${showMysticCross ? 'rotate-180' : ''}`}
                        ><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                    {showMysticCross && (
                        <div className="px-5 pb-5 border-t border-purple-500/20">
                            <div className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                                        <p className="text-xs text-amber-400 font-semibold mb-2">🇹🇭 ความเชื่อในหัตถศาสตร์ไทย</p>
                                        <p className="text-sm text-slate-300">{d.specialMarks.mysticCross.thaiBeliefs}</p>
                                    </div>
                                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                                        <p className="text-xs text-indigo-400 font-semibold mb-2">🌍 ความหมายสากล</p>
                                        <p className="text-sm text-slate-300">{d.specialMarks.mysticCross.globalMeaning}</p>
                                    </div>
                                </div>
                                <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3">
                                    <p className="text-xs text-rose-300">⚠️ {d.specialMarks.mysticCross.warning}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Other marks grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {d.specialMarks.marks.map((mark, i) => (
                        <div key={i} className={`border rounded-xl p-5 ${mark.nature === 'positive' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl font-bold text-slate-600">{mark.symbol}</span>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{mark.name}</h4>
                                    <span className="text-xs text-slate-500">{mark.nameEn}</span>
                                </div>
                                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${mark.nature === 'positive' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                    {mark.nature === 'positive' ? '✨ มงคล' : '⚠️ อุปสรรค'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{mark.meaning}</p>
                            <p className="text-xs text-slate-400">{mark.detail || (mark.onJupiter ? `บนเนินพฤหัส: ${mark.onJupiter}` : '') + (mark.onMars ? ` • บนเนินอังคาร: ${mark.onMars}` : '') + (mark.onLifeLine ? `บนเส้นชีวิต: ${mark.onLifeLine}` : '') + (mark.onHeadLine ? ` • บนเส้นสมอง: ${mark.onHeadLine}` : '')}</p>
                        </div>
                    ))}
                </div>

                {/* ==============================
            หัตถศาสตร์ไทย
           ============================== */}
                <SectionTitle emoji="🇹🇭" title="หัตถศาสตร์ไทย" subtitle="ภูมิปัญญาจากตำราพรหมชาติและสมุดไทยโบราณ" />
                <p className="text-slate-300 leading-relaxed mb-6">{d.thaiPalmistry.intro}</p>

                {/* Hand reading principle */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-6">
                    <h4 className="font-bold text-amber-300 mb-4 text-lg">{d.thaiPalmistry.handReading.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                            <p className="text-xs text-pink-400 font-semibold mb-2">👩 ผู้หญิง (ตำราดั้งเดิม)</p>
                            <p className="text-sm text-slate-300">{d.thaiPalmistry.handReading.traditional.female}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <p className="text-xs text-blue-400 font-semibold mb-2">👨 ผู้ชาย (ตำราดั้งเดิม)</p>
                            <p className="text-sm text-slate-300">{d.thaiPalmistry.handReading.traditional.male}</p>
                        </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs text-emerald-400 font-semibold mb-2">🔄 แนวทางร่วมสมัย</p>
                        <p className="text-sm text-slate-300">{d.thaiPalmistry.handReading.modern}</p>
                    </div>
                </div>

                {/* Unique Thai lines */}
                <div className="space-y-3 mb-8">
                    {d.thaiPalmistry.uniqueLines.map((line, i) => (
                        <div key={i} className="border border-slate-800 rounded-xl p-4 hover:border-amber-500/30 transition-colors">
                            <div className="flex items-start gap-3">
                                <span className="text-amber-400 font-bold text-lg mt-0.5">{i + 1}</span>
                                <div>
                                    <h5 className="font-bold text-white text-sm">{line.name}</h5>
                                    <p className="text-sm text-slate-400 mt-1">{line.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ==============================
            ติตถิวิทยา
           ============================== */}
                <SectionTitle emoji="🔬" title="ติตถิวิทยาและวิทยาศาสตร์การแพทย์" subtitle="การถอดรหัสลายนิ้วมือและสุขภาพ" />
                <p className="text-slate-300 leading-relaxed mb-4">{d.dermatoglyphics.intro}</p>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-200">💡 {d.dermatoglyphics.keyFact}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {d.dermatoglyphics.studies.map((study, i) => (
                        <div key={i} className="border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{study.emoji}</span>
                                <h5 className="font-bold text-white text-sm">{study.title}</h5>
                            </div>
                            <p className="text-sm text-slate-400">{study.description}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8">
                    <p className="text-xs text-slate-400">{d.dermatoglyphics.method}</p>
                </div>

                {/* ==============================
            อนาคต — AI
           ============================== */}
                <SectionTitle emoji="🤖" title="อนาคตของหัตถศาสตร์ในยุค AI" subtitle="ปัญญาประดิษฐ์และการเรียนรู้เชิงลึก" />
                <p className="text-slate-300 leading-relaxed mb-8">{d.future.intro}</p>

                {/* AI pipeline */}
                <div className="space-y-4 mb-6">
                    {d.future.steps.map((s, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-300">
                                {s.step}
                            </div>
                            <div className="flex-1 border border-slate-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{s.emoji}</span>
                                    <h5 className="font-bold text-white text-sm">{s.title}</h5>
                                </div>
                                <p className="text-sm text-slate-400">{s.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5 mb-8">
                    <p className="text-sm text-indigo-200">🔐 {d.future.biometric}</p>
                </div>

                {/* ==============================
            บทสรุป
           ============================== */}
                <SectionTitle emoji="📖" title="บทสรุปเชิงวิชาการ" />
                {d.conclusion.paragraphs.map((p, i) => (
                    <p key={i} className="text-slate-300 leading-relaxed mb-4">{p}</p>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs text-emerald-400 font-semibold mb-2">✅ {d.conclusion.distinction.analysis.split(' — ')[0]}</p>
                        <p className="text-sm text-slate-300">{d.conclusion.distinction.analysis.split(' — ')[1]}</p>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-xs text-amber-400 font-semibold mb-2">🔮 {d.conclusion.distinction.divination.split(' — ')[0]}</p>
                        <p className="text-sm text-slate-300">{d.conclusion.distinction.divination.split(' — ')[1]}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
                    <p className="text-slate-300 leading-relaxed italic">{d.conclusion.finalThought}</p>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {d.conclusion.pillars.map((pillar, i) => (
                        <div key={i} className="text-center p-4 border border-slate-800 rounded-xl hover:border-purple-500/30 transition-colors">
                            <span className="text-3xl block mb-2">{pillar.icon}</span>
                            <h4 className="font-bold text-white text-sm mb-1">{pillar.title}</h4>
                            <p className="text-xs text-slate-500">{pillar.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Back button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
                    >
                        ← กลับหน้าหลัก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PalmistryPage;
