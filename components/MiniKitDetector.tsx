'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface MiniKitContextType {
    isInstalled: boolean
    isWorldApp: boolean
    walletAddress: string | null
    isConnected: boolean
    connect: () => Promise<void>
    disconnect: () => void
}

const MiniKitContext = createContext<MiniKitContextType>({
    isInstalled: false,
    isWorldApp: false,
    walletAddress: null,
    isConnected: false,
    connect: async () => { },
    disconnect: () => { },
})

export function useMiniKit() {
    return useContext(MiniKitContext)
}

export function MiniKitDetector({ children }: { children: React.ReactNode }) {
    const [isInstalled, setIsInstalled] = useState(false)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    useEffect(() => {
        const checkMiniKit = () => {
            try {
                const installed = MiniKit.isInstalled()
                console.log('🔍 MiniKit.isInstalled():', installed)

                if (installed) {
                    console.log('🌍 Running inside World App!')
                    setIsInstalled(true)
                } else {
                    console.log('🌐 Running in external browser')
                }
                return installed
            } catch (e) {
                console.log('❌ MiniKit check error:', e)
                return false
            }
        }

        const immediate = checkMiniKit()

        if (!immediate) {
            const timeout = setTimeout(() => {
                const delayed = checkMiniKit()
                if (delayed) {
                    setIsInstalled(true)
                }
            }, 500)

            return () => clearTimeout(timeout)
        }
    }, [])

    const connect = useCallback(async () => {
        if (!MiniKit.isInstalled()) {
            console.log('MiniKit not installed, cannot connect')
            return
        }

        try {
            // Get nonce from backend
            const nonceRes = await fetch('/api/nonce')
            const { nonce } = await nonceRes.json()

            // Request wallet auth from World App
            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce,
                expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                statement: 'Sign in to OrbIdSwap',
            })

            if (finalPayload.status === 'error') {
                console.log('Wallet auth cancelled')
                return
            }

            // Verify on backend
            const verifyRes = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: finalPayload, nonce }),
            })

            const result = await verifyRes.json()

            if (result.success) {
                setWalletAddress(result.address)
                console.log('✅ Connected:', result.address)
            }
        } catch (error) {
            console.error('Wallet auth error:', error)
        }
    }, [])

    const disconnect = useCallback(() => {
        setWalletAddress(null)
    }, [])

    return (
        <MiniKitContext.Provider value={{
            isInstalled,
            isWorldApp: isInstalled,
            walletAddress,
            isConnected: !!walletAddress,
            connect,
            disconnect,
        }}>
            {children}
        </MiniKitContext.Provider>
    )
}

// Badge component to show if user is in World App
export function WorldAppBadge() {
    const { isWorldApp } = useMiniKit()

    if (!isWorldApp) return null

    return (
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            World App
        </div>
    )
}
