'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-[#131a2a] text-gray-500 dark:text-[#98a1c0]">
                <div className="w-5 h-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#131a2a] hover:bg-gray-200 dark:hover:bg-[#293249] text-gray-900 dark:text-white transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
    )
}
