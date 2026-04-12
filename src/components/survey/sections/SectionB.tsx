'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { servqualSections } from './types'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

export default function SectionB({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Activity className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian B — Kualitas Layanan Akupuntur</h2>
        <p className="text-sm text-gray-500">Skala: 1 = Sangat Tidak Setuju, 5 = Sangat Setuju</p>
      </div>

      {servqualSections.map((section, si) => (
        <Card key={si}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-gray-700">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {section.questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-base font-medium text-gray-700 leading-relaxed">
                  {q.text}
                </p>
                <LikertScale
                  value={form[q.key] as number | null}
                  onChange={(v) => updateField(q.key, v)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
