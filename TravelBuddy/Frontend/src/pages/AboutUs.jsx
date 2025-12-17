import React from 'react';
import { Globe, Users, Heart, Target, Award, Sparkles } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
          About TravelBuddy
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          We are building the future of social travel. Connecting explorers, digital nomads, and culture seekers
          to create meaningful connections in every city.
        </p>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {[
          { label: 'Active Users', value: '12k+', icon: Users },
          { label: 'Cities', value: '50+', icon: Globe },
          { label: 'Connections Made', value: '150k+', icon: Heart },
          { label: 'Events Hosted', value: '5k+', icon: Sparkles },
        ].map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition duration-300">
            <div className="flex justify-center mb-4">
              <stat.icon className="text-amber-400" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
            <p className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-amber-300 text-sm uppercase tracking-[0.2em] font-semibold">
            <Target size={16} />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            To make every city feel like <span className="text-rose-400">home</span>.
          </h2>
          <p className="text-white/70 leading-relaxed">
            Traveling shouldn't mean being lonely. We believe that the best travel experiences are shared.
            Whether you're looking for a hiking buddy, a co-working partner, or just someone to grab coffee with,
            TravelBuddy is here to bridge the gap between strangers and friends.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Safety First
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              Verified Users
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              Global Community
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-500 rounded-3xl blur-2xl opacity-20" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Why we started</h3>
            <p className="text-white/70 mb-6">
              "After traveling solo for years, we realized that the most memorable moments weren't the landmarks,
              but the people we met along the way. We wanted to create a platform that makes these serendipitous
              encounters easier and safer."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-lg font-bold">
                TB
              </div>
              <div>
                <p className="font-semibold">The Founding Team</p>
                <p className="text-xs text-white/50">Travelers at heart</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Community First',
              desc: 'We build for our users. Every feature is designed to bring people together.',
              icon: Users,
              color: 'text-blue-400'
            },
            {
              title: 'Trust & Safety',
              desc: 'We prioritize the safety of our members with verification and 24/7 support.',
              icon: Award,
              color: 'text-amber-400'
            },
            {
              title: 'Inclusivity',
              desc: 'Travel is for everyone. We welcome explorers from all walks of life.',
              icon: Globe,
              color: 'text-rose-400'
            }
          ].map((value, index) => (
            <div key={index} className="bg-[#050b1b] p-8 rounded-3xl border border-white/5 hover:border-white/20 transition duration-300">
              <value.icon className={`${value.color} mb-6`} size={40} />
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-white/60">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
