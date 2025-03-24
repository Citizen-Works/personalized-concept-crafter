
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, Sparkles, BarChart3 } from "lucide-react";

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  const isMobile = useIsMobile();
  const IconComponent = icon;
  
  return (
    <div className="relative p-6 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:scale-105 transition-transform">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} text-white`}>{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const SolutionSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="bg-black py-16 md:py-24 px-4 relative text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 z-0"></div>
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 mx-auto leading-tight">
            <span>Introducing </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">Content Engine</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            AI-powered content creation that captures your unique voice and expertise
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-purple-500" />}
            title="Meeting Gold Extraction"
            description="Automatically extract valuable insights from your meeting transcripts and turn them into compelling content."
          />
          
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-purple-500" />}
            title="Voice Matching Technology"
            description="Our AI learns your unique communication style, ensuring all content sounds authentically like you."
          />
          
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
            title="Multi-Channel Publishing"
            description="Create content optimized for LinkedIn posts, newsletters, and more—all from a single source of truth."
          />
        </div>
        
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-5 text-white">
              How Content Engine Works
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-400">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Connect Your Sources</h4>
                <p className="text-gray-300 text-center">Upload meeting transcripts, notes, or speak directly into the platform.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-pink-400">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Extract & Generate</h4>
                <p className="text-gray-300 text-center">AI identifies key insights and creates content drafts that match your voice.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-400">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Review & Publish</h4>
                <p className="text-gray-300 text-center">Make quick edits and publish directly to your preferred platforms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SolutionSection.displayName = "SolutionSection";

export default SolutionSection;
