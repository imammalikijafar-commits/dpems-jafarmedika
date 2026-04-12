'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle } from 'lucide-react'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

export default function SectionH({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <MessageCircle className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian H — Masukan & Saran</h2>
        <p className="text-sm text-gray-500">Bagian ini opsional, tapi sangat berarti bagi kami</p>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-emerald-700">H1. Hal yang PALING ANDA SUKAI dari layanan integrative medicine:</Label>
            <Textarea
              value={form.best_experience}
              onChange={(e) => updateField('best_experience', e.target.value)}
              placeholder="Ceritakan hal yang paling Anda sukai..."
              className="min-h-[100px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-700">H2. Saran perbaikan yang Anda harapkan:</Label>
            <Textarea
              value={form.improvement_suggestion}
              onChange={(e) => updateField('improvement_suggestion', e.target.value)}
              placeholder="Saran perbaikan apa yang Anda harapkan?..."
              className="min-h-[100px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-amber-700">H3. Ceritakan pengalaman Anda menjalani terapi integratif:</Label>
            <Textarea
              value={form.testimonial}
              onChange={(e) => updateField('testimonial', e.target.value)}
              placeholder="Pengalaman positif yang ingin dibagikan?..."
              className="min-h-[100px] text-base"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-gray-400 italic">
          Terima kasih atas waktu dan partisipasi Anda. Semoga senantiasa diberikan kesehatan dan kesembuhan.
        </p>
      </div>
    </div>
  )
}
