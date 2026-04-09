import { NextRequest, NextResponse } from 'next/server'
import { createSurvey } from '@/lib/db'
import { fullSurveySchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod
    const result = fullSurveySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validasi gagal',
          details: result.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    // Auto-detect device type
    const userAgent = request.headers.get('user-agent') || ''
    const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop'

    // Build insert payload with device_type
    const payload = {
      ...body,
      device_type: body.device_type || deviceType,
    }

    const survey = await createSurvey(payload)
    return NextResponse.json(survey, { status: 201 })
  } catch (error) {
    console.error('Error creating survey:', error)
    return NextResponse.json({ error: 'Gagal menyimpan survei' }, { status: 500 })
  }
}