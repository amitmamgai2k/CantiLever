import React, { useState } from 'react';
import { LoginWithEmailAndPassword, signInWithGoogle } from '../helper/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, KeyRound } from 'lucide-react';

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { user, error } = await signInWithGoogle();
      if (user) {
        toast.success('Google sign-in successful');
        navigate('/');
      } else if (error) {
        setError(error);
        toast.error('Google sign-in failed');
      }
    } catch (err) {
      setError('Google sign-in failed');
      toast.error('Google sign-in failed');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { user, error } = await LoginWithEmailAndPassword(formData.email, formData.password);
      if (user) {
        toast.success('Login successful');
        navigate('/');
      } else if (error) {
        setError(error);
        toast.error('Login failed');
      }
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Login failed');
    }
    setLoading(false);
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
            <h1 className="text-2xl font-bold text-amber-600">Sandesh</h1>
            <p className="text-gray-500 text-sm mt-1">Your trusted news source</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
              <p className="text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mb-6"
          >
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

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
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Email"
                />
              </div>
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
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                />
              </div>
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
            <Link to="/user/register" className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;