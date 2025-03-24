
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { createResponsiveComponent } from "@/components/ui/responsive-container";

interface BenefitsListProps {
  className?: string;
}

interface BenefitItemProps {
  text: string;
}

// Desktop benefit item
const DesktopBenefitItem = ({ text }: BenefitItemProps) => (
  <div className="flex items-center gap-2 text-left">
    <Check className="h-5 w-5 text-secondary flex-shrink-0" />
    <span className="text-gray-300">{text}</span>
  </div>
);

// Mobile benefit item
const MobileBenefitItem = ({ text }: BenefitItemProps) => (
  <div className="flex items-center gap-2 text-left">
    <Check className="h-4 w-4 text-secondary flex-shrink-0" />
    <span className="text-gray-300 text-sm">{text}</span>
  </div>
);

// Responsive benefit item
const ResponsiveBenefitItem = createResponsiveComponent<BenefitItemProps>(
  DesktopBenefitItem,
  MobileBenefitItem
);

const BenefitsList = ({ className }: BenefitsListProps) => {
  const benefits = [
    "Save 5+ hours every week on content creation",
    "Content that sounds authentically like you",
    "Consistent posting without the writing stress",
    "Post every day without the headache"
  ];

  return (
    <div className={`grid md:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto mb-8 md:mb-10 bg-black ${className}`}>
      {benefits.map((benefit, index) => (
        <ResponsiveBenefitItem key={index} text={benefit} />
      ))}
    </div>
  );
};

export default BenefitsList;
