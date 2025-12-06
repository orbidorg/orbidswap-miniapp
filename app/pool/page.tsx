'use client'

import { Header } from '../../components/Header'
import { AddLiquidityModal } from '../../components/AddLiquidityModal'
import { RemoveLiquidityModal } from '../../components/RemoveLiquidityModal'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI, ERC20_ABI } from '../../config/contracts'

export default function Pool() {
    const { address, isConnected } = useAccount()
    const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false)
    const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false)
    const [selectedPair, setSelectedPair] = useState<any>(null)
    const [userPositions, setUserPositions] = useState<any[]>([])

    // 1. Get total pairs length
    const { data: allPairsLength } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'allPairsLength',
    })

    // 2. Prepare hooks to fetch first 10 pairs (for demo purposes)
    // In production, this should be indexed or paginated properly
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

    // 3. Fetch data for these pairs
    const { data: pairsData } = useReadContracts({
        contracts: pairAddresses?.flatMap(result => {
            const pairAddress = result.result as unknown as `0x${string}`
            if (!pairAddress) return []
            return [
                { address: pairAddress, abi: PAIR_ABI, functionName: 'token0' },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'token1' },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'balanceOf', args: [address] },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'totalSupply' },
                { address: pairAddress, abi: PAIR_ABI, functionName: 'getReserves' },
            ]
        }) || [],
        query: {
            enabled: !!pairAddresses && !!address
        }
    })

    // 4. Fetch Token Symbols (Separate effect to avoid complex nesting in one hook)
    // We'll do this processing in a useEffect once pairsData is available

    // Helper to fetch token symbol
    // Note: This is a bit hacky for a pure frontend without indexer. 
    // Ideally we'd use a multicall for symbols too, but let's process what we have first.

    useEffect(() => {
        if (!pairsData || !pairAddresses || !address) return

        const processPositions = async () => {
            const positions: any[] = []

            // Each pair has 5 calls
            for (let i = 0; i < pairAddresses.length; i++) {
                const baseIndex = i * 5
                const pairAddress = pairAddresses[i].result as unknown as string
                const token0Address = pairsData[baseIndex]?.result as unknown as string
                const token1Address = pairsData[baseIndex + 1]?.result as unknown as string
                const userBalance = pairsData[baseIndex + 2]?.result as bigint
                const totalSupply = pairsData[baseIndex + 3]?.result as bigint
                // const reserves = pairsData[baseIndex + 4]?.result

                if (userBalance && userBalance > 0n) {
                    // We found a position! Now we need symbols.
                    // For now, we'll just use truncated addresses or hardcoded known ones if possible
                    // In a real app, we'd fetch symbols here or have a token list

                    // Simple mock for symbols to avoid N+1 requests for now, 
                    // or we could assume WETH/USDC for demo if addresses match

                    const share = (Number(userBalance) / Number(totalSupply)) * 100

                    positions.push({
                        pairAddress,
                        tokenA: { symbol: 'TKN1', address: token0Address }, // Placeholder symbols
                        tokenB: { symbol: 'TKN2', address: token1Address },
                        liquidity: formatUnits(userBalance, 18),
                        share: share.toFixed(2) + '%'
                    })
                }
            }
            setUserPositions(positions)
        }

        processPositions()
    }, [pairsData, pairAddresses, address])


    const handleRemoveClick = (position: any) => {
        setSelectedPair(position)
        setIsRemoveLiquidityOpen(true)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans selection:bg-black dark:selection:bg-[#4c82fb] selection:text-white">
            <Header />
            <main className="flex flex-col items-center justify-center p-4 mt-20">
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Pools</h1>
                        <button
                            onClick={() => setIsAddLiquidityOpen(true)}
                            className="bg-black dark:bg-[#4c82fb] hover:bg-gray-800 dark:hover:bg-[#3b66c9] text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-black/10 dark:shadow-blue-500/20"
                        >
                            + New Position
                        </button>
                    </div>

                    {!isConnected ? (
                        <div className="bg-white dark:bg-[#131a2a] rounded-3xl p-8 border border-gray-200 dark:border-[#293249] text-center shadow-sm dark:shadow-none">
                            <p className="text-gray-500 dark:text-[#98a1c0] text-lg">Connect your wallet to view your liquidity positions.</p>
                        </div>
                    ) : userPositions.length === 0 ? (
                        <div className="bg-white dark:bg-[#131a2a] rounded-3xl p-8 border border-gray-200 dark:border-[#293249] text-center shadow-sm dark:shadow-none">
                            <p className="text-gray-500 dark:text-[#98a1c0] text-lg">No active liquidity positions found.</p>
                            <p className="text-gray-400 dark:text-[#5d6785] text-sm mt-2">Scanning first {pairsToFetch} pairs...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {userPositions.map((pos, i) => (
                                <div key={i} className="bg-white dark:bg-[#131a2a] rounded-3xl p-6 border border-gray-200 dark:border-[#293249] hover:border-black dark:hover:border-[#4c82fb] transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-[#131a2a]"></div>
                                                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-[#131a2a]"></div>
                                            </div>
                                            <span className="font-bold text-lg text-gray-900 dark:text-white">LP Token</span>
                                            <span className="text-sm text-gray-500 dark:text-[#98a1c0] bg-gray-100 dark:bg-[#0d111c] px-2 py-1 rounded-lg">{pos.pairAddress.slice(0, 6)}...{pos.pairAddress.slice(-4)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveClick(pos)}
                                            className="text-black dark:text-[#4c82fb] font-medium hover:text-gray-700 dark:hover:text-[#3b66c9] transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-[#98a1c0]">Your Liquidity</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{parseFloat(pos.liquidity).toFixed(4)} LP</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-500 dark:text-[#98a1c0]">Share of Pool</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{pos.share}</span>
                                    </div>
                                </div>
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
