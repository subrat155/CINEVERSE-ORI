import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // --- ADMIN LOGIN CHECK (Hardcoded bypass for Admin) ---
      if (!isSignup && formData.email === 'admin@gmail.com' && formData.password === '909021') {
        // Simulate delay for admin
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const adminUser: User = {
          id: 'admin_001',
          name: 'Administrator',
          email: 'admin@gmail.com',
          role: 'admin'
        };
        onLogin(adminUser);
        setSuccessMsg('Welcome Admin! Redirecting to dashboard...');
        setTimeout(() => navigate('/admin'), 1500);
        return;
      }

      // --- REGULAR USER FLOW VIA API ---
      if (isSignup) {
        const newUser = await api.register(formData);
        setSuccessMsg(`Welcome to CineVerse, ${newUser.name}! A verification email has been sent to ${newUser.email}.`);
        
        // Auto login after signup
        onLogin(newUser);
        setTimeout(() => navigate('/'), 2000);
      } else {
        const user = await api.login(formData.email, formData.password);
        setSuccessMsg('Successfully logged in!');
        onLogin(user);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-24 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 z-50 animate-bounce">
           <CheckCircle size={20}/>
           {successMsg}
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-[#2A2E36] p-8 rounded-2xl shadow-2xl border border-[#3A3F47]">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {isSignup ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSignup ? 'Join CineVerse today' : 'Sign in to access your bookings'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            {isSignup && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[#1C1F26] focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF] focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[#1C1F26] focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[#1C1F26] focus:outline-none focus:ring-[#007BFF] focus:border-[#007BFF] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0056D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <ArrowRight className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
                  </span>
                  {isSignup ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => { setIsSignup(!isSignup); setError(''); setSuccessMsg(''); }}
            className="text-sm text-[#007BFF] hover:text-blue-400 font-medium transition"
          >
            {isSignup ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;