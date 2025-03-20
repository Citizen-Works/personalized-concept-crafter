
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface EmailSignupFormProps {
  className?: string;
}

const EmailSignupForm = ({ className }: EmailSignupFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email", {
        description: "We need your email to add you to the waitlist."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store the email in the waitlist table (this will be created via SQL later)
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);
      
      if (error) throw error;
      
      toast.success("Welcome to the waitlist!", {
        description: "You're in! We'll notify you when Content Engine launches."
      });
      setEmail("");
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast.error("Failed to join waitlist", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`max-w-md mx-auto mb-8 md:mb-12 px-4 ${className}`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${isMobile ? 'py-4' : 'py-6'} text-base md:text-lg bg-white/10 border-white/20`}
          required
        />
        <Button 
          type="submit" 
          size={isMobile ? "default" : "lg"} 
          className={`${isMobile ? 'py-4 mt-2' : 'py-6'} text-base md:text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Joining...</span>
          ) : (
            <>Join Waitlist <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" /></>
          )}
        </Button>
      </div>
      <p className="text-xs md:text-sm text-gray-400 mt-3 text-center">
        🔒 No credit card required. Join 500+ professionals already on the waitlist.
      </p>
    </form>
  );
};

export default EmailSignupForm;
