import React, { useState } from 'react';
import { X, Save, FileText, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const SaveMemoModal = ({ isOpen, onClose, topic, readingType, cards, onSaveSuccess, isDark }) => {
    const { user } = useAuth();
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('reading_history')
                .insert({
                    user_id: user.id,
                    topic: topic,
                    reading_type: readingType,
                    cards: cards,
                    note: note
                });

            if (error) throw error;

            if (onSaveSuccess) onSaveSuccess();
            onClose();
            alert('บันทึกผลการทำนายเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Error saving reading:', err);
            alert('เกิดข้อผิดพลาดในการบันทึก: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`relative w-full max-w-md p-6 rounded-3xl shadow-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <FileText className="text-purple-500" />
                        บันทึกช่วยจำ
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full hover:bg-black/10 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            จดบันทึกของคุณ (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="รู้สึกอย่างไรกับคำทำนายนี้? มีอะไรอยากจดจำไว้บ้าง?"
                            rows={4}
                            className={`w-full p-4 rounded-xl resize-none outline-none border transition-all ${isDark
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                                }`}
                        />
                    </div>

                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        * ผลการทำนายและไพ่ที่คุณได้จะถูกบันทึกไว้โดยอัตโนมัติ
                    </p>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </button>
                </div>
            </div>
        </div>
    );
};
