import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stars, Sparkles, Calendar } from 'lucide-react';
import { ZODIAC_SIGNS, getZodiacFortune, ELEMENTS } from '../data/zodiacData';
import { ZodiacCard } from '../components/zodiac/ZodiacCard';
import { ZodiacFortune } from '../components/zodiac/ZodiacFortune';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';
import { usePageSEO } from '../hooks/usePageTitle';

export const ZodiacPage = () => {
    usePageSEO({
        title: 'ดูดวงราศี 12 ราศี ประจำวัน',
        description: 'ดูดวง 12 ราศีประจำวันฟรี ดูดวงความรัก การงาน การเงิน สุขภาพ จัดกลุ่มตามธาตุ ไฟ ดิน ลม น้ำ เลือกราศีเพื่อรับคำทำนายแม่นๆ',
        keywords: 'ดูดวงราศี, ดวง 12 ราศี, ดวงรายวัน, ดวงความรัก, ราศีเมษ, ราศีพฤษภ, ธาตุ 4 ธาตุ, โหราศาสตร์',
        path: '/zodiac',
    });
    const navigate = useNavigate();
    const [selectedZodiac, setSelectedZodiac] = useState(null);
    const [fortune, setFortune] = useState(null);
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSelectZodiac = (zodiac) => {
        setSelectedZodiac(zodiac.id);
        const fortuneData = getZodiacFortune(zodiac.id);
        setFortune(fortuneData);
    };

    const handleCloseFortune = () => {
        setFortune(null);
        setSelectedZodiac(null);
    };

    // Group zodiacs by element for display
    const elementGroups = [
        { element: 'ไฟ', zodiacs: ZODIAC_SIGNS.filter(z => z.element === 'ไฟ') },
        { element: 'ดิน', zodiacs: ZODIAC_SIGNS.filter(z => z.element === 'ดิน') },
        { element: 'ลม', zodiacs: ZODIAC_SIGNS.filter(z => z.element === 'ลม') },
        { element: 'น้ำ', zodiacs: ZODIAC_SIGNS.filter(z => z.element === 'น้ำ') }
    ];

    if (authLoading) {
        return (
            <div className={`min-h-screen bg-slate-950 flex items-center justify-center`}>
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6`}>
                <div className="max-w-md text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-700 mb-6 shadow-xl`}>
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className={`text-slate-400 mb-6 leading-relaxed`}>
                        กรุณาเข้าสู่ระบบเพื่อดูดวง 12 ราศีประจำวัน
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
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
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Mystical Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-start gap-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Stars className="text-purple-400" size={24} />
                                ดวง 12 ราศี
                            </h1>
                            <p className="text-sm text-slate-400">
                                เลือกราศีของคุณเพื่อดูคำทำนายประจำวัน
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-6xl mx-auto px-4 py-8">
                {/* Intro Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm mb-4">
                        <Sparkles size={16} />
                        เลือกราศีของคุณ
                    </div>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        ดูดวงประจำวันตามราศีเกิด พร้อมดวงความรัก การงาน การเงิน และสุขภาพ
                    </p>
                </div>

                {/* Zodiac Grid - Grouped by Element */}
                <div className="space-y-10">
                    {elementGroups.map((group) => {
                        const element = ELEMENTS[group.element];
                        return (
                            <section key={group.element}>
                                {/* Element Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{element.icon}</span>
                                    <h2 className={`text-lg font-bold ${element.color}`}>
                                        ธาตุ{group.element}
                                    </h2>
                                    <div className={`flex-1 h-px ${element.bg}`}></div>
                                </div>

                                {/* Zodiac Cards Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {group.zodiacs.map((zodiac) => (
                                        <ZodiacCard
                                            key={zodiac.id}
                                            zodiac={zodiac}
                                            isSelected={selectedZodiac === zodiac.id}
                                            onClick={() => handleSelectZodiac(zodiac)}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Quick Info */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(ELEMENTS).map(([name, element]) => (
                        <div
                            key={name}
                            className={`p-4 rounded-xl ${element.bg} ${element.border} border text-center`}
                        >
                            <span className="text-2xl">{element.icon}</span>
                            <p className={`font-bold ${element.color} mt-1`}>ธาตุ{name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {ZODIAC_SIGNS.filter(z => z.element === name).map(z => z.nameTh).join(', ')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <footer className="mt-12 text-center text-slate-500 text-xs">
                    <p>ดวงนี้เป็นเพียงคำทำนายเพื่อความบันเทิง โปรดใช้วิจารณญาณ ✨</p>
                </footer>
            </main>

            {/* Fortune Modal */}
            {fortune && (
                <ZodiacFortune fortune={fortune} onClose={handleCloseFortune} />
            )}
        </div>
    );
};

export default ZodiacPage;
