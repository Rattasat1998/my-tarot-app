/**
 * Thai Lunar Calendar Utilities
 * Focuses on calculating Thai lunar dates (Waxing/Waning phases)
 */

export const getThaiLunarDate = (date) => {
    // This is a simplified calculation for Thai Lunar dates.
    // For a fully accurate calculation, complex astronomical algorithms are needed.
    // This logic approximates the cycle for demonstration purposes.

    // Day 1 of waxing in lunar calendar is roughly 29.53 days cycle
    // We'll base this on a known reference point.
    // Reference: Buddhist Holy Day (Wan Phra) often lands on 8th or 15th of Waxing/Waning phases.

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    // This is a placeholder for the actual complex logic.
    // In a real app, you'd use a dedicated Thai Lunar algorithm.
    // Let's mock the return structure:
    const phase = (day % 15) + 1;
    const isWaxing = Math.floor(day / 15) % 2 === 0;
    const lunarMonth = month + 2; // Lunar months are ahead of solar months

    return {
        phase: `${isWaxing ? 'ขึ้น' : 'แรม'} ${phase} ค่ำ`,
        month: `เดือน ${lunarMonth}`,
        isWanPhra: phase === 8 || phase === 15
    };
};

export const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
};

export const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
