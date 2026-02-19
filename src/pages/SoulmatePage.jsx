import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Stars, Calculator, User, Zap, MessageCircle, Smile, Clock, MapPin, Search, Calendar, Briefcase, Gem, BookOpen } from 'lucide-react';
import { ZODIAC_SIGNS, ELEMENTS, DAYS_OF_WEEK, LOVE_TIMING_DATA, SOULMATE_DATA, getZodiacByDate } from '../data/zodiacData';
import { usePageSEO } from '../hooks/usePageTitle';

export const SoulmatePage = () => {
    usePageSEO({
        title: 'เช็คดวงเนื้อคู่ ทำนายคู่ครอง',
        description: 'ทำนายเนื้อคู่จากดวงชะตา เช็คสมพงษ์ตามราศีเกิดและวันเกิด ดูรูปร่าง นิสัย อาชีพ ช่วงเวลา และสถานที่ที่จะพบคู่แท้ ศาสตร์ธาตุ 4 กับความรัก',
        keywords: 'ดวงเนื้อคู่, ทำนายคู่ครอง, สมพงษ์, ดูดวงรัก, ราศีเกิด, ธาตุความรัก, พยากรณ์ความรัก',
        path: '/soulmate',
    });
    const navigate = useNavigate();

    // User Inputs
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState(''); // BE (Thai Year)

    // Derived State
    const [mySign, setMySign] = useState(null);
    const [myDayOfWeek, setMyDayOfWeek] = useState(null);

    const [result, setResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Auto-calculate Zodiac & Day when Date changes
    useEffect(() => {
        if (birthDay && birthMonth && birthYear) {
            // Convert BE to CE
            const yearCE = parseInt(birthYear) - 543;
            // Note: Month in Date constructor is 0-indexed
            const dateObj = new Date(yearCE, parseInt(birthMonth) - 1, parseInt(birthDay));

            // Check invalid date
            if (dateObj.getDate() !== parseInt(birthDay)) return;

            // 1. Find Zodiac
            const zodiac = getZodiacByDate(parseInt(birthMonth), parseInt(birthDay));
            setMySign(zodiac);

            // 2. Find Day of Week
            // 0 = Sunday, 1 = Monday...
            const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayId = daysMap[dateObj.getDay()];
            const dayData = DAYS_OF_WEEK.find(d => d.id === dayId);
            setMyDayOfWeek(dayData);
        } else {
            setMySign(null);
            setMyDayOfWeek(null);
        }
    }, [birthDay, birthMonth, birthYear]);


    const calculateProfile = () => {
        if (!name || !age || !mySign || !myDayOfWeek) return;

        setIsCalculating(true);
        setResult(null);

        // Simulate calculation delay for effect
        setTimeout(() => {
            // Generate deterministic seed from Name + DOB
            const seedStr = name + age + birthDay + birthMonth + birthYear;
            let hash = 0;
            for (let i = 0; i < seedStr.length; i++) {
                hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
                hash |= 0;
            }
            const seed = Math.abs(hash);

            // 1. Soulmate Profile
            const appearance = SOULMATE_DATA.appearances[seed % SOULMATE_DATA.appearances.length];
            const career = SOULMATE_DATA.careers[(seed >> 3) % SOULMATE_DATA.careers.length];
            const personality = SOULMATE_DATA.personalities[(seed >> 5) % SOULMATE_DATA.personalities.length];
            const meeting = SOULMATE_DATA.meetings[(seed >> 7) % SOULMATE_DATA.meetings.length];

            // Random Age Gap (-5 to +10 years)
            const ageGap = (seed % 16) - 5;
            const ageGapText = ageGap === 0 ? "อายุรุ่นราวคราวเดียวกัน" : (ageGap > 0 ? `อาจอายุมากกว่าคุณประมาณ ${ageGap} ปี` : `อาจอายุน้อยกว่าคุณประมาณ ${Math.abs(ageGap)} ปี`);

            // 2. Destiny Location/Time
            const timeframe = LOVE_TIMING_DATA.timeframes[seed % LOVE_TIMING_DATA.timeframes.length];
            const location = LOVE_TIMING_DATA.locations[(seed >> 2) % LOVE_TIMING_DATA.locations.length];
            const trigger = LOVE_TIMING_DATA.triggers[(seed >> 4) % LOVE_TIMING_DATA.triggers.length];
            const action = LOVE_TIMING_DATA.actions[(seed >> 6) % LOVE_TIMING_DATA.actions.length];

            setResult({
                profile: { appearance, career, personality, meeting, ageGapText },
                destiny: { timeframe, location, trigger, action },
                userZodiac: mySign,
                userDay: myDayOfWeek
            });
            setIsCalculating(false);
        }, 1500);
    };

    // Helper to generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        { id: 1, name: 'มกราคม' }, { id: 2, name: 'กุมภาพันธ์' }, { id: 3, name: 'มีนาคม' },
        { id: 4, name: 'เมษายน' }, { id: 5, name: 'พฤษภาคม' }, { id: 6, name: 'มิถุนายน' },
        { id: 7, name: 'กรกฎาคม' }, { id: 8, name: 'สิงหาคม' }, { id: 9, name: 'กันยายน' },
        { id: 10, name: 'ตุลาคม' }, { id: 11, name: 'พฤศจิกายน' }, { id: 12, name: 'ธันวาคม' }
    ];
    // Year range (Thai Year): Current Year + 543 down to -80 years
    const currentYearBE = new Date().getFullYear() + 543;
    const years = Array.from({ length: 80 }, (_, i) => currentYearBE - i);


    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20 font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-pink-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-pink-400" size={24} fill="currentColor" />
                        ทำนายเนื้อคู่จากดวงชะตา
                    </h1>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-8 space-y-8 relative z-10">

                {/* Input Form */}
                <section className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                        <User className="text-pink-400" size={24} />
                        <div>
                            <h2 className="text-lg font-bold text-white">ข้อมูลของคุณ</h2>
                            <p className="text-xs text-slate-400">กรอกข้อมูลเพื่อคำนวณดวงเนื้อคู่</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Name & Age */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">ชื่อเล่น / ชื่อจริง</label>
                                <input
                                    type="text"
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="เช่น น้องเมย์"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">อายุ</label>
                                <input
                                    type="number"
                                    value={age} onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-center text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                    placeholder="25"
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">วันเดือนปีเกิด</label>
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={birthDay} onChange={(e) => setBirthDay(e.target.value)}
                                    className="bg-slate-800 border-slate-700 rounded-xl px-2 py-3 text-sm text-center focus:ring-2 focus:ring-pink-500 outline-none"
                                >
                                    <option value="">วันที่</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select
                                    value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}
                                    className="bg-slate-800 border-slate-700 rounded-xl px-2 py-3 text-sm text-center focus:ring-2 focus:ring-pink-500 outline-none"
                                >
                                    <option value="">เดือน</option>
                                    {months.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <select
                                    value={birthYear} onChange={(e) => setBirthYear(e.target.value)}
                                    className="bg-slate-800 border-slate-700 rounded-xl px-2 py-3 text-sm text-center focus:ring-2 focus:ring-pink-500 outline-none"
                                >
                                    <option value="">พ.ศ.</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Calculations Preview */}
                        <div className="pt-2">
                            {mySign && myDayOfWeek ? (
                                <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-between text-anime-in fade-in">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{mySign.emoji}</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-pink-300 font-bold">ราศี{mySign.nameTh}</span>
                                            <span className="text-[10px] text-pink-400/70">ธาตุ{mySign.element}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-pink-400" />
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-pink-300 font-bold">{myDayOfWeek.nameTh}</span>
                                            <span className="text-[10px] text-pink-400/70">{mySign.luckyColor}คือสีมงคล</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-center text-xs text-slate-500">
                                    ระบุวันเกิดให้ครบเพื่อคำนวณราศีอัตโนมัติ
                                </div>
                            )}
                        </div>

                        <button
                            onClick={calculateProfile}
                            disabled={!name || !age || !mySign || isCalculating}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 font-bold text-lg shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 text-white flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            {isCalculating ? (
                                <span className="animate-pulse">กำลังเพ่งกระแสจิต...</span>
                            ) : (
                                <>
                                    <Sparkles className="group-hover:animate-spin" />
                                    เปิดคำทำนายเนื้อคู่
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Results Section */}
                {result && !isCalculating && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

                        {/* 1. Soulmate Profile Card */}
                        <section className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

                            <div className="flex items-center gap-2 mb-6 relative">
                                <Gem className="text-indigo-400" />
                                <h3 className="text-lg font-bold text-indigo-100">โปรไฟล์เนื้อคู่ของคุณ</h3>
                            </div>

                            <div className="space-y-4 relative">
                                <div className="bg-slate-950/40 rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-indigo-500/10">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                        <User className="text-indigo-300" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-indigo-300 font-bold uppercase mb-1">รูปร่างหน้าตา</h4>
                                        <p className="text-sm font-medium text-slate-100 leading-relaxed">"{result.profile.appearance}"</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/40 rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-indigo-500/10">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <Smile className="text-emerald-300" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-emerald-300 font-bold uppercase mb-1">นิสัยใจคอ</h4>
                                        <p className="text-sm font-medium text-slate-100 leading-relaxed">"{result.profile.personality}"</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/40 rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-indigo-500/10">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="text-amber-300" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-amber-300 font-bold uppercase mb-1">การงาน / อาชีพ</h4>
                                        <p className="text-sm font-medium text-slate-100 leading-relaxed">"{result.profile.career}"</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-indigo-900/40 rounded-xl text-center border border-indigo-500/20">
                                    <p className="text-xs text-indigo-200">
                                        <span className="opacity-70">อายุห่างกัน : </span>
                                        <span className="font-bold">{result.profile.ageGapText}</span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Destiny Timing Card (Reused Logic) */}
                        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="text-pink-400" size={20} />
                                <h3 className="font-bold text-lg">ช่วงเวลาแห่งโชคชะตา</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Clock size={16} /></div>
                                        <span className="text-sm text-slate-300">เมื่อไหร่?</span>
                                    </div>
                                    <span className="text-sm font-medium text-pink-100 text-right">{result.destiny.timeframe}</span>
                                </div>

                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><MapPin size={16} /></div>
                                        <span className="text-sm text-slate-300">ที่ไหน?</span>
                                    </div>
                                    <span className="text-sm font-medium text-purple-100 text-right">{result.destiny.location}</span>
                                </div>

                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><MessageCircle size={16} /></div>
                                        <span className="text-sm text-slate-300">สถานการณ์ที่พบเจอ</span>
                                    </div>
                                    <p className="text-sm font-medium text-blue-100 pl-2 border-l-2 border-blue-500/30">
                                        "{result.profile.meeting}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-800 rounded-xl text-center">
                                <span className="text-xs text-slate-500 block mb-1">คำใบ้สำคัญ</span>
                                <p className="text-sm text-orange-200 font-medium">"{result.destiny.trigger}"</p>
                            </div>
                        </section>
                    </div>
                )}

                {/* Love Tarot CTA */}
                <section className="relative group cursor-pointer mt-8 mb-8" onClick={() => navigate('/?topic=love')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
                    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 overflow-hidden group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full"></div>
                        <div className="w-16 h-20 bg-slate-800 rounded-2xl border-2 border-pink-500/50 flex items-center justify-center shadow-lg transform -rotate-6">
                            <Heart className="text-pink-500" fill="currentColor" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-white mb-1">ดวงความรักตอนนี้?</h3>
                            <p className="text-sm text-slate-400">
                                เปิดไพ่ทาโรต์เช็คดวงความรักปัจจุบัน
                            </p>
                        </div>
                        <Stars className="text-pink-400" />
                    </div>
                </section>

                {/* Information / Article Section */}
                <section className="bg-slate-900/50 rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 mt-12 mb-8">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-pink-400">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">ศาสตร์แห่งการทำนายเนื้อคู่</h2>
                    </div>

                    <div className="space-y-4 text-slate-300 leading-relaxed font-light">
                        <div>
                            <h3 className="font-bold text-pink-200 mb-2">สมพงษ์และดวงสมพงษ์คืออะไร?</h3>
                            <p>"สมพงษ์" ตามความเชื่อโหราศาสตร์ไทย หมายถึงความเข้ากันได้ของดวงชะตาระหว่างบุคคลสองคน โดยพิจารณาจากปีเกิด (นักษัตร) วันเกิด (ดวงวัน) และธาตุเดือนเกิด (ดิน น้ำ ลม ไฟ) หากดวงสมพงษ์กัน เชื่อว่าจะช่วยส่งเสริมให้ชีวิตคู่ราบรื่น มีความสุข และเกื้อกูลกัน</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-pink-200 mb-2">หลักการธาตุทั้ง 4 กับความรัก</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong className="text-orange-300">ธาตุไฟ (เมษ, สิงห์, ธนู):</strong> รักอิสระ ร้อนแรง มักเข้ากันได้ดีกับธาตุลมที่ช่วยกระพือไฟ</li>
                                <li><strong className="text-emerald-300">ธาตุดิน (พฤษภ, กันย์, มังกร):</strong> มั่นคง จริงจัง เข้ากันได้ดีกับธาตุน้ำที่ช่วยให้ดินชุ่มชื้น</li>
                                <li><strong className="text-blue-300">ธาตุลม (เมถุน, ตุลย์, กุมภ์):</strong> ช่างเจรจา ปรับตัวเก่ง เข้ากันได้ดีกับธาตุไฟ</li>
                                <li><strong className="text-cyan-300">ธาตุน้ำ (กรกฎ, พิจิก, มีน):</strong> อ่อนโยน ลึกซึ้ง เข้ากันได้ดีกับธาตุดิน</li>
                            </ul>
                        </div>

                        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200 mt-4 italic">
                            <strong>หมายเหตุ:</strong> การทำนายนี้ใช้หลักการโหราศาสตร์เบื้องต้นประกอบกับการวิเคราะห์สถิติ เพื่อความบันเทิงและแนวทางในการดำเนินชีวิต ความรักที่ดีเกิดจากความเข้าใจและการปรับตัวเข้าหากันของคนสองคน
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SoulmatePage;
