'use client'

import { cn } from '@/lib/utils'

interface PainScaleProps {
  value: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
}

export default function PainScale({ value, onChange, label, disabled = false }: PainScaleProps) {
  const getColor = (v: number) => {
    if (v <= 2) return 'bg-emerald-400'
    if (v <= 4) return 'bg-emerald-300'
    if (v <= 6) return 'bg-amber-400'
    if (v <= 8) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const getTextColor = (v: number) => {
    if (v <= 3) return 'text-emerald-700'
    if (v <= 6) return 'text-amber-700'
    return 'text-red-700'
  }

  return (
    <div className={cn('space-y-3', disabled && 'opacity-50')}>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-700">{label}</span>
        <span
          className={cn(
            'text-3xl font-bold tabular-nums transition-colors',
            disabled ? 'text-gray-400' : getTextColor(value)
          )}
        >
          {value}
          <span className="text-sm font-normal text-gray-400">/10</span>
        </span>
      </div>

      <div className="relative h-12 rounded-full overflow-hidden bg-gray-100">
        {/* Color gradient background */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
            disabled ? 'bg-gray-300' : getColor(value)
          )}
          style={{ width: `${(value / 10) * 100}%` }}
        />
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium text-white mix-blend-difference">
          <span>{disabled ? 'Tidak Tersedia' : 'Tidak Nyeri'}</span>
          <span>{disabled ? 'Kunjungan Pertama' : 'Nyeri Sangat Parah'}</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => !disabled && onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600 disabled:cursor-not-allowed"
      />

      <div className="flex justify-between text-xs text-gray-400">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  )
}