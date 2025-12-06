'use client'

import { useState, useEffect } from 'react'
import { FiSettings, FiArrowDown, FiInfo } from 'react-icons/fi'
import { useAccount, useConnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { toast } from 'react-hot-toast'
import { ERC20_ABI, ROUTER_ADDRESS, ROUTER_ABI, WETH_ADDRESS } from '../config/contracts'
import { TokenSelectorModal } from './TokenSelectorModal'
import { SettingsModal } from './SettingsModal'
import { useDebounce } from '../hooks/useDebounce'
import { motion } from 'framer-motion'
import { TokenIcon } from './TokenIcon'
import { useTokenPrices } from '../hooks/useTokenPrices'

import { SwapDetails } from './SwapDetails'
import { ReviewSwapModal } from './ReviewSwapModal'

export function SwapCard() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { prices } = useTokenPrices()

    const handleConnect = () => {
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0]
        if (injectedConnector) {
            connect({ connector: injectedConnector })
        }
    }

    const [sellAmount, setSellAmount] = useState('')
    const [buyAmount, setBuyAmount] = useState('')
    const [slippage, setSlippage] = useState('auto')
    const [deadline, setDeadline] = useState('20')

    // Modals State
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [selectorMode, setSelectorMode] = useState<'sell' | 'buy'>('sell')

    // Tokens State
    const [sellToken, setSellToken] = useState({ symbol: 'WLD', name: 'Worldcoin', address: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003' })
    const [buyToken, setBuyToken] = useState<null | { symbol: string, name: string, address: string }>(null)

    // ETH Balance
    const { data: ethBalance } = useBalance({ address })

    // Sell Token Balance (ERC20)
    const { data: sellTokenBalance } = useReadContract({
        address: sellToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && sellToken.symbol !== 'ETH',
        }
    })

    // Buy Token Balance (ERC20)
    const { data: buyTokenBalance } = useReadContract({
        address: buyToken?.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!buyToken && buyToken.symbol !== 'ETH',
        }
    })

    // Helper to get formatted balance
    const getBalance = (token: { symbol: string } | null, isEthBalance: any, tokenBalance: any) => {
        if (!token) return '0.00'
        if (token.symbol === 'ETH') {
            return isEthBalance ? formatUnits(isEthBalance.value, isEthBalance.decimals) : '0.00'
        }
        return tokenBalance ? formatUnits(tokenBalance, 18) : '0.00' // Assuming 18 decimals for now
    }

    // Quote Fetching
    const debouncedSellAmount = useDebounce(sellAmount, 500)

    const getPath = () => {
        if (!sellToken || !buyToken) return undefined

        const sellAddress = sellToken.symbol === 'ETH' ? WETH_ADDRESS : sellToken.address
        const buyAddress = buyToken.symbol === 'ETH' ? WETH_ADDRESS : buyToken.address

        if (sellAddress === buyAddress) return undefined

        // Simple routing: Direct or via WETH
        // If one is WETH, direct path.
        if (sellAddress === WETH_ADDRESS || buyAddress === WETH_ADDRESS) {
            return [sellAddress, buyAddress] as `0x${string}`[]
        }

        // Otherwise, route through WETH
        return [sellAddress, WETH_ADDRESS, buyAddress] as `0x${string}`[]
    }

    const path = getPath()
    const amountIn = debouncedSellAmount ? parseUnits(debouncedSellAmount, 18) : 0n

    const { data: amountsOut } = useReadContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'getAmountsOut',
        args: path && amountIn > 0n ? [amountIn, path] : undefined,
        query: {
            enabled: !!path && amountIn > 0n,
        }
    })

    // Update Buy Amount when quote changes
    useEffect(() => {
        if (amountsOut && amountsOut.length > 0) {
            const amount = amountsOut[amountsOut.length - 1]
            setBuyAmount(formatUnits(amount, 18)) // Assuming 18 decimals
        } else if (!debouncedSellAmount) {
            setBuyAmount('')
        }
    }, [amountsOut, debouncedSellAmount])

    // Allowance (only for ERC20)
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: sellToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, ROUTER_ADDRESS as `0x${string}`] : undefined,
        query: {
            enabled: !!address && sellToken.symbol !== 'ETH',
        }
    })

    // Write Contract Hook
    const { writeContract, data: hash, isPending: isWritePending } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast.success('Transaction submitted!')
                setIsReviewOpen(false)
            },
            onError: (error) => {
                toast.error(`Transaction failed: ${error.message.slice(0, 50)}...`)
            }
        }
    })

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isConfirmed) {
            toast.success('Swap successful!')
            setSellAmount('')
            setBuyAmount('')
        }
    }, [isConfirmed])

    const handleApprove = () => {
        if (!sellToken.address) return
        writeContract({
            address: sellToken.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [ROUTER_ADDRESS as `0x${string}`, parseUnits(sellAmount, 18)],
        }, {
            onSuccess: () => {
                toast.success('Approval submitted!')
                setTimeout(refetchAllowance, 5000)
            }
        })
    }

    // Trigger Review Modal
    const handleSwapClick = () => {
        if (!path || !address) return
        setIsReviewOpen(true)
    }

    // Actual Execution
    const executeSwap = () => {
        if (!path || !address) return

        const amountIn = parseUnits(sellAmount, 18)

        // Calculate AmountOutMin based on Slippage
        let amountOutMin = 0n
        if (amountsOut && amountsOut.length > 0) {
            const estimatedOut = amountsOut[amountsOut.length - 1]
            const slippagePercent = slippage === 'auto' ? 0.5 : parseFloat(slippage)
            const minOut = Number(formatUnits(estimatedOut, 18)) * (1 - slippagePercent / 100)
            amountOutMin = parseUnits(minOut.toFixed(18), 18)
        }

        const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + 60 * parseInt(deadline))

        if (sellToken.symbol === 'ETH') {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'swapExactETHForTokens',
                args: [amountOutMin, path, address, deadlineTimestamp],
                value: amountIn,
            })
        } else if (buyToken?.symbol === 'ETH') {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'swapExactTokensForETH',
                args: [amountIn, amountOutMin, path, address, deadlineTimestamp],
            })
        } else {
            writeContract({
                address: ROUTER_ADDRESS as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: 'swapExactTokensForTokens',
                args: [amountIn, amountOutMin, path, address, deadlineTimestamp],
            })
        }
    }

    const openTokenSelector = (mode: 'sell' | 'buy') => {
        setSelectorMode(mode)
        setIsTokenSelectorOpen(true)
    }

    const handleTokenSelect = (token: any) => {
        if (selectorMode === 'sell') {
            setSellToken(token)
        } else {
            setBuyToken(token)
        }
    }

    // Derived Data for Details
    const rate = buyAmount && sellAmount && parseFloat(sellAmount) > 0
        ? `1 ${sellToken.symbol} = ${(parseFloat(buyAmount) / parseFloat(sellAmount)).toFixed(4)} ${buyToken?.symbol}`
        : '-'

    // Fee USD (0.3% of sell amount USD)
    const totalSellUsd = sellAmount && prices[sellToken.symbol] ? parseFloat(sellAmount) * prices[sellToken.symbol] : 0
    const feeUsd = (totalSellUsd * 0.003).toFixed(2)

    // Price Impact (Simple Diff for now: Mocking -0.05% as standard for small liquid pairs)
    // In production this compares AmountOut vs SpotPrice
    const priceImpact = '-0.05%'

    const swapDetails = {
        rate,
        fee: `$${feeUsd}`,
        networkCost: '~$0.05', // Mocked low cost for L2
        priceImpact,
        maxSlippage: slippage === 'auto' ? '0.50%' : `${slippage}%`,
        routing: 'OrbidSwap API'
    }

    const usdValue = {
        sell: totalSellUsd > 0 ? `~$${totalSellUsd.toFixed(2)}` : '$0.00',
        buy: buyAmount && buyToken && prices[buyToken.symbol] ? `~$${(parseFloat(buyAmount) * prices[buyToken.symbol]).toFixed(2)}` : '$0.00'
    }

    // Button Logic
    const renderActionButton = () => {
        if (!isConnected) {
            return (
                <button
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-base py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                >
                    Connect Wallet
                </button>
            )
        }

        if (!sellAmount) {
            return (
                <button className="w-full bg-gray-100 dark:bg-[#293249] text-gray-400 dark:text-[#5d6785] font-semibold text-base py-4 rounded-2xl cursor-not-allowed">
                    Enter an amount
                </button>
            )
        }

        if (!buyToken) {
            return (
                <button className="w-full bg-gray-100 dark:bg-[#293249] text-gray-400 dark:text-[#5d6785] font-semibold text-base py-4 rounded-2xl cursor-not-allowed">
                    Select a token
                </button>
            )
        }

        // Check Allowance - logic moved to Review Modal
        // We now allow opening the Review modal even if allowance is low.


        return (
            <button
                onClick={handleSwapClick}
                disabled={isWritePending || isConfirming}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-base py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
                {isWritePending || isConfirming ? 'Swapping...' : 'Swap'}
            </button>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[480px] bg-white dark:bg-[#0d111c] rounded-3xl p-4 border border-gray-200 dark:border-[#293249] shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 mb-2">
                    <div className="flex gap-4">
                        <button className="text-gray-900 dark:text-white font-medium text-lg">Swap</button>
                        <button className="text-gray-500 dark:text-[#98a1c0] font-medium text-lg hover:text-gray-900 dark:hover:text-white transition-colors">Limit</button>
                    </div>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="text-gray-500 dark:text-[#98a1c0] hover:text-gray-900 dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#293249] rounded-xl"
                    >
                        <FiSettings size={20} />
                    </button>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-1 relative">
                    {/* Sell Input */}
                    <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 hover:border-gray-200 dark:hover:border-[#293249] border border-transparent transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-[#98a1c0] text-sm font-medium">You pay</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <input
                                type="number"
                                placeholder="0"
                                value={sellAmount}
                                onChange={(e) => setSellAmount(e.target.value)}
                                className="w-full bg-transparent text-4xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#5d6785] outline-none"
                            />
                            <button
                                onClick={() => openTokenSelector('sell')}
                                className="flex items-center gap-2 bg-white dark:bg-[#293249] hover:bg-gray-100 dark:hover:bg-[#404a67] text-gray-900 dark:text-white px-3 py-1.5 rounded-full transition-colors shrink-0 shadow-sm dark:shadow-none"
                            >
                                <TokenIcon symbol={sellToken.symbol} size={24} />
                                <span className="font-semibold text-lg">{sellToken.symbol}</span>
                                <FiArrowDown size={16} />
                            </button>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-gray-500 dark:text-[#5d6785] text-sm">
                                {sellAmount && prices[sellToken.symbol]
                                    ? `~$${(parseFloat(sellAmount) * prices[sellToken.symbol]).toFixed(2)}`
                                    : '$0.00'}
                            </span>
                            <span className="text-gray-500 dark:text-[#5d6785] text-sm">Balance: {parseFloat(getBalance(sellToken, ethBalance, sellTokenBalance)).toFixed(4)}</span>
                        </div>
                    </div>

                    {/* Arrow Separator - Click to swap tokens */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <button
                            onClick={() => {
                                if (buyToken) {
                                    const tempToken = sellToken
                                    setSellToken(buyToken)
                                    setBuyToken(tempToken)
                                    const tempAmount = sellAmount
                                    setSellAmount(buyAmount)
                                    setBuyAmount(tempAmount)
                                }
                            }}
                            disabled={!buyToken}
                            className="bg-gray-50 dark:bg-[#131a2a] p-1.5 rounded-xl border-[4px] border-white dark:border-[#0d111c] hover:bg-gray-100 dark:hover:bg-[#293249] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiArrowDown size={20} className="text-gray-500 dark:text-[#98a1c0]" />
                        </button>
                    </div>

                    {/* Buy Input */}
                    <div className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl p-4 hover:border-gray-200 dark:hover:border-[#293249] border border-transparent transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-[#98a1c0] text-sm font-medium">You receive</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <input
                                type="number"
                                placeholder="0"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                className="w-full bg-transparent text-4xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#5d6785] outline-none"
                            />
                            {buyToken ? (
                                <button
                                    onClick={() => openTokenSelector('buy')}
                                    className="flex items-center gap-2 bg-white dark:bg-[#293249] hover:bg-gray-100 dark:hover:bg-[#404a67] text-gray-900 dark:text-white px-3 py-1.5 rounded-full transition-colors shrink-0 shadow-sm dark:shadow-none"
                                >
                                    <TokenIcon symbol={buyToken.symbol} size={24} />
                                    <span className="font-semibold text-lg">{buyToken.symbol}</span>
                                    <FiArrowDown size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => openTokenSelector('buy')}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 rounded-full transition-colors shrink-0 shadow-lg shadow-blue-500/20"
                                >
                                    <span className="font-semibold">Select token</span>
                                    <FiArrowDown size={16} />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-gray-500 dark:text-[#5d6785] text-sm">
                                {buyAmount && buyToken && prices[buyToken.symbol]
                                    ? `~$${(parseFloat(buyAmount) * prices[buyToken.symbol]).toFixed(2)}`
                                    : '$0.00'}
                            </span>
                            <span className="text-gray-500 dark:text-[#5d6785] text-sm">Balance: {parseFloat(getBalance(buyToken, ethBalance, buyTokenBalance)).toFixed(4)}</span>
                        </div>
                    </div>
                </div>

                {/* Swap Details Accordion */}
                {buyAmount && (
                    <div className="mt-2">
                        <SwapDetails
                            isOpen={isDetailsOpen}
                            onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
                            details={swapDetails}
                        />
                    </div>
                )}

                {/* Action Button - Inside Card */}
                <div className="pt-4">
                    {renderActionButton()}
                </div>
            </motion.div>

            <TokenSelectorModal
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={handleTokenSelect}
                excludeToken={selectorMode === 'sell' ? buyToken?.symbol : sellToken.symbol}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                slippage={slippage}
                setSlippage={setSlippage}
                deadline={deadline}
                setDeadline={setDeadline}
            />

            <ReviewSwapModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onConfirm={executeSwap}
                isPending={isWritePending || isConfirming}
                sellToken={sellToken}
                buyToken={buyToken || { symbol: '?', name: 'Select Token' }}
                sellAmount={sellAmount}
                buyAmount={buyAmount}
                usdValue={usdValue}
                details={swapDetails}
                needsApproval={sellToken.symbol !== 'ETH' && (allowance ? allowance as bigint : 0n) < parseUnits(sellAmount || '0', 18)}
                onApprove={handleApprove}
                isApproving={isWritePending || isConfirming}
            />
        </>
    )
}
