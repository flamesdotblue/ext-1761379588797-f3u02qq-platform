import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';

// Product seed data (optimized images from Unsplash)
const initialProducts = [
  {
    id: 'cake-1',
    name: 'Strawberry Shortcake',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1602663491496-73f07481dbea?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTdHJhd2JlcnJ5JTIwU2hvcnRjYWtlfGVufDB8MHx8fDE3NjEzNzgxNDh8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    description: 'Fluffy sponge layered with whipped cream and fresh strawberries.'
  },
  {
    id: 'cake-2',
    name: 'Chocolate Ganache',
    price: 34.5,
    image:
      'https://images.unsplash.com/photo-1685521488661-34aebd9abdb2?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaG9jb2xhdGUlMjBHYW5hY2hlfGVufDB8MHx8fDE3NjEzODAwNTZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    description: 'Rich chocolate cake coated in silky dark chocolate ganache.'
  },
  {
    id: 'cake-3',
    name: 'Lemon Drizzle',
    price: 24.0,
    image:
      'https://images.unsplash.com/photo-1738664888052-585dd9dcd78a?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxMZW1vbiUyMERyaXp6bGV8ZW58MHwwfHx8MTc2MTM3ODM0NXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    description: 'Zesty lemon cake with a tangy drizzle and candied peel.'
  },
  {
    id: 'cake-4',
    name: 'Red Velvet',
    price: 32.0,
    image:
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxSZWQlMjBWZWx2ZXR8ZW58MHwwfHx8MTc2MTM3ODM0NXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    description: 'Classic red velvet with cream cheese frosting.'
  }
];

const pastel = {
  pink: '#F8BBD0',
  purple: '#E1BEE7',
  blue: '#BBDEFB'
};

const StoreContext = createContext(null);

const initialState = {
  products: initialProducts,
  cart: [], // {id, name, price, image, qty}
  user: null, // {id, email, role}
  theme: pastel
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSION': {
      return { ...state, user: action.user || null, cart: action.cart || [] };
    }
    case 'ADD_TO_CART': {
      const { product, qty } = action;
      const existing = state.cart.find((i) => i.id === product.id);
      let nextCart;
      if (existing) {
        nextCart = state.cart.map((i) => (i.id === product.id ? { ...i, qty: Math.max(1, i.qty + qty) } : i));
      } else {
        nextCart = [...state.cart, { id: product.id, name: product.name, price: product.price, image: product.image, qty: Math.max(1, qty) }];
      }
      return { ...state, cart: nextCart };
    }
    case 'REMOVE_FROM_CART': {
      return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
    }
    case 'SET_QTY': {
      const { id, qty } = action;
      return { ...state, cart: state.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)) };
    }
    case 'CLEAR_CART': {
      return { ...state, cart: [] };
    }
    case 'LOGIN': {
      return { ...state, user: action.user };
    }
    case 'LOGOUT': {
      return { ...state, user: null };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simple session persistence
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cakeShopSession');
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'INIT_SESSION', user: parsed.user, cart: parsed.cart || [] });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cakeShopSession', JSON.stringify({ user: state.user, cart: state.cart }));
    } catch {}
  }, [state.user, state.cart]);

  const actions = useMemo(
    () => ({
      addToCart: (product, qty = 1) => dispatch({ type: 'ADD_TO_CART', product, qty }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', id }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      login: (user) => dispatch({ type: 'LOGIN', user }),
      logout: () => dispatch({ type: 'LOGOUT' })
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useProducts() {
  return useStore().state.products;
}

export function useCart() {
  const { state, actions } = useStore();
  const subtotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return { items: state.cart, subtotal, ...actions };
}

export function useUser() {
  const { state, actions } = useStore();
  return { user: state.user, login: actions.login, logout: actions.logout };
}

export const theme = pastel;
