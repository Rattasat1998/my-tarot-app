import React, { useState } from 'react';
import { RuneStone } from './RuneStone';
import { ArrowLeft, RotateCcw, Heart, Briefcase, Lightbulb, Save, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SaveMemoModal } from '../modals/SaveMemoModal';
import { LoginModal } from '../modals/LoginModal';

export const RuneReading = ({ drawnRunes, positions, mode, onReset }) => {
    const { user } = useAuth();
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    if (!drawnRunes || drawnRunes.length === 0) return null;

    // Layout for 5-rune cross
    const isCross = mode === 'five';

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">ผลการทำนาย</h3>
                <p className="text-slate-400 text-sm">แตะก้อนรูนแต่ละก้อนเพื่อดูรายละเอียด</p>
            </div>

            {/* Rune Layout */}
            {isCross ? (
                /* Cross Layout for 5 runes */
                <div className="relative max-w-md mx-auto mb-8" style={{ minHeight: '320px' }}>
                    {/* Top - สิ่งช่วยเหลือ */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-emerald-400 font-medium">{positions[2]}</span>
                        <RuneStone rune={drawnRunes[2]} isRevealed isReversed={drawnRunes[2]?.isReversed} size="sm" />
                    </div>
                    {/* Left - อุปสรรค */}
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-red-400 font-medium">{positions[1]}</span>
                        <RuneStone rune={drawnRunes[1]} isRevealed isReversed={drawnRunes[1]?.isReversed} size="sm" />
                    </div>
                    {/* Center - สถานการณ์ */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-yellow-400 font-medium">{positions[0]}</span>
                        <RuneStone rune={drawnRunes[0]} isRevealed isReversed={drawnRunes[0]?.isReversed} size="md" />
                    </div>
                    {/* Right - รากฐาน */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-blue-400 font-medium">{positions[3]}</span>
                        <RuneStone rune={drawnRunes[3]} isRevealed isReversed={drawnRunes[3]?.isReversed} size="sm" />
                    </div>
                    {/* Bottom - ผลลัพธ์ */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-purple-400 font-medium">{positions[4]}</span>
                        <RuneStone rune={drawnRunes[4]} isRevealed isReversed={drawnRunes[4]?.isReversed} size="sm" />
                    </div>
                </div>
            ) : (
                /* Linear Layout for 1 or 3 runes */
                <div className="flex justify-center gap-6 sm:gap-10 flex-wrap mb-8">
                    {drawnRunes.map((rune, idx) => (
                        <div key={rune.id} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">{positions[idx]}</span>
                            <RuneStone
                                rune={rune}
                                isRevealed
                                isReversed={rune.isReversed}
                                size={drawnRunes.length === 1 ? 'lg' : 'md'}
                                delay={idx * 200}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Detailed Readings */}
            <div className="max-w-3xl mx-auto space-y-6 mt-10">
                {drawnRunes.map((rune, idx) => {
                    const reading = rune.isReversed ? rune.reversed : rune.upright;
                    return (
                        <div key={rune.id}
                            className="relative bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 overflow-hidden"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Background accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                                style={{ backgroundColor: rune.color }} />

                            {/* Position label */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl" style={{ color: rune.color }}>
                                    {rune.symbol}
                                </span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-bold text-white">{rune.name}</h4>
                                        <span className="text-slate-500 text-sm">({rune.nameTh})</span>
                                        {rune.isReversed && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                                กลับหัว
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-emerald-400">{positions[idx]}</p>
                                </div>
                            </div>

                            {/* Reading title */}
                            <h5 className="text-base font-serif text-white mb-3">{reading.title}</h5>

                            {/* Main description */}
                            <p className="text-sm text-slate-300 leading-relaxed mb-5">{reading.description}</p>

                            {/* Category readings */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-pink-500/5 border border-pink-500/10">
                                    <Heart size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-pink-400 font-medium mb-1">ความรัก</p>
                                        <p className="text-xs text-slate-400 leading-relaxed">{reading.love}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <Briefcase size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium mb-1">การงาน</p>
                                        <p className="text-xs text-slate-400 leading-relaxed">{reading.work}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                    <Lightbulb size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-amber-400 font-medium mb-1">คำแนะนำ</p>
                                        <p className="text-xs text-slate-400 leading-relaxed">{reading.advice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {rune.keywords.map(kw => (
                                    <span key={kw} className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                <button
                    onClick={onReset}
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-all"
                >
                    <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                    ทำนายอีกครั้ง
                </button>

                {user ? (
                    <button
                        onClick={() => setShowSaveModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Save size={18} />
                        บันทึกผลการทำนาย
                    </button>
                ) : (
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 hover:border-emerald-500/30 transition-all"
                    >
                        <LogIn size={18} />
                        เข้าสู่ระบบเพื่อบันทึก
                    </button>
                )}
            </div>

            <SaveMemoModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                topic="rune"
                readingType={mode}
                cards={drawnRunes}
                isDark={true}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />

            {/* Disclaimer */}
            <p className="text-center text-slate-600 text-xs mt-8">
                การทำนายด้วยรูนเป็นศาสตร์โบราณจากสแกนดิเนเวีย เพื่อความบันเทิงและแรงบันดาลใจ ✨
            </p>
        </div>
    );
};
