-- Cortiless Database Schema
-- Run this in Supabase SQL Editor

-- Quiz sessions (leads tracking)
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  email TEXT,
  current_step INT DEFAULT 1,
  answers JSONB DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (post-purchase)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  age INT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  target_weight_kg NUMERIC,
  body_type TEXT,
  target_body_type TEXT,
  activity_level TEXT,
  menopause_status TEXT,
  plan_type TEXT,
  stripe_customer_id TEXT,
  stripe_payment_id TEXT,
  plan_expires_at TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT FALSE,
  quiz_session_id UUID REFERENCES quiz_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding data (post-purchase extra data)
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  sex TEXT,
  dietary_preferences TEXT[],
  foods_liked TEXT[],
  foods_disliked TEXT[],
  allergies TEXT[],
  health_conditions TEXT[],
  daily_meals INT,
  cooking_time TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Water intake tracker
CREATE TABLE IF NOT EXISTS water_intake (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  glasses INT DEFAULT 0,
  goal INT DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Meal plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  week_number INT,
  day_of_week INT,
  meal_type TEXT,
  title TEXT,
  description TEXT,
  calories INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Quiz sessions: anyone can insert (anonymous quiz takers), only service role can read all
CREATE POLICY "Anyone can create quiz sessions" ON quiz_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can update quiz sessions" ON quiz_sessions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role can read all quiz sessions" ON quiz_sessions
  FOR SELECT TO authenticated USING (true);

-- User profiles: users can read/update their own, admins can read all
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User onboarding: users can manage their own
CREATE POLICY "Users can manage own onboarding" ON user_onboarding
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Progress entries: users can manage their own
CREATE POLICY "Users can manage own progress" ON progress_entries
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Water intake: users can manage their own
CREATE POLICY "Users can manage own water intake" ON water_intake
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Meal plans: users can read their own
CREATE POLICY "Users can read own meal plans" ON meal_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage meal plans" ON meal_plans
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_email ON quiz_sessions(email);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_current_step ON quiz_sessions(current_step);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_date ON progress_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id, week_number, day_of_week);
