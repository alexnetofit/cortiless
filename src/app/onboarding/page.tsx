'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import { motion, AnimatePresence } from 'framer-motion'

const ONBOARDING_STEPS = [
  {
    id: 'sex',
    title: 'What is your biological sex?',
    subtitle: 'This helps us customize your hormone-based plan',
    type: 'single',
    options: [
      { id: 'female', label: 'Female', emoji: '👩' },
      { id: 'male', label: 'Male', emoji: '👨' },
      { id: 'other', label: 'Prefer not to say', emoji: '🙂' },
    ],
  },
  {
    id: 'dietary_preferences',
    title: 'Any dietary preferences?',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: [
      { id: 'none', label: 'No restrictions', emoji: '🍽️' },
      { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
      { id: 'vegan', label: 'Vegan', emoji: '🌱' },
      { id: 'gluten-free', label: 'Gluten-free', emoji: '🌾' },
      { id: 'dairy-free', label: 'Dairy-free', emoji: '🥛' },
      { id: 'keto', label: 'Keto', emoji: '🥩' },
      { id: 'paleo', label: 'Paleo', emoji: '🦴' },
      { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
    ],
  },
  {
    id: 'foods_liked',
    title: 'Which foods do you enjoy?',
    subtitle: 'We\'ll include these in your meal plan',
    type: 'multi',
    options: [
      { id: 'chicken', label: 'Chicken', emoji: '🍗' },
      { id: 'fish', label: 'Fish & Seafood', emoji: '🐟' },
      { id: 'beef', label: 'Beef', emoji: '🥩' },
      { id: 'eggs', label: 'Eggs', emoji: '🥚' },
      { id: 'tofu', label: 'Tofu & Tempeh', emoji: '🧈' },
      { id: 'rice', label: 'Rice', emoji: '🍚' },
      { id: 'pasta', label: 'Pasta', emoji: '🍝' },
      { id: 'salads', label: 'Salads', emoji: '🥗' },
      { id: 'fruits', label: 'Fruits', emoji: '🍎' },
      { id: 'nuts', label: 'Nuts & Seeds', emoji: '🥜' },
      { id: 'yogurt', label: 'Yogurt', emoji: '🥛' },
      { id: 'smoothies', label: 'Smoothies', emoji: '🥤' },
    ],
  },
  {
    id: 'foods_disliked',
    title: 'Any foods you want to avoid?',
    subtitle: 'We\'ll keep these out of your plan',
    type: 'multi',
    options: [
      { id: 'none', label: 'Nothing - I eat everything!', emoji: '✅' },
      { id: 'seafood', label: 'Seafood', emoji: '🦐' },
      { id: 'mushrooms', label: 'Mushrooms', emoji: '🍄' },
      { id: 'spicy', label: 'Spicy food', emoji: '🌶️' },
      { id: 'pork', label: 'Pork', emoji: '🐷' },
      { id: 'soy', label: 'Soy products', emoji: '🫘' },
      { id: 'raw-vegetables', label: 'Raw vegetables', emoji: '🥒' },
      { id: 'organ-meats', label: 'Organ meats', emoji: '🫀' },
    ],
  },
  {
    id: 'allergies',
    title: 'Do you have any food allergies?',
    subtitle: 'Your safety is our priority',
    type: 'multi',
    options: [
      { id: 'none', label: 'No allergies', emoji: '✅' },
      { id: 'nuts', label: 'Tree nuts', emoji: '🥜' },
      { id: 'peanuts', label: 'Peanuts', emoji: '🥜' },
      { id: 'shellfish', label: 'Shellfish', emoji: '🦞' },
      { id: 'dairy', label: 'Dairy', emoji: '🧀' },
      { id: 'eggs', label: 'Eggs', emoji: '🥚' },
      { id: 'wheat', label: 'Wheat/Gluten', emoji: '🌾' },
      { id: 'soy', label: 'Soy', emoji: '🫘' },
    ],
  },
  {
    id: 'daily_meals',
    title: 'How many meals do you prefer per day?',
    subtitle: 'We\'ll structure your plan accordingly',
    type: 'single',
    options: [
      { id: '2', label: '2 meals', emoji: '🍽️' },
      { id: '3', label: '3 meals', emoji: '🍽️🍽️' },
      { id: '4', label: '3 meals + 1 snack', emoji: '🍽️🍽️🍽️' },
      { id: '5', label: '3 meals + 2 snacks', emoji: '🍽️🍽️🍽️🍽️' },
    ],
  },
  {
    id: 'cooking_time',
    title: 'How much time can you spend cooking?',
    subtitle: 'Per meal, on average',
    type: 'single',
    options: [
      { id: '15min', label: 'Under 15 minutes', emoji: '⚡' },
      { id: '30min', label: '15-30 minutes', emoji: '⏱️' },
      { id: '1h', label: '30-60 minutes', emoji: '👩‍🍳' },
      { id: 'unlimited', label: 'I love cooking!', emoji: '🧑‍🍳' },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const currentStep = ONBOARDING_STEPS[step]
  const isLastStep = step === ONBOARDING_STEPS.length - 1

  const handleSingleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value }
    setAnswers(newAnswers)

    if (isLastStep) {
      submitOnboarding(newAnswers)
    } else {
      setStep(step + 1)
      setSelected([])
    }
  }

  const toggleMultiSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleMultiContinue = () => {
    const newAnswers = { ...answers, [currentStep.id]: selected }
    setAnswers(newAnswers)

    if (isLastStep) {
      submitOnboarding(newAnswers)
    } else {
      setStep(step + 1)
      setSelected([])
    }
  }

  const submitOnboarding = async (finalAnswers: Record<string, unknown>) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const onboardingData = {
        user_id: user.id,
        sex: finalAnswers.sex as string,
        dietary_preferences: finalAnswers.dietary_preferences as string[],
        foods_liked: finalAnswers.foods_liked as string[],
        foods_disliked: finalAnswers.foods_disliked as string[],
        allergies: finalAnswers.allergies as string[],
        daily_meals: parseInt(finalAnswers.daily_meals as string),
        cooking_time: finalAnswers.cooking_time as string,
        completed_at: new Date().toISOString(),
      }

      // Delete any existing onboarding records for this user (avoid duplicates)
      await supabase
        .from('user_onboarding')
        .delete()
        .eq('user_id', user.id)

      // Insert fresh record
      const { error: insertError } = await supabase
        .from('user_onboarding')
        .insert(onboardingData)
      if (insertError) console.error('Onboarding insert error:', insertError)

      router.refresh()
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      // Still try to go to dashboard
      router.refresh()
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBack={step > 0} onBack={() => { setStep(step - 1); setSelected([]) }} />

      {/* Progress */}
      <div className="w-full px-6 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted">Step {step + 1} of {ONBOARDING_STEPS.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-lg w-full"
          >
            <h2 className="text-xl font-bold text-secondary text-center mb-2">
              {currentStep.title}
            </h2>
            <p className="text-muted text-center mb-6 text-sm">{currentStep.subtitle}</p>

            <div className="flex flex-col gap-3">
              {currentStep.options.map((option) => {
                const isSelected = currentStep.type === 'multi'
                  ? selected.includes(option.id)
                  : false

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (currentStep.type === 'single') {
                        handleSingleSelect(option.id)
                      } else {
                        toggleMultiSelect(option.id)
                      }
                    }}
                    className={`w-full rounded-2xl px-5 py-4 flex items-center justify-between transition-all border-2 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-accent border-transparent hover:border-primary/20'
                    }`}
                  >
                    <span className="text-secondary font-medium">{option.label}</span>
                    <span className="text-2xl">{option.emoji}</span>
                  </button>
                )
              })}
            </div>

            {currentStep.type === 'multi' && (
              <button
                onClick={handleMultiContinue}
                disabled={selected.length === 0 || loading}
                className="w-full mt-6 bg-primary hover:bg-primary-dark disabled:bg-primary/40 text-white font-semibold py-4 rounded-full transition-all shadow-lg disabled:shadow-none"
              >
                {loading ? 'Setting up your plan...' : 'Continue'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
