import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_MEMBERSHIP_PRICING = {
    basePrice: 299,
    discountAmount: 0,
    isDiscountActive: false,
    discountStartsAt: null,
    discountEndsAt: null,
    finalPrice: 299,
};

const mapSettingsToPricing = (settings) => {
    const basePrice = Number(settings?.base_price_baht ?? 299);
    const discountAmount = Number(settings?.discount_amount_baht ?? 0);
    const isWithinEndTime = settings?.discount_ends_at
        ? new Date(settings.discount_ends_at).getTime() > Date.now()
        : false;
    const isDiscountActive = Boolean(settings?.is_discount_active) && isWithinEndTime && discountAmount > 0;
    const finalPrice = isDiscountActive ? Math.max(basePrice - discountAmount, 1) : basePrice;

    return {
        basePrice,
        discountAmount,
        isDiscountActive,
        discountStartsAt: settings?.discount_starts_at || null,
        discountEndsAt: settings?.discount_ends_at || null,
        finalPrice,
    };
};

export const useMembershipPricing = () => {
    const [pricing, setPricing] = useState(DEFAULT_MEMBERSHIP_PRICING);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data, error } = await supabase
                    .from('membership_discount_settings')
                    .select('*')
                    .eq('id', 1)
                    .maybeSingle();

                if (error) throw error;
                setPricing(mapSettingsToPricing(data));
            } catch (error) {
                console.error('Error fetching membership pricing:', error);
                setPricing(DEFAULT_MEMBERSHIP_PRICING);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPricing();
    }, []);

    return { pricing, isLoading };
};

