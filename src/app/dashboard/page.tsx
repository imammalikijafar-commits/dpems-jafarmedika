'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Users, TrendingDown, Star, Heart, Activity, MessageCircle,
  BarChart3, Download, RefreshCw, Shield, AlertTriangle, Building2, CheckCircle2,
  Bell, Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText,
  X, ChevronDown, ChevronsUpDown, Filter, Database
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/components/ui/table'
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts'
import { cn } from '@/lib/utils'
import { KPICard } from '@/components/dashboard/KPICard'
import type { DashboardData, Survey } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

const NPS_COLORS = ['#059669', '#d97706', '#dc2626']
const CONDITION_TYPES = [
  'Stroke / Pasca Stroke',
  'Nyeri Sendi (Rematik/OA)',
  'Nyeri Punggung / Saraf Kejepit',
  'Migrain / Sakit Kepala Kronis',
  'Gangguan Tidur (Insomnia)',
  'Kondisi Neurologis Lainnya',
  'Wellness / Pemeliharaan Kesehatan',
  'Lainnya',
]

interface SurveyRow {
  id: string
  submitted_at: string
  age_range: string | null
  gender: string | null
  condition_type: string | null
  nps_score: number | null
  pain_level_before: number | null
  pain_level_after: number | null
  tangibles: number | null
  reliability: number | null
  responsiveness: number | null
  assurance: number | null
  empathy: number | null
  best_experience: string | null
  improvement_suggestion: string | null
  testimonial: string | null
  education: string | null
  occupation: string | null
  patient_type: string | null
  visit_count: string | null
  condition_change: string | null
  herbal_prescribed: boolean | null
  visit_plan: string | null
  has_recommended: string | null
  units: { name: string } | null
}

interface SurveysResponse {
  surveys: SurveyRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState('30')
  const [loading, setLoading] = useState(true)

  // Data Survei tab state
  const [surveysData, setSurveysData] = useState<SurveysResponse | null>(null)
  const [surveysLoading, setSurveysLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [npsMin, setNpsMin] = useState('')
  const [npsMax, setNpsMax] = useState('')
  const [surveyPage, setSurveyPage] = useState(1)
  const surveysFetchRef = useRef(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/data?period=${period}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e)
    } finally {
      setLoading(false)
    }
  }, [period])

  const fetchSurveys = useCallback(async (pageNum: number = 1) => {
    setSurveysLoading(true)
    const fetchId = ++surveysFetchRef.current
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      if (genderFilter) params.set('gender', genderFilter)
      if (conditionFilter) params.set('condition_type', conditionFilter)
      if (npsMin) params.set('npsMin', npsMin)
      if (npsMax) params.set('npsMax', npsMax)
      params.set('page', String(pageNum))
      params.set('pageSize', '10')

      const res = await fetch(`/api/surveys?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch surveys')
      const json = await res.json()
      if (fetchId === surveysFetchRef.current) {
        setSurveysData(json)
        setSurveyPage(pageNum)
      }
    } catch (e) {
      console.error('Failed to fetch surveys:', e)
    } finally {
      if (fetchId === surveysFetchRef.current) {
        setSurveysLoading(false)
      }
    }
  }, [search, dateFrom, dateTo, genderFilter, conditionFilter, npsMin, npsMax])

  // Fetch dashboard data on period change
  useEffect(() => { fetchData() }, [fetchData])

  // Realtime subscription for auto-refresh
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('surveys-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'surveys' }, () => {
        fetchData()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchData])

  // Fetch surveys when tab is active or filters change
  useEffect(() => {
    fetchSurveys(1)
  }, [fetchSurveys])

  const resetFilters = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setGenderFilter('')
    setConditionFilter('')
    setNpsMin('')
    setNpsMax('')
  }

  const getExportUrl = (type: 'excel' | 'pdf') => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (genderFilter) params.set('gender', genderFilter)
    if (conditionFilter) params.set('condition_type', conditionFilter)
    if (npsMin) params.set('npsMin', npsMin)
    if (npsMax) params.set('npsMax', npsMax)
    params.set('period', period)
    return `/api/export/${type}?${params.toString()}`
  }

  const servqualData = data ? [
    { dimension: 'Tangibles', score: data.servqual.tangibles, fullMark: 5 },
    { dimension: 'Reliability', score: data.servqual.reliability, fullMark: 5 },
    { dimension: 'Responsiveness', score: data.servqual.responsiveness, fullMark: 5 },
    { dimension: 'Assurance', score: data.servqual.assurance, fullMark: 5 },
    { dimension: 'Empathy', score: data.servqual.empathy, fullMark: 5 },
  ] : []

  const npsData = data ? [
    { name: 'Promoters', value: data.nps.promoters, color: '#059669' },
    { name: 'Passives', value: data.nps.passives, color: '#d97706' },
    { name: 'Detractors', value: data.nps.detractors, color: '#dc2626' },
  ] : []

  const spiritualData = data ? [
    { dimension: 'Spiritual Comfort', score: data.spiritualAvg.spiritualComfort },
    { dimension: 'Respek Budaya', score: data.spiritualAvg.culturalRespect },
    { dimension: 'Rasa Kekeluargaan', score: data.spiritualAvg.familyFeeling },
  ] : []

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  // Safe unitPerformance with fallback
  const unitPerf = data.unitPerformance && data.unitPerformance.length > 0
    ? data.unitPerformance
    : [{ unitName: 'Poli Akupuntur & Herbal', unitType: 'Integrative Medicine', surveyCount: data.totalSurveys, avgSatisfaction: data.overallSatisfaction, avgPainReduction: data.avgPainReduction }]
  const sortedUnits = [...unitPerf].sort((a, b) => b.avgSatisfaction - a.avgSatisfaction)
  const topUnit = sortedUnits[0]
  const worstServqual = Math.min(data.servqual.tangibles, data.servqual.reliability, data.servqual.responsiveness, data.servqual.assurance, data.servqual.empathy)

  const hasFilters = search || dateFrom || dateTo || genderFilter || conditionFilter || npsMin || npsMax

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-350 mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold text-gray-800">DPEMS Dashboard</h1>
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <p className="text-xs text-gray-500">{data.hospital?.name || 'RSU Ja\'far Medika Karanganyar'}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
            >
              <option value="7">7 Hari</option>
              <option value="30">30 Hari</option>
              <option value="90">90 Hari</option>
              <option value="365">1 Tahun</option>
            </select>
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={Users} title="Total Responden" value={data.totalSurveys.toString()} subtitle={`Response Rate: ${data.responseRate}%`} trend="up" color="emerald" delay={0} />
          <KPICard icon={TrendingDown} title="Pengurangan Nyeri" value={`${data.avgPainReduction}%`} subtitle="VAS Score reduction" trend={data.avgPainReduction > 0 ? 'up' : 'down'} color="blue" delay={1} />
          <KPICard icon={Star} title="NPS Score" value={data.nps.score > 0 ? `+${data.nps.score}` : `${data.nps.score}`} subtitle={`Promoters: ${data.nps.promoters} | Detractors: ${data.nps.detractors}`} trend={data.nps.score > 0 ? 'up' : 'down'} color="amber" delay={2} />
          <KPICard icon={Heart} title="Kepuasan Overall" value={`${data.overallSatisfaction}/5`} subtitle="SERVQUAL Score" trend={data.overallSatisfaction >= 4 ? 'up' : 'down'} color="rose" delay={3} />
        </div>

        {/* Alerts Bar */}
        {data.recentAlerts && data.recentAlerts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    {data.recentAlerts.length} Alert Baru
                  </p>
                  <p className="text-xs text-amber-600">
                    {data.recentAlerts[0]?.message || 'Review diperlukan'}
                  </p>
                </div>
                <Badge className="bg-amber-200 text-amber-800">{data.recentAlerts[0]?.severity || 'medium'}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
            <TabsTrigger value="clinical" className="text-xs sm:text-sm py-2">Clinical</TabsTrigger>
            <TabsTrigger value="servqual" className="text-xs sm:text-sm py-2">SERVQUAL</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm py-2">Feedback</TabsTrigger>
            <TabsTrigger value="data" className="text-xs sm:text-sm py-2">Data Survei</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" /> Tren Survei Harian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-70">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.trendData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#colorCount)" strokeWidth={2} name="Survei" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" /> NPS Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-70 w-70">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={npsData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                            {npsData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="text-center mb-2">
                        <p className="text-4xl font-bold text-gray-800">{data.nps.score > 0 ? `+${data.nps.score}` : data.nps.score}</p>
                        <p className="text-sm text-gray-500">NPS Score</p>
                      </div>
                      {npsData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.value}</span>
                            <span className="text-xs text-gray-400">({data.nps.total > 0 ? Math.round((item.value / data.nps.total) * 100) : 0}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="bg-linear-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="font-bold text-emerald-800 text-sm">Top Performer</p>
                      <p className="text-emerald-600 text-xs mt-1">{topUnit?.unitName || '-'}</p>
                      <p className="text-emerald-500 text-xs mt-0.5">OSS {(topUnit?.avgSatisfaction || 0).toFixed(2)}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-linear-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="font-bold text-amber-800 text-sm">Perlu Perhatian</p>
                      <p className="text-amber-600 text-xs mt-1">Responsiveness: {data.servqual.responsiveness}/5</p>
                      <p className="text-amber-500 text-xs mt-0.5">Dimensi terendah</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="font-bold text-blue-800 text-sm">Spiritual Wellness</p>
                      <p className="text-blue-600 text-xs mt-1">Indeks Spiritual rata-rata:</p>
                      <p className="text-blue-500 text-xs mt-0.5">
                        {((data.spiritualAvg.spiritualComfort + data.spiritualAvg.culturalRespect + data.spiritualAvg.familyFeeling) / 3).toFixed(2)}/5
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CLINICAL */}
          <TabsContent value="clinical" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-red-500" /> Pengurangan Nyeri per Unit</CardTitle>
                  <CardDescription>Rata-rata penurunan VAS Score (%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sortedUnits.sort((a, b) => b.avgPainReduction - a.avgPainReduction)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="unitName" width={160} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => [`${v ?? 0}%`, 'Pengurangan Nyeri']} />
                        <Bar dataKey="avgPainReduction" fill="#059669" radius={[0, 6, 6, 0]} name="Pengurangan Nyeri (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-purple-500" /> Spiritual & Cultural Wellness</CardTitle>
                  <CardDescription>Rata-rata skor spiritual pasien (1-5)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={spiritualData} cx="50%" cy="50%" outerRadius="80%">
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <Radar name="Skor" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.3} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2"><Users className="w-5 h-5 text-emerald-500" /> Profil Demografi Pasien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Kelompok Usia</p>
                    {Object.entries(data.demographics.ageRangeDistribution).sort((a, b) => b[1] - a[1]).map(([range, c]) => (
                      <div key={range} className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div className="bg-emerald-500 rounded-full h-3 transition-all" style={{ width: `${data.totalSurveys > 0 ? (c / data.totalSurveys) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-10">{range}</span>
                        <span className="text-xs font-bold w-6 text-right">{c}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Gender</p>
                    {Object.entries(data.demographics.genderDistribution).map(([g, c]) => (
                      <div key={g} className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div className="bg-blue-500 rounded-full h-3 transition-all" style={{ width: `${data.totalSurveys > 0 ? (c / data.totalSurveys) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-16">{g === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        <span className="text-xs font-bold w-6 text-right">{c}</span>
                      </div>
                    ))}
                    <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">Jenis Pasien</p>
                    {Object.entries(data.demographics.patientTypeDistribution).map(([t, c]) => (
                      <div key={t} className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div className="bg-amber-500 rounded-full h-3 transition-all" style={{ width: `${data.totalSurveys > 0 ? (c / data.totalSurveys) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-16">{t}</span>
                        <span className="text-xs font-bold w-6 text-right">{c}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Treatment Terbanyak</p>
                    <div className="flex flex-wrap gap-2">
                      {data.demographics.topTreatments.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-sm py-1 px-3">{t.name}: <span className="font-bold ml-1">{t.count}</span></Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVQUAL */}
          <TabsContent value="servqual" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-500" /> SERVQUAL Radar Chart</CardTitle>
                  <CardDescription>Skor rata-rata 5 dimensi (1-5)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={servqualData} cx="50%" cy="50%" outerRadius="80%">
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <Radar name="Skor" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.3} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold">SERVQUAL Detail per Dimensi</CardTitle>
                  <CardDescription>Skor rata-rata dan persentase kepuasan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {servqualData.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.dimension}</span>
                        <span className="text-sm font-bold text-emerald-600">{item.score.toFixed(2)} / 5</span>
                      </div>
                      <Progress value={(item.score / 5) * 100} className="h-3" />
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-800">Overall SERVQUAL</span>
                      <span className="text-sm font-bold text-emerald-600">{data.servqual.overall.toFixed(2)} / 5</span>
                    </div>
                    <Progress value={(data.servqual.overall / 5) * 100} className="h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FEEDBACK */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-emerald-500" /> Feedback Terbaru dari Pasien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recentFeedback.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Belum ada feedback</p>
                ) : (
                  data.recentFeedback.map((fb, i) => {
                    const isPositive = fb.npsScore && fb.npsScore >= 9
                    const isNegative = fb.npsScore && fb.npsScore <= 6
                    return (
                      <div key={i} className={cn('p-4 rounded-xl border', isPositive ? 'bg-emerald-50 border-emerald-200' : isNegative ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200')}>
                        <div className="space-y-2">
                          {fb.testimonial && (
                            <div className="flex items-start gap-2">
                              <span className="text-emerald-500 text-xs shrink-0 mt-0.5">Testimoni:</span>
                              <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{fb.testimonial}&rdquo;</p>
                            </div>
                          )}
                          {fb.complaints && (
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 text-xs shrink-0 mt-0.5">Keluhan:</span>
                              <p className="text-sm text-gray-600">{fb.complaints}</p>
                            </div>
                          )}
                          {(fb.suggestions || fb.improvementSuggestion) && (
                            <div className="flex items-start gap-2">
                              <span className="text-blue-500 text-xs shrink-0 mt-0.5">Saran:</span>
                              <p className="text-sm text-gray-600">{fb.suggestions || fb.improvementSuggestion}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                          {fb.npsScore !== null && (
                            <Badge variant="outline" className={cn('text-xs', isPositive ? 'border-emerald-300 text-emerald-600' : isNegative ? 'border-red-300 text-red-600' : 'border-amber-300 text-amber-600')}>
                              NPS: {fb.npsScore}
                            </Badge>
                          )}
                          <span className="text-[10px] text-gray-400">{fb.unitName}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA SURVEI */}
          <TabsContent value="data" className="space-y-4">
            {/* Filter Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">Filter & Pencarian</span>
                  {hasFilters && (
                    <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 ml-auto" onClick={resetFilters}>
                      <X className="w-3 h-3 mr-1" /> Reset Filter
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Cari feedback..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                  {/* Date From */}
                  <Input
                    type="date"
                    placeholder="Dari tanggal"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="text-sm"
                  />
                  {/* Date To */}
                  <Input
                    type="date"
                    placeholder="Sampai tanggal"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="text-sm"
                  />
                  {/* Gender */}
                  <Select value={genderFilter} onValueChange={(v) => setGenderFilter(v === '__all__' ? '' : v)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Semua Gender</SelectItem>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Condition Type */}
                  <Select value={conditionFilter} onValueChange={(v) => setConditionFilter(v === '__all__' ? '' : v)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Semua Kondisi</SelectItem>
                      {CONDITION_TYPES.map((ct) => (
                        <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* NPS Min */}
                  <Input
                    type="number"
                    placeholder="NPS Min (0-10)"
                    min={0}
                    max={10}
                    value={npsMin}
                    onChange={(e) => setNpsMin(e.target.value)}
                    className="text-sm"
                  />
                  {/* NPS Max */}
                  <Input
                    type="number"
                    placeholder="NPS Max (0-10)"
                    min={0}
                    max={10}
                    value={npsMax}
                    onChange={(e) => setNpsMax(e.target.value)}
                    className="text-sm"
                  />
                  {/* Export Buttons */}
                  <div className="flex gap-2">
                    <a href={getExportUrl('excel')} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-sm border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                        <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
                      </Button>
                    </a>
                    <a href={getExportUrl('pdf')} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-sm border-blue-300 text-blue-700 hover:bg-blue-50">
                        <FileText className="w-4 h-4 mr-1" /> PDF
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-500" /> Data Survei Individual
                  </CardTitle>
                  {surveysData && (
                    <span className="text-xs text-gray-500">{surveysData.total} total hasil</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {surveysLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Memuat data...</span>
                  </div>
                ) : !surveysData || surveysData.surveys.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Tidak ada data survei ditemukan</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto max-h-125 overflow-y-auto">
                      <Accordion type="single" collapsible className="w-full">
                        {surveysData.surveys.map((s, i) => {
                          const no = (surveyPage - 1) * surveysData.pageSize + i + 1
                          const painBefore = s.pain_level_before
                          const painAfter = s.pain_level_after
                          const overallServ = s.tangibles && s.reliability && s.responsiveness && s.assurance && s.empathy
                            ? ((s.tangibles + s.reliability + s.responsiveness + s.assurance + s.empathy) / 5).toFixed(1)
                            : '-'
                          const isPromoter = s.nps_score !== null && s.nps_score >= 9
                          const isDetractor = s.nps_score !== null && s.nps_score <= 6

                          return (
                            <AccordionItem key={s.id} value={s.id}>
                              <AccordionTrigger className="hover:bg-gray-50 px-3 rounded-lg">
                                <div className="grid grid-cols-8 gap-2 w-full text-left text-xs sm:text-sm items-center">
                                  <span className="font-medium text-gray-500 w-8">{no}</span>
                                  <span className="text-gray-700 truncate">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                                  <span className="text-gray-700 truncate">{s.age_range || '-'}</span>
                                  <span className="text-gray-700">{s.gender === 'L' ? 'L' : s.gender === 'P' ? 'P' : '-'}</span>
                                  <span className="text-gray-700 truncate max-w-30">{s.condition_type || '-'}</span>
                                  <Badge variant="outline" className={cn('text-xs justify-center', isPromoter ? 'border-emerald-300 text-emerald-700' : isDetractor ? 'border-red-300 text-red-700' : 'border-gray-300 text-gray-600')}>
                                    {s.nps_score ?? '-'}
                                  </Badge>
                                  <span className="text-gray-600 text-xs">{painBefore !== null ? `${painBefore}→${painAfter ?? '-'}` : '-'}</span>
                                  <span className={cn('font-semibold text-xs', parseFloat(overallServ as string) >= 4 ? 'text-emerald-600' : parseFloat(overallServ as string) >= 3 ? 'text-amber-600' : 'text-red-600')}>
                                    {overallServ}/5
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="bg-gray-50 rounded-lg p-4 mx-3 mb-2 space-y-3 text-sm">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                      <span className="text-xs text-gray-500 block">Pendidikan</span>
                                      <span className="font-medium">{s.education || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Pekerjaan</span>
                                      <span className="font-medium">{s.occupation || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Jenis Pasien</span>
                                      <span className="font-medium">{s.patient_type || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Kunjungan</span>
                                      <span className="font-medium">{s.visit_count || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Herbal</span>
                                      <span className="font-medium">{s.herbal_prescribed ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Perubahan Kondisi</span>
                                      <span className="font-medium">{s.condition_change || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Rencana Kunjungan</span>
                                      <span className="font-medium">{s.visit_plan || '-'}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500 block">Sudah Rekomendasi</span>
                                      <span className="font-medium">{s.has_recommended || '-'}</span>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div>
                                    <span className="text-xs text-gray-500 block mb-1">SERVQUAL</span>
                                    <div className="grid grid-cols-5 gap-2 text-xs">
                                      <div className="text-center"><span className="block text-gray-500">Tan.</span><span className="font-bold">{s.tangibles ?? '-'}</span></div>
                                      <div className="text-center"><span className="block text-gray-500">Rel.</span><span className="font-bold">{s.reliability ?? '-'}</span></div>
                                      <div className="text-center"><span className="block text-gray-500">Resp.</span><span className="font-bold">{s.responsiveness ?? '-'}</span></div>
                                      <div className="text-center"><span className="block text-gray-500">Ass.</span><span className="font-bold">{s.assurance ?? '-'}</span></div>
                                      <div className="text-center"><span className="block text-gray-500">Emp.</span><span className="font-bold">{s.empathy ?? '-'}</span></div>
                                    </div>
                                  </div>
                                  {(s.best_experience || s.improvement_suggestion || s.testimonial) && (
                                    <>
                                      <Separator />
                                      <div className="space-y-2">
                                        {s.best_experience && (
                                          <div><span className="text-xs text-emerald-600 font-semibold">Pengalaman Terbaik:</span><p className="text-gray-700 mt-0.5">{s.best_experience}</p></div>
                                        )}
                                        {s.improvement_suggestion && (
                                          <div><span className="text-xs text-amber-600 font-semibold">Saran Perbaikan:</span><p className="text-gray-700 mt-0.5">{s.improvement_suggestion}</p></div>
                                        )}
                                        {s.testimonial && (
                                          <div><span className="text-xs text-blue-600 font-semibold">Testimoni:</span><p className="text-gray-700 mt-0.5 italic">&ldquo;{s.testimonial}&rdquo;</p></div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    </div>

                    {/* Pagination */}
                    {surveysData.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xs text-gray-500">
                          Halaman {surveyPage} dari {surveysData.totalPages} ({surveysData.total} total)
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={surveyPage <= 1}
                            onClick={() => fetchSurveys(surveyPage - 1)}
                            className="text-xs"
                          >
                            <ChevronLeft className="w-4 h-4" /> Sebelumnya
                          </Button>
                          <span className="text-sm font-medium px-3">{surveyPage}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={surveyPage >= surveysData.totalPages}
                            onClick={() => fetchSurveys(surveyPage + 1)}
                            className="text-xs"
                          >
                            Berikutnya <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}