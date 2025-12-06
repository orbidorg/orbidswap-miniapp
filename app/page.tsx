'use client'

import { Header } from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiZap, FiShield, FiTrendingUp, FiLayers, FiActivity } from 'react-icons/fi'
import { useReadContract, useReadContracts, useGasPrice } from 'wagmi'
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI, WETH_ADDRESS } from '@/config/contracts'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import { Footer } from '@/components/Footer'

export default function LandingPage() {
  const [tvlEth, setTvlEth] = useState('0')

  // 1. Total Pairs
  const { data: allPairsLength } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'allPairsLength',
  })

  // 2. Gas Price
  const { data: gasPrice } = useGasPrice()

  // 3. Calculate TVL (Approx from first 10 pairs)
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
    query: {
      enabled: !!pairAddresses
    }
  })

  useEffect(() => {
    if (!pairsData || !pairAddresses) return

    let totalEth = 0

    for (let i = 0; i < pairAddresses.length; i++) {
      const baseIndex = i * 3
      const token0 = pairsData[baseIndex]?.result as unknown as string
      const token1 = pairsData[baseIndex + 1]?.result as unknown as string
      const reserves = pairsData[baseIndex + 2]?.result as unknown as [bigint, bigint, number]

      if (token0 && token1 && reserves) {
        // Check if one of the tokens is WETH
        if (token0.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
          totalEth += Number(formatUnits(reserves[0], 18)) * 2
        } else if (token1.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
          totalEth += Number(formatUnits(reserves[1], 18)) * 2
        }
      }
    }
    setTvlEth(totalEth.toFixed(2))
  }, [pairsData, pairAddresses])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans selection:bg-black dark:selection:bg-[#4c82fb] selection:text-white overflow-hidden bg-noise">
      <Header />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Organic Background Gradients with Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] bg-gradient-to-b from-blue-100/40 via-purple-100/20 to-transparent dark:from-blue-900/20 dark:via-purple-900/10 dark:to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >


          <h1 className="text-7xl sm:text-9xl font-bold tracking-tighter mb-8 text-gray-900 dark:text-white leading-[0.85] select-none">
            Swap with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 dark:from-blue-400 dark:via-violet-400 dark:to-blue-400 animate-gradient-x bg-[length:200%_auto]">confidence.</span>
          </h1>

          <p className="text-xl sm:text-3xl text-gray-600 dark:text-[#98a1c0] mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-tight">
            The native liquidity layer for World Chain. <br className="hidden sm:block" />
            Instant swaps, deep liquidity, and zero compromise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/swap">
              <button className="group bg-black dark:bg-white text-white dark:text-black font-medium text-lg px-8 py-4 rounded-full transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/10">
                Launch App
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-8 py-4 rounded-full text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[#131a2a] transition-colors">
                View Analytics
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Glass Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl"
        >
          <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row justify-between items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200/50 dark:divide-[#293249]/50">
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="text-gray-500 dark:text-[#98a1c0] text-xs uppercase tracking-widest font-semibold mb-2">Total Pairs</div>
              <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{allPairsLength ? allPairsLength.toString() : '0'}</div>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="text-gray-500 dark:text-[#98a1c0] text-xs uppercase tracking-widest font-semibold mb-2">TVL (WLD)</div>
              <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{parseFloat(tvlEth).toLocaleString()}</div>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="text-gray-500 dark:text-[#98a1c0] text-xs uppercase tracking-widest font-semibold mb-2">TVL (USD)</div>
              <div className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                ${(parseFloat(tvlEth) * 3.5).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center">
              <div className="text-gray-500 dark:text-[#98a1c0] text-xs uppercase tracking-widest font-semibold mb-2">Gas (Gwei)</div>
              <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{gasPrice ? formatUnits(gasPrice, 9).slice(0, 4) : '0'}</div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="mt-32 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 glass rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black mb-6">
                  <FiZap size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Lightning Fast Execution</h3>
                <p className="text-lg text-gray-500 dark:text-[#98a1c0] max-w-md leading-relaxed">
                  Built on World Chain&apos;s high-performance infrastructure. Experience sub-second finality and minimal slippage on every trade.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <div className="h-1 w-full bg-gray-100 dark:bg-[#293249] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-sm font-medium text-gray-500 dark:text-[#98a1c0]">
                  <span>Speed</span>
                  <span>&lt; 1s</span>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between group hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                <FiShield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Audited Security</h3>
                <p className="text-gray-500 dark:text-[#98a1c0] text-sm">
                  Forked from battle-tested Uniswap V2 contracts.
                </p>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <FiTrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Yield Farming</h3>
                <p className="text-gray-500 dark:text-[#98a1c0] text-sm">
                  Earn fees by providing liquidity to active pools.
                </p>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 glass rounded-3xl p-8 flex flex-col justify-between group hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-4">
                <FiLayers size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Deep Liquidity</h3>
                <p className="text-gray-500 dark:text-[#98a1c0] text-sm">
                  Access the deepest liquidity pools on World Chain for minimal price impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
