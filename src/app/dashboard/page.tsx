'use client'

import { useState, useEffect } from 'react'
import {
  Users, TrendingDown, Star, Heart, Activity, MessageCircle,
  BarChart3, Download, RefreshCw, Shield, AlertTriangle, Building2, CheckCircle2,
  Bell
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts'
import { cn } from '@/lib/utils'
import { KPICard } from '@/components/dashboard/KPICard'
import type { DashboardData } from '@/lib/types'

const NPS_COLORS = ['#059669', '#d97706', '#dc2626']

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState('30')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
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
  }

  useEffect(() => { fetchData() }, [period])

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

  const sortedUnits = [...data.unitPerformance].sort((a, b) => b.avgSatisfaction - a.avgSatisfaction)
  const topUnit = sortedUnits[0]
  const worstServqual = Math.min(data.servqual.tangibles, data.servqual.reliability, data.servqual.responsiveness, data.servqual.assurance, data.servqual.empathy)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800">DPEMS Dashboard</h1>
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
            <Button variant="outline" size="sm" asChild>
              <a href="/qr-codes"><Download className="w-4 h-4 mr-1" /> QR</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 space-y-6">
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
            <TabsTrigger value="units" className="text-xs sm:text-sm py-2">Unit</TabsTrigger>
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
                  <div className="h-[280px]">
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
                    <div className="h-[280px] w-[280px]">
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
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
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
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
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
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
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
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sortedUnits.sort((a, b) => b.avgPainReduction - a.avgPainReduction)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="unitName" width={160} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: any) => [`${v ?? 0}%`, 'Pengurangan Nyeri']} />
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
                  <div className="h-[300px]">
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
                  <div className="h-[320px]">
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
                          {fb.suggestions && (
                            <div className="flex items-start gap-2">
                              <span className="text-blue-500 text-xs shrink-0 mt-0.5">Saran:</span>
                              <p className="text-sm text-gray-600">{fb.suggestions}</p>
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

          {/* UNITS */}
          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-500" /> Perbandingan Kinerja Unit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Unit</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">Responden</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">Kepuasan</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">↓ Nyeri</th>
                        <th className="text-center py-3 px-4 font-bold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUnits.map((unit, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{unit.unitName}</td>
                          <td className="py-3 px-4 text-center">{unit.surveyCount}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={cn('font-bold', unit.avgSatisfaction >= 4.2 ? 'text-emerald-600' : unit.avgSatisfaction >= 3.5 ? 'text-amber-600' : 'text-red-600')}>
                              {unit.avgSatisfaction.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center"><span className="font-bold text-emerald-600">{unit.avgPainReduction}%</span></td>
                          <td className="py-3 px-4 text-center">
                            {unit.avgSatisfaction >= 4.2 ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</Badge>
                            ) : unit.avgSatisfaction >= 3.5 ? (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Good</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-red-200">Needs Improvement</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}