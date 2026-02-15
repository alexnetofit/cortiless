'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function WaterTrackerPage() {
  const [glasses, setGlasses] = useState(0)
  const [goal, setGoal] = useState(8)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('water_intake')
        .select('glasses, goal')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (data) {
        setGlasses(data.glasses)
        setGoal(data.goal)
      }
      setLoading(false)
    }
    load()
  }, [today])

  const updateGlasses = async (newGlasses: number) => {
    if (!userId) return
    const clamped = Math.max(0, newGlasses)
    setGlasses(clamped)

    await supabase.from('water_intake').upsert({
      user_id: userId,
      date: today,
      glasses: clamped,
      goal,
    }, { onConflict: 'user_id,date' })
  }

  const percentage = Math.min((glasses / goal) * 100, 100)
  const isComplete = glasses >= goal

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold text-secondary mb-6">Water Tracker 💧</h1>

      {/* Main tracker */}
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center mb-6">
        {/* Glass visualization */}
        <div className="relative w-40 h-56 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-b-3xl rounded-t-xl overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500 ease-out"
              style={{ height: `${percentage}%` }}
            >
              {/* Water animation */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-blue-200/50 rounded-full" />
            </div>
          </div>
        </div>

        <p className="text-5xl font-bold text-blue-500 mb-1">{glasses}</p>
        <p className="text-muted mb-6">of {goal} glasses</p>

        {isComplete && (
          <div className="bg-green-50 text-green-700 font-semibold rounded-xl px-4 py-2 mb-4 inline-block">
            🎉 Goal reached! Great job!
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => updateGlasses(glasses - 1)}
            disabled={glasses === 0}
            className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center text-2xl font-bold text-secondary transition-all active:scale-95"
          >
            −
          </button>
          <button
            onClick={() => updateGlasses(glasses + 1)}
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-2xl font-bold transition-all active:scale-95 shadow-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Quick add */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-semibold text-secondary mb-3">Quick Add</h3>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => updateGlasses(glasses + n)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              +{n} 💧
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl p-5">
        <h3 className="font-semibold text-secondary mb-2">Hydration Tips</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li>• Drink a glass of water first thing in the morning</li>
          <li>• Set reminders every 2 hours</li>
          <li>• Add lemon or cucumber for flavor</li>
          <li>• Proper hydration helps regulate cortisol levels</li>
        </ul>
      </div>
    </div>
  )
}
