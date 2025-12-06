import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface SiweRequest {
    payload: MiniAppWalletAuthSuccessPayload
    nonce: string
}

export async function POST(req: NextRequest) {
    const { payload, nonce } = (await req.json()) as SiweRequest

    // Get stored nonce from cookie
    const cookieStore = await cookies()
    const storedNonce = cookieStore.get('siwe')?.value

    if (!storedNonce || storedNonce !== nonce) {
        return NextResponse.json({
            success: false,
            error: 'Invalid nonce'
        }, { status: 400 })
    }

    try {
        const validMessage = await verifySiweMessage(payload, nonce)

        if (validMessage.isValid) {
            // Clear the nonce cookie
            cookieStore.delete('siwe')

            return NextResponse.json({
                success: true,
                address: payload.address,
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Invalid signature'
            }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Verification failed'
        }, { status: 500 })
    }
}
