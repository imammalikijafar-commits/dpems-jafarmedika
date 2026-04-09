// ============================================================
// DPEMS Type Definitions
// Matching Supabase Schema v1.0.1
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
  // Demographics
  age_range: string | null
  gender: string | null
  patient_type: string | null
  visit_count: number | null
  treatment_type: string | null
  // SERVQUAL Dimensions (avg per dimension, 1-5)
  tangibles: number | null
  reliability: number | null
  responsiveness: number | null
  assurance: number | null
  empathy: number | null
  // Clinical Outcomes
  pain_level_before: number | null
  pain_level_after: number | null
  functional_improvement: string | null
  // Spiritual & Cultural
  spiritual_comfort: number | null
  cultural_respect: number | null
  family_feeling: number | null
  // NPS
  nps_score: number | null
  // Qualitative
  complaints: string | null
  suggestions: string | null
  testimonial: string | null
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
    complaints: string | null
    suggestions: string | null
    unitName: string
    npsScore: number | null
    submittedAt: string
  }[]
  recentAlerts: Alert[]
  demographics: {
    ageRangeDistribution: Record<string, number>
    genderDistribution: Record<string, number>
    patientTypeDistribution: Record<string, number>
    topTreatments: { name: string; count: number }[]
  }
  trendData: { date: string; count: number }[]
  responseRate: number
  overallSatisfaction: number
  hospital: Hospital
}