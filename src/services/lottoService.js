import { supabase } from '../lib/supabase';
import { getNextDrawDate, formatThaiDrawLabel, formatDateISO, generateDrawId, getTodayISO } from '../utils/lottoDateUtils';

// API Endpoints
const API_BASE_URL = 'https://lotto.api.rayriffy.com';

/**
 * Fetch the latest lottery draw from RayRiffy API
 */
export const fetchLatestDrawFromApi = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/latest`);
        if (!response.ok) throw new Error('Failed to fetch latest draw');
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching latest draw from API:', error);
        return null;
    }
};

/**
 * Fetch draw history list from API
 * @param {number} page - Page number (default 1)
 */
export const fetchDrawHistory = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/list/${page}`);
        if (!response.ok) throw new Error('Failed to fetch draw history');
        const data = await response.json();
        return data.response; // Returns array of { id, date, url }
    } catch (error) {
        console.error('Error fetching draw history:', error);
        return [];
    }
};

/**
 * Fetch specific draw by ID from API
 * @param {string} id - Draw ID
 */
export const fetchDrawByIdFromApi = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/lotto/${id}`);
        if (!response.ok) throw new Error('Failed to fetch draw details');
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching specific draw:', error);
        return null;
    }
};

/**
 * Check if a number won any prize in the draw
 * @param {string} lotteryNumber - 6 digit lottery number
 * @param {object} drawData - Draw data from API
 */
export const checkLotteryWin = (lotteryNumber, drawData) => {
    if (!lotteryNumber || lotteryNumber.length !== 6 || !drawData) return null;

    const results = [];

    // Helper to check standard prizes
    const checkPrize = (prizeKey, prizeName) => {
        const prize = drawData.prizes.find(p => p.id === prizeKey);
        if (prize && prize.number.includes(lotteryNumber)) {
            results.push({
                name: prizeName || prize.name,
                reward: prize.reward,
                amount: prize.amount
            });
        }
    };

    // Check specific prizes
    checkPrize('prizeFirst', 'รางวัลที่ 1');
    checkPrize('prizeFirstNear', 'รางวัลข้างเคียงรางวัลที่ 1');
    checkPrize('prizeSecond', 'รางวัลที่ 2');
    checkPrize('prizeThird', 'รางวัลที่ 3');
    checkPrize('prizeForth', 'รางวัลที่ 4');
    checkPrize('prizeFifth', 'รางวัลที่ 5');

    // Check Running Numbers (Front 3, Back 3, Back 2)
    if (drawData.runningNumbers) {
        drawData.runningNumbers.forEach(rn => {
            let matched = false;

            if (rn.id === 'runningNumberFrontThree') {
                const frontThree = lotteryNumber.slice(0, 3);
                if (rn.number.includes(frontThree)) matched = true;
            } else if (rn.id === 'runningNumberBackThree') {
                const backThree = lotteryNumber.slice(3);
                if (rn.number.includes(backThree)) matched = true;
            } else if (rn.id === 'runningNumberBackTwo') {
                const backTwo = lotteryNumber.slice(4);
                if (rn.number.includes(backTwo)) matched = true;
            }

            if (matched) {
                results.push({
                    name: rn.name,
                    reward: rn.reward,
                    amount: rn.amount
                });
            }
        });
    }

    return results.length > 0 ? results : null;
};

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
 * Get the upcoming draw (auto-detected by date)
 * Tries DB first, then auto-generates based on next draw date
 */
export const getUpcomingDraw = async () => {
    try {
        const todayISO = formatDateISO(new Date());

        // Try to find a draw in DB with date >= today
        const { data, error } = await supabase
            .from('lotto_draws')
            .select('*')
            .gte('date', todayISO)
            .order('date', { ascending: true })
            .limit(1);

        if (!error && data && data.length > 0) {
            return data[0];
        }
    } catch (err) {
        console.error('Error fetching upcoming draw:', err);
    }

    // Auto-generate upcoming draw entry
    const nextDate = getNextDrawDate();
    return {
        id: generateDrawId(nextDate),
        date: formatDateISO(nextDate),
        label: formatThaiDrawLabel(nextDate),
        is_upcoming: true,
        kpi: null,
        result: null,
        lucky_pool: null,
        conclusion: null
    };
};

/**
 * Get past draws (auto-detected by date)
 */
export const getPastDraws = async () => {
    const todayISO = formatDateISO(new Date());

    const { data, error } = await supabase
        .from('lotto_draws')
        .select('id, date, label, is_upcoming, kpi, result')
        .lt('date', todayISO)
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
        luckyPool: draw.lucky_pool,
        conclusion: draw.conclusion || null
    };
};
