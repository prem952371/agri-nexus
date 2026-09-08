import {
  MOCK_ORDERS,
  STORAGE_KEYS,
  getMockProducts,
  readMock,
  writeMock,
} from './mockData';

const delay = (value) => new Promise(resolve => setTimeout(() => resolve(value), 180));

export const getProducts = async (params) => delay({ data: { success: true, data: getMockProducts(params) } });

export const getProduct = async (id) => {
  const product = getMockProducts({}).find(item => item._id === id) || getMockProducts({})[0];
  return delay({ data: { success: true, data: product } });
};

export const createProduct = async (data) => {
  const products = readMock(STORAGE_KEYS.products, getMockProducts({}));
  const product = {
    ...data,
    _id: `mock-${Date.now()}`,
    quantity: Number(data.quantity),
    availableQuantity: Number(data.quantity),
    price: Number(data.price),
    isActive: true,
  };
  writeMock(STORAGE_KEYS.products, [product, ...products]);
  return delay({ data: { success: true, data: product } });
};

export const updateProduct = async (id, data) => {
  const products = readMock(STORAGE_KEYS.products, getMockProducts({}));
  const updated = products.map(product => product._id === id ? { ...product, ...data } : product);
  writeMock(STORAGE_KEYS.products, updated);
  return delay({ data: { success: true, data: updated.find(product => product._id === id) } });
};

export const deleteProduct = async (id) => updateProduct(id, { isActive: false });

export const getOrders = async () => delay({ data: { success: true, data: readMock(STORAGE_KEYS.orders, MOCK_ORDERS) } });

export const getOrder = async (id) => {
  const order = readMock(STORAGE_KEYS.orders, MOCK_ORDERS).find(item => item.orderId === id);
  return delay({ data: { success: true, data: order } });
};

export const createOrder = async (data) => {
  const orders = readMock(STORAGE_KEYS.orders, MOCK_ORDERS);
  const order = {
    ...data,
    orderId: `ORD-${Date.now()}`,
    status: 'confirmed',
    paymentStatus: 'paid',
    estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN'),
    createdAt: new Date().toISOString(),
  };
  writeMock(STORAGE_KEYS.orders, [order, ...orders]);
  return delay({ data: { success: true, data: order } });
};

export const updateOrderStatus = async (id, status) => {
  const orders = readMock(STORAGE_KEYS.orders, MOCK_ORDERS).map(order => order.orderId === id ? { ...order, status } : order);
  writeMock(STORAGE_KEYS.orders, orders);
  return delay({ data: { success: true, data: orders.find(order => order.orderId === id) } });
};

export const getForecast = async ({ product = 'Tomato', location = 'Delhi', days = 7 } = {}) => {
  const base = { Tomato: 3800, Wheat: 6200, Rice: 4500, Potato: 2800, Onion: 7500, Maize: 3200 }[product] || 3000;
  const forecast = Array.from({ length: Number(days) }, (_, index) => {
    const predictedDemand = Math.round(base * (1 + index * 0.012));
    return { date: `Day ${index + 1}`, predictedDemand, low: Math.round(predictedDemand * 0.88), high: Math.round(predictedDemand * 1.12) };
  });
  const historicalData = Array.from({ length: 14 }, (_, index) => ({ date: `Past ${14 - index}`, actualDemand: Math.round(base * (0.92 + index * 0.006)) }));
  return delay({ data: { success: true, data: { product, location, forecast, historicalData, trend: 'increasing', confidence: 84, averageDemand: Math.round(base * 1.04), trendChangePct: 6.2, recommendation: `Demand for ${product} in ${location} is trending upward. Consider listing 6% more supply.` } } });
};

export const optimizeRoutes = async () => delay({ data: {
  optimizedRoute: [{ group: 1, orders: ['ORD-20260905', 'ORD-20260908'], route: 'Karnal → Ludhiana → Delhi', distance: 420, cost: 3900, vehicleType: '10-Ton Truck', stops: 3 }],
  totalDistance: 420, estimatedCost: 3900, traditionalDistance: 720, traditionalCost: 7200, estimatedSavings: 3300, savingsPercent: 45.8,
} });

export const getDeliveries = async () => delay({ data: { success: true, data: readMock(STORAGE_KEYS.orders, MOCK_ORDERS) } });

export const getAnalyticsOverview = async () => delay({ data: { success: true, data: {
  totalFarmers: 12400, totalProducts: 2840, totalOrders: 48500, totalValue: 12800000,
  monthlyOrders: [{ month: 'Apr', orders: 4200 }, { month: 'May', orders: 5100 }, { month: 'Jun', orders: 6300 }, { month: 'Jul', orders: 7200 }, { month: 'Aug', orders: 8100 }, { month: 'Sep', orders: 9400 }],
} } });

export const getImpactData = async () => delay({ data: { success: true, data: {} } });
export const getUsers = async () => delay({ data: { success: true, data: [] } });
export const getUser = async (id) => delay({ data: { success: true, data: { _id: id } } });
export const getUserStats = async () => delay({ data: { success: true, data: {} } });
export const createUser = async (data) => delay({ data: { success: true, data } });

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getOrders, getOrder, createOrder, updateOrderStatus, getForecast, optimizeRoutes, getDeliveries, getAnalyticsOverview, getImpactData, getUsers, getUser, getUserStats, createUser };
