
import React, { useRef } from 'react';
import HeroSection from '@/components/waitlist/HeroSection';
import PainPointsSection from '@/components/waitlist/PainPointsSection';
import SolutionSection from '@/components/waitlist/SolutionSection';
import BenefitsList from '@/components/waitlist/BenefitsList';
import CTASection from '@/components/waitlist/CTASection';
import TrustedBySection from '@/components/waitlist/TrustedBySection';
import ScreenshotsCarousel from '@/components/waitlist/ScreenshotsCarousel';
import StructuredData from '@/components/waitlist/StructuredData';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const WaitlistPage = () => {
  // Create refs for each section that needs scrolling to
  const painPointsRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  
  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Engine | AI-Powered Content Creation for Consultants & Business Owners</title>
        <meta 
          name="description" 
          content="Join the waitlist for Content Engine - the AI-powered content creation platform designed specifically for consultants and business owners. Generate personalized LinkedIn posts, newsletters, and marketing material that matches your unique voice and expertise."
        />
      </Helmet>
      <StructuredData />
      
      <div className="relative bg-gradient-to-b from-night to-night/90 min-h-screen text-white">
        <div className="container mx-auto px-4 pt-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Content Engine Logo" className="h-8 w-8" />
              <span className="font-bold text-xl text-white">Content Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-white hover:text-fluorescent-cyan hover:underline">
                Sign In
              </Link>
            </div>
          </div>
          
          <Alert className="my-4 bg-fandango/20 border-fandango">
            <AlertCircle className="h-4 w-4 text-fluorescent-cyan" />
            <AlertDescription className="text-white">
              Public registration is currently restricted. Please join our waitlist to be notified when registration opens.
            </AlertDescription>
          </Alert>
        </div>
        
        <HeroSection scrollToSection={scrollToSection} painPointsRef={painPointsRef} />
        <PainPointsSection scrollToSection={scrollToSection} solutionRef={solutionRef} />
        <SolutionSection />
        <BenefitsList />
        <ScreenshotsCarousel />
        <TrustedBySection />
        <CTASection />
        
        <footer className="bg-night/80 border-t border-white/10 mt-24 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-white">
            <p>© {new Date().getFullYear()} Content Engine. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default WaitlistPage;
