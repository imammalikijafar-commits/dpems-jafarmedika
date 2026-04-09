// ============================================================
// DPEMS Database Client
// Supabase — matching Schema v1.0.1
// Lazy initialization to avoid build-time crashes
// ============================================================

import { createAdminClient } from '@/lib/supabase/server'
import type { Unit, Survey, SurveyAggregation, Alert, Hospital } from '@/lib/types'

let _admin: ReturnType<typeof createAdminClient> | null = null

function getAdmin() {
  if (!_admin) {
    _admin = createAdminClient()
  }
  return _admin
}

// --- Hospital ---

export async function getHospital(): Promise<Hospital | null> {
  const { data, error } = await getAdmin()
    .from('hospitals')
    .select('*')
    .limit(1)
    .single()

  if (error) return null
  return data as Hospital
}

// --- Units ---

export async function getUnits(): Promise<Unit[]> {
  const { data, error } = await getAdmin()
    .from('units')
    .select('*, hospitals(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`Failed to fetch units: ${error.message}`)
  return data as Unit[]
}

export async function getUnitByQrCode(qrCode: string): Promise<Unit | null> {
  const { data, error } = await getAdmin()
    .from('units')
    .select('*, hospitals(*)')
    .eq('qr_code', qrCode)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Unit
}

// --- Surveys ---

export async function getSurveys(since?: Date): Promise<(Survey & { units: Unit })[]> {
  let query = getAdmin()
    .from('surveys')
    .select('*, units(*)')
    .order('submitted_at', { ascending: false })

  if (since) {
    query = query.gte('submitted_at', since.toISOString())
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch surveys: ${error.message}`)
  return (data || []) as (Survey & { units: Unit })[]
}

export async function createSurvey(data: Record<string, unknown>): Promise<Survey> {
  const { data: survey, error } = await getAdmin()
    .from('surveys')
    .insert(data)
    .select('*, units(*)')
    .single()

  if (error) throw new Error(`Failed to create survey: ${error.message}`)
  return survey as Survey & { units: Unit }
}

// --- Aggregations ---

export async function getAggregations(unitId?: string, since?: Date): Promise<SurveyAggregation[]> {
  let query = getAdmin()
    .from('survey_aggregations')
    .select('*')
    .order('date', { ascending: false })

  if (unitId) {
    query = query.eq('unit_id', unitId)
  }
  if (since) {
    query = query.gte('date', since.toISOString().split('T')[0])
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch aggregations: ${error.message}`)
  return (data || []) as SurveyAggregation[]
}

// --- Alerts ---

export async function getAlerts(resolved = false, limit = 10): Promise<Alert[]> {
  const { data, error } = await getAdmin()
    .from('alerts')
    .select('*, surveys(*)')
    .eq('is_resolved', resolved)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch alerts: ${error.message}`)
  return (data || []) as Alert[]
}

export async function createAlert(alert: {
  survey_id?: string
  alert_type: string
  severity: string
  message?: string
}): Promise<Alert> {
  const { data, error } = await getAdmin()
    .from('alerts')
    .insert(alert)
    .select()
    .single()

  if (error) throw new Error(`Failed to create alert: ${error.message}`)
  return data as Alert
}