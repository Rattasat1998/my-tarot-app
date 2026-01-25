-- Add streak tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS streak_count int DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date timestamptz;

-- Function to check and update daily streak
CREATE OR REPLACE FUNCTION check_daily_login()
RETURNS json AS $$
DECLARE
  u_id uuid := auth.uid();
  p_streak int;
  p_last_active timestamptz;
  p_credits int;
  
  now_time timestamptz := now();
  bangkok_time timestamptz := now() AT TIME ZONE 'Asia/Bangkok';
  last_active_bangkok date;
  today_bangkok date := date(bangkok_time);
  
  new_streak int;
  reward_amount int := 0;
  is_first_login_today boolean := false;
BEGIN
  -- Get current profile data
  SELECT streak_count, last_active_date, credits 
  INTO p_streak, p_last_active, p_credits
  FROM public.profiles 
  WHERE id = u_id;

  -- Default nulls
  p_streak := COALESCE(p_streak, 0);
  
  IF p_last_active IS NULL THEN
    -- First time ever
    new_streak := 1;
    is_first_login_today := true;
  ELSE
    last_active_bangkok := date(p_last_active AT TIME ZONE 'Asia/Bangkok');
    
    IF last_active_bangkok = today_bangkok THEN
      -- Already logged in today
      return json_build_object(
        'success', true,
        'streak', p_streak,
        'reward', 0,
        'first_login_today', false
      );
    ELSIF last_active_bangkok = (today_bangkok - interval '1 day') THEN
      -- Consecutive day
      new_streak := p_streak + 1;
      is_first_login_today := true;
    ELSE
      -- Streak broken
      new_streak := 1;
      is_first_login_today := true;
    END IF;
  END IF;

  -- Calculate Reward (Every 7 days)
  IF new_streak > 0 AND (new_streak % 7) = 0 THEN
     reward_amount := 20; -- Give 20 credits
  END IF;

  -- Update Profile
  UPDATE public.profiles
  SET 
    streak_count = new_streak,
    last_active_date = now(),
    credits = credits + reward_amount
  WHERE id = u_id;

  RETURN json_build_object(
    'success', true,
    'streak', new_streak,
    'reward', reward_amount,
    'first_login_today', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
