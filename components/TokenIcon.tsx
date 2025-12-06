'use client'

import { useState } from 'react'
import { getTokenIcon } from '@/config/tokenIcons'

interface TokenIconProps {
    symbol: string
    size?: number
    className?: string
}

export function TokenIcon({ symbol, size = 24, className = '' }: TokenIconProps) {
    const [hasError, setHasError] = useState(false)
    const iconUrl = getTokenIcon(symbol)

    if (hasError || !iconUrl) {
        // Fallback gradient circle with letter
        return (
            <div
                className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ${className}`}
                style={{ width: size, height: size, fontSize: size * 0.4 }}
            >
                {symbol?.[0]?.toUpperCase() || '?'}
            </div>
        )
    }

    return (
        <img
            src={iconUrl}
            alt={symbol}
            className={`rounded-full ${className}`}
            style={{ width: size, height: size }}
            onError={() => setHasError(true)}
        />
    )
}
