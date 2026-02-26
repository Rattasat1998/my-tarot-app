-- Create fortune_sessions table for fortune teller chat history
CREATE TABLE IF NOT EXISTS fortune_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL DEFAULT '[]',
    is_premium_session BOOLEAN DEFAULT false,
    credit_cost INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fortune_sessions_user_id ON fortune_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_fortune_sessions_created_at ON fortune_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fortune_sessions_user_date ON fortune_sessions(user_id, created_at);

-- Enable RLS
ALTER TABLE fortune_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view own fortune sessions"
        ON fortune_sessions FOR SELECT
        USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own fortune sessions"
        ON fortune_sessions FOR INSERT
        WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own fortune sessions"
        ON fortune_sessions FOR UPDATE
        USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Function: count today's premium sessions for a user
CREATE OR REPLACE FUNCTION get_premium_fortune_count_today()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO session_count
    FROM fortune_sessions
    WHERE user_id = auth.uid()
      AND is_premium_session = true
      AND created_at >= (CURRENT_DATE AT TIME ZONE 'Asia/Bangkok');
    
    RETURN session_count;
END;
$$;
