'use client'

import Link from 'next/link'
import { FiGithub, FiTwitter, FiBook, FiMessageCircle } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import { Spotlight, Magnetic } from './Spotlight'

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#0d111c] border-t border-gray-200 dark:border-[#293249] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
                {/* Brand Column */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            O
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">OrbIdSwap</span>
                    </div>
                    <p className="text-gray-500 dark:text-[#98a1c0] text-sm leading-relaxed max-w-sm">
                        The native liquidity layer for World Chain. <br />
                        Empowering the next generation of human-centric DeFi.
                    </p>
                    <div className="flex gap-3">
                        <Magnetic strength={0.3}>
                            <Spotlight className="rounded-full" color="rgba(29, 161, 242, 0.3)">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#131a2a] flex items-center justify-center text-gray-500 dark:text-[#98a1c0] hover:bg-[#1DA1F2] hover:text-white transition-all relative z-10">
                                    <FiTwitter size={18} />
                                </a>
                            </Spotlight>
                        </Magnetic>
                        <Magnetic strength={0.3}>
                            <Spotlight className="rounded-full" color="rgba(255, 255, 255, 0.2)">
                                <a href="https://github.com/orbidorg/orbidswap" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#131a2a] flex items-center justify-center text-gray-500 dark:text-[#98a1c0] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all relative z-10">
                                    <FiGithub size={18} />
                                </a>
                            </Spotlight>
                        </Magnetic>
                        <Magnetic strength={0.3}>
                            <Spotlight className="rounded-full" color="rgba(88, 101, 242, 0.3)">
                                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#131a2a] flex items-center justify-center text-gray-500 dark:text-[#98a1c0] hover:bg-[#5865F2] hover:text-white transition-all relative z-10">
                                    <FaDiscord size={18} />
                                </a>
                            </Spotlight>
                        </Magnetic>
                    </div>
                </div>

                {/* Links Columns */}
                <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Protocol</h3>
                    <ul className="flex flex-col gap-4 text-gray-500 dark:text-[#98a1c0] text-sm">
                        <li><Link href="/swap" className="hover:text-blue-500 transition-colors">Swap</Link></li>
                        <li><Link href="/pool" className="hover:text-blue-500 transition-colors">Pools</Link></li>
                        <li><Link href="/explore" className="hover:text-blue-500 transition-colors">Explore</Link></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Analytics</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Developers</h3>
                    <ul className="flex flex-col gap-4 text-gray-500 dark:text-[#98a1c0] text-sm">
                        <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2">Documentation <FiBook size={14} /></a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Github</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Audit</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Bug Bounty</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Support</h3>
                    <ul className="flex flex-col gap-4 text-gray-500 dark:text-[#98a1c0] text-sm">
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2">Community <FiMessageCircle size={14} /></a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-[#293249] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 dark:text-[#5d6785] text-xs">© 2025 OrbIdSwap Protocol. All rights reserved.</p>
                <div className="flex items-center gap-2 text-gray-400 dark:text-[#5d6785] text-xs font-mono">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Operational on World Chain Sepolia
                </div>
            </div>
        </footer>
    )
}
