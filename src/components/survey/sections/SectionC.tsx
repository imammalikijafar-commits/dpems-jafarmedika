'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Leaf } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { cn } from '@/lib/utils'
import { herbalQuestions } from './types'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

export default function SectionC({ form, updateField }: SectionProps) {
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
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] tracking-tight">
            Bagian C — Layanan Herbal & Apotek
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-[family-name:var(--font-body)]">
            Lewati jika tidak mendapat resep herbal
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600" />
        <div className="p-5 sm:p-6 space-y-6">
          {/* C1 */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-display)]">
              <span className="text-teal-600 mr-1">C1.</span>
              Apakah Anda mendapatkan resep produk herbal dari dokter akupuntur?
            </Label>
            <RadioGroup
              value={form.herbal_prescribed}
              onValueChange={(v) => updateField('herbal_prescribed', v)}
              className="flex gap-4"
            >
              {['Ya', 'Tidak'].map((opt) => (
                <div
                  key={opt}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer',
                    form.herbal_prescribed === opt
                      ? 'border-teal-500 bg-teal-50 shadow-sm'
                      : 'border-slate-200 hover:border-teal-300'
                  )}
                  onClick={() => updateField('herbal_prescribed', opt)}
                >
                  <RadioGroupItem value={opt} id={`herbal-${opt}`} className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" />
                  <Label htmlFor={`herbal-${opt}`} className="text-sm font-medium cursor-pointer font-[family-name:var(--font-body)]">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C2: Only if Ya */}
          {form.herbal_prescribed === 'Ya' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-5 pt-5 border-t border-slate-200"
            >
              <p className="text-sm font-semibold text-teal-700 font-[family-name:var(--font-display)]">
                C2. Pengalaman terkait produk herbal yang diresepkan:
              </p>
              {herbalQuestions.map((q, i) => (
                <div key={i} className="space-y-2.5">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed font-[family-name:var(--font-body)]">{q.text}</p>
                  <LikertScale
                    value={form[q.key] as number | null}
                    onChange={(v) => updateField(q.key, v)}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {form.herbal_prescribed === 'Tidak' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-sm text-slate-400 italic font-[family-name:var(--font-body)]">
                Bagian C2 dilewati. Lanjut ke Bagian D.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}