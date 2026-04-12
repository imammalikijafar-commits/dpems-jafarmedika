'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { User } from 'lucide-react'
import { AGE_RANGES, EDUCATIONS, OCCUPATIONS, PATIENT_TYPES, CONDITION_TYPES, VISIT_COUNTS, REFERRAL_SOURCES } from '@/lib/validators'
import type { FormData } from './types'

interface SectionProps {
  form: FormData
  updateField: (key: keyof FormData, value: string | number | null) => void
}

const SelectField = ({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: readonly string[] | string[]; placeholder: string
}) => (
  <div className="space-y-2">
    <Label className="text-base font-semibold">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="text-base h-12">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default function SectionA({ form, updateField }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <User className="w-10 h-10 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Bagian A — Data Responden</h2>
        <p className="text-sm text-gray-500">Data Anda dijamin kerahasiaannya</p>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="A1. Usia Anda" value={form.age_range} onChange={(v) => updateField('age_range', v)} options={[...AGE_RANGES]} placeholder="Pilih usia" />
            <SelectField label="A2. Jenis Kelamin" value={form.gender} onChange={(v) => updateField('gender', v)} options={['L', 'P']} placeholder="Pilih" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="A3. Pendidikan Terakhir" value={form.education} onChange={(v) => updateField('education', v)} options={[...EDUCATIONS]} placeholder="Pilih" />
            <div className="space-y-2">
              <SelectField label="A4. Pekerjaan" value={form.occupation} onChange={(v) => updateField('occupation', v)} options={[...OCCUPATIONS]} placeholder="Pilih" />
              {form.occupation === 'Lainnya' && (
                <Input
                  placeholder="Tuliskan pekerjaan Anda..."
                  value={form.occupation_other}
                  onChange={(e) => updateField('occupation_other', e.target.value)}
                  className="h-11 text-base"
                />
              )}
            </div>
          </div>

          <SelectField label="A5. Jenis Pembayaran" value={form.patient_type} onChange={(v) => updateField('patient_type', v)} options={[...PATIENT_TYPES]} placeholder="Pilih" />
          <SelectField label="A6. Keluhan Utama" value={form.condition_type} onChange={(v) => updateField('condition_type', v)} options={[...CONDITION_TYPES]} placeholder="Pilih keluhan" />
          <SelectField label="A7. Kunjungan Ke-" value={form.visit_count} onChange={(v) => updateField('visit_count', v)} options={[...VISIT_COUNTS]} placeholder="Pilih" />
          <SelectField label="A8. Sumber Rujukan" value={form.referral_source} onChange={(v) => updateField('referral_source', v)} options={[...REFERRAL_SOURCES]} placeholder="Pilih" />
        </CardContent>
      </Card>
    </div>
  )
}