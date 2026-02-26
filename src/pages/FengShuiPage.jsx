import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fengShuiData } from '../data/fengShuiData';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

// ── Sub-components ──

const SectionHeader = ({ emoji, title, desc }) => (
    <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{emoji}</span>
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-300">{title}</h2>
            {desc && <p className="text-sm text-slate-400 mt-1">{desc}</p>}
        </div>
    </div>
);

const ExpandableCard = ({ title, subtitle, emoji, children, defaultOpen = false, borderColor = 'border-slate-700' }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`border ${borderColor} rounded-2xl overflow-hidden bg-slate-900/50 transition-all`}>
            <button className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors" onClick={() => setOpen(!open)}>
                <span className="text-2xl">{emoji}</span>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-100">{title}</div>
                    {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
                </div>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && <div className="px-5 pb-5 border-t border-slate-800">{children}</div>}
        </div>
    );
};

// ── Main Page ──

const FengShuiPage = () => {
    const navigate = useNavigate();
    const d = fengShuiData;
    const [activeSchool, setActiveSchool] = useState(0);
    const [activeRoom, setActiveRoom] = useState(0);
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    usePageSEO({
        title: 'ฮวงจุ้ย: ศาสตร์จัดวางตำแหน่งเพื่อชีวิตที่ดี',
        description: 'คู่มือฮวงจุ้ยฉบับสมบูรณ์ หยิน-หยาง ธาตุทั้ง 5 สำนักรูปทรง สำนักเข็มทิศ การเลือกที่ดิน จัดบ้าน เลขกั้ว กรณีศึกษา HSBC Apple Store ยุคที่ 9 กระจก สัตว์มงคล',
        keywords: 'ฮวงจุ้ย, feng shui, หยิน หยาง, ธาตุทั้ง 5, เลขกั้ว, จัดบ้าน, ที่ดินมงคล, สัตว์มงคล, ยุคที่ 9',
        ogImage: 'https://satduangdao.com/fengshui-hero.png',
        path: '/feng-shui-article',
    });

    if (authLoading) {
        return (
            <div className={`min-h-screen bg-[#0B0D17] flex items-center justify-center`}>
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
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
                        กรุณาเข้าสู่ระบบเพื่ออ่านบทความฮวงจุ้ย
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
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
        <div className="min-h-screen bg-[#0B0D17] text-slate-200">
            {/* ── Hero ── */}
            <div className="relative h-[50vh] md:h-[55vh] overflow-hidden">
                <img src="/fengshui-hero.png" alt="Feng Shui Hero" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-[#0B0D17]/60 to-transparent" />
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-20 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                        <span>☯️</span> FENG SHUI
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-amber-200 leading-tight">{d.title}</h1>
                    <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">{d.subtitle}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20">

                {/* ── Intro ── */}
                <section className="py-10">
                    <div className="bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                        <span className="text-2xl mt-0.5">💨</span>
                        <p className="text-amber-200 italic text-sm md:text-base leading-relaxed">{d.intro.hook}</p>
                    </div>
                    {d.intro.paragraphs.map((p, i) => (
                        <p key={i} className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">{p}</p>
                    ))}
                </section>

                {/* ── Philosophy: Yin Yang ── */}
                <section className="py-8">
                    <SectionHeader emoji="☯️" title={d.philosophy.sectionTitle} desc={d.philosophy.sectionDesc} />

                    <h3 className="text-xl font-bold text-slate-100 mb-3">{d.philosophy.yinYang.title}</h3>
                    <p className="text-slate-400 text-sm mb-5">{d.philosophy.yinYang.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Yang */}
                        <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">{d.philosophy.yinYang.yang.emoji}</span>
                                <span className="font-bold text-amber-300 text-lg">{d.philosophy.yinYang.yang.label}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {d.philosophy.yinYang.yang.traits.map((t, i) => (
                                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">{t}</span>
                                ))}
                            </div>
                        </div>
                        {/* Yin */}
                        <div className="bg-gradient-to-br from-indigo-500/15 to-slate-500/10 border border-indigo-500/30 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-3xl">{d.philosophy.yinYang.yin.emoji}</span>
                                <span className="font-bold text-indigo-300 text-lg">{d.philosophy.yinYang.yin.label}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {d.philosophy.yinYang.yin.traits.map((t, i) => (
                                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5 Relationships */}
                    <div className="space-y-2 mb-6">
                        {d.philosophy.yinYang.relationships.map((r, i) => (
                            <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-xl px-4 py-3">
                                <span className="text-amber-400 font-bold text-sm mt-0.5">{i + 1}</span>
                                <div>
                                    <span className="text-sm font-bold text-slate-200">{r.label}</span>
                                    <span className="text-sm text-slate-400 ml-2">{r.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                        <p className="text-teal-300 text-sm">💡 <strong>การประยุกต์ใช้:</strong> {d.philosophy.yinYang.application}</p>
                    </div>
                </section>

                {/* ── Five Elements ── */}
                <section className="py-8">
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{d.philosophy.fiveElements.title}</h3>
                    <p className="text-slate-400 text-sm mb-5">{d.philosophy.fiveElements.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                        {d.philosophy.fiveElements.elements.map((el, i) => (
                            <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{el.emoji}</span>
                                    <span className="font-bold text-lg" style={{ color: el.hex }}>{el.name}</span>
                                    <span className="text-xs text-slate-500">({el.nameEn})</span>
                                </div>
                                <div className="space-y-1 text-xs text-slate-400">
                                    <div><span className="text-slate-500">สี:</span> {el.color}</div>
                                    <div><span className="text-slate-500">รูปทรง:</span> {el.shape}</div>
                                    <div><span className="text-slate-500">ทิศ:</span> {el.direction}</div>
                                    <div><span className="text-slate-500">ฤดู:</span> {el.season}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">🔄 วงจรก่อเกิด (Mutual Generation)</h4>
                            <div className="space-y-2">
                                {d.philosophy.fiveElements.generationCycle.map((c, i) => (
                                    <div key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                        <span className="text-emerald-400">→</span> {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">⚔️ วงจรพิฆาต (Mutual Subjugation)</h4>
                            <div className="space-y-2">
                                {d.philosophy.fiveElements.destructionCycle.map((c, i) => (
                                    <div key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                        <span className="text-red-400">✕</span> {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Schools ── */}
                <section className="py-8">
                    <SectionHeader emoji="🏛️" title={d.schools.sectionTitle} desc={d.schools.sectionDesc} />

                    <div className="flex gap-2 mb-5">
                        {d.schools.items.map((s, i) => (
                            <button key={i} onClick={() => setActiveSchool(i)}
                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSchool === i ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-500'}`}>
                                <span className="text-lg mr-1">{s.emoji}</span> {s.nameEn}
                            </button>
                        ))}
                    </div>

                    {(() => {
                        const s = d.schools.items[activeSchool];
                        return (
                            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 md:p-6">
                                <h3 className="text-xl font-bold text-slate-100 mb-1">{s.name}</h3>
                                <p className="text-xs text-amber-400/70 mb-3">{s.focus}</p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{s.description}</p>

                                {s.celestialAnimals && (
                                    <>
                                        <h4 className="font-bold text-slate-200 mb-3">🐾 สัตว์มงคลสี่ทิศ (Four Celestial Animals)</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            {s.celestialAnimals.map((a, i) => (
                                                <div key={i} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xl">{a.emoji}</span>
                                                        <span className="font-bold text-amber-300">{a.name}</span>
                                                        <span className="text-xs text-slate-500">({a.direction})</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{a.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                            <p className="text-amber-300 text-xs">🏙️ {s.modernNote}</p>
                                        </div>
                                    </>
                                )}

                                {s.systems && (
                                    <div className="space-y-3">
                                        {s.systems.map((sys, i) => (
                                            <div key={i} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                                                <h4 className="font-bold text-teal-300 text-sm mb-1">{sys.name}</h4>
                                                <p className="text-xs text-slate-400">{sys.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </section>

                {/* ── Land Selection ── */}
                <section className="py-8">
                    <SectionHeader emoji="🏡" title={d.landSelection.sectionTitle} desc={d.landSelection.sectionDesc} />

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">รูปทรง</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">ผลลัพธ์</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium hidden md:table-cell">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.landSelection.landShapes.map((ls, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="mr-2">{ls.emoji}</span>
                                            <span className="text-slate-200 font-medium">{ls.shape}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${ls.good ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {ls.result}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-xs hidden md:table-cell">{ls.detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Dragon Belly */}
                    <h3 className="text-lg font-bold text-slate-100 mb-4">{d.landSelection.dragonBelly.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                            <div className="text-3xl mb-2">{d.landSelection.dragonBelly.good.emoji}</div>
                            <h4 className="font-bold text-emerald-400 mb-2">{d.landSelection.dragonBelly.good.label}</h4>
                            <p className="text-sm text-slate-300">{d.landSelection.dragonBelly.good.desc}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                            <div className="text-3xl mb-2">{d.landSelection.dragonBelly.bad.emoji}</div>
                            <h4 className="font-bold text-red-400 mb-2">{d.landSelection.dragonBelly.bad.label}</h4>
                            <p className="text-sm text-slate-300">{d.landSelection.dragonBelly.bad.desc}</p>
                        </div>
                    </div>
                </section>

                {/* ── Interior Layout ── */}
                <section className="py-8">
                    <SectionHeader emoji="🏠" title={d.interior.sectionTitle} desc={d.interior.sectionDesc} />

                    <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                        {d.interior.rooms.map((r, i) => (
                            <button key={i} onClick={() => setActiveRoom(i)}
                                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeRoom === i ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-500'}`}>
                                {r.emoji} {r.name}
                            </button>
                        ))}
                    </div>

                    {(() => {
                        const r = d.interior.rooms[activeRoom];
                        return (
                            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 md:p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{r.emoji}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100">{r.name}</h3>
                                        <p className="text-xs text-teal-400/70">{r.subtitle}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                        <h4 className="font-bold text-emerald-400 mb-3">✅ ควรทำ</h4>
                                        <ul className="space-y-2">
                                            {r.dos.map((d, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-emerald-400 mt-0.5">•</span> {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                        <h4 className="font-bold text-red-400 mb-3">❌ ข้อห้าม</h4>
                                        <ul className="space-y-2">
                                            {r.donts.map((d, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-red-400 mt-0.5">•</span> {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </section>

                {/* ── Kua Number ── */}
                <section className="py-8">
                    <SectionHeader emoji="🔢" title={d.kuaNumber.sectionTitle} desc={d.kuaNumber.sectionDesc} />
                    <p className="text-slate-300 text-sm mb-5">{d.kuaNumber.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Male formula */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                            <h4 className="font-bold text-blue-300 mb-2">👨 {d.kuaNumber.formula.before2000.male.label}</h4>
                            <ol className="space-y-1 mb-3">
                                {d.kuaNumber.formula.before2000.male.steps.map((s, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                        <span className="text-blue-400 font-bold">{i + 1}.</span> {s}
                                    </li>
                                ))}
                            </ol>
                            <div className="bg-blue-500/10 rounded-lg px-3 py-2">
                                <p className="text-xs text-blue-300 font-mono">{d.kuaNumber.formula.before2000.male.example}</p>
                            </div>
                        </div>
                        {/* Female formula */}
                        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-5">
                            <h4 className="font-bold text-pink-300 mb-2">👩 {d.kuaNumber.formula.before2000.female.label}</h4>
                            <ol className="space-y-1 mb-3">
                                {d.kuaNumber.formula.before2000.female.steps.map((s, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                        <span className="text-pink-400 font-bold">{i + 1}.</span> {s}
                                    </li>
                                ))}
                            </ol>
                            <div className="bg-pink-500/10 rounded-lg px-3 py-2">
                                <p className="text-xs text-pink-300 font-mono">{d.kuaNumber.formula.before2000.female.example}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 mb-6">
                        <p className="text-xs text-slate-400">📌 <strong className="text-slate-300">หลังปี ค.ศ. 2000:</strong> {d.kuaNumber.formula.after2000.male} / {d.kuaNumber.formula.after2000.female}</p>
                    </div>

                    {/* East/West groups */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{d.kuaNumber.groups.east.emoji}</span>
                                <span className="font-bold text-amber-300">{d.kuaNumber.groups.east.label}</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                {d.kuaNumber.groups.east.numbers.map(n => (
                                    <span key={n} className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-bold text-sm">{n}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {d.kuaNumber.groups.east.directions.map((dir, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/80">{dir}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-500/10 to-zinc-500/10 border border-slate-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{d.kuaNumber.groups.west.emoji}</span>
                                <span className="font-bold text-slate-200">{d.kuaNumber.groups.west.label}</span>
                            </div>
                            <div className="flex gap-2 mb-3">
                                {d.kuaNumber.groups.west.numbers.map(n => (
                                    <span key={n} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-500/20 text-slate-300 font-bold text-sm">{n}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {d.kuaNumber.groups.west.directions.map((dir, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400/80">{dir}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                        <p className="text-violet-300 text-sm">🔮 <strong>Bazi:</strong> {d.kuaNumber.baziNote}</p>
                    </div>
                </section>

                {/* ── Case Studies ── */}
                <section className="py-8">
                    <SectionHeader emoji="🌏" title={d.caseStudies.sectionTitle} desc={d.caseStudies.sectionDesc} />

                    <div className="space-y-4">
                        {d.caseStudies.cases.map((c, i) => (
                            <ExpandableCard key={i} title={c.title} subtitle={c.subtitle} emoji={c.emoji} defaultOpen={i === 0} borderColor="border-amber-500/20">
                                <div className="pt-4 space-y-3">
                                    {c.paragraphs.map((p, j) => (
                                        <p key={j} className="text-sm text-slate-300 leading-relaxed">{p}</p>
                                    ))}
                                </div>
                            </ExpandableCard>
                        ))}
                    </div>
                </section>

                {/* ── Period 9 ── */}
                <section className="py-8">
                    <SectionHeader emoji="🔥" title={d.period9.sectionTitle} desc={d.period9.sectionDesc} />
                    <p className="text-slate-300 text-sm mb-5">{d.period9.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {d.period9.characteristics.map((ch, i) => (
                            <div key={i} className="bg-gradient-to-br from-purple-500/10 to-red-500/10 border border-purple-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{ch.emoji}</span>
                                    <span className="font-bold text-purple-300 text-sm">{ch.label}</span>
                                </div>
                                <p className="text-xs text-slate-400">{ch.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">ปัจจัย</th>
                                    <th className="text-left py-3 px-4 text-amber-400/70 font-medium">ยุคที่ 8 (2004-2023)</th>
                                    <th className="text-left py-3 px-4 text-purple-400/70 font-medium">ยุคที่ 9 (2024-2043)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.period9.comparison.map((c, i) => (
                                    <tr key={i} className="border-b border-slate-800/50">
                                        <td className="py-3 px-4 text-slate-300 font-medium">{c.factor}</td>
                                        <td className="py-3 px-4 text-slate-400 text-xs">{c.era8}</td>
                                        <td className="py-3 px-4 text-purple-300 text-xs">{c.era9}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                        <p className="text-orange-300 text-sm">🏡 {d.period9.housing}</p>
                    </div>
                </section>

                {/* ── Remedies ── */}
                <section className="py-8">
                    <SectionHeader emoji="🪞" title={d.remedies.sectionTitle} desc={d.remedies.sectionDesc} />

                    <h3 className="text-lg font-bold text-slate-100 mb-4">{d.remedies.mirrors.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                        {d.remedies.mirrors.items.map((m, i) => (
                            <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-colors">
                                <div className="text-2xl mb-2">{m.emoji}</div>
                                <h4 className="font-bold text-slate-200 text-sm mb-1">{m.type}</h4>
                                <p className="text-xs text-amber-400/80 mb-2">ผล: {m.effect}</p>
                                <p className="text-xs text-slate-400">{m.usage}</p>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-4">{d.remedies.animals.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {d.remedies.animals.items.map((a, i) => (
                            <div key={i} className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{a.emoji}</span>
                                    <div>
                                        <h4 className="font-bold text-amber-300">{a.name}</h4>
                                        <p className="text-xs text-amber-400/60">{a.power}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Conclusion ── */}
                <section className="py-8">
                    <SectionHeader emoji="📜" title={d.conclusion.sectionTitle} />
                    {d.conclusion.paragraphs.map((p, i) => (
                        <p key={i} className="text-slate-300 text-sm leading-relaxed mb-4">{p}</p>
                    ))}

                    <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-violet-500/10 border border-amber-500/20 rounded-2xl p-5 mt-6">
                        <p className="text-amber-200 text-center font-bold mb-4">"{d.conclusion.closing}"</p>
                        <div className="flex justify-center gap-6">
                            {d.conclusion.pillars.map((p, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl mb-1">{p.emoji}</div>
                                    <div className="text-sm font-bold text-amber-300">{p.label}</div>
                                    <div className="text-xs text-slate-400 max-w-[100px]">{p.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Decorative Footer ── */}
                <div className="flex items-center justify-center gap-3 py-8 text-slate-600">
                    <span className="text-2xl">☯️</span>
                    <div className="flex gap-1">
                        {['🌿', '🔥', '🏔️', '⚙️', '💧'].map((e, i) => <span key={i} className="text-lg opacity-40">{e}</span>)}
                    </div>
                    <span className="text-2xl">☯️</span>
                </div>
            </div>
        </div>
    );
};

export default FengShuiPage;
