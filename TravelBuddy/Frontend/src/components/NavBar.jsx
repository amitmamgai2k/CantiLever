import React, { useState } from 'react';
import {
  Menu,
  X,
  Users,
  MapPin,
  Compass,
  User,
  MessageCircle,
  Calendar,
  Plus,
  Bell,
  Globe,
  Heart
} from 'lucide-react';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // dummy: replace with real user auth later
  const currentUser = {
    name: "John Doe",
    photoURL: "https://i.pravatar.cc/40",
    currentLocation: "India Delhi",
  };

  const notificationCount = 3;
  const messageCount = 2;

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);

  };

  const handleLogout = () => {
    // later: call logout API
    console.log("Logged out");
    handleNavigation('/login');
  };

  const navLinks = [
    { name: 'Discover', path: '/', icon: Compass },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Activities', path: '/activities', icon: Calendar },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageCircle, badge: messageCount },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">


          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TravelConnect
              </span>
              <div className="text-xs text-gray-500 -mt-1">Find your travel buddy</div>
            </div>
          </button>


          {currentUser && (
            <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <MapPin size={14} className="text-blue-500" />
              <span>{currentUser.currentLocation}</span>
            </div>
          )}


          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
              >
                <link.icon size={20} />
                <span className="group-hover:underline underline-offset-4">{link.name}</span>
                {link.badge && link.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}


            <button
              onClick={() => handleNavigation('/create-activity')}
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              <span className="hidden lg:inline text-center">Create</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative text-gray-700 hover:text-blue-600">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile Menu */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-400 transition-colors"
                    />
                    <span className="hidden lg:inline">{currentUser.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>


          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-4 border-t border-gray-100 pt-4">
            {/* Current Location (Mobile) */}
            {currentUser && (
              <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg mx-3 mb-3">
                <MapPin size={14} className="text-blue-500" />
                <span>{currentUser.currentLocation}</span>
              </div>
            )}

            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  handleNavigation(link.path);
                  setIsMenuOpen(false);
                }}
                className="relative flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg mx-3 transition-colors w-full text-left"
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
                {link.badge && link.badge > 0 && (
                  <span className=" bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}


            <button
              onClick={() => {
                handleNavigation('/create-activity');
                setIsMenuOpen(false);
              }}
              className="flex align-center space-x-3 px-4 py-3 mx-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 w-full"
            >
              <Plus size={20} />
              <span className="font-medium text-center mt-[-1px]">Create Activity</span>
            </button>

            {currentUser ? (
              <div className="space-y-1   border-t border-gray-100 mx-3">
                {/* Notifications (Mobile) */}
                <button className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full">
                  <Bell size={20} />
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <span className=" bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-left">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleNavigation('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left"
                >
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full border border-gray-200"
                  />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <X size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 mx-3">
                <button
                  onClick={() => {
                    handleNavigation('/login');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium w-full text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/register');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-center w-full"
                >
                  Join TravelConnect
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;