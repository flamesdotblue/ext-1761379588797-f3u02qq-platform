import React, { useState } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import { StoreProvider } from './store';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState('shop'); // 'shop' | 'checkout'

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#E1BEE7]/30 via-[#BBDEFB]/20 to-[#F8BBD0]/30 text-pink-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white rounded px-3 py-2 shadow"
        >
          Skip to content
        </a>
        <Header onOpenAuth={() => setAuthOpen(true)} onOpenCart={() => setCartOpen(true)} />

        <main id="main" className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight">Deliciously Crafted Cakes</h1>
            <div className="flex items-center gap-2" role="tablist" aria-label="View selector">
              <button
                role="tab"
                aria-selected={view === 'shop'}
                onClick={() => setView('shop')}
                className={`px-3 py-2 rounded-md border text-sm ${
                  view === 'shop' ? 'bg-white border-pink-300' : 'border-transparent hover:bg-white/70'
                }`}
              >
                Shop
              </button>
              <button
                role="tab"
                aria-selected={view === 'checkout'}
                onClick={() => setView('checkout')}
                className={`px-3 py-2 rounded-md border text-sm ${
                  view === 'checkout' ? 'bg-white border-pink-300' : 'border-transparent hover:bg-white/70'
                }`}
              >
                Checkout
              </button>
            </div>
          </div>

          {view === 'shop' ? <ProductGrid /> : <Checkout />}
        </main>

        <footer className="border-t border-pink-100 py-6 text-center text-sm" aria-label="Footer">
          <p>
            © {new Date().getFullYear()} SweetSlice Cakes. Crafted with love.
          </p>
        </footer>

        <Cart open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => setView('checkout')} />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </StoreProvider>
  );
}
