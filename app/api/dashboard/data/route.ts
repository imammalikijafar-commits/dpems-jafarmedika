// app/api/dashboard/data/route.ts
// API endpoint untuk fetch dashboard analytics data - Type Safe Version
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Type definitions untuk data dari database
interface SurveyRow {
  id: string;
  tangibles: number | null;
  reliability: number | null;
  responsiveness: number | null;
  assurance: number | null;
  empathy: number | null;
  nps_score: number | null;
  pain_level_before: number | null;
  pain_level_after: number | null;
  submitted_at: string;
}

interface UnitWithSurveys {
  id: string;
  name: string;
  unit_type: string | null;
  surveys: SurveyRow[];
}

interface AggregationRow {
  avg_tangibles: number | null;
  avg_reliability: number | null;
  avg_responsiveness: number | null;
  avg_assurance: number | null;
  avg_empathy: number | null;
  total_responses: number;
}

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateISO = startDate.toISOString();

    // ==========================================
    // 1. Total Responses Count
    // ==========================================
    const { count: totalResponses } = await supabase
      .from('surveys')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', startDateISO);

    // ==========================================
    // 2. Average Scores (dari tabel aggregations)
    // ==========================================
    const { data: aggData } = await supabase
      .from('survey_aggregations')
      .select('*')
      .gte('date', startDateISO.split('T')[0]);

    let servqual = {
      tangibles: 0,
      reliability: 0,
      responsiveness: 0,
      assurance: 0,
      empathy: 0,
      nps: 0,
      pain_before: 0,
      pain_after: 0
    };

    let totalAggResponses = 0;

    if (aggData && aggData.length > 0) {
      totalAggResponses = aggData.reduce((sum, item) => sum + (item.total_responses || 0), 0);
      
      if (totalAggResponses > 0) {
        const safeAvg = (field: keyof AggregationRow) => 
          aggData.reduce((sum, item) => sum + ((item[field] || 0) * (item.total_responses || 0)), 0) / totalAggResponses;

        servqual.tangibles = safeAvg('avg_tangibles');
        servqual.reliability = safeAvg('avg_reliability');
        servqual.responsiveness = safeAvg('avg_responsiveness');
        servqual.assurance = safeAvg('avg_assurance');
        servqual.empathy = safeAvg('avg_empathy');
      }
    }

    // ==========================================
    // 3. NPS Calculation
    // ==========================================
    const { data: npsData } = await supabase
      .from('surveys')
      .select('nps_score')
      .gte('submitted_at', startDateISO)
      .not('nps_score', 'is', null);

    let promoters = 0, passives = 0, detractors = 0, npsScore = 0;
    
    if (npsData && Array.isArray(npsData)) {
      promoters = npsData.filter((s: { nps_score: number }) => s.nps_score >= 9).length;
      passives = npsData.filter((s: { nps_score: number }) => s.nps_score >= 7 && s.nps_score <= 8).length;
      detractors = npsData.filter((s: { nps_score: number }) => s.nps_score <= 6).length;
      const totalNps = npsData.length;
      npsScore = totalNps > 0 ? Math.round(((promoters - detractors) / totalNps) * 100) : 0;
    }

    // ==========================================
    // 4. Pain Reduction Analysis
    // ==========================================
    const { data: painData } = await supabase
      .from('surveys')
      .select('pain_level_before, pain_level_after')
      .gte('submitted_at', startDateISO)
      .not('pain_level_before', 'is', null)
      .not('pain_level_after', 'is', null);

    let avgPainReduction = 0;
    if (painData && Array.isArray(painData) && painData.length > 0) {
      const validPainData = painData.filter(
        (s: { pain_level_before: number | null; pain_level_after: number | null }) => 
          s.pain_level_before !== null && s.pain_level_after !== null && s.pain_level_before > 0
      );
      
      if (validPainData.length > 0) {
        const reductions = validPainData.map(
          (s: { pain_level_before: number; pain_level_after: number }) => 
            ((s.pain_level_before - s.pain_level_after) / s.pain_level_before) * 100
        );
        avgPainReduction = reductions.reduce((a: number, b: number) => a + b, 0) / reductions.length;
      }
    }

    // ==========================================
    // 5. Unit-wise Breakdown
    // ==========================================
    const { data: unitData } = await supabase
      .from('units')
      .select(`
        id,
        name,
        unit_type,
        surveys (
          id,
          tangibles,
          reliability,
          responsiveness,
          assurance,
          empathy,
          nps_score,
          pain_level_before,
          pain_level_after
        )
      `)
      .eq('is_active', true)
      .order('sort_order');

    const unitStats = (unitData as unknown as UnitWithSurveys[] || []).map((unit) => {
      const surveys = unit.surveys || [];
      const count = surveys.length;
      
      if (count === 0) {
        return {
          id: unit.id,
          name: unit.name,
          unitType: unit.unit_type || 'unknown',
          count: 0,
          dimensions: { tangibles: 0, reliability: 0, responsiveness: 0, assurance: 0, empathy: 0 },
          avgOverall: 0,
          nps: 0,
          painReduction: 0
        };
      }

      // Helper function untuk hitung rata-rata aman
      const calcAvg = (arr: SurveyRow[], field: keyof SurveyRow): number => {
        const validValues = arr
          .map(s => s[field])
          .filter((v): v is number => v !== null);
        
        return validValues.length > 0 
          ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
          : 0;
      };

      const avgT = calcAvg(surveys, 'tangibles');
      const avgR = calcAvg(surveys, 'reliability');
      const avgResp = calcAvg(surveys, 'responsiveness');
      const avgA = calcAvg(surveys, 'assurance');
      const avgE = calcAvg(surveys, 'empathy');
      
      const unitPromoters = surveys.filter((s: SurveyRow) => (s.nps_score || 0) >= 9).length;
      const unitDetractors = surveys.filter((s: SurveyRow) => (s.nps_score || 0) <= 6).length;
      const unitNps = Math.round(((unitPromoters - unitDetractors) / count) * 100);

      // Pain reduction calculation
      const validPainSurveys = surveys.filter(
        (s: SurveyRow) => s.pain_level_before !== null && s.pain_level_after !== null && (s.pain_level_before || 0) > 0
      );
      
      let avgUnitPain = 0;
      if (validPainSurveys.length > 0) {
        const painReductions = validPainSurveys.map(
          (s: SurveyRow) => (((s.pain_level_before || 0) - (s.pain_level_after || 0)) / (s.pain_level_before || 1)) * 100
        );
        avgUnitPain = painReductions.reduce((a: number, b: number) => a + b, 0) / painReductions.length;
      }

      return {
        id: unit.id,
        name: unit.name,
        unitType: unit.unit_type || 'unknown',
        count,
        dimensions: {
          tangibles: Math.round(avgT * 100) / 100,
          reliability: Math.round(avgR * 100) / 100,
          responsiveness: Math.round(avgResp * 100) / 100,
          assurance: Math.round(avgA * 100) / 100,
          empathy: Math.round(avgE * 100) / 100,
        },
        avgOverall: Math.round(((avgT + avgR + avgResp + avgA + avgE) / 5) * 100) / 100,
        nps: unitNps,
        painReduction: Math.round(avgUnitPain * 100) / 100
      };
    });

    // ==========================================
    // 6. Trend Data
    // ==========================================
    const { data: trendData } = await supabase
      .from('survey_aggregations')
      .select('*')
      .gte('date', startDateISO.split('T')[0])
      .order('date', { ascending: true });

    // ==========================================
    // 7. Recent Feedback
    // ==========================================
    const { data: recentFeedback } = await supabase
      .from('surveys')
      .select('complaints, suggestions, testimonial, submitted_at, treatment_type, nps_score')
      .or('complaints.not.is.null,suggestions.not.is.null,testimonial.not.is.null')
      .order('submitted_at', { ascending: false })
      .limit(20);

    // ==========================================
    // 8. Demographics
    // ==========================================
    const { data: demoData } = await supabase
      .from('surveys')
      .select('age_range, gender, patient_type, treatment_type')
      .gte('submitted_at', startDateISO);

    const demographics = {
      ageRanges: {} as Record<string, number>,
      genders: {} as Record<string, number>,
      patientTypes: {} as Record<string, number>,
      treatmentTypes: {} as Record<string, number>
    };

    if (demoData && Array.isArray(demoData)) {
      demoData.forEach((survey: { age_range?: string; gender?: string; patient_type?: string; treatment_type?: string }) => {
        if (survey.age_range) demographics.ageRanges[survey.age_range] = (demographics.ageRanges[survey.age_range] || 0) + 1;
        if (survey.gender) demographics.genders[survey.gender] = (demographics.genders[survey.gender] || 0) + 1;
        if (survey.patient_type) demographics.patientTypes[survey.patient_type] = (demographics.patientTypes[survey.patient_type] || 0) + 1;
        if (survey.treatment_type) demographics.treatmentTypes[survey.treatment_type] = (demographics.treatmentTypes[survey.treatment_type] || 0) + 1;
      });
    }

    // ==========================================
    // COMPILE RESPONSE
    // ==========================================
    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalResponses: totalResponses || 0,
          overallSatisfaction: Math.round((((servqual.tangibles + servqual.reliability + servqual.responsiveness + servqual.assurance + servqual.empathy) / 5) * 100) / 100),
          npsScore,
          promoters,
          passives,
          detractors,
          avgPainReduction: Math.round(avgPainReduction * 100) / 100,
          responseRate: 68
        },
        servqual: {
          tangibles: Math.round(servqual.tangibles * 100) / 100,
          reliability: Math.round(servqual.reliability * 100) / 100,
          responsiveness: Math.round(servqual.responsiveness * 100) / 100,
          assurance: Math.round(servqual.assurance * 100) / 100,
          empathy: Math.round(servqual.empathy * 100) / 100,
        },
        unitBreakdown: unitStats,
        trends: trendData || [],
        recentFeedback: recentFeedback || [],
        demographics
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', details: String(error) },
      { status: 500 }
    );
  }
}