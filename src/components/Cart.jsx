import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../store';

export default function Cart({ open, onClose, onCheckout }) {
  const { items, setQty, removeFromCart, subtotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h3 className="text-lg font-semibold text-pink-900">Your Cart</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4" role="region" aria-label="Cart items">
          {items.length === 0 ? (
            <p className="text-pink-900/70">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={`${item.image}&auto=compress&cs=tinysrgb`}
                    alt=""
                    className="w-20 h-20 object-cover rounded-md border border-pink-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-pink-900">{item.name}</h4>
                        <p className="text-sm text-pink-900/70">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-md hover:bg-pink-100 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-pink-200 text-pink-900 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center" aria-live="polite">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-pink-200 text-pink-900 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-pink-100">
          <div className="flex items-center justify-between">
            <span className="text-pink-900">Subtotal</span>
            <span className="text-pink-900 font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
