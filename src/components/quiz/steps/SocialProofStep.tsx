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
    <div className={`flex-1 flex flex-col items-center px-5 ${isFirstSocialProof ? 'py-4' : 'py-8'} ${isMediaStep ? 'pb-24' : ''}`}>
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

          {/* Media logos image */}
          {isMediaStep && (
            <div className="mb-4">
              <img
                src="/images/forbes.avif"
                alt="Featured in media"
                className="w-full max-w-sm mx-auto"
              />
            </div>
          )}

          {/* Info content */}
          {step.infoContent?.text && (
            <div className={isFirstSocialProof ? 'mb-2 px-2' : 'mb-4 px-2'}>
              <p className={`text-secondary font-semibold ${isFirstSocialProof ? 'text-2xl md:text-3xl leading-snug' : 'font-medium'}`}>{step.infoContent.text}</p>
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
        </div>

        {/* Floating button for media step, normal for others */}
        {isMediaStep ? (
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-6 py-4 z-50">
            <button
              onClick={onContinue}
              className="w-full max-w-sm mx-auto block bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              Continue
            </button>
          </div>
        ) : (
          <button
            onClick={onContinue}
            className="w-full max-w-sm mx-auto bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
