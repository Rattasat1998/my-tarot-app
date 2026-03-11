import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Star, Sparkles, Hash, Globe, BookOpen } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';
import {
    NUM_OVERVIEW,
    WORLD_SYSTEMS,
    COMPARISON_TABLE,
    CORE_NUMBERS,
    NUMBER_MEANINGS,
    MASTER_NUMBERS,
    MASTER_NOTE,
    THAI_PLANET_NUMBERS,
    THAI_LETTER_VALUES,
    THAI_NAME_INFLUENCE,
    LUCKY_PAIRS,
    UNLUCKY_PAIRS,
    CAR_PLATE_TABLE,
    HOUSE_NUMBERS,
    HOUSE_NOTE,
    SOCIAL_ANALYSIS,
    CONCLUSION,
} from '../data/numerologyData';

/* ──────────────────────────── helpers ──────────────────────────── */
const renderBold = (text) => {
    if (!text) return text;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="text-amber-300 font-semibold">{p}</strong> : p));
};

/* ──────────────────────────── sub-components ──────────────────────────── */

function SystemCard({ sys, isOpen, toggle }) {
    return (
        <div className={`rounded-2xl border ${sys.borderColor} bg-gradient-to-br ${sys.gradient} backdrop-blur-sm overflow-hidden transition-all duration-300`}>
            <button onClick={toggle} className="w-full text-left px-6 py-5 flex items-center gap-4">
                <span className="text-3xl">{sys.icon}</span>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{sys.title}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{sys.origin}</p>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            {isOpen && (
                <div className="px-6 pb-6 space-y-4 animate-fadeIn">
                    {/* highlights */}
                    <div className="grid grid-cols-2 gap-2">
                        {sys.highlights.map((h, i) => (
                            <div key={i} className="bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                                <div className="text-[10px] uppercase tracking-widest text-slate-500">{h.label}</div>
                                <div className="text-sm font-semibold text-white mt-0.5">{h.value}</div>
                            </div>
                        ))}
                    </div>
                    {/* paragraphs */}
                    <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                        {sys.content.map((p, i) => (
                            <p key={i}>{renderBold(p)}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function NumberCard({ item, isOpen, toggle }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all">
            <button onClick={toggle} className="w-full text-left px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black" style={{ background: `${item.color}20`, color: item.color }}>
                    {item.num}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <span>{item.icon}</span>
                        <span>{item.positive.split(',')[0]}</span>
                    </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-2 animate-fadeIn">
                    <div className="text-xs">
                        <span className="text-emerald-400 font-semibold">✦ ด้านบวก:</span>
                        <span className="text-slate-300 ml-1">{item.positive}</span>
                    </div>
                    <div className="text-xs">
                        <span className="text-rose-400 font-semibold">✦ ด้านมืด:</span>
                        <span className="text-slate-300 ml-1">{item.shadow}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━ MAIN PAGE ━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function NumerologyPage() {
    const navigate = useNavigate();
    const [openSystem, setOpenSystem] = useState(null);
    const [openNumber, setOpenNumber] = useState(null);
    const [openMaster, setOpenMaster] = useState(null);
    const [activeTab, setActiveTab] = useState('meanings');
    const [showAllLucky, setShowAllLucky] = useState(false);
    const [openCore, setOpenCore] = useState(null);

    usePageSEO({
        title: 'เลขศาสตร์: ศาสตร์แห่งตัวเลขจากทั่วโลก',
        description: 'เจาะลึกเลขศาสตร์ 4 ระบบโลก คาลเดียน พีทาโกรัส คับบาลาห์ จีน ความหมายเลข 1-9 Master Numbers เลขศาสตร์ไทย ตารางอักษรไทย ทะเบียนรถมงคล บ้านเลขที่มงคล',
        keywords: 'เลขศาสตร์, ตัวเลขมงคล, คาลเดียน, พีทาโกรัส, เลขนำโชค, ทะเบียนรถ, บ้านเลขที่, Master Numbers, numerology',
        ogImage: 'https://satduangdao.com/numerology-hero.png',
        path: '/numerology-article',
    });

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#0B0D17] text-white">
            {/* ───────── HERO ───────── */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <img src={NUM_OVERVIEW.heroImage} alt="Numerology Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-[#0B0D17]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D17]/40 to-transparent" />

                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors md:top-8 md:left-8">
                    <ArrowLeft size={20} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Hash size={14} className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">Numerology</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight max-w-3xl">
                        <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">{NUM_OVERVIEW.title}</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-400 mt-3 max-w-2xl leading-relaxed">{NUM_OVERVIEW.subtitle}</p>
                </div>
            </div>

            {/* ───────── CONTENT ───────── */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 pb-20 space-y-16">

                {/* ── Intro ── */}
                <section className="space-y-4 -mt-4">
                    <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8">
                        <div className="flex items-start gap-3">
                            <Sparkles size={20} className="text-amber-400 mt-1 shrink-0" />
                            <p className="text-sm md:text-base text-slate-300 leading-relaxed italic">{NUM_OVERVIEW.tagline}</p>
                        </div>
                    </div>
                    <div className="text-sm md:text-base text-slate-300 leading-relaxed space-y-3">
                        {NUM_OVERVIEW.intro.split('\n\n').map((p, i) => (
                            <p key={i}>{renderBold(p)}</p>
                        ))}
                    </div>
                </section>

                {/* ── Section: World Systems ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/20"><Globe size={20} className="text-amber-400" /></div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">ระบบเลขศาสตร์โลก 4 ระบบ</h2>
                            <p className="text-xs text-slate-500 mt-1">ประวัติศาสตร์และวิวัฒนาการจากอารยธรรมโบราณ</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {WORLD_SYSTEMS.map((sys) => (
                            <SystemCard key={sys.id} sys={sys} isOpen={openSystem === sys.id} toggle={() => setOpenSystem(openSystem === sys.id ? null : sys.id)} />
                        ))}
                    </div>
                </section>

                {/* ── Comparison Table ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20"><BookOpen size={20} className="text-blue-400" /></div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">เปรียบเทียบคาลเดียน vs พีทาโกรัส</h2>
                            <p className="text-xs text-slate-500 mt-1">ความแตกต่างเชิงโครงสร้างระหว่างสองระบบหลัก</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="text-left px-4 py-3 text-slate-400 font-semibold">คุณลักษณะ</th>
                                    <th className="text-left px-4 py-3 text-amber-400 font-semibold">คาลเดียน</th>
                                    <th className="text-left px-4 py-3 text-blue-400 font-semibold">พีทาโกรัส</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_TABLE.map((row, i) => (
                                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-slate-300 font-medium">{row.attribute}</td>
                                        <td className="px-4 py-3 text-slate-400">{row.chaldean}</td>
                                        <td className="px-4 py-3 text-slate-400">{row.pythagorean}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── Core Numbers ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/20"><Star size={20} className="text-emerald-400" /></div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">แผนภูมิเลขศาสตร์ส่วนบุคคล</h2>
                            <p className="text-xs text-slate-500 mt-1">องค์ประกอบหลักในการวิเคราะห์ชีวิต</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {CORE_NUMBERS.map((cn) => (
                            <div key={cn.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                <button onClick={() => setOpenCore(openCore === cn.id ? null : cn.id)} className="w-full text-left px-5 py-4 flex items-center gap-4">
                                    <span className="text-2xl">{cn.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-base font-bold text-white">{cn.title}</div>
                                        <div className="text-xs text-slate-500">{cn.titleEn} — {cn.subtitle}</div>
                                    </div>
                                    {openCore === cn.id ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                                </button>
                                {openCore === cn.id && (
                                    <div className="px-5 pb-5 space-y-4 animate-fadeIn">
                                        <p className="text-sm text-slate-300 leading-relaxed">{cn.description}</p>
                                        {cn.calculation && (
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">วิธีคำนวณ</div>
                                                <p className="text-sm text-slate-300">{cn.calculation}</p>
                                            </div>
                                        )}
                                        {cn.vowels && (
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">ค่าสระ</div>
                                                <p className="text-sm text-slate-300 font-mono">{cn.vowels}</p>
                                            </div>
                                        )}
                                        {cn.example && (
                                            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ตัวอย่างการคำนวณ</div>
                                                <div className="text-sm text-slate-400">เกิดวันที่ <strong className="text-white">{cn.example.birthdate}</strong></div>
                                                <div className="space-y-1.5">
                                                    {cn.example.steps.map((s, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <span className="text-xs font-bold w-14 text-slate-500">{s.label}:</span>
                                                            <span className="text-slate-300 font-mono text-xs">{s.calc}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-2 border-t border-white/10">
                                                    <p className="text-sm text-emerald-300 font-semibold">✦ {cn.example.result}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Tabbed: Meanings / Master Numbers ── */}
                <section className="space-y-6">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'meanings', label: 'ความหมายเลข 1-9', icon: <Hash size={14} /> },
                            { id: 'master', label: 'Master Numbers', icon: <Sparkles size={14} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'meanings' && (
                        <div className="space-y-2">
                            {NUMBER_MEANINGS.map((item) => (
                                <NumberCard key={item.num} item={item} isOpen={openNumber === item.num} toggle={() => setOpenNumber(openNumber === item.num ? null : item.num)} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'master' && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <Sparkles size={18} className="text-violet-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-slate-300 leading-relaxed">{renderBold(MASTER_NOTE)}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {MASTER_NUMBERS.map((mn) => (
                                    <div key={mn.num} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${mn.gradient} overflow-hidden`}>
                                        <button onClick={() => setOpenMaster(openMaster === mn.num ? null : mn.num)} className="w-full text-left px-5 py-4 flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black" style={{ background: `${mn.color}15`, color: mn.color, border: `1px solid ${mn.color}30` }}>
                                                {mn.num}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-base font-bold text-white flex items-center gap-2">
                                                    <span>{mn.icon}</span> {mn.title}
                                                </div>
                                                <div className="text-xs text-slate-500">{mn.titleEn}</div>
                                            </div>
                                            {openMaster === mn.num ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                                        </button>
                                        {openMaster === mn.num && (
                                            <div className="px-5 pb-5 space-y-3 animate-fadeIn">
                                                <p className="text-sm text-slate-300 leading-relaxed">{mn.content}</p>
                                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                                                    <div className="text-xs font-bold text-rose-400 mb-1">⚠️ ความท้าทาย</div>
                                                    <p className="text-xs text-slate-400">{mn.challenge}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* ── Thai Numerology ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/20">
                            <span className="text-rose-400 text-lg">🇹🇭</span>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">เลขศาสตร์ไทย</h2>
                            <p className="text-xs text-slate-500 mt-1">การหลอมรวมระหว่างดวงดาวและอักขระ</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">ในประเทศไทย เลขศาสตร์มีเอกลักษณ์เฉพาะตัวโดยการนำความรู้เรื่อง <strong className="text-amber-300">"ดาวพระเคราะห์"</strong> จากโหราศาสตร์ไทยมาเป็นแกนกลางในการตีความตัวเลข</p>

                    {/* Planet grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {THAI_PLANET_NUMBERS.map((tp) => (
                            <div key={tp.num} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.06] transition-colors">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${tp.color}15` }}>
                                    {tp.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black" style={{ color: tp.color }}>{tp.num}</span>
                                        <span className="text-sm font-bold text-white">{tp.planet}</span>
                                        {tp.element !== '—' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">{tp.element}</span>}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tp.meaning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Thai Letter Table ── */}
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        📝 ตารางแทนค่าอักษรไทย
                        <span className="text-xs text-slate-500 font-normal">(ระบบมาตรฐาน)</span>
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-4 py-3 text-left text-amber-400 font-bold w-16">เลข</th>
                                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">ตัวอักษรและสระ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {THAI_LETTER_VALUES.map((row, i) => (
                                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 font-black text-sm">{row.num}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 leading-relaxed">{row.letters}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Name influence */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-300">อิทธิพลของผลรวมชื่อ</h4>
                        <div className="space-y-2">
                            {THAI_NAME_INFLUENCE.map((ni, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                                    <div className="w-14 h-10 rounded-lg flex items-center justify-center text-lg font-black" style={{ background: `${ni.color}15`, color: ni.color }}>
                                        {ni.pct}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">{ni.label}</div>
                                        <div className="text-xs text-slate-400">{ni.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Lucky / Unlucky Pairs ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/20"><Sparkles size={20} className="text-emerald-400" /></div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">เลขผสมมงคล & เลขเสีย</h2>
                            <p className="text-xs text-slate-500 mt-1">การวิเคราะห์ความหมายตัวเลขสองหลัก (กําลังดวงดาว)</p>
                        </div>
                    </div>

                    {/* Lucky */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">✦ กลุ่มตัวเลขมงคลสูง</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(showAllLucky ? LUCKY_PAIRS : LUCKY_PAIRS.slice(0, 4)).map((lp, i) => (
                                <div key={i} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
                                    <span className="text-lg">{lp.icon}</span>
                                    <div>
                                        <div className="text-sm font-black text-emerald-300 font-mono">{lp.pair}</div>
                                        <p className="text-xs text-slate-400 mt-0.5">{lp.meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {LUCKY_PAIRS.length > 4 && (
                            <button onClick={() => setShowAllLucky(!showAllLucky)} className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 mx-auto">
                                {showAllLucky ? 'แสดงน้อยลง' : `ดูเพิ่มอีก ${LUCKY_PAIRS.length - 4} คู่`}
                                {showAllLucky ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        )}
                    </div>

                    {/* Unlucky */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">⚠️ กลุ่มตัวเลขที่ควรระวัง (เลขเสีย)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {UNLUCKY_PAIRS.map((up, i) => (
                                <div key={i} className="flex items-start gap-3 bg-rose-500/5 border border-rose-500/15 rounded-xl px-4 py-3">
                                    <span className="text-lg">{up.icon}</span>
                                    <div>
                                        <div className="text-sm font-black text-rose-300 font-mono">{up.pair}</div>
                                        <p className="text-xs text-slate-400 mt-0.5">{up.meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Practical Usage: Car Plate & House ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/20">
                            <span className="text-lg">🏠</span>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">การประยุกต์ใช้ในชีวิตจริง</h2>
                            <p className="text-xs text-slate-500 mt-1">ทะเบียนรถมงคล & บ้านเลขที่</p>
                        </div>
                    </div>

                    {/* Car plate table */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-300">🚗 เลขทะเบียนรถมงคล</h4>
                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="px-4 py-3 text-left text-slate-400 font-semibold">ประเภท</th>
                                        <th className="px-4 py-3 text-left text-amber-400 font-semibold">คู่เลขมงคล</th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-semibold">ผลลัพธ์</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CAR_PLATE_TABLE.map((row, i) => (
                                        <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-slate-300 font-medium">{row.icon} {row.purpose}</td>
                                            <td className="px-4 py-3 text-amber-300 font-mono text-xs">{row.pairs}</td>
                                            <td className="px-4 py-3 text-slate-400">{row.result}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* House numbers */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-300">🏡 จิตวิญญาณแห่งบ้านเลขที่มงคล</h4>
                        <p className="text-xs text-slate-400">วิธีคำนวณ: นำตัวเลขทุกหลักมารวมกันจนเหลือเลขหลักเดียว (1-9)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {HOUSE_NUMBERS.map((hn, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400 text-xl font-black shrink-0">{hn.sum}</div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 mb-1">{hn.icon} ผลรวม {hn.sum}</div>
                                        <p className="text-xs text-slate-300">{hn.meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <p className="text-xs text-amber-200/80 leading-relaxed">{renderBold(HOUSE_NOTE)}</p>
                        </div>
                    </div>
                </section>

                {/* ── Social Analysis ── */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-500/20">
                            <span className="text-lg">🔍</span>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">{SOCIAL_ANALYSIS.title}</h2>
                            <p className="text-xs text-slate-500 mt-1">{SOCIAL_ANALYSIS.subtitle}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {SOCIAL_ANALYSIS.sections.map((sec) => (
                            <div key={sec.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{sec.icon}</span>
                                    <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{renderBold(sec.content)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Conclusion ── */}
                <section className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-emerald-500/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{CONCLUSION.icon}</span>
                            <div>
                                <h2 className="text-xl font-bold text-white">{CONCLUSION.title}</h2>
                                <p className="text-xs text-slate-500">{CONCLUSION.subtitle}</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                            {CONCLUSION.paragraphs.map((p, i) => (
                                <p key={i}>{renderBold(p)}</p>
                            ))}
                        </div>
                        {/* Decorative numbers */}
                        <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                <span key={n} className="text-lg font-black text-amber-500/40 hover:text-amber-400 transition-colors cursor-default">{n}</span>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
        </div>
    );
}
