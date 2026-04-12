'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Leaf } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import { herbalQuestions } from './types'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

export default function SectionC({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Leaf className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian C — Layanan Herbal & Apotek</h2>
        <p className="text-sm text-gray-500">Lewati jika tidak mendapat resep herbal</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* C1: Apakah mendapat resep herbal? */}
          <div className="space-y-3">
            <Label className="text-base font-bold">C1. Apakah Anda mendapatkan resep produk herbal dari dokter akupuntur?</Label>
            <RadioGroup
              value={form.herbal_prescribed}
              onValueChange={(v) => updateField('herbal_prescribed', v)}
              className="flex gap-4"
            >
              {['Ya', 'Tidak'].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`herbal-${opt}`} />
                  <Label htmlFor={`herbal-${opt}`} className="text-base font-normal">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* C2: Only if Ya */}
          {form.herbal_prescribed === 'Ya' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-5 pt-4 border-t border-emerald-100"
            >
              <p className="text-sm font-semibold text-emerald-700">C2. Pengalaman terkait produk herbal yang diresepkan:</p>
              {herbalQuestions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-base font-medium text-gray-700 leading-relaxed">{q.text}</p>
                  <LikertScale
                    value={form[q.key] as number | null}
                    onChange={(v) => updateField(q.key, v)}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {form.herbal_prescribed === 'Tidak' && (
            <p className="text-sm text-gray-400 italic">Bagian C2 dilewati. Lanjut ke Bagian D.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
