'use client'

import { Header } from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiZap, FiShield, FiTrendingUp, FiDroplet } from 'react-icons/fi'
import { useReadContract, useGasPrice } from 'wagmi'
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/config/contracts'
import { formatUnits } from 'viem'
import { useMiniKit } from '@/components/MiniKitDetector'
import { WorldIDVerify } from '@/components/WorldIDVerify'
import { useState } from 'react'

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
    <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans overflow-x-hidden">
      <Header />

      {/* Hero Section - Mobile Optimized */}
      <main className="relative pt-20 pb-8 px-4 flex flex-col items-center text-center">
        {/* Subtle Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-64 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* World App Badge */}
          {isWorldApp && (
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Running in World App
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Swap with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              confidence
            </span>
          </h1>

          <p className="text-base text-gray-500 dark:text-[#98a1c0] mb-6 leading-relaxed">
            Human-first DEX on World Chain. Instant swaps, deep liquidity.
          </p>

          <Link href="/swap" className="block w-full">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              Launch App
              <FiArrowRight />
            </motion.button>
          </Link>

          <Link href="/explore" className="block w-full mt-3">
            <button className="w-full py-3 text-gray-500 dark:text-[#98a1c0] font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
              View Pools →
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 w-full max-w-sm"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 text-center">
              <div className="text-xs text-gray-400 dark:text-[#5d6785] uppercase tracking-wider mb-1">Pairs</div>
              <div className="text-2xl font-bold">{allPairsLength?.toString() || '0'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 text-center">
              <div className="text-xs text-gray-400 dark:text-[#5d6785] uppercase tracking-wider mb-1">Gas</div>
              <div className="text-2xl font-bold">{gasPrice ? formatUnits(gasPrice, 9).slice(0, 4) : '0'}</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Mobile Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 w-full max-w-sm"
        >
          <div className="grid grid-cols-2 gap-3">
            <Link href="/swap">
              <div className="bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl p-4 text-center transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FiZap className="text-white" size={20} />
                </div>
                <div className="font-semibold text-sm">Swap</div>
                <div className="text-xs text-gray-500 dark:text-[#5d6785]">Trade tokens</div>
              </div>
            </Link>
            <Link href="/pool">
              <div className="bg-purple-500/10 hover:bg-purple-500/20 rounded-2xl p-4 text-center transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FiDroplet className="text-white" size={20} />
                </div>
                <div className="font-semibold text-sm">Pool</div>
                <div className="text-xs text-gray-500 dark:text-[#5d6785]">Add liquidity</div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Features - Compact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 w-full max-w-sm space-y-3"
        >
          <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <FiZap size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Lightning Fast</div>
              <div className="text-xs text-gray-500 dark:text-[#5d6785]">Sub-second finality</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center shrink-0">
              <FiShield size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Audited Security</div>
              <div className="text-xs text-gray-500 dark:text-[#5d6785]">Uniswap V2 fork</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
              <FiTrendingUp size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Earn Yield</div>
              <div className="text-xs text-gray-500 dark:text-[#5d6785]">Provide liquidity, earn fees</div>
            </div>
          </div>
        </motion.div>

        {/* World ID Verification - Only show in World App */}
        {isWorldApp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 w-full max-w-sm"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-500/20">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FiShield className="text-green-500" />
                Verify Your Humanity
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#5d6785] mb-3">
                Unlock premium features with World ID
              </p>
              <WorldIDVerify
                action="orbidswapverify"
                onSuccess={(hash) => console.log('Verified!', hash)}
              />
            </div>
          </motion.div>
        )}

        {/* Footer Text */}
        <div className="mt-8 text-xs text-gray-400 dark:text-[#5d6785]">
          Built for World Chain 🌐
        </div>
      </main>
    </div>
  )
}
