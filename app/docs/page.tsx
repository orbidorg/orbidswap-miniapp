'use client'

import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import { FiBook, FiCode, FiShield, FiExternalLink } from 'react-icons/fi'

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans bg-noise">
            <Header />

            <main className="pt-24 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-2">Documentation</h1>
                    <p className="text-gray-500 dark:text-[#98a1c0] text-sm mb-8">
                        Technical details for OrbidSwap on World Chain.
                    </p>

                    <div className="space-y-4">
                        {/* Section 1 */}
                        <div className="bg-gray-50 dark:bg-[#131a2a] p-5 rounded-2xl border border-gray-200 dark:border-[#293249]">
                            <div className="flex items-center gap-3 mb-3 text-blue-500">
                                <FiBook size={20} />
                                <h2 className="font-bold">Overview</h2>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                OrbidSwap is a native DEX for World Chain, optimized for the World App ecosystem. It uses Uniswap V2 mechanics with added World ID verification layers.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-gray-50 dark:bg-[#131a2a] p-5 rounded-2xl border border-gray-200 dark:border-[#293249]">
                            <div className="flex items-center gap-3 mb-3 text-violet-500">
                                <FiCode size={20} />
                                <h2 className="font-bold">Contracts</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-white dark:bg-[#0d111c] rounded-xl border border-gray-200 dark:border-[#293249] text-xs">
                                    <span className="block font-semibold mb-1">Factory</span>
                                    <span className="text-gray-500 break-all">0x...</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-[#0d111c] rounded-xl border border-gray-200 dark:border-[#293249] text-xs">
                                    <span className="block font-semibold mb-1">Router</span>
                                    <span className="text-gray-500 break-all">0x...</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <a
                            href="https://docs.orbidswap.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl shadow-lg shadow-blue-500/25"
                        >
                            <span className="font-bold">Full Documentation</span>
                            <FiExternalLink size={20} />
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
