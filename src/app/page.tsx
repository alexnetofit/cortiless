'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const handleWeightSelect = (amount: string) => {
    // Store in sessionStorage and navigate to quiz
    sessionStorage.setItem('quiz_initial_answer', amount)
    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-white px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white text-xs font-bold rounded-md px-1.5 py-0.5">
            CL
          </div>
          <span className="font-semibold text-lg">Health</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-accent overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 z-10">
            <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight">
              <span className="bg-primary/90 text-white px-3 py-1 inline-block mb-2">
                CORTISOL CLEANSE:
              </span>
              <br />
              <span className="bg-primary/90 text-white px-3 py-1 inline-block mb-2">
                LOSE WEIGHT IN ANY
              </span>
              <br />
              <span className="bg-primary/90 text-white px-3 py-1 inline-block">
                MENOPAUSE STAGE
              </span>
            </h1>

            <p className="text-xl text-secondary mt-8 mb-6 font-medium">
              How much weight would you like to lose?
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              {['0-10 lbs', '10-20 lbs', '20-40 lbs', '40+ lbs'].map((label) => (
                <button
                  key={label}
                  onClick={() => handleWeightSelect(label)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-white/30 rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=500&h=600&fit=crop&crop=top"
              alt="Happy woman"
              className="relative z-10 rounded-lg max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white py-8 px-4 text-center">
        <p className="text-sm text-muted max-w-2xl mx-auto">
          Your results may vary based on your initial conditions, goals, dedication, and the accuracy of the information you submit.
        </p>
        <p className="text-sm text-muted max-w-2xl mx-auto mt-3">
          This site does not offer medical advice. Always prioritize your health and safety, and consult a healthcare professional with any health concerns.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white text-xs font-bold rounded-md px-1.5 py-0.5">
                CL
              </div>
              <span className="font-semibold">Cortiless</span>
            </div>
            <p className="text-gray-300 text-sm">
              The first health & fitness program designed for women&apos;s unique needs. The one that finally works.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Manage your subscription</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Help Center</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="/auth/login" className="text-gray-300 hover:text-white text-sm transition-colors">Login</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Contact Us</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm mt-8 pt-8 border-t border-gray-700">
          2026 &copy; ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  )
}
