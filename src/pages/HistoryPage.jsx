import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Calendar, FileText, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';
import { READING_TOPICS } from '../constants/readingTopics';
import { ReadingHistoryDetailModal } from '../components/modals/ReadingHistoryDetailModal';

export const HistoryPage = ({ isDark }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [selectedReading, setSelectedReading] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user, navigate]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reading_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setHistory(data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTopicLabel = (topicId) => {
        return READING_TOPICS.find(t => t.id === topicId)?.label || topicId;
    };

    if (!user) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900'} flex flex-col items-center justify-center p-6`}>
                <div className="max-w-md text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border mb-6 shadow-xl`}>
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6 leading-relaxed`}>
                        กรุณาเข้าสู่ระบบเพื่อดูบันทึกการทำนายของคุณ
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                isDark 
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-md'
                            }`}
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900 font-sans'}`}>
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-10'}`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            </div>

            <div className="relative max-w-2xl mx-auto px-4 py-8 sm:py-12">
                <button
                    onClick={() => navigate('/profile')}
                    className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-purple-700'}`}
                >
                    <ArrowLeft size={18} />
                    กลับหน้าโปรไฟล์
                </button>

                <h1 className="text-3xl font-serif font-bold mb-8">บันทึกช่วยจำ (History)</h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="animate-spin text-purple-500" />
                    </div>
                ) : history.length === 0 ? (
                    <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-300'}`}>
                        <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold opacity-70">ยังไม่มีบันทึกการทำนาย</h3>
                        <p className="text-sm opacity-50 mt-1">ลองเปิดไพ่และกด "บันทึก" ดูสิ!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer group ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                                    }`}
                                onClick={() => setSelectedReading(item)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {getTopicLabel(item.topic)}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            • {item.reading_type === 'daily' ? '1 ใบ' : item.reading_type === 'standard' ? '3 ใบ' : item.reading_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs opacity-50">
                                        <Calendar size={12} />
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>

                                {/* Cards Preview */}
                                <div className="flex gap-2 mb-3 overflow-hidden">
                                    {Array.isArray(item.cards) && item.cards.map((card, idx) => (
                                        <div key={idx} className="w-10 h-14 rounded bg-slate-800 bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${card.img})` }}></div>
                                    ))}
                                </div>

                                {/* Note */}
                                {(item.note && item.note.trim() !== "") && (
                                    <div className={`text-sm p-3 rounded-xl italic ${isDark ? 'bg-black/20 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                        <div className="flex items-start gap-2">
                                            <FileText size={14} className="mt-0.5 shrink-0 opacity-50" />
                                            <span className="whitespace-pre-wrap">{item.note}</span>
                                        </div>
                                    </div>
                                )}

                                <div className={`mt-2 flex justify-end text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    คลิกเพื่อดูรายละเอียด &gt;
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ReadingHistoryDetailModal
                isOpen={!!selectedReading}
                onClose={() => setSelectedReading(null)}
                reading={selectedReading}
                isDark={isDark}
            />
        </div>
    );
};
