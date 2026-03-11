import { getNextDrawDate, formatThaiDrawLabel } from '../utils/lottoDateUtils';

export const LOTTO_DRAWS = [
    {
        id: 'mar-16-2026',
        date: '2026-03-16',
        label: 'งวด 16 มีนาคม 2569',
        kpi: {
            historical: '64',
            sources: '6, 4',
            trending: '29'
        },
        historical: {
            labels: ['64', '46', '29', '92', '13'],
            data: [4, 3, 2, 2, 1],
            context: 'สถิติย้อนหลัง 22 ปี งวด 16 มี.ค.'
        },
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขครึ่งเดือน',
                color: 'green',
                numbers: ['6', '4', '9', '2', '1']
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขดาวอังคาร',
                color: 'pink',
                numbers: ['4', '6', '3', '7', '0']
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขฤกษ์ดี',
                color: 'blue',
                numbers: ['6', '4', '8', '2', '5']
            }
        ],
        trends: {
            labels: ['เลขชนสำนัก (64/46)', 'เลขกระแสข่าว (29)', 'เลขฤกษ์ดี (13)', 'อื่นๆ'],
            data: [42, 28, 20, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขชนสำนัก (64, 46)', rank: 1 },
                { label: '📱 เลขกระแสข่าวโซเชียล (29, 92)', rank: 2 },
                { label: '✨ เลขฤกษ์ดีครึ่งเดือน (13, 31)', rank: 3 }
            ]
        },
        luckyPool: [
            '64', '64', '64',
            '46', '29', '92', '13',
            '31', '69', '96',
            '24', '42', '06'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '64', reason: 'ออกซ้ำมากที่สุดในสถิติงวด 16 มี.ค.' },
                    { num: '46', reason: 'กลับเลขของตัวเด่นที่มีการปรากฏถี่' },
                    { num: '29', reason: 'เลขเด่นกลุ่มรองจากฐานข้อมูลย้อนหลัง' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '329', reason: 'เลขกระแสข่าวที่ถูกพูดถึงสูงในสัปดาห์นี้' },
                    { num: '64', reason: 'เลขวันสำคัญและเลขมงคลชนสำนัก' },
                    { num: '13', reason: 'เลขฤกษ์ดีช่วงครึ่งเดือนหลัง' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '6', reason: 'ชนกันจาก 3 สำนักหลักและสถิติย่อย' },
                    { num: '4', reason: 'ยืนยันจากชุดเลขเด่นรายวันหลายแหล่ง' },
                    { num: '64', reason: 'เลขคู่ที่ถูกย้ำมากที่สุดในรอบนี้' }
                ]
            },
            finalPicks: {
                twoDigit: ['64', '46', '29', '92', '13', '31'],
                threeDigit: ['329', '964', '642', '413', '246']
            }
        }
    },
    {
        id: 'mar-1-2026',
        date: '2026-03-01',
        label: 'งวด 1 มีนาคม 2569',
        kpi: {
            historical: '36',
            sources: '3, 7',
            trending: '19'
        },
        historical: {
            labels: ['36', '19', '73', '50', '42'],
            data: [4, 3, 2, 2, 1],
            context: 'สถิติย้อนหลัง 22 ปี งวด 1 มี.ค.'
        },
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขมงคลต้นเดือน',
                color: 'green',
                numbers: ['3', '7', '6', '1', '9']
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขดาวพฤหัส',
                color: 'pink',
                numbers: ['7', '3', '5', '0', '2']
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขวันเสาร์',
                color: 'blue',
                numbers: ['3', '6', '9', '1', '4']
            }
        ],
        trends: {
            labels: ['เลขมงคลมี.ค. (36/63)', 'เลขวันมาฆบูชา (19)', 'เลขดาวพฤหัส (73)', 'อื่นๆ'],
            data: [40, 30, 20, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขมงคลประจำเดือน มี.ค. (36, 63)', rank: 1 },
                { label: '🙏 เลขวันมาฆบูชา (19, 91)', rank: 2 },
                { label: '⭐ เลขดาวพฤหัสครองเรือน (73, 37)', rank: 3 }
            ]
        },
        luckyPool: [
            '36', '36', '36',
            '19', '91', '37', '73',
            '63', '50', '42',
            '07', '03', '69'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '36', reason: 'ออกซ้ำมากที่สุดในประวัติศาสตร์ 1 มี.ค.' },
                    { num: '19', reason: 'ออกบ่อยอันดับ 2 ในงวดวันเสาร์' },
                    { num: '73', reason: 'เลขเด่นสูงสุดเดือนมีนาคม' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '193', reason: 'วันมาฆบูชา 2569 - เลขแรงประจำงวด' },
                    { num: '37', reason: 'เลขรหัสภาค ข่าวดังประจำสัปดาห์' },
                    { num: '69', reason: 'เลขดังโซเชียล - กระแส TikTok' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '3', reason: 'ชนกันใน 4 สำนักดัง + สถิติเสาร์' },
                    { num: '7', reason: 'ยืนยันจากเจ๊ฟองเบียร์และหมอปลาย' },
                    { num: '36', reason: 'แม่น้ำหนึ่ง + อ.เดช + ปฏิทินจีน' }
                ]
            },
            finalPicks: {
                twoDigit: ['36', '19', '73', '37', '63', '07'],
                threeDigit: ['193', '369', '736', '319', '073']
            }
        }
    },
    {
        id: 'feb-1-2026',
        date: '2026-02-01',
        label: 'งวด 1 กุมภาพันธ์ 2569',
        kpi: {
            historical: '53',
            sources: '1, 4',
            trending: '67'
        },
        historical: {
            labels: ['53', '85', '92', '98', '88'],
            data: [3, 2, 2, 2, 1],
            context: 'สถิติย้อนหลัง 10 ปี'
        },
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขทิศเหนือ',
                color: 'green',
                numbers: ['1', '4', '8', '3', '2']
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขวัน',
                color: 'pink',
                numbers: ['4', '5', '1', '6', '9']
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขมงคล',
                color: 'blue',
                numbers: ['1', '4', '7', '0', '5']
            }
        ],
        trends: {
            labels: ['เลขปี (67/24)', 'เลขตรุษจีน (08/10)', 'เลขทะเบียน (30)', 'อื่นๆ'],
            data: [45, 30, 15, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขปีพ.ศ. (67, 24)', rank: 1 },
                { label: '🧧 เลขวันตรุษจีน (08, 10)', rank: 2 },
                { label: '🚗 เลขทะเบียนรถ (30, 03)', rank: 3 }
            ]
        },
        luckyPool: [
            '53', '53', '53',
            '14', '41', '15', '51',
            '67', '24', '08',
            '92', '85', '30'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '09', reason: 'ออกซ้ำบ่อยที่สุดในประวัติศาสตร์ 1 ก.พ.' },
                    { num: '06', reason: 'ออกบ่อยที่สุดในงวดวันอาทิตย์' },
                    { num: '04', reason: 'ออกบ่อยอันดับ 2 ในวันอาทิตย์' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '411', reason: 'เครื่องบินตกจอมทอง - เลขแรงสุด' },
                    { num: '41', reason: 'รหัสเครื่องบิน' },
                    { num: '08', reason: 'วันเลือกตั้ง 8 ก.พ.' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '4', reason: 'ยืนยันจากเจ๊ฟองเบียร์และแม่น้ำหนึ่ง' },
                    { num: '1', reason: 'ชนกันใน 3 สำนักใหญ่ + สถิติอาทิตย์' },
                    { num: '05', reason: 'น้องเพชรกล้า + ปฏิทินจีน' }
                ]
            },
            finalPicks: {
                twoDigit: ['41', '09', '14', '28', '06', '58'],
                threeDigit: ['107', '411', '345', '611', '546']
            }
        }
    },
    {
        id: 'jan-16-2026',
        date: '2026-01-16',
        label: 'งวด 16 มกราคม 2569',
        isUpcoming: false,
        result: {
            first: '835492',
            lastTwo: '17',
            lastThree: ['492', '835']
        },
        kpi: {
            historical: '17',
            sources: '8, 3',
            trending: '92'
        }
    }
];

export const getUpcomingDraw = () => {
    const today = new Date().toISOString().split('T')[0];
    // Find first draw with date >= today
    const upcoming = LOTTO_DRAWS
        .filter(d => d.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];

    if (upcoming) return upcoming;

    // Auto-generate if no matching draw
    const nextDate = getNextDrawDate();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return {
        id: `${months[nextDate.getMonth()]}-${nextDate.getDate()}-${nextDate.getFullYear()}`,
        date: nextDate.toISOString().split('T')[0],
        label: formatThaiDrawLabel(nextDate),
        kpi: null
    };
};

export const getPastDraws = () => {
    const today = new Date().toISOString().split('T')[0];
    return LOTTO_DRAWS
        .filter(d => d.date < today)
        .sort((a, b) => b.date.localeCompare(a.date));
};

export const generateLuckyNumber = (pool) => {
    const luckyPool = pool || getUpcomingDraw()?.luckyPool || ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    return luckyPool[Math.floor(Math.random() * luckyPool.length)];
};
