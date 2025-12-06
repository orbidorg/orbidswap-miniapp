'use client'

import { FiX, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { TokenIcon } from './TokenIcon'

interface ReviewSwapModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isPending: boolean
    sellToken: { symbol: string; name: string }
    buyToken: { symbol: string; name: string }
    sellAmount: string
    buyAmount: string
    usdValue: { sell: string; buy: string }
    details: {
        rate: string
        fee: string
        networkCost: string
        priceImpact: string
        maxSlippage: string
        routing: string
    }
}

export function ReviewSwapModal({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    usdValue,
    details
}: ReviewSwapModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md bg-white dark:bg-[#131a2a] rounded-3xl border border-gray-200 dark:border-[#293249] overflow-hidden shadow-2xl"
                >
                    <div className="p-5 border-b border-gray-200 dark:border-[#293249] flex justify-between items-center">
                        <h3 className="text-gray-900 dark:text-white font-medium text-lg">Review Swap</h3>
                        <button onClick={onClose} className="text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="space-y-1">
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm">You pay</div>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-medium text-gray-900 dark:text-white">{sellAmount} {sellToken.symbol}</span>
                                <TokenIcon symbol={sellToken.symbol} size={32} />
                            </div>
                            <div className="text-gray-400 dark:text-[#5d6785] text-sm">{usdValue.sell}</div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-px bg-gray-100 dark:bg-[#293249] flex-1"></div>
                            <FiArrowDown className="text-gray-400 dark:text-[#5d6785] mx-4" />
                            <div className="h-px bg-gray-100 dark:bg-[#293249] flex-1"></div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm">You receive</div>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-medium text-gray-900 dark:text-white">{buyAmount} {buyToken.symbol}</span>
                                <TokenIcon symbol={buyToken.symbol} size={32} />
                            </div>
                            <div className="text-gray-400 dark:text-[#5d6785] text-sm">{usdValue.buy}</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-[#0d111c] rounded-xl p-4 space-y-3 mt-4">
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
                                <span className="text-gray-900 dark:text-white font-medium">{details.networkCost}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-[#98a1c0]">Order routing</span>
                                <span className="text-gray-900 dark:text-white font-medium">{details.routing}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-[#98a1c0]">Price impact</span>
                                <span className="text-gray-900 dark:text-white font-medium">{details.priceImpact}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-[#98a1c0]">Max slippage</span>
                                <span className="text-gray-900 dark:text-white font-medium">{details.maxSlippage}</span>
                            </div>
                        </div>

                        <button
                            onClick={onConfirm}
                            disabled={isPending}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xl py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
                        >
                            {isPending ? 'Confirming...' : 'Confirm Swap'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
