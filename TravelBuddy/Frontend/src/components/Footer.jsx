import { useState } from 'react';
import {
  Globe,
  MapPin,
  Compass,
  Users,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  ArrowRight,
  Shield,
  Zap,
  Heart
} from 'lucide-react';

const quickLinks = [
  { label: 'Discover', icon: Compass, path: '/' },
  { label: 'Live Map', icon: MapPin, path: '/map' },
  { label: 'Activities', icon: Calendar, path: '/activity-near-me' },
  { label: 'Connections', icon: Users, path: '/connections' },
  { label: 'Messages', icon: MessageCircle, path: '/activity-group/123' }
];

const supportLinks = [
  { label: 'Help Center', path: '/help' },
  { label: 'Safety & Trust', path: '/safety' },
  { label: 'Community Guidelines', path: '/guidelines' },
  { label: 'Partner With Us', path: '/partners' }
];

const legalLinks = ['Privacy', 'Terms', 'Cookies', 'Imprint'];

const featuredCities = ['Lisbon', 'Seoul', 'San Diego', 'Mexico City', 'Cape Town', 'Taipei'];

const socialLinks = [
  { label: 'Instagram', icon: Instagram },
  { label: 'Twitter', icon: Twitter },
  { label: 'YouTube', icon: Youtube },
  { label: 'LinkedIn', icon: Linkedin }
];

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) return;
    console.log('Join waitlist:', email);
    setEmail('');
  };

  const handleNavigate = (path) => {
    console.log('Navigate to:', path);
  };

  return (
    <footer className="bg-[#030712] text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 pb-16 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-400 to-rose-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/30">
                <Globe className="text-gray-900" size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-wide">TravelBuddy</p>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">co-travel smarter</p>
              </div>
            </div>
            <p className="text-white/70 text-sm max-w-md leading-relaxed">
              Premium communities for explorers, remote workers, and culture seekers. Plan together,
              split costs transparently, and make every city feel like a second home.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  className="w-11 h-11 rounded-2xl border border-white/10 hover:border-white/40 flex items-center justify-center text-white/70 hover:text-white transition"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-[0.4em]">
              <Zap size={14} />
              Waitlist
            </div>
            <h3 className="text-2xl font-semibold">Get city launches before anyone else</h3>
            <p className="text-sm text-white/70">
              Monthly drop of curated meetups, co-live spots, and open cabins for TravelBuddy members.
            </p>
            <div className="flex items-center bg-white/10 rounded-full border border-white/10 overflow-hidden">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email for invite list"
                className="flex-1 bg-transparent px-4 py-3 text-sm placeholder-white/40 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-3 bg-gradient-to-r from-amber-400 to-rose-500 text-gray-900 font-semibold text-sm hover:opacity-90 transition"
              >
                Join
              </button>
            </div>
            <p className="text-[11px] text-white/40">
              12,400 explorers already on board • No spam ever
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 py-12 border-b border-white/5 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Explore</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavigate(link.path)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Support</p>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavigate(link.path)}
                    className="text-white/70 hover:text-white transition"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4" />
            <div className="mt-6 space-y-2 text-white/70">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-amber-300" /> hello@travelbuddy.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-300" /> +1 (415) 555-9023
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Featured Circles</p>
            <div className="grid grid-cols-2 gap-3">
              {featuredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleNavigate(`/city/${city.toLowerCase()}`)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition text-left"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Safety & Trust</p>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-emerald-300" />
                <div>
                  <p className="font-semibold text-white">ID Verified</p>
                  <p className="text-xs text-white/60">Community ratings • 24/7 concierge</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-blue-300" />
                <div>
                  <p className="font-semibold text-white">Instant chat</p>
                  <p className="text-xs text-white/60">Localized languages & support</p>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-3 text-sm text-white/70 hover:text-white">
              View safety playbook <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/50">
          <p className="flex items-center gap-2">
            © {new Date().getFullYear()} TravelBuddy. Crafted with <Heart size={12} className="text-rose-400" /> on
            the road.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((item) => (
              <button
                key={item}
                onClick={() => handleNavigate(`/${item.toLowerCase()}`)}
                className="hover:text-white transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

