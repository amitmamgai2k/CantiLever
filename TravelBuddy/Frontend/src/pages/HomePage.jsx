import React, { useState, useEffect } from 'react';
import {
  Compass,
  Users,
  MapPin,
  MessageCircle,
  Globe,
  Star,
  Calendar,
  Camera,
  Shield,
  Zap,
  Heart,
  ChevronRight,
  Play
} from 'lucide-react';
import CurrentLocationMap from '../components/CurrentLocationMap';
import { useSelector } from 'react-redux';



function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const user = useSelector((state) => state.userAuth.user);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Tokyo, Japan",
      text: "Found my travel squad for Southeast Asia through TravelBuddy. Best decision ever!",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Rodriguez",
      location: "Barcelona, Spain",
      text: "Met incredible people and discovered hidden gems I never would have found alone.",
      avatar: "👨‍🎨"
    },
    {
      name: "Emma Thompson",
      location: "Sydney, Australia",
      text: "From solo traveler to part of an amazing global community. Love this platform!",
      avatar: "👩‍🚀"
    }
  ];

  const features = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Smart Matching",
      description: "AI-powered algorithm connects you with compatible travelers based on interests, travel style, and destination",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Group Adventures",
      description: "Join or create group trips, activities, and meetups with verified travelers worldwide",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Verified",
      description: "All members are ID-verified with safety ratings and reviews from the community",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
  {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center bg-orange-100 text-orange-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Join 50,000+ Active Travelers
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Next
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"> Adventure</span>
                <br />Starts Here
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Connect with like-minded travelers, join amazing adventures, and create unforgettable memories around the globe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center">
                  Start Your Journey
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="group border-2 border-gray-300 hover:border-orange-500 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center mt-8 text-sm text-gray-500">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-2">4.9/5 from 12,000+ reviews</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
                    alt="Travelers exploring"
                    className="w-full h-full object-cover rounded-2xl opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-semibold">Live Adventures</p>
                    <p className="text-sm opacity-90">234 happening now</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 animate-bounce">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">2,847 online</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium">98% Happy Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Active Travelers
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"> Right Now</span>
            </h2>
            <p className="text-xl text-gray-600">See who's exploring around the world and join their adventures</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="h-100 rounded-2xl overflow-hidden">
                <CurrentLocationMap lat={user?.currentLocation?.lat} lng={user?.currentLocation?.lng} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TravelBuddy?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to connect with fellow travelers and create unforgettable experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative group p-8 rounded-3xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index
                    ? 'bg-gradient-to-br ' + feature.color + ' text-white shadow-2xl'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-white/20 text-white'
                    : 'bg-gradient-to-br ' + feature.color + ' text-white'
                }`}>
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className={`text-lg leading-relaxed ${
                  activeFeature === index ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>

                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300 ${
                  activeFeature === index ? 'bg-white/50' : 'bg-transparent'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Travelers Worldwide</h2>
            <p className="text-xl text-gray-600">Real stories from our amazing community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers exploring the world together. Your next great adventure is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center">
              Join TravelBuddy Free
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center text-sm text-gray-400">
            <Shield className="h-4 w-4 mr-2" />
            <span>Free forever • No credit card required • Join in 30 seconds</span>
          </div>
        </div>
      </section>


    </div>
  );
}

export default HomePage;