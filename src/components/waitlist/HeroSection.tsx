
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Please enter a valid email",
        description: "We need your email to add you to the waitlist.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission - in a real app, this would call an API
    setTimeout(() => {
      toast({
        title: "Welcome to the waitlist!",
        description: "You're in! We'll notify you when Content Engine launches.",
      });
      setEmail("");
      setIsSubmitting(false);
      
      // In a real implementation, you would save the email to your database
      console.log("Email submitted:", email);
    }, 1000);
  };

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
        <div className="mb-3 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-white">Limited Early Access. Join the Waitlist</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent relative">
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
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white max-w-4xl mx-auto text-balance">
          Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Meeting Gold</span> Into Content That Grows Your Business
        </h2>
        
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
          Our AI learns <span className="font-semibold">your unique voice</span> and extracts the best insights from your meeting transcripts, turning your expertise into LinkedIn posts and newsletters that grow your audience.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          <div className="flex items-center gap-2 text-left">
            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Save 5+ hours every week on content creation</span>
          </div>
          <div className="flex items-center gap-2 text-left">
            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Content that sounds authentically like you</span>
          </div>
          <div className="flex items-center gap-2 text-left">
            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Consistent posting without the writing stress</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12 px-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-6 text-lg bg-white/10 border-white/20"
              required
            />
            <Button 
              type="submit" 
              size="lg" 
              className="py-6 text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Joining...</span>
              ) : (
                <>Join Waitlist <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-3 text-center">
            🔒 No credit card required. Join 500+ professionals already on the waitlist.
          </p>
        </form>
        
        <div className="flex justify-center mb-12">
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-6 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
            onClick={() => scrollToSection(painPointsRef)}
          >
            See How It Works <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 opacity-60">
          <div className="text-white text-sm font-semibold">Trusted by professionals from:</div>
          <div className="text-white/80 font-semibold">Microsoft</div>
          <div className="text-white/80 font-semibold">LinkedIn</div>
          <div className="text-white/80 font-semibold">Deloitte</div>
          <div className="text-white/80 font-semibold">McKinsey</div>
          <div className="text-white/80 font-semibold">Accenture</div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="h-8 w-8 rotate-90 text-gray-300" />
      </div>
    </div>
  );
};

export default HeroSection;
