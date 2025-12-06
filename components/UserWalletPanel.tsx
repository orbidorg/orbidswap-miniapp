import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { FiCopy, FiExternalLink, FiLogOut, FiX, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { formatUnits } from 'viem'
import { GradientIdenticon } from './Identicon'

// Mock WLD price for display (will be replaced with real price later)
const MOCK_WLD_PRICE_USD = 3.50

export function UserWalletPanel() {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: balance } = useBalance({ address })
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleCopy = async () => {
        if (!address) return
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!isConnected || !address) return null

    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    const balanceValue = balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0
    const usdValue = balanceValue * MOCK_WLD_PRICE_USD

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-[#131a2a] hover:bg-gray-200 dark:hover:bg-[#293249] border border-transparent dark:border-[#293249] rounded-2xl px-3 py-2 transition-all"
            >
                <GradientIdenticon address={address} size={24} />
                <span className="text-gray-900 dark:text-white font-medium">{shortAddress}</span>
                <span className="text-gray-500 dark:text-[#98a1c0] hidden sm:block">
                    {balance ? `${balanceValue.toFixed(4)} WLD` : '...'}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#131a2a] border border-gray-200 dark:border-[#293249] rounded-3xl shadow-2xl p-5 z-50"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <GradientIdenticon address={address} size={40} />
                                <div>
                                    <div className="text-gray-900 dark:text-white font-bold">{shortAddress}</div>
                                    <div className="text-gray-400 dark:text-[#5d6785] text-xs">World Chain Sepolia</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 dark:text-[#5d6785] hover:text-gray-900 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-[#293249] rounded-lg transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Balance Display */}
                        <div className="bg-gray-50 dark:bg-[#0d111c] rounded-2xl p-4 mb-4">
                            <div className="text-gray-500 dark:text-[#5d6785] text-xs uppercase tracking-wider mb-1">Total Balance</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${usdValue.toFixed(2)}
                            </div>
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm mt-1">
                                {balanceValue.toFixed(4)} WLD
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-4">
                            <motion.button
                                onClick={handleCopy}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-sm font-medium ${copied
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-[#293249] hover:bg-gray-200 dark:hover:bg-[#404a67] text-gray-900 dark:text-white'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <FiCheck size={14} />
                                            Copied!
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <FiCopy size={14} />
                                            Copy
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                            <a
                                href={`https://worldchain-sepolia.explorer.alchemy.com/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#293249] hover:bg-gray-200 dark:hover:bg-[#404a67] text-gray-900 dark:text-white py-2.5 rounded-xl transition-colors text-sm font-medium"
                            >
                                <FiExternalLink size={14} />
                                Explorer
                            </a>
                        </div>

                        {/* Disconnect Button */}
                        <button
                            onClick={() => {
                                disconnect()
                                setIsOpen(false)
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 py-3 rounded-xl transition-colors font-medium"
                        >
                            <FiLogOut size={16} />
                            Disconnect
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
