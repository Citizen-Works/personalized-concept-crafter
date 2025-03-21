
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface TrustedBySectionProps {
  className?: string;
}

const TrustedBySection = ({ className }: TrustedBySectionProps) => {
  const companies = [
    "Microsoft",
    "LinkedIn",
    "Deloitte", 
    "McKinsey",
    "Accenture"
  ];

  return (
    <div className={`flex flex-col items-center gap-6 py-4 ${className}`}>
      <div className="text-white text-lg font-semibold">Trusted by professionals from:</div>
      
      <Carousel className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <CarouselContent>
          {companies.map((company, index) => (
            <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/5 flex justify-center">
              <div className="text-white/80 font-semibold text-center py-2">{company}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TrustedBySection;
