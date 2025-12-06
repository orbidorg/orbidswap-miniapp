'use client'

import { Header } from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiZap, FiShield, FiDroplet, FiGlobe } from 'react-icons/fi'
import { useReadContract, useGasPrice } from 'wagmi'
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/config/contracts'
import { formatUnits } from 'viem'
import { useMiniKit } from '@/components/MiniKitDetector'
import { WorldIDVerify } from '@/components/WorldIDVerify'

export default function LandingPage() {
  const { isWorldApp } = useMiniKit()


  // 1. Total Pairs
  const { data: allPairsLength } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'allPairsLength',
  })

  // 2. Gas Price
  const { data: gasPrice } = useGasPrice()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans overflow-x-hidden bg-noise selection:bg-blue-500/30">
      <Header />

      <main className="relative pt-24 pb-20 px-4 flex flex-col items-center">
        {/* Ambient Background Glows */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="fixed bottom-0 right-0 w-[250px] h-[250px] bg-violet-500/10 rounded-full blur-[80px] -z-10" />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
        >
          {/* Logo with Glow */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 relative"
          >
            <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
            <img src="/logo.svg" alt="OrbidSwap" className="w-24 h-24 relative z-10 drop-shadow-2xl" />
          </motion.div>

          {/* World App Badge */}
          {isWorldApp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">World App Verified</span>
            </motion.div>
          )}

          <h1 className="text-5xl font-bold tracking-tight mb-3 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
            OrbidSwap
          </h1>

          <p className="text-lg text-gray-500 dark:text-[#98a1c0] mb-8 leading-relaxed max-w-[280px] mx-auto">
            The native liquidity layer for <span className="text-gray-900 dark:text-white font-medium">World Chain</span>.
          </p>

          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-4 w-full mb-10">
            <Link href="/swap" className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-600 to-violet-600 p-0.5 rounded-2xl shadow-lg shadow-blue-500/25"
              >
                <div className="bg-transparent h-full w-full rounded-[14px] flex flex-col items-center justify-center py-4 px-2 text-white">
                  <FiZap size={24} className="mb-2" />
                  <span className="font-bold">Swap</span>
                  <span className="text-[10px] opacity-80 mt-0.5">Instant Trade</span>
                </div>
              </motion.div>
            </Link>

            <Link href="/pool" className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-[#131a2a] border border-gray-200 dark:border-[#293249] p-0.5 rounded-2xl shadow-sm"
              >
                <div className="h-full w-full rounded-[14px] flex flex-col items-center justify-center py-4 px-2 text-gray-900 dark:text-white">
                  <FiDroplet size={24} className="mb-2 text-purple-500" />
                  <span className="font-bold">Pool</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Earn Yields</span>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Live Stats Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-gray-50/50 dark:bg-[#131a2a]/50 border border-gray-100 dark:border-[#293249] backdrop-blur-sm rounded-2xl p-4 mb-8 flex justify-between items-center"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500 dark:text-[#5d6785] uppercase tracking-wider font-semibold">Active Pairs</span>
              <span className="text-xl font-bold font-mono">{allPairsLength?.toString() || '0'}</span>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-[#293249]" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 dark:text-[#5d6785] uppercase tracking-wider font-semibold">Gas Price</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold font-mono">{gasPrice ? formatUnits(gasPrice, 9).slice(0, 4) : '0'}</span>
                <span className="text-xs text-gray-400">Gwei</span>
              </div>
            </div>
          </motion.div>

          {/* Features Vertical List */}
          <div className="w-full space-y-4 mb-8">
            <h3 className="text-left text-sm font-semibold text-gray-900 dark:text-white mb-2 ml-1">Why OrbidSwap?</h3>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="group flex items-center gap-4 bg-white dark:bg-[#131a2a] p-4 rounded-2xl border border-gray-100 dark:border-[#293249] shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <FiGlobe size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">World Chain Native</div>
                <div className="text-xs text-gray-500 dark:text-[#98a1c0]">Optimized for the World App ecosystem</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group flex items-center gap-4 bg-white dark:bg-[#131a2a] p-4 rounded-2xl border border-gray-100 dark:border-[#293249] shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                <FiShield size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">Verified Humans</div>
                <div className="text-xs text-gray-500 dark:text-[#98a1c0]">Sybil-resistant trading & governance</div>
              </div>
            </motion.div>
          </div>

          {/* World ID Verification Card */}
          {isWorldApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-[#293249] dark:via-[#131a2a] dark:to-[#0d111c]">
                {/* Gold Shine Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />

                <div className="bg-white dark:bg-[#0d111c]/90 backdrop-blur-xl rounded-[20px] p-6 text-left border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center">
                      <FiShield size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">World ID</h3>
                      <p className="text-xs text-gray-500 font-medium">Verification Required</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-[#98a1c0] mb-6">
                    Verify your humanity to access exclusive pools and gas-free transactions.
                  </p>

                  <WorldIDVerify
                    action="orbidswapverify"
                    onSuccess={(hash) => console.log('Verified!', hash)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-12 mb-4 opacity-40">
            <img src="/logo.svg" alt="World Chain" className="w-6 h-6 mx-auto mb-2 grayscale" />
            <p className="text-[10px] text-center">Built for World Chain</p>
          </div>

        </motion.div>
      </main>
    </div>
  )
}
