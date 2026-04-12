'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BookOpen } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { adjuvantQuestions } from './types'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

export default function SectionD({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <BookOpen className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian D — Pemahaman Terapi Adjuvan</h2>
        <p className="text-sm text-gray-500">Terapi adjuvan = akupuntur/herbal MENDUKUNG pengobatan dokter spesialis</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* D1 */}
          <div className="space-y-3">
            <Label className="text-base font-bold">D1. Menurut pemahaman Anda, peran akupuntur/herbal dalam pengobatan Anda adalah:</Label>
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
                <div key={opt} className="flex items-start space-x-2">
                  <RadioGroupItem value={opt} id={`adj-${opt.slice(0, 10)}`} className="mt-1" />
                  <Label htmlFor={`adj-${opt.slice(0, 10)}`} className="text-sm font-normal leading-relaxed">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* D2 */}
          <div className="space-y-5 pt-4 border-t border-emerald-100">
            <p className="text-sm font-semibold text-emerald-700">D2. Kualitas informasi yang saya terima tentang terapi ini:</p>
            {adjuvantQuestions.map((q, i) => (
              <div key={i} className="space-y-2">
                <p className="text-base font-medium text-gray-700 leading-relaxed">{q.text}</p>
                <LikertScale
                  value={form[q.key] as number | null}
                  onChange={(v) => updateField(q.key, v)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
