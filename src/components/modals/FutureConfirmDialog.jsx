import React from 'react';

export const FutureConfirmDialog = ({ onConfirm, onCancel, isDark }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} animate-in zoom-in duration-300`}>
            <h3 className="text-xl font-bold mb-4 text-center">ดูดวงอนาคตหรือไม่?</h3>
            <p className={`mb-6 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>คุณต้องการเลือกไพ่เพิ่มอีก 1 ใบเพื่อทำนายอนาคตต่อหรือไม่?</p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                    ยกเลิก
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                    ตกลง
                </button>
            </div>
        </div>
    </div>
);
