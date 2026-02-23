-- Create activity_log table for tracking user activities
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,        -- 'tarot_reading', 'meditation', 'journal', 'zodiac_report', 'rune_reading', 'lotto'
    title TEXT NOT NULL,       -- e.g. 'อ่านไพ่ The Fool', 'ทำสมาธิ 15 นาที'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_activity_log_type ON activity_log(type);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
    ON activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
    ON activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);
