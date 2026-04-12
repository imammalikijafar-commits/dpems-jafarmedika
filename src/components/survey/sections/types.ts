// ============================================================
// Shared Form Data Interface & Question Data
// Used by all section components and the main page
// ============================================================

export interface FormData {
  // Bagian A - Demographics
  age_range: string
  gender: string
  education: string
  occupation: string
  occupation_other: string
  patient_type: string
  condition_type: string
  visit_count: string
  referral_source: string

  // Bagian B - SERVQUAL (20 individual questions, 4 per dimension)
  b1_t1_kebersihan: number | null; b1_t2_steril: number | null; b1_t3_berbaring: number | null; b1_t4_suasana: number | null
  b2_r1_tepat_waktu: number | null; b2_r2_hadir: number | null; b2_r3_terstandar: number | null; b2_r4_rekam_medis: number | null
  b3_c1_tunggu: number | null; b3_c2_respons: number | null; b3_c3_jelas: number | null; b3_c4_efek_samping: number | null
  b4_a1_kompetensi: number | null; b4_a2_diagnosis: number | null; b4_a3_aman: number | null; b4_a4_sertifikasi: number | null
  b5_e1_personal: number | null; b5_e2_kekhawatiran: number | null; b5_e3_hormat: number | null; b5_e4_perkembangan: number | null

  // Bagian C - Herbal
  herbal_prescribed: string
  c2_herb_explanation: number | null; c2_herb_usage_guide: number | null
  c2_herb_safety_trust: number | null; c2_herb_availability: number | null
  c2_herb_affordability: number | null; c2_herb_pharmacist: number | null

  // Bagian D - Adjuvant
  adjuvant_role: string
  d2_info_acupuncture_support: number | null; d2_info_understanding: number | null
  d2_info_sufficient: number | null; d2_info_comfortable_asking: number | null

  // Bagian E - VAS
  pain_level_before: number
  pain_level_after: number | null
  condition_change: string

  // Bagian F - Spiritual (5 items)
  f1_salam_doa: number | null; f2_islam_respect: number | null; f3_facility: number | null
  f4_healing: number | null; f5_support: number | null

  // Bagian G - NPS & Loyalty
  nps_score: number
  visit_plan: string
  has_recommended: string

  // Bagian H - Feedback
  best_experience: string
  improvement_suggestion: string
  testimonial: string
}

export const initialForm: FormData = {
  age_range: '', gender: '', education: '', occupation: '', occupation_other: '',
  patient_type: '', condition_type: '', visit_count: '', referral_source: '',
  b1_t1_kebersihan: null, b1_t2_steril: null, b1_t3_berbaring: null, b1_t4_suasana: null,
  b2_r1_tepat_waktu: null, b2_r2_hadir: null, b2_r3_terstandar: null, b2_r4_rekam_medis: null,
  b3_c1_tunggu: null, b3_c2_respons: null, b3_c3_jelas: null, b3_c4_efek_samping: null,
  b4_a1_kompetensi: null, b4_a2_diagnosis: null, b4_a3_aman: null, b4_a4_sertifikasi: null,
  b5_e1_personal: null, b5_e2_kekhawatiran: null, b5_e3_hormat: null, b5_e4_perkembangan: null,
  herbal_prescribed: '', c2_herb_explanation: null, c2_herb_usage_guide: null,
  c2_herb_safety_trust: null, c2_herb_availability: null, c2_herb_affordability: null, c2_herb_pharmacist: null,
  adjuvant_role: '', d2_info_acupuncture_support: null, d2_info_understanding: null,
  d2_info_sufficient: null, d2_info_comfortable_asking: null,
  pain_level_before: 5, pain_level_after: null, condition_change: '',
  f1_salam_doa: null, f2_islam_respect: null, f3_facility: null, f4_healing: null, f5_support: null,
  nps_score: 8, visit_plan: '', has_recommended: '',
  best_experience: '', improvement_suggestion: '', testimonial: '',
}

// ============================================================
// SERVQUAL Sections (Bagian B)
// ============================================================

export const servqualSections = [
  {
    title: 'B1. Bukti Fisik (Tangibles)',
    questions: [
      { key: 'b1_t1_kebersihan' as const, text: 'Ruangan akupuntur bersih, nyaman, dan privasi terjaga' },
      { key: 'b1_t2_steril' as const, text: 'Peralatan akupuntur (jarum) terlihat steril dan higienis' },
      { key: 'b1_t3_berbaring' as const, text: 'Fasilitas tempat berbaring selama terapi memadai' },
      { key: 'b1_t4_suasana' as const, text: 'Suasana ruangan tenang dan mendukung relaksasi' },
    ],
  },
  {
    title: 'B2. Keandalan (Reliability)',
    questions: [
      { key: 'b2_r1_tepat_waktu' as const, text: 'Sesi akupuntur dimulai tepat waktu sesuai jadwal' },
      { key: 'b2_r2_hadir' as const, text: 'Dokter akupuntur selalu hadir dan tersedia sesuai jadwal' },
      { key: 'b2_r3_terstandar' as const, text: 'Prosedur terapi dilakukan secara konsisten dan terstandar' },
      { key: 'b2_r4_rekam_medis' as const, text: 'Pencatatan / rekam medis terapi akupuntur dilakukan dengan tertib' },
    ],
  },
  {
    title: 'B3. Ketanggapan (Responsiveness)',
    questions: [
      { key: 'b3_c1_tunggu' as const, text: 'Waktu tunggu antrian sebelum terapi tidak terlalu lama' },
      { key: 'b3_c2_respons' as const, text: 'Petugas / dokter merespons keluhan saya dengan cepat' },
      { key: 'b3_c3_jelas' as const, text: 'Dokter bersedia menjelaskan prosedur dengan sabar dan jelas' },
      { key: 'b3_c4_efek_samping' as const, text: 'Jika ada efek samping / keluhan, langsung ditangani' },
    ],
  },
  {
    title: 'B4. Jaminan (Assurance)',
    questions: [
      { key: 'b4_a1_kompetensi' as const, text: 'Saya percaya pada kompetensi dan keahlian dokter akupuntur' },
      { key: 'b4_a2_diagnosis' as const, text: 'Dokter menjelaskan diagnosis dan rencana terapi dengan jelas' },
      { key: 'b4_a3_aman' as const, text: 'Saya merasa aman selama prosedur akupuntur berlangsung' },
      { key: 'b4_a4_sertifikasi' as const, text: 'Dokter memiliki sertifikasi / izin praktik yang resmi' },
    ],
  },
  {
    title: 'B5. Empati (Empathy)',
    questions: [
      { key: 'b5_e1_personal' as const, text: 'Dokter memberikan perhatian personal kepada saya' },
      { key: 'b5_e2_kekhawatiran' as const, text: 'Dokter memahami kekhawatiran saya tentang kondisi kesehatan' },
      { key: 'b5_e3_hormat' as const, text: 'Saya diperlakukan dengan hormat dan manusiawi' },
      { key: 'b5_e4_perkembangan' as const, text: 'Dokter menanyakan perkembangan kondisi saya di setiap kunjungan' },
    ],
  },
]

// ============================================================
// Herbal Questions (Bagian C2)
// ============================================================

export const herbalQuestions = [
  { key: 'c2_herb_explanation' as const, text: 'Dokter menjelaskan fungsi dan manfaat herbal yang diresepkan' },
  { key: 'c2_herb_usage_guide' as const, text: 'Dokter menjelaskan cara penggunaan herbal dengan jelas' },
  { key: 'c2_herb_safety_trust' as const, text: 'Saya percaya terhadap keamanan produk herbal yang diberikan' },
  { key: 'c2_herb_availability' as const, text: 'Produk herbal selalu tersedia di apotek RS (tidak kehabisan)' },
  { key: 'c2_herb_affordability' as const, text: 'Harga produk herbal terjangkau dan transparan' },
  { key: 'c2_herb_pharmacist' as const, text: 'Petugas apotek menjelaskan cara pakai herbal dengan baik' },
]

// ============================================================
// Adjuvant Questions (Bagian D2)
// ============================================================

export const adjuvantQuestions = [
  { key: 'd2_info_acupuncture_support' as const, text: 'Dokter menjelaskan bahwa akupuntur/herbal adalah terapi PENDUKUNG, bukan pengganti obat' },
  { key: 'd2_info_understanding' as const, text: 'Saya memahami dengan jelas peran akupuntur dalam proses penyembuhan saya' },
  { key: 'd2_info_sufficient' as const, text: 'Saya mendapat informasi yang cukup sebelum memulai terapi' },
  { key: 'd2_info_comfortable_asking' as const, text: 'Saya merasa nyaman untuk bertanya kepada dokter tentang terapi ini' },
]

// ============================================================
// Spiritual Questions (Bagian F)
// ============================================================

export const spiritualQuestions = [
  { key: 'f1_salam_doa' as const, text: 'Dokter / staf mengucapkan salam atau doa sebelum / sesudah terapi' },
  { key: 'f2_islam_respect' as const, text: 'Saya merasa nilai-nilai keislaman dihormati dalam layanan ini' },
  { key: 'f3_facility' as const, text: 'Fasilitas ibadah (mushola / tempat wudhu) mudah diakses dan bersih' },
  { key: 'f4_healing' as const, text: 'Layanan di sini tidak hanya menyembuhkan fisik, tapi juga menenangkan jiwa' },
  { key: 'f5_support' as const, text: 'Saya merasa mendapat dukungan spiritual selama proses pengobatan' },
]