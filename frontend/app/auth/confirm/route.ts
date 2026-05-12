import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')

  const typeParam = searchParams.get('type')
  const allowedTypes: EmailOtpType[] = [
    'email',
    'recovery',
    'magiclink',
    'invite',
  ]
  const type = allowedTypes.includes(typeParam as EmailOtpType)
    ? (typeParam as EmailOtpType)
    : null

  const nextParam = searchParams.get('next')
  const next = nextParam?.startsWith('/') ? nextParam : '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      redirect(next)
    }
  }

  redirect('/')
}