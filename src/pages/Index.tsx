
import { Button } from "@/components/ui/button";
import { PenTool, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary p-4 rounded-full">
            <PenTool className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight tracking-tight">
          AI-Powered Content Generation for Consultants &amp; Business Owners
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto">
          Create personalized content that resonates with your audience, based on your unique business voice and expertise.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link to="/register">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">
              Sign In
            </Link>
          </Button>
        </div>

        <div className="pt-16 grid gap-8 md:grid-cols-3">
          <div className="space-y-3 p-6 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-black/30 shadow-sm border border-white/20 transform transition-all hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">AI Content Generation</h3>
            <p className="text-muted-foreground">
              Generate high-quality content drafts that match your unique voice and style.
            </p>
          </div>
          
          <div className="space-y-3 p-6 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-black/30 shadow-sm border border-white/20 transform transition-all hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">Style Analysis</h3>
            <p className="text-muted-foreground">
              Our AI studies your writing to understand your tone, vocabulary, and structure.
            </p>
          </div>
          
          <div className="space-y-3 p-6 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-black/30 shadow-sm border border-white/20 transform transition-all hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold">Meeting Integration</h3>
            <p className="text-muted-foreground">
              Extract content ideas automatically from your meeting transcripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
