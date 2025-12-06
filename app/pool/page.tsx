'use client'

import { Header } from '../../components/Header'
import { AddLiquidityModal } from '../../components/AddLiquidityModal'
import { RemoveLiquidityModal } from '../../components/RemoveLiquidityModal'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI } from '../../config/contracts'
import { motion } from 'framer-motion'
import { FiPlus, FiDroplet } from 'react-icons/fi'
import { WORLD_CHAIN_TOKENS } from '../../config/tokenIcons'

export default function Pool() {
    const { address, isConnected } = useAccount()
    const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false)
    const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false)
    const [selectedPair, setSelectedPair] = useState<any>(null)
    const [userPositions, setUserPositions] = useState<any[]>([])

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
                { address: pairAddress, abi: PAIR_ABI, functionName: 'balanceOf', args: [address] },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'totalSupply' },
            ]
        }) || [],
        query: { enabled: !!pairAddresses && !!address }
    })

    useEffect(() => {
        if (!pairsData || !pairAddresses || !address) return

        const positions: any[] = []

        for (let i = 0; i < pairAddresses.length; i++) {
            const baseIndex = i * 4
            const pairAddress = pairAddresses[i].result as unknown as string
            const token0Address = pairsData[baseIndex]?.result as unknown as string
            const token1Address = pairsData[baseIndex + 1]?.result as unknown as string
            const userBalance = pairsData[baseIndex + 2]?.result as bigint
            const totalSupply = pairsData[baseIndex + 3]?.result as bigint

            if (userBalance && userBalance > 0n) {
                const share = (Number(userBalance) / Number(totalSupply)) * 100

                positions.push({
                    pairAddress,
                    tokenA: {
                        symbol: WORLD_CHAIN_TOKENS[token0Address.toLowerCase()]?.symbol || pairsData[baseIndex * 4]?.result ? 'TKN1' : 'TKN1', // Fallback
                        address: token0Address
                    },
                    tokenB: {
                        symbol: WORLD_CHAIN_TOKENS[token1Address.toLowerCase()]?.symbol || 'TKN2',
                        address: token1Address
                    },
                    liquidity: formatUnits(userBalance, 18),
                    share: share.toFixed(2) + '%'
                })
            }
        }
        setUserPositions(positions)
    }, [pairsData, pairAddresses, address])

    const handleRemoveClick = (position: any) => {
        setSelectedPair(position)
        setIsRemoveLiquidityOpen(true)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans">
            <Header />
            <main className="p-4 pt-20 pb-8">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Your Pools</h1>
                        <button
                            onClick={() => setIsAddLiquidityOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-4 py-2.5 rounded-xl"
                        >
                            <FiPlus size={18} />
                            Add
                        </button>
                    </div>

                    {!isConnected ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-8 text-center"
                        >
                            <FiDroplet className="mx-auto text-gray-300 dark:text-[#293249] mb-4" size={48} />
                            <p className="text-gray-500 dark:text-[#5d6785]">Connect wallet to view positions</p>
                        </motion.div>
                    ) : userPositions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-8 text-center"
                        >
                            <FiDroplet className="mx-auto text-gray-300 dark:text-[#293249] mb-4" size={48} />
                            <p className="text-gray-500 dark:text-[#5d6785]">No active positions</p>
                            <p className="text-xs text-gray-400 mt-2">Add liquidity to earn fees</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {userPositions.map((pos, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-[#131a2a]" />
                                                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-[#131a2a]" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">LP Position</div>
                                                <div className="text-xs text-gray-400">
                                                    {pos.pairAddress.slice(0, 6)}...{pos.pairAddress.slice(-4)}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveClick(pos)}
                                            className="text-blue-500 font-medium text-sm"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white dark:bg-[#0d111c] rounded-xl p-3">
                                            <div className="text-xs text-gray-400 mb-1">Liquidity</div>
                                            <div className="font-semibold">{parseFloat(pos.liquidity).toFixed(4)}</div>
                                        </div>
                                        <div className="bg-white dark:bg-[#0d111c] rounded-xl p-3">
                                            <div className="text-xs text-gray-400 mb-1">Share</div>
                                            <div className="font-semibold">{pos.share}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <AddLiquidityModal
                isOpen={isAddLiquidityOpen}
                onClose={() => setIsAddLiquidityOpen(false)}
            />

            {selectedPair && (
                <RemoveLiquidityModal
                    isOpen={isRemoveLiquidityOpen}
                    onClose={() => setIsRemoveLiquidityOpen(false)}
                    pairAddress={selectedPair.pairAddress}
                    tokenA={selectedPair.tokenA}
                    tokenB={selectedPair.tokenB}
                />
            )}
        </div>
    )
}
