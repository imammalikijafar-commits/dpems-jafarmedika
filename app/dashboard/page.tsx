// app/dashboard/page.tsx
// Executive Dashboard Overview - Fixed Version
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import KPICard from '@/components/dashboard/KPICard';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users, 
  Smile, 
  Activity,
  AlertTriangle,
  Star,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Types
interface DashboardData {
  kpis: {
    totalResponses: number;
    overallSatisfaction: number;
    npsScore: number;
    promoters: number;
    passives: number;
    detractors: number;
    avgPainReduction: number;
    responseRate: number;
  };
  servqual: {
    tangibles: number;
    reliability: number;
    responsiveness: number;
    assurance: number;
    empathy: number;
  };
  unitBreakdown: Array<{
    id: string;
    name: string;
    unitType: string;
    count: number;
    dimensions: Record<string, number>;
    avgOverall: number;
    nps: number;
    painReduction: number;
  }>;
  trends: Array<{
    date: string;
    total_responses: number;
    avg_overall: number | null;
  }>;
  recentFeedback: Array<{
    complaints?: string | null;
    suggestions?: string | null;
    testimonial?: string | null;
    submitted_at: string;
    treatment_type: string;
    nps_score: number;
  }>;
  demographics: {
    ageRanges: Record<string, number>;
    genders: Record<string, number>;
    patientTypes: Record<string, number>;
    treatmentTypes: Record<string, number>;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/dashboard/data?period=${selectedPeriod}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <RefreshCw className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
            <p className="text-gray-600 font-medium">Memuat data analitik...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600">Pastikan Supabase terhubung dan ada data survey.</p>
          </div>
        </main>
      </div>
    );
  }

  // Prepare chart data
  const servqualRadarData = [
    { subject: 'Fasilitas Fisik', value: data.servqual.tangibles, fullMark: 5 },
    { subject: 'Keandalan', value: data.servqual.reliability, fullMark: 5 },
    { subject: 'Kecepatan Tanggap', value: data.servqual.responsiveness, fullMark: 5 },
    { subject: 'Kompetensi', value: data.servqual.assurance, fullMark: 5 },
    { subject: 'Empati', value: data.servqual.empathy, fullMark: 5 },
  ];

  const trendChartData = (data.trends || []).map(t => ({
    date: new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    skor: t.avg_overall ?? 0,
    responses: t.total_responses
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Analitik</h1>
              <p className="text-sm text-gray-500 mt-1">
                RS Studi Kasus • Periode: {selectedPeriod === '30d' ? '30 Hari Terakhir' : selectedPeriod === '7d' ? '7 Hari Terakhir' : '90 Hari Terakhir'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="7d">7 Hari</option>
                <option value="30d">30 Hari</option>
                <option value="90d">90 Hari</option>
              </select>

              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Export PDF
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Responden"
              value={data.kpis.totalResponses.toString()}
              subtitle={`${data.kpis.responseRate}% response rate`}
              icon={<Users className="w-6 h-6" />}
              trend={12.5}
              color="blue"
            />
            
            <KPICard
              title="Kepuasan Overall"
              value={data.kpis.overallSatisfaction.toFixed(1)}
              subtitle="/ 5.0 skala"
              icon={<Smile className="w-6 h-6" />}
              trend={5.2}
              color="green"
            />
            
            <KPICard
              title="NPS Score"
              value={`+${data.kpis.npsScore}`}
              subtitle={`Promoters ${data.kpis.promoters} • Detractors ${data.kpis.detractors}`}
              icon={<Star className="w-6 h-6" />}
              trend={8.3}
              color="purple"
            />
            
            <KPICard
              title="Penurunan Nyeri"
              value={`${data.kpis.avgPainReduction}%`}
              subtitle="Rata-rata VAS reduction"
              icon={<Activity className="w-6 h-6" />}
              trend={15.0}
              color="orange"
            />
          </div>

          {/* Charts Row 1: SERVQUAL Radar + Trend Line */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SERVQUAL Radar Chart */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Profil Kepuasan (SERVQUAL)</CardTitle>
                <p className="text-sm text-gray-500 mt-1">5 Dimensi Pelayanan</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={servqualRadarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#9ca3af' }} />
                      <Radar
                        name="Skor Aktual"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Dimension Details */}
                <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                  {Object.entries(data.servqual).map(([key, val]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-900">{val.toFixed(1)}</div>
                      <div className="text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trend Chart */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Trend Kepuasan Harian</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Pergerakan skor over time</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        formatter={(value: unknown) => [Number(value).toFixed(2), 'Skor']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="skor" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Unit Performance Matrix + NPS Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unit Performance Table */}
            <Card padding="lg" className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performa per Unit Layanan</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Perbandingan dimensi kepuasan</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Unit</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Responden</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Overall</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">NPS</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Pain ↓</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.unitBreakdown || []).map((unit) => (
                        <tr key={unit.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-900">
                            {unit.name}
                            <span className="block text-xs text-gray-500 capitalize">{unit.unitType.replace('_', ' ')}</span>
                          </td>
                          <td className="text-center py-3 px-2 text-gray-600">{unit.count}</td>
                          <td className="text-center py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                              unit.avgOverall >= 4.5 ? 'bg-green-100 text-green-800' :
                              unit.avgOverall >= 4.0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {unit.avgOverall.toFixed(1)}
                            </span>
                          </td>
                          <td className="text-center py-3 px-2 font-semibold text-gray-900">
                            {unit.nps > 0 ? '+' : ''}{unit.nps}
                          </td>
                          <td className="text-center py-3 px-2 text-green-600 font-medium">
                            {unit.painReduction > 0 ? `${unit.painReduction}%` : '-'}
                          </td>
                          <td className="py-3 px-2">
                            {unit.avgOverall >= 4.5 ? (
                              <span className="inline-flex items-center text-green-600 text-xs font-medium">
                                <TrendingUp className="w-3 h-3 mr-1" /> Excellent
                              </span>
                            ) : unit.avgOverall >= 4.0 ? (
                              <span className="inline-flex items-center text-yellow-600 text-xs font-medium">
                                <Minus className="w-3 h-3 mr-1" /> Good
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600 text-xs font-medium">
                                <AlertTriangle className="w-3 h-3 mr-1" /> Needs Work
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
                    Lihat Detail Semua Unit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* NPS Pie Chart */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Distribusi NPS</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Promoter vs Detractor</p>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Promoters', value: data.kpis.promoters },
                          { name: 'Passives', value: data.kpis.passives },
                          { name: 'Detractors', value: data.kpis.detractors },
                        ]}
                        cx="50%"
                        cy="45%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Promoters (9-10)</span>
                    </div>
                    <span className="font-semibold">{data.kpis.promoters}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Passives (7-8)</span>
                    </div>
                    <span className="font-semibold">{data.kpis.passives}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Detractors (0-6)</span>
                    </div>
                    <span className="font-semibold">{data.kpis.detractors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Recent Feedback + Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Complaints/Suggestions */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Feedback Terbaru</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Keluhan dan saran dari pasien</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(data.recentFeedback || []).slice(0, 5).map((feedback, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {feedback.treatment_type}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          (feedback.nps_score || 0) >= 9 ? 'bg-green-100 text-green-700' :
                          (feedback.nps_score || 0) <= 6 ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          NPS: {feedback.nps_score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {feedback.complaints || feedback.suggestions || feedback.testimonial || '(No feedback text)'}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(feedback.submitted_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                  
                  {(!data.recentFeedback || data.recentFeedback.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada feedback dalam periode ini
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Demographics */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Demografi Responden</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Profil pasien yang respond</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Range Usia</h4>
                    <div className="space-y-2">
                      {Object.entries(data.demographics.ageRanges).map(([range, count]) => (
                        <div key={range} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-24">{range.replace('>', '> ').replace('<', '< ')}</span>
                          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(count / Object.values(data.demographics.ageRanges).reduce((a,b) => a+b, 0)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patient Type */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Jenis Pembayaran</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(data.demographics.patientTypes).map(([type, count]) => (
                        <div key={type} className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{count}</div>
                          <div className="text-xs text-gray-500 truncate">{type}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Type */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Jenis Pengobatan</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(data.demographics.treatmentTypes).map(([type, count]) => (
                        <span key={type} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          {type}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Banner */}
          {data.kpis.npsScore < 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-800">Perhatian: NPS Negatif Terdeteksi</h3>
                <p className="text-sm text-red-700 mt-1">
                  Jumlah detractors ({data.kpis.detractors}) melebihi promoters ({data.kpis.promoters}). Segera tinjau feedback negatif.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}