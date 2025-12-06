import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    // Generate alphanumeric nonce
    const nonce = crypto.randomUUID().replace(/-/g, '')

    // Store nonce in cookie for verification
    const cookieStore = await cookies()
    cookieStore.set('siwe', nonce, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 5 // 5 minutes
    })

    return NextResponse.json({ nonce })
}
