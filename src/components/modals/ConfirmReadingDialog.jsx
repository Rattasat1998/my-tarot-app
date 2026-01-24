import React from 'react';
import { Coins, AlertCircle, Sparkles, Gift, X } from 'lucide-react';

export const ConfirmReadingDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    topic,
    readingType,
    creditCost,
    currentCredits,
    isFreeDaily,
    topicLabel,
    isDark
}) => {
    if (!isOpen) return null;

    const hasEnoughCredits = currentCredits >= creditCost || isFreeDaily;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel}></div>

            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {/* Header Glow */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none"></div>

                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 transition-colors z-10"
                >
                    <X size={20} className="text-slate-400" />
                </button>

                {/* Content */}
                <div className="relative p-6 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Sparkles className="text-white" size={36} />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">ยืนยันการทำนาย</h2>

                    <p className="text-slate-400 text-sm mb-6">
                        คุณต้องการเริ่มคำทำนาย<span className="text-purple-400 font-medium">{topicLabel}</span>หรือไม่?
                    </p>

                    {/* Credit Info Box */}
                    <div className={`p-4 rounded-xl mb-6 ${isFreeDaily ? 'bg-green-500/10 border border-green-500/30' : 'bg-purple-500/10 border border-purple-500/30'}`}>
                        {isFreeDaily ? (
                            <div className="flex items-center justify-center gap-3">
                                <Gift className="text-green-400" size={24} />
                                <div className="text-left">
                                    <p className="text-green-400 font-bold">ฟรี! สิทธิ์ดูดวงรายวัน</p>
                                    <p className="text-green-300/70 text-xs">ไม่เสียเครดิต (วันละ 1 ครั้ง)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">ค่าบริการ:</span>
                                    <div className="flex items-center gap-1">
                                        <Coins className="text-yellow-400" size={18} />
                                        <span className="text-yellow-400 font-bold text-lg">{creditCost}</span>
                                        <span className="text-slate-500 text-sm">เครดิต</span>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-700"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">เครดิตคงเหลือ:</span>
                                    <span className={`font-bold ${hasEnoughCredits ? 'text-white' : 'text-red-400'}`}>
                                        {currentCredits}
                                    </span>
                                </div>
                                {!hasEnoughCredits && (
                                    <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                                        <AlertCircle size={14} />
                                        <span>เครดิตไม่เพียงพอ</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reading Type Info */}
                    <div className="text-xs text-slate-500 mb-6">
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">
                            {readingType === '1-card' ? 'ไพ่ 1 ใบ' : 'ไพ่ 2 ใบ'}
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                            ยกเลิก
                        </button>
                        {hasEnoughCredits ? (
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                {isFreeDaily ? 'เริ่มทำนาย (ฟรี!)' : 'ยืนยัน'}
                            </button>
                        ) : (
                            <button
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 rounded-xl bg-yellow-600 text-white font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Coins size={18} />
                                เติมเครดิต
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
