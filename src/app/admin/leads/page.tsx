'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  email: string | null
  current_step: number
  converted: boolean
  created_at: string
  answers: Record<string, unknown>
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'email' | 'converted'>('all')

  useEffect(() => {
    const load = async () => {
      let query = supabase
        .from('quiz_sessions')
        .select('id, email, current_step, converted, created_at, answers')
        .order('created_at', { ascending: false })
        .limit(100)

      if (filter === 'email') {
        query = query.not('email', 'is', null)
      } else if (filter === 'converted') {
        query = query.eq('converted', true)
      }

      const { data } = await query
      if (data) setLeads(data)
      setLoading(false)
    }
    load()
  }, [filter])

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-muted hover:text-secondary">
            &larr; Back
          </Link>
          <span className="font-semibold text-secondary text-lg">All Leads</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all' as const, label: 'All Sessions' },
            { key: 'email' as const, label: 'With Email' },
            { key: 'converted' as const, label: 'Converted' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-muted font-medium px-4 py-3">Email</th>
                    <th className="text-left text-xs text-muted font-medium px-4 py-3">Step</th>
                    <th className="text-left text-xs text-muted font-medium px-4 py-3">Status</th>
                    <th className="text-left text-xs text-muted font-medium px-4 py-3">Date</th>
                    <th className="text-left text-xs text-muted font-medium px-4 py-3">Weight Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const weightGoal = lead.answers?.['weight-loss-goal'] as string || '—'
                    return (
                      <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-secondary">
                          {lead.email || <span className="text-muted italic">No email</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          Step {lead.current_step}/26
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            lead.converted
                              ? 'bg-green-100 text-green-700'
                              : lead.email
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {lead.converted ? 'Converted' : lead.email ? 'Lead' : 'Visitor'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">{weightGoal}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12 text-muted">
                No leads found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
