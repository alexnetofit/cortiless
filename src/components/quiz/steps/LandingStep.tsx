'use client'

import { QuizStep } from '@/lib/quiz-config'

interface LandingStepProps {
  step: QuizStep
  onAnswer: (value: string) => void
}

export default function LandingStep({ step, onAnswer }: LandingStepProps) {
  const lines = step.title.split('\n')

  return (
    <div className="flex-1 flex flex-col bg-accent">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1">
        {/* Desktop layout */}
        <div className="hidden md:flex max-w-6xl mx-auto px-4 py-16 flex-row items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 z-10 text-left">
            <h1 className="text-5xl font-black text-secondary leading-tight">
              {lines.map((line, i) => (
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

            <div className="grid grid-cols-2 gap-3 max-w-md">
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
            <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-white/30 rounded-full" />
            <img
              src="/images/tela-1.png"
              alt="Woman"
              className="relative z-10 rounded-lg w-full max-w-sm"
            />
          </div>
        </div>

        {/* Mobile layout - image with overlapping title */}
        <div className="md:hidden flex flex-col">
          {/* Image container - smaller with visible belly */}
          <div className="relative flex justify-center pt-2 px-4">
            <img
              src="/images/tela-1.png"
              alt="Woman"
              className="relative z-0 w-full max-w-[200px] object-contain"
            />
            {/* Subtle gradient fade at very bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-accent to-transparent z-[1]" />
          </div>

          {/* Title slightly overlapping bottom of image */}
          <div className="relative z-10 -mt-6 text-center px-4">
            <h1 className="text-[1.5rem] font-black text-secondary leading-tight">
              {lines.map((line, i) => (
                <span key={i}>
                  <span className="bg-primary/90 text-white px-2.5 py-0.5 inline-block mb-1">
                    {line}
                  </span>
                  <br />
                </span>
              ))}
            </h1>

            <p className="text-base text-secondary mt-3 mb-4 font-medium">
              {step.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
              {step.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onAnswer(option.id)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-base"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-white/60 py-4 px-4 text-center mt-auto">
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
