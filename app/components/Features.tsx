export function Features() {
  return (
    <section id="features-section" className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Section - Three Features */}
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {/* Feature 1 */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Accurate Ratings</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced algorithms that analyze multiple data points to provide precise, 
              reliable ratings that reflect true quality and performance.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Location-Based Sorting</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart sorting that organizes shops and services by proximity to your location, 
              helping you find the best options closest to you.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced data analysis and trend identification to help users understand 
              patterns and make informed choices with confidence.
            </p>
          </div>
        </div>
        
        {/* Bottom Section - Why Choose Us */}
        <div className="text-center">
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              EXCELLENCE IN RATING
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Quantify Rating?
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover what makes us the preferred choice for users seeking reliable ratings worldwide.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our commitment to accuracy and transparency drives every feature we build.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
