'use client'

import { cn } from '@/lib/utils'

interface LikertScaleProps {
  value: number | null
  onChange: (value: number) => void
  labels?: string[]
  disabled?: boolean
}

const defaultLabels = ['😞', '😕', '😐', '😊', '😍']
const defaultText = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju']

export default function LikertScale({
  value,
  onChange,
  labels = defaultLabels,
  disabled = false,
}: LikertScaleProps) {
  const options = labels.map((emoji, i) => ({
    value: i + 1,
    emoji,
    text: defaultText[i],
  }))

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all min-w-[68px]',
              'hover:scale-105 active:scale-95',
              isSelected
                ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10 scale-105'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
            )}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className={cn(
              'text-xs font-bold tabular-nums',
              isSelected ? 'text-teal-700' : 'text-slate-400'
            )}>
              {opt.value}
            </span>
            <span
              className={cn(
                'text-[11px] leading-tight text-center max-w-[70px]',
                isSelected ? 'text-teal-700 font-semibold' : 'text-slate-400'
              )}
            >
              {opt.text}
            </span>
          </button>
        )
      })}
    </div>
  )
}