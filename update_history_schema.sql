-- Add note column to reading_history
ALTER TABLE public.reading_history 
ADD COLUMN IF NOT EXISTS note text;

-- Policy ensures users can update their own notes (if needed later)
DROP POLICY IF EXISTS "Users can update own reading history." ON public.reading_history;
CREATE POLICY "Users can update own reading history." ON public.reading_history
  FOR UPDATE USING (auth.uid() = user_id);
