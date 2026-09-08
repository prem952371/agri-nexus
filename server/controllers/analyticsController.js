const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

// @desc  Get platform overview analytics
// @route GET /api/analytics/overview
const getOverview = async (req, res, next) => {
  try {
    // ── Counts ────────────────────────────────────────────────────────────────
    const [
      totalFarmers,
      totalFPOs,
      totalBuyers,
      totalProducts,
      activeProducts,
      totalOrders,
      activeDeliveries,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer', farmerType: 'Individual' }),
      User.countDocuments({ role: 'farmer', farmerType: 'FPO' }),
      User.countDocuments({ role: { $in: ['consumer', 'bulk_buyer'] } }),
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({}),
      Delivery.countDocuments({ status: { $in: ['scheduled', 'in_transit'] } }),
    ]);

    // ── Total transaction value ───────────────────────────────────────────────
    const transactionAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalTransactionValue = transactionAgg[0]?.total || 0;

    // ── Monthly orders (last 6 months) ────────────────────────────────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyOrders = monthlyAgg.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      orders: m.orders,
      revenue: m.revenue,
    }));

    // ── Category breakdown ────────────────────────────────────────────────────
    const categoryAgg = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Join with order values by category via items
    const orderCategoryAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$productInfo.category',
          value: { $sum: '$items.subtotal' },
        },
      },
    ]);

    const categoryValueMap = {};
    orderCategoryAgg.forEach((c) => {
      if (c._id) categoryValueMap[c._id] = c.value;
    });

    const categoryBreakdown = categoryAgg.map((c) => ({
      category: c._id,
      count: c.count,
      value: categoryValueMap[c._id] || 0,
    }));

    // ── Top products ──────────────────────────────────────────────────────────
    const topProductsAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const topProducts = topProductsAgg.map((p) => ({
      name: p._id,
      totalSold: p.totalSold,
      revenue: p.revenue,
    }));

    // ── State distribution ────────────────────────────────────────────────────
    const stateFarmersAgg = await User.aggregate([
      { $match: { role: 'farmer' } },
      { $group: { _id: '$state', farmers: { $sum: 1 } } },
    ]);

    const stateOrdersAgg = await Order.aggregate([
      { $group: { _id: '$deliveryState', orders: { $sum: 1 } } },
    ]);

    const stateMap = {};
    stateFarmersAgg.forEach((s) => {
      if (s._id) stateMap[s._id] = { state: s._id, farmers: s.farmers, orders: 0 };
    });
    stateOrdersAgg.forEach((s) => {
      if (s._id) {
        if (!stateMap[s._id]) stateMap[s._id] = { state: s._id, farmers: 0, orders: 0 };
        stateMap[s._id].orders = s.orders;
      }
    });

    const stateDistribution = Object.values(stateMap).sort((a, b) => b.farmers - a.farmers);

    res.json({
      success: true,
      data: {
        totalFarmers,
        totalFPOs,
        totalBuyers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalTransactionValue: Math.round(totalTransactionValue),
        activeDeliveries,
        monthlyOrders,
        categoryBreakdown,
        topProducts,
        stateDistribution,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get impact comparison (traditional vs AgriNexus)
// @route GET /api/analytics/impact
const getImpact = async (req, res, next) => {
  try {
    // These are computed benchmark figures based on APMC market research
    const traditional = {
      farmerReceives: 18,       // INR/kg
      consumerPays: 32,         // INR/kg
      intermediaries: 3,        // number of middlemen
      margin: 14,               // difference (consumer - farmer)
      logisticsCost: 4.5,       // INR/kg
      farmersReach: '< 50 km',
      priceTransparency: 'None',
    };

    const agrinexus = {
      farmerReceives: 24,
      consumerPays: 29,
      intermediaries: 0,
      margin: 5,
      logisticsCost: 2.5,
      farmersReach: 'Pan-India',
      priceTransparency: 'Real-time',
    };

    const improvement = {
      farmerEarningsIncrease: parseFloat(
        (((agrinexus.farmerReceives - traditional.farmerReceives) / traditional.farmerReceives) * 100).toFixed(1)
      ),
      consumerSavings: parseFloat(
        (((traditional.consumerPays - agrinexus.consumerPays) / traditional.consumerPays) * 100).toFixed(1)
      ),
      logisticsSavingsPercent: parseFloat(
        (((traditional.logisticsCost - agrinexus.logisticsCost) / traditional.logisticsCost) * 100).toFixed(1)
      ),
      marginReduction: parseFloat(
        (((traditional.margin - agrinexus.margin) / traditional.margin) * 100).toFixed(1)
      ),
    };

    // Dynamic chart data: last 6 months order trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = {
      ordersGrowth: monthlyAgg.map((m) => ({
        month: monthNames[m._id.month - 1],
        orders: m.orders,
        revenue: m.revenue,
      })),
      priceComparison: [
        { label: 'Traditional', farmerPrice: traditional.farmerReceives, consumerPrice: traditional.consumerPays },
        { label: 'AgriNexus', farmerPrice: agrinexus.farmerReceives, consumerPrice: agrinexus.consumerPays },
      ],
      logisticsSavings: [
        { label: 'Traditional Logistics', cost: traditional.logisticsCost },
        { label: 'AgriNexus Optimized', cost: agrinexus.logisticsCost },
      ],
    };

    res.json({
      success: true,
      data: {
        traditional,
        agrinexus,
        improvement,
        chartData,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getImpact };
