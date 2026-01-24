import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function TransactionHistoryModal({ isOpen, onClose, isDark }) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                        <CheckCircle size={12} /> สำเร็จ
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-500">
                        <XCircle size={12} /> ถูกปฏิเสธ
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                        <Clock size={12} /> รอตรวจสอบ
                    </span>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col transition-all transform scale-100 ${isDark ? 'bg-slate-900 border border-slate-700 text-slate-100' : 'bg-white text-slate-900'}`}>

                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h2 className="text-xl font-serif font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ประวัติการเติมเงิน
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12 opacity-50 flex flex-col items-center">
                            <Clock size={48} className="mb-4 text-slate-600" />
                            <p>ไม่พบประวัติการเติมเงิน</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((trx) => (
                                <div
                                    key={trx.id}
                                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{trx.amount} บาท</span>
                                            {getStatusBadge(trx.status)}
                                        </div>
                                        <span className="text-xs opacity-60">
                                            {new Date(trx.created_at).toLocaleString('th-TH')}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-purple-400">
                                            +{trx.credits_added} เครดิต
                                        </div>
                                        {trx.slip_url && (
                                            <a
                                                href={trx.slip_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-400 hover:underline mt-1 block"
                                            >
                                                ดูสลิป
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
