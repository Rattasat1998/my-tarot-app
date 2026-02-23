import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Heart, Brain, TrendingUp, Calendar, Plus, Search, Filter, Crown, Download, Share2, Edit, Trash2, Star, Loader } from 'lucide-react';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useActivityLog } from '../hooks/useActivityLog';

export const JournalPage = ({ isDark }) => {
    const { isPremium } = usePremium();
    const { user } = useAuth();
    const { logActivity } = useActivityLog();
    const [entries, setEntries] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isLoadingEntries, setIsLoadingEntries] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentEntry, setCurrentEntry] = useState({
        title: '',
        content: '',
        mood: '',
        tags: [],
        date: new Date().toISOString()
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMood, setFilterMood] = useState('all');

    const moods = [
        { id: 'grateful', name: 'ซาบซึ้ง', icon: '🙏', color: 'yellow' },
        { id: 'peaceful', name: 'สงบ', icon: '😌', color: 'blue' },
        { id: 'excited', name: 'ตื่นเต้น', icon: '🎉', color: 'orange' },
        { id: 'thoughtful', name: 'คิดมาก', icon: '🤔', color: 'purple' },
        { id: 'challenged', name: 'ท้าทาย', icon: '💪', color: 'red' },
        { id: 'inspired', name: 'ได้แรงบันดาลใจ', icon: '✨', color: 'pink' }
    ];

    const fetchEntries = useCallback(async () => {
        if (!user || !isPremium) {
            setIsLoadingEntries(false);
            return;
        }
        setIsLoadingEntries(true);
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (err) {
            console.error('Error fetching journal entries:', err);
        } finally {
            setIsLoadingEntries(false);
        }
    }, [user, isPremium]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const editEntry = (entry) => {
        setCurrentEntry({
            title: entry.title,
            content: entry.content,
            mood: entry.mood || '',
            tags: entry.tags || [],
            date: entry.created_at || entry.date
        });
        setEditingId(entry.id);
        setIsWriting(true);
    };

    const resetForm = () => {
        setCurrentEntry({ title: '', content: '', mood: '', tags: [], date: new Date().toISOString() });
        setEditingId(null);
        setIsWriting(false);
    };

    const saveEntry = async () => {
        if (!currentEntry.title || !currentEntry.content || !user) return;
        setIsSaving(true);
        try {
            const insights = generateInsights(currentEntry.content);

            if (editingId) {
                // Update existing entry
                const { data, error } = await supabase
                    .from('journal_entries')
                    .update({
                        title: currentEntry.title,
                        content: currentEntry.content,
                        mood: currentEntry.mood || null,
                        tags: currentEntry.tags,
                        insights,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingId)
                    .select()
                    .single();

                if (error) throw error;

                setEntries(prev => prev.map(e => e.id === editingId ? data : e));
            } else {
                // Insert new entry
                const { data, error } = await supabase
                    .from('journal_entries')
                    .insert([{
                        user_id: user.id,
                        title: currentEntry.title,
                        content: currentEntry.content,
                        mood: currentEntry.mood || null,
                        tags: currentEntry.tags,
                        insights
                    }])
                    .select()
                    .single();

                if (error) throw error;

                setEntries(prev => [data, ...prev]);
                logActivity('journal', `เขียนบันทึก: ${currentEntry.title}`, { mood: currentEntry.mood });
            }

            resetForm();
        } catch (err) {
            console.error('Error saving journal entry:', err);
            alert('ไม่สามารถบันทึกได้ กรุณาลองใหม่');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEntry = async (entryId) => {
        if (!confirm('ต้องการลบบันทึกนี้หรือไม่?')) return;
        try {
            const { error } = await supabase
                .from('journal_entries')
                .delete()
                .eq('id', entryId);

            if (error) throw error;
            setEntries(prev => prev.filter(e => e.id !== entryId));
        } catch (err) {
            console.error('Error deleting journal entry:', err);
        }
    };

    const generateInsights = (content) => {
        // Simple insight generation based on content
        const insights = [];
        if (content.includes('สำเร็จ') || content.includes('สำเร็จ')) {
            insights.push('การยอมรับความสำเร็จนำไปสู่ความมั่นใจ');
        }
        if (content.includes('เรียนรู้') || content.includes('บทเรียน')) {
            insights.push('ทุกประสบการณ์เป็นบทเรียนที่มีค่า');
        }
        if (content.includes('สงบ') || content.includes('สมาธิ')) {
            insights.push('การสงบสติอาจเป็นกุญแจสู่ความสุข');
        }
        return insights;
    };

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMood = filterMood === 'all' || entry.mood === filterMood;
        return matchesSearch && matchesMood;
    });

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Header */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                                <BookOpen className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    Personal Growth Journal
                                </h1>
                                <p className="text-slate-300">บันทึกการเดินทางสู่การพัฒนาตนเอง</p>
                            </div>
                        </div>
                        
                        <PremiumGate feature="personalGrowthJournal" fallback={
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                <Crown className="w-5 h-5 text-purple-400" />
                                <span className="text-purple-300 font-medium">Premium</span>
                            </div>
                        }>
                            <button
                                onClick={() => setIsWriting(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
                            >
                                <Plus size={20} />
                                เขียนบันทึกใหม่
                            </button>
                        </PremiumGate>
                    </div>

                    {/* Search and Filter */}
                    <PremiumGate feature="personalGrowthJournal" fallback={null}>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="ค้นหาบันทึก..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-100 border border-slate-300'} focus:outline-none focus:border-purple-500`}
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Filter className="text-slate-400" size={20} />
                                <select
                                    value={filterMood}
                                    onChange={(e) => setFilterMood(e.target.value)}
                                    className={`px-4 py-3 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-100 border border-slate-300'} focus:outline-none focus:border-purple-500`}
                                >
                                    <option value="all">ทุกอารมณ์</option>
                                    {moods.map(mood => (
                                        <option key={mood.id} value={mood.id}>{mood.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </PremiumGate>
                </div>

                {/* Writing Interface */}
                {isWriting && (
                    <PremiumGate feature="personalGrowthJournal" fallback={null}>
                        <div className="max-w-4xl mx-auto px-6 pb-8">
                            <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-8`}>
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="หัวข้อบันทึก..."
                                        value={currentEntry.title}
                                        onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                                        className={`w-full text-2xl font-bold bg-transparent border-none outline-none text-white placeholder-slate-400 mb-4`}
                                    />
                                    
                                    {/* Mood Selection */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-slate-400">อารมณ์:</span>
                                        <div className="flex gap-2">
                                            {moods.map(mood => (
                                                <button
                                                    key={mood.id}
                                                    onClick={() => setCurrentEntry({...currentEntry, mood: mood.id})}
                                                    className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                                                        currentEntry.mood === mood.id
                                                            ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <span>{mood.icon}</span>
                                                    <span className="text-sm">{mood.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="เขียนบันทึกของคุณที่นี่... สิ่งที่คุณเรียนรู้ ความรู้สึก หรือความคิดที่เกิดขึ้น..."
                                    value={currentEntry.content}
                                    onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                                    className={`w-full h-64 p-4 rounded-xl resize-none outline-none ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500' : 'bg-slate-100 border border-slate-300 placeholder-slate-500'}`}
                                />

                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        onClick={resetForm}
                                        className={`px-6 py-3 rounded-xl border transition-all font-medium ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        ยกเลิก
                                    </button>
                                    
                                    <button
                                        onClick={saveEntry}
                                        disabled={!currentEntry.title || !currentEntry.content || isSaving}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSaving ? <><Loader className="w-4 h-4 animate-spin" /> กำลังบันทึก...</> : editingId ? 'อัปเดต' : 'บันทึก'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </PremiumGate>
                )}

                {/* Journal Entries */}
                <div className="max-w-4xl mx-auto px-6 pb-12">
                    <div className="space-y-6">
                        {filteredEntries.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 text-lg">
                                    {isPremium ? 'ยังไม่มีบันทึก เริ่มเขียนบันทึกแรกของคุณได้เลย!' : 'อัปเกรดเป็น Premium เพื่อเริ่มบันทึกการเดินทางของคุณ'}
                                </p>
                            </div>
                        ) : (
                            filteredEntries.map(entry => {
                                const mood = moods.find(m => m.id === entry.mood);
                                return (
                                    <div key={entry.id} className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(entry.created_at || entry.date).toLocaleDateString('th-TH')}
                                                    </div>
                                                    {mood && (
                                                        <div className="flex items-center gap-1">
                                                            <span>{mood.icon}</span>
                                                            <span>{mood.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => editEntry(entry)}
                                                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700">
                                                    <Share2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteEntry(entry.id)}
                                                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-red-400 hover:bg-red-900/30 hover:border-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-slate-300 mb-4 leading-relaxed">{entry.content}</p>

                                        {entry.tags && entry.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {entry.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {entry.insights && entry.insights.length > 0 && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                                                <h4 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                                                    <Star className="w-4 h-4" />
                                                    ความเข้าใจที่ได้รับ
                                                </h4>
                                                <ul className="space-y-1">
                                                    {entry.insights.map((insight, index) => (
                                                        <li key={index} className="text-purple-200 text-sm">• {insight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
