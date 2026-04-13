'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle } from 'lucide-react'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

export default function SectionH({ form, updateField }: SectionProps) {
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
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] tracking-tight">
            Bagian H — Masukan & Saran
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-[family-name:var(--font-body)]">
            Bagian ini opsional, tapi sangat berarti bagi kami
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600" />
        <div className="p-5 sm:p-6 space-y-5">
          {/* H1 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-teal-700 font-[family-name:var(--font-display)]">
              H1. Hal yang PALING ANDA SUKAI dari layanan integrative medicine:
            </Label>
            <Textarea
              value={form.best_experience}
              onChange={(e) => updateField('best_experience', e.target.value)}
              placeholder="Ceritakan hal yang paling Anda sukai..."
              className="min-h-[100px] text-sm rounded-xl border-slate-200 font-[family-name:var(--font-body)] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 resize-none"
            />
          </div>

          {/* H2 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-700 font-[family-name:var(--font-display)]">
              H2. Saran perbaikan yang Anda harapkan:
            </Label>
            <Textarea
              value={form.improvement_suggestion}
              onChange={(e) => updateField('improvement_suggestion', e.target.value)}
              placeholder="Saran perbaikan apa yang Anda harapkan?..."
              className="min-h-[100px] text-sm rounded-xl border-slate-200 font-[family-name:var(--font-body)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none"
            />
          </div>

          {/* H3 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-amber-700 font-[family-name:var(--font-display)]">
              H3. Ceritakan pengalaman Anda menjalani terapi integratif:
            </Label>
            <Textarea
              value={form.testimonial}
              onChange={(e) => updateField('testimonial', e.target.value)}
              placeholder="Pengalaman positif yang ingin dibagikan?..."
              className="min-h-[100px] text-sm rounded-xl border-slate-200 font-[family-name:var(--font-body)] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Closing message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center py-2"
      >
        <p className="text-xs text-slate-400 italic font-[family-name:var(--font-body)]">
          Terima kasih atas waktu dan partisipasi Anda. Semoga senantiasa diberikan kesehatan dan kesembuhan.
        </p>
      </motion.div>
    </motion.div>
  )
}