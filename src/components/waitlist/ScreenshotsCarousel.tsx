
import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Screenshot {
  src: string;
  alt: string;
  caption?: string;
}

interface ScreenshotsCarouselProps {
  className?: string;
  title?: string;
  description?: string;
}

const ScreenshotsCarousel = ({ className, title, description }: ScreenshotsCarouselProps) => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  
  // Replace these with actual screenshots from your app
  const screenshots: Screenshot[] = [
    {
      src: "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?auto=format&fit=crop&w=1200&q=80",
      alt: "Dashboard view of Content Engine",
      caption: "Comprehensive dashboard showing content performance metrics"
    },
    {
      src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80",
      alt: "Meeting gold extraction feature",
      caption: "Extract valuable insights from your meeting transcripts"
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      alt: "Content generation interface",
      caption: "Generate platform-specific content with one click"
    },
    {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      alt: "Analytics dashboard",
      caption: "Track engagement and performance across platforms"
    },
  ];

  // Update current index when the carousel changes
  const handleApiChange = (newApi: CarouselApi) => {
    setApi(newApi);
    
    // Set up a callback to track selected index
    if (newApi) {
      newApi.on("select", () => {
        setCurrentIndex(newApi.selectedScrollSnap());
      });
    }
  };

  return (
    <div className={cn("py-16 px-4 text-center bg-black", className)}>
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h2>
      )}
      
      {description && (
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          {description}
        </p>
      )}
      
      <div className="max-w-5xl mx-auto">
        <Carousel 
          className="w-full"
          opts={{
            loop: true,
          }}
          setApi={handleApiChange}
        >
          <CarouselContent>
            {screenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <Card className="border-0 overflow-hidden bg-transparent">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={screenshot.src}
                        alt={screenshot.alt}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    
                    {/* Screenshot overlay with app window styling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-7 bg-black/40 flex items-center px-3">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Caption */}
                    {screenshot.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 text-white">
                        <p className="text-sm md:text-base font-medium">{screenshot.caption}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <CarouselPrevious className={cn(
              "static mx-0 bg-white/10 hover:bg-white/20 border-white/20",
              isMobile ? "h-8 w-8" : "h-10 w-10"
            )} />
            
            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 px-4">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    currentIndex === index 
                      ? "bg-purple-500 scale-125" 
                      : "bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <CarouselNext className={cn(
              "static mx-0 bg-white/10 hover:bg-white/20 border-white/20",
              isMobile ? "h-8 w-8" : "h-10 w-10"
            )} />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default ScreenshotsCarousel;
