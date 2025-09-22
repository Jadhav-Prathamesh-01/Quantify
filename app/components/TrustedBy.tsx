export function TrustedBy() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-200 rounded-full opacity-60"></div>
      <div className="absolute top-20 right-20 w-4 h-4 bg-purple-200 rounded-full opacity-60"></div>
      
      <div className="text-center max-w-6xl mx-auto px-6">
        {/* Top text */}
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
          REAL STORIES, REAL IMPACT
        </p>
        
        {/* Main heading */}
        <h2 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 tracking-tight">
          Trusted by
        </h2>
        
        {/* Gradient text */}
        <h2 className="text-6xl md:text-8xl font-bold mb-12 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
          Shops Across India
        </h2>
        
        {/* Bottom description */}
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          See how Quantify Rating is helping businesses and customers make better decisions nationwide.
        </p>
      </div>
    </section>
  );
}
