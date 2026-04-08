// lib/utils/validators.ts
// Form validation schemas using Zod v4+ compatible syntax
import { z } from 'zod';

export const surveySchema = z.object({
  // Demographics
  age_range: z.enum(['<40', '41-50', '51-60', '61-70', '>70'], {
    message: 'Pilih range usia',
  }),
  gender: z.enum(['L', 'P'], {
    message: 'Pilih jenis kelamin',
  }),
  patient_type: z.enum(['BPJS', 'Asuransi', 'Umum'], {
    message: 'Pilih jenis pembayaran',
  }),
  visit_count: z
    .number({ message: 'Isi jumlah kunjungan' })
    .min(1, 'Minimal 1 kali')
    .max(100, 'Maksimal 100 kunjungan'),
  treatment_type: z.enum([
    'Stroke Rehabilitasi',
    'Nyeri Kronik (Punggung/Lutut)',
    'HNP (Syaraf Kejepit)',
    'Ischialgia (Nyeri Panggul)',
    'Migrain/Sakit Kepala',
    'Lainnya'
  ], {
    message: 'Pilih jenis pengobatan',
  }),

  // SERVQUAL Dimensions (1-5 scale)
  tangibles: z
    .number({ message: 'Berikan penilaian' })
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5'),
  reliability: z
    .number({ message: 'Berikan penilaian' })
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5'),
  responsiveness: z
    .number({ message: 'Berikan penilaian' })
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5'),
  assurance: z
    .number({ message: 'Berikan penilaian' })
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5'),
  empathy: z
    .number({ message: 'Berikan penilaian' })
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5'),

  // Clinical Outcomes
  pain_level_before: z
    .number({ message: 'Isi tingkat nyeri sebelum' })
    .min(0, 'Minimal 0')
    .max(10, 'Maksimal 10'),
  pain_level_after: z
    .number({ message: 'Isi tingkat nyeri sesudah' })
    .min(0, 'Minimal 0')
    .max(10, 'Maksimal 10'),
  functional_improvement: z.enum([
    'much_better',
    'slightly_better',
    'same',
    'worse'
  ], {
    message: 'Pilih perbaikan fungsi',
  }),

  // Spiritual & Cultural (Optional fields)
  spiritual_comfort: z
    .number()
    .min(1, 'Minimal 1')
    .max(5, 'Maksimal 5')
    .optional(),
  cultural_respect: z
    .number()
    .min(1)
    .max(5)
    .optional(),
  family_feeling: z
    .number()
    .min(1)
    .max(5)
    .optional(),

  // NPS (0-10)
  nps_score: z
    .number({ message: 'Berikan NPS score' })
    .min(0, 'Minimal 0')
    .max(10, 'Maksimal 10'),

  // Qualitative (Optional)
  complaints: z.string().max(500, 'Maksimal 500 karakter').optional(),
  suggestions: z.string().max(500, 'Maksimal 500 karakter').optional(),
  testimonial: z.string().max(500, 'Maksimal 500 karakter').optional(),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;