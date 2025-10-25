import React, { useState } from 'react';
import { useCart, useUser } from '../store';
import { validateEmail, validateRequired } from '../utils/validation';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useUser();
  const [form, setForm] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    address: '',
    city: '',
    postal: '',
    paymentMethod: 'stripe'
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const e = {};
    if (!validateRequired(form.name)) e.name = 'Name is required';
    if (!validateEmail(form.email)) e.email = 'Enter a valid email';
    if (!validateRequired(form.address)) e.address = 'Address is required';
    if (!validateRequired(form.city)) e.city = 'City is required';
    if (!validateRequired(form.postal)) e.postal = 'Postal code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      // In a real app, call backend to create Stripe/PayPal session
      // Here we simulate successful checkout and clear cart
      await new Promise((r) => setTimeout(r, 1000));
      clearCart();
      alert('Payment processed successfully! (Demo)');
    } catch (e) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Checkout">
      <h2 className="text-2xl font-semibold text-pink-900 mb-4">Checkout</h2>
      {items.length === 0 ? (
        <p className="text-pink-900/70">Your cart is empty.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={onSubmit} noValidate className="space-y-4" aria-labelledby="checkout-form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-pink-900">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="name"
                required
              />
              {errors.name && <p role="alert" className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

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
              <label htmlFor="address" className="block text-sm font-medium text-pink-900">
                Address
              </label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={onChange}
                className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="street-address"
                required
              />
              {errors.address && <p role="alert" className="text-sm text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-pink-900">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
                {errors.city && <p role="alert" className="text-sm text-red-600 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="postal" className="block text-sm font-medium text-pink-900">
                  Postal code
                </label>
                <input
                  id="postal"
                  name="postal"
                  value={form.postal}
                  onChange={onChange}
                  className="mt-1 w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
                {errors.postal && <p role="alert" className="text-sm text-red-600 mt-1">{errors.postal}</p>}
              </div>
            </div>

            <fieldset className="mt-4" aria-label="Payment method">
              <legend className="block text-sm font-medium text-pink-900">Payment method</legend>
              <div className="mt-2 flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={form.paymentMethod === 'stripe'}
                    onChange={onChange}
                  />
                  <span>Stripe</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={form.paymentMethod === 'paypal'}
                    onChange={onChange}
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={processing}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {processing ? 'Processing…' : `Pay ${subtotal.toFixed(2)}`}
            </button>
          </form>

          <aside className="bg-white rounded-xl border border-pink-100 p-4 h-fit" aria-label="Order summary">
            <h3 className="text-lg font-semibold text-pink-900 mb-2">Order Summary</h3>
            <ul className="divide-y divide-pink-100">
              {items.map((i) => (
                <li key={i.id} className="py-2 flex items-center justify-between text-pink-900">
                  <span>
                    {i.name} × {i.qty}
                  </span>
                  <span>${(i.price * i.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-pink-900">Subtotal</span>
              <span className="text-pink-900 font-semibold">${subtotal.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
