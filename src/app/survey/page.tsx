'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2, ChevronRight, ChevronLeft, X,
  Activity, Star, MessageCircle, User,
  Leaf, BookOpen, Stethoscope, Sparkles,
  Hospital, ArrowLeft
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
  { title: 'Data Responden', icon: User, shortTitle: 'A', desc: 'Demografi' },
  { title: 'Kualitas Layanan', icon: Activity, shortTitle: 'B', desc: 'SERVQUAL' },
  { title: 'Layanan Herbal', icon: Leaf, shortTitle: 'C', desc: 'Herbal' },
  { title: 'Terapi Adjuvan', icon: BookOpen, shortTitle: 'D', desc: 'Adjuvan' },
  { title: 'Perubahan Kondisi', icon: Stethoscope, shortTitle: 'E', desc: 'VAS' },
  { title: 'Dimensi Spiritual', icon: Sparkles, shortTitle: 'F', desc: 'Spiritual' },
  { title: 'Loyaltas & NPS', icon: Star, shortTitle: 'G', desc: 'NPS' },
  { title: 'Masukan & Saran', icon: MessageCircle, shortTitle: 'H', desc: 'Feedback' },
]

// ============================================================
// Animation variants
// ============================================================

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

// ============================================================
// Main Component
// ============================================================

export default function SurveyPage() {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
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

      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const msg = errData?.error || `Gagal menyimpan (HTTP ${res.status})`
        console.error('Survey submit failed:', msg, errData)
        setSubmitError(msg)
        return
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Survey submit error:', err)
      setSubmitError('Gagal mengirim survei. Periksa koneksi internet Anda.')
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // Submitted Screen
  // ============================================================
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[120px]" />
          <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-teal-600/8 blur-[120px]" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="max-w-lg w-full relative"
        >
          {/* Glass card */}
          <div className="rounded-2xl border border-white/60 backdrop-blur-xl bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-8">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
              className="text-center space-y-3"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] tracking-tight">
                Terima kasih atas partisipasi Anda!
              </h1>
              <p className="text-base text-slate-500 font-[family-name:var(--font-body)] leading-relaxed">
                Semoga Allah memberikan kesembuhan yang sempurna.
              </p>
            </motion.div>

            {/* Quran verse card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT }}
              className="rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/80 border border-teal-200/60 p-5"
            >
              <p className="text-sm italic text-teal-800 leading-relaxed text-center font-[family-name:var(--font-body)]">
                &ldquo;Dan Allah menyembuhkan kamu penyakitmu (QS. Yunus: 57)&rdquo;
              </p>
            </motion.div>

            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5, ease: EASE_OUT }}
            >
              <Button
                onClick={() => router.push('/')}
                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/35"
                size="lg"
              >
                Kembali ke Beranda
              </Button>
            </motion.div>

            {/* Hospital branding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 pt-2"
            >
              <Hospital className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-medium text-slate-400 font-[family-name:var(--font-body)]">
                RSU Ja&apos;far Medika Karanganyar
              </span>
            </motion.div>
          </div>
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

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============================================================ */}
      {/* Header with step indicator */}
      {/* ============================================================ */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="sticky top-0 z-50 border-b border-slate-200/60"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Top bar */}
        <div className="bg-white/80 border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-dpems-icon.svg" alt="" className="w-9 h-9" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium font-[family-name:var(--font-body)]">RSU Ja&apos;far Medika</p>
                <p className="text-sm font-bold text-slate-800 font-[family-name:var(--font-display)]">Poli Akupuntur & Herbal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 font-[family-name:var(--font-body)] tabular-nums">
                {step + 1}/{STEPS.length}
              </span>
              <button
                onClick={() => router.push('/')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Kembali ke Beranda"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-white/60 px-4 sm:px-6 py-2.5">
          <div className="max-w-3xl mx-auto">
            {/* Progress bar */}
            <div className="relative h-1.5 rounded-full bg-slate-200/80 mb-3 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between gap-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isCompleted = i < step
                const isCurrent = i === step
                return (
                  <button
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    disabled={!isCompleted && !isCurrent}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all text-left',
                      isCompleted && 'cursor-pointer hover:bg-teal-50',
                      isCurrent && 'bg-teal-50',
                      (!isCompleted && !isCurrent) && 'cursor-default opacity-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all shrink-0',
                        isCompleted && 'bg-teal-500 text-white',
                        isCurrent && 'bg-gradient-to-br from-teal-600 to-teal-500 text-white shadow-sm shadow-teal-500/20',
                        (!isCompleted && !isCurrent) && 'bg-slate-200 text-slate-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        s.shortTitle
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className={cn(
                        'text-[11px] font-semibold leading-tight font-[family-name:var(--font-display)]',
                        isCurrent ? 'text-teal-700' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                      )}>
                        {s.title}
                      </span>
                      <span className="text-[9px] text-slate-400 font-[family-name:var(--font-body)]">{s.desc}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ============================================================ */}
      {/* Content */}
      {/* ============================================================ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* Navigation Buttons */}
      {/* ============================================================ */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: EASE_OUT }}
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Top gradient fade */}
        <div className="h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
        <div className="bg-white/90 border-t border-slate-200/60 px-4 py-3">
          <div className="max-w-3xl mx-auto grid grid-cols-1 gap-3 sm:flex sm:flex-nowrap">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-11 text-sm font-semibold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-[family-name:var(--font-display)]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className={cn(
                  'h-11 text-sm font-semibold rounded-xl text-white shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 font-[family-name:var(--font-display)]',
                  step === 0 && 'flex-1'
                )}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed font-[family-name:var(--font-display)]"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Kirim Survei
                    <CheckCircle2 className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            )}
            {/* Submit Error Display */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full mt-1 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-between"
              >
                <p className="text-xs text-red-700 font-medium">{submitError}</p>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600 ml-2 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom" />
      </motion.div>
    </div>
  )
}