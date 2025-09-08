import { Features } from '@/modules/landing/components/Features'
import { Footer } from '@/modules/landing/components/Footer'
import { Hero } from '@/modules/landing/components/Hero'
import { HowItWorks } from '@/modules/landing/components/HowItWorks'
import { Navbar } from '@/modules/landing/components/Navbar'

export function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
