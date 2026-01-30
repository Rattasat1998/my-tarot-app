// Lotto data for analysis and lucky number generation

export const LOTTO_DRAWS = [
    {
        id: 'feb-1-2026',
        date: '2026-02-01',
        label: 'งวด 1 กุมภาพันธ์ 2569',
        isUpcoming: true,
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
        ]
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

export const getUpcomingDraw = () => LOTTO_DRAWS.find(d => d.isUpcoming);
export const getPastDraws = () => LOTTO_DRAWS.filter(d => !d.isUpcoming);

export const generateLuckyNumber = (pool) => {
    const luckyPool = pool || getUpcomingDraw()?.luckyPool || ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    return luckyPool[Math.floor(Math.random() * luckyPool.length)];
};
