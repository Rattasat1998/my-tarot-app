// วันหยุดราชการและวันหยุดธนาคาร ปี พ.ศ. 2569 (ค.ศ. 2026)
export const THAI_HOLIDAYS_2026 = [
    { date: '2026-01-01', name: 'วันขึ้นปีใหม่', type: 'public' },
    { date: '2026-02-12', name: 'วันมาฆบูชา', type: 'buddhist' },
    { date: '2026-04-06', name: 'วันจักรี', type: 'public' },
    { date: '2026-04-13', name: 'วันสงกรานต์', type: 'public' },
    { date: '2026-04-14', name: 'วันสงกรานต์', type: 'public' },
    { date: '2026-04-15', name: 'วันสงกรานต์', type: 'public' },
    { date: '2026-05-01', name: 'วันแรงงานแห่งชาติ', type: 'public' },
    { date: '2026-05-04', name: 'วันฉัตรมงคล', type: 'public' },
    { date: '2026-05-11', name: 'วันวิสาขบูชา', type: 'buddhist' },
    { date: '2026-06-03', name: 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี', type: 'public' },
    { date: '2026-07-09', name: 'วันอาสาฬหบูชา', type: 'buddhist' },
    { date: '2026-07-10', name: 'วันเข้าพรรษา', type: 'buddhist' },
    { date: '2026-07-28', name: 'วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระเจ้าอยู่หัว ร.10', type: 'public' },
    { date: '2026-08-12', name: 'วันแม่แห่งชาติ', type: 'public' },
    { date: '2026-10-13', name: 'วันคล้ายวันสวรรคต ร.9', type: 'public' },
    { date: '2026-10-23', name: 'วันปิยมหาราช', type: 'public' },
    { date: '2026-12-05', name: 'วันพ่อแห่งชาติ', type: 'public' },
    { date: '2026-12-10', name: 'วันรัฐธรรมนูญ', type: 'public' },
    { date: '2026-12-31', name: 'วันสิ้นปี', type: 'public' },
];

// วันหยุดธนาคารเพิ่มเติม (นอกเหนือจากวันหยุดราชการ)
export const BANK_HOLIDAYS_2026 = [
    { date: '2026-07-01', name: 'วันหยุดกลางปีธนาคาร', type: 'bank' },
];

// รวมวันหยุดทั้งหมด
export const ALL_HOLIDAYS_2026 = [...THAI_HOLIDAYS_2026, ...BANK_HOLIDAYS_2026].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
);

// Helper function to check if a date is a holiday
export const isHoliday = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return ALL_HOLIDAYS_2026.find(h => h.date === dateStr);
};

// Get upcoming holidays
export const getUpcomingHolidays = (fromDate = new Date(), count = 5) => {
    const dateStr = fromDate.toISOString().split('T')[0];
    return ALL_HOLIDAYS_2026
        .filter(h => h.date >= dateStr)
        .slice(0, count);
};
