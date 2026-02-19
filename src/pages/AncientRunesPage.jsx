import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, Scroll, Shield, Sparkles } from 'lucide-react';
import {
    RUNE_OVERVIEW, RUNE_ORIGINS, RUNE_SYSTEMS, RUNE_SYSTEMS_NOTE,
    ODIN_MYTH, AETTIR, RUNE_ARTIFACTS, ARTIFACTS_NOTE,
    RUNE_POEMS, POEMS_NOTE, GALDR, MODERN_REVIVAL, CONCLUSION,
} from '../data/ancientRunesData';

/* ──────────────── helpers ──────────────── */
const renderBold = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1
            ? <strong key={i} className="text-amber-300 font-semibold">{part}</strong>
            : <span key={i}>{part}</span>
    );
};

/* ──────────────── Rune Card (single rune in Ætt) ──────────────── */
const RuneItem = ({ rune, aettColor }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="group">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-slate-800/40 transition-all"
            >
                <span
                    className="text-3xl sm:text-4xl w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${aettColor}15`, border: `1px solid ${aettColor}30` }}
                >
                    {rune.symbol}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{rune.name}</span>
                        <span className="text-xs text-slate-500">({rune.nameTh})</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: aettColor }}>{rune.meaning}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-4 pb-3 pl-[4.5rem] animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-slate-400 leading-relaxed">{rune.detail}</p>
                </div>
            )}
        </div>
    );
};

/* ──────────────── Ætt Section ──────────────── */
const AettSection = ({ aett }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={`mb-6 bg-gradient-to-br ${aett.gradient} border ${aett.borderColor} rounded-2xl overflow-hidden`}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left p-5 sm:p-6 flex items-center gap-4 hover:bg-slate-800/20 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{aett.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${aett.color}20`, color: aett.color }}>{aett.patron}</span>
                    </div>
                    <p className="text-sm font-medium mt-1" style={{ color: aett.color }}>{aett.subtitle}</p>
                    <p className="text-xs text-slate-500 mt-1.5">{aett.description}</p>
                    {/* Rune symbols preview */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {aett.runes.map(r => (
                            <span key={r.name} className="text-xl sm:text-2xl opacity-60 hover:opacity-100 transition-opacity" title={r.name}>{r.symbol}</span>
                        ))}
                    </div>
                </div>
                <div className="flex-shrink-0 text-slate-500">
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-slate-800/50 divide-y divide-slate-800/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    {aett.runes.map(rune => (
                        <RuneItem key={rune.name} rune={rune} aettColor={aett.color} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ──────────────── MAIN PAGE ──────────────── */
export function AncientRunesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('futhark');

    const tabs = [
        { id: 'futhark', label: 'ᚠ Elder Futhark', icon: '☽' },
        { id: 'artifacts', label: '🏛️ โบราณวัตถุ', icon: null },
        { id: 'poems', label: '📜 กวีนิพนธ์', icon: null },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* ═══════════ HERO ═══════════ */}
            <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden">
                <img src={RUNE_OVERVIEW.heroImage} alt="Ancient Runes" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-slate-900/70 backdrop-blur-sm rounded-full text-sm hover:bg-slate-800 transition-colors border border-slate-700/50"
                >
                    <ArrowLeft size={16} /> กลับหน้าหลัก
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="flex gap-2 mb-3 flex-wrap">
                        <span className="text-[11px] px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">รูโนโลยี</span>
                        <span className="text-[11px] px-3 py-1 bg-slate-800/60 text-slate-300 rounded-full border border-slate-700/50">อ่าน ~25 นาที</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{RUNE_OVERVIEW.title}</h1>
                    <p className="text-emerald-400 text-sm sm:text-base font-medium mt-2">{RUNE_OVERVIEW.tagline}</p>
                </div>
            </div>

            {/* ═══════════ CONTENT ═══════════ */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* ── Subtitle ── */}
                <p className="text-center text-slate-500 text-sm sm:text-base italic mb-8 max-w-3xl mx-auto">{RUNE_OVERVIEW.subtitle}</p>

                {/* ── Intro ── */}
                <section className="mb-12">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                        {renderBold(RUNE_OVERVIEW.intro)}
                    </div>
                </section>

                {/* ═══════════ ORIGINS ═══════════ */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-amber-400" size={22} />
                        <h2 className="text-xl sm:text-2xl font-bold">{RUNE_ORIGINS.title}</h2>
                    </div>
                    <p className="text-amber-400/80 text-sm font-medium mb-4">{RUNE_ORIGINS.subtitle}</p>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6 whitespace-pre-line">{RUNE_ORIGINS.content}</p>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {RUNE_ORIGINS.theories.map(t => (
                            <div key={t.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">{t.icon}</span>
                                    <h4 className="text-sm font-bold" style={{ color: t.color }}>{t.title}</h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{t.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════ RUNE SYSTEMS TABLE ═══════════ */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-5">
                        <Scroll className="text-amber-400" size={22} />
                        <h2 className="text-xl sm:text-2xl font-bold">วิวัฒนาการของระบบอักษรรูนหลัก</h2>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-900/80 text-left">
                                    <th className="px-4 py-3 text-amber-400 font-semibold">ระบบ</th>
                                    <th className="px-4 py-3 text-amber-400 font-semibold">ช่วงเวลา (ค.ศ.)</th>
                                    <th className="px-4 py-3 text-amber-400 font-semibold text-center">จำนวน</th>
                                    <th className="px-4 py-3 text-amber-400 font-semibold">ภูมิภาค</th>
                                    <th className="px-4 py-3 text-amber-400 font-semibold">ภาษา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RUNE_SYSTEMS.map((s, i) => (
                                    <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3 font-bold text-white">{s.name}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.period}</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-semibold">{s.count}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.region}</td>
                                        <td className="px-4 py-3 text-slate-500 italic">{s.language}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                        {renderBold(RUNE_SYSTEMS_NOTE)}
                    </div>
                </section>

                {/* ═══════════ ODIN MYTH ═══════════ */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{ODIN_MYTH.icon}</span>
                        <h2 className="text-xl sm:text-2xl font-bold">{ODIN_MYTH.title}</h2>
                    </div>
                    <p className="text-purple-400 text-sm font-medium mb-6">{ODIN_MYTH.subtitle}</p>

                    {/* Highlights strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {ODIN_MYTH.highlights.map(h => (
                            <div key={h.label} className="bg-slate-900/60 border border-purple-500/20 rounded-xl p-4 text-center">
                                <span className="text-2xl block mb-1">{h.icon}</span>
                                <div className="text-xs text-slate-500">{h.label}</div>
                                <div className="text-sm font-bold text-purple-300 mt-0.5">{h.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {ODIN_MYTH.content.map((para, i) => (
                            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-sm sm:text-base text-slate-300 leading-relaxed">
                                {renderBold(para)}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════ TABS ═══════════ */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ═══════════ TAB: Elder Futhark ═══════════ */}
                {activeTab === 'futhark' && (
                    <section className="mb-12 animate-in fade-in duration-300">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">ระบบ Elder Futhark — 24 อักษร 3 Ættir</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            แต่ละกลุ่ม (Ættir) มีเทพเจ้าผู้คุ้มครองและแนวคิดเชิงมโนทัศน์ที่แตกต่างกัน สะท้อนวัฏจักรของการสร้าง การทำลาย และการตื่นรู้ของวิญญาณ
                        </p>
                        {AETTIR.map(aett => (
                            <AettSection key={aett.id} aett={aett} />
                        ))}
                    </section>
                )}

                {/* ═══════════ TAB: Artifacts ═══════════ */}
                {activeTab === 'artifacts' && (
                    <section className="mb-12 animate-in fade-in duration-300">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">ประจักษ์พยานทางโบราณคดี</h2>
                        <p className="text-sm text-slate-500 mb-6">ร่องรอยของอักษรรูนในโลกวัตถุ</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {RUNE_ARTIFACTS.map((a, i) => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">{a.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-white">{a.name}</h4>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{a.date}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{a.location}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{a.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                            {renderBold(ARTIFACTS_NOTE)}
                        </div>
                    </section>
                )}

                {/* ═══════════ TAB: Rune Poems ═══════════ */}
                {activeTab === 'poems' && (
                    <section className="mb-12 animate-in fade-in duration-300">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">กวีนิพนธ์รูน (Rune Poems)</h2>
                        <p className="text-sm text-slate-500 mb-6">แหล่งข้อมูลปฐมภูมิที่สำคัญที่สุดในการตีความหมายของรูน ทำหน้าที่เป็นทั้งอุปกรณ์ช่วยจำและคลังความรู้ทางวัฒนธรรม</p>

                        <div className="space-y-4">
                            {RUNE_POEMS.map(poem => (
                                <div key={poem.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{poem.icon}</span>
                                        <div>
                                            <h4 className="text-sm font-bold" style={{ color: poem.color }}>{poem.title}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{poem.period}</span>
                                                <span className="text-[10px] text-slate-500">{poem.runeCount} รูน</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-2">{poem.description}</p>
                                    <div className="bg-slate-800/30 rounded-lg p-3 text-xs text-slate-500 italic border-l-2" style={{ borderColor: poem.color }}>
                                        「{poem.example}」
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                            {renderBold(POEMS_NOTE)}
                        </div>
                    </section>
                )}

                {/* ═══════════ GALDR ═══════════ */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{GALDR.icon}</span>
                        <h2 className="text-xl sm:text-2xl font-bold">{GALDR.title}</h2>
                    </div>
                    <p className="text-indigo-400 text-sm font-medium mb-6">{GALDR.subtitle}</p>

                    <div className="space-y-4 mb-4">
                        {GALDR.content.map((para, i) => (
                            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-sm sm:text-base text-slate-300 leading-relaxed">
                                {renderBold(para)}
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 text-sm text-slate-400 leading-relaxed">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="text-indigo-400" size={16} />
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Cipher Runes</span>
                        </div>
                        {renderBold(GALDR.cipher)}
                    </div>
                </section>

                {/* ═══════════ MODERN REVIVAL ═══════════ */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-amber-400" size={22} />
                        <h2 className="text-xl sm:text-2xl font-bold">{MODERN_REVIVAL.title}</h2>
                    </div>
                    <p className="text-amber-400/80 text-sm font-medium mb-6">{MODERN_REVIVAL.subtitle}</p>

                    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                        {MODERN_REVIVAL.timeline.map((item, i) => (
                            <div key={item.id} className="relative">
                                <div
                                    className="absolute -left-[1.9rem] w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                                    style={{ background: `${item.color}20`, border: `2px solid ${item.color}` }}
                                >
                                    {item.icon}
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 ml-2">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${item.color}15`, color: item.color }}>{item.year}</span>
                                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 leading-relaxed">
                        {renderBold(MODERN_REVIVAL.closing)}
                    </div>
                </section>

                {/* ═══════════ CONCLUSION ═══════════ */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">{CONCLUSION.icon}</span>
                        <h2 className="text-xl sm:text-2xl font-bold">{CONCLUSION.title}</h2>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/5 to-purple-500/5 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 space-y-4">
                        {CONCLUSION.paragraphs.map((para, i) => (
                            <p key={i} className="text-sm sm:text-base text-slate-300 leading-relaxed indent-8">
                                {renderBold(para)}
                            </p>
                        ))}

                        {/* Decorative runes */}
                        <div className="pt-6 text-center">
                            <div className="text-3xl sm:text-4xl tracking-[0.5em] text-slate-700 select-none">
                                ᚠᚢᚦᚨᚱᚲᚷᚹ ᚺᚾᛁᛃᛇᛈᛉᛊ ᛏᛒᛖᛗᛚᛜᛞᛟ
                            </div>
                            <p className="text-xs text-slate-600 mt-3 italic">Elder Futhark — 24 อักษรแห่งปัญญาโบราณ</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
