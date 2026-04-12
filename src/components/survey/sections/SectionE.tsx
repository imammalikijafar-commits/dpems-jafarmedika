'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
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

export default function SectionE({ form, updateField, visitCount }: SectionProps) {
  const isFirstVisit = visitCount === 'Pertama kali'
  const painAfterDisplay = isFirstVisit ? form.pain_level_before : (form.pain_level_after ?? form.pain_level_before)

  const painReduction = !isFirstVisit && form.pain_level_before > 0 && form.pain_level_after !== null
    ? Math.round(((form.pain_level_before - painAfterDisplay) / form.pain_level_before) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Stethoscope className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian E — Penilaian Perubahan Kondisi (VAS)</h2>
        <p className="text-sm text-gray-500">0 = tidak ada gejala, 10 = sangat berat</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Info banner for first visit */}
          {isFirstVisit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Kunjungan Pertama Kali</p>
                <p className="text-sm text-amber-700 mt-1">
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

          {!isFirstVisit && painReduction !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'text-center p-4 rounded-xl',
                painReduction > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
              )}
            >
              <p className="text-sm text-gray-600 mb-1">Pengurangan Gejala</p>
              <p className={cn('text-3xl font-bold', painReduction > 0 ? 'text-emerald-600' : 'text-red-600')}>
                {painReduction > 0 ? '↓' : '↑'} {Math.abs(painReduction)}%
              </p>
            </motion.div>
          )}

          {/* E3: Condition Change */}
          <div className="space-y-3 pt-2">
            <Label className="text-base font-bold">E3. Secara keseluruhan, perubahan kondisi Anda:</Label>
            <RadioGroup
              value={form.condition_change}
              onValueChange={(v) => updateField('condition_change', v)}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              {[
                { value: 'Sangat Memburuk', emoji: '😞', color: 'text-red-500' },
                { value: 'Agak Memburuk', emoji: '😟', color: 'text-orange-500' },
                { value: 'Tidak Berubah', emoji: '😐', color: 'text-gray-500' },
                { value: 'Agak Membaik', emoji: '🙂', color: 'text-blue-500' },
                { value: 'Sangat Membaik', emoji: '😊', color: 'text-emerald-500' },
              ].map((opt) => (
                <div key={opt.value} className={cn('flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all cursor-pointer', form.condition_change === opt.value ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-emerald-300')} onClick={() => updateField('condition_change', opt.value)}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <RadioGroupItem value={opt.value} id={`cc-${opt.value}`} className="sr-only" />
                  <Label htmlFor={`cc-${opt.value}`} className={cn('text-[11px] text-center font-medium cursor-pointer', form.condition_change === opt.value ? opt.color : 'text-gray-500')}>
                    {opt.value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}