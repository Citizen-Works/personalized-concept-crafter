
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { createResponsiveComponent } from "@/components/ui/responsive-container";

interface EmailSignupFormProps {
  className?: string;
}

// Desktop version of the form
const DesktopForm = ({ 
  email, 
  setEmail, 
  isSubmitting, 
  handleSubmit 
}: { 
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) => (
  <div className="flex flex-row gap-2">
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
);

// Mobile version of the form
const MobileForm = ({ 
  email, 
  setEmail, 
  isSubmitting, 
  handleSubmit 
}: { 
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) => (
  <div className="flex flex-col gap-2">
    <Input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="py-4 text-base bg-white/10 border-white/20"
      required
    />
    <Button 
      type="submit" 
      size="default"
      className="py-4 text-base bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="animate-pulse">Joining...</span>
      ) : (
        <>Join Waitlist <ArrowRight className="ml-2 h-4 w-4" /></>
      )}
    </Button>
  </div>
);

// Responsive form component that switches between desktop and mobile
const ResponsiveForm = createResponsiveComponent<{
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}>(DesktopForm, MobileForm);

// Success confirmation component
const SuccessConfirmation = () => (
  <div className="py-6 flex flex-col items-center space-y-4 text-center bg-white/5 rounded-lg border border-white/10 p-6">
    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
      <Check className="h-8 w-8 text-white" />
    </div>
    <div className="space-y-2">
      <h3 className="text-2xl font-semibold text-white">Thank You!</h3>
      <p className="text-gray-300 max-w-md mx-auto">
        You're on the list! We'll notify you when we launch Content Engine.
      </p>
    </div>
  </div>
);

const EmailSignupForm = ({ className }: EmailSignupFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      // Store the email in the waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);
      
      if (error) throw error;
      
      toast.success("Welcome to the waitlist!", {
        description: "You're in! We'll notify you when Content Engine launches."
      });
      setIsSubmitted(true);
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
      {!isSubmitted ? (
        <>
          <ResponsiveForm
            email={email}
            setEmail={setEmail}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
          <p className="text-xs md:text-sm text-gray-400 mt-3 text-center">
            🔒 No credit card required. Join 500+ professionals already on the waitlist.
          </p>
        </>
      ) : (
        <SuccessConfirmation />
      )}
    </form>
  );
};

export default EmailSignupForm;
