/**
 * Zodiac Utility Functions - คำนวณราศีและข้อมูลสายมู
 */

// ราศีทั้ง 12 ราศี (Thai Zodiac based on Solar calendar)
const ZODIAC_DATA = {
    aries: {
        name: 'ราศีเมษ',
        thaiName: 'เมษ',
        symbol: '♈',
        element: 'ไฟ',
        elementEmoji: '🔥',
        color: '#FF4444',
        colorName: 'แดง',
        luckyColors: ['แดง', 'ส้ม', 'เหลือง'],
        dateRange: { startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 }
    },
    taurus: {
        name: 'ราศีพฤษภ',
        thaiName: 'พฤษภ',
        symbol: '♉',
        element: 'ดิน',
        elementEmoji: '🌍',
        color: '#4CAF50',
        colorName: 'เขียว',
        luckyColors: ['เขียว', 'ชมพู', 'ขาว'],
        dateRange: { startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 }
    },
    gemini: {
        name: 'ราศีเมถุน',
        thaiName: 'เมถุน',
        symbol: '♊',
        element: 'ลม',
        elementEmoji: '💨',
        color: '#FFEB3B',
        colorName: 'เหลือง',
        luckyColors: ['เหลือง', 'เขียวอ่อน', 'ขาว'],
        dateRange: { startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 }
    },
    cancer: {
        name: 'ราศีกรกฎ',
        thaiName: 'กรกฎ',
        symbol: '♋',
        element: 'น้ำ',
        elementEmoji: '💧',
        color: '#E0E0E0',
        colorName: 'เงิน',
        luckyColors: ['ขาว', 'เงิน', 'ครีม'],
        dateRange: { startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 }
    },
    leo: {
        name: 'ราศีสิงห์',
        thaiName: 'สิงห์',
        symbol: '♌',
        element: 'ไฟ',
        elementEmoji: '🔥',
        color: '#FF9800',
        colorName: 'ส้ม',
        luckyColors: ['ทอง', 'ส้ม', 'แดง'],
        dateRange: { startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 }
    },
    virgo: {
        name: 'ราศีกันย์',
        thaiName: 'กันย์',
        symbol: '♍',
        element: 'ดิน',
        elementEmoji: '🌍',
        color: '#8D6E63',
        colorName: 'น้ำตาล',
        luckyColors: ['เขียว', 'น้ำตาล', 'เทา'],
        dateRange: { startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 }
    },
    libra: {
        name: 'ราศีตุลย์',
        thaiName: 'ตุลย์',
        symbol: '♎',
        element: 'ลม',
        elementEmoji: '💨',
        color: '#E91E63',
        colorName: 'ชมพู',
        luckyColors: ['ชมพู', 'ฟ้า', 'ขาว'],
        dateRange: { startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 }
    },
    scorpio: {
        name: 'ราศีพิจิก',
        thaiName: 'พิจิก',
        symbol: '♏',
        element: 'น้ำ',
        elementEmoji: '💧',
        color: '#9C27B0',
        colorName: 'ม่วง',
        luckyColors: ['แดงเข้ม', 'ดำ', 'ม่วง'],
        dateRange: { startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 }
    },
    sagittarius: {
        name: 'ราศีธนู',
        thaiName: 'ธนู',
        symbol: '♐',
        element: 'ไฟ',
        elementEmoji: '🔥',
        color: '#673AB7',
        colorName: 'ม่วงน้ำเงิน',
        luckyColors: ['ม่วง', 'น้ำเงิน', 'ขาว'],
        dateRange: { startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
    },
    capricorn: {
        name: 'ราศีมังกร',
        thaiName: 'มังกร',
        symbol: '♑',
        element: 'ดิน',
        elementEmoji: '🌍',
        color: '#607D8B',
        colorName: 'เทา',
        luckyColors: ['ดำ', 'น้ำตาล', 'เทา'],
        dateRange: { startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 }
    },
    aquarius: {
        name: 'ราศีกุมภ์',
        thaiName: 'กุมภ์',
        symbol: '♒',
        element: 'ลม',
        elementEmoji: '💨',
        color: '#03A9F4',
        colorName: 'ฟ้า',
        luckyColors: ['ฟ้า', 'เขียว', 'เงิน'],
        dateRange: { startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 }
    },
    pisces: {
        name: 'ราศีมีน',
        thaiName: 'มีน',
        symbol: '♓',
        element: 'น้ำ',
        elementEmoji: '💧',
        color: '#00BCD4',
        colorName: 'เขียวน้ำทะเล',
        luckyColors: ['เขียวน้ำทะเล', 'ม่วง', 'ขาว'],
        dateRange: { startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
    }
};

// Member levels
const MEMBER_LEVELS = {
    bronze: { name: 'Bronze', thaiName: 'บรอนซ์', minCredits: 0, color: '#CD7F32', icon: '🥉' },
    silver: { name: 'Silver', thaiName: 'ซิลเวอร์', minCredits: 100, color: '#C0C0C0', icon: '🥈' },
    gold: { name: 'Gold', thaiName: 'โกลด์', minCredits: 500, color: '#FFD700', icon: '🥇' },
    diamond: { name: 'Diamond', thaiName: 'ไดมอนด์', minCredits: 1000, color: '#B9F2FF', icon: '💎' }
};

/**
 * Get zodiac sign from birthdate
 * @param {Date|string} birthdate - Birthday date
 * @returns {object} Zodiac data object
 */
export const getZodiacFromDate = (birthdate) => {
    if (!birthdate) return null;

    const date = new Date(birthdate);
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    for (const [key, zodiac] of Object.entries(ZODIAC_DATA)) {
        const { startMonth, startDay, endMonth, endDay } = zodiac.dateRange;

        // Handle year wrap (Capricorn: Dec 22 - Jan 19)
        if (startMonth > endMonth) {
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)) {
                return { key, ...zodiac };
            }
        } else {
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                (month > startMonth && month < endMonth)) {
                return { key, ...zodiac };
            }
        }
    }

    return null;
};

/**
 * Get element from zodiac sign
 * @param {string} zodiacKey - Zodiac key (e.g., 'aries')
 * @returns {object} Element info
 */
export const getElementFromZodiac = (zodiacKey) => {
    const zodiac = ZODIAC_DATA[zodiacKey];
    if (!zodiac) return null;

    return {
        name: zodiac.element,
        emoji: zodiac.elementEmoji
    };
};

/**
 * Calculate lucky numbers from birthdate
 * @param {Date|string} birthdate - Birthday date
 * @returns {object} Lucky numbers object
 */
export const getLuckyNumbers = (birthdate) => {
    if (!birthdate) return { single: 0, double: '00' };

    const date = new Date(birthdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Single lucky number (sum of birth date digits reduced to 1-9)
    let sum = day + month + (year % 100);
    while (sum > 9) {
        sum = String(sum).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    // Double lucky number
    const double = String((day * month) % 100).padStart(2, '0');

    return { single: sum, double };
};

/**
 * Get member level from credits
 * @param {number} credits - User credits
 * @returns {object} Member level info
 */
export const getMemberLevel = (credits = 0) => {
    if (credits >= MEMBER_LEVELS.diamond.minCredits) {
        return { key: 'diamond', ...MEMBER_LEVELS.diamond };
    } else if (credits >= MEMBER_LEVELS.gold.minCredits) {
        return { key: 'gold', ...MEMBER_LEVELS.gold };
    } else if (credits >= MEMBER_LEVELS.silver.minCredits) {
        return { key: 'silver', ...MEMBER_LEVELS.silver };
    }
    return { key: 'bronze', ...MEMBER_LEVELS.bronze };
};

/**
 * Generate card number from user ID
 * @param {string} userId - User UUID
 * @returns {string} Formatted card number
 */
export const generateCardNumber = (userId) => {
    if (!userId) return 'XXXX-XXXX-XXXX';

    // Take first 12 characters of UUID and format
    const clean = userId.replace(/-/g, '').toUpperCase().slice(0, 12);
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
};

/**
 * Get card expiry date (1 year from issue)
 * @param {Date} issueDate - Date card was issued
 * @returns {string} Expiry date string
 */
export const getCardExpiry = (issueDate = new Date()) => {
    const expiry = new Date(issueDate);
    expiry.setFullYear(expiry.getFullYear() + 1);

    const month = String(expiry.getMonth() + 1).padStart(2, '0');
    const year = String(expiry.getFullYear()).slice(-2);

    return `${month}/${year}`;
};

/**
 * Format Thai date
 * @param {Date|string} date - Date to format
 * @returns {string} Thai formatted date
 */
export const formatThaiDate = (date) => {
    if (!date) return '-';

    const d = new Date(date);
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543; // Buddhist Era

    return `${day} ${month} ${year}`;
};

export { ZODIAC_DATA, MEMBER_LEVELS };
