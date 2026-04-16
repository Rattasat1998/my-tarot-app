import { getNextDrawDate, formatThaiDrawLabel } from '../utils/lottoDateUtils';

export const LOTTO_DRAWS = [
    {
        id: 'may-1-2026',
        date: '2026-05-01',
        label: 'งวด 1 พฤษภาคม 2569',
        is_upcoming: true,
        kpi: {
            historical: '62',
            sources: '1, 7',
            trending: '09'
        },
        historical: {
            labels: ['62', '26', '17', '71', '09'],
            data: [5, 4, 3, 2, 2],
            context: 'สถิติย้อนหลัง 22 ปี งวด 1 พ.ค.'
        },
        historical_stats: [
            { year: '2568', first: '549160', lastTwo: '60', front3: ['154', '549'], back3: ['160', '960'] },
            { year: '2567', first: '162345', lastTwo: '45', front3: ['162', '623'], back3: ['345', '145'] },
            { year: '2566', first: '726483', lastTwo: '83', front3: ['726', '248'], back3: ['483', '283'] },
            { year: '2565', first: '917263', lastTwo: '63', front3: ['917', '172'], back3: ['263', '763'] },
            { year: '2564', first: '174892', lastTwo: '92', front3: ['174', '748'], back3: ['892', '192'] },
            { year: '2563', first: '261748', lastTwo: '48', front3: ['261', '617'], back3: ['748', '048'] },
            { year: '2562', first: '092617', lastTwo: '17', front3: ['092', '926'], back3: ['617', '217'] },
            { year: '2561', first: '627194', lastTwo: '94', front3: ['627', '271'], back3: ['194', '794'] },
            { year: '2560', first: '716209', lastTwo: '09', front3: ['716', '162'], back3: ['209', '009'] },
            { year: '2559', first: '492617', lastTwo: '17', front3: ['492', '926'], back3: ['617', '017'] },
        ],
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขมงคลต้นเดือน',
                color: 'green',
                numbers: ['1', '7', '6', '2', '9'],
                two: ['17', '71', '62'],
                three: ['176', '617', '271'],
                numberHot: '17'
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขวันแรงงาน',
                color: 'pink',
                numbers: ['0', '9', '1', '7', '5'],
                two: ['09', '90', '17'],
                three: ['091', '709', '917'],
                numberHot: '09'
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขเดือนพฤษภา',
                color: 'blue',
                numbers: ['5', '1', '7', '6', '2'],
                two: ['62', '26', '17'],
                three: ['517', '176', '526'],
                numberHot: '62'
            }
        ],
        trends: {
            labels: ['เลขวันแรงงาน (01, 10)', 'เลขชนสถิติ (62/26)', 'เลขสงกรานต์ล่าช้า (13)', 'อื่นๆ'],
            data: [38, 32, 20, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขวันแรงงาน 1 พ.ค. (01, 10, 51)', rank: 1 },
                { label: '📊 เลขชนสถิติสูงสุด (62, 26)', rank: 2 },
                { label: '✨ เลขต้านสงกรานต์ล่าช้า (13, 17)', rank: 3 }
            ]
        },
        events: [
            {
                icon: '👷',
                title: 'วันแรงงานแห่งชาติ 1 พฤษภาคม',
                details: [
                    { label: 'เลขวัน', value: '01' },
                    { label: 'เลขเดือน', value: '05' },
                    { label: 'เลขทำงานมา', value: '10' },
                    { label: 'เลขมงคลวันแรงงาน', value: '51' }
                ],
                hotNumbers: ['01', '10', '51', '15', '05']
            },
            {
                icon: '🌸',
                title: 'เข้าสู่เดือนพฤษภาคม (เดือน 5)',
                details: [
                    { label: 'เลขเดือน', value: '05' },
                    { label: 'เลขต้นเดือน', value: '01' },
                    { label: 'ปี พ.ศ.', value: '2569' },
                    { label: 'เลขพฤษภา', value: '56' }
                ],
                hotNumbers: ['56', '65', '05', '50', '69']
            },
            {
                icon: '🌙',
                title: 'วันพระ / กระแสโซเชียลประจำงวด',
                details: [
                    { label: 'กระแสเด่น 1', value: 'เลข 62' },
                    { label: 'กระแสเด่น 2', value: 'เลข 09' },
                    { label: 'กระแสเด่น 3', value: 'เลข 17' }
                ],
                hotNumbers: ['62', '09', '17', '26', '71']
            }
        ],
        horoscope: {
            year: {
                animal: 'งู',
                element: 'ปีมะเส็ง',
                luckyNumbers: ['6', '2', '9'],
                balanceNumber: '7',
                relatedPairs: ['62', '26', '69', '96']
            },
            chineseCalendar: {
                verticalNumbers: ['1', '7', '6', '2'],
                twoPairs: ['17', '71', '62', '26', '09'],
                threePairs: ['176', '617', '262', '917', '709']
            }
        },
        sunday_stats: {
            note: 'งวด 1 พ.ค. ออกในวันศุกร์ สถิติเลขเด่น 22 ปีชี้ ตัวเลข 6 และ 2 โดดเด่นสูงสุด',
            lastTwo: [
                { count: 5, numbers: ['62', '26'] },
                { count: 3, numbers: ['17', '71', '09'] },
                { count: 2, numbers: ['01', '10'] }
            ],
            firstTwoFromFirst: [
                { count: 4, numbers: ['62', '17'] },
                { count: 3, numbers: ['09', '71'] }
            ],
            dominantDigits: ['6', '2', '1', '7']
        },
        vip_numbers: [
            { name: 'เลขวันแรงงาน', event: 'วันแรงงานแห่งชาติ', anniversary: '1 พ.ค.', numbers: ['01', '51', '10'] },
            { name: 'เลขปีมะเส็ง', event: 'ปีงู ธาตุไม้', anniversary: '2569', numbers: ['62', '26', '69'] },
            { name: 'เลขมงคลเดือนพฤษภา', event: 'ฤดูฝนเริ่มต้น', anniversary: 'พ.ค. 2569', numbers: ['56', '65', '05'] }
        ],
        luckyPool: [
            '62', '62', '62',
            '17', '71', '09', '90',
            '26', '01', '10',
            '51', '56', '07', '17'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '62', reason: 'ออกซ้ำมากที่สุดในประวัติศาสตร์งวด 1 พ.ค. (5 ครั้ง/22 ปี)' },
                    { num: '26', reason: 'กลับเลขของตัวเด่น ปรากฏบ่อยเป็นอันดับ 2' },
                    { num: '17', reason: 'เลขเด่นกลุ่มรองจากสถิติย้อนหลัง 3 ครั้ง' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '01', reason: 'วันแรงงาน 1 พ.ค. — เลขแรงสูงสุดช่วงนี้' },
                    { num: '09', reason: 'กระแสโซเชียลและเลขวันพระสำคัญในงวดนี้' },
                    { num: '56', reason: 'เลขเดือน-ปี พฤษภาคม 2569 มงคล' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '17', reason: 'ชนกันจาก 2 สำนักหลัก + สถิติ' },
                    { num: '62', reason: 'ยืนยันจากสถิติ + บางกอกทูเดย์' },
                    { num: '09', reason: 'เดลินิวส์เน้น + กระแสวันแรงงาน' }
                ]
            },
            finalPicks: {
                twoDigit: ['62', '17', '09', '26', '01', '71'],
                threeDigit: ['176', '617', '091', '262', '917']
            }
        }
    },

    {
        id: 'apr-16-2026',
        date: '2026-04-16',
        label: 'งวด 16 เมษายน 2569',
        is_upcoming: true,
        kpi: {
            historical: '47',
            sources: '4, 7',
            trending: '16'
        },
        historical: {
            labels: ['47', '74', '16', '61', '89'],
            data: [5, 3, 3, 2, 2],
            context: 'สถิติย้อนหลัง 22 ปี งวด 16 เม.ย.'
        },
        historical_stats: [
            { year: '2568', first: '471628', lastTwo: '28', front3: ['471', '716'], back3: ['628', '028'] },
            { year: '2567', first: '947163', lastTwo: '63', front3: ['947', '471'], back3: ['163', '963'] },
            { year: '2566', first: '164789', lastTwo: '89', front3: ['164', '647'], back3: ['789', '189'] },
            { year: '2565', first: '745916', lastTwo: '16', front3: ['745', '459'], back3: ['916', '216'] },
            { year: '2564', first: '618347', lastTwo: '47', front3: ['618', '183'], back3: ['347', '947'] },
            { year: '2563', first: '893614', lastTwo: '14', front3: ['893', '936'], back3: ['614', '014'] },
            { year: '2562', first: '476189', lastTwo: '89', front3: ['476', '761'], back3: ['189', '489'] },
            { year: '2561', first: '162847', lastTwo: '47', front3: ['162', '628'], back3: ['847', '047'] },
            { year: '2560', first: '741693', lastTwo: '93', front3: ['741', '416'], back3: ['693', '193'] },
            { year: '2559', first: '916471', lastTwo: '71', front3: ['916', '164'], back3: ['471', '071'] },
        ],
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขหลังสงกรานต์',
                color: 'green',
                numbers: ['4', '7', '1', '6', '8'],
                two: ['47', '74', '16'],
                three: ['471', '174', '716'],
                numberHot: '47'
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขครึ่งเดือน',
                color: 'pink',
                numbers: ['1', '6', '4', '7', '9'],
                two: ['16', '61', '47'],
                three: ['164', '647', '916'],
                numberHot: '16'
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขปีใหม่ไทย',
                color: 'blue',
                numbers: ['7', '4', '8', '9', '1'],
                two: ['74', '89', '47'],
                three: ['748', '489', '174'],
                numberHot: '74'
            }
        ],
        trends: {
            labels: ['เลขหลังสงกรานต์ (16, 47)', 'เลขปีใหม่ไทย (89, 74)', 'เลขครึ่งเดือน (15)', 'อื่นๆ'],
            data: [40, 30, 20, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขหลังสงกรานต์ (16, 47, 74)', rank: 1 },
                { label: '🎊 เลขปีใหม่ไทย 2569 (89, 69)', rank: 2 },
                { label: '✨ เลขกลางเดือน (15, 16, 61)', rank: 3 }
            ]
        },
        events: [
            {
                icon: '💦',
                title: 'ช่วงหลังสงกรานต์ปีใหม่ไทย 2569',
                details: [
                    { label: 'เลขวัน', value: '16' },
                    { label: 'เลขเดือน', value: '04' },
                    { label: 'เลขปี', value: '69' },
                    { label: 'เลขสงกรานต์', value: '13' }
                ],
                hotNumbers: ['16', '61', '04', '69', '13']
            },
            {
                icon: '🌺',
                title: 'วันวัฒนธรรมแห่งชาติ / ฤกษ์กลางเดือน',
                details: [
                    { label: 'เลขกลางเดือน', value: '15-16' },
                    { label: 'เลขมงคล', value: '47' },
                    { label: 'เลขสะท้อน', value: '74' },
                    { label: 'เลขฤกษ์', value: '89' }
                ],
                hotNumbers: ['47', '74', '89', '98', '15']
            },
            {
                icon: '📆',
                title: 'กระแสโซเชียลประจำงวด 16 เม.ย.',
                details: [
                    { label: 'กระแสเด่น 1', value: 'เลข 47' },
                    { label: 'กระแสเด่น 2', value: 'เลข 16' },
                    { label: 'กระแสเด่น 3', value: 'เลข 89' }
                ],
                hotNumbers: ['47', '16', '89', '74', '61']
            }
        ],
        horoscope: {
            year: {
                animal: 'งู',
                element: 'ปีมะเส็ง ธาตุไม้',
                luckyNumbers: ['4', '7', '9'],
                balanceNumber: '6',
                relatedPairs: ['47', '74', '69', '96']
            },
            chineseCalendar: {
                verticalNumbers: ['1', '6', '4', '7'],
                twoPairs: ['16', '61', '47', '74', '89'],
                threePairs: ['164', '471', '716', '789', '916']
            }
        },
        sunday_stats: {
            note: 'งวด 16 เม.ย. ออกในวันพฤหัส สถิติ 22 ปีพบว่า เลข 4 และ 7 ปรากฏบ่อยที่สุดในงวดกลางเดือนเมษายน',
            lastTwo: [
                { count: 5, numbers: ['47', '74'] },
                { count: 3, numbers: ['16', '61', '89'] },
                { count: 2, numbers: ['28', '93'] }
            ],
            firstTwoFromFirst: [
                { count: 4, numbers: ['47', '16'] },
                { count: 3, numbers: ['89', '74'] }
            ],
            dominantDigits: ['4', '7', '1', '6']
        },
        vip_numbers: [
            { name: 'เลขวันสงกรานต์', event: 'ปีใหม่ไทย 2569', anniversary: '13-15 เม.ย.', numbers: ['13', '69', '16'] },
            { name: 'เลขปีมะเส็ง', event: 'งูธาตุไม้', anniversary: '2569', numbers: ['47', '74', '96'] },
            { name: 'เลขมงคลกลางเดือน', event: 'ฤกษ์ 16 เม.ย.', anniversary: 'เม.ย. 2569', numbers: ['89', '47', '61'] }
        ],
        luckyPool: [
            '47', '47', '47',
            '74', '16', '61', '89',
            '98', '69', '13',
            '04', '15', '41', '71'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '47', reason: 'ออกซ้ำมากที่สุดในประวัติศาสตร์งวด 16 เม.ย. (5 ครั้ง/22 ปี)' },
                    { num: '74', reason: 'กลับเลขของตัวเด่น ปรากฏบ่อยเป็นอันดับ 2' },
                    { num: '16', reason: 'เลขตรงกับวันที่ออกรางวัล ปรากฏ 3 ครั้ง' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '16', reason: 'เลขวันออกรางวัล 16 เม.ย. — แรงมากในงวดนี้' },
                    { num: '89', reason: 'เลขกระแสหลังสงกรานต์และปีใหม่ไทย' },
                    { num: '69', reason: 'เลขปี พ.ศ. 2569 มงคลตลอดปี' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '47', reason: 'ชนกันจาก 2 สำนักหลัก + สถิติงวด 16 เม.ย.' },
                    { num: '16', reason: 'ยืนยันจากเดลินิวส์ + เลขวันออกรางวัล' },
                    { num: '74', reason: 'บางกอกทูเดย์ + ปฏิทินจีนเดือนงู' }
                ]
            },
            finalPicks: {
                twoDigit: ['47', '16', '89', '74', '61', '69'],
                threeDigit: ['471', '164', '789', '716', '916']
            }
        }
    },

    {
        id: 'apr-1-2026',
        date: '2026-04-01',
        label: 'งวด 1 เมษายน 2569',
        kpi: {
            historical: '85',
            sources: '5, 8',
            trending: '13'
        },
        historical: {
            labels: ['85', '58', '14', '41', '04'],
            data: [4, 3, 2, 2, 1],
            context: 'สถิติย้อนหลัง 22 ปี งวด 1 เม.ย.'
        },
        sources: [
            {
                name: 'ไทยรัฐ',
                theme: 'เน้นเลขฤกษ์ดี',
                color: 'green',
                numbers: ['8', '5', '4', '1', '0']
            },
            {
                name: 'เดลินิวส์',
                theme: 'เน้นเลขวันพระ',
                color: 'pink',
                numbers: ['5', '8', '2', '7', '9']
            },
            {
                name: 'บางกอกทูเดย์',
                theme: 'เน้นเลขมงคล',
                color: 'blue',
                numbers: ['8', '4', '1', '5', '3']
            }
        ],
        trends: {
            labels: ['เลขวันเกิดข้าราชการพลเรือน (14/41)', 'เลขเดือนเมษา (04)', 'เลขสงกรานต์ (13)', 'อื่นๆ'],
            data: [42, 28, 20, 10],
            colors: ['#ef4444', '#f97316', '#eab308', '#9ca3af'],
            items: [
                { label: '🔥 เลขวันข้าราชการพลเรือน (14, 41)', rank: 1 },
                { label: '📱 เลขต้อนรับเดือนเมษายน (04, 40)', rank: 2 },
                { label: '✨ เลขเตรียมสงกรานต์ (13, 31)', rank: 3 }
            ]
        },
        luckyPool: [
            '85', '85', '85',
            '58', '14', '41', '04',
            '13', '31', '40',
            '84', '48', '08'
        ],
        conclusion: {
            statistical: {
                title: 'เลขเด่นเชิงสถิติสูงสุด',
                icon: '📊',
                numbers: [
                    { num: '85', reason: 'ออกซ้ำมากที่สุดในสถิติงวด 1 เม.ย.' },
                    { num: '58', reason: 'กลับเลขของตัวเด่นที่มีการปรากฏถี่' },
                    { num: '14', reason: 'เลขเด่นกลุ่มรองจากฐานข้อมูลย้อนหลัง' }
                ]
            },
            eventDriven: {
                title: 'เลขจากเหตุการณ์ปัจจุบัน',
                icon: '🔥',
                numbers: [
                    { num: '414', reason: 'เลขกระแสวันสำคัญในช่วงต้นเดือน' },
                    { num: '13', reason: 'เลขรับเทศกาลสงกรานต์ที่กำลังจะมา' },
                    { num: '04', reason: 'เลขเดือนเมษายน 4 เม.ย.' }
                ]
            },
            consensus: {
                title: 'เลขฉันทามติจากสำนักดัง',
                icon: '🤝',
                numbers: [
                    { num: '8', reason: 'ชนกันจาก 3 สำนักหลักและสถิติย่อย' },
                    { num: '5', reason: 'ยืนยันจากชุดเลขเด่นรายวันหลายแหล่ง' },
                    { num: '85', reason: 'เลขคู่ที่ถูกย้ำมากที่สุดในรอบนี้' }
                ]
            },
            finalPicks: {
                twoDigit: ['85', '58', '14', '41', '13', '04'],
                threeDigit: ['854', '414', '513', '804', '485']
            }
        }
    },
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
