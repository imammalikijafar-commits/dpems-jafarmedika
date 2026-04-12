'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Heart,
  Shield,
  BarChart3,
  Users,
  TrendingDown,
  Star,
  ClipboardList,
  QrCode,
  Clock,
  MonitorDot,
  FileText,
  Route,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Leaf,
  Cross,
  LogIn,
  Menu,
  X,
} from 'lucide-react'

/* ──────────────────────── animation helpers ──────────────────────── */

function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const offsets: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: 40 },
    down: { x: 0, y: -40 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: offsets[direction].x,
        y: offsets[direction].y,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: offsets[direction].x,
              y: offsets[direction].y,
            }
      }
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

/* ──────────────────────── section wrapper ──────────────────────── */

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('w-full py-20 md:py-28', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge?: string
  title: string
  description?: string
}) {
  return (
    <FadeIn className="mb-12 text-center md:mb-16">
      {badge && (
        <Badge
          variant="secondary"
          className="mb-4 px-4 py-1.5 text-sm font-medium tracking-wide"
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </FadeIn>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO (includes Navbar)
   ════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-background to-emerald-100/60 dark:from-emerald-950/40 dark:via-background dark:to-emerald-900/20">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Cross className="h-5 w-5 text-primary" />
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-tight text-foreground">DPEMS</p>
                <p className="text-[11px] text-muted-foreground">RSU Ja&apos;far Medika</p>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="#fitur" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                Fitur
              </Link>
              <Link href="#cara-kerja" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                Cara Kerja
              </Link>
              <Link href="/survey/consent" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                Isi Survei
              </Link>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="hidden sm:inline-flex gap-1.5 bg-primary hover:bg-primary/90">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-primary/10 py-3 space-y-1">
              <Link href="#fitur" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                Fitur
              </Link>
              <Link href="#cara-kerja" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                Cara Kerja
              </Link>
              <Link href="/survey/consent" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                Isi Survei
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/5">
                Dashboard Analitik
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/15" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 pt-24 pb-20 text-center sm:px-6 lg:px-8">
        {/* hospital badge */}
        <FadeIn delay={0}>
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Cross className="h-5 w-5 text-primary" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-primary">
              RSU Ja&apos;far Medika
            </span>
            <span className="text-sm text-muted-foreground">
              &mdash; Mojogedang, Karanganyar
            </span>
          </div>
        </FadeIn>

        {/* tagline pills */}
        <FadeIn delay={0.1}>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/20 bg-primary/5 px-3 py-1"
            >
              <Leaf className="h-3.5 w-3.5 text-primary" />
              Akupuntur &amp; Herbal
            </Badge>   
          </div>
        </FadeIn>

        {/* main heading */}
        <FadeIn delay={0.15}>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Digital Patient Experience{' '}
            <span className="bg-linear-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent">
              Monitoring System
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Mengukur &amp; Meningkatkan Kualitas Layanan Integratif untuk
            Rehabilitasi Stroke &amp; Manajemen Nyeri
          </p>
        </FadeIn>

        {/* CTA buttons */}
        <FadeIn delay={0.35}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 gap-2 px-8 text-base font-semibold"
            >
              <Link href="/survey/consent">
                <ClipboardList className="h-5 w-5" />
                Isi Survei
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* straight bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-background" />
    </header>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 2 — KEY METRICS
   ════════════════════════════════════════════════════════════════════ */

const FALLBACK_METRICS = [
  {
    icon: Users,
    label: 'Total Responden',
    value: '-',
    suffix: 'pasien',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    icon: TrendingDown,
    label: 'Rata-rata Pengurangan Nyeri',
    value: '-',
    suffix: '%',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    icon: Star,
    label: 'NPS Score',
    value: '-',
    suffix: '',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    icon: Heart,
    label: 'Tingkat Kepuasan',
    value: '-',
    suffix: '/5',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
  },
]

function MetricsSection() {
  const [metrics, setMetrics] = useState(FALLBACK_METRICS)

  useEffect(() => {
    fetch('/api/dashboard/data?period=30')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return
        setMetrics([
          {
            icon: Users,
            label: 'Total Responden',
            value: data.totalSurveys?.toString() ?? '-',
            suffix: 'pasien',
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          },
          {
            icon: TrendingDown,
            label: 'Rata-rata Pengurangan Nyeri',
            value: data.avgPainReduction?.toString() ?? '-',
            suffix: '%',
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          },
          {
            icon: Star,
            label: 'NPS Score',
            value: data.nps?.score != null
              ? (data.nps.score >= 0 ? '+' : '') + data.nps.score
              : '-',
            suffix: '',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/50',
          },
          {
            icon: Heart,
            label: 'Tingkat Kepuasan',
            value: data.overallSatisfaction?.toString() ?? '-',
            suffix: '/5',
            color: 'text-rose-500 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/50',
          },
        ])
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  return (
    <Section className="bg-background">
      <SectionHeader
        badge="Data Terkini"
        title="Capaian Sistem dalam Angka"
        description="Ringkasan indikator utama dari pengukuran patient experience di RSU Ja'far Medika"
      />

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={staggerItem}>
            <Card className="group relative overflow-hidden border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                    m.bg
                  )}
                >
                  <m.icon className={cn('h-7 w-7', m.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight">
                    {m.value}
                    {m.suffix && (
                      <span className="ml-0.5 text-lg font-semibold text-muted-foreground">
                        {m.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
              {/* subtle accent line */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-linear-to-r from-primary to-emerald-400 transition-all duration-500 group-hover:w-full" />
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>
    </Section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 3 — FEATURES GRID
   ════════════════════════════════════════════════════════════════════ */

const features = [
  {
    icon: ClipboardList,
    title: 'Survei SERVQUAL',
    description:
      'Penilaian 5 dimensi kualitas pelayanan — Tangibles, Reliability, Responsiveness, Assurance, dan Empathy — untuk evaluasi menyeluruh.',
    tags: ['5 Dimensi', 'Evidence-based'],
  },
  {
    icon: Activity,
    title: 'Pain Tracking (VAS)',
    description:
      'Pemantauan tingkat nyeri sebelum dan sesudah terapi menggunakan Visual Analogue Scale, dilengkapi grafik tren per kunjungan.',
    tags: ['VAS', 'Tren Nyeri'],
  },
  {
    icon: Sparkles,
    title: 'Spiritual Care Index',
    description:
      'Pengukuran kenyamanan spiritual dan kecocokan budaya pasien lansia, mencakup aspek islami holistik dalam perawatan.',
    tags: ['Islamic Care', 'Lansia'],
  },
  {
    icon: BarChart3,
    title: 'NPS Real-time',
    description:
      'Net Promoter Score untuk mengukur loyalitas dan rekomendasi pasien secara real-time dengan dashboard interaktif.',
    tags: ['Loyalitas', 'Real-time'],
  },
  {
    icon: Route,
    title: 'Recovery Journey',
    description:
      'Visualisasi perjalanan pemulihan pasien stroke dari kunjungan ke kunjungan — melihat progres fungsi motorik secara visual.',
    tags: ['Stroke', 'Visualisasi'],
  },
  {
    icon: FileText,
    title: 'Laporan Otomatis',
    description:
      'Export laporan analitik dalam format PDF dan Excel untuk keperluan akreditasi, penelitian, dan pengambilan keputusan.',
    tags: ['PDF', 'Excel'],
  },
]

function FeaturesSection() {
  return (
    <Section className="bg-muted/40" id="fitur">
      <SectionHeader
        badge="Fitur Unggulan"
        title="Sistem Monitoring Komprehensif"
        description="Enam modul integratif yang dirancang khusus untuk kebutuhan rumah sakit dengan layanan kedokteran integratif"
      />

      <StaggerContainer
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        staggerDelay={0.08}
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={staggerItem}>
            <Card className="group h-full border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {f.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {f.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </CardContent>
              {/* bottom accent */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-linear-to-r from-primary to-emerald-400 transition-all duration-500 group-hover:w-full" />
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>
    </Section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 4 — HOW IT WORKS
   ════════════════════════════════════════════════════════════════════ */

const steps = [
  {
    icon: QrCode,
    step: '01',
    title: 'Scan QR Code',
    description:
      'Pasien scan QR code yang tersedia di ruang tunggu poli. Tidak perlu install aplikasi — langsung terhubung ke survei digital.',
  },
  {
    icon: Clock,
    step: '02',
    title: 'Isi Survei 2 Menit',
    description:
      'Pertanyaan dirancang mudah dipahami dengan font besar, bahasa jelas, dan antarmuka ramah lansia. Rata-rata pengisian hanya 2 menit.',
  },
  {
    icon: MonitorDot,
    step: '03',
    title: 'Data Real-time',
    description:
      'Manajemen rumah sakit langsung melihat hasil survei, tren kepuasan, dan indikator kualitas melalui dashboard analitik.',
  },
]

function HowItWorksSection() {
  return (
    <Section className="bg-background" id="cara-kerja">
      <SectionHeader
        badge="Cara Kerja"
        title="Sederhana, Cepat, & Efektif"
        description="Tiga langkah mudah untuk mulai mengukur dan meningkatkan pengalaman pasien"
      />

      <div className="relative">
        {/* connector line (desktop) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-primary/20 via-primary/40 to-primary/20 lg:block" />

        <StaggerContainer className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={staggerItem} className="relative">
              <Card className="group h-full border-primary/10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col items-center p-8">
                  {/* step number */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {s.step}
                  </div>

                  {/* icon */}
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                    <s.icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                  <p className="max-w-xs text-base leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </CardContent>
              </Card>

              {/* arrow connector (mobile) */}
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2 lg:hidden">
                  <ArrowRight className="h-5 w-5 rotate-90 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </Section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 5 — ABOUT / FOOTER
   ════════════════════════════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer className="border-t border-primary/10 bg-muted/30">
      <Section className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* left — about */}
          <FadeIn direction="right">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Cross className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    RSU Ja&apos;far Medika
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mojogedang, Karanganyar — Jawa Tengah
                  </p>
                </div>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                DPEMS adalah proyek penelitian akademis yang bertujuan
                mengembangkan sistem pemantauan pengalaman pasien berbasis
                digital untuk meningkatkan kualitas layanan integratif —
                akupunktur dan herbal/kelor — dalam rehabilitasi stroke dan
                manajemen nyeri. Sistem ini dirancang dengan pendekatan
                evidence-based dan islamic holistic care.
              </p>
            </div>
          </FadeIn>

          {/* right — author */}
          <FadeIn direction="left">
            <div className="md:text-right">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Peneliti
              </p>
              <p className="mt-2 text-xl font-bold">Imam Maliki</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Program Studi Magister — Institusi Akademis
              </p>

              <div className="mt-6 flex flex-wrap gap-2 md:justify-end">
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Leaf className="h-3 w-3" />
                  Integrative Medicine
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Activity className="h-3 w-3" />
                  Patient Experience
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Shield className="h-3 w-3" />
                  Evidence-based
                </Badge>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-primary/10 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DPEMS &mdash; Digital Patient
            Experience Monitoring System
          </p>
          <p className="text-xs text-muted-foreground/70">
            Dikembangkan sebagai bagian dari penelitian peningkatan mutu
            pelayanan kesehatan berbasis bukti
          </p>
        </div>
      </Section>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth" suppressHydrationWarning>
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FooterSection />
    </main>
  )
}