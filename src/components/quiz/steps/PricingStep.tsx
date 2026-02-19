'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
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
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSwipe = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeTestimonial < testimonials.length - 1) {
        setActiveTestimonial(prev => prev + 1)
      } else if (diff < 0 && activeTestimonial > 0) {
        setActiveTestimonial(prev => prev - 1)
      }
    }
  }, [activeTestimonial])

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

  const hotmartLinks: Record<PlanKey, string> = {
    '12-month': 'https://pay.hotmart.com/A104536511N?off=cjoznhtv',
    '3-month': 'https://pay.hotmart.com/A104536511N?off=3ydh9ynu',
    '1-month': 'https://pay.hotmart.com/A104536511N?off=wi00e5uy',
  }

  const handleCheckout = () => {
    const email = localStorage.getItem('quiz_email') || ''
    const url = new URL(hotmartLinks[selectedPlan])
    if (email) url.searchParams.set('email', email)
    window.location.href = url.toString()
  }

  const features = [
    { icon: '🌸', color: 'bg-pink-100', title: 'Personalized cortisol cleanse plan', desc: 'Designed specifically for women over 40' },
    { icon: '🍽️', color: 'bg-purple-100', title: 'Customized anti-inflammatory meal plan', desc: 'Recipes that balance your hormones naturally' },
    { icon: '📊', color: 'bg-blue-100', title: 'Hormone & cortisol tracking dashboard', desc: 'Monitor your progress and body changes' },
    { icon: '💧', color: 'bg-cyan-100', title: 'Daily water intake & wellness tracker', desc: 'Build healthy habits that reduce stress' },
    { icon: '🌙', color: 'bg-indigo-100', title: 'Menopause & sleep support guidance', desc: 'Better rest for lower cortisol levels' },
    { icon: '✅', color: 'bg-green-100', title: 'Step-by-step daily action plan', desc: 'Simple changes that transform your body' },
  ]

  const testimonials = [
    { name: 'Theresa', age: 59, image: '/images/depo-1.png', text: "I've been on so many diets, but this plan is truly different. I'm losing my awful menopause belly yet the guidelines are so simple. I'm hooked!" },
    { name: 'Margaret', age: 54, image: '/images/depo-2.png', text: "After menopause I gained 30 lbs and nothing worked. Cortiless helped me understand my cortisol levels and I've already lost 12 lbs in 6 weeks!" },
    { name: 'Susan', age: 48, image: '/images/depo-3.png', text: "The meal plans are so easy to follow. I'm sleeping better and my energy is through the roof. Best investment I've made for my health." },
  ]

  const faqs = [
    { q: 'What will happen after I order?', a: "It will take only a few minutes to set yourself up to start exploring the Cortiless app. Here are 3 simple steps to begin:\n\nStep 1: Get the password and magic link after the purchase\nStep 2: Click on the link to install the Cortiless app\nStep 3: Start your Cortiless journey!" },
    { q: 'When can I start using the program?', a: 'You can access and start using our app immediately after the purchase.' },
    { q: 'Is it appropriate for the beginners?', a: "Cortiless is made with beginners in mind. The whole system is designed to be easy to follow. In case you get lost, you can always reach out to our supportive team of dietitians." },
    { q: 'Do you have a mobile app?', a: 'Yes, Cortiless is available on all mobile devices (Android and iOS). You will receive the link to install your app straight after the purchase.' },
    { q: 'Is it easy to cancel without fee?', a: 'Cancel your subscription any time without hidden fee by contacting our friendly customer support.' },
    { q: 'What do I get when I order?', a: "You get instant access to your personalized cortisol cleanse plan, customized meal plans based on your preferences, a daily wellness tracker, hormone balance guidance, and ongoing support from our team." },
  ]

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Sticky timer bar */}
      <div className={`sticky top-0 z-50 px-5 pb-3 max-w-lg mx-auto w-full transition-all duration-200 ${scrolled ? 'pt-0' : 'pt-2'}`}>
        <div className="bg-accent rounded-2xl flex items-center justify-between py-2.5 pl-8 pr-2.5">
          <p className="font-mono font-bold text-primary text-2xl tracking-wide">
            {String(minutes).padStart(2, '0')} : {String(seconds).padStart(2, '0')}
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('discount-banner')
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top: y, behavior: 'smooth' })
              }
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold px-8 py-3.5 rounded-full transition-colors"
          >
            Get my plan
          </button>

        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto px-5 py-6">

          {/* Before / After comparison */}
          <div className="bg-accent rounded-2xl p-4 mb-6 relative overflow-hidden">
            {/* Labels */}
            <div className="flex mb-3 py-2">
              <div className="flex-1 text-center pr-4">
                <p className="font-bold text-secondary text-lg">Now</p>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="flex-1 text-center pl-4">
                <p className="font-bold text-primary text-lg italic">After the plan</p>
              </div>
            </div>

            {/* Body images on top of goal-design background */}
            <div className="relative mb-4 -mx-4">
              <img src="/images/goal-design.png" alt="" className="w-full" />
              <div className="absolute inset-0 flex">
                <div className="flex-1 flex items-end justify-center overflow-hidden">
                  <img src={currentImage} alt="Current body" className="h-full object-contain object-bottom" />
                </div>
                <div className="flex-1 flex items-end justify-center overflow-hidden">
                  <img src={targetImage} alt="Target body" className="h-full object-contain object-bottom" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex">
              <div className="flex-1 pl-2">
                <p className="font-bold text-secondary text-[15px]">Body fat</p>
                <p className="text-secondary text-xl font-bold">{currentFat.fat}</p>
                <p className="font-bold text-secondary text-[15px] mt-3">Healthy weight</p>
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i <= currentFat.dots ? 'bg-primary' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="flex-1 pl-4">
                <p className="font-bold text-secondary text-[15px]">Body fat</p>
                <p className="text-primary text-xl font-bold">{targetFat.fat}</p>
                <p className="font-bold text-secondary text-[15px] mt-3">Healthy weight</p>
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i <= targetFat.dots ? 'bg-primary' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-secondary text-center mb-4">
            Choose <span className="text-primary">Your Plan!</span>
          </h3>

          {/* Goal + Target weight card */}
          <div className="bg-accent rounded-2xl p-5 mb-5">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <div className="text-4xl mb-2">🏔️</div>
                <p className="text-sm text-muted">Goal</p>
                <p className="font-bold text-secondary">Healthy weight</p>
              </div>
              <div className="w-px h-16 bg-gray-300" />
              <div className="flex-1 text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <p className="text-sm text-muted">Target weight</p>
                <p className="font-bold text-secondary">{targetWeight} {unit}</p>
              </div>
            </div>
          </div>

          {/* Discount countdown banner */}
          <div id="discount-banner" className="bg-emerald-500 text-white text-center py-3.5 rounded-2xl mb-5 font-semibold text-lg">
            60% discount expires in: <span className="font-mono font-bold ml-1">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          {/* Plan cards */}
          <div id="plan-cards" className="flex flex-col gap-4 mb-6">
            {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
              const plan = PLANS[planKey]
              const isSelected = selectedPlan === planKey

              return (
                <button
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`relative w-full rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-primary bg-[#f7f8fa] shadow-lg'
                      : 'border-gray-100 bg-white shadow-sm hover:border-gray-200'
                  }`}
                >
                  {/* Most Popular ribbon */}
                  {plan.popular && (
                    <>
                      {/* Main ribbon */}
                      <div
                        className="absolute z-10 text-white font-semibold"
                        style={{
                          left: '-6px',
                          top: '-10px',
                          backgroundColor: '#10b981',
                          padding: '13px 32px 13px 20px',
                          fontSize: '14px',
                          lineHeight: 1,
                          borderRadius: '6px 0 0 0',
                          clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%)',
                        }}
                      >
                        Most Popular
                      </div>
                      {/* Fold under the card border */}
                      <div
                        className="absolute z-0"
                        style={{
                          left: '-6px',
                          top: '30px',
                          width: 0,
                          height: 0,
                          borderTop: '6px solid #0d9668',
                          borderLeft: '6px solid transparent',
                        }}
                      />
                    </>
                  )}

                  <div className="flex items-center px-4 py-5">
                    {/* Checkbox */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mr-3.5 transition-colors ${
                      isSelected ? 'bg-primary' : 'bg-gray-200'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>

                    {/* Plan info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-extrabold text-secondary text-lg leading-tight tracking-wide">{plan.name}</p>
                      <p className="text-sm mt-1">
                        <span className="text-gray-400 line-through">{plan.originalPrice}</span>
                        <span className="text-secondary font-bold ml-2 text-[15px]">{plan.priceDisplay}</span>
                      </p>
                      {plan.gift && (
                        <div className="mt-1.5 inline-flex items-center border border-dashed border-emerald-500 rounded-full px-2.5 py-0.5">
                          <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">+ secret gift included 🎁</span>
                        </div>
                      )}
                    </div>

                    {/* Per day price box */}
                    <div className="bg-[#eef2f7] rounded-xl px-4 py-2.5 text-center flex-shrink-0 min-w-[100px]">
                      <p className="text-xs text-gray-400 line-through leading-none">{plan.originalPerDay}</p>
                      <p className="text-2xl font-extrabold text-secondary leading-tight mt-0.5">{plan.perDay}</p>
                      <p className="text-xs text-gray-400 leading-none mt-1">per day</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Guarantee */}
          <p className="text-center text-lg font-bold text-secondary mb-6">
            <span className="underline decoration-primary decoration-2 underline-offset-4">30-Day Money-Back Guarantee</span>
          </p>

          {/* CTA Button with countdown */}
          <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg text-lg mb-4 flex items-center justify-center gap-3"
          >
            <span className="font-mono text-lg">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            <span className="w-px h-6 bg-white/40" />
            <span>Select Plan</span>
          </button>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted leading-relaxed mb-10">
            By clicking this, you agree to <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span> and
            to the {PLANS[selectedPlan].priceDisplay} for the {PLANS[selectedPlan].name.toLowerCase()} membership to Cortiless Health.
            This is an introductory offer, and your membership will automatically renew at the regular price
            of {PLANS[selectedPlan].originalPrice} for {PLANS[selectedPlan].name.toLowerCase()} membership, unless cancelled.
            You can cancel at any time by visiting Manage my Subscription under My Account.
            If you have any questions about your subscription, please contact us at help@cortiless.com
          </p>

          {/* Features section */}
          <h3 className="text-2xl font-bold text-secondary text-center mb-6">
            Easy-to-use app to get your weight loss goal
          </h3>

          <div className="mb-6">
            <img src="/images/mockup.png" alt="App preview" className="w-full max-w-md mx-auto rounded-2xl" />
          </div>

          <div className="space-y-3 mb-10">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <div>
                  <p className="text-secondary font-bold text-base">{feature.title}</p>
                  <p className="text-muted text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Media logos */}
          <div className="text-center mb-10">
            <p className="text-2xl font-bold text-secondary mb-4">Our program and coaches featured in</p>
            <img src="/images/forbes.avif" alt="Featured in media" className="w-full max-w-sm mx-auto" />
          </div>

          {/* Testimonials */}
          <h4 className="text-2xl font-bold text-secondary text-center mb-5">
            What our members say about us
          </h4>

          {/* Carousel */}
          <div className="mb-10 relative">
            {/* Desktop arrows */}
            <button
              onClick={() => setActiveTestimonial(prev => Math.max(0, prev - 1))}
              className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors ${
                activeTestimonial === 0 ? 'opacity-30 cursor-default' : 'opacity-100'
              }`}
              disabled={activeTestimonial === 0}
            >
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setActiveTestimonial(prev => Math.min(testimonials.length - 1, prev + 1))}
              className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-colors ${
                activeTestimonial === testimonials.length - 1 ? 'opacity-30 cursor-default' : 'opacity-100'
              }`}
              disabled={activeTestimonial === testimonials.length - 1}
            >
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div
              className="overflow-hidden rounded-2xl"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
              onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX }}
              onTouchEnd={handleSwipe}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="w-full flex-shrink-0 px-1">
                    <div className="bg-accent rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-secondary font-bold text-lg">{t.name}, {t.age}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} className="text-red-500 text-lg">❤️</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-secondary text-base leading-relaxed">{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile dots */}
            <div className="flex md:hidden justify-center gap-3 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    activeTestimonial === i ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h4 className="text-2xl font-bold text-secondary text-center mb-5">
              What members often ask
            </h4>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between bg-accent rounded-xl px-4 py-3.5 text-left"
                  >
                    <span className="text-secondary font-medium pr-4">{faq.q}</span>
                    <span className="text-secondary text-xl flex-shrink-0 font-light">
                      {openFaq === i ? '—' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="text-muted text-sm px-4 pt-3 pb-1 leading-relaxed whitespace-pre-line">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="border-2 border-dashed border-emerald-500 rounded-2xl bg-emerald-50/50 p-6 mb-8 text-center">
            <h4 className="text-xl font-bold text-secondary mb-3">30-Day Money-Back Guarantee</h4>
            <p className="text-secondary leading-relaxed">
              Get 100% of your money back if you don&apos;t see visible results after following our program!
            </p>
            <p className="text-emerald-600 font-medium mt-2 cursor-pointer hover:underline">Money-back policy</p>
          </div>

          {/* Footer */}
          <div className="pb-8 text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Cortiless Health. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
