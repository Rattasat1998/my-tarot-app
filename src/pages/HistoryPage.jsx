import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Calendar, FileText, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { READING_TOPICS } from '../constants/readingTopics';
import { ReadingHistoryDetailModal } from '../components/modals/ReadingHistoryDetailModal';

export const HistoryPage = ({ isDark }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [selectedReading, setSelectedReading] = useState(null);

    useEffect(() => {
        if (user) {
            fetchHistory();
        } else {
            navigate('/');
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
