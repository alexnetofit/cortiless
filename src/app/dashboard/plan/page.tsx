'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface MealPlan {
  meal_type: string
  title: string
  description: string
  calories: number
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_EMOJIS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export default function MealPlanPage() {
  const [meals, setMeals] = useState<Record<string, MealPlan[]>>({})
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedDay, setSelectedDay] = useState(() => {
    // Default to today's day of week (1=Mon, 7=Sun)
    const day = new Date().getDay()
    return day === 0 ? 7 : day
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('meal_plans')
        .select('meal_type, title, description, calories, day_of_week')
        .eq('user_id', user.id)
        .eq('week_number', selectedWeek)

      if (data) {
        const grouped: Record<string, MealPlan[]> = {}
        data.forEach(meal => {
          const key = String(meal.day_of_week)
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(meal)
        })
        setMeals(grouped)
      }
      setLoading(false)
    }
    load()
  }, [selectedWeek])

  const todaysMeals = meals[String(selectedDay)] || []
  const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold text-secondary mb-6">Meal Plan 🍽️</h1>

      {/* Week selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedWeek === week
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-muted hover:bg-gray-50'
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Day selector */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(i + 1)}
            className={`flex-1 min-w-[45px] px-2 py-3 rounded-xl text-center transition-all ${
              selectedDay === i + 1
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-muted hover:bg-gray-50'
            }`}
          >
            <span className="text-xs font-medium">{day.slice(0, 3)}</span>
          </button>
        ))}
      </div>

      {/* Calorie summary */}
      {todaysMeals.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Total Calories</p>
            <p className="text-2xl font-bold text-secondary">{totalCalories} kcal</p>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      )}

      {/* Meals */}
      {todaysMeals.length > 0 ? (
        <div className="space-y-4">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
            const meal = todaysMeals.find(m => m.meal_type === mealType)
            if (!meal) return null

            return (
              <div key={mealType} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{MEAL_EMOJIS[mealType]}</span>
                  <div>
                    <p className="text-xs text-muted uppercase font-medium tracking-wide">{mealType}</p>
                    <p className="font-bold text-secondary">{meal.title}</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-primary">{meal.calories} kcal</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{meal.description}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-secondary font-semibold mb-2">No meal plan generated yet</p>
          <p className="text-muted text-sm">Complete the onboarding to get your personalized meal plan</p>
        </div>
      )}

      {/* Cortisol nutrition tip */}
      <div className="bg-primary/5 rounded-2xl p-5 mt-6">
        <h3 className="font-bold text-secondary mb-2">🧠 Cortisol & Nutrition</h3>
        <p className="text-sm text-muted leading-relaxed">
          Foods rich in vitamin C (citrus fruits, bell peppers), omega-3 fatty acids (salmon, walnuts), and magnesium (dark chocolate, spinach) can help naturally lower cortisol levels. Your meal plan includes these cortisol-balancing nutrients.
        </p>
      </div>
    </div>
  )
}
