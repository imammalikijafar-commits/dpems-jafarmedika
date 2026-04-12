'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  Activity, Star, MessageCircle, User,
  Leaf, BookOpen, Stethoscope, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { computeDimensionAverage } from '@/lib/validators'
import type { FormData } from '@/components/survey/sections/types'
import { initialForm } from '@/components/survey/sections/types'
import SectionA from '@/components/survey/sections/SectionA'
import SectionB from '@/components/survey/sections/SectionB'
import SectionC from '@/components/survey/sections/SectionC'
import SectionD from '@/components/survey/sections/SectionD'
import SectionE from '@/components/survey/sections/SectionE'
import SectionF from '@/components/survey/sections/SectionF'
import SectionG from '@/components/survey/sections/SectionG'
import SectionH from '@/components/survey/sections/SectionH'

// ============================================================
// 8 Steps matching Kuesioner A-H
// ============================================================

const STEPS = [
  { title: 'Data Responden', icon: User, shortTitle: 'A' },
  { title: 'Kualitas Layanan', icon: Activity, shortTitle: 'B' },
  { title: 'Layanan Herbal', icon: Leaf, shortTitle: 'C' },
  { title: 'Terapi Adjuvan', icon: BookOpen, shortTitle: 'D' },
  { title: 'Perubahan Kondisi', icon: Stethoscope, shortTitle: 'E' },
  { title: 'Dimensi Spiritual', icon: Sparkles, shortTitle: 'F' },
  { title: 'Loyaltas & NPS', icon: Star, shortTitle: 'G' },
  { title: 'Masukan & Saran', icon: MessageCircle, shortTitle: 'H' },
]

// ============================================================
// Main Component
// ============================================================

export default function SurveyPage() {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionStart] = useState(Date.now())

  const updateField = useCallback((key: keyof FormData, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  // ============================================================
  // Submit: compute SERVQUAL averages from individual scores
  // ============================================================
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const sessionDuration = Math.round((Date.now() - sessionStart) / 1000)

      const tangibles = computeDimensionAverage([
        form.b1_t1_kebersihan, form.b1_t2_steril, form.b1_t3_berbaring, form.b1_t4_suasana
      ])
      const reliability = computeDimensionAverage([
        form.b2_r1_tepat_waktu, form.b2_r2_hadir, form.b2_r3_terstandar, form.b2_r4_rekam_medis
      ])
      const responsiveness = computeDimensionAverage([
        form.b3_c1_tunggu, form.b3_c2_respons, form.b3_c3_jelas, form.b3_c4_efek_samping
      ])
      const assurance = computeDimensionAverage([
        form.b4_a1_kompetensi, form.b4_a2_diagnosis, form.b4_a3_aman, form.b4_a4_sertifikasi
      ])
      const empathy = computeDimensionAverage([
        form.b5_e1_personal, form.b5_e2_kekhawatiran, form.b5_e3_hormat, form.b5_e4_perkembangan
      ])
      const spiritualAvg = computeDimensionAverage([
        form.f1_salam_doa, form.f2_islam_respect, form.f3_facility, form.f4_healing, form.f5_support
      ])

      const payload = {
        // unit_id auto-set server-side
        age_range: form.age_range,
        gender: form.gender,
        education: form.education,
        occupation: form.occupation === 'Lainnya' && form.occupation_other
          ? `Lainnya: ${form.occupation_other}`
          : form.occupation,
        patient_type: form.patient_type,
        condition_type: form.condition_type,
        visit_count: form.visit_count,
        referral_source: form.referral_source,
        tangibles, reliability, responsiveness, assurance, empathy,
        herbal_prescribed: form.herbal_prescribed === 'Ya',
        herb_explanation: form.herbal_prescribed === 'Ya' ? form.c2_herb_explanation : null,
        herb_usage_guide: form.herbal_prescribed === 'Ya' ? form.c2_herb_usage_guide : null,
        herb_safety_trust: form.herbal_prescribed === 'Ya' ? form.c2_herb_safety_trust : null,
        herb_availability: form.herbal_prescribed === 'Ya' ? form.c2_herb_availability : null,
        herb_affordability: form.herbal_prescribed === 'Ya' ? form.c2_herb_affordability : null,
        herb_pharmacist: form.herbal_prescribed === 'Ya' ? form.c2_herb_pharmacist : null,
        adjuvant_role: form.adjuvant_role,
        info_acupuncture_support: form.d2_info_acupuncture_support,
        info_understanding: form.d2_info_understanding,
        info_sufficient: form.d2_info_sufficient,
        info_comfortable_asking: form.d2_info_comfortable_asking,
        pain_level_before: form.pain_level_before,
        pain_level_after: form.visit_count === 'Pertama kali' ? null : form.pain_level_after,
        condition_change: form.condition_change,
        spiritual_salam_doa: form.f1_salam_doa,
        spiritual_islam_respect: form.f2_islam_respect,
        spiritual_facility: form.f3_facility,
        spiritual_healing: form.f4_healing,
        spiritual_support: form.f5_support,
        nps_score: form.nps_score,
        visit_plan: form.visit_plan,
        has_recommended: form.has_recommended,
        best_experience: form.best_experience || null,
        improvement_suggestion: form.improvement_suggestion || null,
        testimonial: form.testimonial || null,
        responses_json: {
          demographics: { age_range: form.age_range, gender: form.gender, education: form.education, occupation: form.occupation === 'Lainnya' && form.occupation_other ? `Lainnya: ${form.occupation_other}` : form.occupation, patient_type: form.patient_type, condition_type: form.condition_type, visit_count: form.visit_count, referral_source: form.referral_source },
          servqual_individual: {
            tangibles: [form.b1_t1_kebersihan, form.b1_t2_steril, form.b1_t3_berbaring, form.b1_t4_suasana],
            reliability: [form.b2_r1_tepat_waktu, form.b2_r2_hadir, form.b2_r3_terstandar, form.b2_r4_rekam_medis],
            responsiveness: [form.b3_c1_tunggu, form.b3_c2_respons, form.b3_c3_jelas, form.b3_c4_efek_samping],
            assurance: [form.b4_a1_kompetensi, form.b4_a2_diagnosis, form.b4_a3_aman, form.b4_a4_sertifikasi],
            empathy: [form.b5_e1_personal, form.b5_e2_kekhawatiran, form.b5_e3_hormat, form.b5_e4_perkembangan],
          },
          servqual_averages: { tangibles, reliability, responsiveness, assurance, empathy, spiritual_average: spiritualAvg },
          herbal: form.herbal_prescribed === 'Ya' ? { explanation: form.c2_herb_explanation, usage_guide: form.c2_herb_usage_guide, safety_trust: form.c2_herb_safety_trust, availability: form.c2_herb_availability, affordability: form.c2_herb_affordability, pharmacist: form.c2_herb_pharmacist } : null,
          adjuvant: { role: form.adjuvant_role, info_acupuncture_support: form.d2_info_acupuncture_support, info_understanding: form.d2_info_understanding, info_sufficient: form.d2_info_sufficient, info_comfortable_asking: form.d2_info_comfortable_asking },
          clinical: { pain_before: form.pain_level_before, pain_after: form.visit_count === 'Pertama kali' ? null : form.pain_level_after, condition_change: form.condition_change },
          spiritual_individual: [form.f1_salam_doa, form.f2_islam_respect, form.f3_facility, form.f4_healing, form.f5_support],
          loyalty: { nps_score: form.nps_score, visit_plan: form.visit_plan, has_recommended: form.has_recommended },
        },
        session_duration_seconds: sessionDuration,
      }

      await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // Submitted Screen
  // ============================================================
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Terima kasih atas partisipasi Anda!</h1>
            <p className="text-lg text-gray-600">
              Semoga Allah memberikan kesembuhan yang sempurna.
            </p>
          </div>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <p className="text-sm italic text-emerald-800 leading-relaxed">
                &ldquo;Dan Allah menyembuhkan kamu penyakitmu (QS. Yunus: 57)&rdquo;
              </p>
            </CardContent>
          </Card>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
            size="lg"
          >
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    )
  }

  // ============================================================
  // Section renderer
  // ============================================================
  const renderSection = () => {
    switch (step) {
      case 0: return <SectionA form={form} updateField={updateField} />
      case 1: return <SectionB form={form} updateField={updateField} />
      case 2: return <SectionC form={form} updateField={updateField} />
      case 3: return <SectionD form={form} updateField={updateField} />
      case 4: return <SectionE form={form} updateField={updateField} visitCount={form.visit_count} />
      case 5: return <SectionF form={form} updateField={updateField} />
      case 6: return <SectionG form={form} updateField={updateField} />
      case 7: return <SectionH form={form} updateField={updateField} />
      default: return null
    }
  }

  // ============================================================
  // Main Render
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header with step indicator */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 font-medium">RSU Ja&apos;far Medika</p>
              <p className="text-sm font-bold text-emerald-700">Poli Akupuntur & Herbal</p>
            </div>
            <span className="text-xs font-medium text-gray-400">
              Bagian {step + 1} / {STEPS.length}
            </span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-1 text-[10px] font-medium transition-colors',
                  i <= step ? 'text-emerald-600' : 'text-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold',
                    i < step ? 'bg-emerald-500' : i === step ? 'bg-emerald-600 ring-2 ring-emerald-200' : 'bg-gray-200'
                  )}
                >
                  {i < step ? '✓' : s.shortTitle}
                </div>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-emerald-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 text-base"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Kembali
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
            >
              Selanjutnya
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
            >
              {submitting ? 'Menyimpan...' : 'Kirim Survei'}
              <CheckCircle2 className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}