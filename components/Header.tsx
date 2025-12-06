'use client'

import { useAccount, useConnect } from 'wagmi'
import { FiMenu, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { UserWalletPanel } from './UserWalletPanel'
import { ThemeToggle } from './ThemeToggle'
import { Magnetic } from './Spotlight'
import { useMiniKit, WorldAppBadge } from './MiniKitDetector'

export function Header() {
    const { isConnected: wagmiConnected } = useAccount()
    const { connect: wagmiConnect, connectors } = useConnect()
    const { isWorldApp, isConnected: minikitConnected, connect: minikitConnect } = useMiniKit()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
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
        { name: 'Limit', href: '/limit' },
        { name: 'Explore', href: '/explore' },
        { name: 'Pool', href: '/pool' },
    ]

    const handleConnect = async () => {
        setIsConnecting(true)

        if (isWorldApp) {
            await minikitConnect()
        } else {
            const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0]
            if (injectedConnector) {
                wagmiConnect({ connector: injectedConnector })
            }
        }

        setIsConnecting(false)
    }

    const isWalletConnected = wagmiConnected || minikitConnected

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-gray-200/50 dark:border-[#293249]/50 py-2 sm:py-3' : 'bg-transparent py-3 sm:py-5'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <img src="/logo.svg" alt="OrbIdSwap" className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform" />
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">OrbIdSwap</span>
                    </Link>

                    {/* Desktop Nav - includes World App badge */}
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-[#131a2a]/50 p-1 rounded-full border border-gray-200/50 dark:border-[#293249]/50 backdrop-blur-sm">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-3 lg:px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#293249]/50 rounded-full transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {/* World App Badge inside nav */}
                        <WorldAppBadge />
                    </nav>
                </div>

                {/* Right: Wallet & Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme toggle - hide on very small screens */}
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {/* Network Indicator - hide on mobile */}
                    <div className="hidden lg:flex items-center gap-2 bg-gray-100/50 dark:bg-[#131a2a]/50 px-3 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">World Chain</span>
                    </div>

                    {isWalletConnected ? (
                        <UserWalletPanel />
                    ) : (
                        <Magnetic strength={0.2}>
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                            >
                                {isConnecting ? '...' : 'Connect'}
                            </button>
                        </Magnetic>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#293249] rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0d111c] border-b border-gray-200 dark:border-[#293249] p-4 md:hidden flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-2">
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
                    {/* World App Badge in mobile menu */}
                    <div className="px-4 py-2">
                        <WorldAppBadge />
                    </div>
                    {/* Theme toggle in mobile menu */}
                    <div className="px-4 py-2 flex items-center justify-between">
                        <span className="text-gray-500 dark:text-[#98a1c0]">Theme</span>
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </header>
    )
}
