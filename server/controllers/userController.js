const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc  Get all users
// @route GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single user
// @route GET /api/users/:id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc  Create user
// @route POST /api/users
const createUser = async (req, res, next) => {
  try {
    const { name, role, location, state, phone, email, farmName, fpoName, farmerType } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'name and role are required' });
    }

    const user = await User.create({
      name, role, location, state, phone, email,
      farmName, fpoName,
      farmerType: farmerType || 'Individual',
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc  Get user stats (for farmers: products & earnings; for buyers: orders)
// @route GET /api/users/:id/stats
const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'farmer') {
      // Products
      const products = await Product.find({ farmer: req.params.id }).lean();
      const activeProducts = products.filter((p) => p.isActive).length;
      const totalInventoryKg = products.reduce((s, p) => s + p.availableQuantity, 0);

      // Orders containing this farmer's products
      const productIds = products.map((p) => p._id);
      const orders = await Order.find({ 'items.product': { $in: productIds } }).lean();
      const totalEarnings = orders.reduce((sum, order) => {
        const farmerItems = order.items.filter(
          (item) => item.product && productIds.map(String).includes(String(item.product))
        );
        return sum + farmerItems.reduce((s, i) => s + i.subtotal, 0);
      }, 0);

      // Monthly earnings (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const recentOrders = orders.filter((o) => new Date(o.createdAt) >= sixMonthsAgo);

      const monthlyMap = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      recentOrders.forEach((order) => {
        const d = new Date(order.createdAt);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyMap[key]) monthlyMap[key] = { month: key, orders: 0, earnings: 0 };
        monthlyMap[key].orders++;
        const farmerItems = order.items.filter(
          (item) => item.product && productIds.map(String).includes(String(item.product))
        );
        monthlyMap[key].earnings += farmerItems.reduce((s, i) => s + i.subtotal, 0);
      });

      res.json({
        success: true,
        data: {
          user,
          stats: {
            totalProducts: products.length,
            activeProducts,
            totalInventoryKg,
            totalOrders: orders.length,
            totalEarnings: Math.round(totalEarnings),
            avgOrderValue: orders.length > 0 ? Math.round(totalEarnings / orders.length) : 0,
            monthlyPerformance: Object.values(monthlyMap),
            productBreakdown: products.map((p) => ({
              name: p.name,
              category: p.category,
              availableQuantity: p.availableQuantity,
              price: p.price,
              isActive: p.isActive,
            })),
          },
        },
      });
    } else {
      // Buyer stats
      const orders = await Order.find({ buyer: req.params.id }).lean();
      const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
      const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

      res.json({
        success: true,
        data: {
          user,
          stats: {
            totalOrders: orders.length,
            deliveredOrders,
            pendingOrders: orders.filter((o) => o.status === 'pending').length,
            totalSpent: Math.round(totalSpent),
            avgOrderValue: orders.length > 0 ? Math.round(totalSpent / orders.length) : 0,
            recentOrders: orders.slice(0, 5),
          },
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUser, createUser, getUserStats };
