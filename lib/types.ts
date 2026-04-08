// lib/types.ts
// Centralized TypeScript definitions for DPEMS

// ==================== ENUMS & CONSTANTS ====================

export enum AgeRange {
  UNDER_40 = '<40',
  RANGE_41_50 = '41-50',
  RANGE_51_60 = '51-60',
  RANGE_61_70 = '61-70',
  OVER_70 = '>70'
}

export enum Gender {
  MALE = 'L',
  FEMALE = 'P'
}

export enum PatientType {
  BPJS = 'BPJS',
  INSURANCE = 'Asuransi',
  CASH = 'Umum'
}

export enum TreatmentType {
  STROKE_REHAB = 'Stroke Rehabilitasi',
  CHRONIC_PAIN = 'Nyeri Kronik (Punggung/Lutut)',
  HNP = 'HNP (Syaraf Kejepit)',
  ISCHIALGIA = 'Ischialgia (Nyeri Panggul)',
  MIGRAINE = 'Migrain/Sakit Kepala',
  OTHER = 'Lainnya'
}

export enum FunctionalImprovement {
  MUCH_BETTER = 'much_better',
  SLIGHTLY_BETTER = 'slightly_better',
  SAME = 'same',
  WORSE = 'worse'
}

export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop'
}

// ==================== INTERFACES ====================

export interface Hospital {
  id: string;
  name: string;
  type: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: Date;
}

export interface Unit {
  id: string;
  hospital_id: string;
  name: string;
  description?: string;
  qr_code: string;
  unit_type: UnitType;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  
  // Computed (not from DB)
  survey_count?: number;
  avg_score?: number;
}

export enum UnitType {
  INTEGRATIVE = 'integrative', // Akupuntur & Herbal
  UMUM = 'umum',              // Poliklinik Umum
  FARMASI = 'farmasi',        // Apotek
  IGD = 'igd',               // IGD
  RAWAT_INAP = 'rawat_inap'  // Rawat Inap
}

export interface SurveyFormData {
  // Demographics
  age_range: AgeRange | '';
  gender: Gender | '';
  patient_type: PatientType | '';
  visit_count: number;
  treatment_type: TreatmentType | '';
  
  // SERVQUAL Dimensions (1-5)
  tangibles: number | null;
  reliability: number | null;
  responsiveness: number | null;
  assurance: number | null;
  empathy: number | null;
  
  // Clinical Outcomes
  pain_level_before: number | null; // 0-10 VAS
  pain_level_after: number | null;  // 0-10 VAS
  functional_improvement: FunctionalImprovement | '';
  
  // Spiritual & Cultural
  spiritual_comfort: number | null;
  cultural_respect: number | null;
  family_feeling: number | null;
  
  // NPS
  nps_score: number | null; // 0-10
  
  // Qualitative
  complaints?: string;
  suggestions?: string;
  testimonial?: string;
}

export interface Survey extends SurveyFormData {
  id: string;
  unit_id: string;
  session_duration_seconds?: number;
  device_type: DeviceType;
  submitted_at: Date;
  
  // Relations
  unit?: Unit;
}

export interface SurveyAggregation {
  id: string;
  unit_id: string;
  date: string; // YYYY-MM-DD
  
  // Averages
  avg_tangibles: number;
  avg_reliability: number;
  avg_responsiveness: number;
  avg_assurance: number;
  avg_empathy: number;
  avg_overall: number;
  
  // Counts
  total_responses: number;
  
  // NPS
  promoters_count: number;
  passives_count: number;
  detractors_count: number;
  nps_score: number;
  
  // Clinical
  avg_pain_reduction_pct?: number;
  
  // Relation
  unit?: Unit;
}

export interface Alert {
  id: string;
  survey_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  is_resolved: boolean;
  resolved_at?: Date;
  resolved_by?: string;
  created_at: Date;
}

export enum AlertType {
  LOW_SCORE = 'low_score',
  NO_IMPROVEMENT = 'no_improvement',
  COMPLAINT_SEVERE = 'complaint_severe',
  NPS_DETRACTOR = 'nps_detractor'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// ==================== DASHBOARD TYPES ====================

export interface KPIData {
  total_responses: number;
  avg_pain_reduction: number; // percentage
  nps_score: number;
  response_rate: number; // percentage
  overall_satisfaction: number; // 1-5
}

export interface TrendDataPoint {
  date: string;
  avg_score: number;
  count: number;
}

export interface HeatmapCell {
  unit_name: string;
  dimension: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
}

export interface WordCloudItem {
  text: string;
  value: number;
  category: 'positive' | 'negative' | 'neutral';
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}