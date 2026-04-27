import React, { useMemo, useState } from 'react';
import {
    Activity,
    BarChart3,
    Check,
    Copy,
    Search,
    Target,
    TrendingUp,
    X,
} from 'lucide-react';

const toDigits = (value) => String(value ?? '').replace(/\D/g, '');

const isUsableSignal = (value) => value.length >= 2 && value.length <= 3;

const unique = (items) => [...new Set(items.filter(Boolean))];

const addSignal = (signals, rawNumber, weight, source, reason) => {
    const num = toDigits(rawNumber);
    if (!isUsableSignal(num)) return;

    if (!signals.has(num)) {
        signals.set(num, {
            num,
            score: 0,
            sources: new Set(),
            reasons: [],
        });
    }

    const signal = signals.get(num);
    signal.score += weight;
    signal.sources.add(source);
    if (reason && !signal.reasons.includes(reason)) {
        signal.reasons.push(reason);
    }
};

const addNumberList = (signals, numbers, weight, source, reason) => {
    if (!Array.isArray(numbers)) return;
    numbers.forEach((num, index) => {
        addSignal(signals, num, Math.max(weight - index, 1), source, reason);
    });
};

const extractNumbersFromText = (text) => (
    String(text ?? '')
        .match(/\d+/g)
        ?.filter((num) => num.length >= 2 && num.length <= 3) || []
);

const getSignalTier = (score) => {
    if (score >= 44) return { label: 'เด่นมาก', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 28) return { label: 'เด่น', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'น่าจับตา', className: 'bg-slate-50 text-slate-600 border-slate-200' };
};

const buildSignals = (draw) => {
    const signals = new Map();

    const finalPicks = draw?.conclusion?.finalPicks;
    addNumberList(signals, finalPicks?.twoDigit, 24, 'สรุปงวดนี้', 'อยู่ในชุดเลขเด่น 2 ตัวของระบบ');
    addNumberList(signals, finalPicks?.threeDigit, 18, 'สรุปงวดนี้', 'อยู่ในชุดเลขเด่น 3 ตัวของระบบ');

    [
        ['เชิงสถิติ', draw?.conclusion?.statistical?.numbers, 18],
        ['กระแสสังคม', draw?.conclusion?.eventDriven?.numbers, 15],
        ['สำนักดัง', draw?.conclusion?.consensus?.numbers, 16],
    ].forEach(([source, numbers, weight]) => {
        numbers?.forEach((item, index) => {
            addSignal(signals, item.num, Math.max(weight - index, 1), source, item.reason);
        });
    });

    draw?.historical?.labels?.forEach((num, index) => {
        const count = Number(draw?.historical?.data?.[index] || 1);
        addSignal(signals, num, 8 + count * 4, 'สถิติย้อนหลัง', `เคยออกซ้ำ ${count} ครั้งในชุดข้อมูลย้อนหลัง`);
    });

    draw?.sources?.forEach((source) => {
        addSignal(signals, source.numberHot, 14, source.name, `${source.name} วางเป็นเลขเด่น`);
        addNumberList(signals, source.two, 11, source.name, source.theme);
        addNumberList(signals, source.three, 9, source.name, source.theme);
        addNumberList(signals, source.numbers, 7, source.name, source.theme);
    });

    draw?.trends?.items?.forEach((item) => {
        extractNumbersFromText(item.label).forEach((num) => {
            addSignal(signals, num, 9, 'กระแสสังคม', item.label.replace(/^[^\dก-๙a-zA-Z]+/u, ''));
        });
    });

    draw?.events?.forEach((event) => {
        addNumberList(signals, event.hotNumbers, 8, event.title, 'เลขจากเหตุการณ์ประจำงวด');
    });

    draw?.vip_numbers?.forEach((item) => {
        addNumberList(signals, item.numbers, 8, item.name, item.event);
    });

    addNumberList(signals, draw?.horoscope?.year?.relatedPairs, 7, 'โหราศาสตร์ปี', 'เลขสัมพันธ์กับปีนักษัตร');
    addNumberList(signals, draw?.horoscope?.chineseCalendar?.twoPairs, 7, 'ปฏิทินจีน', 'เลขคู่จากปฏิทินจีน');
    addNumberList(signals, draw?.horoscope?.chineseCalendar?.threePairs, 6, 'ปฏิทินจีน', 'เลขสามตัวจากปฏิทินจีน');

    draw?.luckyPool?.forEach((num) => {
        addSignal(signals, num, 3, 'พูลสุ่มเลข', 'อยู่ในพูลเลขนำโชคของงวดนี้');
    });

    return [...signals.values()]
        .map((signal) => ({
            ...signal,
            sources: [...signal.sources],
            confidence: Math.min(96, Math.round(48 + signal.score * 1.35)),
        }))
        .sort((a, b) => b.score - a.score || a.num.localeCompare(b.num));
};

const buildDigitProfile = (signals) => {
    const counts = new Map();

    signals.slice(0, 10).forEach((signal) => {
        signal.num.split('').forEach((digit) => {
            counts.set(digit, (counts.get(digit) || 0) + 1);
        });
    });

    return [...counts.entries()]
        .map(([digit, count]) => ({ digit, count }))
        .sort((a, b) => b.count - a.count || a.digit.localeCompare(b.digit))
        .slice(0, 5);
};

const NumberButton = ({ num, copiedNum, onCopy, featured = false }) => (
    <button
        type="button"
        onClick={() => onCopy(num)}
        className={`min-w-[52px] h-12 rounded-xl flex items-center justify-center font-bold border transition-all active:scale-95 ${
            featured
                ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
                : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
        }`}
    >
        {copiedNum === num ? <Check size={16} className="text-emerald-500" /> : num}
    </button>
);

export const LottoSignalScannerModal = ({ isOpen, onClose, draw }) => {
    const [query, setQuery] = useState('');
    const [copiedNum, setCopiedNum] = useState(null);

    const signals = useMemo(() => buildSignals(draw), [draw]);
    const digitProfile = useMemo(() => buildDigitProfile(signals), [signals]);
    const queryNumber = toDigits(query).slice(0, 3);
    const directMatch = signals.find((signal) => signal.num === queryNumber);
    const reverseMatch = queryNumber.length === 2
        ? signals.find((signal) => signal.num === queryNumber.split('').reverse().join(''))
        : null;
    const relatedMatches = queryNumber
        ? signals
            .filter((signal) => !directMatch || signal.num !== directMatch.num)
            .filter((signal) => queryNumber.split('').some((digit) => signal.num.includes(digit)))
            .slice(0, 4)
        : [];
    const reversePairs = unique(
        signals
            .filter((signal) => signal.num.length === 2)
            .slice(0, 8)
            .map((signal) => signal.num.split('').reverse().join(''))
            .filter((num, index, arr) => num !== signals[index]?.num && arr.indexOf(num) === index)
    ).slice(0, 5);

    const handleCopy = (num) => {
        navigator.clipboard?.writeText(num).catch(() => {});
        setCopiedNum(num);
        setTimeout(() => setCopiedNum(null), 1400);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            >
                <div className="bg-slate-950 p-5 sm:p-6 relative border-b border-amber-400/20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="ปิด"
                    >
                        <X size={20} className="text-white/70" />
                    </button>

                    <div className="flex items-start gap-4 pr-12">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                            <BarChart3 size={24} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-amber-300 text-[10px] font-bold tracking-[0.22em] uppercase mb-1">
                                Signal Scanner
                            </p>
                            <h3 className="text-2xl font-semibold text-white tracking-tight">สแกนเลขชนข้อมูล</h3>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                จัดอันดับเลขจากสถิติย้อนหลัง สำนักดัง กระแสสังคม และพูลเลขนำโชคของงวดนี้
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {signals.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {signals.slice(0, 3).map((signal, index) => {
                                    const tier = getSignalTier(signal.score);
                                    return (
                                        <div
                                            key={signal.num}
                                            className={`rounded-2xl border p-4 ${index === 0 ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${index === 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                                                    Rank {index + 1}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${index === 0 ? 'bg-white/10 text-amber-200 border-white/10' : tier.className}`}>
                                                    {tier.label}
                                                </span>
                                            </div>
                                            <div className="flex items-end justify-between gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(signal.num)}
                                                    className={`text-5xl font-light font-mono tracking-wider transition-transform active:scale-95 ${index === 0 ? 'text-white' : 'text-slate-900'}`}
                                                >
                                                    {copiedNum === signal.num ? <Check size={38} className="text-emerald-400" /> : signal.num}
                                                </button>
                                                <div className="text-right">
                                                    <p className={`text-xs ${index === 0 ? 'text-slate-500' : 'text-slate-400'}`}>ความแรง</p>
                                                    <p className={`text-xl font-semibold ${index === 0 ? 'text-amber-300' : 'text-amber-600'}`}>
                                                        {signal.confidence}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`mt-4 h-1.5 rounded-full overflow-hidden ${index === 0 ? 'bg-white/10' : 'bg-slate-200'}`}>
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
                                                    style={{ width: `${signal.confidence}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-4">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <Target size={17} className="text-amber-500" />
                                                อันดับเลขน่าจับตา
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">กดที่ตัวเลขเพื่อคัดลอก</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {signals.slice(0, 8).map((signal, index) => {
                                            const tier = getSignalTier(signal.score);
                                            return (
                                                <div key={signal.num} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/70">
                                                    <div className="flex items-center gap-3 sm:w-36">
                                                        <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">
                                                            {index + 1}
                                                        </span>
                                                        <NumberButton num={signal.num} copiedNum={copiedNum} onCopy={handleCopy} featured={index === 0} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tier.className}`}>
                                                                {tier.label}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {signal.sources.length} แหล่งข้อมูล
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                                            {signal.reasons[0] || signal.sources.join(', ')}
                                                        </p>
                                                    </div>
                                                    <div className="sm:w-24">
                                                        <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                                                            <div
                                                                className="h-full bg-amber-400 rounded-full"
                                                                style={{ width: `${signal.confidence}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-1 text-right">{signal.confidence}/100</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                            <Activity size={17} className="text-emerald-500" />
                                            ตัววิ่งเด่น
                                        </h4>
                                        <div className="grid grid-cols-5 gap-2">
                                            {digitProfile.map((item) => (
                                                <div key={item.digit} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                                                    <p className="text-2xl font-light text-slate-900 font-mono">{item.digit}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{item.count} จุด</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                            <TrendingUp size={17} className="text-indigo-500" />
                                            เลขกลับที่ควรเผื่อ
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {reversePairs.map((num, index) => (
                                                <NumberButton key={num} num={num} copiedNum={copiedNum} onCopy={handleCopy} featured={index === 0} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                            <Search size={17} className="text-slate-500" />
                                            เช็กเลขที่เล็งไว้
                                        </h4>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={query}
                                            onChange={(event) => setQuery(toDigits(event.target.value).slice(0, 3))}
                                            placeholder="กรอก 2-3 ตัว"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                        />
                                        {queryNumber && (
                                            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                                                {directMatch ? (
                                                    <p className="text-sm text-slate-700">
                                                        <span className="font-semibold text-emerald-600">{queryNumber}</span> ติดอันดับเลขเด่น ความแรง {directMatch.confidence}/100
                                                    </p>
                                                ) : reverseMatch ? (
                                                    <p className="text-sm text-slate-700">
                                                        เลขกลับ <span className="font-semibold text-amber-600">{reverseMatch.num}</span> มีสัญญาณเด่น ความแรง {reverseMatch.confidence}/100
                                                    </p>
                                                ) : relatedMatches.length > 0 ? (
                                                    <p className="text-sm text-slate-700">
                                                        ยังไม่เจอตรงตัว แต่มีเลขใกล้เคียง: {relatedMatches.map((item) => item.num).join(', ')}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-slate-500">ยังไม่พบสัญญาณเด่นในชุดข้อมูลรอบนี้</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <BarChart3 size={40} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลสำหรับสแกนเลขชน</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-slate-100 text-center bg-white">
                    <p className="text-xs text-slate-400">
                        * คะแนนเป็นการจัดลำดับสัญญาณจากข้อมูลในระบบ เพื่อความบันเทิงและใช้วิจารณญาณ
                    </p>
                </div>
            </div>
        </div>
    );
};
