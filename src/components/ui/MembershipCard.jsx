import React from 'react';
import { Crown, Sparkles, Heart, Brain, BookOpen, Users, Star, CheckCircle, Zap, Shield, Loader2 } from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';

export const MembershipCard = ({ isDark, onUpgrade, isLoading, pricing, isPricingLoading }) => {
    const { isPremium } = usePremium();
    const [nowTimestamp, setNowTimestamp] = React.useState(() => Date.now());

    React.useEffect(() => {
        if (!pricing?.discountEndsAt) return;
        const timer = setInterval(() => {
            setNowTimestamp(Date.now());
        }, 60 * 1000);
        return () => clearInterval(timer);
    }, [pricing?.discountEndsAt]);

    const basePrice = Number(pricing?.basePrice ?? 299);
    const finalPrice = Number(pricing?.finalPrice ?? 299);
    const hasDiscount = Boolean(pricing?.isDiscountActive) && finalPrice < basePrice;
    const remainingDays = hasDiscount && pricing?.discountEndsAt
        ? Math.max(Math.ceil((new Date(pricing.discountEndsAt).getTime() - nowTimestamp) / (24 * 60 * 60 * 1000)), 0)
        : 0;
    const benefits = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Unlimited Tarot Readings",
            description: "ไม่จำกัดจำนวนครั้ง อ่านไพ่ได้ตลอดเวลา",
            popular: true
        },
        {
            icon: <Brain className="w-5 h-5" />,
            title: "Premium Meditation",
            description: "นำสมาธิ 15-30 นาที พร้อมเสียง nature sounds",
            popular: true
        },
        {
            icon: <Star className="w-5 h-5" />,
            title: "Monthly Zodiac Reports",
            description: "รายงานดวงรายเดือนแบบเจาะลึก",
            popular: false
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: "Personal Growth Journal",
            description: "บันทึกและวิเคราะห์การพัฒนาตนเอง",
            popular: false
        },
        {
            icon: <Heart className="w-5 h-5" />,
            title: "Priority Support",
            description: "ตอบคำถามภายใน 2 ชั่วโมง",
            popular: false
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Ad-Free Experience",
            description: "ใช้งานไร้โฆษณา สมาธิเต็มที่",
            popular: false
        },
    ];

    const freeFeatures = [
        "ไพ่ทาโรต์ 1 ใบ/วัน",
        "Meditation 5 นาที",
        "LottoInsight แบบเต็ม",
        "Zodiac รายวัน",
        "มีโฆษณา"
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                        <Crown className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Tarot Wisdom Membership
                    </h2>
                </div>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                    ปลดล็อคศักยภาพการพัฒนาตนเองสู่ระดับใหม่ ด้วยเครื่องมือและความรู้พิเศษ
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Free Plan */}
                <div className={`relative rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'} p-8`}>
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                        <div className="text-4xl font-bold text-slate-300 mb-4">ฟรี</div>
                        <p className="text-slate-400">เริ่มต้นสำรวจศาสตร์ความรู้</p>
                    </div>

                    <div className="space-y-3 mb-8">
                        {freeFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                                </div>
                                <span className="text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <div className={`px-6 py-3 rounded-xl border ${isPremium ? 'bg-slate-800 border-slate-600 text-slate-400' : `${isDark ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'}`} font-medium`}>
                            {isPremium ? 'แพลนก่อนหน้าของคุณ' : 'คุณกำลังใช้อยู่'}
                        </div>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className={`relative rounded-2xl border-2 ${isDark ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-500'} p-8 transform scale-105`}>
                    {/* Popular Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className={`px-4 py-2 ${isPremium ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} text-white text-sm font-bold rounded-full flex items-center gap-2`}>
                            {isPremium ? <><CheckCircle className="w-4 h-4" /> ACTIVE</> : <><Star className="w-4 h-4" /> POPULAR</>}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                        <div className="flex items-baseline justify-center gap-2 mb-4">
                            {isPricingLoading ? (
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>กำลังโหลดราคา...</span>
                                </div>
                            ) : hasDiscount ? (
                                <>
                                    <span className="text-2xl text-slate-400 line-through">{basePrice.toLocaleString()}</span>
                                    <span className="text-5xl font-bold text-green-300">{finalPrice.toLocaleString()}</span>
                                    <span className="text-slate-300">บาท/เดือน</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-5xl font-bold text-purple-300">{basePrice.toLocaleString()}</span>
                                    <span className="text-slate-300">บาท/เดือน</span>
                                </>
                            )}
                        </div>
                        {!isPricingLoading && hasDiscount && (
                            <p className="text-green-300 text-sm">โปรโมชันเหลืออีกประมาณ {remainingDays} วัน</p>
                        )}
                        <p className="text-slate-300">เต็มพลังการพัฒนาตนเอง</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg flex-shrink-0 ${benefit.popular ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-700/50 border border-slate-600'}`}>
                                    <div className={benefit.popular ? 'text-purple-400' : 'text-slate-400'}>
                                        {benefit.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className={`font-semibold ${benefit.popular ? 'text-purple-300' : 'text-white'} mb-1`}>
                                        {benefit.title}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {benefit.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        {isPremium ? (
                            <div className="w-full py-4 px-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-300 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                คุณเป็นสมาชิก Premium แล้ว
                            </div>
                        ) : (
                            <button
                                onClick={onUpgrade}
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังดำเนินการ...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="w-5 h-5" />
                                        เริ่มต้นใช้งาน Premium วันนี้
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Value Proposition */}
            <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-50 border border-slate-200'} p-8`}>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">ทำไม Premium คุ้มค่า?</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">10x</div>
                        <div className="text-white font-semibold mb-1">คุณค่าสูงขึ้น</div>
                        <div className="text-slate-400 text-sm">จาก 1 ครั้ง/วัน เป็นไม่จำกัด</div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">3x</div>
                        <div className="text-white font-semibold mb-1">เนื้อหาลึกขึ้น</div>
                        <div className="text-slate-400 text-sm">meditation, journal, expert tips</div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                        <div className="text-white font-semibold mb-1">การพัฒนาตนเอง</div>
                        <div className="text-slate-400 text-sm">community และ personal growth</div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">1,200+ สมาชิก Premium แล้ว</span>
                </div>
                <p className="text-slate-400 text-sm">
                    "เปลี่ยนชีวิตผมไปตั้งแต่ได้เป็นสมาชิก Premium" - สมาชิกตัวอย่าง
                </p>
            </div>
        </div>
    );
};
