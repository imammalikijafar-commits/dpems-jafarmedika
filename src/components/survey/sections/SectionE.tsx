'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Stethoscope, Info } from 'lucide-react'
import PainScale from '@/components/survey/PainScale'
import { cn } from '@/lib/utils'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
  visitCount?: string
}

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

export default function SectionE({ form, updateField, visitCount }: SectionProps) {
  const isFirstVisit = visitCount === 'Pertama kali'
  const painAfterDisplay = isFirstVisit ? form.pain_level_before : (form.pain_level_after ?? form.pain_level_before)

  const painReduction = !isFirstVisit && form.pain_level_before > 0 && form.pain_level_after !== null
    ? Math.round(((form.pain_level_before - painAfterDisplay) / form.pain_level_before) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] tracking-tight">
            Bagian E — Penilaian Perubahan Kondisi (VAS)
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-[family-name:var(--font-body)]">
            0 = tidak ada gejala, 10 = sangat berat
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600" />
        <div className="p-5 sm:p-6 space-y-6">
          {/* Info banner for first visit */}
          {isFirstVisit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/60 p-4"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 font-[family-name:var(--font-display)]">Kunjungan Pertama Kali</p>
                <p className="text-sm text-amber-700 mt-1 font-[family-name:var(--font-body)]">
                  Karena ini kunjungan pertama Anda, penilaian &quot;Tingkat gejala setelah terapi&quot; tidak tersedia. Hanya perlu mengisi tingkat gejala saat ini (sebelum terapi dimulai).
                </p>
              </div>
            </motion.div>
          )}

          <PainScale
            label="E1. Tingkat gejala SAAT INI"
            value={form.pain_level_before}
            onChange={(v) => updateField('pain_level_before', v)}
          />

          {!isFirstVisit ? (
            <PainScale
              label="E2. Tingkat gejala SETELAH terapi sebelumnya"
              value={painAfterDisplay}
              onChange={(v) => updateField('pain_level_after', v)}
            />
          ) : (
            <PainScale
              label="E2. Tingkat gejala SETELAH terapi sebelumnya"
              value={form.pain_level_before}
              onChange={() => {}}
              disabled
            />
          )}

          {/* Pain reduction indicator */}
          {!isFirstVisit && painReduction !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'text-center p-5 rounded-xl',
                painReduction > 0
                  ? 'bg-gradient-to-br from-teal-50 to-teal-100/60 border border-teal-200/60'
                  : 'bg-gradient-to-br from-red-50 to-red-100/60 border border-red-200/60'
              )}
            >
              <p className="text-xs font-medium text-slate-500 mb-1 font-[family-name:var(--font-body)]">Pengurangan Gejala</p>
              <p className={cn('text-3xl font-extrabold font-[family-name:var(--font-display)] tabular-nums', painReduction > 0 ? 'text-teal-600' : 'text-red-600')}>
                {painReduction > 0 ? '↓' : '↑'} {Math.abs(painReduction)}%
              </p>
            </motion.div>
          )}

          {/* E3: Condition Change */}
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-display)]">
              <span className="text-teal-600 mr-1">E3.</span>
              Secara keseluruhan, perubahan kondisi Anda:
            </Label>
            <RadioGroup
              value={form.condition_change}
              onValueChange={(v) => updateField('condition_change', v)}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2"
            >
              {[
                { value: 'Sangat Memburuk', emoji: '😞', color: 'text-red-500', activeBg: 'bg-red-50 border-red-400' },
                { value: 'Agak Memburuk', emoji: '😟', color: 'text-orange-500', activeBg: 'bg-orange-50 border-orange-400' },
                { value: 'Tidak Berubah', emoji: '😐', color: 'text-slate-500', activeBg: 'bg-slate-50 border-slate-400' },
                { value: 'Agak Membaik', emoji: '🙂', color: 'text-blue-500', activeBg: 'bg-blue-50 border-blue-400' },
                { value: 'Sangat Membaik', emoji: '😊', color: 'text-teal-500', activeBg: 'bg-teal-50 border-teal-400' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer',
                    form.condition_change === opt.value
                      ? cn('border-current shadow-sm', opt.activeBg)
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                  onClick={() => updateField('condition_change', opt.value)}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <RadioGroupItem value={opt.value} id={`cc-${opt.value}`} className="sr-only" />
                  <Label htmlFor={`cc-${opt.value}`} className={cn(
                    'text-[11px] text-center font-semibold cursor-pointer font-[family-name:var(--font-body)]',
                    form.condition_change === opt.value ? opt.color : 'text-slate-400'
                  )}>
                    {opt.value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </motion.div>
  )
}