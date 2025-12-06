'use client'

import { Header } from '@/components/Header'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiMessageCircle } from 'react-icons/fi'
import { useState } from 'react'
import Link from 'next/link'

const faqs = [
    {
        q: "What is OrbidSwap?",
        a: "A DEX built for World Chain. Swap tokens instantly and securely within World App."
    },
    {
        q: "How do I swap?",
        a: "Go to the 'Swap' tab, select the tokens you want to trade, enter an amount, and swipe to confirm."
    },
    {
        q: "Why verify World ID?",
        a: "Verification proves you're human, unlocking features like zero-gas transactions (coming soon)."
    },
    {
        q: "Are my funds safe?",
        a: "Yes. OrbidSwap is non-custodial. You always retain control of your assets in your wallet."
    }
]

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans bg-noise">
            <Header />

            <main className="pt-24 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-2">Help Center</h1>
                    <p className="text-gray-500 dark:text-[#98a1c0] text-sm mb-8">
                        Common questions and support.
                    </p>

                    <div className="space-y-3 mb-8">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-[#131a2a] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#293249]"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium text-sm"
                                >
                                    {faq.q}
                                    <FiChevronDown
                                        className={`transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4 text-xs text-gray-500 dark:text-[#98a1c0] leading-relaxed"
                                        >
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-500/10 rounded-2xl p-5 text-center border border-blue-500/20">
                        <p className="text-sm font-semibold mb-3">Need more help?</p>
                        <Link href="/" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium w-full">
                            <FiMessageCircle />
                            Contact Support
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
