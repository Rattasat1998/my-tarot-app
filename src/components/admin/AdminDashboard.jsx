import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, ExternalLink, Loader } from 'lucide-react';

export const AdminDashboard = ({ onClose, isDark }) => {
    const { user, isAdmin } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setErrorMsg(null);
            console.log('Fetching transactions...');
            // Use the new Security Definer RPC to ensure we see EVERYTHING
            const { data, error } = await supabase.rpc('get_admin_view_transactions');

            if (error) {
                console.error('RPC Error:', error);
                throw error;
            }

            console.log('Fetched data:', data);
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setErrorMsg(error.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (transactionId) => {
        if (!confirm('ยืนยันการอนุมัติยอดเงินนี้?')) return;

        setProcessingId(transactionId);
        try {
            const { data, error } = await supabase.rpc('approve_transaction', {
                transaction_id: transactionId
            });

            if (error) throw error;

            if (data) {
                alert('อนุมัติเรียบร้อย! เครดิตถูกเติมให้ผู้ใช้แล้ว');
                // Remove from list
                setTransactions(prev => prev.filter(t => t.id !== transactionId));
            }
        } catch (error) {
            console.error('Error approving:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (transactionId) => {
        if (!confirm('ยืนยันที่จะ "ปฏิเสธ" รายการนี้? ยอดเงินจะไม่ถูกเติมให้ผู้ใช้')) return;

        setProcessingId(transactionId);
        try {
            const { data, error } = await supabase.rpc('reject_transaction', {
                transaction_id: transactionId
            });

            if (error) throw error;

            if (data) {
                alert('ปฏิเสธรายการเรียบร้อย');
                // Remove from list
                setTransactions(prev => prev.filter(t => t.id !== transactionId));
            }
        } catch (error) {
            console.error('Error rejecting:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredTransactions = transactions.filter(t =>
        (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.id.includes(searchTerm)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`relative w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
                }`}>

                {/* Header */}
                <div className={`p-6 flex items-center justify-between border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-purple-50'
                    }`}>
                    <div>
                        <h2 className={`text-2xl font-bold font-serif ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Admin Dashboard
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${isDark ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                {user?.email}
                            </span>
                            <span className="text-[10px] opacity-50">
                                (UID: {user?.id?.slice(0, 4)}...)
                            </span>
                        </div>
                        {/* Search Input */}
                        <div className="mt-4 relative max-w-sm">
                            <input
                                type="text"
                                placeholder="ค้นหา Email หรือ Transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full text-sm px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-600'
                                    } focus:outline-none focus:ring-1 focus:ring-purple-500`}
                            />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                            }`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <Loader className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
                        </div>
                    ) : errorMsg ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <X size={48} className="mb-4" />
                            <p className="font-bold">เกิดข้อผิดพลาด</p>
                            <p className="text-sm mt-2">{errorMsg}</p>
                            <p className="text-xs mt-4 text-slate-500 max-w-md text-center">
                                หากขึ้นว่า "function get_admin_view_transactions() does not exist"
                                แสดงว่ายังไม่ได้รัน SQL สร้าง Function
                            </p>
                            <button onClick={fetchTransactions} className="mt-4 px-4 py-2 bg-slate-200 rounded-full text-slate-800 text-sm font-bold">ลองใหม่</button>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                            <Check size={48} className="mb-4" />
                            <p>ไม่มีรายการที่ต้องตรวจสอบ</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                            <p>ไม่พบรายการที่ค้นหา</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTransactions.map((trx) => (
                                <div key={trx.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-6 ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    {/* Slip Image */}
                                    <div className="w-full md:w-48 h-64 md:h-32 bg-black/20 rounded-lg overflow-hidden shrink-0">
                                        {trx.slip_url ? (
                                            <a href={trx.slip_url} target="_blank" rel="noreferrer" className="block w-full h-full relative group">
                                                <img
                                                    src={trx.slip_url}
                                                    alt="Slip"
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <ExternalLink className="text-white" />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                                                ไม่มีรูปสลิป
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    วันที่: {new Date(trx.created_at).toLocaleString('th-TH')}
                                                </p>
                                                <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {trx.email}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                รอตรวจสอบ
                                            </div>
                                        </div>

                                        <div className="flex items-end gap-4 mt-auto">
                                            <div>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ยอดโอน</p>
                                                <p className="text-xl font-bold text-purple-600">฿{trx.amount}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>เครดิตที่จะได้</p>
                                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>+{trx.credits_added}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 border-slate-700/50">
                                        <button
                                            onClick={() => handleApprove(trx.id)}
                                            disabled={processingId === trx.id}
                                            className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {processingId === trx.id ? 'กำลังบันทึก...' : 'อนุมัติ'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(trx.id)}
                                            disabled={processingId === trx.id}
                                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                                                }`}
                                        >
                                            ปฏิเสธ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
