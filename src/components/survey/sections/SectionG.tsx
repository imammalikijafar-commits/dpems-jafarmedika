'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VISIT_PLANS, RECOMMENDATION_STATUS } from '@/lib/validators'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

const getNPSLabel = (v: number) => {
  if (v <= 6) return { text: 'Detractor', color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
  if (v <= 8) return { text: 'Passive', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' }
  return { text: 'Promoter', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' }
}

export default function SectionG({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Star className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian G — Loyaltas & Rekomendasi (NPS)</h2>
        <p className="text-sm text-gray-500">Seberapa besar kemungkinan Anda merekomendasikan layanan ini?</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* G1: NPS Score */}
          <div className="space-y-3">
            <Label className="text-lg font-bold text-center block">
              G1. NPS Score: {form.nps_score}
            </Label>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Sangat Tidak Mungkin</span>
              <span>Sangat Pasti Merekomendasikan</span>
            </div>
            <input
              type="range"
              min={0} max={10}
              value={form.nps_score}
              onChange={(e) => updateField('nps_score', parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs">
              {Array.from({ length: 11 }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all',
                    getNPSLabel(i).bg,
                    form.nps_score === i && 'scale-125 shadow-md'
                  )}
                  onClick={() => updateField('nps_score', i)}
                >
                  {i}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="text-red-500 font-medium">0-6: Detractor</span>
              <span className="text-amber-500 font-medium">7-8: Passive</span>
              <span className="text-emerald-500 font-medium">9-10: Promoter</span>
            </div>
          </div>

          {/* G2: Rencana ke depan */}
          <div className="space-y-3 pt-4 border-t border-emerald-100">
            <Label className="text-base font-bold">G2. Rencana Anda ke depan terkait layanan ini:</Label>
            <RadioGroup
              value={form.visit_plan}
              onValueChange={(v) => updateField('visit_plan', v)}
              className="space-y-2"
            >
              {VISIT_PLANS.map((opt) => (
                <div key={opt} className="flex items-start space-x-2">
                  <RadioGroupItem value={opt} id={`plan-${opt.slice(0, 10)}`} className="mt-1" />
                  <Label htmlFor={`plan-${opt.slice(0, 10)}`} className="text-sm font-normal leading-relaxed">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* G3: Pernah merekomendasikan? */}
          <div className="space-y-3 pt-4 border-t border-emerald-100">
            <Label className="text-base font-bold">G3. Apakah Anda pernah merekomendasikan layanan ini kepada orang lain?</Label>
            <RadioGroup
              value={form.has_recommended}
              onValueChange={(v) => updateField('has_recommended', v)}
              className="space-y-2"
            >
              {RECOMMENDATION_STATUS.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`rec-${opt.slice(0, 10)}`} />
                  <Label htmlFor={`rec-${opt.slice(0, 10)}`} className="text-sm font-normal">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
