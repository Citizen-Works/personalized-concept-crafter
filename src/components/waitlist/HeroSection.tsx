
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroHeading from "./HeroHeading";
import EmailSignupForm from "./EmailSignupForm";
import BenefitsList from "./BenefitsList";
import TrustedBySection from "./TrustedBySection";

interface HeroSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  painPointsRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = ({ scrollToSection, painPointsRef }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={heroRef}
      className="relative flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-16 sm:py-24 md:py-32 overflow-hidden min-h-[105vh] bg-black/95"
    >
      <HeroBackground />
      
      <div className="max-w-[95vw] w-full mx-auto z-10 text-center">
        <div className="mb-6 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-white">Limited Early Access. Join the Waitlist</span>
        </div>
        
        <HeroHeading />
        
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-10 px-4 mt-2">
          Our AI learns <span className="font-semibold">your unique voice</span> and extracts the best insights from your meeting transcripts, turning your expertise into LinkedIn posts and newsletters that grow your audience.
        </p>
        
        <BenefitsList />
        
        <EmailSignupForm />
        
        <div className="flex justify-center mb-16">
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-7 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
            onClick={() => scrollToSection(painPointsRef)}
          >
            See How It Works <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <TrustedBySection />
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <ArrowRight className="h-7 w-7 rotate-90 text-gray-300" />
      </div>
    </div>
  );
};

export default HeroSection;
