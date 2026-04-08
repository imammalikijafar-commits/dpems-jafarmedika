// app/survey/[unitId]/page.tsx
// Main Survey Page - Mobile First Design for Elderly Patients
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { surveySchema, type SurveyFormValues } from '@/lib/utils/validators';
import { Unit, TreatmentType, FunctionalImprovement } from '@/lib/types';
import LikertScale from '@/components/survey/LikertScale';
import PainScale from '@/components/survey/PainScale';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CheckCircle2, AlertCircle, Clock, User, Heart, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'demographics' | 'servqual' | 'clinical' | 'spiritual' | 'nps' | 'complete';

const STEP_CONFIG: Record<Step, { title: string; icon: React.ReactNode; description: string }> = {
  demographics: {
    title: 'Data Diri',
    icon: <User className="w-5 h-5" />,
    description: 'Informasi anonim untuk analisis statistik'
  },
  servqual: {
    title: 'Penilaian Layanan',
    icon: <Star className="w-5 h-5" />,
    description: 'Bagaimana pengalaman Anda dengan layanan kami?'
  },
  clinical: {
    title: 'Hasil Pengobatan',
    icon: <Heart className="w-5 h-5" />,
    description: 'Perbaikan kondisi kesehatan Anda'
  },
  spiritual: {
    title: 'Aspek Holistik',
    icon: <Heart className="w-5 h-5" />,
    description: 'Dukungan spiritual dan budaya (opsional)'
  },
  nps: {
    title: 'Rekomendasi',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Apakah Anda merekomendasikan kami?'
  },
  complete: {
    title: 'Terima Kasih!',
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: 'Masukan Anda sangat berharga'
  }
};

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.unitId as string;

  // State
  const [currentStep, setCurrentStep] = useState<Step>('demographics');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [unit, setUnit] = useState<Unit | null>(null);

  // Form State - Using proper nullable types
  const [formData, setFormData] = useState<{
    age_range: '<40' | '41-50' | '51-60' | '61-70' | '>70' | '';
    gender: 'L' | 'P' | '';
    patient_type: 'BPJS' | 'Asuransi' | 'Umum' | '';
    visit_count: number;
    treatment_type: TreatmentType | '';
    tangibles: number | null;
    reliability: number | null;
    responsiveness: number | null;
    assurance: number | null;
    empathy: number | null;
    pain_level_before: number | null;
    pain_level_after: number | null;
    functional_improvement: FunctionalImprovement | '';
    spiritual_comfort: number | undefined;
    cultural_respect: number | undefined;
    family_feeling: number | undefined;
    nps_score: number | null;
    complaints: string;
    suggestions: string;
    testimonial: string;
  }>({
    age_range: '',
    gender: '',
    patient_type: '',
    visit_count: 1,
    treatment_type: '',
    tangibles: null,
    reliability: null,
    responsiveness: null,
    assurance: null,
    empathy: null,
    pain_level_before: null,
    pain_level_after: null,
    functional_improvement: '',
    spiritual_comfort: undefined,
    cultural_respect: undefined,
    family_feeling: undefined,
    nps_score: null,
    complaints: '',
    suggestions: '',
    testimonial: ''
  });

  // Fetch unit info on mount
useEffect(() => {
  async function fetchUnit() {
    try {
      console.log('🔍 [DPEMS] Starting fetch for unitId:', unitId);
      
      const supabase = createClient();
      
      // DEBUG: Cek supabase connection
      console.log('🔌 [DPEMS] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
      console.log('🔑 [DPEMS] Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('qr_code', unitId)
        .single();

      console.log('✅ [DPEMS] Query result:', { data, error });

      if (error) {
        console.error('❌ [DPEMS] Supabase error:', error);
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }
      
      if (!data) {
        console.warn('⚠️ [DPEMS] No unit found with QR:', unitId);
        throw new Error(`Unit dengan QR code "${unitId}" tidak ditemukan`);
      }
      
      if (!data.is_active) {
        console.warn('🚫 [DPEMS] Unit is not active:', data.name);
        throw new Error(`Unit "${data.name}" sedang tidak aktif`);
      }

      console.log('🎉 [DPEMS] Unit loaded successfully:', data.name);
      setUnit(data);
    } catch (err) {
      console.error('💥 [DPEMS] Fatal error in fetchUnit:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tak diketahui');
    } finally {
      setLoading(false); // PASTIKAN INI SELALU DIJALANKAN!
    }
  }

  fetchUnit();
}, [unitId]);

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear errors on interaction
  };

  // Validate current step
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'demographics':
        return !!(formData.age_range && formData.gender && formData.patient_type && formData.treatment_type);
      case 'servqual':
        return !!(formData.tangibles && formData.reliability && formData.responsiveness && formData.assurance && formData.empathy);
      case 'clinical':
        return !!(formData.pain_level_before !== null && formData.pain_level_after !== null && formData.functional_improvement);
      case 'spiritual':
        return true; // Optional fields
      case 'nps':
        return formData.nps_score !== null;
      default:
        return true;
    }
  };

  // Navigation
  const steps: Step[] = ['demographics', 'servqual', 'clinical', 'spiritual', 'nps'];
  const currentStepIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (!validateStep()) {
      setError('Mohon isi semua field yang wajib (*)');
      return;
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
      setError(null);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      setError(null);
    }
  };

  // Submit Survey
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const payload = {
        unit_id: unit!.id,
        age_range: formData.age_range || null,
        gender: formData.gender || null,
        patient_type: formData.patient_type || null,
        visit_count: formData.visit_count,
        treatment_type: formData.treatment_type || null,
        tangibles: formData.tangibles,
        reliability: formData.reliability,
        responsiveness: formData.responsiveness,
        assurance: formData.assurance,
        empathy: formData.empathy,
        pain_level_before: formData.pain_level_before,
        pain_level_after: formData.pain_level_after,
        functional_improvement: formData.functional_improvement || null,
        spiritual_comfort: formData.spiritual_comfort ?? null,
        cultural_respect: formData.cultural_respect ?? null,
        family_feeling: formData.family_feeling ?? null,
        nps_score: formData.nps_score,
        complaints: formData.complaints || null,
        suggestions: formData.suggestions || null,
        testimonial: formData.testimonial || null,
        session_duration_seconds: Math.round((Date.now() - startTime) / 1000),
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      };

      const { error: submitError } = await supabase
        .from('surveys')
        .insert([payload]);

      if (submitError) throw submitError;

      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading || !unit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">Memuat informasi layanan...</p>
        </div>
      </div>
    );
  }

  // Error State (Unit not found)
  if (error && !unit) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card padding="md" className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">QR Code Tidak Valid</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Survey Kepuasan Pasien</h1>
              <p className="text-sm text-emerald-600 font-medium">{unit.name}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <Clock className="w-4 h-4 inline mr-1" />
              Estimasi: 2 menit
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Langkah {currentStepIndex + 1} dari {steps.length}</span>
              <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {currentStep !== 'complete' ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step Header */}
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    {STEP_CONFIG[currentStep].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {STEP_CONFIG[currentStep].title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {STEP_CONFIG[currentStep].description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Step Content */}
              {currentStep === 'demographics' && (
                <Card padding="md">
                  <div className="space-y-5">
                    {/* Age Range */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">
                        Range Usia <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['<40', '41-50', '51-60', '61-70', '>70'].map((age) => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => updateField('age_range', age)}
                            className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.age_range === age
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {age.replace('>', '> ').replace('<', '< ')} tahun
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'L', label: 'Laki-laki 👨' },
                          { value: 'P', label: 'Perempuan 👩' }
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateField('gender', opt.value)}
                            className={`py-3 px-4 rounded-lg border-2 text-base font-medium transition-all ${
                              formData.gender === opt.value
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Patient Type */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">
                        Jenis Pembayaran <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {(['BPJS', 'Asuransi', 'Umum'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateField('patient_type', type)}
                            className={`w-full py-3 px-4 rounded-lg border-2 text-left font-medium transition-all flex justify-between items-center ${
                              formData.patient_type === type
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span>{type}</span>
                            {type === 'BPJS' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Populer</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visit Count */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">
                        Kunjungan ke-berapa? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.visit_count}
                        onChange={(e) => updateField('visit_count', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 text-lg"
                        placeholder="Contoh: 5"
                      />
                    </div>

                    {/* Treatment Type */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700">
                        Jenis Pengobatan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.treatment_type}
                        onChange={(e) => updateField('treatment_type', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 text-base bg-white"
                      >
                        <option value="">Pilih jenis pengobatan...</option>
                        <option value="Stroke Rehabilitasi">Stroke Rehabilitasi</option>
                        <option value="Nyeri Kronik (Punggung/Lutut)">Nyeri Kronik (Punggung/Lutut)</option>
                        <option value="HNP (Syaraf Kejepit)">HNP (Syaraf Kejepit)</option>
                        <option value="Ischialgia (Nyeri Panggul)">Ischialgia (Nyeri Panggul)</option>
                        <option value="Migrain/Sakit Kepala">Migrain/Sakit Kepala</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {currentStep === 'servqual' && (
                <div className="space-y-4">
                  <LikertScale
                    label="Kebersihan & Kenyamanan Fasilitas"
                    value={formData.tangibles}
                    onChange={(v) => updateField('tangibles', v)}
                    description="Termasuk: kebersihan ruangan, kenyamanan tempat berbaring, suhu ruangan"
                    required
                  />
                  
                  <LikertScale
                    label="Keandalan & Konsistensi Pelayanan"
                    value={formData.reliability}
                    onChange={(v) => updateField('reliability', v)}
                    description="Jadwal dokter tepat waktu, resep herbal tersedia, rekam medis lengkap"
                    required
                  />

                  <LikertScale
                    label="Kecepatan Tanggap Staff"
                    value={formData.responsiveness}
                    onChange={(v) => updateField('responsiveness', v)}
                    description="Waktu tunggu singkat, respons cepat saat panggilan, fleksibel reschedule"
                    required
                  />

                  <LikertScale
                    label="Kompetensi & Kepercayaan"
                    value={formData.assurance}
                    onChange={(v) => updateField('assurance', v)}
                    description="Penjelasan prosedur jelas, sertifikasi terapis terdisplay, keamanan terjamin"
                    required
                  />

                  <LikertScale
                    label="Perhatian & Empati Personal"
                    value={formData.empathy}
                    onChange={(v) => updateField('empathy', v)}
                    description="Diperhatikan sebagai individu, bukan sekadar pasien, empati terhadap rasa nyeri"
                    required
                  />
                </div>
              )}

              {currentStep === 'clinical' && (
                <div className="space-y-6">
                  <Card padding="md" className="border-2 border-blue-200 bg-blue-50">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 Bagian ini membantu kami memantau efektivitas pengobatan integratif Anda.
                    </p>
                  </Card>

                  <PainScale
                    label="Tingkat Nyeri SEBELUM Terapi Hari Ini"
                    value={formData.pain_level_before}
                    onChange={(v) => updateField('pain_level_before', v)}
                    type="before"
                  />

                  <PainScale
                    label="Tingkat Nyeri SESUDAH Terapi Hari Ini (saat ini)"
                    value={formData.pain_level_after}
                    onChange={(v) => updateField('pain_level_after', v)}
                    type="after"
                  />

                  {/* Pain Reduction Indicator */}
                  {formData.pain_level_before !== null && formData.pain_level_after !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border-2 ${
                        formData.pain_level_after < formData.pain_level_before
                          ? 'bg-green-50 border-green-200'
                          : formData.pain_level_after > formData.pain_level_before
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          Perubahan Tingkat Nyeri:
                        </span>
                        <span className={`text-2xl font-bold ${
                          formData.pain_level_after < formData.pain_level_before ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formData.pain_level_before > formData.pain_level_after ? '-' : '+'}
                          {Math.abs(formData.pain_level_before - formData.pain_level_after)} point
                        </span>
                      </div>
                      {formData.pain_level_before > formData.pain_level_after && (
                        <p className="text-sm text-green-700 mt-1">
                          ✅ Alhamdulillah! Ada perbaikan.
                        </p>
                      )}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">
                      Perbaikan Fungsi Tubuh <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'much_better' as const, label: 'Jauh Lebih Baik 🎉', desc: 'Bisa beraktivitas normal' },
                        { value: 'slightly_better' as const, label: 'Sedikit Membaik 👍', desc: 'Ada kemajuan kecil' },
                        { value: 'same' as const, label: 'Sama Saja 😐', desc: 'Belum ada perubahan' },
                        { value: 'worse' as const, label: 'Lebih Buruk 😟', desc: 'Kondisi menurun' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField('functional_improvement', opt.value)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            formData.functional_improvement === opt.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{opt.label}</div>
                          <div className="text-sm text-gray-500">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'spiritual' && (
                <div className="space-y-4">
                  <Card padding="md" className="border-2 border-purple-200 bg-purple-50">
                    <p className="text-sm text-purple-800 font-medium">
                      🕌 Bagian ini OPSIONAL. Kami menghargai aspek spiritual dalam penyembuhan holistik.
                    </p>
                  </Card>

                  <LikertScale
                    label="Kenyamanan Spiritual (Doa/Dzikir)"
                    value={formData.spiritual_comfort ?? null}
                    onChange={(v) => updateField('spiritual_comfort', v)}
                    emojis={['😌', '😊', '🙂', '😌', '🤲']}
                    labels={['Tidak Merasa', 'Agak Tenang', 'Tenang', 'Sangat Tenang', 'Damai']}
                    description="Apakah doa/dzikir dari staff membantu ketenangan?"
                  />

                  <LikertScale
                    label="Penghargaan Budaya & Latar Belakang"
                    value={formData.cultural_respect ?? null}
                    onChange={(v) => updateField('cultural_respect', v)}
                    description="Apakah staf menghormati Anda sebagai petani/pensiunan/dll?"
                  />

                  <LikertScale
                    label="Rasa Kebersamaan (Family Feeling)"
                    value={formData.family_feeling ?? null}
                    onChange={(v) => updateField('family_feeling', v)}
                    description="Apakah merasa seperti keluarga, bukan pasien anonim?"
                  />
                </div>
              )}

              {currentStep === 'nps' && (
                <div className="space-y-6">
                  {/* NPS Score */}
                  <Card padding="md" className="border-2 border-indigo-200">
                    <div className="space-y-4">
                      <label className="text-lg font-bold text-gray-900 block text-center">
                        Seberapa besar kemungkinan Anda merekomendasikan<br/>
                        <span className="text-emerald-600">{unit.name}</span><br/>
                        kepada teman atau keluarga?
                      </label>
                      
                      <div className="flex justify-center gap-2 flex-wrap">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => updateField('nps_score', num)}
                            className={`w-10 h-10 rounded-lg border-2 font-bold text-lg transition-all hover:scale-110 ${
                              formData.nps_score === num
                                ? num >= 9
                                  ? 'bg-green-500 text-white border-green-600'
                                  : num >= 7
                                  ? 'bg-gray-200 text-gray-800 border-gray-400'
                                  : 'bg-red-500 text-white border-red-600'
                                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 px-2">
                        <span>Tidak Mungkin (0)</span>
                        <span>Kemungkinan Besar (10)</span>
                      </div>
                    </div>
                  </Card>

                  {/* Open-ended Questions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Keluhan atau Saran Perbaikan (Opsional)
                      </label>
                      <textarea
                        value={formData.complaints}
                        onChange={(e) => updateField('complaints', e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Apa yang bisa kami perbaikan?"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right mt-1">
                        {(formData.complaints?.length || 0)}/500 karakter
                      </p>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Testimoni Positif (Opsional)
                      </label>
                      <textarea
                        value={formData.testimonial}
                        onChange={(e) => updateField('testimonial', e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Cerita pengalaman positif Anda (boleh kami publikasikan tanpa nama)"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={prevStep} className="flex-1">
                    ← Sebelumnya
                  </Button>
                )}
                
                {currentStepIndex < steps.length - 1 ? (
                  <Button onClick={nextStep} className="flex-1">
                    Selanjutnya →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    isLoading={submitting}
                    className="flex-1 text-lg py-3"
                  >
                    {submitting ? 'Menyimpan...' : '✓ Kirim Survey'}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Complete State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-12"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Alhamdulillah! ✨
                </h2>
                <p className="text-lg text-gray-600">
                  Terima kasih atas partisipasi Anda.
                </p>
                <p className="text-gray-500 mt-2">
                  Masukan Anda membantu kami meningkatkan layanan<br/>
                  <strong className="text-emerald-600">{unit.name}</strong>
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 max-w-sm mx-auto">
                <p className="text-sm text-emerald-800 font-medium">
                  🤲 Semoga Allah memberikan kesembuhan<br/>
                  untuk Anda dan keluarga.<br/>
                  <span className="text-emerald-600">&quot;Wa idza maridtu fahuwa yashfin&quot;</span><br/>
                  <span className="text-xs">(Dan jika aku sakit, Dialah yang menyembuhkannya - QS. Asy-Syu&#39;ara: 80)</span>
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => window.close()}
                className="mt-8"
              >
                Tutup Halaman Ini
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}