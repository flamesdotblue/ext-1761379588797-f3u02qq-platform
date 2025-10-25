import React from 'react';
import { ShoppingCart, User, LogOut, Cake } from 'lucide-react';
import { useCart, useUser } from '../store';

export default function Header({ onOpenAuth, onOpenCart }) {
  const { items } = useCart();
  const { user, logout } = useUser();

  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-pink-100"
      role="banner"
      aria-label="Cake Shop Header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-200 text-pink-900" aria-hidden>
            <Cake className="w-5 h-5" />
          </div>
          <a href="#" className="font-bold text-lg tracking-tight text-pink-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400">
            SweetSlice Cakes
          </a>
        </div>
        <nav className="flex items-center gap-2" aria-label="Primary">
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-pink-900 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center px-1"
                aria-live="polite"
              >
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3" aria-label="User Menu">
              <span className="text-sm text-pink-900" aria-live="polite">
                {user.email} • {user.role}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
