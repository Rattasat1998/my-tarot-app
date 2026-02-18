import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';

export const PaymentSuccessPage = ({ isDark = true }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(5);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>

                {/* Success Animation Header */}
                <div className="relative p-8 text-center overflow-hidden">
                    {/* Decorative gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-emerald-500/5" />

                    {/* Sparkle decorations */}
                    <div className="absolute top-4 left-8 text-yellow-400/40 animate-pulse">
                        <Sparkles size={16} />
                    </div>
                    <div className="absolute top-12 right-10 text-purple-400/40 animate-pulse delay-300">
                        <Sparkles size={12} />
                    </div>
                    <div className="absolute bottom-6 left-16 text-emerald-400/40 animate-pulse delay-700">
                        <Sparkles size={14} />
                    </div>

                    <div className="relative">
                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-5 animate-bounce">
                            <CheckCircle size={40} />
                        </div>

                        <h1 className={`text-2xl font-bold font-serif mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ชำระเงินสำเร็จ! ✨
                        </h1>

                        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            เครดิตจะถูกเติมให้อัตโนมัติภายในไม่กี่วินาที
                        </p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            ชำระผ่าน PromptPay
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="px-8 pb-4">
                    <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        <p>หากเครดิตยังไม่เข้า กรุณารอสักครู่แล้วรีเฟรชหน้า หรือติดต่อเจ้าหน้าที่</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        กลับหน้าหลัก
                    </button>

                    <p className={`text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        จะกลับหน้าหลักอัตโนมัติใน {countdown} วินาที
                    </p>
                </div>
            </div>
        </div>
    );
};
