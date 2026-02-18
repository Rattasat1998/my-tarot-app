import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export const PaymentCancelPage = ({ isDark = true }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

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

                <div className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto mb-5">
                        <XCircle size={40} />
                    </div>

                    <h1 className={`text-2xl font-bold font-serif mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ยกเลิกการชำระเงิน
                    </h1>

                    <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ไม่มีการเรียกเก็บเงินใดๆ คุณสามารถลองใหม่ได้ทุกเมื่อ
                    </p>
                </div>

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
