'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ChevronRight, ChevronLeft, Activity, Heart, Star, MessageCircle, User } from 'lucide-react'
import LikertScale from '@/components/survey/LikertScale'
import PainScale from '@/components/survey/PainScale'
import { cn } from '@/lib/utils'
import { computeDimensionAverage } from '@/lib/validators'

const STEPS = [
  { title: 'Data Diri', icon: User, desc: 'Informasi dasar pasien' },
  { title: 'Penilaian Layanan', icon: Activity, desc: 'SERVQUAL Assessment' },
  { title: 'Hasil Terapi', icon: Heart, desc: 'Clinical Outcomes' },
  { title: 'Aspek Spiritual', icon: Star, desc: 'Opsional' },
  { title: 'Masukan', icon: MessageCircle, desc: 'NPS & Feedback' },
]

interface FormData {
  // Demographics
  age_range: string
  gender: string
  patient_type: string
  visit_count: string
  treatment_type: string
  // SERVQUAL (individual questions, averaged on submit)
  t1_kebersihan: number | null
  t2_kenyamanan: number | null
  t3_suasana: number | null
  t4_herbal: number | null
  t5_biaya: number | null
  r1_jadwal: number | null
  r2_terapisWanita: number | null
  r3_resep: number | null
  r4_followup: number | null
  r5_rekamMedis: number | null
  c1_tunggu: number | null
  c2_respons: number | null
  c3_reschedule: number | null
  c4_emergency: number | null
  a1_penjelasan: number | null
  a2_sertifikasi: number | null
  a3_efekSamping: number | null
  a4_safetyCheck: number | null
  a5_doa: number | null
  e1_perhatian: number | null
  e2_penghargaan: number | null
  e3_frustrasi: number | null
  e4_respek: number | null
  e5_keluarga: number | null
  // Clinical
  pain_level_before: number
  pain_level_after: number
  functional_improvement: string
  // Spiritual (matching DB columns)
  spiritual_comfort: number | null
  cultural_respect: number | null
  family_feeling: number | null
  // NPS
  nps_score: number
  // Qualitative (3 fields per schema)
  complaints: string
  suggestions: string
  testimonial: string
}

const initialForm: FormData = {
  age_range: '',
  gender: '',
  patient_type: '',
  visit_count: '',
  treatment_type: '',
  t1_kebersihan: null, t2_kenyamanan: null, t3_suasana: null, t4_herbal: null, t5_biaya: null,
  r1_jadwal: null, r2_terapisWanita: null, r3_resep: null, r4_followup: null, r5_rekamMedis: null,
  c1_tunggu: null, c2_respons: null, c3_reschedule: null, c4_emergency: null,
  a1_penjelasan: null, a2_sertifikasi: null, a3_efekSamping: null, a4_safetyCheck: null, a5_doa: null,
  e1_perhatian: null, e2_penghargaan: null, e3_frustrasi: null, e4_respek: null, e5_keluarga: null,
  pain_level_before: 5,
  pain_level_after: 5,
  functional_improvement: '',
  spiritual_comfort: null,
  cultural_respect: null,
  family_feeling: null,
  nps_score: 8,
  complaints: '',
  suggestions: '',
  testimonial: '',
}

const servqualSections = [
  {
    title: 'Tangibles (Ketangguhan Fisik)',
    color: 'emerald',
    questions: [
      { key: 't1_kebersihan', text: 'Kebersihan ruangan terapi' },
      { key: 't2_kenyamanan', text: 'Kenyamanan tempat berbaring / terapi' },
      { key: 't3_suasana', text: 'Suasana ruangan (tenang, nyaman)' },
      { key: 't4_herbal', text: 'Ketersediaan herbal / kelor' },
      { key: 't5_biaya', text: 'Kejelasan informasi biaya' },
    ],
  },
  {
    title: 'Reliability (Keandalan)',
    color: 'blue',
    questions: [
      { key: 'r1_jadwal', text: 'Konsistensi jadwal dokter / terapis' },
      { key: 'r2_terapisWanita', text: 'Ketersediaan terapis sesuai jenis kelamin' },
      { key: 'r3_resep', text: 'Ketepatan resep / anjuran terapi' },
      { key: 'r4_followup', text: 'Sistem follow-up setelah terapi' },
      { key: 'r5_rekamMedis', text: 'Kelengkapan rekam medis' },
    ],
  },
  {
    title: 'Responsiveness (Kecepatan Tanggap)',
    color: 'amber',
    questions: [
      { key: 'c1_tunggu', text: 'Waktu tunggu dari check-in hingga terapi' },
      { key: 'c2_respons', text: 'Respons staf saat pasien merasa tidak nyaman' },
      { key: 'c3_reschedule', text: 'Kemudahan mengatur ulang jadwal' },
      { key: 'c4_emergency', text: 'Kecepatan penanganan keadaan darurat' },
    ],
  },
  {
    title: 'Assurance (Jaminan)',
    color: 'purple',
    questions: [
      { key: 'a1_penjelasan', text: 'Penjelasan prosedur terapi sebelum dimulai' },
      { key: 'a2_sertifikasi', text: 'Sertifikasi / izin praktik terapis terpampang' },
      { key: 'a3_efekSamping', text: 'Penjelasan efek samping yang mungkin' },
      { key: 'a4_safetyCheck', text: 'Pemeriksaan interaksi herbal-obat medis' },
      { key: 'a5_doa', text: 'Aspek spiritual / doa dalam layanan' },
    ],
  },
  {
    title: 'Empathy (Perhatian Personal)',
    color: 'rose',
    questions: [
      { key: 'e1_perhatian', text: 'Perhatian terhadap rasa nyeri / ketidaknyamanan' },
      { key: 'e2_penghargaan', text: 'Penghargaan atas kemajuan pasien' },
      { key: 'e3_frustrasi', text: 'Pemahaman terhadap frustrasi pasien' },
      { key: 'e4_respek', text: 'Respek terhadap preferensi pasien' },
      { key: 'e5_keluarga', text: 'Keterlibatan keluarga dalam perawatan' },
    ],
  },
]

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unitId as string

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [unitName, setUnitName] = useState('')
  const [unitDbId, setUnitDbId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sessionStart] = useState(Date.now())

  useEffect(() => {
    fetch('/api/units')
      .then((r) => r.json())
      .then((units) => {
        // Match by qr_code field
        const unit = units.find((u: { qr_code: string }) => u.qr_code === unitId)
        if (unit) {
          setUnitName(unit.name)
          setUnitDbId(unit.id)
        }
      })
      .catch(() => {})
  }, [unitId])

  const updateField = useCallback((key: keyof FormData, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Compute SERVQUAL dimension averages from individual questions
      const sessionDuration = Math.round((Date.now() - sessionStart) / 1000)
      const payload = {
        unit_id: unitDbId,
        age_range: form.age_range,
        gender: form.gender,
        patient_type: form.patient_type,
        visit_count: parseInt(form.visit_count) || 1,
        treatment_type: form.treatment_type,
        // SERVQUAL: compute averages per dimension
        tangibles: computeDimensionAverage([form.t1_kebersihan, form.t2_kenyamanan, form.t3_suasana, form.t4_herbal, form.t5_biaya]),
        reliability: computeDimensionAverage([form.r1_jadwal, form.r2_terapisWanita, form.r3_resep, form.r4_followup, form.r5_rekamMedis]),
        responsiveness: computeDimensionAverage([form.c1_tunggu, form.c2_respons, form.c3_reschedule, form.c4_emergency]),
        assurance: computeDimensionAverage([form.a1_penjelasan, form.a2_sertifikasi, form.a3_efekSamping, form.a4_safetyCheck, form.a5_doa]),
        empathy: computeDimensionAverage([form.e1_perhatian, form.e2_penghargaan, form.e3_frustrasi, form.e4_respek, form.e5_keluarga]),
        // Clinical
        pain_level_before: form.pain_level_before,
        pain_level_after: form.pain_level_after,
        functional_improvement: form.functional_improvement || null,
        // Spiritual
        spiritual_comfort: form.spiritual_comfort,
        cultural_respect: form.cultural_respect,
        family_feeling: form.family_feeling,
        // NPS
        nps_score: form.nps_score,
        // Qualitative
        complaints: form.complaints || null,
        suggestions: form.suggestions || null,
        testimonial: form.testimonial || null,
        // Metadata
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

  const painReduction = form.pain_level_before > 0
    ? Math.round(((form.pain_level_before - form.pain_level_after) / form.pain_level_before) * 100)
    : 0

  const getNPSLabel = (v: number) => {
    if (v <= 6) return { text: 'Detractor', color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
    if (v <= 8) return { text: 'Passive', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' }
    return { text: 'Promoter', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' }
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Terima kasih atas masukan Anda!</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 font-medium">RSU Ja&apos;far Medika</p>
              <p className="text-sm font-bold text-emerald-700">{unitName || 'Survei Pasien'}</p>
            </div>
            <span className="text-xs font-medium text-gray-400">
              Langkah {step + 1} / {STEPS.length}
            </span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
          {/* Step indicators */}
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
                  {i < step ? '✓' : i + 1}
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
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <User className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800">Data Diri Pasien</h2>
                  <p className="text-sm text-gray-500">Informasi Anda akan dijaga kerahasiaannya</p>
                </div>

                <Card>
                  <CardContent className="space-y-5 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Kelompok Usia</Label>
                        <Select value={form.age_range} onValueChange={(v) => updateField('age_range', v)}>
                          <SelectTrigger className="text-base h-12">
                            <SelectValue placeholder="Pilih usia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="40-49">40 - 49 tahun</SelectItem>
                            <SelectItem value="50-59">50 - 59 tahun</SelectItem>
                            <SelectItem value="60-69">60 - 69 tahun</SelectItem>
                            <SelectItem value="70-79">70 - 79 tahun</SelectItem>
                            <SelectItem value="80+">80+ tahun</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Jenis Kelamin</Label>
                        <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                          <SelectTrigger className="text-base h-12">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Jenis Pasien</Label>
                      <Select value={form.patient_type} onValueChange={(v) => updateField('patient_type', v)}>
                        <SelectTrigger className="text-base h-12">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BPJS">BPJS</SelectItem>
                          <SelectItem value="Umum">Umum / Bayar</SelectItem>
                          <SelectItem value="Asuransi">Asuransi</SelectItem>
                          <SelectItem value="Jaminan Perusahaan">Jaminan Perusahaan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Kunjungan ke-</Label>
                        <Select value={form.visit_count} onValueChange={(v) => updateField('visit_count', v)}>
                          <SelectTrigger className="text-base h-12">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Pertama kali</SelectItem>
                            <SelectItem value="3">2-3 kali</SelectItem>
                            <SelectItem value="6">4-6 kali</SelectItem>
                            <SelectItem value="10">7-10 kali</SelectItem>
                            <SelectItem value="15">Lebih dari 10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Jenis Terapi</Label>
                        <Select value={form.treatment_type} onValueChange={(v) => updateField('treatment_type', v)}>
                          <SelectTrigger className="text-base h-12">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Stroke Rehabilitasi">Stroke Rehabilitasi</SelectItem>
                            <SelectItem value="Manajemen Nyeri">Manajemen Nyeri</SelectItem>
                            <SelectItem value="HNP (Nyeri Saraf Pinggang)">HNP</SelectItem>
                            <SelectItem value="Ischialgia">Ischialgia</SelectItem>
                            <SelectItem value="Kombinasi">Kombinasi</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Activity className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800">Penilaian Layanan</h2>
                  <p className="text-sm text-gray-500">Seberapa puas Anda dengan aspek berikut?</p>
                </div>

                {servqualSections.map((section, si) => (
                  <Card key={si}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-700">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {section.questions.map((q, qi) => (
                        <div key={qi} className="space-y-2">
                          <p className="text-base font-medium text-gray-700 leading-relaxed">
                            {si * 5 + qi + 1}. {q.text}
                          </p>
                          <LikertScale
                            value={form[q.key as keyof FormData] as number | null}
                            onChange={(v) => updateField(q.key as keyof FormData, v)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Heart className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800">Hasil Terapi</h2>
                  <p className="text-sm text-gray-500">Bagaimana kondisi Anda sebelum dan sesudah terapi?</p>
                </div>

                <Card>
                  <CardContent className="space-y-6 p-6">
                    <PainScale
                      label="Tingkat Nyeri SEBELUM Terapi"
                      value={form.pain_level_before}
                      onChange={(v) => updateField('pain_level_before', v)}
                    />
                    <PainScale
                      label="Tingkat Nyeri SESUDAH Terapi"
                      value={form.pain_level_after}
                      onChange={(v) => updateField('pain_level_after', v)}
                    />

                    {painReduction !== 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'text-center p-4 rounded-xl',
                          painReduction > 0
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-red-50 border border-red-200'
                        )}
                      >
                        <p className="text-sm text-gray-600 mb-1">Pengurangan Nyeri</p>
                        <p className={cn('text-3xl font-bold', painReduction > 0 ? 'text-emerald-600' : 'text-red-600')}>
                          {painReduction > 0 ? '↓' : '↑'} {Math.abs(painReduction)}%
                        </p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Perbaikan Fungsional</Label>
                      <RadioGroup
                        value={form.functional_improvement}
                        onValueChange={(v) => updateField('functional_improvement', v)}
                        className="space-y-2"
                      >
                        {[
                          { value: 'much_better', label: 'Jauh Lebih Baik' },
                          { value: 'slightly_better', label: 'Sedikit Lebih Baik' },
                          { value: 'same', label: 'Tidak Ada Perubahan' },
                          { value: 'worse', label: 'Lebih Buruk' },
                        ].map((opt) => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`func-${opt.value}`} />
                            <Label htmlFor={`func-${opt.value}`} className="text-sm font-normal">
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Star className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800">Aspek Spiritual & Budaya</h2>
                  <p className="text-sm text-gray-500">
                    Bagian ini opsional. Seberapa setuju Anda?
                  </p>
                </div>

                <Card>
                  <CardContent className="space-y-6 p-6">
                    {[
                      { key: 'spiritual_comfort', text: 'Saya merasa diperlakukan seperti anggota keluarga, bukan hanya pasien.' },
                      { key: 'cultural_respect', text: 'Aspek spiritual / doa dalam layanan membantu proses penyembuhan saya.' },
                      { key: 'family_feeling', text: 'Staf menghormati latar belakang saya (petani / pensiunan / dll).' },
                    ].map((q, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-base font-medium text-gray-700 leading-relaxed">{q.text}</p>
                        <LikertScale
                          value={form[q.key as keyof FormData] as number | null}
                          onChange={(v) => updateField(q.key as keyof FormData, v)}
                          labels={['😞', '😕', '😐', '😊', '😍']}
                          disabled={false}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full" onClick={() => setStep(4)}>
                  Lewati bagian ini →
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <MessageCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-800">Masukan & Saran</h2>
                  <p className="text-sm text-gray-500">
                    Seberapa besar kemungkinan Anda merekomendasikan RS ini?
                  </p>
                </div>

                <Card>
                  <CardContent className="space-y-6 p-6">
                    {/* NPS Score */}
                    <div className="space-y-3">
                      <Label className="text-lg font-bold text-center block">
                        NPS Score: {form.nps_score}
                      </Label>
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span>Tidak Mungkin</span>
                        <span>Sangat Mungkin</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
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
                      <div className={cn('text-center mt-2', getNPSLabel(form.nps_score).color)}>
                        <span className="text-sm font-semibold">
                          {getNPSLabel(form.nps_score).text}
                        </span>
                      </div>
                    </div>

                    {/* Qualitative Feedback - 3 fields per schema */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold text-red-700">Keluhan:</Label>
                        <Textarea
                          value={form.complaints}
                          onChange={(e) => updateField('complaints', e.target.value)}
                          placeholder="Ada keluhan? (opsional)..."
                          className="min-h-[80px] text-base"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold text-blue-700">Saran:</Label>
                        <Textarea
                          value={form.suggestions}
                          onChange={(e) => updateField('suggestions', e.target.value)}
                          placeholder="Saran perbaikan? (opsional)..."
                          className="min-h-[80px] text-base"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold text-amber-700">Testimoni:</Label>
                        <Textarea
                          value={form.testimonial}
                          onChange={(e) => updateField('testimonial', e.target.value)}
                          placeholder="Pengalaman positif yang ingin dibagikan? (opsional)..."
                          className="min-h-[80px] text-base"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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