import { z } from 'zod'

// ============================================================
// DPEMS Zod Validators
// Matching Supabase Schema v1.0.1
// SERVQUAL: 5 dimension averages (not individual questions)
// ============================================================

// --- Helper: Likert dimension average (1-5) ---
const servqualDimension = z.number().min(1, 'Wajib diisi').max(5, 'Maks 5')

// --- Helper: VAS Pain Scale (0-10) ---
const painScale = z.number().min(0).max(10)

// --- Helper: NPS Score (0-10) ---
const npsScore = z.number().min(0).max(10)

// --- Age Range Options ---
export const AGE_RANGES = ['40-49', '50-59', '60-69', '70-79', '80+'] as const
export const GENDERS = ['L', 'P'] as const
export const PATIENT_TYPES = ['BPJS', 'Umum', 'Asuransi', 'Jaminan Perusahaan'] as const
export const TREATMENT_TYPES = [
  'Stroke Rehabilitasi',
  'Manajemen Nyeri',
  'HNP (Nyeri Saraf Pinggang)',
  'Ischialgia',
  'Kombinasi',
  'Lainnya',
] as const
export const FUNCTIONAL_IMPROVEMENTS = ['much_better', 'slightly_better', 'same', 'worse'] as const

// --- Step 1: Demographics ---
export const demographicsSchema = z.object({
  age_range: z.enum(AGE_RANGES, { message: 'Kelompok usia wajib dipilih' }),
  gender: z.enum(GENDERS, { message: 'Jenis kelamin wajib dipilih' }),
  patient_type: z.enum(PATIENT_TYPES, { message: 'Jenis pasien wajib dipilih' }),
  visit_count: z.number().int().min(1).default(1),
  treatment_type: z.enum(TREATMENT_TYPES).optional().default('Lainnya'),
})

export type DemographicsData = z.infer<typeof demographicsSchema>

// --- Step 2: SERVQUAL (5 dimension averages) ---
export const servqualSchema = z.object({
  tangibles: servqualDimension,
  reliability: servqualDimension,
  responsiveness: servqualDimension,
  assurance: servqualDimension,
  empathy: servqualDimension,
})

export type ServqualData = z.infer<typeof servqualSchema>

// --- Step 3: Clinical Outcomes ---
export const clinicalOutcomesSchema = z.object({
  pain_level_before: painScale,
  pain_level_after: painScale,
  functional_improvement: z.enum(FUNCTIONAL_IMPROVEMENTS).optional(),
})

export type ClinicalOutcomesData = z.infer<typeof clinicalOutcomesSchema>

// --- Step 4: Spiritual & Cultural (Optional) ---
export const spiritualSchema = z.object({
  spiritual_comfort: z.number().min(1).max(5).nullable().optional(),
  cultural_respect: z.number().min(1).max(5).nullable().optional(),
  family_feeling: z.number().min(1).max(5).nullable().optional(),
})

export type SpiritualData = z.infer<typeof spiritualSchema>

// --- Step 5: NPS & Qualitative ---
export const npsFeedbackSchema = z.object({
  nps_score: npsScore,
  complaints: z.string().max(1000).nullable().optional(),
  suggestions: z.string().max(1000).nullable().optional(),
  testimonial: z.string().max(1000).nullable().optional(),
})

export type NpsFeedbackData = z.infer<typeof npsFeedbackSchema>

// --- FULL SURVEY (for API submission) ---
export const fullSurveySchema = z.object({
  unit_id: z.string().min(1, 'Unit ID wajib diisi'),
  // Demographics
  age_range: z.enum(AGE_RANGES).nullable().optional(),
  gender: z.enum(GENDERS).nullable().optional(),
  patient_type: z.enum(PATIENT_TYPES).nullable().optional(),
  visit_count: z.number().int().min(1).nullable().optional(),
  treatment_type: z.string().nullable().optional(),
  // SERVQUAL (aggregated averages)
  tangibles: z.number().min(1).max(5).nullable().optional(),
  reliability: z.number().min(1).max(5).nullable().optional(),
  responsiveness: z.number().min(1).max(5).nullable().optional(),
  assurance: z.number().min(1).max(5).nullable().optional(),
  empathy: z.number().min(1).max(5).nullable().optional(),
  // Clinical
  pain_level_before: z.number().min(0).max(10).nullable().optional(),
  pain_level_after: z.number().min(0).max(10).nullable().optional(),
  functional_improvement: z.string().nullable().optional(),
  // Spiritual
  spiritual_comfort: z.number().min(1).max(5).nullable().optional(),
  cultural_respect: z.number().min(1).max(5).nullable().optional(),
  family_feeling: z.number().min(1).max(5).nullable().optional(),
  // NPS
  nps_score: z.number().min(0).max(10).nullable().optional(),
  // Qualitative
  complaints: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional(),
  testimonial: z.string().nullable().optional(),
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