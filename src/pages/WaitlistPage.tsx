
import { useState, useEffect, useRef } from "react";
import { Loading } from "@/components/ui/loading";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  HeroSection, 
  PainPointsSection, 
  SolutionSection, 
  CTASection
} from "@/components/waitlist";
import SEO from "@/components/SEO";
import StructuredData from "@/components/waitlist/StructuredData";

const WaitlistPage = () => {
  // Refs for scrolling
  const painPointsRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Used to track if the component has mounted
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  // Initialize component and handle animations
  useEffect(() => {
    setMounted(true);
    
    // Setup intersection observer after component mounts
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // First add the base fade-in animation to the section itself
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            
            // Then animate child elements with slide/fade effects with staggered timing
            const animatedElements = entry.target.querySelectorAll(
              '.transform.transition-all.opacity-0'
            );
            
            // Apply staggered animations to each element
            animatedElements.forEach((element, index) => {
              // Apply a staggered delay based on the element's position
              setTimeout(() => {
                element.classList.remove('opacity-0');
                
                // Remove transform classes that create the initial offset
                if (element.classList.contains('-translate-x-8')) {
                  element.classList.remove('-translate-x-8');
                }
                if (element.classList.contains('translate-x-8')) {
                  element.classList.remove('translate-x-8');
                }
                if (element.classList.contains('translate-y-8')) {
                  element.classList.remove('translate-y-8');
                }
              }, 100 + (index * 150)); // 150ms staggered delay between elements
            });
          }
        });
      },
      { 
        threshold: isMobile ? 0.05 : 0.1, 
        rootMargin: isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px" 
      }
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
  }, [mounted, isMobile]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: isMobile ? 'start' : 'center'
    });
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
    <>
      <SEO 
        title="Content Engine - Turn Your Meeting Insights Into Valuable Content"
        description="Our AI learns your unique voice and extracts the best insights from your meeting transcripts, turning your expertise into LinkedIn posts and newsletters that grow your audience."
        canonical="https://yourcontentengine.ai/"
      />
      <StructuredData />
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
    </>
  );
};

export default WaitlistPage;
