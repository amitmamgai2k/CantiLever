import React from 'react';
import { Globe, Users, Clock, Shield } from 'lucide-react';
import NavBar from '../Components/NavBar';

function About() {
  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sandesh</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted source for breaking news, in-depth analysis, and global perspectives
            that matter most to you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Globe className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
            <p className="text-gray-600">
              Real-time news from every corner of the world, delivered with speed and accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Shield className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Trusted Sources</h3>
            <p className="text-gray-600">
              We verify every story through multiple reliable sources before publication.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Our Mission</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
            To democratize access to information by providing accurate, unbiased news coverage
            that empowers our readers to make informed decisions and stay connected with the
            world around them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-amber-50 p-6 rounded-lg">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">24/7 Updates</h4>
            <p className="text-sm text-gray-600">Round-the-clock news coverage</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg">
            <Users className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Expert Team</h4>
            <p className="text-sm text-gray-600">Experienced journalists worldwide</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg">
            <Globe className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">100+ Countries</h4>
            <p className="text-sm text-gray-600">Global news network coverage</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default About;