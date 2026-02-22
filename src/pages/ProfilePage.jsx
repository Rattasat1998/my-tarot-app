import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Phone, Save, ArrowLeft, Loader, CheckCircle, Camera, Calendar, CreditCard } from 'lucide-react';
import { compressImage } from '../utils/imageCompression';
import { MysticalIdCard } from '../components/MysticalIdCard';
import { getZodiacFromDate } from '../utils/zodiacUtils';

export const ProfilePage = ({ isDark }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        avatar_url: '',
        credits: 0,
        streak_count: 0,
        birthdate: ''
    });
    const [showMysticalCard, setShowMysticalCard] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, phone, avatar_url, credits, streak_count, birthdate')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || '',
                    credits: data.credits || 0,
                    streak_count: data.streak_count || 0,
                    birthdate: data.birthdate || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        setMessage(null);

        try {
            // Compress Image
            console.log('Original size:', file.size / 1024, 'KB');
            const compressedFile = await compressImage(file, 0.4); // Max 400KB
            console.log('Compressed size:', compressedFile.size / 1024, 'KB');

            // Upload to Supabase
            const fileExt = 'jpg'; // We convert to jpeg in compression
            const fileName = `${user.id}/avatar.${fileExt}`;

            // Upload (Upsert)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, compressedFile, { upsert: true });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Add timestamp query param to force refresh cache
            const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

            // Update Profile State
            setFormData(prev => ({ ...prev, avatar_url: publicUrlWithTimestamp }));

            // Save immediately to DB (store clean URL without timestamp)
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'อัปเดตรูปโปรไฟล์สำเร็จ' });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปโหลดรูป: ' + error.message });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    birthdate: formData.birthdate || null
                })
                .eq('id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900 font-sans'}`}>
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-10'}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            </div>

            <div className="relative max-w-2xl mx-auto px-4 py-8 sm:py-12">
                <button
                    onClick={() => navigate('/')}
                    className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-purple-700'}`}
                >
                    <ArrowLeft size={18} />
                    กลับหน้าหลัก
                </button>

                <div className={`rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white'}`}>
                    <div className="text-center mb-8">
                        <div className="relative inline-block group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-slate-800 shadow-xl overflow-hidden relative">
                                {uploadingAvatar ? (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                        <Loader className="animate-spin text-white" />
                                    </div>
                                ) : null}

                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="User" className="w-full h-full object-cover" />
                                ) : user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">{user?.email?.[0].toUpperCase() || <User size={48} />}</span>
                                )}

                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <div className={`absolute bottom-0 right-0 p-2 rounded-full border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-lg`}>
                                <Camera size={16} className={isDark ? 'text-white' : 'text-slate-600'} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <h1 className="text-2xl font-bold font-serif mt-4">{user?.name}</h1>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>จัดการข้อมูลส่วนตัว</p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                            }`}>
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                                <span className="text-xl">🔥</span>
                            </div>
                            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {formData.streak_count} <span className="text-xs font-normal opacity-70">วัน</span>
                            </div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                ต่อเนื่อง
                            </div>
                        </div>
                        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                            }`}>
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                                <span className="text-xl">🪙</span>
                            </div>
                            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {formData.credits} <span className="text-xs font-normal opacity-70">แต้ม</span>
                            </div>
                            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                เครดิตคงเหลือ
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/history')}
                        className={`w-full mb-8 py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all group ${isDark ? 'border-slate-700 hover:border-purple-500 hover:bg-purple-900/10 text-slate-300 hover:text-purple-300'
                            : 'border-slate-300 hover:border-purple-500 hover:bg-purple-50 text-slate-600 hover:text-purple-700'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /></svg>
                        ดูบันทึกคำทำนายย้อนหลัง (History)
                    </button>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="animate-spin text-purple-500" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        ชื่อ
                                    </label>
                                    <div className="relative">
                                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="ชื่อจริง"
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${isDark
                                                ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        นามสกุล
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="นามสกุล"
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${isDark
                                            ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    เบอร์โทรศัพท์
                                </label>
                                <div className="relative">
                                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="08x-xxx-xxxx"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${isDark
                                            ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Birthdate Field */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    วันเกิด (สำหรับคำนวณราศี)
                                </label>
                                <div className="relative">
                                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${isDark
                                            ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                            }`}
                                    />
                                </div>
                                {/* Show zodiac if birthdate is set */}
                                {formData.birthdate && (() => {
                                    const zodiac = getZodiacFromDate(formData.birthdate);
                                    return zodiac ? (
                                        <div className={`flex items-center gap-2 text-sm mt-2 p-3 rounded-xl ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                            <span className="text-2xl">{zodiac.symbol}</span>
                                            <span className="font-medium">{zodiac.name}</span>
                                            <span className="opacity-60">• ธาตุ{zodiac.element} {zodiac.elementEmoji}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </div>

                            {/* Mystical Card Button */}
                            <button
                                type="button"
                                onClick={() => setShowMysticalCard(true)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} />
                                🪬 ดูบัตรสายมู
                            </button>

                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-2 text-sm ${message.type === 'success'
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle size={16} /> : null}
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader className="animate-spin w-5 h-5" /> : <Save size={20} />}
                                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </form>
                    )}

                </div>
            </div>

            {/* Mystical ID Card Modal */}
            {showMysticalCard && (
                <MysticalIdCard
                    user={user}
                    profile={formData}
                    onClose={() => setShowMysticalCard(false)}
                    isDark={isDark}
                />
            )}
        </div>
    );
};
