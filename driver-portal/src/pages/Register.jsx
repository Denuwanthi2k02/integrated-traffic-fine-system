import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); 
    
    try {
      // Calls your backend to create a user
      await API.post('/auth/register', { name, email, password });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      setError("Failed to register. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 flex justify-center items-center my-10">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-slate-100">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm">Register to track and pay your fines easily</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700" 
              onChange={e => setName(e.target.value)} 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700" 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              placeholder="Create Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700" 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} /> Registering...</> : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-900 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}