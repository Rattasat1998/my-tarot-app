import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../../hooks/usePremium';
import { PremiumUpgradeModal } from './PremiumUpgradeModal';

export const PremiumGate = ({ 
    children, 
    feature, 
    fallback = null, 
    showUpgradeButton = true,
    useFallbackWhenLocked = false,
    className = ""
}) => {
    const navigate = useNavigate();
    const { isPremium, isLoading, premiumFeatures } = usePremium();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const openUpgradeDialog = useCallback((event) => {
        if (!showUpgradeButton) return;
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setShowUpgradeModal(true);
    }, [showUpgradeButton]);

    const closeUpgradeDialog = useCallback(() => {
        setShowUpgradeModal(false);
    }, []);

    const handleUpgrade = useCallback(() => {
        setShowUpgradeModal(false);
        navigate('/membership');
    }, [navigate]);

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

    const lockedContent = useFallbackWhenLocked && fallback ? fallback : children;
    return (
        <>
            <div
                className={className}
                onClickCapture={openUpgradeDialog}
                onSubmitCapture={openUpgradeDialog}
            >
                {lockedContent}
            </div>
            <PremiumUpgradeModal
                isOpen={showUpgradeModal}
                onClose={closeUpgradeDialog}
                onUpgrade={handleUpgrade}
                isDark={true}
            />
        </>
    );
};
