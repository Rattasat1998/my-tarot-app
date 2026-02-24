import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Save, Play, Square, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_SETTINGS = {
    id: 1,
    base_price_baht: 299,
    discount_amount_baht: 0,
    discount_duration_days: 7,
    is_discount_active: false,
    discount_starts_at: null,
    discount_ends_at: null,
};

export const ManageMembershipDiscount = ({ isDark }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const effectivePrice = useMemo(() => {
        const base = Number(settings.base_price_baht) || 0;
        const discount = Number(settings.discount_amount_baht) || 0;
        return Math.max(base - discount, 0);
    }, [settings.base_price_baht, settings.discount_amount_baht]);

    const isCurrentlyActive = useMemo(() => {
        if (!settings.is_discount_active || !settings.discount_ends_at) return false;
        return new Date(settings.discount_ends_at).getTime() > Date.now();
    }, [settings.is_discount_active, settings.discount_ends_at]);

    const loadSettings = async () => {
        try {
            setMessage(null);
            const { data, error } = await supabase
                .from('membership_discount_settings')
                .select('*')
                .eq('id', 1)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                const { error: insertError } = await supabase
                    .from('membership_discount_settings')
                    .insert(DEFAULT_SETTINGS);
                if (insertError) throw insertError;
                setSettings(DEFAULT_SETTINGS);
            } else {
                setSettings(data);
            }
        } catch (err) {
            console.error('Error loading membership discount settings:', err);
            setMessage({ type: 'error', text: `โหลดข้อมูลไม่สำเร็จ: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const validateValues = () => {
        const base = Number(settings.base_price_baht);
        const discount = Number(settings.discount_amount_baht);
        const days = Number(settings.discount_duration_days);

        if (!Number.isFinite(base) || base <= 0) {
            throw new Error('ราคาเต็มต้องมากกว่า 0');
        }
        if (!Number.isFinite(discount) || discount < 0) {
            throw new Error('จำนวนเงินที่ลดต้องเป็น 0 หรือมากกว่า');
        }
        if (discount >= base) {
            throw new Error('จำนวนเงินที่ลดต้องน้อยกว่าราคาเต็ม');
        }
        if (!Number.isFinite(days) || days <= 0) {
            throw new Error('จำนวนวันต้องมากกว่า 0');
        }
    };

    const persistSettings = async (payload, successText, options = {}) => {
        const { skipValidation = false } = options;
        setSaving(true);
        try {
            if (!skipValidation) {
                validateValues();
            }
            const { data, error } = await supabase
                .from('membership_discount_settings')
                .upsert({
                    id: 1,
                    base_price_baht: Number(settings.base_price_baht),
                    discount_amount_baht: Number(settings.discount_amount_baht),
                    discount_duration_days: Number(settings.discount_duration_days),
                    updated_by: user?.id || null,
                    ...payload,
                })
                .select('*')
                .single();

            if (error) throw error;
            setSettings(data);
            setMessage({ type: 'success', text: successText });
        } catch (err) {
            console.error('Error saving membership discount settings:', err);
            setMessage({ type: 'error', text: `บันทึกไม่สำเร็จ: ${err.message}` });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        await persistSettings(
            {
                is_discount_active: false,
                discount_starts_at: null,
                discount_ends_at: null,
            },
            'บันทึกค่าเรียบร้อย (ยังไม่เริ่มโปรโมชัน)'
        );
    };

    const handleStartPromotion = async () => {
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + Number(settings.discount_duration_days) * 24 * 60 * 60 * 1000);

        await persistSettings(
            {
                is_discount_active: true,
                discount_starts_at: startsAt.toISOString(),
                discount_ends_at: endsAt.toISOString(),
            },
            'เริ่มโปรโมชันเรียบร้อย'
        );
    };

    const handleStopPromotion = async () => {
        await persistSettings(
            {
                is_discount_active: false,
                discount_starts_at: null,
                discount_ends_at: null,
            },
            'ปิดโปรโมชันเรียบร้อย',
            { skipValidation: true }
        );
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className={`p-4 sm:p-6 overflow-y-auto h-full ${isDark ? '' : 'bg-purple-50'}`}>
            <div className="max-w-3xl space-y-6">
                <div>
                    <h2 className={`text-xl font-bold font-serif ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        จัดการโปร Membership
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        ตั้งจำนวนเงินที่ลดและจำนวนวันโปรโมชัน
                    </p>
                </div>

                {message && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm ${
                            message.type === 'success'
                                ? isDark
                                    ? 'bg-emerald-900/20 border-emerald-700 text-emerald-300'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : isDark
                                    ? 'bg-red-900/20 border-red-700 text-red-300'
                                    : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className={`rounded-2xl border p-5 sm:p-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ราคาเต็ม (บาท)</label>
                            <input
                                type="number"
                                min="1"
                                value={settings.base_price_baht}
                                onChange={(e) => setSettings((prev) => ({ ...prev, base_price_baht: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>จำนวนเงินที่ลด (บาท)</label>
                            <input
                                type="number"
                                min="0"
                                value={settings.discount_amount_baht}
                                onChange={(e) => setSettings((prev) => ({ ...prev, discount_amount_baht: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>จำนวนวันโปร</label>
                            <input
                                type="number"
                                min="1"
                                value={settings.discount_duration_days}
                                onChange={(e) => setSettings((prev) => ({ ...prev, discount_duration_days: e.target.value }))}
                                className={`w-full rounded-lg px-3 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                            />
                        </div>
                    </div>

                    <div className={`mt-5 rounded-xl border p-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-purple-50 border-purple-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag size={16} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                            <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>ตัวอย่างราคาที่ลูกค้าจะเห็น</span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            ราคาเต็ม {Number(settings.base_price_baht || 0).toLocaleString()} บาท
                            {' '}→{' '}
                            ราคาหลังลด {effectivePrice.toLocaleString()} บาท/เดือน
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={handleSaveDraft}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            บันทึกค่า (ยังไม่เริ่ม)
                        </button>

                        <button
                            onClick={handleStartPromotion}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            เริ่มโปรโมชัน
                        </button>

                        <button
                            onClick={handleStopPromotion}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                            หยุดโปรโมชัน
                        </button>
                    </div>
                </div>

                <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>สถานะปัจจุบัน</h3>
                    <div className="mt-3 text-sm space-y-1">
                        <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            สถานะ: {isCurrentlyActive ? 'กำลังมีโปรโมชัน' : 'ไม่มีโปรโมชัน'}
                        </p>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            เริ่ม: {settings.discount_starts_at ? new Date(settings.discount_starts_at).toLocaleString('th-TH') : '-'}
                        </p>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            สิ้นสุด: {settings.discount_ends_at ? new Date(settings.discount_ends_at).toLocaleString('th-TH') : '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
