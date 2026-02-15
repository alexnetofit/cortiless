import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const SCHEMA_QUERIES = [
  // Quiz sessions
  `CREATE TABLE IF NOT EXISTS quiz_sessions (
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
  )`,
  // User profiles
  `CREATE TABLE IF NOT EXISTS user_profiles (
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
  )`,
  // Onboarding
  `CREATE TABLE IF NOT EXISTS user_onboarding (
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
  )`,
  // Progress
  `CREATE TABLE IF NOT EXISTS progress_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
  )`,
  // Water intake
  `CREATE TABLE IF NOT EXISTS water_intake (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    glasses INT DEFAULT 0,
    goal INT DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
  )`,
  // Meal plans
  `CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    week_number INT,
    day_of_week INT,
    meal_type TEXT,
    title TEXT,
    description TEXT,
    calories INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
]

export async function POST() {
  try {
    const supabase = createAdminClient()
    
    // Test connection by trying to insert into quiz_sessions
    const { error: testError } = await supabase
      .from('quiz_sessions')
      .select('id')
      .limit(1)
    
    if (testError && testError.code === '42P01') {
      // Tables don't exist yet - need to run schema via SQL editor
      return NextResponse.json({
        success: false,
        message: 'Tables do not exist yet. Please run the supabase-schema.sql file in the Supabase SQL Editor at: https://supabase.com/dashboard/project/qlfieymaalnemmnhxgti/sql',
        sqlFile: 'supabase-schema.sql'
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables already exist!' 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}
