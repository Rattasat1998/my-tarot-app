import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const usePremium = () => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (!user) {
                setIsPremium(false);
                setIsLoading(false);
                return;
            }

            try {
                // TODO: Check with Supabase/Backend for premium status
                // For now, simulate premium check
                const userMetadata = user?.user_metadata || {};
                const premiumStatus = userMetadata.is_premium || userMetadata.subscription_status === 'active';

                setIsPremium(premiumStatus);
            } catch (error) {
                console.error('Error checking premium status:', error);
                setIsPremium(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkPremiumStatus();
    }, [user]);

    const requirePremium = (callback, fallbackCallback) => {
        if (isLoading) return;

        if (isPremium) {
            callback();
        } else {
            if (fallbackCallback) {
                fallbackCallback();
            } else {
                // Show upgrade modal
                window.dispatchEvent(new CustomEvent('showPremiumUpgrade'));
            }
        }
    };

    const premiumFeatures = {
        unlimitedReadings: isPremium,
        premiumMeditation: isPremium,
        monthlyZodiacReports: isPremium,
        personalGrowthJournal: isPremium,
        prioritySupport: isPremium,
        adFree: isPremium,
        lottoInsight: true
    };

    return {
        isPremium,
        isLoading,
        requirePremium,
        premiumFeatures
    };
};
