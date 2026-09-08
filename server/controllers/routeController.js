const Delivery = require('../models/Delivery');

// ─── City distance matrix (approximate km between Indian cities) ─────────────
const CITY_DISTANCES = {
  'Karnal-Delhi': 130,
  'Ambala-Delhi': 200,
  'Ludhiana-Delhi': 310,
  'Jaipur-Delhi': 270,
  'Agra-Delhi': 200,
  'Meerut-Delhi': 70,
  'Chandigarh-Delhi': 250,
  'Amritsar-Delhi': 450,
  'Mumbai-Pune': 150,
  'Mumbai-Nashik': 170,
  'Mumbai-Aurangabad': 340,
  'Mumbai-Surat': 280,
  'Bangalore-Mysore': 150,
  'Bangalore-Hubli': 410,
  'Bangalore-Hyderabad': 570,
  'Bangalore-Chennai': 345,
  'Hyderabad-Vijayawada': 275,
  'Hyderabad-Kurnool': 215,
  'Chennai-Coimbatore': 500,
  'Nashik-Pune': 210,
  'Kurnool-Hyderabad': 215,
  'Surat-Mumbai': 280,
  'Surat-Ahmedabad': 265,
  'Ahmedabad-Mumbai': 534,
};

const getDistance = (origin, destination) => {
  const key1 = `${origin}-${destination}`;
  const key2 = `${destination}-${origin}`;
  return CITY_DISTANCES[key1] || CITY_DISTANCES[key2] || estimateDistance(origin, destination);
};

// Fallback: rough estimate if city pair not in matrix
const estimateDistance = (origin, destination) => {
  if (origin.toLowerCase() === destination.toLowerCase()) return 0;
  // Default estimate for unknown city pairs
  return 300 + Math.floor(Math.random() * 200);
};

// Determine vehicle type based on total quantity
const getVehicleType = (totalQuantity) => {
  if (totalQuantity <= 500) return { type: 'Mini Truck (Tata Ace)', capacity: 500, baseRate: 12 };
  if (totalQuantity <= 2000) return { type: 'Medium Truck', capacity: 2000, baseRate: 9 };
  return { type: 'Large Truck (12-Wheeler)', capacity: 10000, baseRate: 7 };
};

// Calculate cost: rate per km * distance, adjusted for load
const calculateCost = (distanceKm, quantityKg) => {
  const vehicle = getVehicleType(quantityKg);
  const loadFactor = Math.max(0.6, quantityKg / vehicle.capacity);
  return Math.round(distanceKm * vehicle.baseRate * loadFactor);
};

// @desc  Optimize delivery routes
// @route POST /api/routes/optimize
const optimizeRoutes = async (req, res, next) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'orders[] array is required' });
    }

    // ── Step 1: Calculate traditional (individual) delivery cost ─────────────
    let traditionalDistance = 0;
    let traditionalCost = 0;

    const individualTrips = orders.map((order) => {
      const origin = order.farmer || order.origin || 'Unknown';
      const dest = order.destination || order.deliveryLocation || 'Delhi';
      const dist = getDistance(origin, dest);
      const qty = order.quantity || 100;
      const cost = calculateCost(dist, qty);
      traditionalDistance += dist;
      traditionalCost += cost;
      return { orderId: order.id || order._id, origin, dest, dist, qty, cost };
    });

    // ── Step 2: Group orders by destination ──────────────────────────────────
    const grouped = {};
    for (const order of orders) {
      const dest = order.destination || order.deliveryLocation || 'Delhi';
      if (!grouped[dest]) grouped[dest] = [];
      grouped[dest].push(order);
    }

    // ── Step 3: For each destination group, further group by nearest origins ──
    const optimizedGroups = [];
    let totalOptimizedDistance = 0;
    let totalOptimizedCost = 0;
    let groupIndex = 1;

    for (const [destination, groupOrders] of Object.entries(grouped)) {
      // Sub-group by origin city (nearest-neighbor: same origin travels together)
      const originGroups = {};
      for (const order of groupOrders) {
        const origin = order.farmer || order.origin || 'Unknown';
        if (!originGroups[origin]) originGroups[origin] = [];
        originGroups[origin].push(order);
      }

      for (const [origin, subOrders] of Object.entries(originGroups)) {
        const totalQty = subOrders.reduce((sum, o) => sum + (o.quantity || 100), 0);
        const dist = getDistance(origin, destination);
        const cost = calculateCost(dist, totalQty);
        const vehicle = getVehicleType(totalQty);

        totalOptimizedDistance += dist;
        totalOptimizedCost += cost;

        optimizedGroups.push({
          group: groupIndex++,
          origin,
          destination,
          orders: subOrders.map((o) => ({ id: o.id || o._id, quantity: o.quantity || 100 })),
          totalQuantity: totalQty,
          distance: dist,
          cost,
          vehicleType: vehicle.type,
          savings: 0, // calculated after
        });
      }
    }

    const estimatedSavings = Math.max(0, traditionalCost - totalOptimizedCost);
    const savingsPercent =
      traditionalCost > 0 ? Math.round((estimatedSavings / traditionalCost) * 100) : 0;

    // Persist delivery records
    const deliveryRecords = [];
    for (const group of optimizedGroups) {
      const deliveryId = `DLV-${Date.now()}-${group.group}`;
      const depTime = new Date();
      depTime.setHours(depTime.getHours() + 2);
      const eta = new Date(depTime.getTime() + (group.distance / 60) * 3600 * 1000); // ~60 km/h

      const saved = await Delivery.create({
        deliveryId,
        orderIds: group.orders.map((o) => o.id || String(o.id)),
        origin: group.origin,
        destination: group.destination,
        distance: group.distance,
        estimatedCost: Math.round(traditionalCost / optimizedGroups.length),
        optimizedCost: group.cost,
        savings: Math.round(estimatedSavings / optimizedGroups.length),
        status: 'scheduled',
        vehicle: group.vehicleType,
        departureTime: depTime,
        estimatedArrival: eta,
      });
      deliveryRecords.push(saved._id);
    }

    res.json({
      success: true,
      data: {
        optimizedRoutes: optimizedGroups,
        summary: {
          totalGroups: optimizedGroups.length,
          totalOrders: orders.length,
          totalOptimizedDistance,
          estimatedCost: totalOptimizedCost,
          traditionalDistance,
          traditionalCost,
          estimatedSavings,
          savingsPercent,
        },
        deliveryRecordsCreated: deliveryRecords.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all deliveries
// @route GET /api/routes/deliveries
const getDeliveries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const deliveries = await Delivery.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: deliveries.length, data: deliveries });
  } catch (err) {
    next(err);
  }
};

module.exports = { optimizeRoutes, getDeliveries };
