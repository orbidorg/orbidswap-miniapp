'use client'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useReadContract, useReadContracts } from 'wagmi'
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI, ERC20_ABI, WETH_ADDRESS } from '../../config/contracts'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiDroplet, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

// Mock WLD price for USD calculations
const MOCK_WLD_PRICE_USD = 3.50

interface Pool {
    address: string
    token0: string
    token1: string
    token0Symbol: string
    token1Symbol: string
    reserve0: string
    reserve1: string
    tvlUsd: number
    exchangeRate: string
}

// Known token symbols map (fallback)
const KNOWN_TOKENS: Record<string, string> = {
    [WETH_ADDRESS.toLowerCase()]: 'WLD',
}

export default function Explore() {
    const [pools, setPools] = useState<Pool[]>([])

    // 1. Get total pairs length
    const { data: allPairsLength } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'allPairsLength',
    })

    // 2. Prepare hooks to fetch first 10 pairs
    const pairsCount = allPairsLength ? Number(allPairsLength) : 0
    const pairsToFetch = Math.min(pairsCount, 10)
    const pairIndexes = Array.from({ length: pairsToFetch }, (_, i) => BigInt(i))

    const { data: pairAddresses } = useReadContracts({
        contracts: pairIndexes.map(index => ({
            address: FACTORY_ADDRESS as `0x${string}`,
            abi: FACTORY_ABI,
            functionName: 'allPairs',
            args: [index],
        }))
    })

    // 3. Fetch data for these pairs (tokens, reserves)
    const { data: pairsData } = useReadContracts({
        contracts: pairAddresses?.flatMap(result => {
            const pairAddress = result.result as unknown as `0x${string}`
            if (!pairAddress) return []
            return [
                { address: pairAddress, abi: PAIR_ABI, functionName: 'token0' },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'token1' },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'getReserves' },
            ]
        }) || [],
        query: {
            enabled: !!pairAddresses
        }
    })

    // 4. Fetch token symbols
    const tokenAddresses = pairsData?.flatMap((_, i) => {
        if (i % 3 === 0) {
            const token0 = pairsData[i]?.result as unknown as `0x${string}`
            const token1 = pairsData[i + 1]?.result as unknown as `0x${string}`
            return [token0, token1].filter(Boolean)
        }
        return []
    }).filter(Boolean) || []

    const { data: tokenSymbols } = useReadContracts({
        contracts: tokenAddresses.map(addr => ({
            address: addr as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'symbol',
        })),
        query: {
            enabled: tokenAddresses.length > 0
        }
    })

    useEffect(() => {
        if (!pairsData || !pairAddresses) return

        const processPools = () => {
            const loadedPools: Pool[] = []
            const symbolMap: Record<string, string> = { ...KNOWN_TOKENS }

            // Build symbol map from fetched data
            if (tokenSymbols) {
                tokenAddresses.forEach((addr, i) => {
                    if (addr && tokenSymbols[i]?.result) {
                        symbolMap[addr.toLowerCase()] = tokenSymbols[i].result as string
                    }
                })
            }

            for (let i = 0; i < pairAddresses.length; i++) {
                const baseIndex = i * 3
                const pairAddress = pairAddresses[i].result as unknown as string
                const token0 = pairsData[baseIndex]?.result as unknown as string
                const token1 = pairsData[baseIndex + 1]?.result as unknown as string
                const reserves = pairsData[baseIndex + 2]?.result as unknown as [bigint, bigint, number]

                if (pairAddress && token0 && token1 && reserves) {
                    const reserve0Num = parseFloat(formatUnits(reserves[0], 18))
                    const reserve1Num = parseFloat(formatUnits(reserves[1], 18))

                    // Calculate TVL (assuming one token is WLD)
                    let tvlUsd = 0
                    if (token0.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
                        tvlUsd = reserve0Num * MOCK_WLD_PRICE_USD * 2
                    } else if (token1.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
                        tvlUsd = reserve1Num * MOCK_WLD_PRICE_USD * 2
                    } else {
                        // Neither is WLD, estimate based on total reserves
                        tvlUsd = (reserve0Num + reserve1Num) * 1.5
                    }

                    // Calculate exchange rate
                    const rate = reserve1Num > 0 ? (reserve0Num / reserve1Num).toFixed(4) : '0'

                    loadedPools.push({
                        address: pairAddress,
                        token0,
                        token1,
                        token0Symbol: symbolMap[token0.toLowerCase()] || token0.slice(0, 6) + '...',
                        token1Symbol: symbolMap[token1.toLowerCase()] || token1.slice(0, 6) + '...',
                        reserve0: reserve0Num.toFixed(4),
                        reserve1: reserve1Num.toFixed(4),
                        tvlUsd,
                        exchangeRate: rate,
                    })
                }
            }
            setPools(loadedPools)
        }

        processPools()
    }, [pairsData, pairAddresses, tokenSymbols, tokenAddresses])

    const formatUsd = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
        if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`
        return `$${value.toFixed(2)}`
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans selection:bg-black dark:selection:bg-[#4c82fb] selection:text-white bg-noise">
            <Header />
            <main className="flex flex-col items-center p-4 pt-28 pb-20 min-h-[80vh]">
                <div className="w-full max-w-5xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Explore</h1>
                            <p className="text-gray-500 dark:text-[#98a1c0]">Discover liquidity pools on World Chain</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#131a2a] px-4 py-2 rounded-xl">
                                <FiDroplet className="text-blue-500" />
                                <span className="text-sm font-medium">{pairsCount} Pools</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#131a2a] rounded-2xl p-6 border border-gray-200 dark:border-[#293249]"
                        >
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm mb-1">Total TVL</div>
                            <div className="text-2xl font-bold">
                                {formatUsd(pools.reduce((sum, p) => sum + p.tvlUsd, 0))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#131a2a] rounded-2xl p-6 border border-gray-200 dark:border-[#293249]"
                        >
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm mb-1">24h Volume</div>
                            <div className="text-2xl font-bold text-gray-400 dark:text-[#5d6785]">--</div>
                            <div className="text-xs text-gray-400 dark:text-[#5d6785]">Coming soon</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-[#131a2a] rounded-2xl p-6 border border-gray-200 dark:border-[#293249]"
                        >
                            <div className="text-gray-500 dark:text-[#98a1c0] text-sm mb-1">Active Pools</div>
                            <div className="text-2xl font-bold">{pairsCount}</div>
                        </motion.div>
                    </div>

                    {/* Pools Table */}
                    <div className="bg-white dark:bg-[#131a2a] rounded-3xl border border-gray-200 dark:border-[#293249] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-[#293249] text-sm font-medium text-gray-500 dark:text-[#98a1c0]">
                            <div className="col-span-1">#</div>
                            <div className="col-span-3">Pool</div>
                            <div className="col-span-2 text-right">TVL</div>
                            <div className="col-span-2 text-right">Reserve 0</div>
                            <div className="col-span-2 text-right">Reserve 1</div>
                            <div className="col-span-2 text-right">Rate</div>
                        </div>

                        {/* Table Body */}
                        {pools.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-[#98a1c0]">
                                {pairsCount === 0 ? "No pools found." : "Loading pools..."}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-[#293249]/50">
                                {pools.map((pool, i) => (
                                    <motion.div
                                        key={pool.address}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#293249]/30 cursor-pointer transition-colors items-center"
                                    >
                                        <div className="col-span-1 text-gray-400 dark:text-[#5d6785] font-mono">
                                            {i + 1}
                                        </div>
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white dark:border-[#131a2a] flex items-center justify-center text-white text-xs font-bold">
                                                    {pool.token0Symbol[0]}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white dark:border-[#131a2a] flex items-center justify-center text-white text-xs font-bold">
                                                    {pool.token1Symbol[0]}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {pool.token0Symbol}/{pool.token1Symbol}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-[#5d6785]">0.3% fee</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-right font-medium text-gray-900 dark:text-white">
                                            {formatUsd(pool.tvlUsd)}
                                        </div>
                                        <div className="col-span-2 text-right font-mono text-sm text-gray-600 dark:text-[#98a1c0]">
                                            {pool.reserve0} <span className="text-gray-400 dark:text-[#5d6785]">{pool.token0Symbol}</span>
                                        </div>
                                        <div className="col-span-2 text-right font-mono text-sm text-gray-600 dark:text-[#98a1c0]">
                                            {pool.reserve1} <span className="text-gray-400 dark:text-[#5d6785]">{pool.token1Symbol}</span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#293249] px-2 py-1 rounded-lg text-sm font-mono">
                                                1 = {pool.exchangeRate}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <Link href="/pool">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20"
                            >
                                Add Liquidity
                                <FiArrowRight />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
