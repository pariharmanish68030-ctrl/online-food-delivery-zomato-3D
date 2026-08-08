import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Phone } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { isCustomerAuthOpen, setIsCustomerAuthOpen, loginCustomer } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCustomerAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/customer/register' : '/api/auth/customer/login';
    const payload = isRegister ? { name, email, password, phone } : { email, password };

    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      loginCustomer(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#18181A] border border-[#D7E2EA]/20 w-full max-w-md rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative">
        <button
          onClick={() => setIsCustomerAuthOpen(false)}
          className="absolute top-6 right-6 p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1">
          <span className="text-[#E23744] text-xs font-bold uppercase tracking-widest">Customer Portal</span>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-[#D7E2EA]/60">Sign in to order your favorite dishes with instant delivery.</p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C0C0C] text-sm text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[#0C0C0C] text-sm text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[#0C0C0C] text-sm text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
            />
          </div>

          {isRegister && (
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
              <input
                type="text"
                placeholder="Phone Number (+91...)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0C0C0C] text-sm text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all cursor-pointer shadow-lg shadow-[#E23744]/30"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-[#D7E2EA]/60 border-t border-[#D7E2EA]/10 pt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#E23744] font-bold hover:underline cursor-pointer ml-1"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
