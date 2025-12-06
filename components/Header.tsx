'use client'

import { useAccount, useConnect } from 'wagmi'
import { FiSearch, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { UserWalletPanel } from './UserWalletPanel'
import { ThemeToggle } from './ThemeToggle'
import { Spotlight, Magnetic } from './Spotlight'
import { useMiniKit, WorldAppBadge } from './MiniKitDetector'

export function Header() {
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { isWorldApp } = useMiniKit()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

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

    const handleConnect = () => {
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0]
        if (injectedConnector) {
            connect({ connector: injectedConnector })
        }
    }

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

                {/* Center: Search (Desktop) - Hide in Mini App for cleaner UI */}
                {!isWorldApp && (
                    <div className="hidden md:flex flex-1 max-w-sm mx-8">
                        <Spotlight className="relative w-full rounded-full" color="rgba(76, 130, 251, 0.2)">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-[#98a1c0] group-focus-within:text-blue-500 transition-colors z-10">
                                <FiSearch size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tokens..."
                                className="w-full bg-gray-100/50 dark:bg-[#131a2a]/50 border border-transparent hover:border-gray-200 dark:hover:border-[#293249] focus:bg-white dark:focus:bg-[#0d111c] rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#98a1c0] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all relative z-10"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">/</span>
                            </div>
                        </Spotlight>
                    </div>
                )}

                {/* Right: Wallet & Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Hide theme toggle in World App (uses system theme) */}
                    {!isWorldApp && <ThemeToggle />}

                    {/* Network Indicator */}
                    <div className="hidden sm:flex items-center gap-2 bg-gray-100/50 dark:bg-[#131a2a]/50 px-3 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">World Chain</span>
                    </div>

                    {isConnected ? (
                        <UserWalletPanel />
                    ) : (
                        <Magnetic strength={0.2}>
                            <button
                                onClick={handleConnect}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                            >
                                {isWorldApp ? 'Connect' : 'Connect Wallet'}
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
