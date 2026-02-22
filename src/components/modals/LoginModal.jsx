import React, { useState } from 'react';
import { X, Phone, Mail, Loader, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginModal = ({ isOpen, onClose }) => {
    const { signInWithGoogle, signInWithPhone, verifyPhoneOTP } = useAuth();

    const [mode, setMode] = useState('select'); // 'select' | 'phone' | 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const resetState = () => {
        setMode('select');
        setPhone('');
        setOtp('');
        setError('');
        setLoading(false);
        setCountdown(0);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    // Format phone to E.164 (+66...)
    const formatPhone = (input) => {
        let cleaned = input.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '66' + cleaned.slice(1);
        }
        if (!cleaned.startsWith('66')) {
            cleaned = '66' + cleaned;
        }
        return '+' + cleaned;
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async () => {
        setError('');

        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 9 || cleaned.length > 10) {
            setError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
            return;
        }

        setLoading(true);
        const formatted = formatPhone(phone);
        const result = await signInWithPhone(formatted);
        setLoading(false);

        if (result.success) {
            setMode('otp');
            startCountdown();
        } else {
            setError(result.error || 'ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่');
        }
    };

    const handleVerifyOTP = async () => {
        setError('');

        if (otp.length !== 6) {
            setError('กรุณากรอกรหัส OTP 6 หลัก');
            return;
        }

        setLoading(true);
        const formatted = formatPhone(phone);
        const result = await verifyPhoneOTP(formatted, otp);
        setLoading(false);

        if (result.success) {
            handleClose();
        } else {
            setError(result.error || 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่');
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;
        setError('');
        setLoading(true);
        const formatted = formatPhone(phone);
        const result = await signInWithPhone(formatted);
        setLoading(false);

        if (result.success) {
            startCountdown();
            setError('');
        } else {
            setError(result.error || 'ส่ง OTP ไม่สำเร็จ');
        }
    };

    const handleGoogleLogin = () => {
        signInWithGoogle();
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        {mode !== 'select' && (
                            <button
                                onClick={() => { setMode('select'); setError(''); }}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="flex-1 text-center text-xl font-serif font-bold text-white">
                            {mode === 'select' && 'เข้าสู่ระบบ'}
                            {mode === 'phone' && 'เข้าสู่ระบบด้วยเบอร์โทร'}
                            {mode === 'otp' && 'ยืนยันรหัส OTP'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {mode === 'select' && (
                        <p className="text-center text-slate-400 text-sm mt-2">
                            เลือกวิธีเข้าสู่ระบบที่สะดวก
                        </p>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* === SELECT MODE === */}
                    {mode === 'select' && (
                        <>
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span>เข้าสู่ระบบด้วย Google</span>
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-700"></div>
                                <span className="text-slate-500 text-xs uppercase tracking-wider">หรือ</span>
                                <div className="flex-1 h-px bg-slate-700"></div>
                            </div>

                            <button
                                onClick={() => setMode('phone')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Phone size={20} />
                                <span>เข้าสู่ระบบด้วยเบอร์โทร</span>
                            </button>
                        </>
                    )}

                    {/* === PHONE INPUT MODE === */}
                    {mode === 'phone' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    เบอร์โทรศัพท์
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm shrink-0">
                                        <span>🇹🇭</span>
                                        <span>+66</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="0812345678"
                                        maxLength={10}
                                        className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading || phone.replace(/\D/g, '').length < 9}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><Loader size={18} className="animate-spin" /> <span>กำลังส่ง OTP...</span></>
                                ) : (
                                    <><Mail size={18} /> <span>ส่งรหัส OTP</span></>
                                )}
                            </button>

                            <p className="text-xs text-slate-500 text-center">
                                ระบบจะส่ง SMS รหัส OTP 6 หลักไปยังเบอร์โทรของคุณ
                            </p>
                        </>
                    )}

                    {/* === OTP VERIFY MODE === */}
                    {mode === 'otp' && (
                        <>
                            <div className="text-center mb-2">
                                <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
                                    <Shield size={28} className="text-purple-400" />
                                </div>
                                <p className="text-slate-300 text-sm">
                                    ส่งรหัส OTP ไปที่ <span className="text-white font-bold">{phone}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    รหัส OTP 6 หลัก
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-3.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                                />
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading || otp.length !== 6}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><Loader size={18} className="animate-spin" /> <span>กำลังตรวจสอบ...</span></>
                                ) : (
                                    <span>ยืนยัน OTP</span>
                                )}
                            </button>

                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-slate-500 text-sm">
                                        ส่ง OTP อีกครั้งใน <span className="text-purple-400 font-bold">{countdown}</span> วินาที
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                    >
                                        ส่งรหัส OTP อีกครั้ง
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                        การเข้าสู่ระบบถือว่าคุณยอมรับ
                        <span className="text-slate-500"> นโยบายความเป็นส่วนตัว </span>
                        และ
                        <span className="text-slate-500"> เงื่อนไขการใช้งาน </span>
                        ของเรา
                    </p>
                </div>
            </div>
        </div>
    );
};
