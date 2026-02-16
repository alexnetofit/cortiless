'use client'

import { useState, useEffect, useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'
import { PLANS, PlanKey } from '@/lib/plans'

interface PricingStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  sessionId: string | null
}

export default function PricingStep({ step, answers, sessionId }: PricingStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('3-month')
  const [timeLeft, setTimeLeft] = useState(600)
  const [loading, setLoading] = useState(false)
  const [planMode, setPlanMode] = useState<'full' | 'light'>('full')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // Body type image/data mapping
  const bodyTypeImages: Record<string, string> = {
    regular: '/images/regular.png',
    flabby: '/images/flabby.png',
    'muffin-top': '/images/muffin-top.png',
    overweight: '/images/overweight.png',
    obese: '/images/obese.png',
  }
  const targetTypeImages: Record<string, string> = {
    curvy: '/images/meta-1.png',
    regular: '/images/meta-2.png',
    flat: '/images/meta-3.png',
    fit: '/images/meta-4.png',
    athletic: '/images/meta-5.png',
  }
  const bodyFatData: Record<string, { fat: string; dots: number }> = {
    regular: { fat: '25%', dots: 3 },
    flabby: { fat: '30%', dots: 3 },
    'muffin-top': { fat: '33%', dots: 3 },
    overweight: { fat: '36%', dots: 2 },
    obese: { fat: '40%', dots: 2 },
  }
  const targetFatData: Record<string, { fat: string; dots: number }> = {
    curvy: { fat: '22%', dots: 4 },
    regular: { fat: '20%', dots: 4 },
    flat: { fat: '18%', dots: 5 },
    fit: { fat: '15%', dots: 5 },
    athletic: { fat: '12%', dots: 5 },
  }

  const { currentWeight, targetWeight, unit, currentBodyType, targetBodyType } = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    const desiredData = answers['desired-weight'] as Record<string, string> | undefined
    const isImperial = weightData?.unit === 'imperial'
    let cw = 78
    let tw = 63
    if (weightData) {
      cw = parseFloat(weightData.weight || '78')
    }
    if (desiredData) {
      tw = parseFloat(desiredData.desired_weight || desiredData.weight || '63')
    }
    const cbt = (answers['current-body-type'] as string) || 'flabby'
    const tbt = (answers['target-body-type'] as string) || 'fit'
    return {
      currentWeight: Math.round(cw),
      targetWeight: Math.round(tw),
      unit: isImperial ? 'lbs' : 'kg',
      currentBodyType: cbt,
      targetBodyType: tbt,
    }
  }, [answers])

  const currentImage = bodyTypeImages[currentBodyType] || '/images/flabby.png'
  const targetImage = targetTypeImages[targetBodyType] || '/images/meta-4.png'
  const currentFat = bodyFatData[currentBodyType] || { fat: '30%', dots: 3 }
  const targetFat = targetFatData[targetBodyType] || { fat: '15%', dots: 5 }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const email = localStorage.getItem('quiz_email') || ''
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email, sessionId }),
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

  const features = [
    { icon: '🎯', color: 'bg-pink-100', title: 'A full personalized weight loss plan', desc: 'Beyond cortisol management' },
    { icon: '🍽️', color: 'bg-purple-100', title: 'A customized meal plan', desc: 'Based on your preferences and goals' },
    { icon: '📊', color: 'bg-blue-100', title: "Cortisol-based approach to women's health", desc: 'Healthy hormone balance' },
    { icon: '✅', color: 'bg-green-100', title: 'A daily action plan to improve your health', desc: 'Step by step guidance' },
    { icon: '🏋️', color: 'bg-orange-100', title: 'Our 12-week fitness program', desc: 'Gentle yet effective exercises' },
    { icon: '💧', color: 'bg-cyan-100', title: 'Progress tracker & daily reminders', desc: 'Stay motivated and consistent' },
  ]

  const testimonials = [
    { name: 'Sarah M.', age: 52, color: 'bg-orange-400', text: "I've tried everything and this is the first program that actually addresses WHY I couldn't lose weight. Down 15 lbs in 8 weeks!" },
    { name: 'Jennifer K.', age: 47, color: 'bg-yellow-500', text: "The meal plans are so easy to follow. I'm sleeping better and my energy is through the roof. Best investment I've made." },
    { name: 'Linda R.', age: 55, color: 'bg-rose-400', text: "Finally something designed for women my age. The cortisol approach makes so much sense. I feel like a new person." },
  ]

  const faqs = [
    { q: 'Is this program safe?', a: 'Yes! Our program is designed by certified nutritionists and fitness coaches. It focuses on natural cortisol management through diet, exercise, and lifestyle changes. Always consult your doctor before starting any new program.' },
    { q: 'Why is this different from other diets?', a: 'We focus on cortisol management, which is the root cause of weight gain in women over 40. Traditional diets ignore hormonal balance and often lead to yo-yo dieting.' },
    { q: "What if it doesn't work for me?", a: "We offer a 30-day money-back guarantee. If you're not satisfied with the program, we'll refund your purchase - no questions asked." },
  ]

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Sticky timer bar */}
      <div className="sticky top-0 z-50 bg-secondary text-white py-2.5 px-4 flex items-center justify-center gap-3">
        <div className="bg-emerald-500 text-white font-mono font-bold px-3 py-1 rounded-lg text-lg tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <span className="text-sm font-medium">Reserved price expires soon!</span>
        <button
          onClick={handleCheckout}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
        >
          Get my plan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto px-5 py-6">

          {/* Before / After comparison */}
          <div className="bg-accent rounded-2xl p-4 mb-6">
            {/* Labels */}
            <div className="flex mb-3">
              <div className="flex-1 text-center">
                <p className="font-bold text-secondary text-lg">Now</p>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="flex-1 text-center">
                <p className="font-bold text-emerald-600 text-lg italic">After the plan</p>
              </div>
            </div>

            {/* Images side by side */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 rounded-xl overflow-hidden bg-white h-48">
                <img src={currentImage} alt="Current body" className="w-full h-full object-contain object-bottom" />
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-white h-48">
                <img src={targetImage} alt="Target body" className="w-full h-full object-contain object-bottom" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex">
              <div className="flex-1 pl-2">
                <p className="font-bold text-secondary text-sm">Body fat</p>
                <p className="text-secondary text-xl font-bold">{currentFat.fat}</p>
                <p className="font-bold text-secondary text-sm mt-2">Healthy weight</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i <= currentFat.dots ? 'bg-primary' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="flex-1 pl-4">
                <p className="font-bold text-secondary text-sm">Body fat</p>
                <p className="text-emerald-600 text-xl font-bold">{targetFat.fat}</p>
                <p className="font-bold text-secondary text-sm mt-2">Healthy weight</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i <= targetFat.dots ? 'bg-primary' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-secondary text-center mb-4">
            Choose <span className="text-primary">Your Plan</span>
          </h3>

          {/* Plan mode toggle */}
          <div className="flex justify-center mb-5">
            <div className="bg-gray-100 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setPlanMode('full')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  planMode === 'full' ? 'bg-white shadow-md text-secondary' : 'text-muted'
                }`}
              >
                <span>🔥</span> Full weight loss
              </button>
              <button
                onClick={() => setPlanMode('light')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  planMode === 'light' ? 'bg-white shadow-md text-secondary' : 'text-muted'
                }`}
              >
                <span>🌿</span> Light weight loss
              </button>
            </div>
          </div>

          {/* Green banner */}
          <div className="bg-emerald-500 text-white text-center py-3 rounded-2xl mb-5 font-semibold">
            What is waiting for you inside?
          </div>

          {/* Plan cards */}
          <div className="flex flex-col gap-3 mb-4">
            {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
              const plan = PLANS[planKey]
              const isSelected = selectedPlan === planKey

              return (
                <button
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`relative w-full rounded-2xl p-4 flex items-center justify-between border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-secondary">{plan.name}</p>
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
          <p className="text-center text-sm text-muted mb-5">
            30-day money-back guarantee
          </p>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg text-lg mb-10"
          >
            {loading ? 'Processing...' : 'Get my plan'}
          </button>

          {/* Features section */}
          <h3 className="text-lg font-bold text-secondary text-center mb-6">
            Easy-to-use app to get your weight loss goal
          </h3>

          <div className="space-y-3 mb-10">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div>
                  <p className="text-secondary font-semibold text-sm">{feature.title}</p>
                  <p className="text-muted text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Media logos */}
          <div className="text-center mb-10">
            <p className="text-lg font-bold text-secondary mb-4">Our program and coaches featured in</p>
            <img src="/images/forbes.avif" alt="Featured in media" className="w-full max-w-sm mx-auto" />
          </div>

          {/* Testimonials */}
          <div className="bg-amber-50 rounded-2xl p-6 mb-10">
            <h4 className="text-lg font-bold text-secondary text-center mb-5">
              What our members say about us
            </h4>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-secondary font-semibold text-sm">{t.name}</p>
                      <p className="text-muted text-xs">Age {t.age}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h4 className="text-lg font-bold text-secondary text-center mb-5">
              What members often ask
            </h4>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-secondary font-medium pr-4">
                      <span className="text-primary mr-2">▸</span>
                      {faq.q}
                    </span>
                    <svg
                      className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <p className="text-muted text-sm pb-4 pl-6 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 pb-24 text-center">
            <p className="text-xs text-muted mb-2">
              Questions? Contact us at{' '}
              <a href="mailto:support@cortiless.com" className="text-primary hover:underline">
                support@cortiless.com
              </a>
            </p>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Cortiless Health. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-5 py-3 z-50">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-full transition-all shadow-lg text-lg"
        >
          {loading ? 'Processing...' : `Get my plan - ${PLANS[selectedPlan].priceDisplay}`}
        </button>
      </div>
    </div>
  )
}
