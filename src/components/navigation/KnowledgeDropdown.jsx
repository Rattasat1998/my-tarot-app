import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, Clock, Landmark, FileText, Stars, Hash, Compass, Hand } from 'lucide-react';
import { ARTICLES } from '../../data/articles';

export const KnowledgeDropdown = ({ openArticle, isMobile = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobile) return;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile]);

    return (
        <div className={`relative ${isMobile ? 'w-full' : ''}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isMobile ? 'w-full justify-between' : ''} ${isOpen ? 'bg-amber-900/30 border-amber-500 text-amber-200' : 'border-slate-800 text-slate-400 hover:text-white'}`}
            >
                <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span className={`${!isMobile ? 'hidden sm:inline' : ''} font-medium text-sm`}>ความรู้</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`${isMobile
                    ? 'relative mt-2 w-full bg-slate-900/50 border border-slate-800 rounded-xl'
                    : 'absolute top-full right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3'
                    } animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto z-50`}>

                    {/* Featured Articles Section */}
                    <div className="px-5 py-3 border-b border-slate-800">
                        <div className="text-xs font-bold text-amber-500/60 uppercase tracking-widest mb-2">บทความพิเศษ</div>
                        <div className="space-y-2">
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/horoscope-2569');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Stars size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-indigo-300 font-bold group-hover:text-indigo-200 transition-colors">
                                                ดวงชะตา 12 ราศี ปี 2569
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ใหม่</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            ปีม้าไฟ วิเคราะห์เจาะลึกทุกราศี • อ่าน ~20 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/ancient-runes');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-emerald-300 font-bold group-hover:text-emerald-200 transition-colors">
                                                รหัสลับแห่งพฤกษาโลก: อักษรรูนโบราณ
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ใหม่</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            รูโนโลยี วิเคราะห์ Elder Futhark 24 อักษร • อ่าน ~25 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl hover:from-violet-500/20 hover:to-indigo-500/20 hover:border-violet-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/numerology-article');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                                        <Hash size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-violet-300 font-bold group-hover:text-violet-200 transition-colors">
                                                เลขศาสตร์พยากรณ์: ภาษาแห่งจักรวาล
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ใหม่</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            ระบบสากล & เลขศาสตร์ไทย วิเคราะห์เลข 1-9 • อ่าน ~20 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl hover:from-teal-500/20 hover:to-cyan-500/20 hover:border-teal-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/feng-shui-article');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                                        <Compass size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-teal-300 font-bold group-hover:text-teal-200 transition-colors">
                                                ศาสตร์ฮวงจุ้ย: พลังงานและชัยภูมิ
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ใหม่</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            เบญจธาตุ สำนักฮวงจุ้ย ยุคที่ 9 • อ่าน ~25 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl hover:from-pink-500/20 hover:to-rose-500/20 hover:border-pink-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/palmistry-article');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                                        <Hand size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-pink-300 font-bold group-hover:text-pink-200 transition-colors">
                                                ศาสตร์ลายมือ: หัตถศาสตร์เชิงบูรณาการ
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ใหม่</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            เส้นลายมือ เนินฝ่ามือ เครื่องหมายลึกลับ • อ่าน ~25 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-500/40 transition-all group"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/ceremony');
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                                        <Landmark size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-amber-300 font-bold group-hover:text-amber-200 transition-colors">
                                            ศาสนพิธีในพุทธศาสนาไทย
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            วิวัฒนาการและปรัชญาเชิงลึก • อ่าน ~15 นาที
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* บทความ Section */}
                    <div className="px-5 py-2 mt-1 border-b border-slate-800">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">บทความน่าอ่าน</div>
                    </div>
                    <div className="space-y-1">
                        {ARTICLES.map((article) => (
                            <button
                                key={article.id}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 transition-colors group"
                                onClick={() => {
                                    if (!isMobile) setIsOpen(false);
                                    openArticle(article.id);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium group-hover:text-amber-300 transition-colors leading-snug">
                                            {article.title}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                            {article.description}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                                                {article.category}
                                            </span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Clock size={10} />
                                                {article.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
