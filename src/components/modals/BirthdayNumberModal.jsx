import React, { useState, useEffect } from 'react';
import { X, Cake, Star, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';

const ZODIAC_DATA = [
    { name: 'มังกร', icon: '♑', start: [1, 1], end: [1, 19], element: 'ดิน', lucky: ['10', '28', '37'], color: 'from-slate-600 to-slate-800' },
    { name: 'กุมภ์', icon: '♒', start: [1, 20], end: [2, 18], element: 'ลม', lucky: ['11', '29', '47'], color: 'from-cyan-500 to-blue-600' },
    { name: 'มีน', icon: '♓', start: [2, 19], end: [3, 20], element: 'น้ำ', lucky: ['12', '07', '39'], color: 'from-indigo-500 to-purple-600' },
    { name: 'เมษ', icon: '♈', start: [3, 21], end: [4, 19], element: 'ไฟ', lucky: ['09', '18', '41'], color: 'from-red-500 to-orange-600' },
    { name: 'พฤษภ', icon: '♉', start: [4, 20], end: [5, 20], element: 'ดิน', lucky: ['06', '15', '50'], color: 'from-green-500 to-emerald-600' },
    { name: 'เมถุน', icon: '♊', start: [5, 21], end: [6, 20], element: 'ลม', lucky: ['05', '23', '32'], color: 'from-yellow-500 to-amber-600' },
    { name: 'กรกฎ', icon: '♋', start: [6, 21], end: [7, 22], element: 'น้ำ', lucky: ['02', '16', '27'], color: 'from-blue-400 to-cyan-500' },
    { name: 'สิงห์', icon: '♌', start: [7, 23], end: [8, 22], element: 'ไฟ', lucky: ['01', '19', '44'], color: 'from-orange-500 to-red-500' },
    { name: 'กันย์', icon: '♍', start: [8, 23], end: [9, 22], element: 'ดิน', lucky: ['04', '13', '36'], color: 'from-emerald-500 to-teal-600' },
    { name: 'ตุลย์', icon: '♎', start: [9, 23], end: [10, 22], element: 'ลม', lucky: ['07', '24', '42'], color: 'from-pink-400 to-rose-500' },
    { name: 'พิจิก', icon: '♏', start: [10, 23], end: [11, 21], element: 'น้ำ', lucky: ['08', '17', '69'], color: 'from-red-600 to-rose-700' },
    { name: 'ธนู', icon: '♐', start: [11, 22], end: [12, 21], element: 'ไฟ', lucky: ['03', '21', '55'], color: 'from-purple-500 to-violet-600' },
    { name: 'มังกร', icon: '♑', start: [12, 22], end: [12, 31], element: 'ดิน', lucky: ['10', '28', '37'], color: 'from-slate-600 to-slate-800' },
];

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const DAY_LUCKY = {
    0: { numbers: ['16', '61', '06'], planet: 'พระอาทิตย์', color: 'text-red-500' },
    1: { numbers: ['21', '12', '02'], planet: 'พระจันทร์', color: 'text-yellow-500' },
    2: { numbers: ['38', '83', '08'], planet: 'ดาวอังคาร', color: 'text-pink-500' },
    3: { numbers: ['47', '74', '04'], planet: 'ดาวพุธ', color: 'text-green-500' },
    4: { numbers: ['59', '95', '05'], planet: 'ดาวพฤหัสบดี', color: 'text-orange-500' },
    5: { numbers: ['65', '56', '06'], planet: 'ดาวศุกร์', color: 'text-cyan-500' },
    6: { numbers: ['79', '97', '07'], planet: 'ดาวเสาร์', color: 'text-purple-500' },
};

const getZodiac = (month, day) => {
    return ZODIAC_DATA.find(z => {
        const [sm, sd] = z.start;
        const [em, ed] = z.end;
        if (sm === em) return month === sm && day >= sd && day <= ed;
        if (month === sm) return day >= sd;
        if (month === em) return day <= ed;
        return false;
    });
};

const calculateNumerology = (day, month, year) => {
    // Life Path Number
    const digits = `${day}${month}${year}`.split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22) {
        sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }

    // Personal lucky numbers from birthdate
    const d = day.toString().padStart(2, '0');
    const m = month.toString().padStart(2, '0');
    const y = year.toString().slice(-2);

    const twoDigits = new Set();
    twoDigits.add(d);
    twoDigits.add(m);
    twoDigits.add(y);
    // Cross combinations
    twoDigits.add(`${d[0]}${m[1]}`);
    twoDigits.add(`${m[0]}${y[1]}`);
    // Sum-based
    const sumTwo = ((day + month) % 100).toString().padStart(2, '0');
    twoDigits.add(sumTwo);
    // Reverse
    twoDigits.add(d.split('').reverse().join(''));

    const threeDigits = new Set();
    threeDigits.add(`${d}${m[1]}`);
    threeDigits.add(`${m}${y[1]}`);
    threeDigits.add(`${d[0]}${m}`);
    const sumThree = ((day + month + parseInt(y)) % 1000).toString().padStart(3, '0');
    threeDigits.add(sumThree);

    return {
        lifePath: sum,
        twoDigit: [...twoDigits].filter(n => n.length === 2).slice(0, 6),
        threeDigit: [...threeDigits].filter(n => n.length === 3).slice(0, 4),
    };
};

const LIFE_PATH_MEANINGS = {
    1: 'ผู้นำโดยกำเนิด มีพลังสร้างสรรค์ โชคเข้าข้างเสมอ',
    2: 'อ่อนโยน มีสัญชาตญาณดี เก่งเรื่องจังหวะเวลา',
    3: 'สร้างสรรค์ มีเสน่ห์ ดึงดูดโชคลาภได้ง่าย',
    4: 'มั่นคง อดทน โชคจากการทำงานหนัก',
    5: 'รักอิสระ ชอบผจญภัย โชคจากการเดินทาง',
    6: 'รักครอบครัว เอาใจใส่คนรอบข้าง โชคจากคนใกล้ชิด',
    7: 'ลึกลับ มีสัมผัสที่หก สัญชาตญาณแม่นยำ',
    8: 'มีอำนาจ เก่งการเงิน โชคลาภก้อนใหญ่',
    9: 'จิตใจกว้าง เมตตา โชคจากการให้',
    11: 'ตัวเลขมาสเตอร์ สัญชาตญาณเหนือธรรมชาติ',
    22: 'ตัวเลขมาสเตอร์ สร้างสิ่งยิ่งใหญ่ได้',
};

export const BirthdayNumberModal = ({ isOpen, onClose }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [result, setResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [copiedNum, setCopiedNum] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setDay('');
            setMonth('');
            setYear('');
            setResult(null);
        }
    }, [isOpen]);

    const handleCalculate = () => {
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);

        if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2600) {
            alert('กรุณากรอกวันเกิดให้ถูกต้อง');
            return;
        }

        setIsCalculating(true);

        setTimeout(() => {
            const birthDate = new Date(y > 2500 ? y - 543 : y, m - 1, d);
            const zodiac = getZodiac(m, d);
            const dayOfWeek = birthDate.getDay();
            const dayInfo = DAY_LUCKY[dayOfWeek];
            const numerology = calculateNumerology(d, m, y > 2500 ? y : y + 543);

            setResult({
                zodiac,
                dayName: DAY_NAMES[dayOfWeek],
                dayInfo,
                numerology,
            });
            setIsCalculating(false);
        }, 800);
    };

    const handleCopy = (num) => {
        navigator.clipboard?.writeText(num).catch(() => {});
        setCopiedNum(num);
        setTimeout(() => setCopiedNum(null), 1500);
    };

    const handleReset = () => {
        setDay('');
        setMonth('');
        setYear('');
        setResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 sm:p-6 rounded-t-3xl sm:rounded-t-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <Cake size={24} className="text-yellow-200" />
                            <h3 className="text-xl font-bold text-white">เลขมงคลจากวันเกิด</h3>
                        </div>
                        <p className="text-amber-100 text-sm">
                            กรอกวันเดือนปีเกิด คำนวณเลขมงคลตามหลักเลขศาสตร์และราศี
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Birthday Input */}
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">กรอกวันเกิดของคุณ</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">วัน</label>
                                <input
                                    type="number"
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    placeholder="1-31"
                                    min="1" max="31"
                                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">เดือน</label>
                                <input
                                    type="number"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    placeholder="1-12"
                                    min="1" max="12"
                                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">ปี (พ.ศ./ค.ศ.)</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    placeholder="2530"
                                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleCalculate}
                                disabled={isCalculating || !day || !month || !year}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                                    isCalculating || !day || !month || !year
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-200/50'
                                }`}
                            >
                                {isCalculating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        กำลังคำนวณ...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        คำนวณเลขมงคล
                                    </>
                                )}
                            </button>
                            {result && (
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Zodiac & Day */}
                            <div className="grid grid-cols-2 gap-3">
                                {result.zodiac && (
                                    <div className={`p-4 rounded-xl bg-gradient-to-br ${result.zodiac.color} text-white`}>
                                        <p className="text-xs text-white/70">ราศี</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-2xl">{result.zodiac.icon}</span>
                                            <div>
                                                <p className="font-bold text-lg">{result.zodiac.name}</p>
                                                <p className="text-xs text-white/80">ธาตุ{result.zodiac.element}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                                    <p className="text-xs text-white/70">วันเกิด</p>
                                    <p className="font-bold text-lg mt-1">วัน{result.dayName}</p>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        {result.dayInfo.planet}
                                    </p>
                                </div>
                            </div>

                            {/* Life Path */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">{result.numerology.lifePath}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-600 font-semibold">เลขชะตาชีวิต (Life Path)</p>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            {LIFE_PATH_MEANINGS[result.numerology.lifePath] || 'ตัวเลขพิเศษ มีพลังมาก'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Lucky 2-digit */}
                            <div className="bg-white border border-amber-200 rounded-xl p-4">
                                <p className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                                    <Star size={16} className="text-amber-500" />
                                    เลขมงคล 2 ตัวประจำตัว
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.numerology.twoDigit.map((num, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleCopy(num)}
                                            className={`min-w-[48px] h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all active:scale-95 ${
                                                idx === 0
                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 shadow-md'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                            }`}
                                        >
                                            {copiedNum === num ? <Check size={16} className="text-green-500" /> : num}
                                        </button>
                                    ))}
                                </div>

                                {/* Zodiac bonus */}
                                {result.zodiac && (
                                    <div className="mt-3 pt-3 border-t border-amber-100">
                                        <p className="text-xs text-amber-600 mb-2">เลขเสริมจากราศี{result.zodiac.name}</p>
                                        <div className="flex gap-2">
                                            {result.zodiac.lucky.map((num, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleCopy(num)}
                                                    className="min-w-[44px] h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all active:scale-95"
                                                >
                                                    {copiedNum === num ? <Check size={14} className="text-green-500" /> : num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Day bonus */}
                                <div className="mt-3 pt-3 border-t border-amber-100">
                                    <p className="text-xs text-amber-600 mb-2">เลขเสริมจากวัน{result.dayName}</p>
                                    <div className="flex gap-2">
                                        {result.dayInfo.numbers.map((num, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleCopy(num)}
                                                className="min-w-[44px] h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all active:scale-95"
                                            >
                                                {copiedNum === num ? <Check size={14} className="text-green-500" /> : num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Lucky 3-digit */}
                            <div className="bg-white border border-purple-200 rounded-xl p-4">
                                <p className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
                                    <Star size={16} className="text-purple-500" />
                                    เลขมงคล 3 ตัวประจำตัว
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.numerology.threeDigit.map((num, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleCopy(num)}
                                            className={`min-w-[56px] h-10 px-3 rounded-xl flex items-center justify-center font-bold text-base border-2 transition-all active:scale-95 ${
                                                idx === 0
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-300 shadow-md'
                                                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                            }`}
                                        >
                                            {copiedNum === num ? <Check size={14} className="text-green-500" /> : num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        * คำนวณตามหลักเลขศาสตร์และโหราศาสตร์ เพื่อความบันเทิงเท่านั้น
                    </p>
                </div>
            </div>
        </div>
    );
};
