'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { toast } from 'react-hot-toast'
import { ERC20_ABI, ROUTER_ADDRESS, ROUTER_ABI, FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI, WETH_ADDRESS } from '../config/contracts'
import { TokenSelectorModal } from './TokenSelectorModal'
import { useDebounce } from '../hooks/useDebounce'
import { TokenIcon } from './TokenIcon'

interface AddLiquidityModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddLiquidityModal({ isOpen, onClose }: AddLiquidityModalProps) {
    const { address } = useAccount()
    const [tokenA, setTokenA] = useState<any>({ symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000' })
    const [tokenB, setTokenB] = useState<any>(null)
    const [amountA, setAmountA] = useState('')
    const [amountB, setAmountB] = useState('')

    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false)
    const [selectorMode, setSelectorMode] = useState<'A' | 'B'>('A')

    // 1. Get Pair Address
    const { data: pairAddress } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'getPair',
        args: tokenA && tokenB ? [
            tokenA.symbol === 'ETH' ? WETH_ADDRESS : tokenA.address,
            tokenB.symbol === 'ETH' ? WETH_ADDRESS : tokenB.address
        ] : undefined,
        query: {
            enabled: !!tokenA && !!tokenB,
        }
    })

    // 2. Get Reserves
    const { data: reserves } = useReadContract({
        address: pairAddress as `0x${string}`,
        abi: PAIR_ABI,
        functionName: 'getReserves',
        query: {
            enabled: !!pairAddress,
        }
    })

    // 3. Calculate Optimal Amounts
    const debouncedAmountA = useDebounce(amountA, 500)
    const debouncedAmountB = useDebounce(amountB, 500)

    // TODO: Implement calculation logic based on reserves
    // For now, manual input for both

    // 4. Approvals
    const { data: allowanceA } = useReadContract({
        address: tokenA?.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, ROUTER_ADDRESS as `0x${string}`] : undefined,
        query: { enabled: !!address && tokenA && tokenA.symbol !== 'ETH' }
    })

    const { data: allowanceB } = useReadContract({
        address: tokenB?.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, ROUTER_ADDRESS as `0x${string}`] : undefined,
        query: { enabled: !!address && tokenB && tokenB.symbol !== 'ETH' }
    })

    const { writeContract, data: hash, isPending } = useWriteContract({
        mutation: {
            onSuccess: () => toast.success('Transaction submitted!'),
            onError: (error) => toast.error(`Failed: ${error.message.slice(0, 50)}...`)
        }
    })

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        if (isConfirmed) {
            toast.success('Liquidity added successfully!')
            onClose()
        }
    }, [isConfirmed, onClose])

    const handleApprove = (token: any, amount: string) => {
        if (!token || !amount) return
        writeContract({
            address: token.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [ROUTER_ADDRESS as `0x${string}`, parseUnits(amount, 18)],
        })
    }

    const handleAddLiquidity = () => {
        if (!tokenA || !tokenB || !amountA || !amountB) return

        const parsedAmountA = parseUnits(amountA, 18)
        const parsedAmountB = parseUnits(amountB, 18)
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

        if (tokenA.symbol === 'ETH') {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'addLiquidityETH',
                args: [
                    tokenB.address,
                    parsedAmountB,
                    0n, // Min amount B
                    0n, // Min amount ETH
                    address!,
                    deadline
                ],
                value: parsedAmountA,
            })
        } else if (tokenB.symbol === 'ETH') {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'addLiquidityETH',
                args: [
                    tokenA.address,
                    parsedAmountA,
                    0n, // Min amount A
                    0n, // Min amount ETH
                    address!,
                    deadline
                ],
                value: parsedAmountB,
            })
        } else {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'addLiquidity',
                args: [
                    tokenA.address,
                    tokenB.address,
                    parsedAmountA,
                    parsedAmountB,
                    0n,
                    0n,
                    address!,
                    deadline
                ],
            })
        }
    }

    const openSelector = (mode: 'A' | 'B') => {
        setSelectorMode(mode)
        setIsTokenSelectorOpen(true)
    }

    const handleTokenSelect = (token: any) => {
        if (selectorMode === 'A') setTokenA(token)
        else setTokenB(token)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-white dark:bg-[#131a2a] rounded-3xl border border-gray-200 dark:border-[#293249] overflow-hidden shadow-2xl"
                    >
                        <div className="p-5 border-b border-gray-200 dark:border-[#293249] flex justify-between items-center">
                            <h3 className="text-gray-900 dark:text-white font-medium text-lg">Add Liquidity</h3>
                            <button onClick={onClose} className="text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            {/* Token A */}
                            <div className="bg-gray-50 dark:bg-[#0d111c] p-4 rounded-2xl border border-gray-200 dark:border-[#293249]">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 dark:text-[#98a1c0] text-sm">Input</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={amountA}
                                        onChange={(e) => setAmountA(e.target.value)}
                                        className="w-full bg-transparent text-3xl text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-[#5d6785]"
                                    />
                                    <button onClick={() => openSelector('A')} className="flex items-center gap-2 bg-white dark:bg-[#293249] px-3 py-1.5 rounded-full text-gray-900 dark:text-white shrink-0 shadow-sm dark:shadow-none transition-colors hover:bg-gray-100 dark:hover:bg-[#404a67]">
                                        {tokenA ? (
                                            <>
                                                <TokenIcon symbol={tokenA.symbol} size={24} />
                                                <span className="font-semibold">{tokenA.symbol}</span>
                                            </>
                                        ) : (
                                            <span>Select</span>
                                        )} <FiArrowDown />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center -my-2 z-10">
                                <div className="bg-white dark:bg-[#131a2a] p-1.5 rounded-xl border-[4px] border-gray-50 dark:border-[#0d111c]">
                                    <FiPlus className="text-gray-500 dark:text-[#98a1c0]" />
                                </div>
                            </div>

                            {/* Token B */}
                            <div className="bg-gray-50 dark:bg-[#0d111c] p-4 rounded-2xl border border-gray-200 dark:border-[#293249]">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 dark:text-[#98a1c0] text-sm">Input</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={amountB}
                                        onChange={(e) => setAmountB(e.target.value)}
                                        className="w-full bg-transparent text-3xl text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-[#5d6785]"
                                    />
                                    <button onClick={() => openSelector('B')} className="flex items-center gap-2 bg-white dark:bg-[#293249] px-3 py-1.5 rounded-full text-gray-900 dark:text-white shrink-0 shadow-sm dark:shadow-none transition-colors hover:bg-gray-100 dark:hover:bg-[#404a67]">
                                        {tokenB ? (
                                            <>
                                                <TokenIcon symbol={tokenB.symbol} size={24} />
                                                <span className="font-semibold">{tokenB.symbol}</span>
                                            </>
                                        ) : (
                                            <span>Select</span>
                                        )} <FiArrowDown />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={handleAddLiquidity}
                                disabled={isPending || !amountA || !amountB}
                                className="w-full bg-black dark:bg-[#4c82fb] hover:bg-gray-800 dark:hover:bg-[#3b66c9] text-white font-semibold text-lg sm:text-xl py-3 sm:py-4 rounded-2xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isPending ? 'Adding...' : 'Add Liquidity'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <TokenSelectorModal
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={handleTokenSelect}
                excludeToken={selectorMode === 'A' ? tokenB?.symbol : tokenA?.symbol}
            />
        </AnimatePresence>
    )
}
