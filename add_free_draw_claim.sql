-- Add last_free_draw_claimed_at to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_free_draw_claimed_at timestamp with time zone;

-- RPC to claim daily free draw
CREATE OR REPLACE FUNCTION public.claim_daily_free_draw()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_last_claim timestamp with time zone;
    v_now timestamp with time zone;
BEGIN
    v_user_id := auth.uid();
    v_now := now();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    -- Get last claim date
    SELECT last_free_draw_claimed_at INTO v_last_claim
    FROM public.profiles
    WHERE id = v_user_id;

    -- Check if already claimed today
    IF v_last_claim IS NOT NULL AND 
       date_trunc('day', v_last_claim) = date_trunc('day', v_now) THEN
        RETURN json_build_object('success', false, 'message', 'Already claimed today');
    END IF;

    -- Update claim timestamp
    UPDATE public.profiles
    SET last_free_draw_claimed_at = v_now
    WHERE id = v_user_id;

    RETURN json_build_object('success', true, 'claimed_at', v_now);
END;
$$;
