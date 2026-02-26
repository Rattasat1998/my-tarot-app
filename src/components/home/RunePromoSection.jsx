import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Hexagon, Star, Zap, Type } from 'lucide-react';

// Floating rune symbols for background animation
const RUNE_SYMBOLS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛞ', 'ᛟ'];

// 3 reading modes with preview data
const RUNE_MODES = [
    {
        id: 'single',
        title: 'รูนรายวัน',
        subtitle: '1 ก้อน',
        description: 'รับข้อความนำทางประจำวัน',
        icon: '🪨',
        cost: 'ฟรี!',
        costClass: 'from-green-500 to-emerald-500',
        highlight: true,
    },
    {
        id: 'three',
        title: 'อดีต ปัจจุบัน อนาคต',
        subtitle: '3 ก้อน',
        description: 'มองเห็นเส้นทางชีวิตผ่านรูน 3 ตำแหน่ง',
        icon: '🔮',
        cost: '3 เครดิต',
        costClass: 'from-amber-500 to-orange-500',
        highlight: false,
    },
    {
        id: 'five',
        title: 'Rune Cross',
        subtitle: '5 ก้อน',
        description: 'การทำนายเชิงลึก 5 ตำแหน่ง — สถานการณ์ อุปสรรค สิ่งช่วยเหลือ รากฐาน ผลลัพธ์',
        icon: '◆',
        cost: '5 เครดิต',
        costClass: 'from-purple-500 to-indigo-500',
        highlight: false,
    },
];

// Latin → Elder Futhark mapping
const LATIN_TO_RUNE = {
    a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ',
    g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ',
    m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ',
    s: 'ᛊ', t: 'ᛏ', u: 'ᚢ', v: 'ᚠ', w: 'ᚹ', x: 'ᚲᛊ',
    y: 'ᛃ', z: 'ᛉ',
};

const convertToRunes = (text) => {
    return text
        .toLowerCase()
        .split('')
        .map(char => LATIN_TO_RUNE[char] || (char === ' ' ? ' ' : ''))
        .join('');
};

// Animated floating rune component
const FloatingRune = ({ symbol, delay, duration, x, y, size }) => (
    <span
        className="absolute text-emerald-400/[0.07] font-mono select-none pointer-events-none"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            fontSize: `${size}rem`,
            animation: `runeFloat ${duration}s ease-in-out ${delay}s infinite alternate, runePulse ${duration * 0.7}s ease-in-out ${delay}s infinite`,
        }}
    >
        {symbol}
    </span>
);

export const RunePromoSection = () => {
    const navigate = useNavigate();
    const [activeRune, setActiveRune] = useState(0);
    const [isHovered, setIsHovered] = useState(null);
    const [nameInput, setNameInput] = useState('');

    // Convert input name to rune characters
    const runeResult = useMemo(() => {
        if (!nameInput.trim()) return '';
        return convertToRunes(nameInput);
    }, [nameInput]);

    // Split rune result into individual characters for animated display
    const runeChars = useMemo(() => {
        if (!runeResult) return [];
        return runeResult.split('').map((char, i) => ({ char, id: `${nameInput}-${i}` }));
    }, [runeResult, nameInput]);

    // Cycle through featured runes for the animated stone display
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveRune(prev => (prev + 1) % 6);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const featuredRunes = RUNE_SYMBOLS.slice(0, 6);

    return (
        <section className="relative w-full py-20 sm:py-28 overflow-hidden">
            {/* ═══════════════════════════════════ */}
            {/* ANIMATED BACKGROUND */}
            {/* ═══════════════════════════════════ */}

            {/* Deep teal/green glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/[0.06] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-500/[0.05] rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/[0.04] rounded-full blur-[100px]" />
            </div>

            {/* Floating rune symbols scattered in background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {RUNE_SYMBOLS.slice(0, 16).map((symbol, i) => (
                    <FloatingRune
                        key={i}
                        symbol={symbol}
                        delay={i * 0.4}
                        duration={4 + (i % 3) * 2}
                        x={5 + (i * 6) % 90}
                        y={5 + ((i * 17) % 85)}
                        size={1.5 + (i % 4) * 0.5}
                    />
                ))}
            </div>

            {/* Decorative runic border lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            {/* ═══════════════════════════════════ */}
            {/* CONTENT */}
            {/* ═══════════════════════════════════ */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

                {/* Section Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                        <Hexagon size={14} className="text-emerald-400" />
                        <span className="text-emerald-300 text-xs uppercase tracking-[0.2em] font-medium">บริการใหม่ • Elder Futhark</span>
                    </div>
                </div>

                {/* Main Title */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight">
                        <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                            ดูดวงรูนโบราณ
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-400 mt-3 max-w-2xl mx-auto">
                        อักษรรูน Elder Futhark — 24 อักษรแห่งโชคชะตา
                        <br className="hidden sm:block" />
                        ศาสตร์โบราณจากสแกนดิเนเวียอายุกว่า 2,000 ปี
                    </p>
                </div>

                {/* ═══════════════════════════════════ */}
                {/* NAME TO RUNE CONVERTER */}
                {/* ═══════════════════════════════════ */}
                <div className="max-w-xl mx-auto mb-10 sm:mb-14">
                    <div className="relative rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 sm:p-6 backdrop-blur-sm">
                        {/* Subtle glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-cyan-600/10 rounded-2xl blur-xl pointer-events-none" />

                        <div className="relative z-10">
                            {/* Label */}
                            <div className="flex items-center gap-2 mb-3">
                                <Type size={14} className="text-emerald-400" />
                                <span className="text-xs text-emerald-300/80 uppercase tracking-widest font-medium">แปลงชื่อเป็นอักษรรูน</span>
                            </div>

                            {/* Input */}
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value.slice(0, 20))}
                                placeholder="พิมพ์ชื่อภาษาอังกฤษ เช่น Alex"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/40 text-white placeholder-slate-500 text-base focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                                maxLength={20}
                            />

                            {/* Rune Output */}
                            {runeChars.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {runeChars.map((item, i) => (
                                            item.char === ' ' ? (
                                                <div key={item.id} className="w-3" />
                                            ) : (
                                                <div
                                                    key={item.id}
                                                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-900/10"
                                                    style={{
                                                        animation: `runeReveal 0.4s ease-out ${i * 0.08}s both`,
                                                        clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 92%, 85% 100%, 15% 100%, 0% 92%, 0% 15%)',
                                                    }}
                                                >
                                                    <span className="text-xl sm:text-2xl font-mono text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                                                        {item.char}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <p className="text-center text-[11px] text-slate-500 mt-3">
                                        "{nameInput}" ในอักษร Elder Futhark
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════ */}
                {/* ANIMATED RUNE STONE SHOWCASE */}
                {/* ═══════════════════════════════════ */}
                <div className="flex justify-center items-center gap-3 sm:gap-5 my-10 sm:my-14">
                    {featuredRunes.map((symbol, i) => {
                        const isActive = i === activeRune;
                        return (
                            <div
                                key={i}
                                className={`relative transition-all duration-700 ease-out ${isActive
                                    ? 'scale-125 sm:scale-[1.4] z-10'
                                    : Math.abs(i - activeRune) === 1
                                        ? 'scale-100 opacity-70'
                                        : 'scale-90 opacity-40'
                                    }`}
                            >
                                {/* Glow behind active stone */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-2xl scale-150 animate-pulse" />
                                )}
                                {/* Stone */}
                                <div
                                    className={`relative w-14 h-16 sm:w-18 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-700 ${isActive
                                        ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 border-2 border-emerald-400/50 shadow-xl shadow-emerald-500/20'
                                        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-600/30'
                                        }`}
                                    style={{
                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 90%, 80% 100%, 20% 100%, 0% 90%, 0% 20%)',
                                    }}
                                >
                                    <span
                                        className={`font-mono transition-all duration-700 ${isActive
                                            ? 'text-2xl sm:text-3xl text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                                            : 'text-xl sm:text-2xl text-slate-400'
                                            }`}
                                    >
                                        {symbol}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ═══════════════════════════════════ */}
                {/* READING MODE CARDS */}
                {/* ═══════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10">
                    {RUNE_MODES.map((mode) => (
                        <div
                            key={mode.id}
                            onMouseEnter={() => setIsHovered(mode.id)}
                            onMouseLeave={() => setIsHovered(null)}
                            className={`group relative rounded-2xl border p-6 sm:p-7 transition-all duration-500 overflow-hidden ${isHovered === mode.id
                                ? 'bg-slate-800/70 border-emerald-500/40 scale-[1.03] shadow-xl shadow-emerald-900/20'
                                : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50'
                                }`}
                        >
                            {/* Shimmer overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Cost badge */}
                            <div className={`absolute top-4 right-4 text-[10px] px-3 py-1 rounded-full font-bold bg-gradient-to-r ${mode.costClass} text-white shadow-lg`}>
                                {mode.cost}
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="text-3xl mb-3 transition-transform duration-500 group-hover:scale-110">
                                    {mode.icon}
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    {mode.title}
                                </h3>
                                <p className="text-xs text-emerald-400/80 font-medium mb-2">
                                    สุ่ม {mode.subtitle}
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                    {mode.description}
                                </p>
                            </div>

                            {/* Bottom arrow indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <ArrowRight size={16} className="text-emerald-400" />
                            </div>

                            {/* Highlight badge for daily free */}
                            {mode.highlight && (
                                <div className="absolute -top-1 -left-1">
                                    <div className="relative">
                                        <Star size={28} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
                                        <Zap size={12} className="absolute top-[8px] left-[8px] text-yellow-900" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════ */}
                {/* CTA BUTTON */}
                {/* ═══════════════════════════════════ */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/runes')}
                        className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        เริ่มดึงรูนเลย
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-4">
                        <span>🪨 รูนรายวันฟรี!</span>
                        <span>⚡ ผลทันที</span>
                        <span>🔮 Elder Futhark ครบ 24 ตัว</span>
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════ */}
            {/* INLINE KEYFRAMES */}
            {/* ═══════════════════════════════════ */}
            <style>{`
                @keyframes runeFloat {
                    0% { transform: translateY(0px) rotate(0deg); }
                    100% { transform: translateY(-20px) rotate(8deg); }
                }
                @keyframes runePulse {
                    0%, 100% { opacity: 0.07; }
                    50% { opacity: 0.15; }
                }
                @keyframes runeReveal {
                    0% { opacity: 0; transform: scale(0.5) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </section>
    );
};
