
interface HeroHeadingProps {
  className?: string;
}

const HeroHeading = ({ className }: HeroHeadingProps) => {
  return (
    <>
      <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent relative ${className}`}>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-90 blur-2xl -z-10 rounded-3xl" />
        
        <span 
          className="bg-clip-text text-transparent bg-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
          }}
        >
          CONTENT
        </span>
        <br />
        <span 
          className="bg-clip-text text-transparent"
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
      
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white max-w-4xl mx-auto text-balance">
        Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Meeting Gold</span> Into Content That Grows Your Business
      </h2>
    </>
  );
};

export default HeroHeading;
