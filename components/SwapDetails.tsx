'use client'

import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface SwapDetailsProps {
    isOpen: boolean
    onToggle: () => void
    details: {
        rate: string
        fee: string
        networkCost: string
        priceImpact: string
        maxSlippage: string
        routing: string
    }
}

export function SwapDetails({ isOpen, onToggle, details }: SwapDetailsProps) {
    const isPriceImpactHigh = parseFloat(details.priceImpact.replace('%', '')) < -2.0

    return (
        <div className="bg-white dark:bg-[#131a2a] rounded-xl border border-gray-200 dark:border-[#293249] overflow-hidden transition-colors">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-500 dark:text-[#98a1c0] hover:bg-gray-50 dark:hover:bg-[#293249]/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {isOpen ? 'Hide details' : 'Show details'}
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {!isOpen && (
                    <div className="flex items-center gap-2">
                        <span>1 {details.rate.split('=')[0].trim()} = {details.rate.split('=')[1].trim()}</span>
                        <span className="text-gray-300 dark:text-[#293249]">|</span>
                        <span>{details.networkCost}</span>
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 space-y-3"
                    >
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Rate</span>
                            <span className="text-gray-900 dark:text-white font-medium">{details.rate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Fee (0.3%)</span>
                            <span className="text-gray-900 dark:text-white font-medium">{details.fee}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Network cost</span>
                            <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-medium">
                                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-[#293249] flex items-center justify-center">
                                    <span className="text-[10px]">⛽</span>
                                </div>
                                {details.networkCost}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Order routing</span>
                            <span className="text-gray-900 dark:text-white font-medium">{details.routing}</span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-[#293249] my-2 pt-2"></div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Price impact</span>
                            <span className={`font-medium ${isPriceImpactHigh ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                {details.priceImpact}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-[#98a1c0]">Max slippage</span>
                            <span className="text-gray-900 dark:text-white font-medium">{details.maxSlippage}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
