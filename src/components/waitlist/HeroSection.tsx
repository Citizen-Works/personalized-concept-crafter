
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroHeading from "./HeroHeading";
import EmailSignupForm from "./EmailSignupForm";
import BenefitsList from "./BenefitsList";
import TrustedBySection from "./TrustedBySection";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  painPointsRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = ({ scrollToSection, painPointsRef }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  return (
    <div 
      ref={heroRef}
      className="relative flex-1 flex flex-col items-center justify-center px-1 sm:px-2 py-12 sm:py-20 md:py-28 lg:py-36 overflow-hidden min-h-[90vh] sm:min-h-[100vh] bg-dark/95"
    >
      <HeroBackground />
      
      <div className="max-w-[98vw] w-full mx-auto z-10 text-center">
        <div className="mb-4 sm:mb-6 inline-flex items-center justify-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
          <span className="text-xs sm:text-sm font-semibold text-white">Limited Early Access. Join the Waitlist</span>
        </div>
        
        <HeroHeading />
        
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-5xl mx-auto mb-6 sm:mb-10 px-2 mt-3 sm:mt-4">
          Our AI learns <span className="font-semibold text-secondary">your unique voice</span> and extracts the best insights from your meeting transcripts, turning your expertise into LinkedIn posts and newsletters that grow your audience.
        </p>
        
        <BenefitsList />
        
        <EmailSignupForm />
        
        <div className="flex justify-center mb-10 sm:mb-16">
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "lg"}
            className={`${isMobile ? 'text-base px-6 py-4' : 'text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-7'} border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white`}
            onClick={() => scrollToSection(painPointsRef)}
          >
            See How It Works <ArrowRight className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </div>
        
        <TrustedBySection />
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <ArrowRight className="h-7 w-7 rotate-90 text-secondary" />
      </div>
    </div>
  );
};

export default HeroSection;
