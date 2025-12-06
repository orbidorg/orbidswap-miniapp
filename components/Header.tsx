'use client'

import { useAccount, useConnect } from 'wagmi'
import { FiMenu, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { UserWalletPanel } from './UserWalletPanel'
import { ThemeToggle } from './ThemeToggle'
import { Spotlight, Magnetic } from './Spotlight'
import { useMiniKit, WorldAppBadge } from './MiniKitDetector'
import { MiniKit } from '@worldcoin/minikit-js'

export function Header() {
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { isWorldApp } = useMiniKit()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [worldWalletAddress, setWorldWalletAddress] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Swap', href: '/swap' },
        { name: 'Explore', href: '/explore' },
        { name: 'Pool', href: '/pool' },
    ]

    // MiniKit wallet auth for World App
    const handleWorldAppConnect = async () => {
        if (!MiniKit.isInstalled()) {
            console.log('MiniKit not installed')
            return
        }

        setIsConnecting(true)

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
                setIsConnecting(false)
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
                setWorldWalletAddress(result.address)
                console.log('Connected:', result.address)
            }
        } catch (error) {
            console.error('Wallet auth error:', error)
        }

        setIsConnecting(false)
    }

    // Regular wagmi connect for external browsers
    const handleRegularConnect = () => {
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0]
        if (injectedConnector) {
            connect({ connector: injectedConnector })
        }
    }

    const handleConnect = () => {
        if (isWorldApp) {
            handleWorldAppConnect()
        } else {
            handleRegularConnect()
        }
    }

    const isWalletConnected = isConnected || worldWalletAddress

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-gray-200/50 dark:border-[#293249]/50 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left: Logo & Nav */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            O
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">OrbIdSwap</span>
                    </Link>

                    {/* World App Badge */}
                    <WorldAppBadge />

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-[#131a2a]/50 p-1 rounded-full border border-gray-200/50 dark:border-[#293249]/50 backdrop-blur-sm ml-4">
                        {navLinks.map((link) => (
                            <Spotlight key={link.name} className="rounded-full" color="rgba(76, 130, 251, 0.25)">
                                <Link
                                    href={link.href}
                                    className="block px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#293249]/50 rounded-full transition-all relative z-10"
                                >
                                    {link.name}
                                </Link>
                            </Spotlight>
                        ))}
                    </nav>
                </div>

                {/* Right: Wallet & Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Hide theme toggle in World App */}
                    {!isWorldApp && <ThemeToggle />}

                    {/* Network Indicator */}
                    <div className="hidden sm:flex items-center gap-2 bg-gray-100/50 dark:bg-[#131a2a]/50 px-3 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">World Chain</span>
                    </div>

                    {isWalletConnected ? (
                        worldWalletAddress ? (
                            // World App wallet display
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#131a2a] px-3 py-2 rounded-full">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500" />
                                <span className="text-sm font-medium">
                                    {worldWalletAddress.slice(0, 6)}...{worldWalletAddress.slice(-4)}
                                </span>
                            </div>
                        ) : (
                            <UserWalletPanel />
                        )
                    ) : (
                        <Magnetic strength={0.2}>
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                            >
                                {isConnecting ? 'Connecting...' : (isWorldApp ? 'Connect' : 'Connect Wallet')}
                            </button>
                        </Magnetic>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#293249] rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0d111c] border-b border-gray-200 dark:border-[#293249] p-4 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white font-medium py-3 px-4 hover:bg-gray-50 dark:hover:bg-[#131a2a] rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
