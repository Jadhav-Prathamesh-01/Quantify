import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export function meta() {
  return [
    { title: "404 - Page Not Found | Quantify Rating" },
    { name: "description", content: "The page you're looking for doesn't exist." },
  ];
}

export default function Error404() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Load the Lottie animation
    fetch('/animations/error404.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading 404 animation:', error));
  }, []);

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
    </div>
  );
}
