
interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground = ({ className }: HeroBackgroundProps) => {
  return (
    <>
      <div 
        className={`absolute inset-0 z-0 opacity-5 ${className}`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'luminosity',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-1"></div>
    </>
  );
};

export default HeroBackground;
