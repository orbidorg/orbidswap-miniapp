'use client'

import { Header } from '../../components/Header'
import { useReadContract, useReadContracts } from 'wagmi'
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI, ERC20_ABI, WETH_ADDRESS } from '../../config/contracts'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiDroplet, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

const MOCK_WLD_PRICE_USD = 3.50

interface Pool {
    address: string
    token0Symbol: string
    token1Symbol: string
    tvlUsd: number
}

const KNOWN_TOKENS: Record<string, string> = {
    [WETH_ADDRESS.toLowerCase()]: 'WLD',
}

export default function Explore() {
    const [pools, setPools] = useState<Pool[]>([])

    const { data: allPairsLength } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'allPairsLength',
    })

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
        query: { enabled: !!pairAddresses }
    })

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
        query: { enabled: tokenAddresses.length > 0 }
    })

    useEffect(() => {
        if (!pairsData || !pairAddresses) return

        const loadedPools: Pool[] = []
        const symbolMap: Record<string, string> = { ...KNOWN_TOKENS }

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

                let tvlUsd = 0
                if (token0.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
                    tvlUsd = reserve0Num * MOCK_WLD_PRICE_USD * 2
                } else if (token1.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
                    tvlUsd = reserve1Num * MOCK_WLD_PRICE_USD * 2
                } else {
                    tvlUsd = (reserve0Num + reserve1Num) * 1.5
                }

                loadedPools.push({
                    address: pairAddress,
                    token0Symbol: symbolMap[token0.toLowerCase()] || token0.slice(0, 4),
                    token1Symbol: symbolMap[token1.toLowerCase()] || token1.slice(0, 4),
                    tvlUsd,
                })
            }
        }
        setPools(loadedPools)
    }, [pairsData, pairAddresses, tokenSymbols, tokenAddresses])

    const formatUsd = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
        return `$${value.toFixed(0)}`
    }

    const totalTvl = pools.reduce((sum, p) => sum + p.tvlUsd, 0)

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans">
            <Header />
            <main className="p-4 pt-20 pb-8">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">Pools</h1>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#131a2a] px-3 py-1.5 rounded-full text-sm">
                            <FiDroplet className="text-blue-500" size={14} />
                            <span className="font-medium">{pairsCount}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4">
                            <div className="text-xs text-gray-400 mb-1">Total TVL</div>
                            <div className="text-xl font-bold">{formatUsd(totalTvl)}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4">
                            <div className="text-xs text-gray-400 mb-1">Pools</div>
                            <div className="text-xl font-bold">{pairsCount}</div>
                        </div>
                    </div>

                    {/* Pool List - Mobile Cards */}
                    <div className="space-y-3">
                        {pools.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-[#5d6785]">
                                {pairsCount === 0 ? "No pools yet" : "Loading..."}
                            </div>
                        ) : (
                            pools.map((pool, i) => (
                                <motion.div
                                    key={pool.address}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-[#131a2a]">
                                                    {pool.token0Symbol[0]}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-[#131a2a]">
                                                    {pool.token1Symbol[0]}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    {pool.token0Symbol}/{pool.token1Symbol}
                                                </div>
                                                <div className="text-xs text-gray-400">0.3% fee</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatUsd(pool.tvlUsd)}</div>
                                            <div className="text-xs text-gray-400">TVL</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* CTA */}
                    <Link href="/pool" className="block mt-6">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-4 rounded-2xl"
                        >
                            Add Liquidity
                            <FiArrowRight />
                        </motion.button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
