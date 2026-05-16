import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Flame, Calendar, Trophy, Sparkles, Star, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getDrawById } from '../services/lottoService';
// Fallback to static data
import { LOTTO_DRAWS } from '../data/lottoData';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

export const LottoDetailPage = () => {
    const { drawId } = useParams();
    const navigate = useNavigate();
    // Use 'loading' string as initial state to distinguish from "not found"
    const [draw, setDraw] = useState('loading');

    usePageSEO({
        title: draw && draw !== 'loading' ? `วิเคราะห์หวย ${draw.label}` : 'รายงานวิเคราะห์เชิงลึก',
        description: draw && draw !== 'loading'
            ? `วิเคราะห์หวยงวด ${draw.label} เชิงลึก สถิติย้อนหลัง เลขเด็ดจากสำนักดัง เหตุการณ์สำคัญ โหราศาสตร์ บทสรุปเลขเด่นประจำงวด`
            : 'รายงานวิเคราะห์หวยเชิงลึก สถิติย้อนหลัง แนวทางจากสำนักดัง กระแสสังคม',
        keywords: 'วิเคราะห์หวย, สถิติหวย, เลขเด็ด, สำนักดัง, หวยรัฐบาล, เลขมงคล',
        path: `/lotto/${drawId}`,
    });
    const [expandedSections, setExpandedSections] = useState({
        historical: true,
        sunday: false,
        events: true,
        sources: true,
        horoscope: false,
        vip: false,
        conclusion: true
    });
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const fetchDraw = async () => {
            // Try database first
            const data = await getDrawById(drawId);
            if (data) {
                setDraw(data);
            } else {
                // Fallback to static data
                const staticDraw = LOTTO_DRAWS.find(d => String(d.id) === String(drawId));
                setDraw(staticDraw || null);
            }
        };
        fetchDraw();
    }, [drawId]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Still loading - show empty/minimal while fetching
    if (draw === 'loading') {
        return <div className="min-h-screen bg-amber-50" />;
    }

    // Actually not found
    if (!draw) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-slate-600">ไม่พบข้อมูลงวดนี้</p>
                    <button onClick={() => navigate('/lotto')} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full">
                        กลับหน้าหลัก
                    </button>
                </div>
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border border-slate-200 mb-6 shadow-xl">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        กรุณาเข้าสู่ระบบเพื่ออ่านรายงานวิเคราะห์เชิงลึก
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    const SectionHeader = ({ icon: Icon, title, sectionKey, color = "amber" }) => (
        <button
            onClick={() => toggleSection(sectionKey)}
            className={`w-full flex items-center justify-between p-4 rounded-xl bg-${color}-50 hover:bg-${color}-100 transition-colors`}
        >
            <div className="flex items-center gap-3">
                <Icon size={24} className={`text-${color}-500`} />
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            {expandedSections[sectionKey] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
    );

    return (
        <div className="min-h-screen bg-amber-50 text-slate-800">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 border-b border-amber-100 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/lotto', { state: { fromDetail: true } })}
                            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                📊 รายงานวิเคราะห์เชิงลึก
                            </h1>
                            <p className="text-sm text-amber-600 font-medium">{draw.label}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Summary KPI */}
                {draw.kpi && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className="text-xs text-slate-500 mb-1">สถิติสูงสุด</p>
                            <p className="text-2xl font-bold text-amber-500">{draw.kpi.historical}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className="text-xs text-slate-500 mb-1">เลขชนสำนัก</p>
                            <p className="text-2xl font-bold text-blue-500">{draw.kpi.sources}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className="text-xs text-slate-500 mb-1">กระแสมาแรง</p>
                            <p className="text-2xl font-bold text-red-500">{draw.kpi.trending}</p>
                        </div>
                    </div>
                )}

                {/* Section: Historical Stats */}
                {draw.historical_stats && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={TrendingUp} title="สถิติย้อนหลัง 22 ปี" sectionKey="historical" />
                        {expandedSections.historical && (
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-amber-100">
                                            <th className="px-3 py-2 text-left">ปี</th>
                                            <th className="px-3 py-2 text-left">รางวัลที่ 1</th>
                                            <th className="px-3 py-2 text-center">ท้าย 2 ตัว</th>
                                            <th className="px-3 py-2 text-left hidden md:table-cell">หน้า 3 ตัว</th>
                                            <th className="px-3 py-2 text-left hidden md:table-cell">ท้าย 3 ตัว</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {draw.historical_stats.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/50'}>
                                                <td className="px-3 py-2 font-medium">{row.year}</td>
                                                <td className="px-3 py-2 font-mono text-amber-600">{row.first}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">
                                                        {row.lastTwo}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 hidden md:table-cell text-slate-600">
                                                    {row.front3?.join(', ') || '-'}
                                                </td>
                                                <td className="px-3 py-2 hidden md:table-cell text-slate-600">
                                                    {row.back3?.join(', ') || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-xs text-slate-500 mt-3 text-center">
                                    📌 เลข <span className="text-blue-600 font-bold">09</span> ออกซ้ำ 2 ครั้ง (ปี 2559, 2567) |
                                    เลข <span className="text-amber-600 font-bold">00</span> ปรากฏในรางวัลที่ 1 (ปี 2559, 2568)
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Section: Sunday Stats */}
                {draw.sunday_stats && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Calendar} title={draw.sunday_stats.title || 'สถิติวันอาทิตย์'} sectionKey="sunday" color="blue" />
                        {expandedSections.sunday && (
                            <div className="p-4 space-y-4">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <p className="text-sm text-blue-700 mb-3">{draw.sunday_stats.note}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2">เลขท้าย 2 ตัวที่ออกบ่อย</p>
                                            {draw.sunday_stats.lastTwo?.map((group, idx) => (
                                                <div key={idx} className="mb-2">
                                                    <span className="text-xs text-slate-400">ออก {group.count} ครั้ง: </span>
                                                    <span className="text-sm font-medium">{group.numbers.join(', ')}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2">เลขท้าย 2 ตัวบน (จากรางวัล 1)</p>
                                            {draw.sunday_stats.firstTwoFromFirst?.map((group, idx) => (
                                                <div key={idx} className="mb-2">
                                                    <span className="text-xs text-slate-400">ออก {group.count} ครั้ง: </span>
                                                    <span className="text-sm font-bold text-blue-600">{group.numbers.join(', ')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3">
                                        ✨ ตัวเลขเด่นในวันอาทิตย์: <span className="font-bold">{draw.sunday_stats.dominantDigits?.join(', ')}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Section: Events */}
                {draw.events && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Flame} title="เลขจากเหตุการณ์สำคัญ" sectionKey="events" color="red" />
                        {expandedSections.events && (
                            <div className="p-4 space-y-4">
                                {draw.events.map((event, idx) => (
                                    <div key={idx} className="border border-red-100 rounded-xl p-4">
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                                            <span>{event.icon}</span> {event.title}
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                            {event.details?.map((detail, didx) => (
                                                <div key={didx} className="bg-slate-50 rounded-lg p-2">
                                                    <p className="text-xs text-slate-500">{detail.label}</p>
                                                    <p className="font-medium">{detail.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-xs text-slate-500">เลขเด็ด:</span>
                                            {event.hotNumbers?.map((num, nidx) => (
                                                <span key={nidx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm">
                                                    {num}
                                                </span>
                                            ))}
                                        </div>
                                        {event.partyNumbers && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {event.partyNumbers.map((p, pidx) => (
                                                    <span key={pidx} className="text-xs bg-slate-100 px-2 py-1 rounded">
                                                        {p.party}: <span className="font-bold">{p.number}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Section: Sources */}
                {draw.sources && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Users} title="แนวทางจากสำนักดัง" sectionKey="sources" color="purple" />
                        {expandedSections.sources && (
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-purple-50">
                                            <th className="px-3 py-2 text-left">สำนัก</th>
                                            <th className="px-3 py-2 text-center">เลขเด่น</th>
                                            <th className="px-3 py-2 text-left">เลขท้าย 2 ตัว</th>
                                            <th className="px-3 py-2 text-left hidden md:table-cell">เลข 3 ตัว / พิเศษ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {draw.sources.map((source, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium">{source.name}</div>
                                                    <div className="text-xs text-slate-500">{source.theme}</div>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
                                                        {source.numberHot || source.singlePick || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">{source.two?.join(', ') || '-'}</td>
                                                <td className="px-3 py-2 hidden md:table-cell">
                                                    {source.three?.join(', ') || source.four || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-xs text-slate-500 mt-3 text-center">
                                    🤝 เลขที่ตรงกัน 3 สำนัก: <span className="font-bold text-purple-600">1</span> (สอดคล้องกับสถิติวันอาทิตย์)
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Section: Horoscope */}
                {draw.horoscope && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Star} title="มิติโหราศาสตร์และปฏิทินจีน" sectionKey="horoscope" color="yellow" />
                        {expandedSections.horoscope && (
                            <div className="p-4 space-y-4">
                                {draw.horoscope.year && (
                                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                                        <h4 className="font-bold text-orange-700 mb-2">
                                            🐴 ปี{draw.horoscope.year.animal} {draw.horoscope.year.element}
                                        </h4>
                                        <p className="text-sm text-slate-600 mb-3">
                                            เลขทรงพลังประจำปี: <span className="font-bold">{draw.horoscope.year.luckyNumbers?.join(', ')}</span>
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            เลขสมดุล: <span className="font-bold text-orange-600">{draw.horoscope.year.balanceNumber}</span> |
                                            คู่เลขที่น่าสนใจ: <span className="font-bold">{draw.horoscope.year.relatedPairs?.join(', ')}</span>
                                        </p>
                                    </div>
                                )}
                                {draw.horoscope.chineseCalendar && (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4">
                                        <h4 className="font-bold text-red-700 mb-2">📅 ปฏิทินจีน</h4>
                                        <p className="text-sm text-slate-600 mb-2">
                                            เลขแนวตั้ง: <span className="font-bold">{draw.horoscope.chineseCalendar.verticalNumbers?.join(' → ')}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs text-slate-500">ชุด 2 ตัว:</span>
                                            {draw.horoscope.chineseCalendar.twoPairs?.map((num, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                                                    {num}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs text-slate-500">ชุด 3 ตัว:</span>
                                            {draw.horoscope.chineseCalendar.threePairs?.map((num, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-sm font-medium">
                                                    {num}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Section: VIP Numbers */}
                {draw.vip_numbers && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Trophy} title="เลขมงคลบุคคลสำคัญ" sectionKey="vip" color="green" />
                        {expandedSections.vip && (
                            <div className="p-4 space-y-3">
                                {draw.vip_numbers.map((vip, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                        <div>
                                            <p className="font-medium">{vip.name}</p>
                                            <p className="text-xs text-slate-500">{vip.event} - {vip.anniversary}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {vip.numbers?.map((num, nidx) => (
                                                <span key={nidx} className="px-2 py-1 bg-green-100 text-green-700 rounded font-bold text-sm">
                                                    {num}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Section: Conclusion */}
                {draw.conclusion && (
                    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <SectionHeader icon={Sparkles} title="บทสรุปเชิงวิเคราะห์" sectionKey="conclusion" color="amber" />
                        {expandedSections.conclusion && (
                            <div className="p-4 space-y-4">
                                {/* Statistical */}
                                {draw.conclusion.statistical && (
                                    <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-4">
                                        <h4 className="font-bold flex items-center gap-2 mb-3">
                                            {draw.conclusion.statistical.icon} {draw.conclusion.statistical.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {draw.conclusion.statistical.numbers?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-12 h-8 flex items-center justify-center bg-amber-200 text-amber-800 rounded font-bold">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-sm text-slate-600">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Event Driven */}
                                {draw.conclusion.eventDriven && (
                                    <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-4">
                                        <h4 className="font-bold flex items-center gap-2 mb-3">
                                            {draw.conclusion.eventDriven.icon} {draw.conclusion.eventDriven.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {draw.conclusion.eventDriven.numbers?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-12 h-8 flex items-center justify-center bg-red-200 text-red-800 rounded font-bold">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-sm text-slate-600">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Consensus */}
                                {draw.conclusion.consensus && (
                                    <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-xl p-4">
                                        <h4 className="font-bold flex items-center gap-2 mb-3">
                                            {draw.conclusion.consensus.icon} {draw.conclusion.consensus.title}
                                        </h4>
                                        <div className="space-y-2">
                                            {draw.conclusion.consensus.numbers?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-12 h-8 flex items-center justify-center bg-purple-200 text-purple-800 rounded font-bold">
                                                        {item.num}
                                                    </span>
                                                    <span className="text-sm text-slate-600">{item.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Final Picks */}
                                {draw.conclusion.finalPicks && (
                                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 text-center">
                                        <h4 className="font-bold text-amber-800 mb-3">🎯 สรุปเลขเด่นประจำงวด</h4>
                                        <div className="mb-3">
                                            <p className="text-xs text-slate-500 mb-2">เลขท้าย 2 ตัว</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {draw.conclusion.finalPicks.twoDigit?.map((num, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-amber-500 text-white rounded-full font-bold shadow">
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2">เลขท้าย 3 ตัว</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {draw.conclusion.finalPicks.threeDigit?.map((num, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-orange-500 text-white rounded-full font-bold shadow">
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Disclaimer */}
                <footer className="text-center py-6 text-slate-400 text-xs">
                    <p>ข้อมูลนี้เป็นเพียงการวิเคราะห์ทางสถิติเพื่อความบันเทิง</p>
                    <p>โปรดใช้วิจารณญาณในการรับชม ทางผู้จัดทำไม่สนับสนุนการพนัน</p>
                </footer>
            </main>
        </div>
    );
};

export default LottoDetailPage;
