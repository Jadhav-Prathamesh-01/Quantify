import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !framesRef.current) return;

    const frames = framesRef.current.children;
    const totalFrames = frames.length;

    // Set initial state - show first frame
    gsap.set(frames, { opacity: 0 });
    if (frames[0]) {
      gsap.set(frames[0], { opacity: 1 });
    }

    // Create the scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=150%", // Reduced scroll distance for faster changes
      pin: true,
      scrub: 0.5, // Faster, more responsive scrubbing
      onUpdate: (self) => {
        const progress = self.progress;
        const frameIndex = Math.floor(progress * (totalFrames - 1));
        
        // Hide all frames
        gsap.set(frames, { opacity: 0 });
        
        // Show current frame
        if (frames[frameIndex]) {
          gsap.set(frames[frameIndex], { opacity: 1 });
        }
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  // Refresh ScrollTrigger when component mounts
  useEffect(() => {
    ScrollTrigger.refresh();
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
