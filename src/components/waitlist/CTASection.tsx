
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, Linkedin, Mail, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CTASection = () => {
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

  return (
    <>
      {/* Social Proof & CTA Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20 px-4 opacity-0 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What Early Users Are Saying
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Sarah J.</p>
                  <p className="text-sm text-gray-500">Marketing Consultant</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "I've tried other AI tools but they never sounded like me. Content Engine actually captures my voice and saves me hours every week."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Mark T.</p>
                  <p className="text-sm text-gray-500">Executive Coach</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "My LinkedIn engagement has increased 4x since using Content Engine. The content is so authentic that my clients think I've hired a ghost writer."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md sm:col-span-2 lg:col-span-1 transform transition-all hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="font-semibold">Aisha R.</p>
                  <p className="text-sm text-gray-500">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "This tool transformed how I create content. I upload my meeting notes and Content Engine pulls out all the valuable insights I'd never have time to write about."
              </p>
            </div>
          </div>
          
          {/* Final CTA */}
          <div id="waitlist-form" className="backdrop-blur-md bg-white/50 dark:bg-black/50 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Be First to Experience Content Engine
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
                    className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Joining...</span>
                    ) : (
                      <>Join <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  No spam. We'll only email you about Content Engine updates and early access.
                </p>
              </form>
            ) : (
              <div className="py-6 flex flex-col items-center space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Thank You!</h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                    You're on the list! We'll notify you when we launch Content Engine.
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
            <Linkedin className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
            <Mail className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
            <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Content Engine. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default CTASection;
