
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
      // Store email in Supabase - use the .from().insert() method with correct options
      const { error } = await supabase
        .from('waitlist')
        .insert({ email }, { 
          returning: 'minimal', // Don't return the inserted row
          count: 'none' // Don't count affected rows
        });
      
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Image-Embedded Text */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
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
                backgroundImage: `url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
              }}
            >
              GENIUS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            AI-powered content creation tailored to your unique business voice.
            Be the first to experience the future of content generation.
          </p>

          {/* Waitlist Form */}
          <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Join the Waitlist</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Be among the first to try our revolutionary content creation platform when we launch.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="animate-pulse">Joining...</span>
                    ) : (
                      <>Join <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-6 flex flex-col items-center space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Thank you for joining our waitlist! We'll notify you when we launch.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Coming Soon</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-3">AI Content Generation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate high-quality content drafts that match your unique voice and style.
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Style Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI studies your writing to understand your tone, vocabulary, and structure.
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Meeting Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Extract content ideas automatically from your meeting transcripts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
