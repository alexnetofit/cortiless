'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProgressEntry {
  date: string
  weight_kg: number
  notes: string | null
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [targetWeight, setTargetWeight] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      // Load profile for target weight
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('target_weight_kg')
        .eq('id', user.id)
        .single()

      if (profile) setTargetWeight(profile.target_weight_kg || 0)

      // Load progress entries
      const { data } = await supabase
        .from('progress_entries')
        .select('date, weight_kg, notes')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (data) setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogWeight = async () => {
    if (!userId || !newWeight) return
    setSaving(true)

    const weight = parseFloat(newWeight)

    await supabase.from('progress_entries').upsert({
      user_id: userId,
      date: today,
      weight_kg: weight,
      notes: newNotes || null,
    }, { onConflict: 'user_id,date' })

    // Update user profile
    await supabase.from('user_profiles').update({ weight_kg: weight }).eq('id', userId)

    // Reload entries
    const { data } = await supabase
      .from('progress_entries')
      .select('date, weight_kg, notes')
      .eq('user_id', userId)
      .order('date', { ascending: true })

    if (data) setEntries(data)
    setNewWeight('')
    setNewNotes('')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const firstWeight = entries[0]?.weight_kg || 0
  const lastWeight = entries[entries.length - 1]?.weight_kg || 0
  const totalChange = firstWeight > 0 ? lastWeight - firstWeight : 0

  // Simple chart using SVG
  const chartWidth = 600
  const chartHeight = 200
  const padding = 40

  const weights = entries.map(e => e.weight_kg)
  const minWeight = Math.min(...weights, targetWeight) - 2
  const maxWeight = Math.max(...weights) + 2
  const range = maxWeight - minWeight || 1

  const points = entries.map((entry, i) => {
    const x = padding + (i / Math.max(entries.length - 1, 1)) * (chartWidth - 2 * padding)
    const y = padding + ((maxWeight - entry.weight_kg) / range) * (chartHeight - 2 * padding)
    return { x, y, ...entry }
  })

  const pathD = points.length > 1
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : ''

  const targetY = padding + ((maxWeight - targetWeight) / range) * (chartHeight - 2 * padding)

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold text-secondary mb-6">Weight Progress 📊</h1>

      {/* Log weight */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-semibold text-secondary mb-3">Log Today&apos;s Weight</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Weight"
              className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-3 pr-10 text-secondary outline-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">kg</span>
          </div>
          <button
            onClick={handleLogWeight}
            disabled={!newWeight || saving}
            className="bg-primary hover:bg-primary-dark disabled:bg-primary/40 text-white font-semibold px-6 rounded-xl transition-all"
          >
            {saving ? '...' : 'Log'}
          </button>
        </div>
        <input
          type="text"
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full mt-2 bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-2 text-secondary text-sm outline-none transition-all"
        />
      </div>

      {/* Chart */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-semibold text-secondary mb-4">Weight Over Time</h3>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[400px]">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => {
                const y = padding + (i / 4) * (chartHeight - 2 * padding)
                const weight = maxWeight - (i / 4) * range
                return (
                  <g key={i}>
                    <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={padding - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                      {weight.toFixed(0)}
                    </text>
                  </g>
                )
              })}

              {/* Target weight line */}
              {targetWeight > 0 && (
                <>
                  <line x1={padding} y1={targetY} x2={chartWidth - padding} y2={targetY} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 3" />
                  <text x={chartWidth - padding + 5} y={targetY + 4} fontSize="10" fill="#22c55e">Target</text>
                </>
              )}

              {/* Line */}
              {pathD && (
                <path d={pathD} fill="none" stroke="#a8174e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* Points */}
              {points.map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="4" fill="#a8174e" stroke="white" strokeWidth="2" />
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-muted mb-1">Starting</p>
          <p className="text-lg font-bold text-secondary">{firstWeight || '—'} kg</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-muted mb-1">Current</p>
          <p className="text-lg font-bold text-secondary">{lastWeight || '—'} kg</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-muted mb-1">Change</p>
          <p className={`text-lg font-bold ${totalChange <= 0 ? 'text-success' : 'text-red-500'}`}>
            {totalChange !== 0 ? `${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)}` : '—'} kg
          </p>
        </div>
      </div>

      {/* History */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-secondary mb-3">History</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...entries].reverse().map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  {entry.notes && <p className="text-xs text-muted">{entry.notes}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-secondary">{entry.weight_kg} kg</p>
                  <button
                    onClick={async () => {
                      if (!userId) return
                      if (!confirm('Delete this entry?')) return
                      await supabase
                        .from('progress_entries')
                        .delete()
                        .eq('user_id', userId)
                        .eq('date', entry.date)
                      // Reload entries
                      const { data } = await supabase
                        .from('progress_entries')
                        .select('date, weight_kg, notes')
                        .eq('user_id', userId)
                        .order('date', { ascending: true })
                      if (data) setEntries(data)
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Delete entry"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
