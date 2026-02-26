import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Crown } from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';

const AD_PLACEMENTS = [
    {
        id: 'tarot-course',
        title: 'เรียนอ่านไพ่ทาโรต์ออนไลน์',
        description: 'คอร์สเรียนอ่านไพ่ทาโรต์สำหรับมือใหม่ เรียนจบรับใบ Certificate',
        cta: 'สมัครเรียน',
        bgGradient: 'from-violet-600/20 to-fuchsia-600/20',
        borderColor: 'border-violet-500/30',
        ctaColor: 'from-violet-600 to-fuchsia-600',
        url: '#'
    },
    {
        id: 'premium-promo',
        title: 'อัปเกรด Premium วันนี้ ลด 30%',
        description: 'ปลดล็อกฟีเจอร์ทั้งหมด อ่านไพ่ไม่จำกัด ไม่มีโฆษณา',
        cta: 'ดูรายละเอียด',
        bgGradient: 'from-purple-600/20 to-indigo-600/20',
        borderColor: 'border-purple-500/30',
        ctaColor: 'from-purple-600 to-indigo-600',
        url: '/membership'
    },
    {
        id: 'crystal-shop',
        title: 'คริสตัลนำโชค จากธรรมชาติแท้',
        description: 'อเมทิสต์ โรสควอตซ์ ซิทริน เสริมพลังชีวิต',
        cta: 'ช้อปเลย',
        bgGradient: 'from-rose-600/20 to-pink-600/20',
        borderColor: 'border-rose-500/30',
        ctaColor: 'from-rose-600 to-pink-600',
        url: '#'
    }
];

export const AdBanner = ({ placement = 'inline', className = '' }) => {
    const { isPremium, isLoading } = usePremium();
    const [currentAd, setCurrentAd] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * AD_PLACEMENTS.length);
        setCurrentAd(AD_PLACEMENTS[randomIndex]);
    }, []);

    // Don't show ads for premium users
    if (isLoading || isPremium || dismissed || !currentAd) return null;

    if (placement === 'banner') {
        return (
            <div className={`relative w-full ${className}`}>
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${currentAd.bgGradient} border ${currentAd.borderColor} p-4`}>
                    <button
                        onClick={() => setDismissed(true)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-slate-800/50 text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <X size={14} />
                    </button>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-500 mb-1">โฆษณา</div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentAd.title}</h4>
                            <p className="text-slate-400 text-xs mt-1 line-clamp-1">{currentAd.description}</p>
                        </div>
                        <a
                            href={currentAd.url}
                            className={`flex-shrink-0 px-4 py-2 bg-gradient-to-r ${currentAd.ctaColor} text-white text-xs font-bold rounded-lg hover:scale-105 transition-all flex items-center gap-1`}
                        >
                            {currentAd.cta}
                            <ExternalLink size={12} />
                        </a>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <Crown size={10} className="text-purple-400" />
                        <span className="text-[10px] text-purple-400">Premium สมาชิกไม่เห็นโฆษณา</span>
                    </div>
                </div>
            </div>
        );
    }

    // Inline placement (default)
    return (
        <div className={`relative ${className}`}>
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${currentAd.bgGradient} border ${currentAd.borderColor} p-5`}>
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/50 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X size={14} />
                </button>
                <div className="text-xs text-slate-500 mb-2">โฆษณา</div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{currentAd.title}</h4>
                <p className="text-slate-400 text-sm mb-4">{currentAd.description}</p>
                <div className="flex items-center justify-between">
                    <a
                        href={currentAd.url}
                        className={`px-5 py-2.5 bg-gradient-to-r ${currentAd.ctaColor} text-white text-sm font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2`}
                    >
                        {currentAd.cta}
                        <ExternalLink size={14} />
                    </a>
                    <div className="flex items-center gap-1">
                        <Crown size={12} className="text-purple-400" />
                        <span className="text-xs text-purple-400">ไม่มีโฆษณาด้วย Premium</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
