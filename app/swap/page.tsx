import { Header } from '@/components/Header'
import { SwapCard } from '@/components/SwapCard'

export default function SwapPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans">
            <Header />
            <main className="flex flex-col items-center p-4 pt-20 pb-8">
                <SwapCard />
            </main>
        </div>
    )
}
