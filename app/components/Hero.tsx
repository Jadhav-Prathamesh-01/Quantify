import { useEffect, useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !framesRef.current) return;

    // Simple scroll-based animation without GSAP for now
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 1.5), 1);
      
      const frames = framesRef.current!.children;
      const totalFrames = frames.length;
      const frameIndex = Math.floor(progress * (totalFrames - 1));
      
      // Hide all frames
      Array.from(frames).forEach((frame: any) => {
        frame.style.opacity = '0';
      });
      
      // Show current frame
      if (frames[frameIndex]) {
        (frames[frameIndex] as HTMLElement).style.opacity = '1';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={framesRef} className="absolute inset-0">
        {/* Frame 1 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene01.png" 
            alt="Frame 1" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 2 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene02.png" 
            alt="Frame 2" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 3 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene03.png" 
            alt="Frame 3" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 4 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene04.png" 
            alt="Frame 4" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 5 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene05.png" 
            alt="Frame 5" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 6 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene06.png" 
            alt="Frame 6" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 7 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene07.png" 
            alt="Frame 7" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 8 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene08.png" 
            alt="Frame 8" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 9 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene09.png" 
            alt="Frame 9" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 10 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene10.png" 
            alt="Frame 10" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 11 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene11.png" 
            alt="Frame 11" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Frame 12 */}
        <div className="absolute inset-0 opacity-0">
          <img 
            src="/frames/scene12.png" 
            alt="Frame 12" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
