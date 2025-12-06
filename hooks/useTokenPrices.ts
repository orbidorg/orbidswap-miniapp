'use client'

import { useState, useEffect } from 'react'
import { WORLD_CHAIN_TOKENS } from '@/config/tokenIcons'

// Map symbol to CoinGecko ID
const COINGECKO_IDS: Record<string, string> = {
    'WLD': 'worldcoin-wld',
    'ETH': 'ethereum',
    'WETH': 'ethereum',
    'USDC': 'usd-coin',
    'WBTC': 'wrapped-bitcoin',
    'sDAI': 'savings-dai',
}

export function useTokenPrices() {
    const [prices, setPrices] = useState<Record<string, number>>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const ids = Object.values(COINGECKO_IDS).join(',')
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
                const data = await response.json()

                const newPrices: Record<string, number> = {}

                // Map back to symbols
                Object.entries(COINGECKO_IDS).forEach(([symbol, id]) => {
                    if (data[id]) {
                        newPrices[symbol] = data[id].usd
                    }
                })

                setPrices(newPrices)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching token prices:', error)
                // Fallback hardcoded prices just in case
                setPrices({
                    'WLD': 3.50,
                    'ETH': 3500,
                    'WETH': 3500,
                    'USDC': 1.00,
                    'WBTC': 95000,
                    'sDAI': 1.05
                })
                setIsLoading(false)
            }
        }

        fetchPrices()
        const interval = setInterval(fetchPrices, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    const getPrice = (symbol: string) => {
        return prices[symbol] || 0
    }

    return { prices, getPrice, isLoading }
}
