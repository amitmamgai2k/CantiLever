import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  Users,
  MapPin,
  Compass,
  Calendar,
  Plus,
  Bell,
  Globe,
  ChevronDown,
  User,
  Activity,
  LogOut,
  Trash2,
  Link,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReverseGeocode from './ReverseGeoCode';
import { logout } from '../redux/slices/userAuthSlice';
import toast from 'react-hot-toast';

const navLinks = [
  { name: 'Discover', path: '/', icon: Compass },
  { name: 'Map', path: '/map', icon: MapPin },
  { name: 'Activities', path: '/activity-near-me', icon: Calendar }
];

const baseProfileItems = (badge) => [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Joined Activities', path: '/joined-activities', icon: Activity },
  { name: 'My Activities', path: '/created-activities', icon: Calendar },
  { name: 'Connections', path: '/connections', icon: Link },
  { name: 'Notifications', path: '/notifications', icon: Bell, badge },
  { name: 'Update Profile', path: '/update-profile', icon: Settings }
];

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userAuth.user);
  const notificationCount = 3;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavigation = (path) => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const profileMenuItems = baseProfileItems(notificationCount);

 const containerClasses = [
    'sticky top-0 z-50 transition-all duration-300',
    isScrolled ? 'backdrop-blur-xl bg-[#050b1b]/95 shadow-lg border-b border-white/10' : 'backdrop-blur-md bg-[#050b1b]/90 border-b border-white/5'
  ].join(' ');

  return (
    <header className={containerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-gradient-to-r from-amber-400 to-rose-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20">
              <Globe className="text-gray-900" size={24} />
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold text-white tracking-wide">TravelBuddy</span>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">co-travel smarter</p>
            </div>
          </button>

          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-white/70 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
              <MapPin size={16} className="text-amber-300" />
              <ReverseGeocode
                lat={currentUser?.currentLocation?.lat}
                lng={currentUser?.currentLocation?.lng}
              />
            </div>
          )}

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </button>
            ))}
            {currentUser ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavigation('/create-activity')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-blue-500/25"
                >
                  <Plus size={16} />
                  Create Activity
                </button>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition"
                  >
                    <img
                      src={
                        currentUser.profilePicture ||
                        'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
                      }
                      alt={currentUser.fullName}
                      className="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
                    />
                    <span className="text-sm">{currentUser.fullName}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#070d1f] border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
                      <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <img
                          src={
                            currentUser.profilePicture ||
                            'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
                          }
                          alt={currentUser.fullName}
                          className="w-12 h-12 rounded-full border border-white/20 object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{currentUser.fullName}</p>
                          <p className="text-xs text-white/50">View profile</p>
                        </div>
                      </div>
                      <div className="py-2">
                        {profileMenuItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className="w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={16} />
                              <span>{item.name}</span>
                            </div>
                            {item.badge ? (
                              <span className="bg-rose-500 text-white text-xs rounded-full px-2 py-0.5">
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-white/5 py-2 space-y-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                        <button
                          onClick={() => {
                            console.log('Delete account clicked');
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3"
                        >
                          <Trash2 size={16} />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-white/70 hover:text-white"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-rose-500 text-gray-900 hover:scale-105 transition shadow-lg shadow-amber-500/25"
                >
                  Join now
                </button>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden text-white/80 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2">
            {currentUser && (
              <div className="flex items-center gap-2 text-xs text-white/70 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                <MapPin size={14} className="text-amber-300" />
                <ReverseGeocode
                  lat={currentUser?.currentLocation?.lat}
                  lng={currentUser?.currentLocation?.lng}
                />
              </div>
            )}
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5 text-left"
              >
                <link.icon size={18} />
                {link.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigation('/create-activity')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} />
              Create Activity
            </button>
            {currentUser ? (
              <div className="space-y-2 border-t border-white/10 pt-3">
                {profileMenuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl text-left"
                  >
                    <item.icon size={18} />
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-rose-300 hover:bg-rose-500/10 rounded-2xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full px-4 py-2 rounded-2xl bg-white/5 text-white/80"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-gray-900 font-medium"
                >
                  Join TravelBuddy
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;

