import { Header } from '@/components/Header'
import { SwapCard } from '@/components/SwapCard'
import { Footer } from '@/components/Footer'

export default function SwapPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white font-sans selection:bg-black dark:selection:bg-[#4c82fb] selection:text-white bg-noise">
            <Header />
            <main className="flex flex-col items-center justify-center p-4 pt-28 pb-20 min-h-[80vh]">
                <SwapCard />
            </main>
            <Footer />
        </div>
    )
}
