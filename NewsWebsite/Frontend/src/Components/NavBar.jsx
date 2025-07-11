import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logOut } from '../helper/firebase';
import { toast } from 'react-hot-toast';
import { Menu, X, User, ChevronDown, Newspaper, Globe, Zap, Gamepad2, Laptop, Music, Building, Heart, Atom, TrendingUp } from 'lucide-react';

function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      const { error } = await logOut();
      if (error) {
        toast.error('Logout failed');
      } else {
        toast.success('Logout successful');
        setCurrentUser(null);
        navigate('/');
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const newsCategories = [
    { name: 'Breaking News', path: '/news/breaking', icon: Zap, color: 'text-red-500' },
    { name: 'World News', path: '/news/world', icon: Globe, color: 'text-blue-500' },
    { name: 'Sports', path: '/news/sports', icon: Gamepad2, color: 'text-green-500' },
    { name: 'Technology', path: '/news/technology', icon: Laptop, color: 'text-purple-500' },
    { name: 'Entertainment', path: '/news/entertainment', icon: Music, color: 'text-pink-500' },
    { name: 'Business', path: '/news/business', icon: Building, color: 'text-indigo-500' },
    { name: 'Health', path: '/news/health', icon: Heart, color: 'text-emerald-500' },
    { name: 'Science', path: '/news/science', icon: Atom, color: 'text-cyan-500' },
    { name: 'Politics', path: '/news/politics', icon: TrendingUp, color: 'text-orange-500' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Sandesh
            </span>
          </Link>


          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 relative group"


              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            ))}


            <div className="relative">
              <button
                onMouseEnter={() => setIsNewsDropdownOpen(true)}
                onMouseLeave={() => setIsNewsDropdownOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 relative group"
              >
                <span>News</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isNewsDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>

              {/* Dropdown Menu */}
              {isNewsDropdownOpen && (
                <div
                  onMouseEnter={() => setIsNewsDropdownOpen(true)}
                  onMouseLeave={() => setIsNewsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                >
                  {newsCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                        onClick={() => setIsNewsDropdownOpen(false)}
                      >
                        <IconComponent className={`h-5 w-5 ${category.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                  <div className="bg-amber-100 p-1 rounded-full">
                 <img src={currentUser?.photoURL} alt="" className='w-8 h-8 rounded-full'/>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/user/login"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/user/register"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>


          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-all duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>


        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}


              <div className="px-4 py-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">News Categories</h3>
                <div className="grid grid-cols-1 gap-1">
                  {newsCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className={`h-4 w-4 ${category.color}`} />
                        <span className="text-gray-700 font-medium">{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {currentUser ? (
                <div className="px-4 py-2 space-y-3 border-t border-gray-100 mt-4">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3">
                    <div className="bg-amber-100 p-1.5 rounded-full">
                        <img src={currentUser?.photoURL} alt="" className='w-8 h-8 rounded-full' />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2 border-t border-gray-100 mt-4">
                  <Link
                    to="/user/login"
                    className="block w-full text-center px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/user/register"
                    className="block w-full text-center bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;