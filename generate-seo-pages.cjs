const fs = require('fs-extra');
const path = require('path');

const BASE_URL = 'https://satduangdao.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const SEO_ROUTES = [
    {
        route: '/zodiac',
        title: 'ดูดวงราศี 12 ราศี ประจำวัน',
        description: 'ดูดวง 12 ราศีประจำวันฟรี ดูดวงความรัก การงาน การเงิน สุขภาพ จัดกลุ่มตามธาตุ ไฟ ดิน ลม น้ำ เลือกราศีเพื่อรับคำทำนายแม่นๆ',
    },
    {
        route: '/lotto',
        title: 'วิเคราะห์หวย สถิติย้อนหลัง',
        description: 'วิเคราะห์หวยรัฐบาล สถิติย้อนหลัง 22 ปี แนวทางจากสำนักดัง กระแสเลขเด็ดโซเชียล เลขมงคล สรุปเลขเด่นประจำงวด พร้อมระบบสุ่มเลขนำโชค',
        ogImage: `${BASE_URL}/lotto-hero.png`,
    },
    {
        route: '/lotto/check',
        title: 'ตรวจหวยรัฐบาล งวดล่าสุด',
        description: 'ตรวจหวยรัฐบาลออนไลน์ ผลสลากกินแบ่งรัฐบาลงวดล่าสุด ตรวจได้ทุกงวด รางวัลที่ 1 เลขท้าย 2 ตัว เลขหน้า 3 ตัว เลขท้าย 3 ตัว ครบทุกรางวัล พร้อมย้อนหลัง',
        ogImage: `${BASE_URL}/lotto-hero.png`,
    },
    {
        route: '/soulmate',
        title: 'เช็คดวงเนื้อคู่ ทำนายคู่ครอง',
        description: 'ทำนายเนื้อคู่จากดวงชะตา เช็คสมพงษ์ตามราศีเกิดและวันเกิด ดูรูปร่าง นิสัย อาชีพ ช่วงเวลา และสถานที่ที่จะพบคู่แท้ ศาสตร์ธาตุ 4 กับความรัก',
    },
    {
        route: '/runes',
        title: 'ดูดวงรูนโบราณ Elder Futhark',
        description: 'ดูดวงรูนโบราณ Elder Futhark 24 ตัว สุ่มรูน 1, 3, 5 ก้อน ทำนายดวงชะตาด้วยศาสตร์ไวกิ้ง พร้อมความหมายเชิงลึกและคำแนะนำ',
        ogImage: `${BASE_URL}/rune-hero.png`,
    },
    {
        route: '/ceremony',
        title: 'ศาสนพิธีในพุทธศาสนาไทย',
        description: 'บทความเชิงลึกเกี่ยวกับศาสนพิธีในพุทธศาสนาไทย วิวัฒนาการจากรากฐานคัมภีร์สู่สังคมร่วมสมัย พิธีกรรมทำบุญ อุปสมบท ทอดกฐิน ลอยกระทง สัญลักษณ์ทางศาสนา',
    },
    {
        route: '/about',
        title: 'เกี่ยวกับเรา - ศาสตร์ดวงดาว',
        description: 'เรียนรู้เกี่ยวกับศาสตร์ดวงดาว แพลตฟอร์มดูดวงไพ่ทาโรต์ออนไลน์ที่ครบวงจร พร้อมติดต่อทีมงาน',
    },
    {
        route: '/faq',
        title: 'คำถามที่พบบ่อย (FAQ) - ศาสตร์ดวงดาว',
        description: 'คำถามที่พบบ่อยเกี่ยวกับการดูดวงไพ่ทาโรต์ออนไลน์ การใช้งาน เครดิต และฟีเจอร์ต่างๆ ของศาสตร์ดวงดาว',
    },
    {
        route: '/horoscope-2569',
        title: 'ดูดวงราศี 12 ราศี ปี 2569 แม่นที่สุด',
        description: 'พยากรณ์ดวงชะตา 12 ราศี ประจำปี 2569 วิเคราะห์อิทธิพลดาวประธาน สีมงคลประจำวัน เลขนำโชคตามปีนักษัตร พร้อมพยากรณ์รายเดือน การเงิน ความรัก สุขภาพ',
    },
    {
        route: '/ancient-runes',
        title: 'รูนโบราณ Elder Futhark: อักษรศักดิ์สิทธิ์จากนอร์ส',
        description: 'เรียนรู้รูนโบราณ Elder Futhark 24 ตัว ต้นกำเนิดจากยุคไวกิ้ง ตำนานโอดิน ระบบ 3 Ættir โบราณวัตถุทางรูน กวีนิพนธ์รูน กัลดร์ และการฟื้นฟูในยุคปัจจุบัน',
        ogImage: `${BASE_URL}/rune-hero.png`,
    },
    {
        route: '/numerology-article',
        title: 'เลขศาสตร์: ศาสตร์แห่งตัวเลขจากทั่วโลก',
        description: 'เจาะลึกเลขศาสตร์ 4 ระบบโลก คาลเดียน พีทาโกรัส คับบาลาห์ จีน ความหมายเลข 1-9 Master Numbers เลขศาสตร์ไทย ตารางอักษรไทย ทะเบียนรถมงคล บ้านเลขที่มงคล',
        ogImage: `${BASE_URL}/numerology-hero.png`,
    },
    {
        route: '/feng-shui-article',
        title: 'ฮวงจุ้ย: ศาสตร์จัดวางตำแหน่งเพื่อชีวิตที่ดี',
        description: 'คู่มือฮวงจุ้ยฉบับสมบูรณ์ หยิน-หยาง ธาตุทั้ง 5 สำนักรูปทรง สำนักเข็มทิศ การเลือกที่ดิน จัดบ้าน เลขกั้ว กรณีศึกษา HSBC Apple Store ยุคที่ 9 กระจก สัตว์มงคล',
        ogImage: `${BASE_URL}/fengshui-hero.png`,
    },
    {
        route: '/palmistry-article',
        title: 'ศาสตร์ลายมือ: หัตถศาสตร์เชิงบูรณาการ',
        description: 'เรียนรู้ศาสตร์ลายมือครบทุกมิติ ประวัติศาสตร์ ประเภทมือตามธาตุ เนินฝ่ามือ 7 เนิน เส้นหลัก 4 เส้น เครื่องหมายพิเศษ หัตถศาสตร์ไทย ติตถิวิทยา AI กับอนาคตลายมือ',
        ogImage: `${BASE_URL}/palmistry-hero.png`,
    },
    {
        route: '/daily-oracle',
        title: 'Daily Oracle - คำทำนายดวงชะตาประจำวัน',
        description: 'ดูดวงประจำวันแบบ interactive พร้อมสีมงคล คำแนะนำ และการวิเคราะห์จากดวงดาว',
    },
    {
        route: '/privacy-policy',
        title: 'นโยบายความเป็นส่วนตัว - ศาสตร์ดวงดาว',
        description: 'นโยบายความเป็นส่วนตัวของเว็บไซต์ดูดวงออนไลน์ศาสตร์ดวงดาว การจัดการข้อมูลส่วนบุคคล',
    },
    {
        route: '/terms-of-service',
        title: 'เงื่อนไขการใช้งาน - ศาสตร์ดวงดาว',
        description: 'เงื่อนไขและข้อกำหนดการใช้บริการเว็บไซต์ดูดวงออนไลน์ศาสตร์ดวงดาว',
    },
];

const replaceTag = (html, pattern, replacement) => (
    pattern.test(html) ? html.replace(pattern, replacement) : `${html}\n${replacement}`
);

const buildSeoHtml = (baseHtml, config) => {
    const routeUrl = `${BASE_URL}${config.route}`;
    const ogImage = config.ogImage || DEFAULT_OG_IMAGE;

    let nextHtml = baseHtml;

    nextHtml = replaceTag(nextHtml, /<title>.*?<\/title>/s, `<title>${config.title} | ศาสตร์ดวงดาว</title>`);
    nextHtml = replaceTag(nextHtml, /<meta name="title" content=".*?" ?\/?>/s, `<meta name="title" content="${config.title} | ศาสตร์ดวงดาว" />`);
    nextHtml = replaceTag(nextHtml, /<meta name="description" content=".*?" ?\/?>/s, `<meta name="description" content="${config.description}" />`);
    nextHtml = replaceTag(nextHtml, /<link rel="canonical" href=".*?" ?\/?>/s, `<link rel="canonical" href="${routeUrl}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="og:url" content=".*?" ?\/?>/s, `<meta property="og:url" content="${routeUrl}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="og:title" content=".*?" ?\/?>/s, `<meta property="og:title" content="${config.title} | ศาสตร์ดวงดาว" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="og:description" content=".*?" ?\/?>/s, `<meta property="og:description" content="${config.description}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="og:image" content=".*?" ?\/?>/s, `<meta property="og:image" content="${ogImage}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="twitter:url" content=".*?" ?\/?>/s, `<meta property="twitter:url" content="${routeUrl}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="twitter:title" content=".*?" ?\/?>/s, `<meta property="twitter:title" content="${config.title} | ศาสตร์ดวงดาว" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="twitter:description" content=".*?" ?\/?>/s, `<meta property="twitter:description" content="${config.description}" />`);
    nextHtml = replaceTag(nextHtml, /<meta property="twitter:image" content=".*?" ?\/?>/s, `<meta property="twitter:image" content="${ogImage}" />`);

    return nextHtml;
};

const generateSeoPages = async () => {
    try {
        const distDir = path.join(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');

        if (!await fs.pathExists(indexPath)) {
            console.error('dist/index.html not found. Make sure to run this script after `vite build`.');
            return;
        }

        const baseHtml = await fs.readFile(indexPath, 'utf-8');

        for (const routeConfig of SEO_ROUTES) {
            const routeDir = path.join(distDir, routeConfig.route.replace(/^\//, ''));
            await fs.ensureDir(routeDir);

            const outputPath = path.join(routeDir, 'index.html');
            const seoHtml = buildSeoHtml(baseHtml, routeConfig);

            await fs.writeFile(outputPath, seoHtml);
            console.log(`✅ SEO page generated: ${routeConfig.route} -> ${outputPath}`);
        }
    } catch (error) {
        console.error('Error generating SEO pages:', error);
        process.exitCode = 1;
    }
};

generateSeoPages();
