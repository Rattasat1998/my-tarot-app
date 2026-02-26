import { supabase } from '../lib/supabase';

/**
 * Send chat messages to the fortune-teller Edge Function
 * @param {Array<{role: 'user'|'model', text: string}>} messages - Chat history
 * @returns {Promise<string>} AI reply text
 */
export const askFortuneTeller = async (messages, gender = 'female') => {
    const { data, error } = await supabase.functions.invoke('fortune-teller', {
        body: { messages, gender },
    });

    if (error) {
        console.error('Fortune teller invoke error:', error);
        throw new Error('ไม่สามารถเชื่อมต่อหมอดูได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    }

    if (data?.error) {
        console.error('Fortune teller API error:', data.error);
        throw new Error(data.error);
    }

    return data?.reply || 'ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้ 🙏';
};

// ─── Session Management ───

/**
 * Create a new fortune session in Supabase
 */
export const createSession = async ({ isPremiumSession, creditCost, messages }) => {
    const { data, error } = await supabase
        .from('fortune_sessions')
        .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            messages: messages || [],
            is_premium_session: isPremiumSession || false,
            credit_cost: creditCost || 0,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating fortune session:', error);
        return null;
    }
    return data.id;
};

/**
 * Update session messages (append new messages)
 */
export const updateSessionMessages = async (sessionId, messages) => {
    if (!sessionId) return;

    const { error } = await supabase
        .from('fortune_sessions')
        .update({
            messages,
            updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

    if (error) {
        console.error('Error updating fortune session:', error);
    }
};

/**
 * Get recent fortune sessions for the current user
 */
export const getRecentSessions = async (limit = 20) => {
    const { data, error } = await supabase
        .from('fortune_sessions')
        .select('id, messages, is_premium_session, credit_cost, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching fortune sessions:', error);
        return [];
    }
    return data || [];
};

/**
 * Get today's premium session count
 */
export const getPremiumCountToday = async () => {
    const { data, error } = await supabase.rpc('get_premium_fortune_count_today');

    if (error) {
        console.error('Error getting premium count:', error);
        return 0;
    }
    return data || 0;
};

/**
 * Get an active (incomplete) session from today
 * A session is active if user has sent fewer than maxMessages user messages
 */
export const getActiveSession = async (maxMessages = 3) => {
    // Get today's start in Bangkok timezone
    const now = new Date();
    const bangkokOffset = 7 * 60; // UTC+7
    const localDate = new Date(now.getTime() + bangkokOffset * 60 * 1000);
    const todayStart = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
    todayStart.setMinutes(todayStart.getMinutes() - bangkokOffset);

    const { data, error } = await supabase
        .from('fortune_sessions')
        .select('id, messages, is_premium_session, credit_cost, created_at')
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

    if (error || !data || data.length === 0) return null;

    const session = data[0];
    const userMsgCount = (session.messages || []).filter(m => m.role === 'user').length;

    if (userMsgCount < maxMessages) {
        return { ...session, messagesUsed: userMsgCount };
    }
    return null;
};
