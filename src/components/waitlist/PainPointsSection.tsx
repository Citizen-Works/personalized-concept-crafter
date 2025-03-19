
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp, XCircle, FileText } from "lucide-react";

interface PainPointsSectionProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  solutionRef: React.RefObject<HTMLDivElement>;
}

const PainPointsSection = ({ scrollToSection, solutionRef }: PainPointsSectionProps) => {
  const painPointsRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={painPointsRef}
      className="bg-black py-20 px-4 opacity-0 min-h-screen flex items-center relative"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black/80 z-0"></div>
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white transform transition-all duration-700 translate-y-8 opacity-0">
          The Content Creation <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">Struggle</span> Is Real
        </h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-md transform transition-all duration-700 delay-150 -translate-x-8 opacity-0 hover:scale-105">
              <Clock className="h-8 w-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">No Time for Content</h3>
                <p className="text-gray-300">
                  You're busy working with clients and running your business. Finding time to consistently create content feels impossible.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-md transform transition-all duration-700 delay-300 -translate-x-8 opacity-0 hover:scale-105">
              <TrendingUp className="h-8 w-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">The Competition Is Gaining Ground</h3>
                <p className="text-gray-300">
                  Your competitors are posting every day and building their audiences. Their visibility is growing while yours stagnates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-md transform transition-all duration-700 delay-450 -translate-x-8 opacity-0 hover:scale-105">
              <FileText className="h-8 w-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Meeting Gold Stays Buried</h3>
                <p className="text-gray-300">
                  Your meeting transcripts and notes are full of incredible insights and ideas, but they remain trapped in documents nobody sees.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 delay-300 translate-x-8 opacity-0">
            <img 
              src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80" 
              alt="Person stressed at computer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
              <p className="text-white text-xl font-semibold mb-2">
                "I know there's gold in my client meetings, but it always stays buried in my notes."
              </p>
              <p className="text-white/80">- Every Busy Professional</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 mb-8 transform transition-all duration-700 delay-600 translate-y-8 opacity-0">
          <h3 className="text-3xl font-bold mb-6 text-white">
            You have the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ideas and expertise</span>...
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            You just need a way to efficiently transform them into content that resonates with your audience.
          </p>
          
          <Button 
            size="lg" 
            className="mt-8 text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
            onClick={() => scrollToSection(solutionRef)}
          >
            See the Solution <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PainPointsSection;
