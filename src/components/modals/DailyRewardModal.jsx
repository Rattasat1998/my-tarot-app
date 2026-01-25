import React, { useEffect, useState } from 'react';
import { Flame, Star, CheckCircle, X, Gift, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const DailyRewardModal = ({ isOpen, onClose, streak, checked_in_today, isFreeClaimedToday, onClaimFree, isDark }) => {
    const [animate, setAnimate] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [claimingFree, setClaimingFree] = useState(false);

    // Internal state to handle immediate UI update after claim without re-fetching parent
    const [localCheckedIn, setLocalCheckedIn] = useState(checked_in_today);
    const [localStreak, setLocalStreak] = useState(streak);
    const [justClaimedReward, setJustClaimedReward] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimate(true);
            // Sync props to local state when modal opens
            setLocalCheckedIn(checked_in_today);
            setLocalStreak(streak);
            setJustClaimedReward(false);
        }
    }, [isOpen, streak, checked_in_today]);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            const { data, error } = await supabase.rpc('claim_daily_checkin');
            if (error) throw error;

            if (data && data.success) {
                setLocalStreak(data.streak);
                setLocalCheckedIn(true);
                if (data.reward && data.reward > 0) {
                    setJustClaimedReward(true);
                }
            }
        } catch (err) {
            console.error('Error claiming reward:', err);
        } finally {
            setClaiming(false);
        }
    };

    const handleClaimFreeDraw = async () => {
        setClaimingFree(true);
        try {
            await onClaimFree();
        } catch (err) {
            console.error('Error claiming free draw:', err);
        } finally {
            setClaimingFree(false);
        }
    };

    if (!isOpen) return null;

    // Grid Logic
    // Total 7 days.
    // If localCheckedIn: we current are at (localStreak-1)%7 + 1 position. All previous including this are filled.
    // If !localCheckedIn: we are waiting to fill (localStreak)%7 + 1. Previous are filled.

    // Calculate how many stamps are "filled" (past completed days in this current/next cycle)
    const cycleIndex = localCheckedIn
        ? (localStreak - 1) % 7  // e.g. streak 1 -> index 0 filled
        : (localStreak) % 7;     // e.g. streak 0 -> index 0 waiting. streak 7 -> index 0 waiting.

    const stamps = Array.from({ length: 7 }, (_, i) => {
        const dayNum = i + 1;
        let status = 'future'; // default

        if (localCheckedIn) {
            // If checked in, all indices <= cycleIndex are filled
            if (i <= cycleIndex) status = 'filled';
        } else {
            // If not checked in
            // indices < cycleIndex are filled (from previous days)
            // index == cycleIndex is 'current' (waiting to claim)
            if (i < cycleIndex) status = 'filled';
            else if (i === cycleIndex) status = 'current';
        }

        return { day: dayNum, status };
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl border-2 transform transition-all scale-100 ${isDark
                    ? 'bg-slate-900 border-yellow-500/30'
                    : 'bg-white border-yellow-400'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">

                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Daily Rewards
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                🔥 {localStreak || 0} Days Streak
                            </div>
                        </div>
                    </div>

                    {/* Double Section: Check-in & Free Draw */}
                    <div className="w-full space-y-6">
                        {/* Section 1: Stamp Grid */}
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4 px-2">
                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Check-in สะสมแต้ม</span>
                                <span className="text-xs text-orange-500 font-bold">Day 7 รับ 20 Credits!</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 w-full">
                                {stamps.map((stamp, index) => {
                                    const isRewardDay = index === 6;

                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                aspect-square rounded-xl flex flex-col items-center justify-center relative border-2 transition-all
                                                ${isRewardDay ? 'col-span-2 aspect-auto flex-row gap-2' : ''}
                                                ${stamp.status === 'filled'
                                                    ? (isDark ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-orange-100 border-orange-400 text-orange-600')
                                                    : stamp.status === 'current'
                                                        ? (isDark ? 'bg-slate-800 border-white/50 animate-pulse outline outline-2 outline-orange-500/50' : 'bg-white border-orange-400 border-dashed')
                                                        : (isDark ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400')
                                                }
                                            `}
                                        >
                                            {stamp.status === 'filled' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Flame size={isRewardDay ? 24 : 18} className="fill-current animate-in zoom-in duration-300" />
                                                </div>
                                            )}

                                            {isRewardDay ? (
                                                <>
                                                    <Gift size={20} className={stamp.status === 'filled' ? 'text-orange-500' : ''} />
                                                    <div className="text-[10px] font-bold">20 Credits</div>
                                                </>
                                            ) : (
                                                <span className={`text-[10px] font-bold ${stamp.status === 'filled' ? 'opacity-0' : ''}`}>D{stamp.day}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4">
                                {!localCheckedIn ? (
                                    <button
                                        onClick={handleClaim}
                                        disabled={claiming}
                                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {claiming ? 'กำลังเช็คอิน...' : 'เช็คอินวันนี้'}
                                    </button>
                                ) : (
                                    <div className="w-full py-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/30 text-sm font-bold flex items-center justify-center gap-2">
                                        <CheckCircle size={16} /> เช็คอินเรียบร้อย
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Daily Free Draw Claim */}
                        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="text-purple-400" size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Daily Free Draw</h3>
                                    <p className="text-[10px] text-slate-400">รับสิทธิ์สุ่มไพ่ 1 ใบ ฟรีทุกวัน!</p>
                                </div>
                            </div>

                            {!isFreeClaimedToday ? (
                                <button
                                    onClick={handleClaimFreeDraw}
                                    disabled={claimingFree}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {claimingFree ? 'กำลังรับสิทธิ์...' : 'เก็บสิทธิ์สุ่มฟรีวันนี้'}
                                </button>
                            ) : (
                                <div className="w-full py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/30 text-sm font-bold flex items-center justify-center gap-2">
                                    <CheckCircle size={16} /> เก็บสิทธิ์แล้ว (พร้อมใช้งาน)
                                </div>
                            )}
                        </div>
                    </div>

                    <p className={`text-[10px] opacity-50 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        * สิทธิ์สุ่มฟรีสามารถใช้ได้ภายในวันที่เก็บเท่านั้น
                    </p>

                    <button
                        onClick={onClose}
                        className={`text-sm font-bold underline ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        คุยกันใหม่พรุ่งนี้
                    </button>
                </div>
            </div>
        </div>
    );
};
