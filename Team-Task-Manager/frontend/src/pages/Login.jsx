import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, Layers, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous errors on mount
    setError(null);
    // If user is already authenticated, redirect
    if (user) {
      navigate('/');
    }
  }, [user, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsSubmitting(true);
    const success = await login(demoEmail, demoPassword);
    setIsSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 relative font-sans">
      {/* Subtle background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Clean Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10 mb-3.5">
            <Layers className="h-5.5 w-5.5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-slate-500 text-xs mt-1.5">Access your team task coordination center</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2.5 mb-6 text-xs">
            <AlertTriangle className="h-4.5 w-4.5 text-red-650 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Professional Demo Credentials Box */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2.5">Fast-Track Demo Access</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@demo.com', 'admin123')}
              className="px-3 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-350 transition-all text-center flex flex-col gap-0.5 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              <span className="text-slate-850 font-bold">Demo Admin</span>
              <span className="text-[9px] text-slate-500 font-normal">Full control view</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('member@demo.com', 'member123')}
              className="px-3 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-350 transition-all text-center flex flex-col gap-0.5 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              <span className="text-slate-850 font-bold">Demo Member</span>
              <span className="text-[9px] text-slate-500 font-normal">Assigned tasks view</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-700 text-xs font-semibold" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-455">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500/5 flex items-center justify-center gap-1.5 group transition-all mt-6 cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
