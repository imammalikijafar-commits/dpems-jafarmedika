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
    if (v <= 2) return 'bg-teal-400'
    if (v <= 4) return 'bg-teal-300'
    if (v <= 6) return 'bg-amber-400'
    if (v <= 8) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const getTextColor = (v: number) => {
    if (v <= 3) return 'text-teal-600'
    if (v <= 6) return 'text-amber-600'
    return 'text-red-600'
  }

  const getBarGradient = (v: number) => {
    if (v <= 2) return 'from-teal-300 to-teal-400'
    if (v <= 4) return 'from-teal-200 to-amber-400'
    if (v <= 6) return 'from-amber-300 to-amber-500'
    if (v <= 8) return 'from-amber-400 to-orange-500'
    return 'from-orange-400 to-red-500'
  }

  return (
    <div className={cn('space-y-3', disabled && 'opacity-50')}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-display)]">{label}</span>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-3xl font-extrabold tabular-nums transition-colors font-[family-name:var(--font-display)]',
              disabled ? 'text-slate-400' : getTextColor(value)
            )}
          >
            {value}
          </span>
          <span className="text-sm font-medium text-slate-400">/10</span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative h-10 rounded-xl overflow-hidden bg-slate-100">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-xl transition-all duration-300 bg-gradient-to-r',
            disabled ? 'bg-slate-300' : getBarGradient(value)
          )}
          style={{ width: `${Math.max((value / 10) * 100, 4)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-3 text-[11px] font-medium text-white/80 mix-blend-difference">
          <span>{disabled ? 'Tidak Tersedia' : 'Tidak Nyeri'}</span>
          <span>{disabled ? 'Kunjungan Pertama' : 'Nyeri Sangat Parah'}</span>
        </div>
      </div>

      {/* Range input */}
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => !disabled && onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-600 disabled:cursor-not-allowed disabled:accent-slate-400"
      />

      {/* Number markers */}
      <div className="flex justify-between text-xs text-slate-400 tabular-nums px-0.5">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className={cn(
            'w-5 text-center transition-colors',
            !disabled && i === value && 'text-teal-600 font-bold'
          )}>
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}