import React, { useState } from 'react';
import { Calendar, Star, Heart, Briefcase, TrendingUp, Users, BookOpen, ArrowLeft, Crown, Download, Share2 } from 'lucide-react';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';
import { getMonthlyZodiacReport } from '../data/zodiacData';
import { useActivityLog } from '../hooks/useActivityLog';

export const ZodiacReportPage = ({ isDark }) => {
    const { isPremium } = usePremium();
    const { logActivity } = useActivityLog();
    const [selectedZodiac, setSelectedZodiac] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState(null);

    const zodiacSigns = [
        { id: 'aries', name: 'ราศีเมษ', icon: '♈', dates: '21 มี.ค. - 19 เม.ย.' },
        { id: 'taurus', name: 'ราศีพฤษภ', icon: '♉', dates: '20 เม.ย. - 20 พ.ค.' },
        { id: 'gemini', name: 'ราศีเมถุน', icon: '♊', dates: '21 พ.ค. - 20 มิ.ย.' },
        { id: 'cancer', name: 'ราศีกรกฎ', icon: '♋', dates: '21 มิ.ย. - 22 ก.ค.' },
        { id: 'leo', name: 'ราศีสิงห์', icon: '♌', dates: '23 ก.ค. - 22 ส.ค.' },
        { id: 'virgo', name: 'ราศีกันย์', icon: '♍', dates: '23 ส.ค. - 22 ก.ย.' },
        { id: 'libra', name: 'ราศีตุล', icon: '♎', dates: '23 ก.ย. - 22 ต.ค.' },
        { id: 'scorpio', name: 'ราศีพิจิก', icon: '♏', dates: '23 ต.ค. - 21 พ.ย.' },
        { id: 'sagittarius', name: 'ราศีธนู', icon: '♐', dates: '22 พ.ย. - 21 ธ.ค.' },
        { id: 'capricorn', name: 'ราศีมังกร', icon: '♑', dates: '22 ธ.ค. - 19 ม.ค.' },
        { id: 'aquarius', name: 'ราศีกุมภ์', icon: '♒', dates: '20 ม.ค. - 18 ก.พ.' },
        { id: 'pisces', name: 'ราศีมีน', icon: '♓', dates: '19 ก.พ. - 20 มี.ค.' }
    ];

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const generateReport = () => {
        if (!selectedZodiac) return;
        setIsGenerating(true);
        setReport(null);
        setTimeout(() => {
            const data = getMonthlyZodiacReport(selectedZodiac.id, selectedMonth);
            setReport(data);
            setIsGenerating(false);
            logActivity('zodiac_report', `อ่านรายงานราศี: ${selectedZodiac.name}`, { zodiac: selectedZodiac.id, month: selectedMonth });
        }, 2000);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Header */}
                <div className="p-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all mb-6"
                    >
                        <ArrowLeft size={20} />
                        กลับ
                    </button>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                                <Calendar className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Monthly Zodiac Reports
                            </h1>
                        </div>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            รายงานดวงรายเดือนแบบเจาะลึกสำหรับทุกราศี พร้อมคำแนะนำเชิงปฏิบัติ
                        </p>
                    </div>
                </div>

                {/* Selection */}
                <div className="max-w-6xl mx-auto px-6 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Zodiac Selection */}
                        <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-purple-400" />
                                เลือกราศีของคุณ
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {zodiacSigns.map((sign) => (
                                    <button
                                        key={sign.id}
                                        onClick={() => setSelectedZodiac(sign)}
                                        className={`p-3 rounded-xl border transition-all text-center ${
                                            selectedZodiac?.id === sign.id
                                                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{sign.icon}</div>
                                        <div className="text-xs font-medium">{sign.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Month Selection */}
                        <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                เลือกเดือน
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {months.map((month, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedMonth(index)}
                                        className={`p-3 rounded-xl border transition-all text-sm ${
                                            selectedMonth === index
                                                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <PremiumGate 
                        feature="monthlyZodiacReports" 
                        fallback={
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-4">
                                    <Crown className="w-5 h-5 text-purple-400" />
                                    <span className="text-purple-300 font-medium">Premium Feature</span>
                                </div>
                                <p className="text-slate-400">รายงานดวงรายเดือนแบบเจาะลึกสำหรับสมาชิก Premium เท่านั้น</p>
                            </div>
                        }
                    >
                        <div className="text-center mb-8">
                            <button
                                onClick={generateReport}
                                disabled={!selectedZodiac || isGenerating}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        กำลังสร้างรายงาน...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" />
                                        สร้างรายงาน {months[selectedMonth]}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Report Display */}
                        {(report && !isGenerating) && (
                            <div className="space-y-6">
                                {/* Report Header */}
                                <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{selectedZodiac.icon}</div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    {selectedZodiac.name} - {months[report.month]} {report.year}
                                                </h2>
                                                <p className="text-slate-400">{selectedZodiac.dates}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700">
                                                <Download size={18} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700">
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Overall Score */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full">
                                            <Star className="w-5 h-5 text-purple-400" />
                                            <span className="text-purple-300 font-bold text-lg">คะแนนรวม: {report.overall.score}/100</span>
                                        </div>
                                    </div>

                                    {/* Category Reports */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Love */}
                                        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Heart className="w-5 h-5 text-pink-400" />
                                                <h3 className="text-lg font-bold text-white">ความรัก</h3>
                                                <span className="text-pink-400 font-bold">({report.love.score}/100)</span>
                                            </div>
                                            <p className="text-slate-300 mb-3">{report.love.text}</p>
                                            <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                                                <p className="text-pink-300 text-sm font-medium">💡 คำแนะนำ: {report.love.advice}</p>
                                            </div>
                                        </div>

                                        {/* Career */}
                                        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Briefcase className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-lg font-bold text-white">การงาน</h3>
                                                <span className="text-blue-400 font-bold">({report.career.score}/100)</span>
                                            </div>
                                            <p className="text-slate-300 mb-3">{report.career.text}</p>
                                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                <p className="text-blue-300 text-sm font-medium">💡 คำแนะนำ: {report.career.advice}</p>
                                            </div>
                                        </div>

                                        {/* Finance */}
                                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <TrendingUp className="w-5 h-5 text-green-400" />
                                                <h3 className="text-lg font-bold text-white">การเงิน</h3>
                                                <span className="text-green-400 font-bold">({report.finance.score}/100)</span>
                                            </div>
                                            <p className="text-slate-300 mb-3">{report.finance.text}</p>
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <p className="text-green-300 text-sm font-medium">💡 คำแนะนำ: {report.finance.advice}</p>
                                            </div>
                                        </div>

                                        {/* Health */}
                                        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Users className="w-5 h-5 text-yellow-400" />
                                                <h3 className="text-lg font-bold text-white">สุขภาพ</h3>
                                                <span className="text-yellow-400 font-bold">({report.health.score}/100)</span>
                                            </div>
                                            <p className="text-slate-300 mb-3">{report.health.text}</p>
                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                <p className="text-yellow-300 text-sm font-medium">💡 คำแนะนำ: {report.health.advice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overall Summary */}
                                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-purple-400" />
                                            สรุปรายเดือน
                                        </h3>
                                        <p className="text-slate-300 mb-3">{report.overall.text}</p>
                                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                            <p className="text-purple-300 text-sm font-medium">🌟 คำแนะนำพิเศษ: {report.overall.advice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </PremiumGate>
                </div>
            </div>
        </div>
    );
};
