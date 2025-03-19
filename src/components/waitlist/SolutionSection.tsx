
import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Linkedin, Clock, FileText, Brain } from "lucide-react";

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
      className="py-20 px-4 opacity-0 relative bg-black"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/70 z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
          Introducing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">Your Content Engine</span>
        </h2>
        
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-16">
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
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Your Voice, Enhanced</h3>
                <p className="text-gray-300">
                  Your Content Engine learns your unique communication style, tone, and expertise to create content that sounds authentically like you.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Linkedin className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Platform-Optimized Content</h3>
                <p className="text-gray-300">
                  Generate content specifically formatted for <span className="font-medium">{CONTENT_TYPES[currentContentIndex]}</span> that performs well on each platform.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Hours Saved Every Week</h3>
                <p className="text-gray-300">
                  Your Content Engine turns a single idea into multiple pieces of content in minutes, not hours, while maintaining your authentic voice.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Meeting Notes Feature Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-10 rounded-2xl shadow-xl mb-20 border border-white/10 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">
            Transform Your Meeting Transcripts into Content Gold
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80" 
                alt="Meeting notes and transcripts"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Mine Your Meeting Gold</h4>
                  <p className="text-gray-300">
                    Upload your meeting transcripts and your Content Engine will identify key insights, stories, and expertise that can be transformed into high-value content.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">Your Expertise, Leveraged</h4>
                  <p className="text-gray-300">
                    The world wants to know what you know. Your Content Engine extracts the valuable insights you're already sharing in meetings and packages them for your audience.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white">From Notes to Content in Minutes</h4>
                  <p className="text-gray-300">
                    What used to take hours of planning, writing, and editing now happens automatically. Your Content Engine turns your buried insights into content that helps you grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-10 rounded-2xl shadow-xl mb-20 border border-white/10 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
            How Your Content Engine Works
          </h3>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-400 font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Analyze Your Style</h4>
              <p className="text-gray-300">
                Your Content Engine studies your existing content and meeting transcripts to learn your unique voice, terminology, and style.
              </p>
            </Card>
            
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-400 font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Extract Key Ideas</h4>
              <p className="text-gray-300">
                Your Content Engine identifies the most valuable insights from your meetings and organizes them into potential content pieces.
              </p>
            </Card>
            
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-purple-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-400 font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">Generate & Refine</h4>
              <p className="text-gray-300">
                Your Content Engine generates platform-specific content that sounds like you, then easily refine and publish to grow your audience.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSection;
