import React, { useEffect, useState } from 'react';
import { Flame, Star, CheckCircle, X, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const DailyRewardModal = ({ isOpen, onClose, streak, checked_in_today, isDark }) => {
    const [animate, setAnimate] = useState(false);
    const [claiming, setClaiming] = useState(false);

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
                            Daily Check-in
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                🔥 {localStreak || 0} Days Streak
                            </div>
                        </div>
                        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            สะสมแสตมป์ครบ 7 วัน รับฟรี 20 เครดิต!
                        </p>
                    </div>

                    {/* Stamp Grid */}
                    <div className="grid grid-cols-4 gap-3 w-full">
                        {stamps.map((stamp, index) => {
                            const isRewardDay = index === 6;

                            return (
                                <div
                                    key={index}
                                    className={`
                                        aspect-square rounded-2xl flex flex-col items-center justify-center relative border-2 transition-all
                                        ${isRewardDay ? 'col-span-2 aspect-auto flex-row gap-2' : ''}
                                        ${stamp.status === 'filled'
                                            ? (isDark ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-orange-100 border-orange-400 text-orange-600')
                                            : stamp.status === 'current'
                                                ? (isDark ? 'bg-slate-800 border-white/50 animate-pulse' : 'bg-white border-orange-400 border-dashed')
                                                : (isDark ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400')
                                        }
                                    `}
                                >
                                    {stamp.status === 'filled' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Flame size={isRewardDay ? 32 : 24} className="fill-current animate-in zoom-in duration-300" />
                                        </div>
                                    )}

                                    {isRewardDay ? (
                                        <>
                                            <Gift size={24} className={stamp.status === 'filled' ? 'text-orange-500' : ''} />
                                            <div className="text-sm font-bold">Day 7 <span className="text-xs block opacity-70">20 Credits</span></div>
                                        </>
                                    ) : (
                                        <span className={`text-xs font-bold ${stamp.status === 'filled' ? 'opacity-0' : ''}`}>Day {stamp.day}</span>
                                    )}

                                    {/* Current Indicator */}
                                    {stamp.status === 'current' && !isRewardDay && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Area */}
                    <div className="w-full pt-2">
                        {justClaimedReward && (
                            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-500 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
                                <Gift size={20} /> ยินดีด้วย! คุณได้รับ 20 เครดิต
                            </div>
                        )}

                        {!localCheckedIn ? (
                            <button
                                onClick={handleClaim}
                                disabled={claiming}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {claiming ? 'กำลังเช็คอิน...' : 'เช็คอินวันนี้'}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`w-full py-3.5 rounded-xl font-bold border-2 transition-all ${isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                เช็คอินเรียบร้อยแล้ว
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
