import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const DAILY_FREE_CREDIT_KEY = 'tarot_daily_free_last_used';
const CREDIT_BALANCE_KEY = 'tarot_credit_balance';

export const useCredits = () => {
    const { user } = useAuth();

    // Separate state for guest (local) and user (remote)
    const [localCredits, setLocalCredits] = useState(() => {
        const saved = localStorage.getItem(CREDIT_BALANCE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    });

    const [remoteCredits, setRemoteCredits] = useState(0);
    const [isDailyFreeAvailable, setIsDailyFreeAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Derived state: what to show?
    const credits = user ? remoteCredits : localCredits;

    // Check if daily free is available (Local Logic)
    const checkDailyFreeLocal = useCallback(() => {
        const lastUsed = localStorage.getItem(DAILY_FREE_CREDIT_KEY);
        if (!lastUsed) {
            setIsDailyFreeAvailable(true);
            return;
        }

        const lastDate = new Date(parseInt(lastUsed, 10));
        const now = new Date();

        const isDifferentDay = lastDate.getDate() !== now.getDate() ||
            lastDate.getMonth() !== now.getMonth() ||
            lastDate.getFullYear() !== now.getFullYear();

        setIsDailyFreeAvailable(isDifferentDay);
    }, []);

    // Fetch from Supabase
    const fetchRemoteData = useCallback(async () => {
        if (!user) {
            setRemoteCredits(0);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Get Credits
            const { data: creditData, error: creditError } = await supabase.rpc('get_my_credits');
            if (creditError) throw creditError;
            setRemoteCredits(creditData);

            // Check Daily Free status via Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('last_free_draw_at')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') throw profileError;

            if (profile) {
                const lastDraw = profile.last_free_draw_at ? new Date(profile.last_free_draw_at) : null;
                if (!lastDraw) {
                    setIsDailyFreeAvailable(true);
                } else {
                    const now = new Date();
                    const isDifferentDay = lastDraw.getDate() !== now.getDate() ||
                        lastDraw.getMonth() !== now.getMonth() ||
                        lastDraw.getFullYear() !== now.getFullYear();
                    setIsDailyFreeAvailable(isDifferentDay);
                }
            }
        } catch (err) {
            console.error('Error fetching user credits:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Initial check and interval check
    useEffect(() => {
        if (user) {
            fetchRemoteData();
        } else {
            checkDailyFreeLocal();
        }

        const interval = setInterval(() => {
            if (user) fetchRemoteData();
            else checkDailyFreeLocal();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkDailyFreeLocal, fetchRemoteData, user]);

    // Save LOCAL credits to local storage (only when guest)
    useEffect(() => {
        if (!user) {
            localStorage.setItem(CREDIT_BALANCE_KEY, localCredits.toString());
        }
    }, [localCredits, user]);

    const addCredits = useCallback(async (amount) => {
        if (user) {
            // Call Supabase RPC
            try {
                const { data, error } = await supabase.rpc('add_credits', { amount });
                if (error) throw error;
                setRemoteCredits(data); // Update remote state
            } catch (err) {
                console.error('Error adding credits:', err);
            }
        } else {
            // Local Storage
            setLocalCredits(prev => prev + amount);
        }
    }, [user]);

    const useCredit = useCallback(async (cost, isDaily = false) => {
        if (user) {
            // Call Supabase RPC
            try {
                const { data, error } = await supabase.rpc('deduct_credit', {
                    cost: cost,
                    check_daily_limit: isDaily
                });

                if (error) throw error;

                if (data.success) {
                    await fetchRemoteData();
                    return { success: true };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (err) {
                console.error('Error using credit:', err);
                return { success: false, message: err.message };
            }
        } else {
            // Local Guest Logic
            if (isDaily) {
                // Check if played today
                if (!isDailyFreeAvailable) { // This variable name maps to "Is Daily Available"
                    return { success: false, message: 'Daily reading allowed once per day' };
                }
                // Mark as used
                localStorage.setItem(DAILY_FREE_CREDIT_KEY, Date.now().toString());
                checkDailyFreeLocal();
            }

            // Check balance
            if (localCredits < cost) {
                // For guests, maybe we allow 1 free Daily but other types need... wait, Guests have 0 credits usually?
                // Unless we gave them starting credits. User didn't specify Guest behavior.
                // Assuming Guest works same as User but with local credits.
                return { success: false, message: 'Insufficient credits' };
            }

            setLocalCredits(prev => prev - cost);
            return { success: true };
        }
    }, [user, localCredits, isDailyFreeAvailable, checkDailyFreeLocal, fetchRemoteData]);

    // Async function for checking daily free (used by App.jsx)
    const checkDailyFree = useCallback(async () => {
        if (user) {
            await fetchRemoteData();
            return isDailyFreeAvailable;
        } else {
            checkDailyFreeLocal();
            return isDailyFreeAvailable;
        }
    }, [user, fetchRemoteData, checkDailyFreeLocal, isDailyFreeAvailable]);

    return {
        credits, // derived based on auth state
        isLoading,
        addCredits,
        isDailyFreeAvailable,
        useCredit,
        checkDailyFree
    };
};

