'use client'

import { cn } from '@/lib/utils'

interface LikertScaleProps {
  value: number | null
  onChange: (value: number) => void
  labels?: string[]
  disabled?: boolean
}

const defaultLabels = ['😐', '😕', '😐', '😊', '😍']
const defaultText = ['Sangat Tidak Puas', 'Tidak Puas', 'Cukup', 'Puas', 'Sangat Puas']

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
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-w-[64px]',
            'hover:scale-105 active:scale-95',
            value === opt.value
              ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
              : 'border-gray-200 bg-white hover:border-emerald-300'
          )}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <span className="text-xs font-medium text-gray-500">{opt.value}</span>
          <span
            className={cn(
              'text-[11px] leading-tight text-center',
              value === opt.value ? 'text-emerald-700 font-semibold' : 'text-gray-400'
            )}
          >
            {opt.text}
          </span>
        </button>
      ))}
    </div>
  )
}
