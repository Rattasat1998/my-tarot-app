import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, ExternalLink, Loader, Calendar } from 'lucide-react';

export const ApprovalHistory = ({ isDark }) => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setErrorMsg(null);
            console.log('Fetching history...');

            // Correct table name found in supabase_setup.sql is 'transactions'
            const { data, error } = await supabase
                .from('transactions')
                .select('*, profiles:user_id(email)')
                .in('status', ['approved', 'rejected'])
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }

            setTransactions(data || []);

            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            // If direct select fails due to RLS or table name, we might simply show a message
            // instructing the user to create an RPC or saying we can't view history yet.
            setErrorMsg(error.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const email = t.profiles?.email || t.email || '';
        return (
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.includes(searchTerm)
        );
    });

    return (
        <div className="h-full flex flex-col">
            {/* Search Input */}
            <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <input
                    type="text"
                    placeholder="ค้นหา Email หรือ Transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full max-w-sm text-sm px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-600'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                />
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <Loader className="animate-spin mr-2" /> กำลังโหลดประวัติ...
                    </div>
                ) : errorMsg ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500">
                        <Calendar size={48} className="mb-4" />
                        <p className="font-bold">ไม่สามารถโหลดประวัติได้</p>
                        <p className="text-sm mt-2">{errorMsg}</p>
                        <p className="text-xs mt-2 text-slate-500">อาจจำเป็นต้องสร้าง RPC สำหรับดึงประวัติ หรือตรวจสอบชื่อ Table</p>
                        <button onClick={fetchHistory} className="mt-4 px-4 py-2 bg-slate-200 rounded-full text-slate-800 text-sm font-bold">ลองใหม่</button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                        <Calendar size={48} className="mb-4" />
                        <p>ไม่มีประวัติการอนุมัติ</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                        <p>ไม่พบรายการที่ค้นหา</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredTransactions.map((trx) => (
                            <div key={trx.id} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-6 ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'} ${trx.status === 'rejected' ? 'opacity-75' : ''}`}>
                                {/* Slip Image */}
                                <div className="w-full md:w-32 h-48 md:h-24 bg-black/20 rounded-lg overflow-hidden shrink-0">
                                    {trx.slip_path || trx.slip_url ? (
                                        <a href={trx.slip_path || trx.slip_url} target="_blank" rel="noreferrer" className="block w-full h-full relative group">
                                            <img
                                                src={trx.slip_path || trx.slip_url}
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
                                                วันที่: {new Date(trx.updated_at || trx.created_at).toLocaleString('th-TH')}
                                            </p>
                                            <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {trx.profiles?.email || trx.email || 'Unknown User'}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${trx.status === 'approved'
                                            ? (isDark ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-700')
                                            : (isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-700')
                                            }`}>
                                            {trx.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-4 mt-auto">
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ยอดโอน</p>
                                            <p className="text-xl font-bold text-purple-600">฿{trx.amount_paid || trx.amount}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>เครดิต</p>
                                            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>+{trx.credit_amount || trx.credits_added}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
