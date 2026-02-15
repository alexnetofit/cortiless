import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export const PLANS = {
  '1-month': {
    name: '1-Month Plan',
    price: 2999, // cents
    priceDisplay: '$29.99',
    perDay: '$1.00',
    duration: 30,
    popular: false,
  },
  '3-month': {
    name: '3-Month Plan',
    price: 4999,
    priceDisplay: '$49.99',
    perDay: '$0.55',
    duration: 90,
    popular: true,
  },
  '12-month': {
    name: '12-Month Plan',
    price: 9999,
    priceDisplay: '$99.99',
    perDay: '$0.27',
    duration: 365,
    popular: false,
  },
} as const

export type PlanKey = keyof typeof PLANS
