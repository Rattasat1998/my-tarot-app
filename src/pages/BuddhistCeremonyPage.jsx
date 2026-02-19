import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, ChevronDown, List, X } from 'lucide-react';
import { CEREMONY_SECTIONS } from '../data/buddhistCeremonyData';
import { usePageSEO } from '../hooks/usePageTitle';

export function BuddhistCeremonyPage() {
    usePageSEO({
        title: 'ศาสนพิธีในพุทธศาสนาไทย',
        description: 'บทความเชิงลึกเกี่ยวกับศาสนพิธีในพุทธศาสนาไทย วิวัฒนาการจากรากฐานคัมภีร์สู่สังคมร่วมสมัย พิธีกรรมทำบุญ อุปสมบท ทอดกฐิน ลอยกระทง สัญลักษณ์ทางศาสนา',
        keywords: 'ศาสนพิธี, พุทธศาสนา, พิธีกรรมไทย, ทำบุญ, อุปสมบท, ทอดกฐิน, ลอยกระทง, วัดไทย, พระพุทธศาสนา',
        path: '/buddhist-ceremony-article',
    });
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('intro');
    const [showTOC, setShowTOC] = useState(false);
    const sectionRefs = useRef({});

    // Track active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
        );

        CEREMONY_SECTIONS.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShowTOC(false);
        }
    };

    // Simple markdown-like bold parser
    const renderText = (text) => {
        if (!text) return null;
        return text.split('\n\n').map((block, idx) => (
            <p key={idx} className="text-slate-300 leading-relaxed mb-4 text-[15px]"
                dangerouslySetInnerHTML={{
                    __html: block
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-semibold">$1</strong>')
                        .replace(/\n/g, '<br/>')
                }}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-amber-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-orange-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=1600&q=80"
                    alt="พระอุโบสถ"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">กลับหน้าหลัก</span>
                </button>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                                บทความเชิงลึก
                            </span>
                            <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50">
                                อ่าน ~15 นาที
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight mb-4">
                            วิวัฒนาการและปรัชญาของ
                            <span className="block text-amber-400">ศาสนพิธีในพุทธศาสนาไทย</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                            การวิเคราะห์เชิงลึกจากรากฐานคัมภีร์สู่พลวัตทางวัฒนธรรมและสังคมร่วมสมัย
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex gap-8">
                    {/* Sticky Sidebar TOC - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                                    <List size={16} className="text-amber-400" />
                                    <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">สารบัญ</span>
                                </div>
                                <nav className="space-y-1">
                                    {CEREMONY_SECTIONS.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeSection === section.id
                                                ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <span className="text-base">{section.icon}</span>
                                            <span className="line-clamp-1">{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile TOC Toggle */}
                    <button
                        onClick={() => setShowTOC(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-30 p-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-2xl shadow-amber-600/30 transition-all"
                    >
                        <List size={22} />
                    </button>

                    {/* Mobile TOC Drawer */}
                    {showTOC && (
                        <div className="lg:hidden fixed inset-0 z-50">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTOC(false)}></div>
                            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <List size={18} className="text-amber-400" />
                                        <span className="font-bold text-amber-300">สารบัญ</span>
                                    </div>
                                    <button onClick={() => setShowTOC(false)} className="p-2 text-slate-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                                <nav className="space-y-1">
                                    {CEREMONY_SECTIONS.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${activeSection === section.id
                                                ? 'bg-amber-500/15 text-amber-300'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <span className="text-lg">{section.icon}</span>
                                            <span>{section.title}</span>
                                            <ChevronRight size={14} className="ml-auto" />
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="flex-1 min-w-0 max-w-4xl">
                        <div className="space-y-16">
                            {CEREMONY_SECTIONS.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24"
                                    ref={(el) => { sectionRefs.current[section.id] = el; }}
                                >
                                    {/* Section Image */}
                                    {section.image && index > 0 && (
                                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl border border-slate-800/50">
                                            <img
                                                src={section.image}
                                                alt={section.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
                                        </div>
                                    )}

                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs text-amber-500/60 font-mono uppercase tracking-widest mb-0.5">
                                                ส่วนที่ {index + 1}
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                                                {section.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 p-6 sm:p-8">
                                        {renderText(section.content)}

                                        {/* Subsections */}
                                        {section.subsections && (
                                            <div className="space-y-6 mt-6">
                                                {section.subsections.map((sub, si) => (
                                                    <div key={si} className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/30">
                                                        <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                                                            <ChevronRight size={16} className="text-amber-500" />
                                                            {sub.title}
                                                        </h3>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{sub.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Highlights (for symbols section) */}
                                        {section.highlights && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                                {section.highlights.map((h, hi) => (
                                                    <div key={hi} className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-2xl p-5 border border-amber-500/20 text-center hover:border-amber-500/40 transition-all group">
                                                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{h.icon}</div>
                                                        <h4 className="text-amber-300 font-bold text-sm mb-2">{h.title}</h4>
                                                        <p className="text-slate-400 text-xs leading-relaxed">{h.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Table */}
                                        {section.table && (
                                            <div className="mt-6 overflow-x-auto">
                                                <div className="min-w-[500px]">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr>
                                                                {section.table.headers.map((header, hi) => (
                                                                    <th key={hi} className="text-left px-4 py-3 text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border-b border-amber-500/20 first:rounded-tl-xl last:rounded-tr-xl">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {section.table.rows.map((row, ri) => (
                                                                <tr key={ri} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                                    {row.map((cell, ci) => (
                                                                        <td key={ci} className={`px-4 py-3 text-sm ${ci === 0 ? 'text-amber-200 font-medium' : 'text-slate-300'}`}>
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Content */}
                                        {section.additionalContent && (
                                            <div className="mt-6 pt-6 border-t border-slate-700/50">
                                                {renderText(section.additionalContent)}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Back to Home */}
                        <div className="mt-16 text-center">
                            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl border border-amber-500/20 p-8 sm:p-12">
                                <BookOpen size={40} className="text-amber-400 mx-auto mb-4" />
                                <h3 className="text-xl font-serif text-amber-300 mb-2">จบบทความ</h3>
                                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                                    ขอบคุณที่อ่านจนจบ หวังว่าบทความนี้จะช่วยเพิ่มพูนความเข้าใจในศาสนพิธีของพุทธศาสนาไทย
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-full transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30"
                                >
                                    กลับหน้าหลัก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
