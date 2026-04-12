import { z } from 'zod'

// ============================================================
// DPEMS Zod Validators
// Matching Supabase Schema v1.1.0 (Kuesioner Integrative Medicine)
// RSU Ja'far Medika Karanganyar
// ============================================================

// --- Helpers ---
const likert5 = z.number().min(1).max(5)
const likert5Nullable = z.number().min(1).max(5).nullable().optional()
const painScale = z.number().min(0).max(10)
const npsScore = z.number().min(0).max(10)

// ============================================================
// Enum Constants (matching Kuesioner options)
// ============================================================

// Bagian A: Demographics
export const AGE_RANGES = ['<20', '20-30', '31-45', '46-60', '>60'] as const
export const GENDERS = ['L', 'P'] as const
export const EDUCATIONS = ['SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'D1-D3', 'S1/D4', 'S2', 'S3'] as const
export const OCCUPATIONS = [
  'PNS/TNI/Polri',
  'Karyawan Swasta',
  'Wiraswasta/Pedagang',
  'Petani',
  'Buruh Harian/Pabrik',
  'Ibu Rumah Tangga',
  'Pensiunan',
  'Pelajar/Mahasiswa',
  'Lainnya',
] as const
export const PATIENT_TYPES = ['Umum (Biaya Sendiri)', 'Asuransi Swasta'] as const
export const CONDITION_TYPES = [
  'Stroke / Pasca Stroke',
  'Nyeri Sendi (Rematik/OA)',
  'Nyeri Punggung / Saraf Kejepit',
  'Migrain / Sakit Kepala Kronis',
  'Gangguan Tidur (Insomnia)',
  'Kondisi Neurologis Lainnya',
  'Wellness / Pemeliharaan Kesehatan',
  'Lainnya',
] as const
export const VISIT_COUNTS = ['Pertama kali', '2-4 kali', '5-7 kali', '8-10 kali', 'Lebih dari 10 kali'] as const
export const REFERRAL_SOURCES = [
  'Datang sendiri (tanpa rujukan)',
  'Dirujuk dokter Interna RS ini',
  'Dirujuk dokter Neurologi RS ini',
  'Dirujuk dokter spesialis lain RS ini',
  'Rekomendasi keluarga/teman',
  'Media sosial/internet',
] as const

// Bagian D: Adjuvant
export const ADJUVANT_ROLES = [
  'Pengganti obat dokter spesialis',
  'Pendukung/pelengkap',
  'Pilihan terakhir',
  'Belum tahu/tidak yakin',
] as const

// Bagian E: Condition Change
export const CONDITION_CHANGES = [
  'Sangat Memburuk',
  'Agak Memburuk',
  'Tidak Berubah',
  'Agak Membaik',
  'Sangat Membaik',
] as const

// Bagian G: Loyalty
export const VISIT_PLANS = [
  'Lanjutkan terapi sampai sembuh/optimal',
  'Datang berkala untuk pemeliharaan kesehatan',
  'Berhenti setelah kondisi membaik',
  'Belum memutuskan',
  'Cari alternatif lain',
] as const
export const RECOMMENDATION_STATUS = [
  'Ya, sudah pernah',
  'Belum, tapi berencana',
  'Belum dan tidak berencana',
] as const

// ============================================================
// Step Schemas (per kuesioner section)
// ============================================================

// --- Step 0: Bagian A - Data Responden ---
export const demographicsSchema = z.object({
  age_range: z.enum(AGE_RANGES, { message: 'Usia wajib dipilih' }),
  gender: z.enum(GENDERS, { message: 'Jenis kelamin wajib dipilih' }),
  education: z.enum(EDUCATIONS, { message: 'Pendidikan wajib dipilih' }),
  occupation: z.enum(OCCUPATIONS, { message: 'Pekerjaan wajib dipilih' }),
  patient_type: z.enum(PATIENT_TYPES, { message: 'Jenis pembayaran wajib dipilih' }),
  condition_type: z.enum(CONDITION_TYPES, { message: 'Keluhan utama wajib dipilih' }),
  visit_count: z.enum(VISIT_COUNTS, { message: 'Kunjungan wajib dipilih' }),
  referral_source: z.enum(REFERRAL_SOURCES, { message: 'Sumber rujukan wajib dipilih' }),
})

export type DemographicsData = z.infer<typeof demographicsSchema>

// --- Step 1: Bagian B - SERVQUAL (5 dimensions × 4 questions) ---
export const servqualSchema = z.object({
  // B1 Tangibles (4 questions)
  b1_t1_kebersihan: likert5,
  b1_t2_steril: likert5,
  b1_t3_berbaring: likert5,
  b1_t4_suasana: likert5,
  // B2 Reliability (4 questions)
  b2_r1_tepat_waktu: likert5,
  b2_r2_hadir: likert5,
  b2_r3_terstandar: likert5,
  b2_r4_rekam_medis: likert5,
  // B3 Responsiveness (4 questions)
  b3_c1_tunggu: likert5,
  b3_c2_respons: likert5,
  b3_c3_jelas: likert5,
  b3_c4_efek_samping: likert5,
  // B4 Assurance (4 questions)
  b4_a1_kompetensi: likert5,
  b4_a2_diagnosis: likert5,
  b4_a3_aman: likert5,
  b4_a4_sertifikasi: likert5,
  // B5 Empathy (4 questions)
  b5_e1_personal: likert5,
  b5_e2_kekhawatiran: likert5,
  b5_e3_hormat: likert5,
  b5_e4_perkembangan: likert5,
})

export type ServqualData = z.infer<typeof servqualSchema>

// --- Step 2: Bagian C - Layanan Herbal ---
export const herbalSchema = z.object({
  herbal_prescribed: z.boolean(),
  // C2 only if herbal_prescribed = true
  c2_herb_explanation: likert5Nullable,
  c2_herb_usage_guide: likert5Nullable,
  c2_herb_safety_trust: likert5Nullable,
  c2_herb_availability: likert5Nullable,
  c2_herb_affordability: likert5Nullable,
  c2_herb_pharmacist: likert5Nullable,
})

export type HerbalData = z.infer<typeof herbalSchema>

// --- Step 3: Bagian D - Terapi Adjuvan ---
export const adjuvantSchema = z.object({
  adjuvant_role: z.enum(ADJUVANT_ROLES),
  d2_info_acupuncture_support: likert5,
  d2_info_understanding: likert5,
  d2_info_sufficient: likert5,
  d2_info_comfortable_asking: likert5,
})

export type AdjuvantData = z.infer<typeof adjuvantSchema>

// --- Step 4: Bagian E - VAS / Perubahan Kondisi ---
export const clinicalOutcomesSchema = z.object({
  pain_level_before: painScale,
  pain_level_after: painScale,
  condition_change: z.enum(CONDITION_CHANGES),
})

export type ClinicalOutcomesData = z.infer<typeof clinicalOutcomesSchema>

// --- Step 5: Bagian F - Spiritual & Holistik ---
export const spiritualSchema = z.object({
  f1_salam_doa: likert5,
  f2_islam_respect: likert5,
  f3_facility: likert5,
  f4_healing: likert5,
  f5_support: likert5,
})

export type SpiritualData = z.infer<typeof spiritualSchema>

// --- Step 6: Bagian G - NPS & Loyaltas ---
export const npsLoyaltySchema = z.object({
  nps_score: npsScore,
  visit_plan: z.enum(VISIT_PLANS),
  has_recommended: z.enum(RECOMMENDATION_STATUS),
})

export type NpsLoyaltyData = z.infer<typeof npsLoyaltySchema>

// --- Step 7: Bagian H - Masukan & Saran ---
export const feedbackSchema = z.object({
  best_experience: z.string().max(2000).nullable().optional(),
  improvement_suggestion: z.string().max(2000).nullable().optional(),
  testimonial: z.string().max(2000).nullable().optional(),
})

export type FeedbackData = z.infer<typeof feedbackSchema>

// ============================================================
// FULL SURVEY Schema (API submission)
// ============================================================

export const fullSurveySchema = z.object({
  unit_id: z.string().min(1, 'Unit ID wajib diisi'),

  // Bagian A - Demographics
  age_range: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  patient_type: z.string().nullable().optional(),
  condition_type: z.string().nullable().optional(),
  visit_count: z.string().nullable().optional(),
  referral_source: z.string().nullable().optional(),

  // Bagian B - SERVQUAL averages (computed client-side)
  tangibles: z.number().min(1).max(5).nullable().optional(),
  reliability: z.number().min(1).max(5).nullable().optional(),
  responsiveness: z.number().min(1).max(5).nullable().optional(),
  assurance: z.number().min(1).max(5).nullable().optional(),
  empathy: z.number().min(1).max(5).nullable().optional(),

  // Bagian C - Herbal
  herbal_prescribed: z.boolean().nullable().optional(),
  herb_explanation: z.number().min(1).max(5).nullable().optional(),
  herb_usage_guide: z.number().min(1).max(5).nullable().optional(),
  herb_safety_trust: z.number().min(1).max(5).nullable().optional(),
  herb_availability: z.number().min(1).max(5).nullable().optional(),
  herb_affordability: z.number().min(1).max(5).nullable().optional(),
  herb_pharmacist: z.number().min(1).max(5).nullable().optional(),

  // Bagian D - Adjuvant
  adjuvant_role: z.string().nullable().optional(),
  info_acupuncture_support: z.number().min(1).max(5).nullable().optional(),
  info_understanding: z.number().min(1).max(5).nullable().optional(),
  info_sufficient: z.number().min(1).max(5).nullable().optional(),
  info_comfortable_asking: z.number().min(1).max(5).nullable().optional(),

  // Bagian E - Clinical
  pain_level_before: z.number().min(0).max(10).nullable().optional(),
  pain_level_after: z.number().min(0).max(10).nullable().optional(),
  condition_change: z.string().nullable().optional(),

  // Bagian F - Spiritual (5 items)
  spiritual_salam_doa: z.number().min(1).max(5).nullable().optional(),
  spiritual_islam_respect: z.number().min(1).max(5).nullable().optional(),
  spiritual_facility: z.number().min(1).max(5).nullable().optional(),
  spiritual_healing: z.number().min(1).max(5).nullable().optional(),
  spiritual_support: z.number().min(1).max(5).nullable().optional(),

  // Bagian G - NPS & Loyalty
  nps_score: z.number().min(0).max(10).nullable().optional(),
  visit_plan: z.string().nullable().optional(),
  has_recommended: z.string().nullable().optional(),

  // Bagian H - Qualitative
  best_experience: z.string().nullable().optional(),
  improvement_suggestion: z.string().nullable().optional(),
  testimonial: z.string().nullable().optional(),

  // Full individual responses (JSONB)
  responses_json: z.record(z.string(), z.unknown()).nullable().optional(),

  // Metadata
  session_duration_seconds: z.number().int().nullable().optional(),
  device_type: z.string().nullable().optional(),
})

export type FullSurveyData = z.infer<typeof fullSurveySchema>

// ============================================================
// Helper: Compute SERVQUAL dimension average from individual questions
// Used in survey form before submission
// ============================================================

export function computeDimensionAverage(scores: (number | null | undefined)[]): number | null {
  const valid = scores.filter((s): s is number => s !== null && s !== undefined && s > 0)
  if (valid.length === 0) return null
  return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1))
}