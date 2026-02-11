import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Hexagon, Shuffle, Coins, Lock, AlertCircle, LogIn } from 'lucide-react';
import { RUNES, AETTS, RUNE_READING_MODES, drawRunes, getRunesByAett } from '../data/runeData';
import { RuneStone } from '../components/runes/RuneStone';
import { RuneReading } from '../components/runes/RuneReading';
import { RuneHistory } from '../components/runes/RuneHistory';
import { TopUpModal } from '../components/modals/TopUpModal';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCredits } from '../hooks/useCredits';
import { useAuth } from '../contexts/AuthContext';
import { getReadingCost } from '../constants/costs';

// Map reading mode id to cost key
const MODE_COST_KEY = {
    single: 'rune_single',
    three: 'rune_three',
    five: 'rune_five',
};

export const RunePage = () => {
    usePageTitle('ดูดวงรูนโบราณ | Elder Futhark');
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [drawnRunes, setDrawnRunes] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const readingRef = useRef(null);

    const {
        credits,
        isLoading: creditsLoading,
        useCredit,
        isDailyFreeAvailable,
    } = useCredits();
    const { user, signInWithGoogle } = useAuth();

    const getModeCost = (mode) => {
        if (!mode) return { cost: 0, isDaily: false };
        return getReadingCost(MODE_COST_KEY[mode.id]);
    };

    const handleSelectMode = (mode) => {
        setSelectedMode(mode);
        setDrawnRunes(null);
        setErrorMsg(null);
    };

    const handleDraw = async () => {
        if (!selectedMode) return;
        setErrorMsg(null);

        const { cost, isDaily } = getModeCost(selectedMode);
        const isFreeDaily = isDaily && isDailyFreeAvailable;
        const effectiveCost = isFreeDaily ? 0 : cost;

        // Require login for ALL readings (including free daily)
        if (!user) {
            setErrorMsg(isFreeDaily
                ? 'กรุณาเข้าสู่ระบบเพื่อบันทึกสิทธิ์รูนรายวัน'
                : 'กรุณาเข้าสู่ระบบก่อนเพื่อใช้เครดิต');
            return;
        }

        // Check if user can afford
        if (!isFreeDaily && credits < cost) {
            setErrorMsg(`เครดิตไม่พอ (ต้องใช้ ${cost} เครดิต, มี ${credits})`);
            setIsTopUpOpen(true);
            return;
        }

        // Deduct credit
        const result = await useCredit(effectiveCost, isFreeDaily);
        if (!result.success) {
            if (result.message === 'Already used free draw today') {
                setErrorMsg('คุณใช้สิทธิ์รูนรายวันฟรีไปแล้ว กรุณาเข้าสู่ระบบเพื่อใช้เครดิต');
            } else {
                setErrorMsg(`เกิดข้อผิดพลาด: ${result.message}`);
            }
            return;
        }

        // Proceed with drawing
        setIsDrawing(true);
        await new Promise(r => setTimeout(r, 1500));

        const runeResult = drawRunes(selectedMode.count);
        setDrawnRunes(runeResult);
        setIsDrawing(false);

        setTimeout(() => {
            readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    const handleReset = () => {
        setDrawnRunes(null);
        setSelectedMode(null);
        setErrorMsg(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (showHistory) {
        return (
            <div className="min-h-screen bg-[#050B14] font-sans pb-20 relative overflow-x-hidden">
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050B14] to-black"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto pt-6 px-4">
                    <button
                        onClick={() => setShowHistory(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                    >
                        <ArrowLeft size={20} />
                        กลับหน้าทำนาย
                    </button>
                    <RuneHistory onBack={() => setShowHistory(false)} isDark={true} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B14] font-sans pb-20 relative overflow-x-hidden selection:bg-emerald-500/30">
            {/* Header Actions */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 sm:pt-12">
                <div className="flex justify-between items-start mb-8 sm:mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all backdrop-blur-sm border border-slate-700/50"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <button
                                onClick={() => setShowHistory(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-emerald-400 border border-slate-700/50 transition-all backdrop-blur-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium">ประวัติการทำนาย</span>
                            </button>
                        ) : null}

                        <div
                            onClick={() => setIsTopUpOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-amber-500/30 shadow-lg shadow-amber-900/10 cursor-pointer hover:bg-slate-800 transition-all"
                        >
                            <Coins size={16} className="text-amber-400" />
                            <span className="text-amber-100 font-bold text-sm tracking-wide">{credits}</span>
                            <div className="w-px h-3 bg-slate-700 mx-1"></div>
                            <span className="text-[10px] text-amber-500 uppercase tracking-wider font-bold">Credits</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="relative max-w-6xl mx-auto px-4 py-8">
                    {/* Intro */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm mb-4">
                            <Sparkles size={16} />
                            ศาสตร์โบราณจากสแกนดิเนเวีย
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">
                            ดึง<span className="text-emerald-400">ก้อนรูน</span>เพื่อรับคำทำนาย
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                            รูน (Runes) เป็นอักษรโบราณของชาวไวกิ้ง ใช้ในการทำนายมากว่า 2,000 ปี
                            <br />
                            ตั้งจิตอธิษฐาน แล้วเลือกรูปแบบการดึงรูน
                        </p>
                    </div>

                    {/* Mode Selection */}
                    {!drawnRunes && !isDrawing && (
                        <div className="max-w-3xl mx-auto mb-12">
                            <h3 className="text-center text-sm uppercase tracking-widest text-slate-500 mb-6">เลือกรูปแบบการทำนาย</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {RUNE_READING_MODES.map((mode) => {
                                    const isActive = selectedMode?.id === mode.id;
                                    const { cost, isDaily } = getModeCost(mode);
                                    const isFreeDaily = isDaily && isDailyFreeAvailable;
                                    const canAfford = isFreeDaily || credits >= cost;

                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => handleSelectMode(mode)}
                                            className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left ${isActive
                                                ? 'bg-emerald-500/15 border-emerald-500/50 scale-[1.02] shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                                                : 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700 hover:scale-[1.01]'
                                                }`}
                                        >
                                            <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${isFreeDaily
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : !user
                                                    ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                                    : canAfford
                                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {isFreeDaily ? (
                                                    'FREE'
                                                ) : (
                                                    <>
                                                        <Coins size={10} />
                                                        {cost}
                                                    </>
                                                )}
                                            </span>

                                            <div className="text-3xl mb-3">{mode.icon}</div>
                                            <h4 className={`font-bold mb-1 ${isActive ? 'text-emerald-300' : 'text-white'}`}>{mode.name}</h4>
                                            <p className="text-xs text-slate-500 mb-3">{mode.nameTh}</p>
                                            <p className="text-xs text-slate-400 leading-relaxed">{mode.description}</p>

                                            {/* Position labels */}
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {mode.positions.map((pos, i) => (
                                                    <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                                                        {pos}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Draw Button */}
                            {selectedMode && (
                                <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Error message */}
                                    {errorMsg && (
                                        <div className="mb-4 mx-auto max-w-md px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
                                            <AlertCircle size={16} className="shrink-0" />
                                            {errorMsg}
                                        </div>
                                    )}

                                    {(() => {
                                        const { cost, isDaily } = getModeCost(selectedMode);
                                        const isFreeDaily = isDaily && isDailyFreeAvailable;
                                        // Always require login, even for free daily
                                        const needsLogin = !user;
                                        const canAfford = isFreeDaily || credits >= cost;

                                        // Determine button action
                                        const handleClick = needsLogin
                                            ? signInWithGoogle
                                            : canAfford
                                                ? handleDraw
                                                : () => setIsTopUpOpen(true);

                                        return (
                                            <button
                                                onClick={handleClick}
                                                disabled={isDrawing}
                                                className={`group relative px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl flex items-center gap-3 mx-auto ${isDrawing
                                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                                    : needsLogin
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/25'
                                                        : canAfford
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 active:scale-95 shadow-emerald-500/25 hover:shadow-emerald-500/40'
                                                            : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:scale-105'
                                                    }`}
                                            >
                                                {isDrawing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                                                        กำลังสุ่มรูน...
                                                    </>
                                                ) : needsLogin ? (
                                                    <>
                                                        <LogIn size={20} />
                                                        เข้าสู่ระบบเพื่อดึงรูน
                                                        <span className="text-sm opacity-75">({cost} เครดิต)</span>
                                                    </>
                                                ) : canAfford ? (
                                                    <>
                                                        <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                                        ดึงรูน {selectedMode.count} ก้อน
                                                        {!isFreeDaily && (
                                                            <span className="text-sm opacity-75">({cost} เครดิต)</span>
                                                        )}
                                                        {isFreeDaily && (
                                                            <span className="text-sm text-green-300 font-normal">(ฟรี!)</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock size={20} />
                                                        เครดิตไม่พอ — เติมเครดิต
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Drawing Animation */}
                    {isDrawing && (
                        <div className="flex justify-center items-center py-16">
                            <div className="relative">
                                <div className="text-6xl rune-shake">🪨</div>
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                            </div>
                        </div>
                    )}

                    {/* Reading Results */}
                    {drawnRunes && !isDrawing && (
                        <div ref={readingRef}>
                            <RuneReading
                                drawnRunes={drawnRunes}
                                positions={selectedMode.positions}
                                mode={selectedMode.id}
                                onReset={handleReset}
                            />
                        </div>
                    )}

                    {/* Rune Reference Grid */}
                    {!drawnRunes && !isDrawing && (
                        <div className="mt-16">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-serif text-white mb-2">อักษรรูนทั้ง 24 ตัว</h3>
                                <p className="text-slate-500 text-sm">Elder Futhark — แบ่งเป็น 3 กลุ่ม Aett</p>
                            </div>

                            <div className="space-y-10">
                                {[1, 2, 3].map(aettNum => {
                                    const aett = AETTS[aettNum];
                                    const runes = getRunesByAett(aettNum);
                                    return (
                                        <section key={aettNum}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-2xl">{aett.icon}</span>
                                                <div>
                                                    <h4 className={`text-lg font-bold ${aett.color}`}>{aett.name}</h4>
                                                    <p className="text-xs text-slate-500">{aett.description}</p>
                                                </div>
                                                <div className={`flex-1 h-px ${aett.bg}`} />
                                            </div>

                                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                                {runes.map(rune => (
                                                    <div key={rune.id}
                                                        className={`group p-3 rounded-xl ${aett.bg} border ${aett.border} text-center hover:scale-105 transition-all cursor-default`}
                                                    >
                                                        <span className="text-2xl block mb-1" style={{ color: rune.color }}>
                                                            {rune.symbol}
                                                        </span>
                                                        <p className="text-[10px] font-bold text-white">{rune.name}</p>
                                                        <p className="text-[9px] text-slate-500">{rune.meaning}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>

                {/* TopUp Modal */}
                <TopUpModal
                    isOpen={isTopUpOpen}
                    onClose={() => setIsTopUpOpen(false)}
                    isDark={true}
                />
            </div>
        </div>
    );
};
