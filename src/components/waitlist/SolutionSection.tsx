
import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Linkedin, Clock } from "lucide-react";

const CONTENT_TYPES = [
  "LinkedIn posts",
  "Newsletters",
  "Email sequences",
  "Thought leadership",
  "Case studies"
];

const SolutionSection = () => {
  const solutionRef = useRef<HTMLDivElement>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Content type animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex(prevIndex => (prevIndex + 1) % CONTENT_TYPES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
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
  );
};

export default SolutionSection;
