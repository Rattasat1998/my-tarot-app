import React from 'react';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';

export const PremiumGate = ({ 
    children, 
    feature, 
    fallback = null, 
    showUpgradeButton = true,
    className = ""
}) => {
    const { isPremium, isLoading, requirePremium, premiumFeatures } = usePremium();

    const handleUpgrade = () => {
        window.dispatchEvent(new CustomEvent('showPremiumUpgrade'));
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Check if user has access to this feature
    const hasAccess = premiumFeatures[feature] || isPremium;

    if (hasAccess) {
        return <>{children}</>;
    }

    // Show fallback or upgrade prompt
    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className={`relative ${className}`}>
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                <div className="text-center p-6">
                    {/* Lock Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 mb-4">
                        <Lock className="w-8 h-8 text-purple-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-400" />
                        Premium Feature
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 mb-6 max-w-sm">
                        นี่คือฟีเจอร์พิเศษสำหรับสมาชิก Premium เท่านั้น
                    </p>

                    {/* Upgrade Button */}
                    {showUpgradeButton && (
                        <button
                            onClick={handleUpgrade}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2 mx-auto"
                        >
                            <Crown className="w-4 h-4" />
                            อัปเกรดเป็น Premium
                        </button>
                    )}

                    {/* Benefits Preview */}
                    <div className="mt-6 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">
                                ปลดล็อกสิทธิพิเศษทั้งหมด
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blurred Content */}
            <div className="blur-sm opacity-50 pointer-events-none">
                {children}
            </div>
        </div>
    );
};
