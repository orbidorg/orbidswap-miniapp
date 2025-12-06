'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { createContext, useContext, useEffect, useState } from 'react'

interface MiniKitContextType {
    isInstalled: boolean
    isWorldApp: boolean
    walletAddress: string | null
}

const MiniKitContext = createContext<MiniKitContextType>({
    isInstalled: false,
    isWorldApp: false,
    walletAddress: null,
})

export function useMiniKit() {
    return useContext(MiniKitContext)
}

export function MiniKitDetector({ children }: { children: React.ReactNode }) {
    const [isInstalled, setIsInstalled] = useState(false)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    useEffect(() => {
        // Check immediately
        const checkMiniKit = () => {
            try {
                const installed = MiniKit.isInstalled()
                console.log('🔍 MiniKit.isInstalled():', installed)
                console.log('🔍 window.MiniKit:', typeof window !== 'undefined' ? (window as any).MiniKit : 'undefined')

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

        // Check immediately
        const immediate = checkMiniKit()

        // Also check after a short delay (MiniKit might inject late)
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

    return (
        <MiniKitContext.Provider value={{
            isInstalled,
            isWorldApp: isInstalled,
            walletAddress,
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
