import React from 'react';
import { Compass, Users, MapPin, MessageCircle, Globe } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
   <section className="relative bg-gray-50 py-20">
  {/* Background Image */}
  <img
    src="https://t4.ftcdn.net/jpg/00/65/48/25/360_F_65482539_C0ZozE5gUjCafz7Xq98WB4dW6LAhqKfs.jpg"
    alt="background"
    className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
  />


  <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
      Connect with Travelers Worldwide
    </h1>
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      Meet fellow travelers, join activities, and explore amazing destinations together
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg">
      Start Your Journey
    </button>
  </div>
</section>


      {/* Map Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Active Travelers Right Now</h2>
            <p className="text-gray-600 text-lg">See who's exploring around the world</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=1000&h=500&fit=crop"
                alt="World map showing active travelers"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center bg-white rounded-lg p-8 shadow-lg">
                  <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-gray-600">Live locations of active travelers</p>
                </div>
              </div>

              {/* Simple location dots */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-500 rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-orange-500 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose TravelBuddy?</h2>
            <p className="text-gray-600 text-lg">Everything you need to connect with fellow travelers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Discover</h3>
              <p className="text-gray-600">Find travelers in your city or destination</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Join Activities</h3>
              <p className="text-gray-600">Participate in group activities and meetups</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-gray-600">Chat and plan meetups with other travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">Active Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-orange-100">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25K+</div>
              <div className="text-orange-100">Activities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to start your journey?</h2>
          <p className="text-gray-600 text-lg mb-8">Join thousands of travelers exploring the world together</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg">
            Join TravelBuddy Free
          </button>
        </div>
      </section>

      {/* Footer */}

    </div>
  );
}

export default HomePage;