import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [animationData, setAnimationData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load the Lottie animation
    fetch('/animations/loader.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));

    // Preload all frame images
    const frameUrls = Array.from({ length: 12 }, (_, i) => `/frames/scene${String(i + 1).padStart(2, '0')}.png`);
    
    let loadedImages = 0;
    const totalImages = frameUrls.length;

    const loadImage = (url: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedImages++;
          const progress = (loadedImages / totalImages) * 100;
          setLoadingProgress(progress);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    // Load all images
    Promise.all(frameUrls.map(loadImage))
      .then(() => {
        // All images loaded
        setLoadingProgress(100);
        setIsComplete(true);
        
        // Wait a bit more for smooth transition, then call onComplete
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      })
      .catch(error => {
        console.error('Error preloading images:', error);
        // Even if some images fail, continue after timeout
        setTimeout(() => {
          setLoadingProgress(100);
          setIsComplete(true);
          onComplete?.();
        }, 2000);
      });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      {/* Full Screen Lottie Animation */}
      {animationData && (
        <div className="w-full h-full">
          <Lottie 
            animationData={animationData} 
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
      
      {/* Loading Progress Overlay */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 max-w-sm">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Loading frames...</span>
          <span>{Math.round(loadingProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Loading Text Overlay */}
      <p className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
        {isComplete ? 'Ready!' : 'Preparing your experience...'}
      </p>
    </div>
  );
}
