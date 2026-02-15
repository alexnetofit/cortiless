'use client'

import { QuizStep } from '@/lib/quiz-config'

interface InfoStepProps {
  step: QuizStep
  onContinue: () => void
}

export default function InfoStep({ step, onContinue }: InfoStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-24">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
          {step.title}
        </h2>

        {step.subtitle && (
          <p className="text-muted mb-6 leading-relaxed text-lg">
            {step.subtitle}
          </p>
        )}

        {step.image && (
          <div className="mb-6">
            <img
              src={step.image}
              alt=""
              className="w-full max-w-sm mx-auto rounded-xl shadow-md"
            />
          </div>
        )}

        {step.infoContent && (
          <div className="px-2 mb-6 text-center">
            <p className="text-secondary text-lg leading-relaxed">
              {step.infoContent.text}
            </p>
            {step.infoContent.bullets && step.infoContent.bullets.length > 0 && (
              <ul className="space-y-3 mt-4 text-left">
                {step.infoContent.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-lg">✅</span>
                    <span className="text-secondary">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Floating sticky button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-4 z-50">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
