export function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            About Quantify Rating
          </h1>
          <div className="w-16 h-1 bg-gray-900 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how people make decisions through intelligent rating systems 
            that provide accurate, trustworthy, and actionable insights for every choice.
          </p>
        </div>
        
        {/* Mission and Vision Sections */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Our Mission */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To create the most reliable and comprehensive rating platform that helps users make informed decisions through transparent, data-driven insights. We believe every choice matters and deserves access to quality information.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform combines advanced analytics with user-generated content to provide accurate ratings that reflect real experiences. We're building a community where honest feedback drives better decisions for everyone.
            </p>
          </div>
          
          {/* Our Vision */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the global standard for rating and review platforms, where millions of users trust our insights to make better decisions. We envision a world where every rating is meaningful and every review makes a difference.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We see a future where our platform empowers users with personalized recommendations, real-time insights, and community-driven wisdom that transforms how people discover, evaluate, and choose products and services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
