-- 1. Function to GET status (Read-only)
CREATE OR REPLACE FUNCTION get_daily_checkin_status()
RETURNS json AS $$
DECLARE
  u_id uuid := auth.uid();
  p_streak int;
  p_last_active timestamptz;
  bangkok_time timestamptz := now() AT TIME ZONE 'Asia/Bangkok';
  last_active_bangkok date;
  today_bangkok date := date(bangkok_time);
  
  -- Variables for logic
  current_cycle_streak int;
  checked_in_today boolean := false;
  is_streak_broken boolean := false;
BEGIN
  SELECT streak_count, last_active_date INTO p_streak, p_last_active
  FROM public.profiles WHERE id = u_id;
  
  p_streak := COALESCE(p_streak, 0);
  
  IF p_last_active IS NULL THEN
    is_streak_broken := true;
    current_cycle_streak := 0;
  ELSE
    last_active_bangkok := date(p_last_active AT TIME ZONE 'Asia/Bangkok');
    
    IF last_active_bangkok = today_bangkok THEN
      checked_in_today := true;
      current_cycle_streak := p_streak;
    ELSIF last_active_bangkok = (today_bangkok - interval '1 day') THEN
      checked_in_today := false;
      current_cycle_streak := p_streak;
    ELSE
      checked_in_today := false;
      is_streak_broken := true;
      current_cycle_streak := 0;
    END IF;
  END IF;

  RETURN json_build_object(
    'streak', current_cycle_streak,
    'checked_in_today', checked_in_today,
    'is_streak_broken', is_streak_broken
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Function to CLAIM (Write) - Modified from check_daily_login
CREATE OR REPLACE FUNCTION claim_daily_checkin()
RETURNS json AS $$
DECLARE
  u_id uuid := auth.uid();
  p_streak int;
  p_last_active timestamptz;
  
  now_time timestamptz := now();
  bangkok_time timestamptz := now() AT TIME ZONE 'Asia/Bangkok';
  last_active_bangkok date;
  today_bangkok date := date(bangkok_time);
  
  new_streak int;
  reward_amount int := 0;
BEGIN
  -- Re-check logic inside transaction to be safe
  SELECT streak_count, last_active_date INTO p_streak, p_last_active
  FROM public.profiles WHERE id = u_id FOR UPDATE; -- Add locking
  
  p_streak := COALESCE(p_streak, 0);
  
  IF p_last_active IS NOT NULL THEN
     last_active_bangkok := date(p_last_active AT TIME ZONE 'Asia/Bangkok');
     IF last_active_bangkok = today_bangkok THEN
        -- Already checked in
        RETURN json_build_object('success', false, 'message', 'Already checked in today');
     END IF;
     
     IF last_active_bangkok = (today_bangkok - interval '1 day') THEN
        new_streak := p_streak + 1;
     ELSE
        new_streak := 1;
     END IF;
  ELSE
     new_streak := 1;
  END IF;

  -- Daily reward: 1 credit every day
  reward_amount := 1;
  
  -- Bonus: Day 7 (every 7 days) gives 3 extra credits (total 4)
  IF (new_streak % 7) = 0 THEN
     reward_amount := reward_amount + 3;
  END IF;

  UPDATE public.profiles
  SET streak_count = new_streak, last_active_date = now(), credits = credits + reward_amount
  WHERE id = u_id;

  RETURN json_build_object(
    'success', true,
    'streak', new_streak,
    'reward', reward_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
