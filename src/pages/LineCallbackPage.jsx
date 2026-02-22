import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';

export const LineCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type');

            if (!tokenHash || type !== 'magiclink') {
                setError('ลิงก์ไม่ถูกต้อง');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: 'magiclink',
                });

                if (verifyError) {
                    console.error('LINE verify error:', verifyError);
                    setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                // Success — redirect to home
                navigate('/');
            } catch (err) {
                console.error('LINE callback error:', err);
                setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
                setTimeout(() => navigate('/'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                {error ? (
                    <>
                        <p className="text-red-400 text-lg font-bold mb-2">{error}</p>
                        <p className="text-slate-500 text-sm">กำลังกลับหน้าหลัก...</p>
                    </>
                ) : (
                    <>
                        <Loader size={40} className="text-green-400 animate-spin mx-auto mb-4" />
                        <p className="text-white text-lg font-bold">กำลังเข้าสู่ระบบด้วย LINE...</p>
                        <p className="text-slate-400 text-sm mt-2">กรุณารอสักครู่</p>
                    </>
                )}
            </div>
        </div>
    );
};
