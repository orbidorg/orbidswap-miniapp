'use client'

import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { getTokenIcon } from '@/config/tokenIcons'

interface TokenSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (token: any) => void
}

const COMMON_TOKENS = [
    { symbol: 'WLD', name: 'Worldcoin', address: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xdBd74deF5339C659719Afd3f533412b5de4D3736' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x...' },
]

export function TokenSelectorModal({ isOpen, onClose, onSelect }: TokenSelectorModalProps) {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full sm:max-w-md bg-white dark:bg-[#131a2a] sm:rounded-3xl rounded-t-3xl border-t sm:border border-gray-200 dark:border-[#293249] overflow-hidden shadow-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col"
                    >
                        {/* Header - fixed */}
                        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#293249] flex justify-between items-center shrink-0">
                            <h3 className="text-gray-900 dark:text-white font-medium text-lg">Select a token</h3>
                            <button onClick={onClose} className="text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white transition-colors p-1">
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Content - scrollable */}
                        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                            {/* Search */}
                            <div className="relative mb-4">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#98a1c0]" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search name or paste address"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-[#0d111c] border border-transparent dark:border-[#293249] rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#5d6785] focus:border-[#4c82fb] outline-none transition-colors text-sm sm:text-base"
                                />
                            </div>

                            {/* Quick select tokens */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {COMMON_TOKENS.map((token) => (
                                    <button
                                        key={token.symbol}
                                        onClick={() => {
                                            onSelect(token)
                                            onClose()
                                        }}
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-[#0d111c] border border-gray-200 dark:border-[#293249] hover:border-black dark:hover:border-[#4c82fb] rounded-full px-3 py-1.5 transition-all group"
                                    >
                                        <img
                                            src={getTokenIcon(token.symbol)}
                                            alt={token.symbol}
                                            className="w-5 h-5 rounded-full"
                                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                                        />
                                        <span className="text-gray-900 dark:text-white font-medium text-sm group-hover:text-black dark:group-hover:text-[#4c82fb] transition-colors">{token.symbol}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Token list */}
                            <div className="border-t border-gray-200 dark:border-[#293249] pt-4">
                                <div className="text-gray-500 dark:text-[#98a1c0] text-sm mb-2">Popular tokens</div>
                                <div className="flex flex-col gap-1">
                                    {COMMON_TOKENS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.symbol.toLowerCase().includes(searchQuery.toLowerCase())).map((token) => (
                                        <button
                                            key={token.symbol}
                                            onClick={() => {
                                                onSelect(token)
                                                onClose()
                                            }}
                                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#293249]/50 rounded-xl transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getTokenIcon(token.symbol)}
                                                    alt={token.symbol}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                                />
                                                <div className="text-left">
                                                    <div className="text-gray-900 dark:text-white font-medium group-hover:text-black dark:group-hover:text-[#4c82fb] transition-colors">{token.name}</div>
                                                    <div className="text-gray-500 dark:text-[#5d6785] text-xs">{token.symbol}</div>
                                                </div>
                                            </div>
                                            <div className="text-gray-900 dark:text-white text-sm">0</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
