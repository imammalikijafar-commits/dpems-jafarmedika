// ============================================================
// DPEMS Type Definitions
// Matching Supabase Schema v1.1.0 (Kuesioner Integrative Medicine)
// RSU Ja'far Medika Karanganyar
// ============================================================

// --- Database Tables ---

export interface Hospital {
  id: string
  name: string
  type: string | null
  code: string
  address: string | null
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  hospital_id: string
  name: string
  description: string | null
  qr_code: string
  unit_type: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  // Joined
  hospitals?: Hospital
}

export interface Survey {
  id: string
  unit_id: string

  // Demographics (Bagian A)
  age_range: string | null
  gender: string | null
  education: string | null
  occupation: string | null
  patient_type: string | null
  condition_type: string | null
  visit_count: string | null
  referral_source: string | null

  // SERVQUAL Dimensions (aggregated averages, Bagian B)
  tangibles: number | null
  reliability: number | null
  responsiveness: number | null
  assurance: number | null
  empathy: number | null

  // Herbal Service (Bagian C)
  herbal_prescribed: boolean | null
  herb_explanation: number | null
  herb_usage_guide: number | null
  herb_safety_trust: number | null
  herb_availability: number | null
  herb_affordability: number | null
  herb_pharmacist: number | null

  // Adjuvant Therapy (Bagian D)
  adjuvant_role: string | null
  info_acupuncture_support: number | null
  info_understanding: number | null
  info_sufficient: number | null
  info_comfortable_asking: number | null

  // Clinical Outcomes (Bagian E)
  pain_level_before: number | null
  pain_level_after: number | null
  condition_change: string | null

  // Spiritual & Holistic (Bagian F)
  spiritual_salam_doa: number | null
  spiritual_islam_respect: number | null
  spiritual_facility: number | null
  spiritual_healing: number | null
  spiritual_support: number | null

  // NPS & Loyalty (Bagian G)
  nps_score: number | null
  visit_plan: string | null
  has_recommended: string | null

  // Qualitative (Bagian H)
  best_experience: string | null
  improvement_suggestion: string | null
  testimonial: string | null

  // Full responses (for research)
  responses_json: Record<string, unknown> | null

  // Metadata
  session_duration_seconds: number | null
  device_type: string | null
  submitted_at: string

  // Joined
  units?: Unit
}

export interface SurveyAggregation {
  id: string
  unit_id: string
  date: string
  avg_tangibles: number | null
  avg_reliability: number | null
  avg_responsiveness: number | null
  avg_assurance: number | null
  avg_empathy: number | null
  avg_overall: number | null
  total_responses: number
  promoters_count: number
  passives_count: number
  detractors_count: number
  nps_score: number | null
  avg_pain_reduction_pct: number | null
}

export interface Alert {
  id: string
  survey_id: string | null
  alert_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string | null
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  // Joined
  surveys?: Survey
}

// --- API Response Types ---

export interface DashboardData {
  totalSurveys: number
  avgPainReduction: number
  nps: {
    promoters: number
    passives: number
    detractors: number
    score: number
    total: number
  }
  servqual: {
    tangibles: number
    reliability: number
    responsiveness: number
    assurance: number
    empathy: number
    overall: number
  }
  unitPerformance: {
    unitName: string
    unitType: string | null
    surveyCount: number
    avgSatisfaction: number
    avgPainReduction: number
  }[]
  spiritualAvg: {
    spiritualComfort: number
    culturalRespect: number
    familyFeeling: number
  }
  recentFeedback: {
    testimonial: string | null
    bestExperience: string | null
    complaints: string | null
    suggestions: string | null
    improvementSuggestion: string | null
    unitName: string
    npsScore: number | null
    submittedAt: string
  }[]
  recentAlerts: Alert[]
  demographics: {
    ageRangeDistribution: Record<string, number>
    genderDistribution: Record<string, number>
    patientTypeDistribution: Record<string, number>
    conditionTypeDistribution: Record<string, number>
    educationDistribution: Record<string, number>
    topTreatments: { name: string; count: number }[]
  }
  trendData: { date: string; count: number }[]
  responseRate: number
  overallSatisfaction: number
  hospital: Hospital
}