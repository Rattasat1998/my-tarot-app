const fs = require('fs');
const path = require('path');

const targetDirs = [
    'src/components/home',
    'src/components/ui',
    'src/components/game'
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // We want to replace "text-white" with "text-slate-900 dark:text-white"
    // BUT only when it's on an h1, h2, h3, h4, p, or generic div that doesn't have a solid bg.
    // A safe approach is to look for regex: /(<h[1-6]|<p|<div[^>]*font-bold)([^>]*)text-white/g
    // Actually, let's just do a simple string replace for known patterns from our grep.

    const patternsToReplace = [
        {
            // HeroSection and CTA titles
            regex: /(<h[234][^>]*className="[^"]*?)text-white([^"]*")/g,
            replacement: '$1text-slate-900 dark:text-white$2'
        },
        {
            // Paragraphs and bold divs
            regex: /(<(?:p|div)[^>]*className="[^"]*?(?:font-bold|text-sm|text-lg)[^"]*?)text-white([^"]*")/g,
            replacement: '$1text-slate-900 dark:text-white$2'
        }
    ];

    patternsToReplace.forEach(({regex, replacement}) => {
        const newContent = content.replace(regex, (match, p1, p2) => {
            // Avoid changing if it's inside a button or has bg-purple etc.
            if (match.includes('bg-') && !match.includes('bg-slate-800') && !match.includes('bg-[#') && !match.includes('bg-black')) {
                return match; // skip solid color bgs
            }
            if (match.includes('from-') || match.includes('to-')) {
                return match; // skip gradients
            }
            if (match.includes('text-slate-900 dark:text-white')) {
                return match; // already replaced
            }
            modified = true;
            return p1 + 'text-slate-900 dark:text-white' + p2;
        });
        content = newContent;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

targetDirs.forEach(dir => walkDir(path.join(__dirname, dir)));
console.log('Done');
