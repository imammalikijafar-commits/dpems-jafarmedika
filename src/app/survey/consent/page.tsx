'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, FileText, Lock, ArrowRight, Cross } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ConsentPage() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [scrollToBottom, setScrollToBottom] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) {
      setScrollToBottom(true)
    }
  }

  const handleProceed = () => {
    if (agreed) {
      router.push('/survey')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Cross className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-xs text-gray-500 font-medium">RSU Ja&apos;far Medika</p>
              <p className="text-sm font-bold text-emerald-700">Informed Consent</p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-400">Halaman Persetujuan</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 mb-6 space-y-3"
        >
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lembar Persetujuan Penelitian
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Mohon baca seluruh informasi di bawah ini dengan seksama sebelum memutuskan untuk berpartisipasi dalam penelitian ini.
          </p>
        </motion.div>

        {/* Consent Document */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/10">
            <CardContent className="p-6">
              <div
                onScroll={handleScroll}
                className="h-[55vh] overflow-y-auto pr-2 space-y-5 text-sm leading-relaxed text-gray-700"
              >
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-base font-bold text-gray-800">
                    INFORMED CONSENT / LEMBAR PERSETUJUAN
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Penelitian Pengembangan Sistem Pemantauan Pengalaman Pasien
                  </p>
                </div>

                {/* Section 1 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">1. Judul Penelitian</h3>
                  <p className="text-gray-700">
                    Pengembangan Digital Patient Experience Monitoring System (DPEMS) untuk Evaluasi Kualitas Layanan Integratif (Akupuntur dan Herbal) pada Pasien Stroke dan Nyeri Kronis di RSU Ja&apos;far Medika Karanganyar.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">2. Peneliti</h3>
                  <p>
                    <strong>Peneliti Utama:</strong> Imam Maliki<br />
                    <strong>Institusi:</strong> Program Studi Magister<br />
                    <strong>Tempat Penelitian:</strong> Poli Akupuntur &amp; Herbal, RSU Ja&apos;far Medika, Mojogedang, Karanganyar, Jawa Tengah
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">3. Tujuan Penelitian</h3>
                  <p>
                    Penelitian ini bertujuan mengembangkan dan menguji sistem digital untuk mengukur pengalaman pasien terhadap layanan kedokteran integratif (akupuntur dan herbal/kelor) secara komprehensif. Sistem ini mencakup penilaian kualitas layanan (SERVQUAL), pemantauan tingkat nyeri (VAS), indeks perawatan spiritual, serta loyalitas pasien (NPS). Hasil penelitian diharapkan dapat membantu rumah sakit dalam meningkatkan mutu pelayanan secara berbasis bukti.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">4. Prosedur Partisipasi</h3>
                  <p>
                    Jika Anda setuju untuk berpartisipasi, Anda akan diminta untuk:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>Mengisi kuesioner elektronik yang terdiri dari 8 bagian (A-H)</li>
                    <li>Kuesioner mencakup data demografi, penilaian layanan, penilaian herbal, persepsi terapi, penilaian kondisi, dimensi spiritual, loyalitas, dan masukan/saran</li>
                    <li>Waktu pengisian perkiraan 5-10 menit</li>
                    <li>Anda dapat mengisi kuesioner ini setelah menjalani terapi akupuntur di poli</li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">5. Risiko dan Manfaat</h3>
                  <p className="mb-2">
                    <strong>Risiko:</strong> Penelitian ini tidak memiliki risiko fisik. Kuesioner hanya berisi pertanyaan terkait pengalaman Anda sebagai pasien. Tidak ada intervensi medis yang dilakukan dalam penelitian ini.
                  </p>
                  <p>
                    <strong>Manfaat:</strong> Partisipasi Anda secara langsung berkontribusi pada peningkatan kualitas layanan kesehatan, khususnya layanan integratif di rumah sakit. Hasil penelitian akan digunakan sebagai rekomendasi perbaikan pelayanan.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">6. Kerahasiaan Data</h3>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <Lock className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p>
                      Seluruh data yang dikumpulkan akan dijamin kerahasiaannya. Kuesioner bersifat <strong>anonim</strong> — tidak meminta nama, NIK, atau identitas personal lainnya. Data hanya digunakan untuk keperluan penelitian dan akan disimpan secara aman. Hasil penelitian dilaporkan dalam bentuk agregat (kelompok) tanpa dapat mengidentifikasi individu. Akses data hanya diberikan kepada peneliti utama dan pembimbing penelitian.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">7. Kesukarelaan</h3>
                  <p>
                    Partisipasi dalam penelitian ini sepenuhnya bersifat <strong>sukarela</strong>. Anda berhak untuk menolak berpartisipasi atau mengundurkan diri kapan saja tanpa konsekuensi apa pun terhadap pelayanan medis yang Anda terima di rumah sakit. Anda juga dapat menghentikan pengisian kuesioner kapan saja tanpa perlu memberikan alasan.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">8. Hak Responden</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Mendapatkan penjelasan tentang tujuan dan prosedur penelitian</li>
                    <li>Menolak atau mengundurkan diri tanpa konsekuensi</li>
                    <li>Menanyakan hal-hal yang belum dipahami kepada peneliti</li>
                    <li>Tidak dipaksa untuk menjawab pertanyaan yang tidak diinginkan</li>
                  </ul>
                </div>

                {/* Section 9 */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">9. Kontak Peneliti</h3>
                  <p>
                    Jika Anda memiliki pertanyaan atau memerlukan informasi lebih lanjut terkait penelitian ini, Anda dapat menghubungi:
                  </p>
                  <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p><strong>Peneliti:</strong> Imam Maliki</p>
                    <p><strong>Institusi:</strong> Program Studi Magister</p>
                    <p><strong>Tempat:</strong> Poli Akupuntur &amp; Herbal, RSU Ja&apos;far Medika</p>
                  </div>
                </div>

                {/* Section 10 */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-800 mb-2">10. Pernyataan Persetujuan</h3>
                  <p>
                    Dengan menandai checkbox persetujuan di bawah, saya menyatakan bahwa:
                  </p>
                  <ul className="list-none space-y-1 mt-2 text-gray-700">
                    <li>1. Saya telah membaca dan memahami seluruh informasi di lembar persetujuan ini</li>
                    <li>2. Saya telah mendapat kesempatan untuk bertanya dan jawaban saya telah dipenuhi</li>
                    <li>3. Saya berpartisipasi secara sukarela tanpa paksaan dari pihak manapun</li>
                    <li>4. Saya memberikan persetujuan untuk data saya digunakan dalam penelitian ini dengan menjaga kerahasiaan identitas saya</li>
                  </ul>
                </div>

                {/* Scroll hint */}
                {!scrollToBottom && (
                  <div className="text-center py-3 animate-bounce">
                    <p className="text-xs text-gray-400">↓ Scroll ke bawah untuk membaca seluruh informasi</p>
                  </div>
                )}
              </div>

              {/* Agreement Section */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer select-none">
                    Saya telah membaca dan memahami seluruh informasi di atas. Dengan sadar dan tanpa paksaan, saya bersedia berpartisipasi dalam penelitian ini serta memberikan persetujuan untuk data kuesioner saya digunakan sesuai ketentuan kerahasiaan yang telah dijelaskan.
                  </label>
                </div>

                <Button
                  onClick={handleProceed}
                  disabled={!agreed}
                  className={cn(
                    'w-full h-12 text-base font-semibold transition-all',
                    agreed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  {agreed ? 'Setuju & Lanjutkan ke Kuesioner' : 'Silakan Baca & Setujui Terlebih Dahulu'}
                  {agreed && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>

                <p className="text-[11px] text-center text-gray-400">
                  Dengan melanjutkan, Anda menyetujui ketentuan informed consent ini.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}