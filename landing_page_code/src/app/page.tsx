import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import PlatformGrid from '@/components/home/PlatformGrid'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturesSection from '@/components/home/FeaturesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import BlogSection from '@/components/home/BlogSection'
import FaqSection from '@/components/home/FaqSection'
import CtaBanner from '@/components/home/CtaBanner'
import PaymentSection from '@/components/home/PaymentSection'
import VietnamMapSection from '@/components/home/VietnamMapSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <PlatformGrid />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <ReviewsSection />
      <BlogSection />
      <FaqSection />
      <CtaBanner />
      <PaymentSection />
      <VietnamMapSection />
    </>
  )
}
