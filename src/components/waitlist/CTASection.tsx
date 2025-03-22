
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, Linkedin, Mail, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { createResponsiveComponent } from "@/components/ui/responsive-container";

// Desktop testimonial component
const DesktopTestimonial = ({ 
  name, 
  role, 
  content 
}: { 
  name: string; 
  role: string; 
  content: string; 
}) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-md transform transition-all hover:scale-105">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-700"></div>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
    <p className="text-gray-300">{content}</p>
  </div>
);

// Mobile testimonial component
const MobileTestimonial = ({ 
  name, 
  role, 
  content 
}: { 
  name: string; 
  role: string; 
  content: string; 
}) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-xl shadow-md transform transition-all hover:scale-105">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
      <div>
        <p className="font-semibold text-white text-sm">{name}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>
    </div>
    <p className="text-gray-300 text-sm">{content}</p>
  </div>
);

// Responsive testimonial
const ResponsiveTestimonial = createResponsiveComponent<{
  name: string;
  role: string;
  content: string;
}>(DesktopTestimonial, MobileTestimonial);

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Marketing Consultant",
      content: "I've tried other AI tools but they never sounded like me. Content Engine actually captures my voice and saves me hours every week."
    },
    {
      name: "Mark T.",
      role: "Executive Coach",
      content: "My LinkedIn engagement has increased 4x since using Content Engine. The content is so authentic that my clients think I've hired a ghost writer."
    },
    {
      name: "Aisha R.",
      role: "Startup Founder",
      content: "This tool transformed how I create content. I upload my meeting notes and Content Engine pulls out all the valuable insights I'd never have time to write about."
    }
  ];

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
      const { error } = await supabase
        .from('waitlist')
        .insert({ email });
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
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
      <div className="bg-black py-16 md:py-20 px-4 relative animate-fade-in">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/70 z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-white">
            What Early Users Are Saying
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <ResponsiveTestimonial
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                />
              </div>
            ))}
          </div>
          
          {/* Final CTA */}
          <div id="waitlist-form" className="backdrop-blur-md bg-black/50 border border-white/10 p-6 md:p-10 rounded-2xl shadow-xl max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">
              Be First to Experience the Content Engine
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
              Join our exclusive waitlist and transform your content creation process when we launch.
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div className={isMobile ? "flex flex-col gap-2" : "flex gap-2"}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${isMobile ? 'py-4 text-base' : 'py-6 text-lg flex-1'} bg-white/10 border-white/20`}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size={isMobile ? "default" : "lg"}
                    className={`${isMobile ? 'py-4 text-base w-full' : 'px-8 py-6 text-lg'} bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500`}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Joining...</span>
                    ) : (
                      <>Join <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" /></>
                    )}
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-3">
                  No spam. We'll only email you about Content Engine updates and early access.
                </p>
              </form>
            ) : (
              <div className="py-6 flex flex-col items-center space-y-4 text-center">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                  <Check className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">Thank You!</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    You're on the list! We'll notify you when we launch Content Engine.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-10 md:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6 md:mb-8">
            <a href="#" className="transition-transform hover:scale-110">
              <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-purple-400 transition-colors" />
            </a>
            <a href="#" className="transition-transform hover:scale-110">
              <Mail className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-purple-400 transition-colors" />
            </a>
            <a href="#" className="transition-transform hover:scale-110">
              <FileText className="h-5 w-5 md:h-6 md:w-6 text-gray-400 hover:text-purple-400 transition-colors" />
            </a>
          </div>
          <p className="text-sm md:text-base text-gray-400">
            © {new Date().getFullYear()} Content Engine. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default CTASection;
