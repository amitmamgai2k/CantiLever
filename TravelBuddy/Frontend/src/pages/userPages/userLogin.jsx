import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Login } from '../../redux/slices/userAuthSlice';
import { toast } from 'react-hot-toast';
import { Mail, KeyRound } from 'lucide-react';

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));


    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const loginResult = await dispatch(Login({
        email: formData.email,
        password: formData.password
      }));

      if (Login.fulfilled.match(loginResult)) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        const errorMessage = loginResult.payload?.message || "Invalid email or password. Please try again.";
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative overflow-hidden shadow-2xl drop-shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 ">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100 rounded-full opacity-50 border-2 border-amber-200"></div>
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100 rounded-full opacity-50 border-2 border-amber-200"></div>
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-100 rounded-full opacity-50 border-2 border-amber-200"></div>
           <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-100 rounded-full opacity-50 border-2 border-amber-200"></div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-600">Travel Buddy</h1>
            <p className="text-gray-500 text-sm mt-1">Find Your Travel Buddy</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>

          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
              <p className="text-center">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-amber-600" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-amber-600" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/user/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 transition-colors">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;