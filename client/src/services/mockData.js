const STORAGE_KEYS = {
  products: 'krishisetu_products',
  orders: 'krishisetu_orders',
};

export const MOCK_PRODUCTS = [
  { _id: '1', name: 'Wheat', category: 'Cereals', farmerName: 'Ramesh Kumar', farmerType: 'Individual', location: 'Karnal', state: 'Haryana', availableQuantity: 2000, quantity: 2000, price: 24, quality: 'A', deliveryDays: 3, minOrderQuantity: 50, description: 'Premium HD-2967 wheat, cleaned and moisture controlled.', image: '🌾', isActive: true },
  { _id: '2', name: 'Basmati Rice', category: 'Cereals', farmerName: 'Sukhdev Singh', farmerType: 'FPO', location: 'Ludhiana', state: 'Punjab', availableQuantity: 1500, quantity: 1500, price: 65, quality: 'A', deliveryDays: 4, minOrderQuantity: 25, description: 'Long-grain aromatic Pusa Basmati 1121.', image: '🍚', isActive: true },
  { _id: '3', name: 'Tomatoes', category: 'Vegetables', farmerName: 'Lakshmi Devi', farmerType: 'Individual', location: 'Nashik', state: 'Maharashtra', availableQuantity: 800, quantity: 800, price: 22, quality: 'A', deliveryDays: 2, minOrderQuantity: 10, description: 'Fresh hybrid tomatoes, bright red and uniform.', image: '🍅', isActive: true },
  { _id: '4', name: 'Onions', category: 'Vegetables', farmerName: 'Govind Patel', farmerType: 'Individual', location: 'Surat', state: 'Gujarat', availableQuantity: 1200, quantity: 1200, price: 18, quality: 'B', deliveryDays: 3, minOrderQuantity: 25, description: 'Medium-size red onions with excellent shelf life.', image: '🧅', isActive: true },
  { _id: '5', name: 'Potatoes', category: 'Vegetables', farmerName: 'Mohan Lal Sharma', farmerType: 'FPO', location: 'Agra', state: 'Uttar Pradesh', availableQuantity: 900, quantity: 900, price: 14, quality: 'A', deliveryDays: 3, minOrderQuantity: 25, description: 'Washed and graded Kufri Jyoti potatoes.', image: '🥔', isActive: true },
  { _id: '6', name: 'Maize', category: 'Cereals', farmerName: 'Ramesh Kumar', farmerType: 'Individual', location: 'Karnal', state: 'Haryana', availableQuantity: 3000, quantity: 3000, price: 19, quality: 'B', deliveryDays: 3, minOrderQuantity: 100, description: 'Yellow maize with 12% moisture, ideal for feed.', image: '🌽', isActive: true },
  { _id: '7', name: 'Red Apples', category: 'Fruits', farmerName: 'Harpreet Kaur', farmerType: 'Individual', location: 'Amritsar', state: 'Punjab', availableQuantity: 600, quantity: 600, price: 95, quality: 'A', deliveryDays: 2, minOrderQuantity: 10, description: 'Crisp red apples from Punjab orchards.', image: '🍎', isActive: true },
  { _id: '8', name: 'Chana Dal', category: 'Pulses', farmerName: 'Sunita Rathi', farmerType: 'Individual', location: 'Jaipur', state: 'Rajasthan', availableQuantity: 500, quantity: 500, price: 85, quality: 'A', deliveryDays: 4, minOrderQuantity: 20, description: 'Clean, high-protein chana dal for bulk buyers.', image: '🫘', isActive: true },
  { _id: '9', name: 'Mustard Seeds', category: 'Oilseeds', farmerName: 'Sukhdev Singh', farmerType: 'FPO', location: 'Ludhiana', state: 'Punjab', availableQuantity: 700, quantity: 700, price: 52, quality: 'B', deliveryDays: 4, minOrderQuantity: 20, description: 'Aromatic mustard seeds, sorted and packed.', image: '🌻', isActive: true },
];

export const MOCK_ORDERS = [
  { orderId: 'ORD-20260901', buyerName: 'Priya Mehta', buyerType: 'consumer', items: [{ productName: 'Wheat', quantity: 100 }], totalAmount: 2400, status: 'delivered', deliveryLocation: 'Lajpat Nagar, Delhi', createdAt: '2026-09-01' },
  { orderId: 'ORD-20260905', buyerName: 'Vikram Traders Pvt Ltd', buyerType: 'bulk_buyer', items: [{ productName: 'Maize', quantity: 500 }], totalAmount: 9500, status: 'in_transit', deliveryLocation: 'Mumbai', createdAt: '2026-09-05' },
  { orderId: 'ORD-20260907', buyerName: 'Anil Kumar', buyerType: 'consumer', items: [{ productName: 'Tomatoes', quantity: 200 }], totalAmount: 4400, status: 'processing', deliveryLocation: 'Chennai', createdAt: '2026-09-07' },
  { orderId: 'ORD-20260908', buyerName: 'Rajesh Bansal', buyerType: 'bulk_buyer', items: [{ productName: 'Wheat', quantity: 1000 }], totalAmount: 24000, status: 'confirmed', deliveryLocation: 'Mumbai', createdAt: '2026-09-08' },
];

export const readMock = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) && value.length ? value : fallback;
  } catch {
    return fallback;
  }
};

export const writeMock = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getMockProducts = (params = {}) => {
  let products = readMock(STORAGE_KEYS.products, MOCK_PRODUCTS).filter(p => p.isActive !== false);
  if (params.category) products = products.filter(p => p.category === params.category);
  if (params.state) products = products.filter(p => p.state.toLowerCase().includes(params.state.toLowerCase()));
  if (params.quality) products = products.filter(p => p.quality === params.quality);
  if (params.search) {
    const query = params.search.toLowerCase();
    products = products.filter(p => `${p.name} ${p.farmerName} ${p.location}`.toLowerCase().includes(query));
  }
  if (params.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (params.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  return products;
};

export { STORAGE_KEYS };
