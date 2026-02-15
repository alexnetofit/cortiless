'use client'

import { QuizStep } from '@/lib/quiz-config'

interface LandingStepProps {
  step: QuizStep
  onAnswer: (value: string) => void
}

export default function LandingStep({ step, onAnswer }: LandingStepProps) {
  return (
    <div className="flex-1 flex flex-col bg-accent">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight">
              {step.title.split('\n').map((line, i) => (
                <span key={i}>
                  <span className="bg-primary/90 text-white px-3 py-1 inline-block mb-2">
                    {line}
                  </span>
                  <br />
                </span>
              ))}
            </h1>

            <p className="text-xl text-secondary mt-6 mb-6 font-medium">
              {step.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto md:mx-0">
              {step.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onAnswer(option.id)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative flex justify-center">
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-white/30 rounded-full hidden md:block" />
            <img
              src="/images/tela-1.png"
              alt="Woman"
              className="relative z-10 rounded-lg w-full max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-white/60 py-4 px-4 text-center">
        <p className="text-xs text-muted max-w-2xl mx-auto">
          Your results may vary based on your initial conditions, goals, dedication, and the accuracy of the information you submit.
        </p>
        <p className="text-xs text-muted max-w-2xl mx-auto mt-1">
          This site does not offer medical advice. Always prioritize your health and safety, and consult a healthcare professional with any health concerns.
        </p>
      </div>
    </div>
  )
}
