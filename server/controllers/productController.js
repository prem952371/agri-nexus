const Product = require('../models/Product');
const User = require('../models/User');

// @desc  Get all products with filters
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, state, location, quality, search, sort, farmer, active } = req.query;

    const query = {};

    // Only active products by default (unless explicitly requesting all)
    if (active !== 'false') {
      query.isActive = true;
    }

    if (category) query.category = category;
    if (state) query.state = { $regex: new RegExp(state, 'i') };
    if (location) query.location = { $regex: new RegExp(location, 'i') };
    if (quality) query.quality = quality;
    if (farmer) query.farmer = farmer;

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { farmerName: { $regex: new RegExp(search, 'i') } },
        { location: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(query)
      .populate('farmer', 'name role location state phone farmerType fpoName')
      .sort(sortOption)
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name role location state phone farmerType fpoName totalSales')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc  Create product
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name, category, farmer, farmerName, farmerType, location, state,
      quantity, price, quality, harvestDate, availableFrom, description,
      image, unit, minOrderQuantity, deliveryDays,
    } = req.body;

    if (!name || !category || !farmer || !location || !state || quantity == null || price == null) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, farmer, location, state, quantity, price',
      });
    }

    // Resolve farmer name if not provided
    let resolvedFarmerName = farmerName;
    if (!resolvedFarmerName) {
      const farmerDoc = await User.findById(farmer).lean();
      if (!farmerDoc) {
        return res.status(400).json({ success: false, message: 'Farmer not found' });
      }
      resolvedFarmerName = farmerDoc.name;
    }

    const product = await Product.create({
      name,
      category,
      farmer,
      farmerName: resolvedFarmerName,
      farmerType: farmerType || 'Individual',
      location,
      state,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      price: Number(price),
      quality: quality || 'A',
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      description,
      image,
      unit: unit || 'kg',
      minOrderQuantity: minOrderQuantity ? Number(minOrderQuantity) : 10,
      deliveryDays: deliveryDays ? Number(deliveryDays) : 3,
    });

    const populated = await Product.findById(product._id)
      .populate('farmer', 'name role location state phone farmerType fpoName')
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('farmer', 'name role location state phone farmerType fpoName');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc  Soft-delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deactivated successfully', data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
