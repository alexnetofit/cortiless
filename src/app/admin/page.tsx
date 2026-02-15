'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Metrics {
  totalSessions: number
  emailLeads: number
  conversions: number
  totalUsers: number
  conversionRate: string
  emailCaptureRate: string
  stepDistribution: Record<number, number>
  planDistribution: Record<string, number>
  recentLeads: Array<{
    id: string
    email: string
    current_step: number
    converted: boolean
    created_at: string
  }>
  dailySessions: Record<string, number>
}

const STEP_NAMES: Record<number, string> = {
  1: 'Landing',
  2: 'Social Proof',
  3: 'Cortisol Knowledge',
  4: 'Cortisol Info',
  5: 'Motivation',
  6: 'Body Type',
  7: 'Time Since Ideal',
  8: 'Target Body',
  9: 'Target Zones',
  10: 'Menopause',
  11: 'Symptoms',
  12: 'Diets Info',
  13: 'Activity Level',
  14: 'Walking',
  15: 'Water',
  16: 'Sleep',
  17: 'Height',
  18: 'Weight',
  19: 'Desired Weight',
  20: 'Age',
  21: 'Results Chart',
  22: 'Forbes Proof',
  23: 'Email Capture',
  24: '7-Day Results',
  25: 'Media Proof',
  26: 'Pricing',
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics')
        const data = await res.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to load metrics:', error)
      }
      setLoading(false)
    }
    loadMetrics()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Failed to load metrics</p>
      </div>
    )
  }

  // Funnel chart data
  const maxStep = Math.max(...Object.keys(metrics.stepDistribution).map(Number), 1)
  const funnelData = Array.from({ length: Math.min(maxStep, 26) }, (_, i) => {
    const step = i + 1
    // Count sessions that reached AT LEAST this step
    const count = Object.entries(metrics.stepDistribution)
      .filter(([s]) => Number(s) >= step)
      .reduce((sum, [, c]) => sum + c, 0)
    return { step, count, name: STEP_NAMES[step] || `Step ${step}` }
  })

  const maxFunnelCount = funnelData[0]?.count || 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white text-xs font-bold rounded-md px-1.5 py-0.5">CL</div>
          <span className="font-semibold text-secondary text-lg">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">
            Client View
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-muted font-medium mb-1">Total Quiz Sessions</p>
            <p className="text-3xl font-bold text-secondary">{metrics.totalSessions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-muted font-medium mb-1">Email Leads</p>
            <p className="text-3xl font-bold text-blue-500">{metrics.emailLeads.toLocaleString()}</p>
            <p className="text-xs text-muted">{metrics.emailCaptureRate}% capture rate</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-muted font-medium mb-1">Conversions</p>
            <p className="text-3xl font-bold text-success">{metrics.conversions.toLocaleString()}</p>
            <p className="text-xs text-muted">{metrics.conversionRate}% conversion rate</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-muted font-medium mb-1">Active Users</p>
            <p className="text-3xl font-bold text-primary">{metrics.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-secondary mb-6">Quiz Funnel</h2>
          <div className="space-y-2">
            {funnelData.map(({ step, count, name }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="text-xs text-muted w-28 text-right truncate">{name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 flex items-center px-2"
                    style={{ width: `${Math.max((count / maxFunnelCount) * 100, 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-4">Revenue by Plan</h2>
            {Object.keys(metrics.planDistribution).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(metrics.planDistribution).map(([plan, count]) => {
                  const prices: Record<string, number> = { '1-month': 29.99, '3-month': 49.99, '12-month': 99.99 }
                  const revenue = count * (prices[plan] || 0)
                  return (
                    <div key={plan} className="flex items-center justify-between bg-accent rounded-xl p-4">
                      <div>
                        <p className="font-semibold text-secondary capitalize">{plan.replace('-', ' ')}</p>
                        <p className="text-xs text-muted">{count} users</p>
                      </div>
                      <p className="font-bold text-success">${revenue.toFixed(2)}</p>
                    </div>
                  )
                })}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <p className="font-bold text-secondary">Total Revenue</p>
                  <p className="font-bold text-success text-lg">
                    ${Object.entries(metrics.planDistribution).reduce((sum, [plan, count]) => {
                      const prices: Record<string, number> = { '1-month': 29.99, '3-month': 49.99, '12-month': 99.99 }
                      return sum + count * (prices[plan] || 0)
                    }, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted text-sm text-center py-8">No sales yet</p>
            )}
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">Recent Leads</h2>
              <Link href="/admin/leads" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {metrics.recentLeads.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {metrics.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-secondary">{lead.email}</p>
                      <p className="text-xs text-muted">
                        Step {lead.current_step} - {STEP_NAMES[lead.current_step] || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        lead.converted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {lead.converted ? 'Converted' : 'Lead'}
                      </span>
                      <p className="text-xs text-muted mt-1">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm text-center py-8">No leads yet</p>
            )}
          </div>
        </div>

        {/* Daily sessions chart */}
        {Object.keys(metrics.dailySessions).length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
            <h2 className="text-lg font-bold text-secondary mb-4">Daily Sessions (Last 30 Days)</h2>
            <div className="flex items-end gap-1 h-40">
              {(() => {
                const dates = Object.keys(metrics.dailySessions).sort()
                const maxCount = Math.max(...Object.values(metrics.dailySessions), 1)
                return dates.map(date => {
                  const count = metrics.dailySessions[date]
                  const height = (count / maxCount) * 100
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center justify-end group">
                      <div className="hidden group-hover:block absolute -mt-8 bg-secondary text-white text-xs px-2 py-1 rounded">
                        {date}: {count}
                      </div>
                      <div
                        className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all min-h-[2px]"
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
