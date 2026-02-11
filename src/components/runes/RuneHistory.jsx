import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Loader, Calendar, FileText, Search, ArrowLeft } from 'lucide-react';
import { RuneReading } from './RuneReading';

export const RuneHistory = ({ onBack, isDark }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [selectedReading, setSelectedReading] = useState(null);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reading_history')
                .select('*')
                .eq('user_id', user.id)
                .eq('topic', 'rune')
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

    const getModeLabel = (mode) => {
        switch (mode) {
            case 'single': return 'รูนรายวัน (1 ก้อน)';
            case 'three': return 'อดีต ปัจจุบัน อนาคต (3 ก้อน)';
            case 'five': return 'Rune Cross (5 ก้อน)';
            default: return mode;
        }
    };

    if (selectedReading) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-right duration-300">
                <button
                    onClick={() => setSelectedReading(null)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    ย้อนกลับไปหน้าประวัติ
                </button>

                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2 text-slate-400 text-sm mb-2">
                        <Calendar size={14} />
                        {formatDate(selectedReading.created_at)}
                    </div>
                    <h2 className="text-2xl font-serif text-white mb-2">{getModeLabel(selectedReading.reading_type)}</h2>
                    {selectedReading.note && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 inline-block max-w-2xl">
                            <div className="flex items-center gap-2 text-slate-300">
                                <FileText size={16} className="text-emerald-500" />
                                <span className="italic">"{selectedReading.note}"</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-slate-700/50">
                    <RuneReading
                        drawnRunes={selectedReading.cards}
                        positions={selectedReading.reading_type === 'five'
                            ? ['สถานการณ์', 'อุปสรรค', 'สิ่งช่วยเหลือ', 'รากฐาน', 'ผลลัพธ์']
                            : selectedReading.reading_type === 'three'
                                ? ['อดีต', 'ปัจจุบัน', 'อนาคต']
                                : ['คำแนะนำ']}
                        mode={selectedReading.reading_type}
                        onReset={() => setSelectedReading(null)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <FileText size={18} className="text-emerald-400" />
                </div>
                ประวัติการทำนายรูน
            </h2>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin text-emerald-500" />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-dashed border-slate-700 bg-slate-900/30">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-600" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">ยังไม่มีประวัติการทำนาย</h3>
                    <p className="text-sm text-slate-600 mt-1">เริ่มทำนายรูนครั้งแรกของคุณได้เลย</p>
                    <button
                        onClick={onBack}
                        className="mt-6 px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                    >
                        ตีกดูดวง (Back)
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="bg-slate-900/60 border border-slate-700/50 p-5 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all cursor-pointer group"
                            onClick={() => setSelectedReading(item)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                                            {getModeLabel(item.reading_type)}
                                        </h4>
                                        {item.note && <FileText size={14} className="text-slate-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Calendar size={12} />
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>
                                <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                    ดูผลทำนาย &rarr;
                                </div>
                            </div>

                            {/* Mini Rune Preview */}
                            <div className="flex gap-2">
                                {item.cards && item.cards.map((rune, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-10 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-emerald-500/70 text-lg font-mono"
                                    >
                                        {rune.symbol}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
