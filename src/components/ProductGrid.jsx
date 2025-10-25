import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useProducts, useCart } from '../store';

export default function ProductGrid() {
  const products = useProducts();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState(() => Object.fromEntries(products.map((p) => [p.id, 1])));

  const setQty = (id, qty) => setQuantities((q) => ({ ...q, [id]: Math.max(1, qty) }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Products">
      <h2 className="text-2xl font-semibold text-pink-900 mb-4">Our Cakes</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <article
            key={p.id}
            className="group rounded-xl overflow-hidden bg-white shadow-sm border border-pink-100 focus-within:ring-2 focus-within:ring-pink-400"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={`${p.image}&auto=compress&cs=tinysrgb`}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-pink-900">{p.name}</h3>
              <p className="text-sm text-pink-800/80 mt-1">{p.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-pink-900 font-semibold" aria-label={`Price ${p.price.toFixed(2)} dollars`}>
                  ${p.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2" aria-label={`Quantity selector for ${p.name}`}>
                  <button
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-pink-200 text-pink-900 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    onClick={() => setQty(p.id, (quantities[p.id] || 1) - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={quantities[p.id] || 1}
                    onChange={(e) => setQty(p.id, Number(e.target.value || 1))}
                    className="w-14 h-8 text-center border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    aria-label="Quantity"
                  />
                  <button
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-pink-200 text-pink-900 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    onClick={() => setQty(p.id, (quantities[p.id] || 1) + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                onClick={() => addToCart(p, quantities[p.id] || 1)}
                aria-label={`Add ${quantities[p.id] || 1} ${p.name} to cart`}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
