import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Compass,
    ExternalLink,
    Search,
    Sparkles,
    Star,
    TrendingUp
} from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { TAROT_CARDS } from '../data/tarotCards';
import { ZODIAC_SIGNS } from '../data/zodiacData';
import { usePageSEO } from '../hooks/usePageTitle';

const CATEGORY_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pages', label: 'เครื่องมือ' },
    { id: 'articles', label: 'บทความ' },
    { id: 'cards', label: 'ความหมายไพ่' },
    { id: 'zodiac', label: 'ราศี' },
];

const TRENDING_SEARCHES = [
    'ไพ่ The Fool',
    'ความรัก',
    'เลขศาสตร์',
    'ราศีเมษ',
    'ฮวงจุ้ยโต๊ะทำงาน',
    'เลขเด็ด'
];

const FEATURED_COLLECTIONS = [
    {
        id: 'daily-oracle',
        title: 'ดวงรายวันแบบอินเทอร์แอคทีฟ',
        description: 'ดูคำทำนายประจำวัน สีมงคล และคำแนะนำที่อ่านง่ายในหน้าเดียว',
        route: '/daily-oracle',
        icon: Calendar,
        badge: 'อัปเดตรายวัน',
        theme: 'from-emerald-500/15 to-teal-500/15',
        border: 'border-emerald-500/30',
        accent: 'text-emerald-300',
    },
    {
        id: 'zodiac',
        title: 'ดวง 12 ราศี',
        description: 'ดูพื้นฐานราศี ธาตุประจำตัว และคำทำนายของแต่ละราศีได้ทันที',
        route: '/zodiac',
        icon: Star,
        badge: '12 หมวด',
        theme: 'from-fuchsia-500/15 to-violet-500/15',
        border: 'border-fuchsia-500/30',
        accent: 'text-fuchsia-300',
    },
    {
        id: 'lotto',
        title: 'คลังวิเคราะห์หวย',
        description: 'รวมสถิติย้อนหลัง แนวทางเลขเด่น และเครื่องมือช่วยคิดเลขมงคล',
        route: '/lotto',
        icon: TrendingUp,
        badge: 'ข้อมูล 22 ปี',
        theme: 'from-amber-500/15 to-orange-500/15',
        border: 'border-amber-500/30',
        accent: 'text-amber-300',
    },
];

const SITE_PAGES = [
    {
        id: 'daily-oracle',
        kind: 'page',
        category: 'pages',
        title: 'ดวงรายวันแบบอินเทอร์แอคทีฟ',
        description: 'ดูคำทำนายประจำวัน สีมงคล จุดเด่น จุดระวัง และแนวทางเสริมดวงของวันนี้',
        route: '/daily-oracle',
        actionLabel: 'เปิดดวงรายวัน',
        keywords: ['รายวัน', 'ดวงวันนี้', 'สีมงคล', 'คำแนะนำประจำวัน'],
    },
    {
        id: 'zodiac',
        kind: 'page',
        category: 'pages',
        title: 'ดูดวง 12 ราศี',
        description: 'คำทำนายราศีประจำวัน พร้อมข้อมูลธาตุ ดาวประจำราศี และเลขมงคล',
        route: '/zodiac',
        actionLabel: 'เปิดหน้าราศี',
        keywords: ['ราศี', 'ธาตุ', 'ดวงราศี', 'โหราศาสตร์'],
    },
    {
        id: 'lotto',
        kind: 'page',
        category: 'pages',
        title: 'วิเคราะห์หวยและสถิติย้อนหลัง',
        description: 'รวมข้อมูลหวยย้อนหลัง กระแสเลขเด่น เครื่องมือสุ่มเลขมงคล และตรวจผลสลาก',
        route: '/lotto',
        actionLabel: 'เปิดหน้าวิเคราะห์หวย',
        keywords: ['หวย', 'เลขเด็ด', 'สถิติย้อนหลัง', 'ตรวจหวย'],
    },
    {
        id: 'runes',
        kind: 'page',
        category: 'pages',
        title: 'ดูดวงรูนโบราณ',
        description: 'ทำความรู้จัก Elder Futhark และสุ่มรูนเพื่อรับคำแนะนำเชิงสัญลักษณ์',
        route: '/runes',
        actionLabel: 'เปิดหน้ารูน',
        keywords: ['รูน', 'norse', 'elder futhark', 'คำทำนายรูน'],
    },
    {
        id: 'soulmate',
        kind: 'page',
        category: 'pages',
        title: 'เช็กดวงเนื้อคู่',
        description: 'วิเคราะห์สมพงษ์ ความเข้ากันได้ และแนวโน้มเรื่องความสัมพันธ์จากข้อมูลวันเกิด',
        route: '/soulmate',
        actionLabel: 'เปิดหน้าเนื้อคู่',
        keywords: ['เนื้อคู่', 'ความรัก', 'สมพงษ์', 'คู่ครอง'],
    },
    {
        id: 'numerology',
        kind: 'page',
        category: 'pages',
        title: 'บทความเลขศาสตร์',
        description: 'เจาะลึกระบบเลขศาสตร์ ความหมายตัวเลข 1-9 และแนวคิด Master Numbers',
        route: '/numerology-article',
        actionLabel: 'อ่านบทความ',
        keywords: ['เลขศาสตร์', 'ตัวเลข', 'master numbers', 'นามศาสตร์'],
    },
    {
        id: 'feng-shui',
        kind: 'page',
        category: 'pages',
        title: 'คู่มือฮวงจุ้ย',
        description: 'รวมแนวคิดหยินหยาง ธาตุทั้งห้า และวิธีจัดพื้นที่ให้ส่งเสริมการใช้ชีวิต',
        route: '/feng-shui-article',
        actionLabel: 'อ่านบทความ',
        keywords: ['ฮวงจุ้ย', 'จัดบ้าน', 'โต๊ะทำงาน', 'ทิศทาง'],
    },
    {
        id: 'palmistry',
        kind: 'page',
        category: 'pages',
        title: 'ศาสตร์ลายมือ',
        description: 'เรียนรู้เส้นหลัก เนินฝ่ามือ และแนวทางอ่านลักษณะมือเชิงบูรณาการ',
        route: '/palmistry-article',
        actionLabel: 'อ่านบทความ',
        keywords: ['ลายมือ', 'หัตถศาสตร์', 'เส้นชีวิต', 'เส้นหัวใจ'],
    },
];

const SEARCHABLE_ITEMS = [
    ...SITE_PAGES,
    ...ARTICLES.map((article) => ({
        id: `article:${article.id}`,
        kind: 'article',
        category: 'articles',
        title: article.title.replace(/[^\p{L}\p{N}\s"“”'():!?-]/gu, '').trim(),
        description: article.description,
        route: `/?article=${article.id}`,
        actionLabel: 'เปิดบทความ',
        articleId: article.id,
        meta: `${article.category} • ${article.readTime}`,
        keywords: [article.category, article.readTime, article.title, article.description],
    })),
    ...ZODIAC_SIGNS.map((sign) => ({
        id: `zodiac:${sign.id}`,
        kind: 'zodiac',
        category: 'zodiac',
        title: `ราศี${sign.nameTh}`,
        description: `ธาตุ${sign.element} • ดาวประจำราศี ${sign.rulingPlanet} • จุดเด่น ${sign.traits.slice(0, 3).join(' • ')}`,
        route: `/zodiac?sign=${sign.id}`,
        actionLabel: 'เปิดคำทำนายราศี',
        signId: sign.id,
        meta: sign.dateRange,
        keywords: [sign.nameTh, sign.nameEn, sign.element, sign.rulingPlanet, ...sign.traits],
    })),
    ...TAROT_CARDS.map((card) => ({
        id: `card:${card.id}`,
        kind: 'card',
        category: 'cards',
        title: `${card.name} (${card.nameThai})`,
        description: card.description || card.meaningUpright || '',
        route: '/',
        actionLabel: 'กลับไปเปิดไพ่',
        meta: `ไพ่หมายเลข ${card.id}`,
        keywords: [
            card.name,
            card.nameThai,
            ...(card.keywords || []),
            ...(card.keywords?.upright || []),
            ...(card.keywords?.reversed || []),
            card.meaningUpright,
            card.meaningLove,
            card.meaningWork,
            card.meaningFinance,
        ].filter(Boolean),
    })),
];

const normalize = (value = '') => value.toLocaleLowerCase('th-TH');

const scoreMatch = (item, query) => {
    const normalizedTitle = normalize(item.title);
    const normalizedDescription = normalize(item.description);
    const normalizedKeywords = normalize(item.keywords.join(' '));

    let score = 0;

    if (normalizedTitle === query) score += 140;
    if (normalizedTitle.startsWith(query)) score += 70;
    if (normalizedTitle.includes(query)) score += 45;
    if (normalizedKeywords.includes(query)) score += 25;
    if (normalizedDescription.includes(query)) score += 18;
    if (item.kind === 'article') score += 8;
    if (item.kind === 'page') score += 6;

    return score;
};

const searchLibrary = (query, category) => {
    const normalizedQuery = normalize(query.trim());
    if (normalizedQuery.length < 2) return [];

    return SEARCHABLE_ITEMS
        .filter((item) => category === 'all' || item.category === category)
        .map((item) => ({ ...item, score: scoreMatch(item, normalizedQuery) }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 24);
};

const getCardTags = (item) => {
    if (item.kind !== 'card') return [];
    return item.keywords
        .filter((keyword) => typeof keyword === 'string' && keyword.length > 1)
        .slice(0, 4);
};

const getHistory = () => {
    try {
        const raw = localStorage.getItem('knowledgeSearchHistory');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveHistory = (query) => {
    if (!query.trim()) return [];

    const nextHistory = [query.trim(), ...getHistory().filter((item) => item !== query.trim())].slice(0, 6);
    localStorage.setItem('knowledgeSearchHistory', JSON.stringify(nextHistory));
    return nextHistory;
};

const ResultBadge = ({ item }) => {
    const labelMap = {
        page: { label: 'เครื่องมือ', className: 'bg-sky-500/10 text-sky-300 border-sky-500/30' },
        article: { label: 'บทความ', className: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
        zodiac: { label: 'ราศี', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
        card: { label: 'ไพ่ทาโรต์', className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    };

    const badge = labelMap[item.kind];
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}>
            {badge.label}
        </span>
    );
};

export const SearchPage = ({ isDark }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchHistory, setSearchHistory] = useState(() => getHistory());

    usePageSEO({
        title: 'คลังความรู้ไพ่ทาโรต์และดูดวง',
        description: 'ค้นหาบทความดูดวง ความหมายไพ่ทาโรต์ ข้อมูลราศี และเครื่องมือสำคัญทั้งหมดของศาสตร์ดวงดาวในหน้าเดียว',
        keywords: 'ค้นหาดูดวง, คลังความรู้, ไพ่ทาโรต์, ความหมายไพ่, ราศี, เลขศาสตร์, ฮวงจุ้ย',
        path: '/search',
        robots: 'noindex, follow',
        type: 'website',
    });

    const results = searchLibrary(searchQuery, selectedCategory);
    const hasQuery = searchQuery.trim().length >= 2;

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/');
    };

    const rememberQuery = (query) => {
        if (!query.trim()) return;
        setSearchHistory(saveHistory(query));
    };

    const handleSuggestionClick = (query) => {
        setSearchQuery(query);
        rememberQuery(query);
    };

    const openResult = (item) => {
        rememberQuery(searchQuery || item.title);
        navigate(item.route);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                    <button
                        onClick={handleBack}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        กลับ
                    </button>

                    <section className="mb-10 rounded-[2rem] border border-slate-800 bg-slate-900/40 p-6 shadow-2xl shadow-black/20 sm:p-8">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                            <Compass size={16} />
                            คลังความรู้ในแอปเดียว
                        </div>
                        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                            <div>
                                <h1 className="max-w-3xl text-3xl font-serif font-bold leading-tight text-white sm:text-5xl">
                                    ค้นหาความหมายไพ่ บทความ และเครื่องมือดูดวงจากข้อมูลจริงในเว็บไซต์
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                                    หน้านี้รวบรวมบทความ, ไพ่ทาโรต์ 78 ใบ, ดวง 12 ราศี และเครื่องมือสำคัญของศาสตร์ดวงดาวไว้ในที่เดียว
                                    เพื่อให้ค้นหาความรู้ได้โดยไม่ต้องไล่เปิดหลายเมนู
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="text-2xl font-bold text-white">{TAROT_CARDS.length}</div>
                                    <div className="mt-1 text-xs text-slate-400">ไพ่ทาโรต์ในคลัง</div>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="text-2xl font-bold text-white">{ARTICLES.length}</div>
                                    <div className="mt-1 text-xs text-slate-400">บทความแนะนำ</div>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="text-2xl font-bold text-white">{ZODIAC_SIGNS.length}</div>
                                    <div className="mt-1 text-xs text-slate-400">ราศีที่ค้นหาได้</div>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="text-2xl font-bold text-white">{SITE_PAGES.length}</div>
                                    <div className="mt-1 text-xs text-slate-400">เครื่องมือหลัก</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            rememberQuery(searchQuery);
                                        }
                                    }}
                                    placeholder="ลองค้นหา เช่น ไพ่ The Star, ราศีเมษ, ความรัก, ฮวงจุ้ย"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedCategory(option.id)}
                                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                                            selectedCategory === option.id
                                                ? 'border-purple-400 bg-purple-500/15 text-purple-200'
                                                : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                                <Sparkles size={16} className="text-yellow-400" />
                                <span>คำค้นยอดนิยม:</span>
                                {TRENDING_SEARCHES.map((query) => (
                                    <button
                                        key={query}
                                        onClick={() => handleSuggestionClick(query)}
                                        className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {!hasQuery && (
                        <>
                            {searchHistory.length > 0 && (
                                <section className="mb-10">
                                    <div className="mb-4 flex items-center gap-2 text-slate-300">
                                        <Search size={16} className="text-slate-500" />
                                        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">ค้นหาล่าสุด</h2>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {searchHistory.map((query) => (
                                            <button
                                                key={query}
                                                onClick={() => handleSuggestionClick(query)}
                                                className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                                            >
                                                {query}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="mb-12">
                                <div className="mb-5 flex items-center gap-2">
                                    <BookOpen size={18} className="text-purple-300" />
                                    <h2 className="text-xl font-semibold text-white">เริ่มจากหมวดที่คนใช้งานบ่อย</h2>
                                </div>
                                <div className="grid gap-4 lg:grid-cols-3">
                                    {FEATURED_COLLECTIONS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => navigate(item.route)}
                                                className={`rounded-[1.75rem] border bg-gradient-to-br ${item.theme} ${item.border} p-6 text-left transition-transform hover:-translate-y-1`}
                                            >
                                                <div className="mb-5 flex items-center justify-between">
                                                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                                                        <Icon size={22} className={item.accent} />
                                                    </div>
                                                    <span className={`rounded-full border border-white/10 px-3 py-1 text-xs font-semibold ${item.accent}`}>
                                                        {item.badge}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                                                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
                                                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
                                                    เปิดดูเลย
                                                    <ExternalLink size={16} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                                <div>
                                    <div className="mb-5 flex items-center gap-2">
                                        <Sparkles size={18} className="text-yellow-400" />
                                        <h2 className="text-xl font-semibold text-white">บทความที่คนอ่านต่อบ่อย</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {ARTICLES.slice(0, 4).map((article) => (
                                            <button
                                                key={article.id}
                                                onClick={() => navigate(`/?article=${article.id}`)}
                                                className="w-full rounded-3xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-colors hover:border-slate-700 hover:bg-slate-900/70"
                                            >
                                                <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                                                    <BookOpen size={14} />
                                                    <span>{article.category}</span>
                                                    <span>•</span>
                                                    <span>{article.readTime}</span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{article.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-5 flex items-center gap-2">
                                        <Star size={18} className="text-amber-400" />
                                        <h2 className="text-xl font-semibold text-white">ไพ่ที่ถูกค้นหาบ่อย</h2>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {TAROT_CARDS.slice(0, 6).map((card) => (
                                            <div
                                                key={card.id}
                                                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4"
                                            >
                                                <div className="text-sm font-semibold text-white">{card.name}</div>
                                                <div className="mt-1 text-xs text-slate-500">{card.nameThai}</div>
                                                <p className="mt-3 text-sm leading-relaxed text-slate-300 line-clamp-3">
                                                    {card.description || card.meaningUpright}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {hasQuery && (
                        <section>
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">ผลการค้นหา</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        พบ {results.length} รายการสำหรับคำว่า "{searchQuery.trim()}"
                                    </p>
                                </div>
                                <button
                                    onClick={() => rememberQuery(searchQuery)}
                                    className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                                >
                                    บันทึกคำค้นนี้
                                </button>
                            </div>

                            {results.length === 0 ? (
                                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80">
                                        <Search size={22} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">ยังไม่พบคำตอบที่ตรงมากพอ</h3>
                                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                                        ลองเปลี่ยนเป็นคำที่สั้นลงหรือกว้างขึ้น เช่น "ไพ่ lovers", "ความรัก", "ราศีสิงห์", "เลขศาสตร์"
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {results.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-[1.75rem] border border-slate-800 bg-slate-900/45 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900/70"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                                        <ResultBadge item={item} />
                                                        {item.meta && (
                                                            <span className="text-xs text-slate-500">{item.meta}</span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                                        {item.description}
                                                    </p>

                                                    {item.kind === 'card' && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {getCardTags(item).map((tag) => (
                                                                <span
                                                                    key={`${item.id}-${tag}`}
                                                                    className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="sm:pl-4">
                                                    <button
                                                        onClick={() => openResult(item)}
                                                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.02]"
                                                    >
                                                        {item.actionLabel}
                                                        <ExternalLink size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
