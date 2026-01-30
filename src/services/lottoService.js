import { supabase } from '../lib/supabase';

/**
 * Get all lotto draws sorted by date (newest first)
 */
export const getAllDraws = async () => {
    const { data, error } = await supabase
        .from('lotto_draws')
        .select('id, date, label, is_upcoming, kpi, result, lucky_pool')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching lotto draws:', error);
        return [];
    }
    return data || [];
};

/**
 * Get the upcoming draw (for main LottoInsight page)
 */
export const getUpcomingDraw = async () => {
    const { data, error } = await supabase
        .from('lotto_draws')
        .select('*')
        .eq('is_upcoming', true)
        .single();

    if (error) {
        console.error('Error fetching upcoming draw:', error);
        return null;
    }
    return data;
};

/**
 * Get past draws (for history section)
 */
export const getPastDraws = async () => {
    const { data, error } = await supabase
        .from('lotto_draws')
        .select('id, date, label, is_upcoming, kpi, result')
        .eq('is_upcoming', false)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching past draws:', error);
        return [];
    }
    return data || [];
};

/**
 * Get a specific draw by ID (for detail page)
 */
export const getDrawById = async (drawId) => {
    const { data, error } = await supabase
        .from('lotto_draws')
        .select('*')
        .eq('id', drawId)
        .single();

    if (error) {
        console.error('Error fetching draw by ID:', error);
        return null;
    }
    return data;
};

/**
 * Generate a lucky number from the pool
 */
export const generateLuckyNumberFromPool = (luckyPool) => {
    if (!luckyPool || luckyPool.length === 0) {
        const defaults = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }
    return luckyPool[Math.floor(Math.random() * luckyPool.length)];
};

/**
 * Transform database draw to the format expected by LottoInsightPage
 * (for backward compatibility with existing UI)
 */
export const transformDrawForUI = (draw) => {
    if (!draw) return null;

    return {
        id: draw.id,
        date: draw.date,
        label: draw.label,
        isUpcoming: draw.is_upcoming,
        kpi: draw.kpi,
        result: draw.result,
        historical: draw.historical_stats ? {
            labels: draw.historical_stats.slice(0, 5).map(h => h.lastTwo),
            data: [3, 2, 2, 2, 1], // Frequency counts
            context: 'สถิติย้อนหลัง 22 ปี'
        } : null,
        sources: draw.sources ? draw.sources.map(s => ({
            name: s.name,
            theme: s.theme,
            color: s.color,
            numbers: s.two || []
        })) : null,
        trends: draw.events ? {
            items: [
                { label: '🔥 ' + (draw.events[0]?.title || 'เหตุการณ์สำคัญ'), rank: 1 },
                { label: '🗳️ ' + (draw.events[1]?.title || 'การเมือง'), rank: 2 },
                { label: '📅 เลขมงคลประจำเดือน', rank: 3 }
            ]
        } : null,
        luckyPool: draw.lucky_pool
    };
};
