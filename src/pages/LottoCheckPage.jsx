import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, FileText, Search, Calendar } from 'lucide-react';
import * as lottoService from '../services/lottoService';
import { usePageSEO } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

export const LottoCheckPage = () => {
    usePageSEO({
        title: 'ตรวจหวยรัฐบาล งวดล่าสุด',
        description: 'ตรวจหวยรัฐบาลออนไลน์ ผลสลากกินแบ่งรัฐบาลงวดล่าสุด ตรวจได้ทุกงวด รางวัลที่ 1 เลขท้าย 2 ตัว เลขหน้า 3 ตัว เลขท้าย 3 ตัว ครบทุกรางวัล พร้อมย้อนหลัง',
        keywords: 'ตรวจหวย, ผลสลากกินแบ่ง, หวยรัฐบาล, ตรวจลอตเตอรี่, ผลหวยงวดล่าสุด, รางวัลที่ 1, เลขท้าย 2 ตัว',
        path: '/lotto/check',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [draw, setDraw] = useState(null);
    const [error, setError] = useState('');

    // Check Lottery State
    const [inputNumber, setInputNumber] = useState('');
    const [checkedNumbers, setCheckedNumbers] = useState([]);
    const [checkResults, setCheckResults] = useState(null);

    // History State
    const [showHistory, setShowHistory] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleShowHistory = async () => {
        setShowHistory(true);
        if (historyList.length === 0) {
            setLoadingHistory(true);
            const list = await lottoService.fetchDrawHistory();
            setHistoryList(list || []);
            setLoadingHistory(false);
        }
    };

    const handleSelectDraw = async (drawId) => {
        setLoading(true);
        setShowHistory(false);
        try {
            const data = await lottoService.fetchDrawByIdFromApi(drawId);
            if (data) setDraw(data);
        } catch (err) {
            console.error(err);
            setError('ไม่สามารถดึงข้อมูลงวดย้อนหลังได้');
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch history list first to ensure we get the absolute latest available in the list
                const history = await lottoService.fetchDrawHistory();
                setHistoryList(history || []);

                let data = null;
                if (history && history.length > 0) {
                    // Fetch the details of the first (latest) item in the history
                    data = await lottoService.fetchDrawByIdFromApi(history[0].id);
                } else {
                    // Fallback to /latest endpoint if history fails
                    data = await lottoService.fetchLatestDrawFromApi();
                }

                console.log('Fetched Draw Data:', data); // DEBUG
                if (data && data.prizes && data.runningNumbers) {
                    setDraw(data);
                } else {
                    console.error('Invalid draw data structure:', data);
                    setError('ข้อมูลผลรางวัลไม่ถูกต้อง');
                }
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAddNumber = () => {
        if (!inputNumber) return;
        if (inputNumber.length !== 6) {
            alert('กรุณากรอกเลข 6 หลัก');
            return;
        }
        if (checkedNumbers.includes(inputNumber)) {
            setInputNumber('');
            return;
        }
        setCheckedNumbers([...checkedNumbers, inputNumber]);
        setInputNumber('');
        setCheckResults(null); // Reset results when modifying numbers
    };

    const handleRemoveNumber = (numToRemove) => {
        setCheckedNumbers(checkedNumbers.filter(num => num !== numToRemove));
        setCheckResults(null);
    };

    const handleCheck = () => {
        if (checkedNumbers.length === 0) {
            alert('กรุณาเพิ่มหมายเลขสลากอย่างน้อย 1 ใบ');
            return;
        }

        if (!draw) return;

        const results = [];
        let totalWinAmount = 0;
        let totalWinTickets = 0;

        checkedNumbers.forEach(num => {
            const winPrizes = lottoService.checkLotteryWin(num, draw);
            if (winPrizes && winPrizes.length > 0) {
                const winAmount = winPrizes.reduce((sum, p) => sum + parseInt(p.reward || 0), 0);
                totalWinAmount += winAmount;
                totalWinTickets++;
                results.push({ number: num, isWin: true, prizes: winPrizes, totalReward: winAmount });
            } else {
                results.push({ number: num, isWin: false, prizes: [] });
            }
        });

        // Sort winners first
        results.sort((a, b) => (b.isWin ? 1 : 0) - (a.isWin ? 1 : 0));

        setCheckResults({
            items: results,
            summary: {
                totalTickets: checkedNumbers.length,
                totalWinTickets,
                totalWinAmount
            }
        });
    };

    // Renders inside the component
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-slate-500 text-sm font-medium animate-pulse">กำลังโหลดข้อมูลสลาก...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border border-slate-200 mb-6 shadow-xl">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-slate-800">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        กรุณาเข้าสู่ระบบเพื่อใช้งานระบบตรวจสลากกินแบ่งรัฐบาล
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

    // Helper to render prize block
    const PrizeBlock = ({ title, reward, numbers, cols = 1, color = "amber" }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-${color}-100 overflow-hidden`}>
            <div className={`bg-${color}-50 px-4 py-3 border-b border-${color}-100 flex justify-between items-center flex-wrap gap-2`}>
                <h3 className={`font-bold text-${color}-800`}>{title}</h3>
                <span className={`text-xs px-2 py-1 bg-white rounded-lg text-${color}-600 font-medium border border-${color}-200`}>
                    รางวัลละ {parseInt(reward).toLocaleString()} บาท
                </span>
            </div>
            <div className={`p-4 grid grid-cols-2 md:grid-cols-${cols} gap-3`}>
                {numbers.map((num, idx) => {
                    const isChecked = checkedNumbers.includes(num);
                    return (
                        <div
                            key={idx}
                            className={`font-mono text-xl md:text-2xl font-bold text-center py-2 rounded-lg border relative overflow-hidden ${isChecked ? `bg-${color}-100 border-${color}-300 text-${color}-700 ring-2 ring-${color}-500 shadow-md transform scale-105` : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                        >
                            {num}
                            {isChecked && (
                                <div className={`absolute top-0 right-0 p-0.5 bg-${color}-500 text-white text-[10px] rounded-bl-lg`}>
                                    ถูกรางวัล
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-10">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-100 backdrop-blur-md shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight">
                                ตรวจหวย
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">{draw?.date || 'กำลังโหลด...'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleShowHistory}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <FileText size={16} />
                        <span>งวดอื่น</span>
                    </button>
                </div>
            </header>

            {/* History Modal/Drawer */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowHistory(false)}>
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-700">เลือกงวดสลาก</h3>
                            <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                                <ArrowLeft size={18} className="rotate-180" /> {/* Close icon lookalike */}
                            </button>
                        </div>

                        <div className="overflow-y-auto p-2 space-y-1">
                            {loadingHistory ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-amber-500" />
                                </div>
                            ) : (
                                historyList.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelectDraw(item.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-between group ${item.date === draw.date ? 'bg-amber-50 border border-amber-200' : 'border border-transparent'}`}
                                    >
                                        <span className={`font-medium ${item.date === draw.date ? 'text-amber-700' : 'text-slate-700 group-hover:text-amber-700'}`}>
                                            {item.date}
                                        </span>
                                        {item.date === draw.date && <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">เลือกอยู่</span>}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
                {/* ... Main Content ... */}


                {/* Hero Input Section */}
                <section className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-xl transform -rotate-1"></div>
                    <div className="relative bg-white rounded-3xl p-6 shadow-xl shadow-amber-500/10 border border-white">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Search size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">ตรวจสลากกินแบ่ง</h2>
                                <p className="text-sm text-slate-500">กรอกเลข 6 หลักเพื่อตรวจรางวัล</p>
                            </div>
                        </div>

                        {/* Tag Area */}
                        {checkedNumbers.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[60px]">
                                {checkedNumbers.map((num, idx) => (
                                    <div key={idx} className="group relative bg-white border border-amber-200 text-slate-700 w-24 h-10 flex items-center justify-center rounded-lg shadow-sm font-mono text-xl font-bold tracking-wider animate-in zoom-in-95 duration-200">
                                        {num}
                                        <button
                                            onClick={() => handleRemoveNumber(num)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <ArrowLeft size={12} className="rotate-45" />
                                        </button>

                                        {/* Decorative dots for ticket look */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-slate-50 rounded-full border-r border-amber-200"></div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-slate-50 rounded-full border-l border-amber-200"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    maxLength={6}
                                    inputMode="numeric"
                                    value={inputNumber}
                                    onChange={(e) => setInputNumber(e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (inputNumber) handleAddNumber();
                                            else if (checkedNumbers.length > 0) handleCheck();
                                        }
                                    }}
                                    placeholder={checkedNumbers.length === 0 ? "กรอกเลขสลาก 6 หลัก..." : "เพิ่มใบต่อไป..."}
                                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-100 hover:border-amber-200 focus:border-amber-500 rounded-2xl px-5 py-4 text-2xl text-center font-mono tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300 placeholder:text-lg outline-none transition-all shadow-inner focus:shadow-lg focus:shadow-amber-500/10 text-slate-700"
                                />
                                {inputNumber && (
                                    <button
                                        onClick={handleAddNumber}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 transition-all active:scale-95"
                                    >
                                        <ArrowLeft size={20} className="rotate-180" />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleCheck}
                                disabled={checkedNumbers.length === 0 && !inputNumber}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                <Search size={22} className="stroke-[2.5]" />
                                <span>ตรวจผล</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Result Message Overlay/Block */}
                {checkResults && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                        {/* Summary Card */}
                        <div className={`rounded-2xl p-6 text-center ${checkResults.summary.totalWinTickets > 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200' : 'bg-slate-100 border border-slate-200'}`}>
                            {checkResults.summary.totalWinTickets > 0 ? (
                                <div className="space-y-2">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-2 shadow-sm">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700">ยินดีด้วยคุณถูกรางวัล!</h2>
                                    <p className="text-green-800">
                                        ถูกรางวัลจำนวน <span className="font-bold text-xl">{checkResults.summary.totalWinTickets}</span> ใบ
                                        จากทั้งหมด {checkResults.summary.totalTickets} ใบ
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-sm text-green-600 uppercase tracking-wider font-bold">เงินรางวัลรวม</span>
                                        <div className="text-4xl font-black text-green-600 mt-1">
                                            ฿{checkResults.summary.totalWinAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2 shadow-sm">
                                        <span className="text-2xl">😢</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-700">เสียใจด้วย คุณไม่ถูกรางวัล</h2>
                                    <p className="text-slate-500">
                                        ตรวจแล้ว {checkResults.summary.totalTickets} ใบ ไม่ถูกรางวัลใดๆ ในงวดนี้
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Detail List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {checkResults.items.map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-xl flex items-center justify-between border ${item.isWin ? 'bg-white border-green-200 shadow-md ring-1 ring-green-100' : 'bg-slate-50 border-slate-100 opacity-75'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-white ${item.isWin ? 'bg-green-500' : 'bg-slate-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold font-mono text-xl text-slate-800 tracking-wider">{item.number}</p>
                                            {item.isWin && (
                                                <div className="flex flex-col">
                                                    {item.prizes.map((p, pIdx) => (
                                                        <span key={pIdx} className="text-xs font-bold text-green-600">{p.name}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {item.isWin ? (
                                            <span className="font-bold text-green-600 block">+{item.totalReward.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-sm text-slate-400">ไม่ถูกรางวัล</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Prizes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* First Prize */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 text-center shadow-sm">
                        <h2 className="text-lg font-bold text-amber-800 mb-1">รางวัลที่ 1</h2>
                        <p className="text-sm text-amber-600 mb-4">รางวัลละ 6,000,000 บาท</p>
                        <div className="text-5xl md:text-6xl font-black text-amber-600 tracking-wider font-mono select-all">
                            {draw.prizes.find(p => p.id === 'prizeFirst')?.number?.[0] || '------'}
                        </div>
                    </div>

                    {/* Neighbors */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                        <h3 className="font-bold text-slate-700 mb-1">เลขข้างเคียงรางวัลที่ 1</h3>
                        <p className="text-xs text-slate-500 mb-3">รางวัลละ 100,000 บาท</p>
                        <div className="flex justify-center gap-4">
                            {(draw.prizes.find(p => p.id === 'prizeFirstNear')?.number || []).map((num, idx) => (
                                <span key={idx} className="text-xl font-bold text-slate-600 font-mono">{num}</span>
                            ))}
                        </div>
                    </div>

                    {/* 2 Digits */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 text-center">
                        <h3 className="font-bold text-blue-700 mb-1">เลขท้าย 2 ตัว</h3>
                        <p className="text-xs text-slate-500 mb-3">รางวัลละ 2,000 บาท</p>
                        <div className="text-4xl font-black text-blue-600 font-mono">
                            {draw.runningNumbers.find(p => p.id === 'runningNumberBackTwo')?.number?.[0] || '--'}
                        </div>
                    </div>

                    {/* 3 Digits */}
                    <div className="md:col-span-2 lg:col-span-1 bg-white rounded-xl p-4 shadow-sm border border-purple-100 text-center">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h3 className="font-bold text-purple-700 mb-1">เลขหน้า 3 ตัว</h3>
                                <p className="text-xs text-slate-500 mb-2">รางวัลละ 4,000 บาท</p>
                                <div className="flex justify-center gap-4">
                                    {(draw.runningNumbers.find(p => p.id === 'runningNumberFrontThree')?.number || []).map((num, idx) => (
                                        <span key={idx} className="text-xl font-bold text-purple-600 font-mono">{num}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-3">
                                <h3 className="font-bold text-purple-700 mb-1">เลขท้าย 3 ตัว</h3>
                                <p className="text-xs text-slate-500 mb-2">รางวัลละ 4,000 บาท</p>
                                <div className="flex justify-center gap-4">
                                    {(draw.runningNumbers.find(p => p.id === 'runningNumberBackThree')?.number || []).map((num, idx) => (
                                        <span key={idx} className="text-xl font-bold text-purple-600 font-mono">{num}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Prizes */}
                <div className="space-y-6">
                    <PrizeBlock
                        title="รางวัลที่ 2"
                        reward={draw.prizes.find(p => p.id === 'prizeSecond')?.reward}
                        numbers={draw.prizes.find(p => p.id === 'prizeSecond')?.number || []}
                        cols={3}
                        color="blue"
                    />

                    <PrizeBlock
                        title="รางวัลที่ 3"
                        reward={draw.prizes.find(p => p.id === 'prizeThird')?.reward}
                        numbers={draw.prizes.find(p => p.id === 'prizeThird')?.number || []}
                        cols={3}
                        color="green"
                    />

                    <PrizeBlock
                        title="รางวัลที่ 4"
                        reward={draw.prizes.find(p => p.id === 'prizeForth')?.reward}
                        numbers={draw.prizes.find(p => p.id === 'prizeForth')?.number || []}
                        cols={4}
                        color="pink"
                    />

                    <PrizeBlock
                        title="รางวัลที่ 5"
                        reward={draw.prizes.find(p => p.id === 'prizeFifth')?.reward}
                        numbers={draw.prizes.find(p => p.id === 'prizeFifth')?.number || []}
                        cols={5}
                        color="slate"
                    />
                </div>

                {/* Information / SEO Section */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">เกร็ดความรู้สลากกินแบ่งรัฐบาล</h2>
                    </div>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">วิธีตรวจผลสลากกินแบ่งอย่างถูกวิธี</h3>
                            <p>การตรวจผลสลากกินแบ่งรัฐบาลควรตรวจสอบจากแหล่งข้อมูลที่เชื่อถือได้ โดยปกติแล้วหวยจะออกรางวัลเดือนละ 2 ครั้ง คือวันที่ 1 และ 16 ของทุกเดือน (ยกเว้นงวดพิเศษ) เพื่อความแม่นยำ ควรตรวจทานตัวเลขให้ครบถ้วนทั้ง 6 หลัก และตรวจสอบรางวัลข้างเคียง, เลขท้าย 2 ตัว, เลขหน้า 3 ตัว และเลขท้าย 3 ตัวด้วย</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">ข้อควรระวังและการเก็บรักษาสลาก</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>สลากกินแบ่งรัฐบาลมีอายุการขึ้นเงินรางวัล 2 ปีนับจากงวดที่ออกรางวัล</li>
                                <li>ห้ามขีดเขียน แก้ไข หรือทำให้สลากชำรุด โดยเฉพาะบริเวณบาร์โค้ดเนื่องจากอาจมีปัญหาตอนขึ้นเงิน</li>
                                <li>ควรเซ็นชื่อหลังสลากทันทีเมื่อซื้อ เพื่อยืนยันความเป็นเจ้าของ</li>
                                <li>เก็บสลากไว้ในที่แห้ง ไม่โดนความร้อนหรือแสงแดดโดยตรง</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">ทำอย่างไรเมื่อถูกรางวัล?</h3>
                            <p>หากท่านโชคดีถูกรางวัล สามารถนำสลากไปขึ้นเงินได้ที่สำนักงานสลากกินแบ่งรัฐบาล หรือธนาคารที่รับขึ้นเงินรางวัล (เช่น ธ.ก.ส., ออมสิน, กรุงไทย) โดยจะมีค่าธรรมเนียมอากรแสตมป์หรือภาษีหัก ณ ที่จ่าย (ประมาณ 0.5% - 1%) ควรเตรียมบัตรประชาชนตัวจริงไปด้วยทุกครั้ง</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mt-4">
                            <strong>หมายเหตุ:</strong> ข้อมูลผลรางวัลในแอปพลิเคชันนี้เป็นเพียงการอำนวยความสะดวก โปรดตรวจสอบความถูกต้องอีกครั้งกับสำนักงานสลากกินแบ่งรัฐบาล หรือใบตรวจหวยฉบับมาตรฐาน
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
export default LottoCheckPage;
