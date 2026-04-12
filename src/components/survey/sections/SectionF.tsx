'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { spiritualQuestions } from './types'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

export default function SectionF({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian F — Dimensi Spiritual & Holistik</h2>
        <p className="text-sm text-gray-500">Pengalaman spiritual selama mendapat layanan</p>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <p className="text-sm font-semibold text-emerald-700 mb-2">F1. Pengalaman spiritual selama mendapatkan layanan di RSU Ja&apos;far Medika:</p>
          {spiritualQuestions.map((q, i) => (
            <div key={i} className="space-y-2">
              <p className="text-base font-medium text-gray-700 leading-relaxed">{q.text}</p>
              <LikertScale
                value={form[q.key] as number | null}
                onChange={(v) => updateField(q.key, v)}
                labels={['😞', '😕', '😐', '😊', '😍']}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
