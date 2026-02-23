import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Moon, Copy, Check, ChevronRight } from 'lucide-react';
import { searchDreamNumber, getPopularDreams, DREAM_CATEGORIES } from '../../data/dreamNumbers';

export const DreamNumberModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [copiedNum, setCopiedNum] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setSelectedCategory(null);
            setShowResults(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSearch = (searchQuery) => {
        setQuery(searchQuery);
        if (searchQuery.trim().length > 0) {
            const found = searchDreamNumber(searchQuery);
            setResults(found);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    };

    const handleQuickSearch = (keyword) => {
        setQuery(keyword);
        const found = searchDreamNumber(keyword);
        setResults(found);
        setShowResults(true);
    };

    const handleCopy = (num) => {
        navigator.clipboard?.writeText(num).catch(() => {});
        setCopiedNum(num);
        setTimeout(() => setCopiedNum(null), 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 rounded-t-3xl sm:rounded-t-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 rounded-full bg-white/5" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <Moon size={24} className="text-yellow-300" />
                            <h3 className="text-xl font-bold text-white">ทำนายฝัน → เลขเด็ด</h3>
                        </div>
                        <p className="text-indigo-200 text-sm">
                            พิมพ์สิ่งที่ฝันเห็น แปลงเป็นเลขเด็ดตามตำราโบราณ
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="พิมพ์สิ่งที่ฝันเห็น เช่น งู น้ำ เสือ..."
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Results */}
                    {showResults && (
                        <div>
                            {results.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 font-medium">
                                        พบ {results.length} ผลลัพธ์
                                    </p>
                                    {results.map((entry, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg">
                                                        {entry.keyword}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{entry.meaning}</p>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                                                    {DREAM_CATEGORIES.find(c => c.id === entry.category)?.icon}
                                                </span>
                                            </div>

                                            {/* 2-digit numbers */}
                                            <div className="mb-3">
                                                <p className="text-xs text-amber-600 font-semibold mb-1.5">เลข 2 ตัว</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.twoDigit.map((num, nidx) => (
                                                        <button
                                                            key={nidx}
                                                            onClick={() => handleCopy(num)}
                                                            className={`relative min-w-[48px] h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all active:scale-95 ${
                                                                nidx === 0
                                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 shadow-md shadow-amber-200/50'
                                                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                            }`}
                                                        >
                                                            {copiedNum === num ? (
                                                                <Check size={16} className="text-green-500" />
                                                            ) : (
                                                                num
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 3-digit numbers */}
                                            <div>
                                                <p className="text-xs text-purple-600 font-semibold mb-1.5">เลข 3 ตัว</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.threeDigit.map((num, nidx) => (
                                                        <button
                                                            key={nidx}
                                                            onClick={() => handleCopy(num)}
                                                            className={`relative min-w-[56px] h-10 px-3 rounded-xl flex items-center justify-center font-bold text-base border-2 transition-all active:scale-95 ${
                                                                nidx === 0
                                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-300 shadow-md shadow-purple-200/50'
                                                                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                                            }`}
                                                        >
                                                            {copiedNum === num ? (
                                                                <Check size={14} className="text-green-500" />
                                                            ) : (
                                                                num
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Moon size={40} className="text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">ไม่พบเลขที่ตรงกับ "{query}"</p>
                                    <p className="text-slate-400 text-sm mt-1">ลองพิมพ์คำอื่น เช่น งู, น้ำ, เสือ</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Tags (Popular Dreams) */}
                    {!showResults && (
                        <>
                            <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2.5">
                                    ฝันยอดนิยม
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {getPopularDreams().map((dream) => (
                                        <button
                                            key={dream}
                                            onClick={() => handleQuickSearch(dream)}
                                            className="px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-full text-sm text-slate-700 hover:text-indigo-700 transition-all active:scale-95 font-medium"
                                        >
                                            {dream}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2.5">
                                    หมวดหมู่
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {DREAM_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCategory(cat.id);
                                                handleSearch(cat.label);
                                            }}
                                            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all active:scale-95"
                                        >
                                            <span className="text-2xl">{cat.icon}</span>
                                            <span className="text-sm font-medium text-slate-700">{cat.label}</span>
                                            <ChevronRight size={14} className="ml-auto text-slate-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        * ตำราเลขเด็ดจากความฝัน เพื่อความบันเทิงเท่านั้น
                    </p>
                </div>
            </div>
        </div>
    );
};
