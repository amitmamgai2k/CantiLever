import  { useState,useEffect, useRef } from 'react';
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
import { useDispatch,useSelector } from 'react-redux';
import ReverseGeocode from './ReverseGeoCode';
import { logout } from '../redux/slices/userAuthSlice';
import toast from 'react-hot-toast';


function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.userAuth.user);
  console.log('Current User:', currentUser);

  const notificationCount = 3;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (path) => {
    navigate(path);
  };
  const handleRegister = (path) => {
    navigate(path);
  };
  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout successful');
    setIsProfileMenuOpen(false);
  };

  const handleDeleteAccount = () => {

    console.log('Delete account clicked');
    setIsProfileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Discover', path: '/', icon: Compass },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Activities', path: '/activity-near-me', icon: Calendar },

  ];

  const profileMenuItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Joined Activities', path: '/joined-activities', icon: Activity },
    { name: 'My Activities', path: '/created-activities', icon: Calendar },
    { name: 'Connections', path: '/connections', icon: Link },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: notificationCount },
    {name:'Update Profile',path:'/update-profile',icon:Settings}

  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-amber-600 p-2 rounded-lg">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold bg-amber-600 bg-clip-text text-transparent">
                TravelBuddy
              </span>
              <div className="text-xs text-gray-500 -mt-1">Find your travel buddy</div>
            </div>
          </button>

          {currentUser && (
            <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <MapPin size={24} className="text-amber-600" />
             <ReverseGeocode lat = {currentUser.currentLocation.lat} lng = {currentUser.currentLocation.lng}/>
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

            {currentUser ? (
              <div className="flex items-center space-x-4">
                 <button
              onClick={() => handleNavigation('/create-activity')}
              className="flex items-center space-x-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              <span className="hidden lg:inline text-center">Create Activity</span>
            </button>

                {/* Profile Dropdown Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={currentUser.profilePicture ||'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-amber-600 transition-colors"
                    />
                    <span className="hidden lg:inline">{currentUser.fullName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img
                            src={currentUser.profilePicture ||'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                            alt={currentUser.fullName}
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{currentUser.fullName}</p>
                            <p className="text-xs text-gray-500">View profile</p>
                          </div>
                        </div>
                      </div>

                      {profileMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon size={16} />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>

                      <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <Trash2 size={16} />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleLogin('/login')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleRegister('/register')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
               <ReverseGeocode lat = {currentUser.currentLocation.lat} lng = {currentUser.currentLocation.lng}/>
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
              <div className="space-y-1 border-t border-gray-100 mx-3 pt-2">
                {/* Mobile Profile Menu Items */}
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleNavigation(item.path);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left"
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </button>
                ))}

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
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>

                <button
                  onClick={() => {
                    handleDeleteAccount();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <Trash2 size={20} />
                  <span>Delete Account</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 mx-3">
                <button
                  onClick={() => {
                    handleLogin('/login');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium w-full text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleRegister('/register');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-30 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium text-center w-full"
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