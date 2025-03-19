
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ROLES = [
  "Consultant",
  "Advisor",
  "Executive",
  "Entrepreneur",
  "Innovator",
  "Thought Leader"
];

interface HeroSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  painPointsRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = ({ scrollToSection, painPointsRef }: HeroSectionProps) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Helper function to determine if we should use "an" instead of "a"
  const getArticle = (word: string) => {
    return /^[aeiou]/i.test(word) ? "an" : "a";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentRoleIndex(prevIndex => (prevIndex + 1) % ROLES.length);
        setIsAnimating(false);
      }, 300);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden min-h-screen bg-black/95"
    >
      <div 
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'luminosity',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-1"></div>
      
      <div className="max-w-6xl mx-auto z-10 text-center">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent relative">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-90 blur-2xl -z-10 rounded-3xl" />
          
          <span 
            className="bg-clip-text text-transparent bg-blend-screen"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2000&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackgroundClip: 'text',
            }}
          >
            CONTENT
          </span>
          <br />
          <span 
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhaW5ib3d8ZW58MHx8MHx8fDA%3D')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackgroundClip: 'text',
            }}
          >
            ENGINE
          </span>
        </h1>
        
        <div className="mb-8 text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto h-12 overflow-hidden">
          <div className="h-12 flex items-center justify-center">
            <div className="h-full overflow-hidden">
              <div 
                className={`flex items-center transition-all duration-300 ${
                  isAnimating ? "opacity-0 transform -translate-y-full" : "opacity-100 transform translate-y-0"
                }`}
              >
                <span className="font-bold mr-2">You are {getArticle(ROLES[currentRoleIndex])}</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  {ROLES[currentRoleIndex]}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          Turn your expertise into compelling content that grows your audience and business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
            onClick={() => scrollToSection(painPointsRef)}
          >
            Learn More <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-6 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
            onClick={() => {
              const formElement = document.getElementById('waitlist-form');
              formElement?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Join Waitlist
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="h-8 w-8 rotate-90 text-gray-300" />
      </div>
    </div>
  );
};

export default HeroSection;
