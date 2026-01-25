import React from 'react';
import { X, Calendar, Sparkles, FileText, Quote } from 'lucide-react';
import { HolographicCard } from '../ui/HolographicCard';
import { READING_TOPICS } from '../../constants/readingTopics';

export const ReadingHistoryDetailModal = ({ isOpen, onClose, reading, isDark }) => {
    if (!isOpen || !reading) return null;

    const { topic, reading_type: readingType, cards, note, created_at } = reading;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl shadow-2xl border ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'
                    }`}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-50 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 text-sm opacity-60 mb-2">
                        <Calendar size={14} />
                        {formatDate(created_at)}
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">
                        {getTopicLabel(topic)}
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        แบบ {readingType === 'daily' || readingType === '1-card' ? '1 ใบ' : '3 ใบ'}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className={`grid grid-cols-1 ${cards.length === 1 ? 'place-items-center' : 'sm:grid-cols-3'} gap-8 mb-12`}>
                    {cards.map((card, idx) => {
                        let label = '';
                        let badgeClass = '';

                        if (cards.length === 1) {
                            label = 'บทสรุป';
                            badgeClass = 'border-purple-500/30 bg-purple-500/10 text-purple-300';
                        } else {
                            // 3 cards logic
                            label = idx === 0 ? 'อดีต / พื้นฐาน' : idx === 1 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / บทสรุป';
                            badgeClass = idx === 0 ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' :
                                idx === 1 ? 'border-green-500/30 bg-green-500/10 text-green-300' :
                                    'border-purple-500/30 bg-purple-500/10 text-purple-300';
                        }

                        return (
                            <div key={idx} className={`flex flex-col items-center gap-4 ${cards.length === 1 ? 'max-w-xs w-full' : ''}`}>
                                <div className="text-center">
                                    <span className={`px-3 py-1 border text-[10px] uppercase tracking-widest rounded-full ${badgeClass}`}>
                                        {label}
                                    </span>
                                </div>
                                <HolographicCard className="relative w-full aspect-[2/3] shadow-xl">
                                    <div className="absolute inset-0 bg-slate-950 overflow-hidden rounded-xl">
                                        <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
                                    </div>
                                </HolographicCard>
                                <div className="text-center">
                                    <h4 className="font-bold text-yellow-500">{card.name}</h4>
                                    <div className="text-xs text-slate-400">({card.nameThai})</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Note Section (if exists) */}
                {note && note.trim() !== "" && (
                    <div className={`mb-8 p-6 rounded-2xl border ${isDark ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`}>
                            <FileText size={16} />
                            บันทึกของคุณ
                        </h3>
                        <div className="relative">
                            <Quote size={20} className={`absolute -top-1 -left-1 opacity-20 ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`} />
                            <p className={`pl-6 italic whitespace-pre-wrap ${isDark ? 'text-yellow-100/80' : 'text-slate-700'}`}>
                                {note}
                            </p>
                        </div>
                    </div>
                )}

                {/* Meanings List */}
                <div className={`space-y-6 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50'} p-6 rounded-2xl border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h3 className={`text-lg font-serif font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>คำทำนาย</h3>

                    {cards.map((card, idx) => {
                        let label = cards.length === 1 ? 'ความหมาย' : (idx === 0 ? 'อดีต' : idx === 1 ? 'ปัจจุบัน' : 'อนาคต');

                        return (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-green-600' : 'bg-purple-600'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <span className={`font-bold mr-2 ${isDark ? 'text-yellow-500' : 'text-slate-900'}`}>{card.name}:</span>
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{card.description}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
