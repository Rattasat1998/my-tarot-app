import React, { useEffect, useState } from 'react';
import { Users, Eye, Sparkles, Clock, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const StatsCounter = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReadings: 0,
        todayReadings: 0,
        satisfactionRate: 98
    });
    const [animated, setAnimated] = useState(false);
    const [onlineNow, setOnlineNow] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get total users
                const { count: userCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Get total readings
                const { count: readingCount } = await supabase
                    .from('reading_history')
                    .select('*', { count: 'exact', head: true });

                // Get today's readings
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const { count: todayCount } = await supabase
                    .from('reading_history')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', today.toISOString());

                setStats({
                    totalUsers: (userCount || 0) + 1247, // Add base number for social proof
                    totalReadings: (readingCount || 0) + 8934, // Add base number
                    todayReadings: (todayCount || 0) + Math.floor(Math.random() * 50) + 20,
                    satisfactionRate: 98
                });

                // Simulate online users (random between 5-25)
                setOnlineNow(Math.floor(Math.random() * 20) + 5);
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Fallback stats
                setStats({
                    totalUsers: 1247,
                    totalReadings: 8934,
                    todayReadings: Math.floor(Math.random() * 50) + 20,
                    satisfactionRate: 98
                });
                setOnlineNow(Math.floor(Math.random() * 20) + 5);
            }
        };

        fetchStats();
        setTimeout(() => setAnimated(true), 100);

        // Update online users every 30 seconds
        const interval = setInterval(() => {
            setOnlineNow(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(3, Math.min(30, prev + change));
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const counters = [
        {
            icon: Users,
            label: 'ผู้ใช้งานทั้งหมด',
            value: stats.totalUsers,
            suffix: '+',
            color: 'text-blue-400',
            bgColor: 'from-blue-500/10 to-blue-600/5'
        },
        {
            icon: Eye,
            label: 'ยอดทำนายทั้งหมด',
            value: stats.totalReadings,
            suffix: '+',
            color: 'text-purple-400',
            bgColor: 'from-purple-500/10 to-purple-600/5'
        },
        {
            icon: TrendingUp,
            label: 'ทำนายวันนี้',
            value: stats.todayReadings,
            suffix: '',
            color: 'text-green-400',
            bgColor: 'from-green-500/10 to-green-600/5'
        },
        {
            icon: Star,
            label: 'ความพึงพอใจ',
            value: stats.satisfactionRate,
            suffix: '%',
            color: 'text-yellow-400',
            bgColor: 'from-yellow-500/10 to-yellow-600/5'
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Online Now Badge */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500 absolute"></span>
                    <span className="text-green-400 text-sm font-medium">
                        กำลังออนไลน์ {onlineNow} คน
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {counters.map((item, idx) => (
                    <div
                        key={idx}
                        className={`relative overflow-hidden bg-gradient-to-br ${item.bgColor} rounded-2xl p-5 border border-slate-800/50 text-center hover:border-purple-500/30 hover:scale-105 transition-all duration-300 group`}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <item.icon className={`w-6 h-6 mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
                        <div className={`text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-all duration-1000 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {animated ? item.value.toLocaleString() : 0}{item.suffix}
                        </div>
                        <div className="text-xs text-slate-400 mt-2 font-medium">{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                    🔒 ข้อมูลปลอดภัย • ⚡ ผลทันที • 🌟 ความแม่นยำสูง
                </p>
            </div>
        </div>
    );
};
