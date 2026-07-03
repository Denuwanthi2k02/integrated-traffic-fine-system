import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
// 1. IMPORT YOUR LOGO HERE:
// import logoImg from '../assets/logo.svg'; 
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    
    try {
      const res = await API.post('/driver/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('licenseNumber', res.data.licenseNumber);
      navigate('/');
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full px-4 flex justify-center items-center my-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 transition-all duration-300">
        
        {/* Header & Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* 2. LOGO CONTAINER */}
            {/* If using the imported logoImg, replace the placeholder <img> with: <img src={logoImg} alt="Company Logo" className="h-12 w-auto object-contain" /> */}
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsdoS8eTwMtv6B5qunA2ZUU6DqRi1Pn5t2NzN1qVeyeA&s=10" 
              alt="Logo" 
              className="h-12 w-auto object-contain rounded-lg"
             
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Driver Login</h2>
          <p className="text-slate-500 mt-2 text-sm">Access your portal to view and settle fines</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium border border-rose-100/80 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="name@example.com" 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 font-normal outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all duration-200" 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 font-normal outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all duration-200" 
                onChange={e => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none flex justify-center items-center gap-2"
          >
            {loading ? (
              <><Loader2 className="animate-spin text-white" size={18} /> Signing In...</>
            ) : (
              "Sign In to Account"
            )}
          </button>
        </form>

        {/* Footer/Register Link */}
        <div className="mt-8 pt-6 text-center text-xs font-medium text-slate-500 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}