import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, XCircle, QrCode, Building2, Coins, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function TransactionHistoryModal({ isOpen, onClose, isDark }) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'stripe_promptpay', 'bank_transfer'

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

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.payment_method === filter);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                        <CheckCircle size={12} /> สำเร็จ
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                        <XCircle size={12} /> ถูกปฏิเสธ
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                        <Clock size={12} /> รอตรวจสอบ
                    </span>
                );
        }
    };

    const getPaymentMethodBadge = (method) => {
        if (method === 'stripe_promptpay') {
            return (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <QrCode size={10} /> PromptPay
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building2 size={10} /> โอนธนาคาร
            </span>
        );
    };

    const totalCredits = transactions
        .filter(t => t.status === 'approved')
        .reduce((sum, t) => sum + (t.credits_added || 0), 0);
    const totalAmount = transactions
        .filter(t => t.status === 'approved')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col transition-all transform scale-100 ${isDark ? 'bg-slate-900 border border-slate-700 text-slate-100' : 'bg-white text-slate-900'}`}>

                {/* Header */}
                <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-serif font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            💰 ประวัติการเติมเงิน
                        </h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                            <p className="text-xs opacity-60 mb-1">เครดิตที่เติมทั้งหมด</p>
                            <div className="flex items-center gap-2">
                                <Coins size={18} className="text-amber-400" />
                                <span className="text-xl font-bold text-amber-400">{totalCredits}</span>
                                <span className="text-xs opacity-50">เครดิต</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                            <p className="text-xs opacity-60 mb-1">ยอดจ่ายทั้งหมด</p>
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} className="text-green-400" />
                                <span className="text-xl font-bold text-green-400">฿{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {[
                            { key: 'all', label: 'ทั้งหมด' },
                            { key: 'stripe_promptpay', label: 'PromptPay' },
                            { key: 'bank_transfer', label: 'โอนธนาคาร' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.key
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                        : isDark
                                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {f.label} {filter === 'all' && f.key === 'all' ? `(${transactions.length})` : ''}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 opacity-50 flex flex-col items-center">
                            <Clock size={48} className="mb-4 text-slate-600" />
                            <p>ไม่พบประวัติการเติมเงิน</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTransactions.map((trx) => (
                                <div
                                    key={trx.id}
                                    className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-col gap-1.5 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-lg">฿{trx.amount}</span>
                                                {getStatusBadge(trx.status)}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {getPaymentMethodBadge(trx.payment_method)}
                                                <span className="text-xs opacity-50">
                                                    {new Date(trx.created_at).toLocaleString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-lg font-bold text-amber-400">
                                                +{trx.credits_added}
                                            </div>
                                            <div className="text-xs text-amber-400/60">เครดิต</div>
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
