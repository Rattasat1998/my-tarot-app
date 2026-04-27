import React, { useMemo, useState } from 'react';
import {
    Check,
    Clock,
    Compass,
    Copy,
    Gem,
    ShieldCheck,
    Sparkles,
    Star,
    X,
} from 'lucide-react';

const BOOST_DAYS = [
    {
        id: 0,
        name: 'อาทิตย์',
        short: 'อา',
        gradient: 'from-red-500 to-amber-500',
        accent: 'text-red-600',
        soft: 'bg-red-50 border-red-200',
        colors: 'แดง ทอง',
        direction: 'ทิศตะวันออก',
        time: '06:09 - 08:19',
        digits: ['1', '6', '9'],
        pairs: ['16', '61', '19', '91'],
        three: ['169', '619', '916'],
        mantra: 'เปิดทางโชคลาภ ให้เห็นจังหวะที่เหมาะกับเรา',
        steps: ['พกของสีทองชิ้นเล็กก่อนออกจากบ้าน', 'เริ่มเลือกเลขจากตัวที่มี 1 หรือ 6', 'ทำบุญค่าน้ำค่าไฟหรือช่วยงานสาธารณะ'],
    },
    {
        id: 1,
        name: 'จันทร์',
        short: 'จ',
        gradient: 'from-yellow-300 to-slate-100',
        accent: 'text-yellow-700',
        soft: 'bg-yellow-50 border-yellow-200',
        colors: 'เหลือง ขาว',
        direction: 'ทิศตะวันตก',
        time: '08:29 - 10:39',
        digits: ['2', '1', '0'],
        pairs: ['21', '12', '20', '02'],
        three: ['210', '120', '201'],
        mantra: 'ใจนิ่ง เงินนิ่ง โชคดีเข้ามาอย่างพอดี',
        steps: ['ดื่มน้ำหนึ่งแก้วก่อนเลือกเลข', 'หลีกเลี่ยงการเปลี่ยนเลขซ้ำหลายรอบ', 'ทำบุญอาหารหรือเครื่องดื่มให้คนใกล้ตัว'],
    },
    {
        id: 2,
        name: 'อังคาร',
        short: 'อ',
        gradient: 'from-rose-500 to-pink-500',
        accent: 'text-rose-600',
        soft: 'bg-rose-50 border-rose-200',
        colors: 'ชมพู แดงอ่อน',
        direction: 'ทิศตะวันออกเฉียงใต้',
        time: '10:49 - 12:59',
        digits: ['3', '8', '6'],
        pairs: ['38', '83', '36', '63'],
        three: ['386', '836', '638'],
        mantra: 'ตัดความลังเล เหลือเลขที่ใช่และพอดี',
        steps: ['เลือกเลขเป็นชุดสั้น ไม่กระจายเกินไป', 'แตะมือซ้ายที่กระเป๋าเงินก่อนซื้อ', 'ทำบุญช่วยค่ารักษาหรือยารักษาโรค'],
    },
    {
        id: 3,
        name: 'พุธ',
        short: 'พ',
        gradient: 'from-emerald-500 to-teal-500',
        accent: 'text-emerald-600',
        soft: 'bg-emerald-50 border-emerald-200',
        colors: 'เขียว ฟ้า',
        direction: 'ทิศเหนือ',
        time: '13:09 - 15:19',
        digits: ['4', '7', '5'],
        pairs: ['47', '74', '45', '54'],
        three: ['475', '745', '547'],
        mantra: 'คำพูดดี ทางเลือกดี โชคดีตามมา',
        steps: ['ทบทวนเลขจากข้อมูลก่อนตัดสินใจ', 'ซื้อจากร้านที่รู้สึกสบายใจ ไม่เร่งรีบ', 'ทำบุญหนังสือหรืออุปกรณ์การเรียน'],
    },
    {
        id: 4,
        name: 'พฤหัสบดี',
        short: 'พฤ',
        gradient: 'from-orange-400 to-amber-500',
        accent: 'text-orange-600',
        soft: 'bg-orange-50 border-orange-200',
        colors: 'ส้ม เหลืองทอง',
        direction: 'ทิศตะวันออกเฉียงเหนือ',
        time: '05:59 - 07:49',
        digits: ['5', '9', '4'],
        pairs: ['59', '95', '54', '45'],
        three: ['594', '954', '459'],
        mantra: 'ขอบารมีครูบาอาจารย์ เปิดโชคที่สุจริต',
        steps: ['ไหว้ครูหรือระลึกถึงผู้มีพระคุณ', 'เลือกเลขที่มีเหตุผลรองรับหนึ่งชั้น', 'ทำบุญโรงเรียน วัด หรือสถานศึกษา'],
    },
    {
        id: 5,
        name: 'ศุกร์',
        short: 'ศ',
        gradient: 'from-sky-400 to-indigo-500',
        accent: 'text-sky-600',
        soft: 'bg-sky-50 border-sky-200',
        colors: 'ฟ้า น้ำเงิน',
        direction: 'ทิศตะวันตกเฉียงเหนือ',
        time: '15:29 - 17:39',
        digits: ['6', '5', '2'],
        pairs: ['65', '56', '62', '26'],
        three: ['652', '562', '626'],
        mantra: 'รับทรัพย์อย่างสบายใจ ใช้โชคอย่างมีสติ',
        steps: ['จัดกระเป๋าเงินให้เรียบร้อยก่อนออกจากบ้าน', 'เลือกเลขจากสิ่งที่รักหรือของสวยงาม', 'ทำบุญดอกไม้หรือของใช้ผู้หญิง'],
    },
    {
        id: 6,
        name: 'เสาร์',
        short: 'ส',
        gradient: 'from-violet-600 to-slate-800',
        accent: 'text-violet-600',
        soft: 'bg-violet-50 border-violet-200',
        colors: 'ม่วง ดำ',
        direction: 'ทิศตะวันตกเฉียงใต้',
        time: '17:49 - 19:59',
        digits: ['7', '9', '0'],
        pairs: ['79', '97', '70', '07'],
        three: ['790', '970', '709'],
        mantra: 'ปลดล็อกเรื่องติดขัด ให้โชคเดินทางมาถึง',
        steps: ['ตั้งงบให้ชัดก่อนซื้อ', 'เลือกเลขไม่เกินจำนวนชุดที่ตั้งใจไว้', 'ทำบุญโลงศพ ไฟฉาย หรือช่วยผู้ยากไร้'],
    },
];

const unique = (items) => [...new Set(items.filter(Boolean))];

const numbersContainingDigits = (numbers, digits) => (
    (numbers || []).filter((num) => digits.some((digit) => String(num).includes(digit)))
);

const buildBoostNumbers = (draw, boost) => {
    const finalTwo = draw?.conclusion?.finalPicks?.twoDigit || [];
    const finalThree = draw?.conclusion?.finalPicks?.threeDigit || [];
    const historical = draw?.historical?.labels || [];
    const luckyPool = draw?.luckyPool || [];

    return {
        two: unique([
            ...numbersContainingDigits(finalTwo, boost.digits),
            ...numbersContainingDigits(historical, boost.digits),
            ...numbersContainingDigits(luckyPool, boost.digits),
            ...boost.pairs,
        ]).slice(0, 7),
        three: unique([
            ...numbersContainingDigits(finalThree, boost.digits),
            ...boost.three,
        ]).slice(0, 5),
    };
};

const NumberChip = ({ num, copiedNum, onCopy, featured = false }) => (
    <button
        type="button"
        onClick={() => onCopy(num)}
        className={`min-w-[52px] h-12 px-3 rounded-xl flex items-center justify-center font-bold border transition-all active:scale-95 ${
            featured
                ? 'bg-slate-950 text-white border-slate-900 shadow-lg'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
        }`}
    >
        {copiedNum === num ? <Check size={16} className="text-emerald-500" /> : num}
    </button>
);

export const LottoFortuneBoostModal = ({ isOpen, onClose, draw, nextDrawLabel }) => {
    const [selectedDay, setSelectedDay] = useState(() => new Date().getDay());
    const [copiedNum, setCopiedNum] = useState(null);
    const boost = BOOST_DAYS.find((item) => item.id === selectedDay) || BOOST_DAYS[0];
    const boostNumbers = useMemo(() => buildBoostNumbers(draw, boost), [draw, boost]);

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
                className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            >
                <div className={`bg-gradient-to-r ${boost.gradient} p-5 sm:p-6 relative`}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="ปิด"
                    >
                        <X size={20} className="text-white" />
                    </button>

                    <div className="flex items-start gap-4 pr-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center flex-shrink-0">
                            <ShieldCheck size={24} strokeWidth={1.8} />
                        </div>
                        <div>
                            <p className="text-white/75 text-[10px] font-bold tracking-[0.22em] uppercase mb-1">
                                Fortune Boost
                            </p>
                            <h3 className="text-2xl font-semibold text-white tracking-tight">ฤกษ์เสริมโชคก่อนซื้อ</h3>
                            <p className="text-white/80 text-sm mt-2 leading-relaxed">
                                เลือกวันเกิดเพื่อดูสี ทิศ เวลา และชุดเลขที่เข้ากับพลังประจำวัน
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">เลือกวันเกิด</p>
                        <div className="grid grid-cols-7 gap-2">
                            {BOOST_DAYS.map((day) => (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => setSelectedDay(day.id)}
                                    className={`h-11 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                                        selectedDay === day.id
                                            ? `bg-gradient-to-br ${day.gradient} text-white border-transparent shadow-md`
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                                    }`}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`rounded-2xl border p-4 ${boost.soft}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Gem size={17} className={boost.accent} />
                                <p className="text-xs font-semibold text-slate-500">สีเสริมโชค</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{boost.colors}</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${boost.soft}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Compass size={17} className={boost.accent} />
                                <p className="text-xs font-semibold text-slate-500">ทิศรับทรัพย์</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{boost.direction}</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${boost.soft}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={17} className={boost.accent} />
                                <p className="text-xs font-semibold text-slate-500">ช่วงเวลานิ่ง</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{boost.time}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-4">
                        <div className="rounded-2xl bg-slate-950 text-white p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={18} className="text-amber-300" />
                                <h4 className="font-semibold">ตั้งจิตก่อนเลือกเลข</h4>
                            </div>
                            <p className="text-amber-100 text-lg leading-relaxed">
                                "{boost.mantra}"
                            </p>
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
                                    งวดที่ใช้ประกอบ
                                </p>
                                <p className="text-sm text-slate-300">{nextDrawLabel || draw?.label || 'งวดถัดไป'}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                                <Star size={17} className={boost.accent} />
                                ลำดับเสริมดวงแบบสั้น
                            </h4>
                            <div className="space-y-3">
                                {boost.steps.map((step, index) => (
                                    <div key={step} className="flex gap-3 text-sm text-slate-600">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${boost.soft} ${boost.accent}`}>
                                            {index + 1}
                                        </span>
                                        <span className="leading-relaxed">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                            <div>
                                <h4 className="font-semibold text-slate-900">เลขเสริมตามวันเกิด + ข้อมูลรอบนี้</h4>
                                <p className="text-xs text-slate-500 mt-1">กดเลขเพื่อคัดลอก</p>
                            </div>
                            <div className="flex gap-1.5">
                                {boost.digits.map((digit) => (
                                    <span key={digit} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${boost.soft} ${boost.accent}`}>
                                        {digit}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-amber-600 font-semibold mb-2">เลข 2 ตัว</p>
                                <div className="flex flex-wrap gap-2">
                                    {boostNumbers.two.map((num, index) => (
                                        <NumberChip key={num} num={num} copiedNum={copiedNum} onCopy={handleCopy} featured={index === 0} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-indigo-600 font-semibold mb-2">เลข 3 ตัว</p>
                                <div className="flex flex-wrap gap-2">
                                    {boostNumbers.three.map((num, index) => (
                                        <NumberChip key={num} num={num} copiedNum={copiedNum} onCopy={handleCopy} featured={index === 0} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 border-t border-slate-100 text-center bg-white">
                    <p className="text-xs text-slate-400">
                        * แนวทางเสริมดวงเพื่อความสบายใจและความบันเทิงเท่านั้น ไม่รับประกันผลรางวัล
                    </p>
                </div>
            </div>
        </div>
    );
};
