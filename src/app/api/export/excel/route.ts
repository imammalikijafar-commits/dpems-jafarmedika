import { NextRequest, NextResponse } from 'next/server'
import { getSurveysExport } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams

    const params = {
      search: sp.get('search') || undefined,
      dateFrom: sp.get('dateFrom') || undefined,
      dateTo: sp.get('dateTo') || undefined,
      gender: sp.get('gender') || undefined,
      condition_type: sp.get('condition_type') || undefined,
      npsMin: sp.get('npsMin') ? parseInt(sp.get('npsMin')!) : undefined,
      npsMax: sp.get('npsMax') ? parseInt(sp.get('npsMax')!) : undefined,
    }

    const surveys = await getSurveysExport(params)

    const wb = XLSX.utils.book_new()

    // === Sheet 1: Data Survei ===
    const mainData = surveys.map((s, i) => {
      const painBefore = s.pain_level_before ?? null
      const painAfter = s.pain_level_after ?? null
      const painReduction = painBefore && painBefore > 0
        ? parseFloat((((painBefore - (painAfter ?? 0)) / painBefore) * 100).toFixed(1))
        : null
      const overall = s.tangibles && s.reliability && s.responsiveness && s.assurance && s.empathy
        ? parseFloat(((s.tangibles + s.reliability + s.responsiveness + s.assurance + s.empathy) / 5).toFixed(2))
        : null

      return {
        'No': i + 1,
        'Tanggal': s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('id-ID') : '',
        'Usia': s.age_range || '-',
        'Gender': s.gender === 'L' ? 'Laki-laki' : s.gender === 'P' ? 'Perempuan' : '-',
        'Pendidikan': s.education || '-',
        'Pekerjaan': s.occupation || '-',
        'Jenis Pasien': s.patient_type || '-',
        'Kondisi': s.condition_type || '-',
        'Kunjungan': s.visit_count || '-',
        'Tangibles': s.tangibles ?? '-',
        'Reliability': s.reliability ?? '-',
        'Responsiveness': s.responsiveness ?? '-',
        'Assurance': s.assurance ?? '-',
        'Empathy': s.empathy ?? '-',
        'NPS': s.nps_score ?? '-',
        'Nyeri Sebelum': painBefore ?? '-',
        'Nyeri Sesudah': painAfter ?? '-',
        'Pengurangan Nyeri (%)': painReduction !== null ? `${painReduction}%` : '-',
        'Perubahan Kondisi': s.condition_change || '-',
        'Pengalaman Terbaik': s.best_experience || '-',
        'Saran Perbaikan': s.improvement_suggestion || '-',
        'Testimoni': s.testimonial || '-',
      }
    })

    const ws1 = XLSX.utils.json_to_sheet(mainData)
    // Set column widths
    ws1['!cols'] = [
      { wch: 5 },  // No
      { wch: 14 }, // Tanggal
      { wch: 10 }, // Usia
      { wch: 12 }, // Gender
      { wch: 16 }, // Pendidikan
      { wch: 20 }, // Pekerjaan
      { wch: 18 }, // Jenis Pasien
      { wch: 28 }, // Kondisi
      { wch: 14 }, // Kunjungan
      { wch: 11 }, // Tangibles
      { wch: 11 }, // Reliability
      { wch: 14 }, // Responsiveness
      { wch: 11 }, // Assurance
      { wch: 10 }, // Empathy
      { wch: 6 },  // NPS
      { wch: 12 }, // Nyeri Sebelum
      { wch: 12 }, // Nyeri Sesudah
      { wch: 18 }, // Pengurangan Nyeri
      { wch: 18 }, // Perubahan Kondisi
      { wch: 40 }, // Pengalaman Terbaik
      { wch: 40 }, // Saran Perbaikan
      { wch: 40 }, // Testimoni
    ]
    XLSX.utils.book_append_sheet(wb, ws1, 'Data Survei')

    // === Sheet 2: SERVQUAL Detail ===
    const servqualData = surveys.map((s, i) => {
      const responses = s.responses_json || {}
      return {
        'No': i + 1,
        'Tanggal': s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('id-ID') : '',
        // B1 Tangibles
        'B1_T1_Kebersihan': (responses.b1_t1_kebersihan as number) ?? s.tangibles ?? '-',
        'B1_T2_Steril': (responses.b1_t2_steril as number) ?? '-',
        'B1_T3_Berbaring': (responses.b1_t3_berbaring as number) ?? '-',
        'B1_T4_Suasana': (responses.b1_t4_suasana as number) ?? '-',
        // B2 Reliability
        'B2_R1_Tepat_Waktu': (responses.b2_r1_tepat_waktu as number) ?? '-',
        'B2_R2_Hadir': (responses.b2_r2_hadir as number) ?? '-',
        'B2_R3_Terstandar': (responses.b2_r3_terstandar as number) ?? '-',
        'B2_R4_Rekam_Medis': (responses.b2_r4_rekam_medis as number) ?? '-',
        // B3 Responsiveness
        'B3_C1_Tunggu': (responses.b3_c1_tunggu as number) ?? '-',
        'B3_C2_Respons': (responses.b3_c2_respons as number) ?? '-',
        'B3_C3_Jelas': (responses.b3_c3_jelas as number) ?? '-',
        'B3_C4_Efek_Samping': (responses.b3_c4_efek_samping as number) ?? '-',
        // B4 Assurance
        'B4_A1_Kompetensi': (responses.b4_a1_kompetensi as number) ?? '-',
        'B4_A2_Diagnosis': (responses.b4_a2_diagnosis as number) ?? '-',
        'B4_A3_Aman': (responses.b4_a3_aman as number) ?? '-',
        'B4_A4_Sertifikasi': (responses.b4_a4_sertifikasi as number) ?? '-',
        // B5 Empathy
        'B5_E1_Personal': (responses.b5_e1_personal as number) ?? '-',
        'B5_E2_Kekhawatiran': (responses.b5_e2_kekhawatiran as number) ?? '-',
        'B5_E3_Hormat': (responses.b5_e3_hormat as number) ?? '-',
        'B5_E4_Perkembangan': (responses.b5_e4_perkembangan as number) ?? '-',
        // Dimension averages
        'AVG_Tangibles': s.tangibles ?? '-',
        'AVG_Reliability': s.reliability ?? '-',
        'AVG_Responsiveness': s.responsiveness ?? '-',
        'AVG_Assurance': s.assurance ?? '-',
        'AVG_Empathy': s.empathy ?? '-',
      }
    })

    const ws2 = XLSX.utils.json_to_sheet(servqualData)
    XLSX.utils.book_append_sheet(wb, ws2, 'SERVQUAL Detail')

    // === Sheet 3: Demografi Ringkasan ===
    const genderCount = { L: 0, P: 0 }
    const ageCount: Record<string, number> = {}
    const educationCount: Record<string, number> = {}
    const conditionCount: Record<string, number> = {}
    const patientTypeCount: Record<string, number> = {}

    surveys.forEach((s) => {
      if (s.gender === 'L') genderCount.L++
      if (s.gender === 'P') genderCount.P++
      if (s.age_range) ageCount[s.age_range] = (ageCount[s.age_range] || 0) + 1
      if (s.education) educationCount[s.education] = (educationCount[s.education] || 0) + 1
      if (s.condition_type) conditionCount[s.condition_type] = (conditionCount[s.condition_type] || 0) + 1
      if (s.patient_type) patientTypeCount[s.patient_type] = (patientTypeCount[s.patient_type] || 0) + 1
    })

    const summaryRows: (string | number)[][] = [
      ['RINGKASAN DEMOGRAFI', ''],
      ['', ''],
      ['Total Responden', surveys.length],
      ['', ''],
      ['GENDER', 'Jumlah'],
      ['Laki-laki', genderCount.L],
      ['Perempuan', genderCount.P],
      ['', ''],
      ['KELOMPOK USIA', 'Jumlah'],
      ...Object.entries(ageCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v] as [string, number]),
      ['', ''],
      ['PENDIDIKAN', 'Jumlah'],
      ...Object.entries(educationCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v] as [string, number]),
      ['', ''],
      ['JENIS PASIEN', 'Jumlah'],
      ...Object.entries(patientTypeCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v] as [string, number]),
      ['', ''],
      ['KONDISI / KELUHAN', 'Jumlah'],
      ...Object.entries(conditionCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v] as [string, number]),
    ]

    const ws3 = XLSX.utils.aoa_to_sheet(summaryRows)
    XLSX.utils.book_append_sheet(wb, ws3, 'Demografi Ringkasan')

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    const today = new Date().toISOString().split('T')[0]
    const filename = `data_survei_dpems_${today}.xlsx`

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting Excel:', error)
    return NextResponse.json({ error: 'Gagal mengekspor data Excel' }, { status: 500 })
  }
}