import React, { useState, useRef } from 'react';
import { X, CreditCard, Coins, Upload, ArrowLeft, CheckCircle, QrCode, Building2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const PACKAGES = [
    { id: 'starter', credits: 5, price: 29, label: 'Starter', popular: false },
    { id: 'popular', credits: 15, price: 79, label: 'Standard', popular: true },
    { id: 'pro', credits: 30, price: 149, label: 'Pro', popular: false },
];

const BANK_DETAILS = {
    bank: 'ธนาคารกสิกรไทย (KBANK)',
    account: '142-3-88196-4',
    name: 'รัฐศาสตร์ ภาพสิงห์',
};

export const TopUpModal = ({ isOpen, onClose, isDark }) => {
    const { user } = useAuth();
    const [step, setStep] = useState('select'); // select, method, payment, success
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [stripeLoading, setStripeLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleSelectPackage = (pkg) => {
        setSelectedPkg(pkg);
        setStep('method');
        setPreviewUrl(null);
        setFileToUpload(null);
        // Go directly to PromptPay checkout
        setTimeout(() => {
            handleStripeCheckoutWithPkg(pkg);
        }, 100);
    };

    const handleSelectMethod = (method) => {
        handleStripeCheckout();
    };

    const handleStripeCheckoutWithPkg = async (pkg) => {
        if (!pkg || !user) return;

        setStripeLoading(true);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('กรุณาเข้าสู่ระบบก่อนทำรายการ');
            }

            const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    packageId: pkg.id,
                    userId: user.id,
                    userEmail: user.email,
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setStripeLoading(false);
        }
    };


    const handleStripeCheckout = async () => {
        handleStripeCheckoutWithPkg(selectedPkg);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileToUpload(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleConfirmPayment = async () => {
        if (!fileToUpload || !selectedPkg || !user) return;

        setUploading(true);
        try {
            // 1. Upload Slip
            const fileExt = fileToUpload.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('slips')
                .upload(fileName, fileToUpload);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('slips')
                .getPublicUrl(fileName);

            // 3. Submit Transaction
            const { error: rpcError } = await supabase.rpc('submit_topup', {
                amount_paid: selectedPkg.price,
                credit_amount: selectedPkg.credits,
                slip_path: publicUrl
            });

            if (rpcError) throw rpcError;

            setStep('success');
        } catch (error) {
            console.error('Error uploading slip:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const resetModal = () => {
        setStep('select');
        setSelectedPkg(null);
        setPreviewUrl(null);
        setFileToUpload(null);
        setStripeLoading(false);
        onClose();
    };

    const getHeaderTitle = () => {
        switch (step) {
            case 'select': return 'เติมเครดิต';
            case 'method': return 'เลือกวิธีชำระ';
            case 'payment': return 'แจ้งชำระเงิน';
            case 'success': return 'สำเร็จ';
            default: return 'เติมเครดิต';
        }
    };

    const handleBack = () => {
        if (step === 'method') setStep('select');
        else if (step === 'payment') setStep('method');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
                } animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}>

                {/* Header */}
                <div className={`p-6 text-center relative ${isDark ? 'bg-slate-800/50' : 'bg-purple-50'}`}>
                    {(step === 'method' || step === 'payment') && (
                        <button
                            onClick={handleBack}
                            className={`absolute top-6 left-6 p-1 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className={`text-2xl font-bold font-serif ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {getHeaderTitle()}
                    </h2>
                    <button
                        onClick={resetModal}
                        className={`absolute top-6 right-6 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Select Package */}
                    {step === 'select' && (
                        <div className="space-y-4">
                            {PACKAGES.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => handleSelectPackage(pkg)}
                                    className={`w-full group relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between
                                        ${pkg.popular
                                            ? 'border-purple-500 bg-purple-500/5 hover:bg-purple-500/10'
                                            : isDark
                                                ? 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50 hover:bg-slate-800'
                                                : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50'
                                        }`}
                                >
                                    {pkg.popular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                            ยอดนิยม
                                        </span>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pkg.popular ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            <Coins size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {pkg.credits} เครดิต
                                            </div>
                                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {pkg.label}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg font-bold text-purple-600">
                                            ฿{pkg.price}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Select Payment Method */}
                    {step === 'method' && selectedPkg && (
                        <div className="space-y-5">
                            {/* Package Summary */}
                            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>แพ็คเกจที่เลือก</p>
                                <p className="text-2xl font-bold text-purple-600 my-1">{selectedPkg.credits} เครดิต</p>
                                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>฿{selectedPkg.price}</p>
                            </div>

                            {/* PromptPay Checkout */}
                            <button
                                onClick={() => handleSelectMethod('promptpay')}
                                disabled={stripeLoading}
                                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 
                                    ${isDark
                                        ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-400'
                                        : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                    {stripeLoading ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <QrCode size={24} />
                                    )}
                                </div>
                                <div className="text-left flex-1">
                                    <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        PromptPay (QR Code)
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {stripeLoading ? 'กำลังสร้างลิงก์ชำระเงิน...' : 'สแกน QR จ่ายผ่านแอปธนาคาร • เครดิตเข้าอัตโนมัติ'}
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Step 3: Bank Transfer Payment (existing flow) */}
                    {step === 'payment' && selectedPkg && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ยอดชำระ</p>
                                <p className="text-3xl font-bold text-purple-600 my-2">฿{selectedPkg.price}</p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>สำหรับ {selectedPkg.credits} เครดิต</p>
                            </div>

                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>โอนเงินมาที่บัญชี</p>
                                <div className={`p-4 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white'}`}>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{BANK_DETAILS.bank}</p>
                                    <p className="text-xl font-mono tracking-wider my-1 text-purple-600">{BANK_DETAILS.account}</p>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{BANK_DETAILS.name}</p>
                                </div>
                            </div>

                            {/* Slip Upload & Preview Section */}
                            <div className="pt-2 space-y-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />

                                {!previewUrl ? (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-purple-600"
                                    >
                                        <Upload size={24} />
                                        <span>แนบสลิปโอนเงิน</span>
                                    </button>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in zoom-in-95">
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[3/4] max-h-[300px] mx-auto">
                                            <img
                                                src={previewUrl}
                                                alt="Slip Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className={`flex-1 py-3 rounded-xl border border-slate-300 font-medium ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'} transition-all`}
                                            >
                                                เปลี่ยนรูป
                                            </button>
                                            <button
                                                onClick={handleConfirmPayment}
                                                disabled={uploading}
                                                className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploading ? 'กำลังส่ง...' : 'ยืนยันการโอน'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>แจ้งชำระเงินสำเร็จ</h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                ระบบได้รับข้อมูลแล้ว เจ้าหน้าที่จะตรวจสอบและเติมเครดิตให้โดยเร็วที่สุด
                            </p>
                            <button
                                onClick={resetModal}
                                className="px-8 py-2 rounded-full bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition-all"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
