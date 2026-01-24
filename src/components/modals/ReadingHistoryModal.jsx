import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, ChevronRight, LayoutGrid, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TAROT_CARDS as CARDS } from '../../data/tarotCards';

const TOPIC_LABELS = {
    daily: 'ดวงรายวัน',
    monthly: 'ดวงรายเดือน',
    love: 'ความรัก',
    work: 'การงาน',
    finance: 'การเงิน',
    health: 'สุขภาพ',
    social: 'สังคม/ครอบครัว',
    fortune: 'เสี่ยงโชค'
};

export function ReadingHistoryModal({ isOpen, onClose, isDark }) {
    const { user } = useAuth();
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReading, setSelectedReading] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
            setSelectedReading(null);
            setSelectedCard(null);
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reading_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReadings(data || []);
        } catch (err) {
            console.error('Error fetching reading history:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCardDetails = (readingCards) => {
        if (!readingCards) return [];
        return readingCards.map(c => {
            const cardData = CARDS.find(ref => ref.id === c.id) || c;
            return { ...cardData, ...c };
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className={`relative w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'} animate-in zoom-in-95 duration-200`}>

                    {/* Header */}
                    <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-purple-50 border-purple-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                <BookOpen size={20} />
                            </div>
                            <h2 className={`text-xl font-bold font-serif ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ประวัติการทำนาย
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-purple-100 text-slate-500'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                        {/* List View */}
                        <div className={`flex-1 overflow-y-auto p-4 border-r ${selectedReading ? 'hidden md:block' : 'block'} ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            {loading ? (
                                <div className="text-center py-10 text-slate-500">กำลังโหลด...</div>
                            ) : readings.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <BookOpen size={32} />
                                    </div>
                                    <p className="text-slate-500">ยังไม่มีประวัติการทำนาย</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {readings.map((reading) => (
                                        <button
                                            key={reading.id}
                                            onClick={() => setSelectedReading(reading)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all hover:translate-x-1 ${selectedReading?.id === reading.id
                                                ? isDark ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-200'
                                                : isDark ? 'bg-slate-800/30 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                                    {TOPIC_LABELS[reading.topic] || reading.topic}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(reading.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    รูปแบบ: {reading.reading_type}
                                                </div>
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail View */}
                        <div className={`flex-[1.5] overflow-y-auto p-6 ${!selectedReading ? 'hidden md:flex md:items-center md:justify-center' : 'block'} ${isDark ? 'bg-slate-900' : 'bg-slate-50/50'}`}>
                            {!selectedReading ? (
                                <div className="text-center text-slate-500">
                                    <LayoutGrid size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>เลือกรายการเพื่อดูรายละเอียด</p>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <button
                                        onClick={() => setSelectedReading(null)}
                                        className="md:hidden mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-700"
                                    >
                                        <ChevronRight className="rotate-180" size={16} />
                                        ย้อนกลับ
                                    </button>

                                    <div className="mb-6">
                                        <h3 className={`text-2xl font-bold font-serif mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {TOPIC_LABELS[selectedReading.topic] || selectedReading.topic}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(selectedReading.created_at)}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-500" />
                                            <span>{selectedReading.reading_type}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {getCardDetails(selectedReading.cards).map((card, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            >
                                                <div
                                                    className="aspect-[2/3] rounded-lg bg-slate-200 mb-3 overflow-hidden relative group cursor-pointer"
                                                    onClick={() => setSelectedCard(card)}
                                                >
                                                    <img
                                                        src={card.img || card.image}
                                                        alt={card.name}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/400x600?text=Card+Image';
                                                        }}
                                                    />
                                                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs font-bold backdrop-blur-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                        <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                                        {card.name}
                                                    </h4>
                                                    <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {card.nameThai || card.name_th}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Detail Popup */}
            {selectedCard && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setSelectedCard(null)}
                >
                    <div
                        className={`relative w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'} animate-in zoom-in-95 duration-200`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedCard(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 aspect-[2/3] md:aspect-auto">
                                <img
                                    src={selectedCard.img || selectedCard.image}
                                    alt={selectedCard.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto max-h-[50vh] md:max-h-[70vh]">
                                <h3 className={`text-2xl font-bold font-serif mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {selectedCard.name}
                                </h3>
                                <p className={`text-sm uppercase tracking-wider mb-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {selectedCard.nameThai || selectedCard.name_th}
                                </p>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {selectedCard.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
