'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, QrCode, Building2, Printer, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Unit {
  id: string
  hospital_id: string
  code: string
  name: string
  description: string | null
  qr_code: string
  unit_type: string | null
  is_active: boolean
  sort_order: number
}

export default function QRCodesPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/units')
      .then((r) => r.json())
      .then(setUnits)
      .catch(console.error)
  }, [])

  const getSurveyUrl = (qrCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/survey/${qrCode}`
    }
    return `/survey/${qrCode}`
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>DPEMS QR Codes - RSU Ja'far Medika</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; max-width: 800px; margin: 0 auto; }
            .qr-card { text-align: center; padding: 20px; border: 2px solid #059669; border-radius: 12px; page-break-inside: avoid; }
            .qr-title { font-size: 16px; font-weight: bold; color: #065f46; margin-top: 10px; }
            .qr-desc { font-size: 12px; color: #666; margin-top: 5px; }
            .qr-footer { text-align: center; margin-top: 20px; font-size: 11px; color: #999; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div style="text-align:center; margin-bottom:20px;">
            <h1 style="color:#059669; margin:0;">RSU Ja'far Medika</h1>
            <p style="color:#666; font-size:14px;">DPEMS - Digital Patient Experience Monitoring System</p>
            <p style="color:#999; font-size:12px;">Scan QR Code untuk mengisi survei pengalaman pasien</p>
          </div>
          <div class="qr-grid">
            ${units.map((u) => `
              <div class="qr-card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="width:200px;height:200px;margin:0 auto;">
                  <rect width="256" height="256" fill="white" rx="8"/>
                  <foreignObject width="240" height="240" x="8" y="8">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="width:240px;height:240px;display:flex;align-items:center;justify-content:center;">
                      <div id="qr-${u.code}"></div>
                    </div>
                  </foreignObject>
                </svg>
                <div class="qr-title">${u.name}</div>
                <div class="qr-desc">${u.description || ''}</div>
              </div>
            `).join('')}
          </div>
          <div class="qr-footer">
            <p>Mojogedang, Karanganyar - Dibuat dengan DPEMS v1.0</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800">QR Code Generator</h1>
            <p className="text-xs text-gray-500">RSU Ja&apos;far Medika Karanganyar</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard">
              ← Dashboard
            </a>
          </Button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
            <QrCode className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">QR Code Survei Pasien</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Cetak QR Code untuk setiap unit layanan. Pasien cukup scan untuk mengisi survei pengalaman mereka.
          </p>
        </div>

        {/* Unit Selection */}
        <div className="flex flex-wrap justify-center gap-2">
          {units.map((unit) => (
            <Button
              key={unit.id}
              variant={selectedUnit === unit.qr_code ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedUnit(selectedUnit === unit.qr_code ? null : unit.qr_code)}
              className={cn(
                'transition-all',
                selectedUnit === unit.qr_code && 'bg-emerald-600 hover:bg-emerald-700'
              )}
            >
              <Building2 className="w-4 h-4 mr-1" />
              {unit.name}
            </Button>
          ))}
        </div>

        {/* QR Cards */}
        <div ref={printRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedUnit ? units.filter((u) => u.code === selectedUnit) : units).map((unit, i) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-2 border-emerald-200 hover:border-emerald-400 transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  {/* QR Code */}
                  <div className="bg-white rounded-xl p-4 inline-block shadow-sm">
                    <QRCodeSVG
                      value={getSurveyUrl(unit.qr_code)}
                      size={200}
                      level="M"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#065f46"
                    />
                  </div>

                  {/* Unit Info */}
                  <div>
                    <h3 className="text-lg font-bold text-emerald-800">{unit.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                  </div>

                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {getSurveyUrl(unit.qr_code)}
                  </Badge>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Scan untuk mulai survei</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Print Button */}
        <div className="text-center">
          <Button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-base px-8 py-5"
            size="lg"
          >
            <Printer className="w-5 h-5 mr-2" />
            Cetak Semua QR Code
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            QR Code akan dicetak dalam format 2 kolom (A4)
          </p>
        </div>

        {/* Instructions */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-emerald-800 mb-3">Petunjuk Penggunaan:</h3>
            <ol className="space-y-2 text-sm text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                Cetak QR Code untuk setiap unit layanan (Poli Akupuntur, Poli Herbal, dll.)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                Tempelkan QR Code di ruang tunggu atau meja resepsionis masing-masing unit
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                Minta pasien untuk scan QR Code menggunakan kamera HP setelah selesai terapi
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                Data survei akan otomatis masuk ke Dashboard DPEMS secara real-time
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}