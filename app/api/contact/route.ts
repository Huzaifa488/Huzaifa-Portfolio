import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  message: z.string().min(20).max(2000),
})

// Basic rate-limit — track IPs in memory (resets on cold-start)
// For production, use an edge KV store (e.g. Upstash Redis).
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT    = 3   // max requests
const WINDOW_MS     = 60  * 60 * 1000  // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count += 1
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Extract IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message ?? 'Invalid input.' },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    // Insert into Supabase (RLS: public insert allowed on messages table)
    const supabase = await createClient()
    const { error } = await supabase
      .from('messages')
      .insert({ name, email, message })

    if (error) {
      console.error('[contact API]', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to save your message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
