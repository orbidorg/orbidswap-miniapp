'use client'

import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { WLD_TOKEN_ADDRESS, ERC20_ABI } from '@/config/contracts'
import { useMiniKit } from './MiniKitDetector'
import { MiniKit } from '@worldcoin/minikit-js'
import { useEffect, useState } from 'react'

// Current WLD price (update this or fetch from API)
export const WLD_PRICE_USD = 2.30

interface WalletDisplayProps {
    worldAppAddress?: string | null
}

export function WalletBalanceDisplay({ worldAppAddress }: WalletDisplayProps) {
    const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
    const { isWorldApp } = useMiniKit()
    const [minikitAddress, setMinikitAddress] = useState<string | null>(null)

    // Get address from MiniKit if in World App
    useEffect(() => {
        if (isWorldApp && MiniKit.isInstalled()) {
            const addr = (MiniKit as any).walletAddress
            if (addr) {
                setMinikitAddress(addr)
            }
        }
    }, [isWorldApp])

    const address = worldAppAddress || minikitAddress || wagmiAddress
    const isConnected = wagmiConnected || !!worldAppAddress || !!minikitAddress

    // Fetch native ETH balance
    const { data: ethBalance } = useBalance({
        address: address as `0x${string}`,
        query: { enabled: !!address }
    })

    // Fetch WLD token balance using useReadContract
    const { data: wldBalanceRaw } = useReadContract({
        address: WLD_TOKEN_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        query: { enabled: !!address }
    })

    if (!isConnected || !address) {
        return null
    }

    const ethValue = ethBalance ? parseFloat(formatUnits(ethBalance.value, 18)) : 0
    const wldValue = wldBalanceRaw ? parseFloat(formatUnits(wldBalanceRaw as bigint, 18)) : 0
    const totalUsd = wldValue * WLD_PRICE_USD

    return (
        <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 space-y-3">
            {/* Address */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
                    <span className="font-medium text-sm">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                </div>
                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    Connected
                </span>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white dark:bg-[#0d111c] rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">WLD Balance</div>
                    <div className="font-bold">{wldValue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">${totalUsd.toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-[#0d111c] rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">ETH Balance</div>
                    <div className="font-bold">{ethValue.toFixed(4)}</div>
                    <div className="text-xs text-gray-500">Native</div>
                </div>
            </div>
        </div>
    )
}
