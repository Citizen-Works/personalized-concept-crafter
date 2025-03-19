
import { useState, useEffect, useRef } from "react";
import { Loading } from "@/components/ui/loading";
import { 
  HeroSection, 
  PainPointsSection, 
  SolutionSection, 
  CTASection 
} from "@/components/waitlist";

const WaitlistPage = () => {
  // Refs for scrolling
  const painPointsRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Used to track if the component has mounted
  const [mounted, setMounted] = useState(false);

  // Initialize component and handle animations
  useEffect(() => {
    setMounted(true);
    
    // Setup intersection observer after component mounts
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    // Get all sections that should be animated on scroll
    const sections = document.querySelectorAll('.opacity-0');
    
    // Observe each section
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [mounted]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Apply initial animation classes
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading fullScreen size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <HeroSection 
        scrollToSection={scrollToSection} 
        painPointsRef={painPointsRef} 
      />
      
      <div ref={painPointsRef}>
        <PainPointsSection 
          scrollToSection={scrollToSection} 
          solutionRef={solutionRef} 
        />
      </div>
      
      <div ref={solutionRef}>
        <SolutionSection />
      </div>
      
      <div ref={ctaRef}>
        <CTASection />
      </div>
    </div>
  );
};

export default WaitlistPage;
