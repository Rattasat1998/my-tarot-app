import React, { useState } from 'react';
import { Crown, Coins, CreditCard, Smartphone, ArrowRight, CheckCircle, X, Loader2 } from 'lucide-react';

export const HybridTopUpModal = ({ isOpen, onClose, isDark, user, onUpgrade, onTopUp, isLoading }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [amount, setAmount] = useState('');

    const topUpOptions = [
        { amount: 50, credits: 50, bonus: 0, popular: false },
        { amount: 100, credits: 100, bonus: 10, popular: true },
        { amount: 200, credits: 200, bonus: 25, popular: false },
        { amount: 500, credits: 500, bonus: 75, popular: false }
    ];

    const handleTopUp = () => {
        if (selectedOption) {
            onTopUp(selectedOption.amount, selectedOption.credits + selectedOption.bonus);
            onClose();
        }
    };

    const handleUpgrade = () => {
        onUpgrade();
        onClose();
    };

    if (!isOpen) return null;

    const isPremium = user?.user_metadata?.is_premium || user?.user_metadata?.subscription_status === 'active';

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div className={`relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl shadow-2xl ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30' : 'bg-white border border-purple-200'} overflow-hidden animate-in zoom-in duration-300 z-[99998]`} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 transition-all z-[100000]"
                    type="button"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative p-6 sm:p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                                {isPremium ? <Crown className="w-8 h-8 text-amber-400" /> : <Coins className="w-8 h-8 text-amber-400" />}
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                                {isPremium ? 'จัดการสมาชิก Premium' : 'เติมเครดิตหรืออัปเกรด Premium'}
                            </h2>
                        </div>
                        <p className="text-slate-300">
                            {isPremium 
                                ? 'จัดการการสมัครสมาชิก Premium ของคุณ' 
                                : 'เลือกเติมเครดิตหรืออัปเกรดเป็น Premium คุ้มค่ากว่า'
                            }
                        </p>
                    </div>

                    {!isPremium && (
                        <>
                            {/* Premium Upgrade Section */}
                            <div className="mb-8">
                                <div className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                                <Crown className="w-5 h-5 text-purple-400" />
                                                Premium Membership
                                            </h3>
                                            <p className="text-purple-300 text-sm">299 บาท/เดือน</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-300">UNLIMITED</div>
                                            <div className="text-xs text-purple-400">การอ่านไพ่</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span>Unlimited Tarot Readings</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span>Premium Meditation 15-30 นาที</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span>Monthly Zodiac Reports</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span>Personal Growth Journal</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isLoading}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        type="button"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                กำลังดำเนินการ...
                                            </>
                                        ) : (
                                            <>
                                                <Crown className="w-5 h-5" />
                                                อัปเกรดเป็น Premium
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-4 text-center">
                                    <div className="flex-1 h-px bg-slate-700"></div>
                                    <span className="text-slate-400 text-sm">หรือ</span>
                                    <div className="flex-1 h-px bg-slate-700"></div>
                                </div>
                            </div>

                            {/* Top Up Section */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 text-center">เติมเครดิต</h3>
                                
                                <div className="space-y-3 mb-6">
                                    {topUpOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedOption(option)}
                                            className={`w-full p-4 rounded-xl border transition-all ${
                                                selectedOption?.amount === option.amount
                                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                            type="button"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">💰</div>
                                                    <div className="text-left">
                                                        <div className="font-bold text-white">
                                                            {option.credits + option.bonus} เครดิต
                                                        </div>
                                                        <div className="text-sm text-slate-400">
                                                            ฿{option.amount}
                                                            {option.bonus > 0 && (
                                                                <span className="text-green-400 ml-2">+{option.bonus} โบนัส</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {option.popular && (
                                                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                                                        POPULAR
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleTopUp}
                                    disabled={!selectedOption}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    type="button"
                                >
                                    <Coins className="w-5 h-5" />
                                    เติมเครดิต ({selectedOption ? `฿${selectedOption.amount}` : 'เลือกแพ็กเกจ'})
                                </button>
                            </div>
                        </>
                    )}

                    {/* Premium User Management */}
                    {isPremium && (
                        <div className="space-y-4">
                            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Crown className="w-6 h-6 text-purple-400" />
                                    <h3 className="text-lg font-bold text-white">สมาชิก Premium</h3>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">สถานะ:</span>
                                        <span className="text-green-400 font-medium">Active</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">ค่าบริการ:</span>
                                        <span className="text-purple-300 font-medium">฿299/เดือน</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">ต่ออนาคต:</span>
                                        <span className="text-purple-300 font-medium">15 มีนาคม 2026</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all text-sm" type="button">
                                        จัดการการสมัคร
                                    </button>
                                    <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm" type="button">
                                        ยกเลิกสมัคร
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-slate-400 text-sm mb-4">
                                    ต้องการเติมเครดิตเพิ่มเติมหรือไม่?
                                </p>
                                <button
                                    onClick={() => setSelectedOption(topUpOptions[1])}
                                    className="px-6 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl hover:bg-amber-500/30 transition-all"
                                    type="button"
                                >
                                    <Coins className="w-4 h-4 inline mr-2" />
                                    เติมเครดิตเพิ่ม
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
