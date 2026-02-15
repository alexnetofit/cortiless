import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

// Re-export plans for server-side usage
export { PLANS, type PlanKey } from './plans'
