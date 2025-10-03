import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { StatsSection } from "./StatsSection";
import { StorySection } from "./StorySection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <StorySection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};