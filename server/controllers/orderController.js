const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc  Get all orders
// @route GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { buyerId, farmerId, status } = req.query;
    const query = {};

    if (buyerId) query.buyer = buyerId;
    if (status) query.status = status;

    let orders = await Order.find(query)
      .populate('buyer', 'name role location')
      .sort({ createdAt: -1 })
      .lean();

    // Filter by farmerId if provided (check items' farmerName via product lookup)
    if (farmerId) {
      const farmerProducts = await Product.find({ farmer: farmerId }).select('_id').lean();
      const productIds = farmerProducts.map((p) => p._id.toString());
      orders = orders.filter((o) =>
        o.items.some((item) => item.product && productIds.includes(item.product.toString()))
      );
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single order
// @route GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    // Try by orderId string first, then by _id
    if (id.startsWith('ORD-')) {
      order = await Order.findOne({ orderId: id }).populate('buyer', 'name role location phone').lean();
    } else {
      order = await Order.findById(id).populate('buyer', 'name role location phone').lean();
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc  Create order
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { buyer, buyerName, buyerType, deliveryLocation, deliveryState, items, notes } = req.body;

    if (!deliveryLocation || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'deliveryLocation and items[] are required',
      });
    }

    // Enrich items and calculate totals
    const enrichedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product).lean();
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }
      if (product.availableQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}. Available: ${product.availableQuantity} kg`,
        });
      }

      const price = item.price || product.price;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      enrichedItems.push({
        product: product._id,
        productName: item.productName || product.name,
        farmerName: item.farmerName || product.farmerName,
        quantity: item.quantity,
        price,
        subtotal,
      });
    }

    // Resolve buyer name
    let resolvedBuyerName = buyerName;
    let resolvedBuyerType = buyerType;
    if (buyer && !resolvedBuyerName) {
      const buyerDoc = await User.findById(buyer).lean();
      if (buyerDoc) {
        resolvedBuyerName = buyerDoc.name;
        resolvedBuyerType = buyerDoc.role;
      }
    }

    // Generate orderId
    const orderId = `ORD-${Date.now()}`;

    // Estimated delivery: 3-5 days from now
    const deliveryDays = 3 + Math.floor(Math.random() * 3);
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    const order = await Order.create({
      orderId,
      buyer: buyer || undefined,
      buyerName: resolvedBuyerName,
      buyerType: resolvedBuyerType,
      deliveryLocation,
      deliveryState,
      items: enrichedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'paid', // demo: auto-paid
      notes,
      estimatedDelivery,
    });

    // Decrement availableQuantity for each product
    for (const item of enrichedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: -item.quantity },
      });
    }

    // Increment buyer totalOrders
    if (buyer) {
      await User.findByIdAndUpdate(buyer, { $inc: { totalOrders: 1 } });
    }

    const populated = await Order.findById(order._id)
      .populate('buyer', 'name role location phone')
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'delivered'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const updates = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('buyer', 'name role location phone')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
