
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Linkedin, Mail, FileText, Sparkles, XCircle, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

// Roles for the animation
const ROLES = [
  "Consultant",
  "Advisor",
  "Coach",
  "Founder",
  "Executive",
  "Thought Leader"
];

// Content types for animation
const CONTENT_TYPES = [
  "LinkedIn posts",
  "Newsletters",
  "Email sequences",
  "Thought leadership",
  "Case studies"
];

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Animation states
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const painPointsRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  
  // Used to track if the component has mounted
  const [mounted, setMounted] = useState(false);

  // Role animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex(prevIndex => (prevIndex + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Content type animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex(prevIndex => (prevIndex + 1) % CONTENT_TYPES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
      { threshold: 0.1 }
    );

    // Get all sections that should be animated on scroll
    const sections = [
      heroRef.current, 
      painPointsRef.current, 
      solutionRef.current
    ].filter(Boolean);
    
    // Observe each section
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Store email in Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert({ email });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when we launch!",
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Apply initial animation classes
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden min-h-screen"
      >
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
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
              GENIUS
            </span>
          </h1>
          
          <div className="mb-8 text-2xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto overflow-hidden h-12">
            <div className="animate-fade-in">
              <span className="font-bold">You are a </span>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {ROLES[currentRoleIndex]}
              </span>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Turn your expertise into compelling content that grows your audience and business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => scrollToSection(painPointsRef)}
            >
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
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
          <ArrowRight className="h-8 w-8 rotate-90 text-gray-500" />
        </div>
      </div>

      {/* Pain Points Section */}
      <div 
        ref={painPointsRef}
        className="bg-gray-50 dark:bg-gray-900 py-20 px-4 opacity-0 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            The Content Creation <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Struggle</span> Is Real
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transform transition-all hover:scale-105">
                <Clock className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Time for Content</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You're busy working with clients and running your business. Finding time to consistently create content feels impossible.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transform transition-all hover:scale-105">
                <TrendingUp className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">The Competition Is Gaining Ground</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your competitors are posting every day and building their audiences. Their visibility is growing while yours stagnates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transform transition-all hover:scale-105">
                <XCircle className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generic AI Content Isn't Working</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You've tried AI tools, but they produce generic content that doesn't capture your unique voice and expertise.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80" 
                alt="Person stressed at computer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-xl font-semibold mb-2">
                  "I know I need to be creating content, but it always falls to the bottom of my to-do list."
                </p>
                <p className="text-white/80">- Every Busy Professional</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 mb-8">
            <h3 className="text-3xl font-bold mb-6">
              You have the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ideas and expertise</span>...
            </h3>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              You just need a way to efficiently transform them into content that resonates with your audience.
            </p>
            
            <Button 
              size="lg" 
              className="mt-8 text-lg"
              onClick={() => scrollToSection(solutionRef)}
            >
              See the Solution <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div 
        ref={solutionRef}
        className="py-20 px-4 opacity-0"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Introducing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600">Content Genius</span>
          </h2>
          
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            AI-powered content creation that captures YOUR unique voice and expertise
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80" 
                alt="Content creation process"
                className="rounded-xl shadow-xl"
              />
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Voice, Enhanced</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI learns your unique communication style, tone, and expertise to create content that sounds authentically like you.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Platform-Optimized Content</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate content specifically formatted for <span className="font-medium">{CONTENT_TYPES[currentContentIndex]}</span> that performs well on each platform.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hours Saved Every Week</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Turn a single idea into multiple pieces of content in minutes, not hours, while maintaining your authentic voice.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-10 rounded-2xl shadow-xl mb-20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              How Content Genius Works
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow">
                <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">1</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Analyze Your Style</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI studies your existing content to learn your unique voice, terminology, and style.
                </p>
              </Card>
              
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow">
                <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">2</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Capture Your Ideas</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Input your ideas or use our prompts to spark new content directions that align with your expertise.
                </p>
              </Card>
              
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow">
                <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">3</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Generate & Refine</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate platform-specific content that sounds like you, then easily refine and publish.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof & CTA Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What Early Users Are Saying
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Sarah J.</p>
                  <p className="text-sm text-gray-500">Marketing Consultant</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "I've tried other AI tools but they never sounded like me. Content Genius actually captures my voice and saves me hours every week."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Mark T.</p>
                  <p className="text-sm text-gray-500">Executive Coach</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "My LinkedIn engagement has increased 4x since using Content Genius. The content is so authentic that my clients think I've hired a ghost writer."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Aisha R.</p>
                  <p className="text-sm text-gray-500">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "This tool has changed my content strategy completely. I've doubled my newsletter subscribers in just 2 months with content that truly reflects my expertise."
              </p>
            </div>
          </div>
          
          {/* Final CTA */}
          <div id="waitlist-form" className="backdrop-blur-md bg-white/50 dark:bg-black/50 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Be First to Experience Content Genius
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Join our exclusive waitlist and transform your content creation process when we launch.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 py-6 text-lg"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    className="px-8 py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Joining...</span>
                    ) : (
                      <>Join <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  No spam. We'll only email you about Content Genius updates and early access.
                </p>
              </form>
            ) : (
              <div className="py-6 flex flex-col items-center space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Thank You!</h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                    You're on the list! We'll notify you when we launch Content Genius.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-8">
            <Linkedin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <Mail className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Content Genius. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WaitlistPage;
