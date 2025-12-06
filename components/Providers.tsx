'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import { MiniKitDetector } from './MiniKitDetector'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <MiniKitDetector>
                        {mounted && children}
                    </MiniKitDetector>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
