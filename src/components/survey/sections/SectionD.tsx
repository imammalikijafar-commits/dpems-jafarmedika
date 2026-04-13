'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BookOpen } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { adjuvantQuestions } from './types'
import type { FormData } from './types'
import { cn } from '@/lib/utils'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

export default function SectionD({ form, updateField }: SectionProps) {
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
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] tracking-tight">
            Bagian D — Pemahaman Terapi Adjuvan
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-[family-name:var(--font-body)]">
            Terapi adjuvan = akupuntur/herbal MENDUKUNG pengobatan dokter spesialis
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600" />
        <div className="p-5 sm:p-6 space-y-6">
          {/* D1 */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-display)]">
              <span className="text-teal-600 mr-1">D1.</span>
              Menurut pemahaman Anda, peran akupuntur/herbal dalam pengobatan Anda adalah:
            </Label>
            <RadioGroup
              value={form.adjuvant_role}
              onValueChange={(v) => updateField('adjuvant_role', v)}
              className="space-y-2"
            >
              {[
                'Pengganti obat dokter spesialis (saya berhenti minum obat)',
                'Pendukung/pelengkap (tetap minum obat + tambah akupuntur/herbal)',
                'Pilihan terakhir (setelah obat konvensional tidak berhasil)',
                'Belum tahu/tidak yakin',
              ].map((opt) => (
                <div
                  key={opt}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer',
                    form.adjuvant_role === opt
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/30'
                  )}
                  onClick={() => updateField('adjuvant_role', opt)}
                >
                  <RadioGroupItem value={opt} id={`adj-${opt.slice(0, 10)}`} className="mt-0.5 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" />
                  <Label htmlFor={`adj-${opt.slice(0, 10)}`} className="text-sm font-normal leading-relaxed cursor-pointer font-[family-name:var(--font-body)]">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* D2 */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <p className="text-sm font-semibold text-teal-700 font-[family-name:var(--font-display)]">
              D2. Kualitas informasi yang saya terima tentang terapi ini:
            </p>
            {adjuvantQuestions.map((q, i) => (
              <div key={i} className="space-y-2.5">
                <p className="text-sm font-medium text-slate-600 leading-relaxed font-[family-name:var(--font-body)]">{q.text}</p>
                <LikertScale
                  value={form[q.key] as number | null}
                  onChange={(v) => updateField(q.key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}