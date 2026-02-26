import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Shield, Mail, MessageCircle, Star, Users, BookOpen, Zap } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';

export default function AboutPage() {
    const navigate = useNavigate();

    usePageSEO({
        title: 'เกี่ยวกับเรา - ศาสตร์ดวงดาว',
        description: 'เรียนรู้เกี่ยวกับศาสตร์ดวงดาว แพลตฟอร์มดูดวงไพ่ทาโรต์ออนไลน์ที่ครบวงจร พร้อมติดต่อทีมงาน',
        keywords: 'เกี่ยวกับเรา, ศาสตร์ดวงดาว, ไพ่ทาโรต์, ติดต่อเรา',
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>กลับหน้าหลัก</span>
                </button>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-sm text-purple-300">เกี่ยวกับเรา</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 mb-6">
                        ศาสตร์ดวงดาว
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        แพลตฟอร์มดูดวงไพ่ทาโรต์ออนไลน์ที่ครบวงจร ผสมผสานศาสตร์โบราณกับเทคโนโลยีสมัยใหม่
                        เพื่อมอบประสบการณ์การดูดวงที่ดีที่สุดให้กับคุณ
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Star size={24} className="text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">พันธกิจ</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            นำเสนอศาสตร์การดูดวงที่แม่นยำ เข้าถึงง่าย และเป็นแรงบันดาลใจในการใช้ชีวิต
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Heart size={24} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">วิสัยทัศน์</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            เป็นแพลตฟอร์มดูดวงอันดับ 1 ของไทย ที่ผู้คนไว้วางใจและใช้เป็นเข็มทิศในชีวิต
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Shield size={24} className="text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">ค่านิยม</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            ซื่อสัตย์ โปร่งใส ไม่หลอกลวง เราเชื่อว่าดวงเป็นเพียงแนวทาง ไม่ใช่คำตัดสิน
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-yellow-500 text-center mb-8">สิ่งที่เรามอบให้</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                            <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 shrink-0">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">ไพ่ทาโรต์ 78 ใบ</h4>
                                <p className="text-sm text-slate-400">ครบทั้ง Major และ Minor Arcana พร้อมคำทำนายเชิงลึกทุกด้าน</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 shrink-0">
                                <Heart size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">หลากหลายหัวข้อ</h4>
                                <p className="text-sm text-slate-400">ความรัก การงาน การเงิน สุขภาพ สังคม โชคลาภ และอื่นๆ</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">ดวงรายวัน & รายเดือน</h4>
                                <p className="text-sm text-slate-400">คำพยากรณ์ 366 ข้อความ ครบทุกวันของปี พร้อมไพ่ประจำวัน</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">บทความความรู้ 20+</h4>
                                <p className="text-sm text-slate-400">บทความเกี่ยวกับไพ่ทาโรต์ โหราศาสตร์ ฮวงจุ้ย และศาสตร์โบราณ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-yellow-500 text-center mb-8">ติดต่อเรา</h2>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
                        <p className="text-center text-slate-400 mb-8">
                            มีคำถาม ข้อเสนอแนะ หรือต้องการร่วมงานกับเรา? ติดต่อได้ผ่านช่องทางด้านล่าง
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="mailto:support@satduangdao.com"
                                className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-purple-500/40 hover:bg-slate-800 transition-all group w-full max-w-sm"
                            >
                                <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">อีเมล</div>
                                    <div className="text-xs text-slate-400">support@satduangdao.com</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="text-center mb-12">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
                        <p className="text-sm text-amber-300/80 leading-relaxed">
                            ⚠️ <strong>ข้อสำคัญ:</strong> บริการของเราเป็นเพียงความบันเทิงเท่านั้น
                            ผลทำนายไม่ใช่ข้อเท็จจริงและไม่ควรใช้เป็นพื้นฐานในการตัดสินใจครั้งสำคัญ
                            กรุณาใช้วิจารณญาณในการรับชม
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-full transition-all"
                    >
                        กลับหน้าหลัก
                    </button>
                </div>
            </div>
        </div>
    );
}
