'use client'

import { useState, useEffect, useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'
import { PLANS, PlanKey } from '@/lib/stripe'

interface PricingStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  sessionId: string | null
}

export default function PricingStep({ step, answers, sessionId }: PricingStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('3-month')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [loading, setLoading] = useState(false)
  const [planMode, setPlanMode] = useState<'full' | 'light'>('full')

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const { currentWeight, targetWeight } = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    const desiredData = answers['desired-weight'] as Record<string, string> | undefined
    let cw = 78
    let tw = 63
    if (weightData) {
      const val = parseFloat(weightData.weight || '78')
      cw = weightData.unit === 'imperial' ? Math.round(val * 0.453592) : val
    }
    if (desiredData) {
      const val = parseFloat(desiredData.desired_weight || desiredData.weight || '63')
      tw = desiredData.unit === 'imperial' ? Math.round(val * 0.453592) : val
    }
    return { currentWeight: cw, targetWeight: tw }
  }, [answers])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const email = sessionStorage.getItem('quiz_email') || ''
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          email,
          sessionId,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error creating checkout session. Please try again.')
      }
    } catch {
      alert('Error creating checkout session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Timer bar */}
      <div className="bg-secondary text-white text-center py-2 px-4 flex items-center justify-center gap-3">
        <div className="bg-primary text-white font-mono font-bold px-3 py-1 rounded-lg text-lg">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <span className="text-sm">Reserved price expires soon!</span>
        <button className="bg-success text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-600 transition-colors">
          Get my plan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-lg w-full mx-auto">
          {/* Weight comparison */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-accent rounded-xl flex items-center justify-center mb-2">
                <img src="/images/body-overweight.svg" alt="Now" className="w-16 h-16" />
              </div>
              <p className="text-sm text-muted">Now</p>
              <p className="font-bold text-secondary">{currentWeight} kg</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-accent rounded-xl flex items-center justify-center mb-2">
                <img src="/images/target-fit.svg" alt="After" className="w-16 h-16" />
              </div>
              <p className="text-sm text-muted">After plan</p>
              <p className="font-bold text-primary">{targetWeight} kg</p>
            </div>
          </div>

          {/* Plan mode toggle */}
          <h3 className="text-xl font-bold text-secondary text-center mb-4">
            Choose <span className="text-primary">Your Plan</span>
          </h3>

          <div className="flex justify-center mb-6">
            <div className="bg-accent rounded-full p-1 flex gap-1">
              <button
                onClick={() => setPlanMode('full')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  planMode === 'full' ? 'bg-white shadow text-secondary' : 'text-muted'
                }`}
              >
                Full weight loss
              </button>
              <button
                onClick={() => setPlanMode('light')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  planMode === 'light' ? 'bg-white shadow text-secondary' : 'text-muted'
                }`}
              >
                Light weight loss
              </button>
            </div>
          </div>

          {/* Discount banner */}
          <div className="bg-primary text-white text-center py-2 rounded-xl mb-4 text-sm font-semibold">
            What is waiting for you inside?
          </div>

          {/* Plan options */}
          <div className="flex flex-col gap-3 mb-6">
            {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
              const plan = PLANS[planKey]
              const isSelected = selectedPlan === planKey

              return (
                <button
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`relative w-full rounded-2xl p-4 flex items-center justify-between border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-0.5 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-secondary">{plan.name}</p>
                      <p className="text-xs text-muted">{plan.priceDisplay} total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{plan.perDay}</p>
                    <p className="text-xs text-muted">per day</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Guarantee */}
          <p className="text-center text-sm text-muted mb-4">
            30-day money-back guarantee
          </p>

          {/* Checkout buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              {loading ? 'Processing...' : 'Get my plan'}
            </button>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-secondary text-center mb-6">
              Easy-to-use app to get your weight loss goal
            </h3>

            <div className="space-y-4">
              {[
                { icon: '🎯', title: 'A full personalized weight loss plan', desc: 'Beyond cortisol management' },
                { icon: '🍽️', title: 'A customized meal plan', desc: 'Based on your preferences and goals' },
                { icon: '📊', title: 'Cortisol-based approach to women\'s', desc: 'Healthy hormone balance' },
                { icon: '✅', title: 'A daily action plan to improve your health', desc: 'Step by step guidance' },
                { icon: '📈', title: 'Our 12-week fitness program', desc: 'Gentle yet effective exercises' },
                { icon: '💧', title: 'Progress tracker & daily reminders', desc: 'Stay motivated and consistent' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-accent rounded-xl p-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="text-secondary font-semibold text-sm">{feature.title}</p>
                    <p className="text-muted text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media logos */}
          <div className="text-center mb-8">
            <p className="text-lg font-bold text-secondary mb-4">Our program and coaches featured in</p>
            <div className="flex flex-wrap justify-center gap-3 opacity-50">
              {['Mirror', 'Forbes Health', 'Sky Sports', 'The Guardian', 'Yahoo Finance'].map((name) => (
                <span key={name} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-accent rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold text-secondary text-center mb-4">
              What our members say about us
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Sarah M.', age: 52, text: "I've tried everything and this is the first program that actually addresses WHY I couldn't lose weight. Down 15 lbs in 8 weeks!" },
                { name: 'Jennifer K.', age: 47, text: "The meal plans are so easy to follow. I'm sleeping better and my energy is through the roof. Best investment I've made." },
                { name: 'Linda R.', age: 55, text: "Finally something designed for women my age. The cortisol approach makes so much sense. I feel like a new person." },
              ].map((testimonial, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-secondary font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-muted text-xs">Age {testimonial.age}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-warning">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted text-sm">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-secondary text-center mb-4">
              What members often ask
            </h4>
            {[
              { q: 'Is this program safe?', a: 'Yes! Our program is designed by certified nutritionists and fitness coaches. Always consult your doctor before starting any new program.' },
              { q: 'Why is this different from other diets?', a: 'We focus on cortisol management, which is the root cause of weight gain in women over 40. Traditional diets ignore hormonal balance.' },
              { q: 'What if it doesn\'t work for me?', a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your purchase - no questions asked.' },
            ].map((faq, i) => (
              <details key={i} className="border-b border-gray-200 py-3">
                <summary className="cursor-pointer text-secondary font-medium">{faq.q}</summary>
                <p className="text-muted text-sm mt-2">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-semibold py-4 rounded-full transition-all duration-200 shadow-lg"
            >
              {loading ? 'Processing...' : `Get my plan - ${PLANS[selectedPlan].priceDisplay}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
