
import { Check } from "lucide-react";

interface BenefitsListProps {
  className?: string;
}

const BenefitsList = ({ className }: BenefitsListProps) => {
  return (
    <div className={`grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10 ${className}`}>
      <div className="flex items-center gap-2 text-left">
        <Check className="h-5 w-5 text-fluorescent-cyan flex-shrink-0" />
        <span className="text-white font-medium">Save 5+ hours every week on content creation</span>
      </div>
      <div className="flex items-center gap-2 text-left">
        <Check className="h-5 w-5 text-fluorescent-cyan flex-shrink-0" />
        <span className="text-white font-medium">Content that sounds authentically like you</span>
      </div>
      <div className="flex items-center gap-2 text-left">
        <Check className="h-5 w-5 text-fluorescent-cyan flex-shrink-0" />
        <span className="text-white font-medium">Consistent posting without the writing stress</span>
      </div>
      <div className="flex items-center gap-2 text-left">
        <Check className="h-5 w-5 text-fluorescent-cyan flex-shrink-0" />
        <span className="text-white font-medium">Post every day without the headache</span>
      </div>
    </div>
  );
};

export default BenefitsList;
