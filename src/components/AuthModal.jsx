import React, { useEffect, useState } from 'react';
import { X, Lock } from 'lucide-react';
import { useUser } from '../store';
import { validateEmail, validatePassword } from '../utils/validation';

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function AuthModal({ open, onClose }) {
  const { user, login } = useUser();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) onClose?.();
  }, [user, open, onClose]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const e = {};
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) e.password = 'Password must be 8+ chars with letters and numbers';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const hashed = await sha256(form.password);
      // Demo-only: determine role based on email
      const role = /@admin\b/i.test(form.email) ? 'admin' : 'customer';
      login({ id: hashed.slice(0, 12), email: form.email, role });
    } catch (e) {
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} role="dialog" aria-modal="true" aria-label="Authentication">
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute inset-0 flex items-center justify-center p-4 transition-transform ${open ? 'scale-100' : 'scale-95'}`}>
        <div className="w-full max-w-md bg-white rounded-xl border border-pink-100 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-pink-100">
            <h3 className="text-lg font-semibold text-pink-900">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Close authentication"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={onSubmit} noValidate className="p-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pink-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="email"
                required
              />
              {errors.email && <p role="alert" className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-pink-900">
                  Password
                </label>
                <div className="text-xs text-pink-900/70 inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 8+ chars, letters & numbers
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              {errors.password && <p role="alert" className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            <p className="text-sm text-pink-900/80">
              {mode === 'login' ? (
                <>
                  No account?{' '}
                  <button type="button" onClick={() => setMode('register')} className="underline underline-offset-2 hover:text-pink-900">
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('login')} className="underline underline-offset-2 hover:text-pink-900">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
