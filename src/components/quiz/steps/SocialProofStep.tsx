'use client'

import { QuizStep } from '@/lib/quiz-config'

interface SocialProofStepProps {
  step: QuizStep
  onContinue: () => void
}

export default function SocialProofStep({ step, onContinue }: SocialProofStepProps) {
  const isForbesStep = step.id === 'social-proof-forbes'
  const isMediaStep = step.id === 'social-proof-media'

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        {/* Counter / Title */}
        {step.id === 'social-proof-1' ? (
          <>
            <p className="text-3xl font-bold text-primary mb-2">{step.title}</p>
            <p className="text-xl font-semibold text-secondary mb-8">{step.subtitle}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-secondary mb-4">{step.title}</h2>
            {step.subtitle && (
              <p className="text-muted mb-4">{step.subtitle}</p>
            )}
          </>
        )}

        {/* Forbes badge */}
        {isForbesStep && (
          <div className="mb-6">
            <div className="flex justify-center gap-1 text-warning mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-muted text-sm mb-1">according to</p>
            <p className="text-2xl font-bold text-secondary">Forbes <span className="text-primary">HEALTH</span></p>
          </div>
        )}

        {/* Media logos */}
        {isMediaStep && (
          <div className="grid grid-cols-3 gap-4 mb-6 items-center justify-items-center opacity-60">
            {['Mirror', 'Forbes Health', 'Sky Sports', 'Televisa', 'The Guardian', 'Oregon'].map((name) => (
              <div key={name} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded">
                {name}
              </div>
            ))}
          </div>
        )}

        {/* Image */}
        {step.image && (
          <div className="mb-6">
            <img
              src={step.image}
              alt=""
              className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Info content */}
        {step.infoContent?.text && (
          <div className="bg-accent rounded-xl p-6 mb-6">
            <p className="text-secondary font-medium">{step.infoContent.text}</p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full max-w-sm bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
