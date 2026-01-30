-- Migration: Add birthdate column to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthdate DATE;

-- Optional: Add comment for documentation
COMMENT ON COLUMN profiles.birthdate IS 'วันเกิดสำหรับคำนวณราศี';
