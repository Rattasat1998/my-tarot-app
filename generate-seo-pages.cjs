const fs = require('fs-extra');
const path = require('path');

const generateSeoPages = async () => {
    try {
        const distDir = path.join(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        
        // Ensure dist/index.html exists
        if (!await fs.pathExists(indexPath)) {
            console.error('dist/index.html not found. Make sure to run this script after `vite build`.');
            return;
        }

        // Read the base index.html
        let baseHtml = await fs.readFile(indexPath, 'utf-8');

        // Target directory for the lotto page
        const lottoDir = path.join(distDir, 'lotto');
        await fs.ensureDir(lottoDir);

        // --- Lotto Page specific meta tags ---
        const lottoUrl = 'https://satduangdao.com/lotto';
        const lottoTitle = 'วิเคราะห์หวย สถิติย้อนหลัง 22 ปี | ศาสตร์ดวงดาว';
        const lottoDesc = 'วิเคราะห์หวยรัฐบาล สถิติย้อนหลัง 22 ปี แนวทางจากสำนักดัง กระแสเลขเด็ดโซเชียล เลขมงคล สรุปเลขเด่นประจำงวด พร้อมระบบสุ่มเลขนำโชค';
        const lottoOgImage = 'https://satduangdao.com/lotto-hero.png'; // Make sure this image is correctly named in public/

        let lottoHtml = baseHtml
            // Standard Meta Tags
            .replace(/<title>.*?<\/title>/, `<title>${lottoTitle}</title>`)
            .replace(/<meta name="title" content=".*?" ?\/>/, `<meta name="title" content="${lottoTitle}" />`)
            .replace(/<meta name="description" content=".*?" ?\/>/, `<meta name="description" content="${lottoDesc}" />`)

            // Open Graph / Facebook
            .replace(/<meta property="og:url" content=".*?" ?\/>/, `<meta property="og:url" content="${lottoUrl}" />`)
            .replace(/<meta property="og:title" content=".*?" ?\/>/, `<meta property="og:title" content="${lottoTitle}" />`)
            .replace(/<meta property="og:description" content=".*?" ?\/>/, `<meta property="og:description" content="${lottoDesc}" />`)
            .replace(/<meta property="og:image" content=".*?" ?\/>/, `<meta property="og:image" content="${lottoOgImage}" />`)

            // Twitter
            .replace(/<meta property="twitter:url" content=".*?" ?\/>/, `<meta property="twitter:url" content="${lottoUrl}" />`)
            .replace(/<meta property="twitter:title" content=".*?" ?\/>/, `<meta property="twitter:title" content="${lottoTitle}" />`)
            .replace(/<meta property="twitter:description" content=".*?" ?\/>/, `<meta property="twitter:description" content="${lottoDesc}" />`)
            .replace(/<meta property="twitter:image" content=".*?" ?\/>/, `<meta property="twitter:image" content="${lottoOgImage}" />`);


        // Write the modified HTML to the new path
        const lottoIndexPath = path.join(lottoDir, 'index.html');
        await fs.writeFile(lottoIndexPath, lottoHtml);
        
        console.log(`✅ SEO page generated successfully at: ${lottoIndexPath}`);

    } catch (error) {
        console.error('Error generating SEO pages:', error);
    }
};

generateSeoPages();
