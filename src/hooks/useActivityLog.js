import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const useActivityLog = () => {
    const { user } = useAuth();
    const [recentActivities, setRecentActivities] = useState([]);
    const [stats, setStats] = useState({ totalReadings: 0, totalMeditations: 0, totalJournals: 0 });
    const [loading, setLoading] = useState(true);

    const fetchRecentActivities = useCallback(async (limit = 10) => {
        if (!user) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            setRecentActivities(data || []);
        } catch (err) {
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchStats = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('activity_log')
                .select('type')
                .eq('user_id', user.id);

            if (error) throw error;

            const counts = (data || []).reduce((acc, item) => {
                acc[item.type] = (acc[item.type] || 0) + 1;
                return acc;
            }, {});

            setStats({
                totalReadings: (counts['tarot_reading'] || 0) + (counts['rune_reading'] || 0),
                totalMeditations: counts['meditation'] || 0,
                totalJournals: counts['journal'] || 0,
                totalZodiac: counts['zodiac_report'] || 0,
                totalLotto: counts['lotto'] || 0,
                total: data?.length || 0
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchRecentActivities();
        fetchStats();
    }, [fetchRecentActivities, fetchStats]);

    const logActivity = async (type, title, metadata = {}) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('activity_log')
                .insert([{
                    user_id: user.id,
                    type,
                    title,
                    metadata
                }]);

            if (error) throw error;

            // Refresh after logging
            fetchRecentActivities();
            fetchStats();
        } catch (err) {
            console.error('Error logging activity:', err);
        }
    };

    return { recentActivities, stats, loading, logActivity, refresh: fetchRecentActivities };
};
