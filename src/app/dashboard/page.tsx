'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface UserProfile {
  full_name: string
  weight_kg: number
  target_weight_kg: number
  plan_type: string
  plan_expires_at: string
}

interface WaterData {
  glasses: number
  goal: number
}

export default function DashboardHome() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [waterToday, setWaterToday] = useState<WaterData>({ glasses: 0, goal: 8 })
  const [latestWeight, setLatestWeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Load today's water
      const today = new Date().toISOString().split('T')[0]
      const { data: waterData } = await supabase
        .from('water_intake')
        .select('glasses, goal')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (waterData) setWaterToday(waterData)

      // Load latest weight
      const { data: progressData } = await supabase
        .from('progress_entries')
        .select('weight_kg')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()

      if (progressData) setLatestWeight(progressData.weight_kg)

      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const currentWeight = latestWeight || profile?.weight_kg || 0
  const targetWeight = profile?.target_weight_kg || 0
  const weightDiff = currentWeight - targetWeight
  const waterPercentage = Math.min((waterToday.glasses / waterToday.goal) * 100, 100)

  const daysLeft = profile?.plan_expires_at
    ? Math.max(0, Math.ceil((new Date(profile.plan_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="pb-20 md:pb-0">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-muted">Here&apos;s your daily overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Weight card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-medium mb-1">Current Weight</p>
          <p className="text-3xl font-bold text-secondary">{currentWeight}<span className="text-sm text-muted ml-1">kg</span></p>
          {weightDiff > 0 && (
            <p className="text-xs text-primary mt-1">-{weightDiff.toFixed(1)} kg to go</p>
          )}
        </div>

        {/* Water card */}
        <Link href="/dashboard/water" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-muted font-medium mb-1">Water Today</p>
          <p className="text-3xl font-bold text-blue-500">{waterToday.glasses}<span className="text-sm text-muted ml-1">/ {waterToday.goal}</span></p>
          <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${waterPercentage}%` }} />
          </div>
        </Link>

        {/* Plan card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-medium mb-1">Your Plan</p>
          <p className="text-lg font-bold text-secondary capitalize">{profile?.plan_type?.replace('-', ' ')}</p>
          <p className="text-xs text-muted">{daysLeft} days remaining</p>
        </div>

        {/* Target card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-muted font-medium mb-1">Target Weight</p>
          <p className="text-3xl font-bold text-success">{targetWeight}<span className="text-sm text-muted ml-1">kg</span></p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-secondary mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
        <Link href="/dashboard/progress" className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <p className="font-semibold text-secondary">Log Your Weight</p>
            <p className="text-sm text-muted">Track your progress daily</p>
          </div>
        </Link>

        <Link href="/dashboard/plan" className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <p className="font-semibold text-secondary">Today&apos;s Meal Plan</p>
            <p className="text-sm text-muted">See what to eat today</p>
          </div>
        </Link>

        <Link href="/dashboard/water" className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💧</span>
          </div>
          <div>
            <p className="font-semibold text-secondary">Log Water Intake</p>
            <p className="text-sm text-muted">{waterToday.glasses}/{waterToday.goal} glasses today</p>
          </div>
        </Link>
      </div>

      {/* Cortisol tip */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6">
        <h3 className="font-bold text-secondary mb-2">💡 Daily Cortisol Tip</h3>
        <p className="text-sm text-muted leading-relaxed">
          Try a 10-minute morning walk to naturally lower cortisol levels. Morning sunlight helps regulate your circadian rhythm and supports healthy hormone balance.
        </p>
      </div>
    </div>
  )
}
