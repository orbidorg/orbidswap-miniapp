'use client'

import { useAccount, useDisconnect, useBalance, useReadContract } from 'wagmi'
import { FiCopy, FiExternalLink, FiLogOut, FiX, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { formatUnits } from 'viem'
import { GradientIdenticon } from './Identicon'
import { useMiniKit } from './MiniKitDetector'
import { WLD_TOKEN_ADDRESS, ERC20_ABI } from '@/config/contracts'

// WLD price for display
const WLD_PRICE_USD = 2.30

export function UserWalletPanel() {
    const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
    const { disconnect: wagmiDisconnect } = useDisconnect()
    const { isWorldApp, walletAddress: minikitAddress, isConnected: minikitConnected, disconnect: minikitDisconnect } = useMiniKit()

    // Use MiniKit address in World App, wagmi otherwise
    const address = minikitAddress || wagmiAddress
    const isConnected = minikitConnected || wagmiConnected

    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // ETH balance (native)
    const { data: ethBalance } = useBalance({
        address: address as `0x${string}`,
        query: { enabled: !!address }
    })

    // WLD token balance
    const { data: wldBalanceRaw } = useReadContract({
        address: WLD_TOKEN_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
        query: { enabled: !!address }
    })

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

    const handleDisconnect = () => {
        if (isWorldApp) {
            minikitDisconnect()
        } else {
            wagmiDisconnect()
        }
        setIsOpen(false)
    }

    if (!isConnected || !address) return null

    // Even shorter address for mobile
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-3)}`
    const wldBalance = wldBalanceRaw ? parseFloat(formatUnits(wldBalanceRaw as bigint, 18)) : 0
    const usdValue = wldBalance * WLD_PRICE_USD

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-[#131a2a] hover:bg-gray-200 dark:hover:bg-[#293249] border border-transparent dark:border-[#293249] rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 transition-all"
            >
                <GradientIdenticon address={address} size={20} />
                <span className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm">{shortAddress}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-16 md:top-full md:mt-2 md:w-72 lg:w-80 bg-white dark:bg-[#131a2a] border border-gray-200 dark:border-[#293249] rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-5 z-50 max-w-sm mx-auto md:mx-0"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <GradientIdenticon address={address} size={32} />
                                    <div>
                                        <div className="text-gray-900 dark:text-white font-bold text-sm md:text-base">{shortAddress}</div>
                                        <div className="text-gray-400 dark:text-[#5d6785] text-xs">World Chain</div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 dark:text-[#5d6785] hover:text-gray-900 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-[#293249] rounded-lg transition-colors">
                                    <FiX size={18} />
                                </button>
                            </div>

                            {/* Balance Display */}
                            <div className="bg-gray-50 dark:bg-[#0d111c] rounded-xl md:rounded-2xl p-3 md:p-4 mb-3 md:mb-4">
                                <div className="text-gray-500 dark:text-[#5d6785] text-xs uppercase tracking-wider mb-1">Total Balance</div>
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    ${usdValue.toFixed(2)}
                                </div>
                                <div className="text-gray-500 dark:text-[#98a1c0] text-xs md:text-sm mt-1">
                                    {wldBalance.toFixed(4)} WLD
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-3 md:mb-4">
                                <motion.button
                                    onClick={handleCopy}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 rounded-xl transition-all text-xs md:text-sm font-medium ${copied
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-[#293249] hover:bg-gray-200 dark:hover:bg-[#404a67] text-gray-900 dark:text-white'
                                        }`}
                                >
                                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </motion.button>
                                <a
                                    href={`https://worldchain-mainnet.explorer.alchemy.com/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#293249] hover:bg-gray-200 dark:hover:bg-[#404a67] text-gray-900 dark:text-white py-2 md:py-2.5 rounded-xl transition-colors text-xs md:text-sm font-medium"
                                >
                                    <FiExternalLink size={14} />
                                    Explorer
                                </a>
                            </div>

                            {/* Disconnect Button */}
                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 py-2.5 md:py-3 rounded-xl transition-colors font-medium text-sm"
                            >
                                <FiLogOut size={16} />
                                Disconnect
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
