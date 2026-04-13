import { NextRequest, NextResponse } from 'next/server'
import { getSurveys, getHospital, getAlerts } from '@/lib/db'
import type { Survey, Unit, Hospital } from '@/lib/types'

// --- Helpers ---
function avg(arr: (number | null)[]): number {
  const valid = arr.filter((v): v is number => v !== null && v !== undefined)
  if (valid.length === 0) return 0
  return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2))
}

export async function GET(request: NextRequest) {
  try {
    const period = parseInt(request.nextUrl.searchParams.get('period') || '30')
    const since = new Date(Date.now() - period * 24 * 60 * 60 * 1000)

    const [surveys, hospital, alerts] = await Promise.all([
      getSurveys(since),
      getHospital(),
      getAlerts(false, 5),
    ])

    const totalSurveys = surveys.length

    // --- Pain Reduction ---
    const painBeforeArr = surveys.map((s) => s.pain_level_before).filter((v): v is number => v !== null)
    const painAfterArr = surveys.map((s) => s.pain_level_after).filter((v): v is number => v !== null)
    const avgPainBefore = painBeforeArr.length > 0 ? painBeforeArr.reduce((a, b) => a + b, 0) / painBeforeArr.length : 0
    const avgPainAfter = painAfterArr.length > 0 ? painAfterArr.reduce((a, b) => a + b, 0) / painAfterArr.length : 0
    const avgPainReduction = avgPainBefore > 0 ? parseFloat((((avgPainBefore - avgPainAfter) / avgPainBefore) * 100).toFixed(1)) : 0

    // --- NPS ---
    const npsScores = surveys.map((s) => s.nps_score).filter((v): v is number => v !== null)
    const promoters = npsScores.filter((s) => s >= 9).length
    const passives = npsScores.filter((s) => s >= 7 && s <= 8).length
    const detractors = npsScores.filter((s) => s <= 6).length
    const npsTotal = promoters + passives + detractors
    const npsScore = npsTotal > 0 ? Math.round(((promoters - detractors) / npsTotal) * 100) : 0

    // --- SERVQUAL (stored as dimension averages in DB) ---
    const tangibles = avg(surveys.map((s) => s.tangibles))
    const reliability = avg(surveys.map((s) => s.reliability))
    const responsiveness = avg(surveys.map((s) => s.responsiveness))
    const assurance = avg(surveys.map((s) => s.assurance))
    const empathy = avg(surveys.map((s) => s.empathy))
    const overall = parseFloat(((tangibles + reliability + responsiveness + assurance + empathy) / 5).toFixed(2))

    const servqual = { tangibles, reliability, responsiveness, assurance, empathy, overall }

    // Worst SERVQUAL dimension
    const servqualDims = [
      { name: 'Tangibles (Bukti Fisik)', score: tangibles },
      { name: 'Reliability (Keandalan)', score: reliability },
      { name: 'Responsiveness (Daya Tanggap)', score: responsiveness },
      { name: 'Assurance (Jaminan)', score: assurance },
      { name: 'Empathy (Empati)', score: empathy },
    ]
    servqualDims.sort((a, b) => a.score - b.score)
    const worstServqualDimension = { name: servqualDims[0].name, score: servqualDims[0].score }

    // --- Spiritual Averages (using actual schema fields) ---
    const spiritualAvg = {
      spiritualComfort: avg(surveys.map((s) => s.spiritual_salam_doa)),
      culturalRespect: avg(surveys.map((s) => s.spiritual_islam_respect)),
      familyFeeling: avg(surveys.map((s) => s.spiritual_healing)),
    }

    // --- Unit Performance (single unit) ---
    const unitPerformance = [{
      unitName: 'Poli Akupuntur & Herbal',
      unitType: 'Integrative Medicine',
      surveyCount: totalSurveys,
      avgSatisfaction: overall,
      avgPainReduction,
    }]

    // --- Recent Feedback (with full survey context for filtering) ---
    const recentFeedback = surveys
      .filter((s) => s.best_experience || s.improvement_suggestion || s.testimonial)
      .slice(0, 50)
      .map((s) => {
        const unit = s.units as Unit
        return {
          testimonial: s.testimonial,
          bestExperience: s.best_experience,
          complaints: null,
          suggestions: s.improvement_suggestion,
          improvementSuggestion: s.improvement_suggestion,
          unitName: unit?.name || 'Poli Akupuntur & Herbal',
          npsScore: s.nps_score,
          submittedAt: s.submitted_at,
          // Extra context for feedback filtering
          conditionType: s.condition_type,
          ageRange: s.age_range,
          gender: s.gender,
        }
      })

    // --- Demographics ---
    const ageRangeMap = new Map<string, number>()
    const genderMap = new Map<string, number>()
    const patientTypeMap = new Map<string, number>()
    const conditionMap = new Map<string, number>()
    const educationMap = new Map<string, number>()

    surveys.forEach((s) => {
      if (s.age_range) ageRangeMap.set(s.age_range, (ageRangeMap.get(s.age_range) || 0) + 1)
      if (s.gender) genderMap.set(s.gender, (genderMap.get(s.gender) || 0) + 1)
      if (s.patient_type) patientTypeMap.set(s.patient_type, (patientTypeMap.get(s.patient_type) || 0) + 1)
      if (s.condition_type) conditionMap.set(s.condition_type, (conditionMap.get(s.condition_type) || 0) + 1)
      if (s.education) educationMap.set(s.education, (educationMap.get(s.education) || 0) + 1)
    })

    const topTreatments = Array.from(conditionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    // --- Diagnosis-Level Pain Reduction ---
    const diagnosisGroups = new Map<string, Survey[]>()
    surveys.forEach((s) => {
      if (s.condition_type) {
        const key = s.condition_type
        if (!diagnosisGroups.has(key)) diagnosisGroups.set(key, [])
        diagnosisGroups.get(key)!.push(s)
      }
    })

    const diagnosisPainData = Array.from(diagnosisGroups.entries())
      .map(([condition_type, group]) => {
        const pbArr = group.map((s) => s.pain_level_before).filter((v): v is number => v !== null && v > 0)
        const paArr = group.map((s) => s.pain_level_after).filter((v): v is number => v !== null)
        const avgPB = pbArr.length > 0 ? pbArr.reduce((a, b) => a + b, 0) / pbArr.length : 0
        const avgPA = paArr.length > 0 ? paArr.reduce((a, b) => a + b, 0) / paArr.length : 0
        const reduction = avgPB > 0 ? parseFloat((((avgPB - avgPA) / avgPB) * 100).toFixed(1)) : 0
        return {
          condition_type,
          avgPainBefore: parseFloat(avgPB.toFixed(1)),
          avgPainAfter: parseFloat(avgPA.toFixed(1)),
          painReductionPct: reduction,
          patientCount: group.length,
        }
      })
      .sort((a, b) => b.painReductionPct - a.painReductionPct)

    // --- Diagnosis-Level Satisfaction ---
    const diagnosisSatisfactionData = Array.from(diagnosisGroups.entries())
      .map(([condition_type, group]) => {
        const satScores = group
          .map((s) => s.tangibles && s.reliability && s.responsiveness && s.assurance && s.empathy
            ? (s.tangibles + s.reliability + s.responsiveness + s.assurance + s.empathy) / 5
            : null)
          .filter((v): v is number => v !== null)
        return {
          condition_type,
          avgSatisfaction: satScores.length > 0 ? parseFloat((satScores.reduce((a, b) => a + b, 0) / satScores.length).toFixed(1)) : 0,
          patientCount: group.length,
        }
      })
      .sort((a, b) => b.patientCount - a.patientCount)

    // --- Top Diagnosis (most patients) ---
    const sortedByCount = [...diagnosisSatisfactionData].sort((a, b) => b.patientCount - a.patientCount)
    const topDiagnosis = sortedByCount.length > 0
      ? {
          name: sortedByCount[0].condition_type,
          patientCount: sortedByCount[0].patientCount,
          percentage: totalSurveys > 0 ? parseFloat(((sortedByCount[0].patientCount / totalSurveys) * 100).toFixed(1)) : 0,
          avgSatisfaction: sortedByCount[0].avgSatisfaction,
        }
      : null

    // --- Trend Data ---
    const trendData: { date: string; count: number }[] = []
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = d.toISOString().split('T')[0]
      const dayCount = surveys.filter((s) => s.submitted_at.split('T')[0] === dateStr).length
      trendData.push({ date: dateStr, count: dayCount })
    }

    // --- Response Rate ---
    const responseRate = Math.min(95, parseFloat(((totalSurveys / (totalSurveys + 45)) * 100).toFixed(1)))

    return NextResponse.json({
      totalSurveys,
      avgPainReduction,
      nps: { promoters, passives, detractors, score: npsScore, total: npsTotal },
      servqual,
      unitPerformance,
      spiritualAvg,
      recentFeedback,
      recentAlerts: alerts || [],
      demographics: {
        ageRangeDistribution: Object.fromEntries(ageRangeMap),
        genderDistribution: Object.fromEntries(genderMap),
        patientTypeDistribution: Object.fromEntries(patientTypeMap),
        conditionTypeDistribution: Object.fromEntries(conditionMap),
        educationDistribution: Object.fromEntries(educationMap),
        topTreatments,
      },
      trendData,
      responseRate,
      overallSatisfaction: parseFloat(overall.toFixed(1)),
      hospital: hospital || { name: "RSU Ja'far Medika", code: 'RS-JMK-001' },
      diagnosisPainData,
      diagnosisSatisfactionData,
      topDiagnosis,
      worstServqualDimension,
    })
  } catch (error) {
    console.error('Error computing dashboard data:', error)
    return NextResponse.json({ error: 'Failed to compute dashboard data' }, { status: 500 })
  }
}