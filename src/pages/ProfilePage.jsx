import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Phone, Save, ArrowLeft, Loader, CheckCircle, Camera, Calendar, CreditCard, Crown, Star, TrendingUp, BookOpen, Heart } from 'lucide-react';
import { compressImage } from '../utils/imageCompression';
import { MysticalIdCard } from '../components/MysticalIdCard';
import { getZodiacFromDate } from '../utils/zodiacUtils';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';

export const ProfilePage = ({ isDark }) => {
    const { user } = useAuth();
    const { isPremium } = usePremium();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('profile');

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
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', text: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้' });
                return;
            }

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
            } else {
                // Create profile if it doesn't exist
                const newProfile = {
                    user_id: user.id,
                    first_name: user.user_metadata?.first_name || '',
                    last_name: user.user_metadata?.last_name || '',
                    phone: '',
                    avatar_url: user.user_metadata?.avatar_url || '',
                    credits: 5, // Starting credits
                    streak_count: 0,
                    birthdate: ''
                };

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([newProfile]);

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    setMessage({ type: 'error', text: 'ไม่สามารถสร้างโปรไฟล์ได้' });
                } else {
                    setFormData(newProfile);
                }
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาด' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert([{
                    user_id: user.id,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url,
                    birthdate: formData.birthdate
                }]);

            if (error) {
                console.error('Error updating profile:', error);
                setMessage({ type: 'error', text: 'ไม่สามารถอัปเดตข้อมูลได้' });
            } else {
                setMessage({ type: 'success', text: 'อัปเดตข้อมูลสำเร็จแล้ว' });
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาด' });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        setMessage(null);

        try {
            // Compress image
            const compressedFile = await compressImage(file, 800, 800, 0.8);

            // Upload to Supabase Storage
            const fileName = `avatars/${user.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, compressedFile);

            if (uploadError) {
                console.error('Error uploading avatar:', uploadError);
                setMessage({ type: 'error', text: 'ไม่สามารถอัปโหลดรูปภาพได้' });
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update profile with new avatar URL
            setFormData(prev => ({
                ...prev,
                avatar_url: publicUrl
            }));

            // Update database
            await supabase
                .from('profiles')
                .upsert([{
                    user_id: user.id,
                    avatar_url: publicUrl
                }]);

            setMessage({ type: 'success', text: 'อัปโหลดรูปภาพสำเร็จแล้ว' });
        } catch (error) {
            console.error('Error in handleAvatarUpload:', error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 overflow-hidden">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl text-purple-400">
                                    {user?.email?.[0].toUpperCase() || <User size={48} />}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploadingAvatar ? <Loader className="animate-spin w-4 h-4" /> : <Camera size={16} />}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {formData.first_name || formData.last_name 
                            ? `${formData.first_name} ${formData.last_name}`.trim()
                            : user?.user_metadata?.name || 'ผู้ใช้'
                        }
                    </h2>
                    <p className="text-slate-400">{user?.email}</p>
                    {isPremium && (
                        <div className="flex items-center gap-2 mt-2">
                            <Crown className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">สมาชิก Premium</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Form */}
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
                                placeholder="เบอร์โทรศัพท์"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${isDark
                                    ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            วันเกิด
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
                    </div>

                    {/* Stats Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 text-amber-400" />
                                <span className="text-sm text-slate-400">เครดิต</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{formData.credits}</div>
                        </div>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-slate-400">สตรีค</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{formData.streak_count} วัน</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowMysticalCard(true)}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-300 font-bold hover:from-purple-600/30 hover:to-indigo-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            <CreditCard size={20} />
                            🪬 ดูบัตรสายมู
                        </button>
                    </div>

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
    );

    const renderPremiumTab = () => (
        <div className="space-y-6">
            {isPremium ? (
                <div className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-8 h-8 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">สมาชิก Premium</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">สถานะ</span>
                            <span className="text-green-400 font-bold">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">ค่าบริการ</span>
                            <span className="text-purple-300 font-bold">฿299/เดือน</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">ต่ออนาคต</span>
                            <span className="text-purple-300 font-bold">15 มีนาคม 2026</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-300">สิทธิประโยชน์</span>
                            <span className="text-purple-300 font-bold">ทั้งหมด</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all">
                            จัดการการสมัคร
                        </button>
                        <button className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all">
                            ยกเลิกสมัคร
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-6">
                        <Crown className="w-8 h-8 text-purple-400" />
                        <span className="text-purple-300 font-bold text-lg">อัปเกรดเป็น Premium</span>
                    </div>
                    <p className="text-slate-300 mb-8">
                        เข้าถึงฟีเจอร์พิเศษทั้งหมดและปลดล็อกศักยภาพของคุณ
                    </p>
                    <button
                        onClick={() => navigate('/membership')}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2 mx-auto"
                    >
                        <Crown className="w-5 h-5" />
                        อัปเกรดเป็น Premium
                    </button>
                </div>
            )}
        </div>
    );

    const renderStatsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-purple-500/20">
                            <Star className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{formData.credits}</div>
                            <div className="text-sm text-slate-400">เครดิตคงเหลือ</div>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-green-500/20">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{formData.streak_count}</div>
                            <div className="text-sm text-slate-400">วันติดต่อ</div>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-blue-500/20">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">127</div>
                            <div className="text-sm text-slate-400">ครั้งที่อ่านไพ่</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                <h3 className="text-lg font-bold text-white mb-4">กิจกรรมล่าสุด</h3>
                <div className="space-y-3">
                    {['อ่านไพ่ The Fool', 'เขียนบันทึกประจำวัน', 'ทำสมาธิ 15 นาที', 'อ่านรายงานราศี'].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">{activity}</span>
                            <span className="text-xs text-slate-500">{index + 1} วันที่แล้ว</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderJournalTab = () => (
        <PremiumGate feature="personalGrowthJournal" fallback={
            <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-4">
                    <Crown className="w-8 h-8 text-purple-400" />
                    <span className="text-purple-300 font-bold">Premium Feature</span>
                </div>
                <p className="text-slate-300 mb-4">บันทึกการเดินทางสู่การพัฒนาตนเอง</p>
                <button
                    onClick={() => navigate('/membership')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
                >
                    อัปเกรดเป็น Premium
                </button>
            </div>
        }>
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">บันทึกของฉัน</h3>
                    <button
                        onClick={() => navigate('/journal')}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                    >
                        เขียนบันทึกใหม่
                    </button>
                </div>

                {/* Recent Journal Entries */}
                <div className="space-y-4">
                    {[
                        {
                            title: 'การสำนึกถึงความสำเร็จ',
                            date: '2024-01-20',
                            mood: 'grateful',
                            preview: 'วันนี้ผมสำเร็จในการทำสมาธิครบ 15 นาที...'
                        },
                        {
                            title: 'บทเรียนจากไพ่ The Hermit',
                            date: '2024-01-19',
                            mood: 'thoughtful',
                            preview: 'ไพ่ The Hermit สอนให้ผมรู้จักการอยู่คนเดียว...'
                        }
                    ].map((entry, index) => (
                        <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{entry.title}</h4>
                                <span className="text-xs text-slate-400">{entry.date}</span>
                            </div>
                            <p className="text-slate-300 text-sm line-clamp-2">{entry.preview}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs">
                                    {entry.mood}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PremiumGate>
    );

    const renderFavoritesTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">รายการโปรด</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Favorite Cards */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        ไพ่โปรด
                    </h4>
                    <div className="space-y-3">
                        {['The Fool', 'The Magician', 'The High Priestess'].map((card, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-2xl">🎴</span>
                                <span className="text-slate-300">{card}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Favorite Articles */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        บทความโปรด
                    </h4>
                    <div className="space-y-3">
                        {['วิธีอ่านไพ่ฐานธมม์', 'ความหมายเลขศาสตร์', 'สมาธิสำหรับมือใหม่'].map((article, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-2xl">📰</span>
                                <span className="text-slate-300">{article}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900 font-sans'}`}>
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-10'}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            </div>

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            <ArrowLeft size={20} />
                            กลับ
                        </button>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            โปรไฟล์ของฉัน
                        </h1>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 border-b border-slate-800">
                        {[
                            { id: 'profile', name: 'ข้อมูลส่วนตัว', icon: <User size={18} /> },
                            { id: 'premium', name: 'Premium', icon: <Crown size={18} /> },
                            { id: 'stats', name: 'สถิติ', icon: <TrendingUp size={18} /> },
                            { id: 'journal', name: 'บันทึก', icon: <BookOpen size={18} /> },
                            { id: 'favorites', name: 'รายการโปรด', icon: <Heart size={18} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all border-b-2 ${
                                    activeTab === tab.id
                                        ? 'text-purple-300 border-purple-400 bg-purple-500/10'
                                        : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
                                }`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'profile' && renderProfileTab()}
                        {activeTab === 'premium' && renderPremiumTab()}
                        {activeTab === 'stats' && renderStatsTab()}
                        {activeTab === 'journal' && renderJournalTab()}
                        {activeTab === 'favorites' && renderFavoritesTab()}
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
        </div>
    );
};
