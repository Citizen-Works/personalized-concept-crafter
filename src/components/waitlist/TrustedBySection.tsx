
interface TrustedBySectionProps {
  className?: string;
}

const TrustedBySection = ({ className }: TrustedBySectionProps) => {
  return (
    <div className={`flex flex-wrap justify-center gap-10 opacity-60 ${className}`}>
      <div className="text-white text-sm font-semibold">Trusted by professionals from:</div>
      <div className="text-white/80 font-semibold">Microsoft</div>
      <div className="text-white/80 font-semibold">LinkedIn</div>
      <div className="text-white/80 font-semibold">Deloitte</div>
      <div className="text-white/80 font-semibold">McKinsey</div>
      <div className="text-white/80 font-semibold">Accenture</div>
    </div>
  );
};

export default TrustedBySection;
