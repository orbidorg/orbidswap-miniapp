'use client'

import { useMemo } from 'react'

interface IdenticonProps {
    address: string
    size?: number
    className?: string
}

// Generate a deterministic color palette from an address
function generateColors(address: string): string[] {
    const hash = address.toLowerCase().replace('0x', '')
    const colors: string[] = []

    // Generate 5 colors from the address hash
    for (let i = 0; i < 5; i++) {
        const segment = hash.slice(i * 8, (i + 1) * 8)
        const hue = parseInt(segment.slice(0, 3), 16) % 360
        const saturation = 60 + (parseInt(segment.slice(3, 5), 16) % 30)
        const lightness = 45 + (parseInt(segment.slice(5, 7), 16) % 20)
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }

    return colors
}

// Generate a 5x5 symmetric pattern from address
function generatePattern(address: string): boolean[][] {
    const hash = address.toLowerCase().replace('0x', '')
    const pattern: boolean[][] = []

    // Generate a 5x5 grid (only need to generate half due to symmetry)
    for (let row = 0; row < 5; row++) {
        pattern[row] = []
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col
            const charCode = parseInt(hash.charAt(index % hash.length), 16)
            pattern[row][col] = charCode > 7
        }
        // Mirror for symmetry
        pattern[row][3] = pattern[row][1]
        pattern[row][4] = pattern[row][0]
    }

    return pattern
}

export function Identicon({ address, size = 40, className = '' }: IdenticonProps) {
    const { colors, pattern } = useMemo(() => ({
        colors: generateColors(address),
        pattern: generatePattern(address)
    }), [address])

    const cellSize = size / 5
    const bgColor = colors[0]
    const fgColor = colors[1]

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`rounded-full ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            {pattern.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    cell && (
                        <rect
                            key={`${rowIndex}-${colIndex}`}
                            x={colIndex * cellSize}
                            y={rowIndex * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill={fgColor}
                        />
                    )
                ))
            )}
        </svg>
    )
}

// Alternative: Gradient-based identicon (smoother look)
export function GradientIdenticon({ address, size = 40, className = '' }: IdenticonProps) {
    const colors = useMemo(() => generateColors(address), [address])
    const gradientId = useMemo(() => `gradient-${address.slice(2, 10)}`, [address])

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`rounded-full ${className}`}
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="50%" stopColor={colors[1]} />
                    <stop offset="100%" stopColor={colors[2]} />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
            {/* Inner pattern */}
            <circle
                cx="50"
                cy="50"
                r="25"
                fill={colors[3]}
                opacity="0.6"
            />
            <circle
                cx="35"
                cy="35"
                r="10"
                fill={colors[4]}
                opacity="0.8"
            />
        </svg>
    )
}
