import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const TRANSLATIONS = {
  English: {},
  Hindi: {
    Home: 'होम', Marketplace: 'बाज़ार', Cart: 'कार्ट', Login: 'लॉगिन',
    Dashboard: 'डैशबोर्ड', 'My Produce': 'मेरी उपज', 'Add Produce': 'उपज जोड़ें',
    Orders: 'ऑर्डर', 'My Orders': 'मेरे ऑर्डर', 'Demand Forecast': 'मांग पूर्वानुमान',
    Earnings: 'कमाई', Weather: 'मौसम', 'Mandi Prices': 'मंडी भाव',
    'Government Schemes': 'सरकारी योजनाएं', Community: 'समुदाय', Messages: 'संदेश',
    Notifications: 'सूचनाएं', 'My Profile': 'मेरी प्रोफ़ाइल', 'Help & Support': 'सहायता और समर्थन',
    Settings: 'सेटिंग्स', MarketplaceTitle: 'कृषि बाज़ार', Save: 'सहेजें',
    'Weather Dashboard': 'मौसम डैशबोर्ड', 'Farmer Community': 'किसान समुदाय',
    'Profile saved locally': 'प्रोफ़ाइल स्थानीय रूप से सहेजी गई',
    'Settings saved locally': 'सेटिंग्स स्थानीय रूप से सहेजी गईं',
    Preferences: 'प्राथमिकताएं', 'These settings stay on this device.': 'ये सेटिंग्स इसी डिवाइस पर रहेंगी।',
    'Order notifications': 'ऑर्डर सूचनाएं', 'Get updates about delivery and payments.': 'डिलीवरी और भुगतान के अपडेट पाएं।',
    'Market alerts': 'बाज़ार अलर्ट', 'Show crop price and demand changes.': 'फसल कीमत और मांग में बदलाव देखें।',
    Language: 'भाषा', 'Adjust your local prototype preferences.': 'अपने स्थानीय प्रोटोटाइप की प्राथमिकताएं बदलें।',
    'Keep your farmer profile ready for buyers and community members.': 'खरीदारों और समुदाय के लिए अपनी किसान प्रोफ़ाइल तैयार रखें।',
    'Local weather guidance for your farm activities.': 'कृषि गतिविधियों के लिए स्थानीय मौसम मार्गदर्शन।',
    'Discover support programmes relevant to your farm.': 'अपने खेत से जुड़ी सहायता योजनाएं खोजें।',
    'Learn from fellow farmers, FPOs, and local experts.': 'किसानों, एफपीओ और स्थानीय विशेषज्ञों से सीखें।',
    'Stay up to date with orders, markets, and schemes.': 'ऑर्डर, बाज़ार और योजनाओं की जानकारी पाएं।',
    'Coordinate with farmers and buyers in the demo inbox.': 'डेमो इनबॉक्स में किसानों और खरीदारों से संपर्क करें।',
    'Quick answers for your Krishi Setu demo journey.': 'Krishi Setu डेमो के लिए तुरंत सहायता पाएं।',
  },
};

export function AppProvider({ children }) {
  // Role management - demo auth
  const [role, setRole] = useState(() => localStorage.getItem('agrinexus_role') || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agrinexus_user')); } catch { return null; }
  });
  const [language, setLanguageState] = useState(() => localStorage.getItem('krishisetu_language') || 'English');

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

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('krishisetu_language', nextLanguage);
  }, []);

  const t = useCallback((key) => TRANSLATIONS[language]?.[key] || key, [language]);

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
      language, setLanguage, t,
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
