import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Role management - demo auth
  const [role, setRole] = useState(() => localStorage.getItem('agrinexus_role') || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agrinexus_user')); } catch { return null; }
  });

  // Cart state
  const [cart, setCart] = useState([]);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const selectRole = useCallback((selectedRole, userData = null) => {
    setRole(selectedRole);
    localStorage.setItem('agrinexus_role', selectedRole);
    if (userData) {
      setUser(userData);
      localStorage.setItem('agrinexus_user', JSON.stringify(userData));
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setUser(null);
    setCart([]);
    localStorage.removeItem('agrinexus_role');
    localStorage.removeItem('agrinexus_user');
  }, []);

  const addToCart = useCallback((product, quantity = 10) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(`${product.name} added to cart!`, 'success');
  }, []);

  const updateCartQty = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product._id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return (
    <AppContext.Provider value={{
      role, user, selectRole, logout,
      cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal, cartCount,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
