// Thai Lottery Date Utilities
// Draws happen on the 1st and 16th of every month

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const MONTH_IDS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Get the next lottery draw date from today
 * @param {Date} [fromDate] - Base date (defaults to now)
 * @returns {Date} Next draw date
 */
export const getNextDrawDate = (fromDate = new Date()) => {
    const year = fromDate.getFullYear();
    const month = fromDate.getMonth();
    const day = fromDate.getDate();

    if (day <= 1) return new Date(year, month, 1);
    if (day <= 16) return new Date(year, month, 16);
    return new Date(year, month + 1, 1);
};

/**
 * Format a date as Thai lottery label (e.g., "งวด 1 มีนาคม 2569")
 * @param {Date} date
 * @returns {string}
 */
export const formatThaiDrawLabel = (date) => {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const thaiYear = date.getFullYear() + 543;
    return `งวด ${day} ${month} ${thaiYear}`;
};

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export const formatDateISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * Generate a draw ID from a date (e.g., "mar-1-2026")
 * @param {Date} date
 * @returns {string}
 */
export const generateDrawId = (date) => {
    return `${MONTH_IDS[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`;
};

/**
 * Get today's date as ISO string
 * @returns {string}
 */
export const getTodayISO = () => formatDateISO(new Date());
