
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroHeadingProps {
  className?: string;
}

const HeroHeading = ({ className }: HeroHeadingProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <h1 className={`text-7xl xs:text-8xl sm:text-9xl md:text-[10rem] font-bold tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent relative ${className} w-full max-w-[98vw] mx-auto`}>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-90 blur-3xl -z-10 rounded-3xl transform scale-125" />
        
        <span 
          className="inline-block bg-clip-text text-transparent bg-blend-screen px-2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
          }}
        >
          CONTENT
        </span>
        <br className="sm:hidden" />
        <span 
          className="inline-block bg-clip-text text-transparent px-2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhaW5ib3d8ZW58MHx8MHx8fDA%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
          }}
        >
          ENGINE
        </span>
      </h1>
      
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-white max-w-5xl mx-auto text-balance px-4">
        Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Meeting Gold</span> Into Content That Grows Your Business
      </h2>
    </>
  );
};

export default HeroHeading;
