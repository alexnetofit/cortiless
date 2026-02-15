'use client'

import { QuizStep } from '@/lib/quiz-config'

interface SocialProofStepProps {
  step: QuizStep
  onContinue: () => void
}

export default function SocialProofStep({ step, onContinue }: SocialProofStepProps) {
  const isForbesStep = step.id === 'social-proof-forbes'
  const isMediaStep = step.id === 'social-proof-media'

  const isFirstSocialProof = step.id === 'social-proof-1'

  return (
    <div className={`flex-1 flex flex-col items-center px-5 ${isFirstSocialProof ? 'py-4' : 'py-8'}`}>
      <div className="max-w-lg w-full mx-auto text-center flex flex-col">
        <div>
          {/* Counter / Title */}
          {isFirstSocialProof ? (
            <>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{step.title}</p>
              <p className="text-xl md:text-2xl font-semibold text-secondary mb-3">{step.subtitle}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-secondary mb-4">{step.title}</h2>
              {step.subtitle && (
                <p className="text-muted mb-4">{step.subtitle}</p>
              )}
            </>
          )}

          {/* Forbes badge image */}
          {isForbesStep && (
            <div className="mb-4">
              <img
                src="/images/best-fitness-app.jpg"
                alt="Best Fitness App - Forbes Health"
                className="w-full max-w-sm mx-auto rounded-xl"
              />
            </div>
          )}

          {/* Media logos */}
          {isMediaStep && (
            <div className="grid grid-cols-3 gap-4 mb-4 items-center justify-items-center opacity-60">
              {['Mirror', 'Forbes Health', 'Sky Sports', 'Televisa', 'The Guardian', 'Oregon'].map((name) => (
                <div key={name} className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded">
                  {name}
                </div>
              ))}
            </div>
          )}

          {/* Image - horizontal crop keeping heads visible */}
          {step.image && (
            <div className={isFirstSocialProof ? 'mb-4' : 'mb-6'}>
              <img
                src={step.image}
                alt=""
                className={`w-full mx-auto rounded-2xl ${isFirstSocialProof ? 'max-w-full md:max-w-md' : 'max-w-sm shadow-lg'}`}
              />
            </div>
          )}

          {/* Info content */}
          {step.infoContent?.text && (
            <div className={isFirstSocialProof ? 'mb-2 px-2' : 'bg-accent rounded-xl p-6 mb-6'}>
              <p className={`text-secondary font-semibold ${isFirstSocialProof ? 'text-2xl md:text-3xl leading-snug' : 'font-medium'}`}>{step.infoContent.text}</p>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className="w-full max-w-sm mx-auto bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
