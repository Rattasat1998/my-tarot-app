import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Star, Heart, Brain, BookOpen, Users, Clock, TrendingUp, ArrowLeft, Sparkles, X } from 'lucide-react';
import { TAROT_CARDS } from '../data/tarotCards';
import { getDailyFortune } from '../data/dailyFortune';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/modals/LoginModal';

export const SearchPage = ({ isDark }) => {
    const { isPremium } = usePremium();
    const { user, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSort, setSelectedSort] = useState('relevance');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const categories = [
        { id: 'all', name: 'ทั้งหมด', icon: '📚' },
        { id: 'cards', name: 'ไพ่ทาโรต์', icon: '🎴' },
        { id: 'meanings', name: 'ความหมาย', icon: '📖' },
        { id: 'articles', name: 'บทความ', icon: '📰' },
        { id: 'zodiac', name: 'ราศี', icon: '⭐' },
        { id: 'meditation', name: 'สมาธิ', icon: '🧘' },
        { id: 'journal', name: 'บันทึก', icon: '📔' },
        { id: 'community', name: 'ชุมชน', icon: '👥' }
    ];

    const sortOptions = [
        { id: 'relevance', name: 'ความเกี่ยวข้อง' },
        { id: 'recent', name: 'ล่าสุด' },
        { id: 'popular', name: 'ยอดนิยม' },
        { id: 'alphabetical', name: 'ตามอักษร' }
    ];

    useEffect(() => {
        // Load search history from localStorage
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Simulate search API call
        setTimeout(() => {
            const results = searchInContent(query, selectedCategory);
            setSearchResults(results);

            // Add to search history
            const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));

            setIsSearching(false);
        }, 500);
    };

    const searchInContent = (query, category) => {
        const lowerQuery = query.toLowerCase();
        let results = [];

        // Search in tarot cards
        if (category === 'all' || category === 'cards') {
            TAROT_CARDS.forEach(card => {
                if (card.name.toLowerCase().includes(lowerQuery) ||
                    card.keywords?.upright?.some(k => k.toLowerCase().includes(lowerQuery)) ||
                    card.keywords?.reversed?.some(k => k.toLowerCase().includes(lowerQuery)) ||
                    card.description?.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        type: 'card',
                        item: card,
                        title: card.name,
                        description: card.description || `${card.keywords?.upright?.slice(0, 3).join(' • ')} - ${card.keywords?.reversed?.slice(0, 3).join(' • ')}`,
                        url: `/card/${card.id}`,
                        image: card.image,
                        category: 'cards'
                    });
                }
            });
        }

        // Search in articles (mock data)
        if (category === 'all' || category === 'articles') {
            const articles = [
                {
                    id: 1,
                    title: 'วิธีอ่านไพ่ทาโรต์สำหรับมือใหม่',
                    excerpt: 'คู่มือคำแนะนำใหม่เพื่อการอ่านไพ่ทาโรต์อย่างง่าย...',
                    url: '/articles/tarot-basics',
                    category: 'articles',
                    date: '2024-01-15',
                    readTime: '5 นาที'
                },
                {
                    id: 2,
                    title: 'ความหมายไพ่ The Fool ในทาโรต์',
                    excerpt: 'ไพ่ The Fool เป็นไพ่แรกกแรกแรกที่ 0 ในสำรับไพ่ทาโรต์...',
                    url: '/articles/fool-meaning',
                    category: 'articles',
                    date: '2024-01-10',
                    readTime: '3 นาที'
                }
            ];

            articles.forEach(article => {
                if (article.title.toLowerCase().includes(lowerQuery) ||
                    article.excerpt.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        type: 'article',
                        item: article,
                        title: article.title,
                        description: article.excerpt,
                        url: article.url,
                        category: 'articles'
                    });
                }
            });
        }

        // Search in zodiac data (mock)
        if (category === 'all' || category === 'zodiac') {
            const zodiacData = [
                {
                    id: 'aries',
                    name: 'ราศีเมษ',
                    description: 'ผู้นำการนำ มีนะเสนอนสูง มีนะเสนอน...',
                    element: 'ไฟ',
                    dates: '21 มี.ค. - 19 เม.ย.',
                    traits: ['กล้าวเสนอน', 'มีความมุน', 'ขี้งแข็งแข็ง']
                },
                {
                    id: 'taurus',
                    name: 'ราศีพฤษภ',
                    description: 'ผู้มีเสถียนภาพระณิย์ มั่นคงความ...',
                    element: 'วัว',
                    dates: '20 เม.ย. - 20 พ.ค.',
                    traits: ['อดทน', 'ซื่อมั่นคง', 'จริงจริง']
                }
            ];

            zodiacData.forEach(zodiac => {
                if (zodiac.name.toLowerCase().includes(lowerQuery) ||
                    zodiac.description.toLowerCase().includes(lowerQuery) ||
                    zodiac.traits.some(trait => trait.toLowerCase().includes(lowerQuery))) {
                    results.push({
                        type: 'zodiac',
                        item: zodiac,
                        title: zodiac.name,
                        description: zodiac.description,
                        url: `/zodiac/${zodiac.id}`,
                        category: 'zodiac'
                    });
                }
            });
        }

        // Sort results
        return sortResults(results, selectedSort);
    };

    const sortResults = (results, sortType) => {
        switch (sortType) {
            case 'relevance':
                return results.sort((a, b) => {
                    const aScore = calculateRelevanceScore(a.title, searchQuery);
                    const bScore = calculateRelevanceScore(b.title, searchQuery);
                    return bScore - aScore;
                });
            case 'recent':
                return results.sort((a, b) => (b.date || 0) - (a.date || 0));
            case 'popular':
                return results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'alphabetical':
                return results.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return results;
        }
    };

    const calculateRelevanceScore = (title, query) => {
        const lowerTitle = title.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (lowerTitle === lowerQuery) return 100;
        if (lowerTitle.startsWith(lowerQuery)) return 80;
        if (lowerTitle.includes(lowerQuery)) return 60;

        return 0;
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            performSearch(query);
        } else if (query.length === 0) {
            setSearchResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const addToHistory = (query) => {
        if (!searchHistory.includes(query)) {
            const newHistory = [query, ...searchHistory.slice(0, 9)];
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
        performSearch(query);
    };

    if (authLoading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} flex items-center justify-center`}>
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'} flex flex-col items-center justify-center p-6`}>
                <div className="max-w-md text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border mb-6 shadow-xl`}>
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">เข้าสู่ระบบก่อนใช้งาน</h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6 leading-relaxed`}>
                        กรุณาเข้าสู่ระบบเพื่อค้นหาความหมายไพ่ บทความ และเนื้อหาทั้งหมด
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            เข้าสู่ระบบ
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isDark
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-md'
                                }`}
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Header */}
                <div className="p-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all mb-6"
                    >
                        <ArrowLeft size={20} />
                        กลับ
                    </button>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                                <Search className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                ค้นหาความรู้
                            </h1>
                        </div>
                        <p className="สล-300 max-w-2xl mx-auto">
                            ค้นหาบทความ, ไพ่ทาโรต์, และข้อมูลเชี่ยวชาญษ์ทั้งหมด
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto px-6 pb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="ค้นหาไพ่ทาโรต์, บทความ, ความหมาย..."
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={() => searchQuery.length > 0 && addToHistory(searchQuery)}
                            className={`w-full pl-12 pr-12 py-4 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500' : 'bg-slate-100 border border-slate-300 placeholder-slate-500'} focus:outline-none focus:border-purple-500 transition-all`}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-600 transition-all"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="text-slate-400" size={18} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-100 border border-slate-300'} focus:outline-none focus:border-purple-500`}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-slate-400" size={18} />
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-100 border border-slate-300'} focus:outline-none focus:border-purple-500`}
                            >
                                {sortOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search History */}
                    {searchHistory.length > 0 && searchQuery.length === 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="text-slate-400" size={16} />
                                <span className="text-slate-400 text-sm">ค้นหาล่าสุด</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {searchHistory.map((query, index) => (
                                    <button
                                        key={index}
                                        onClick={() => addToHistory(query)}
                                        className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all text-sm"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isSearching && (
                    <div className="max-w-4xl mx-auto px-6 pb-12">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                                <span className="text-purple-300">กำลังค้นหา...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {!isSearching && (
                    <div className="max-w-6xl mx-auto px-6 pb-12">
                        {searchResults.length === 0 && searchQuery.length > 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                                    <Search className="text-slate-400" size={24} />
                                    <span className="text-slate-300">ไม่พบผลลการค้นหา</span>
                                </div>
                                <p className="text-slate-400 mt-4">
                                    ลองค้นหาด้วยที่แตกต่างหรือใช้้คำศัพท์อื่น
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                                        ลอง: "ไพ่ The Fool"
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                                        ลอง: "ความรัก"
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                                        ลอง: "สมาธิ"
                                    </span>
                                </div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-slate-300">
                                        พบ {searchResults.length} ผลลลการค้นหาสำหรับ "{searchQuery}"
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <span>ความเกี่ยวข้อง</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={`${result.type}-${result.item.id || index}`}
                                            className={`p-6 rounded-xl border transition-all hover:scale-[1.02] ${isDark
                                                    ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
                                                    : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon/Image */}
                                                <div className="flex-shrink-0">
                                                    {result.type === 'card' && result.image ? (
                                                        <img
                                                            src={result.image}
                                                            alt={result.title}
                                                            className="w-16 h-24 rounded-lg object-cover border border-slate-700"
                                                        />
                                                    ) : (
                                                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${result.type === 'article' ? 'bg-blue-500/20 border border-blue-500/30' :
                                                                result.type === 'zodiac' ? 'bg-purple-500/20 border border-purple-500/30' :
                                                                    'bg-slate-700 border border-slate-600'
                                                            }`}>
                                                            {result.type === 'card' ? '🎴' :
                                                                result.type === 'article' ? '📰' :
                                                                    result.type === 'zodiac' ? result.item.element : '📚'}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.type === 'card' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' :
                                                                result.type === 'article' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' :
                                                                    result.type === 'zodiac' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' :
                                                                        'bg-slate-700 border border-slate-600 text-slate-300'
                                                            }`}>
                                                            {result.type === 'card' ? 'ไพ่ทาโรต์' :
                                                                result.type === 'article' ? 'บทความ' :
                                                                    result.type === 'zodiac' ? 'ราศี' : 'อื่นๆ'}
                                                        </span>
                                                        {result.type === 'card' && (
                                                            <span className="text-xs text-purple-400">
                                                                #{result.item.arcana}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-white mb-2 hover:text-purple-300 transition-colors cursor-pointer">
                                                        {result.title}
                                                    </h3>

                                                    <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                                                        {result.description}
                                                    </p>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                                        {result.type === 'article' && (
                                                            <>
                                                                <span>{result.readTime}</span>
                                                                <span>{result.date}</span>
                                                            </>
                                                        )}
                                                        {result.type === 'zodiac' && (
                                                            <>
                                                                <span>{result.item.element}</span>
                                                                <span>{result.item.dates}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl">
                                    <BookOpen className="w-8 h-8 text-purple-400" />
                                    <span className="text-purple-300">เริเริ่มค้นหาเพื่อค้นพบสิ่งที่ต้องการ</span>
                                </div>
                                <p className="text-slate-400 mt-4">
                                    พิมพิมพ์คำค้นหาเพื่อค้นหาไพ่ทาโรต์, บทความ, หรือข้อมูลเชี่ยวชาญษ์
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Popular Searches */}
                {!isSearching && searchResults.length === 0 && searchQuery.length === 0 && (
                    <div className="max-w-6xl mx-auto px-6 pb-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl mb-6">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                <span className="text-purple-300">ค้นหายอดนิยม</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Popular Cards */}
                            <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'}`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-purple-400" />
                                    ไพ่ยอดนิยม
                                </h3>
                                <div className="space-y-3">
                                    {['The Fool', 'The Magician', 'The High Priestess', 'The Empress'].slice(0, 4).map(cardName => (
                                        <button
                                            key={cardName}
                                            onClick={() => addToHistory(cardName)}
                                            className="w-full text-left px-4 py-2 rounded-lg border transition-all hover:bg-purple-500/20 hover:border-purple-400 text-slate-300 hover:text-white"
                                        >
                                            🔮 {cardName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Topics */}
                            <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'}`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-pink-400" />
                                    หัวข้องยอดนิยม
                                </h3>
                                <div className="space-y-3">
                                    {['ความรัก', 'การงาน', 'สุขภาพ', 'การเงิน', 'สุขภาพจิติ'].slice(0, 5).map(topic => (
                                        <button
                                            key={topic}
                                            onClick={() => addToHistory(topic)}
                                            className="w-full text-left px-4 py-2 rounded-lg border transition-all hover:bg-pink-500/20 hover:border-pink-400 text-slate-300 hover:text-white"
                                        >
                                            💕 {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Zodiac Signs */}
                            <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'}`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-purple-400" />
                                    ราศีทั้งหมด
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {['ราศีเมษ', 'ราศีพฤษภ', 'ราศีเมถุน', 'ราศีกรกฎ', 'ราศีสิงห์', 'ราศีเกมภา', 'ราศีตุล', 'ราศีพิจิก', 'ราศีธนู', 'ราศีกุมภ์', 'ราศีมีน'].map(sign => (
                                        <button
                                            key={sign}
                                            onClick={() => addToHistory(sign)}
                                            className="text-center px-3 py-2 rounded-lg border transition-all hover:bg-purple-500/20 hover:border-purple-400 text-slate-300 hover:text-white"
                                        >
                                            {sign}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
