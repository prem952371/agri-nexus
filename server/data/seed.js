/**
 * AgriNexus - Comprehensive seed script
 * Run: node data/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const HistoricalSales = require('../models/HistoricalSales');
const Delivery = require('../models/Delivery');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrinexus';

// ─── Helper: random int in range ────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, dp = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };

// ─── User definitions ────────────────────────────────────────────────────────
const usersData = [
  {
    name: 'Ramesh Kumar',
    role: 'farmer', location: 'Karnal', state: 'Haryana',
    phone: '9812345678', email: 'ramesh@agrinexus.in',
    farmName: 'Ramesh Farms', farmerType: 'Individual',
  },
  {
    name: 'Sukhdev Singh',
    role: 'farmer', location: 'Ludhiana', state: 'Punjab',
    phone: '9876543210', email: 'sukhdev@agrinexus.in',
    farmName: 'Singh Grains', fpoName: 'Punjab Wheat Growers Association', farmerType: 'FPO',
  },
  {
    name: 'Lakshmi Devi',
    role: 'farmer', location: 'Nashik', state: 'Maharashtra',
    phone: '9765432109', email: 'lakshmi@agrinexus.in',
    farmName: 'Devi Vegetables', farmerType: 'Individual',
  },
  {
    name: 'Govind Patel',
    role: 'farmer', location: 'Surat', state: 'Gujarat',
    phone: '9654321098', email: 'govind@agrinexus.in',
    farmName: 'Patel Agri', farmerType: 'Individual',
  },
  {
    name: 'Krishna Reddy',
    role: 'farmer', location: 'Kurnool', state: 'Andhra Pradesh',
    phone: '9543210987', email: 'krishna@agrinexus.in',
    farmName: 'Reddy Fields', farmerType: 'Individual',
  },
  {
    name: 'Harpreet Kaur',
    role: 'farmer', location: 'Amritsar', state: 'Punjab',
    phone: '9432109876', email: 'harpreet@agrinexus.in',
    farmName: 'Kaur Orchards', farmerType: 'Individual',
  },
  {
    name: 'Mohan Lal Sharma',
    role: 'farmer', location: 'Agra', state: 'Uttar Pradesh',
    phone: '9321098765', email: 'mohan@agrinexus.in',
    farmName: 'Sharma Coop', fpoName: 'UP Agri Cooperative', farmerType: 'FPO',
  },
  {
    name: 'Sunita Rathi',
    role: 'farmer', location: 'Jaipur', state: 'Rajasthan',
    phone: '9210987654', email: 'sunita@agrinexus.in',
    farmName: 'Rathi Farms', farmerType: 'Individual',
  },
  {
    name: 'Priya Mehta',
    role: 'consumer', location: 'Delhi', state: 'Delhi',
    phone: '9109876543', email: 'priya@gmail.com',
  },
  {
    name: 'Rajesh Bansal',
    role: 'bulk_buyer', location: 'Mumbai', state: 'Maharashtra',
    phone: '9098765432', email: 'rajesh@bansaltraders.com',
  },
  {
    name: 'Seema Nair',
    role: 'consumer', location: 'Bangalore', state: 'Karnataka',
    phone: '8987654321', email: 'seema@gmail.com',
  },
  {
    name: 'Vikram Traders Pvt Ltd',
    role: 'bulk_buyer', location: 'Delhi', state: 'Delhi',
    phone: '8876543210', email: 'vikram@vikramtraders.com',
  },
  {
    name: 'Anil Kumar',
    role: 'consumer', location: 'Chennai', state: 'Tamil Nadu',
    phone: '8765432109', email: 'anil@gmail.com',
  },
];

// ─── Product factory ─────────────────────────────────────────────────────────
const makeProducts = (farmerMap) => [
  {
    name: 'Wheat', category: 'Cereals',
    farmer: farmerMap['Ramesh Kumar'], farmerName: 'Ramesh Kumar', farmerType: 'Individual',
    location: 'Karnal', state: 'Haryana',
    quantity: 2000, availableQuantity: 2000, price: 24, quality: 'A',
    harvestDate: daysAgo(30), availableFrom: daysAgo(25),
    description: 'Premium HD-2967 wheat, moisture controlled, clean and sorted.',
    image: '🌾', minOrderQuantity: 50, deliveryDays: 2,
  },
  {
    name: 'Basmati Rice', category: 'Cereals',
    farmer: farmerMap['Sukhdev Singh'], farmerName: 'Sukhdev Singh', farmerType: 'FPO',
    location: 'Ludhiana', state: 'Punjab',
    quantity: 1500, availableQuantity: 1500, price: 65, quality: 'A',
    harvestDate: daysAgo(45), availableFrom: daysAgo(40),
    description: 'Long-grain aromatic Pusa Basmati 1121, aged 6 months.',
    image: '🍚', minOrderQuantity: 25, deliveryDays: 3,
  },
  {
    name: 'Tomatoes', category: 'Vegetables',
    farmer: farmerMap['Lakshmi Devi'], farmerName: 'Lakshmi Devi', farmerType: 'Individual',
    location: 'Nashik', state: 'Maharashtra',
    quantity: 800, availableQuantity: 800, price: 22, quality: 'A',
    harvestDate: daysAgo(3), availableFrom: daysAgo(2),
    description: 'Fresh hybrid tomatoes, bright red, uniform size, from Nashik APMC regulated farm.',
    image: '🍅', minOrderQuantity: 20, deliveryDays: 1,
  },
  {
    name: 'Onions', category: 'Vegetables',
    farmer: farmerMap['Govind Patel'], farmerName: 'Govind Patel', farmerType: 'Individual',
    location: 'Surat', state: 'Gujarat',
    quantity: 1200, availableQuantity: 1200, price: 18, quality: 'B',
    harvestDate: daysAgo(10), availableFrom: daysAgo(8),
    description: 'Medium-size red onions, low moisture content, excellent shelf life.',
    image: '🧅', minOrderQuantity: 50, deliveryDays: 2,
  },
  {
    name: 'Potatoes', category: 'Vegetables',
    farmer: farmerMap['Mohan Lal Sharma'], farmerName: 'Mohan Lal Sharma', farmerType: 'FPO',
    location: 'Agra', state: 'Uttar Pradesh',
    quantity: 900, availableQuantity: 900, price: 14, quality: 'A',
    harvestDate: daysAgo(20), availableFrom: daysAgo(18),
    description: 'Kufri Jyoti variety potatoes, washed, graded, ideal for chips and curry.',
    image: '🥔', minOrderQuantity: 50, deliveryDays: 2,
  },
  {
    name: 'Maize', category: 'Cereals',
    farmer: farmerMap['Ramesh Kumar'], farmerName: 'Ramesh Kumar', farmerType: 'Individual',
    location: 'Karnal', state: 'Haryana',
    quantity: 3000, availableQuantity: 3000, price: 19, quality: 'B',
    harvestDate: daysAgo(40), availableFrom: daysAgo(35),
    description: 'Yellow maize, 12% moisture, ideal for poultry feed and starch industry.',
    image: '🌽', minOrderQuantity: 100, deliveryDays: 2,
  },
  {
    name: 'Red Apples', category: 'Fruits',
    farmer: farmerMap['Harpreet Kaur'], farmerName: 'Harpreet Kaur', farmerType: 'Individual',
    location: 'Amritsar', state: 'Punjab',
    quantity: 600, availableQuantity: 600, price: 95, quality: 'A',
    harvestDate: daysAgo(7), availableFrom: daysAgo(5),
    description: 'Royal Gala apples, crisp and sweet, packed in 20kg CFB boxes.',
    image: '🍎', minOrderQuantity: 20, deliveryDays: 2,
  },
  {
    name: 'Chana Dal', category: 'Pulses',
    farmer: farmerMap['Sunita Rathi'], farmerName: 'Sunita Rathi', farmerType: 'Individual',
    location: 'Jaipur', state: 'Rajasthan',
    quantity: 500, availableQuantity: 500, price: 85, quality: 'A',
    harvestDate: daysAgo(60), availableFrom: daysAgo(55),
    description: 'Bold-grained split chickpea, free of weevils, 10% moisture.',
    image: '🫘', minOrderQuantity: 25, deliveryDays: 3,
  },
  {
    name: 'Moong Dal', category: 'Pulses',
    farmer: farmerMap['Krishna Reddy'], farmerName: 'Krishna Reddy', farmerType: 'Individual',
    location: 'Kurnool', state: 'Andhra Pradesh',
    quantity: 400, availableQuantity: 400, price: 92, quality: 'A',
    harvestDate: daysAgo(50), availableFrom: daysAgo(45),
    description: 'Green Moong split dal, machine cleaned, 9% moisture, bright green color.',
    image: '🫘', minOrderQuantity: 25, deliveryDays: 3,
  },
  {
    name: 'Mustard Seeds', category: 'Oilseeds',
    farmer: farmerMap['Sukhdev Singh'], farmerName: 'Sukhdev Singh', farmerType: 'FPO',
    location: 'Ludhiana', state: 'Punjab',
    quantity: 700, availableQuantity: 700, price: 52, quality: 'B',
    harvestDate: daysAgo(55), availableFrom: daysAgo(50),
    description: 'Yellow mustard seeds, 40% oil content, minimal foreign matter.',
    image: '🟡', minOrderQuantity: 50, deliveryDays: 3,
  },
  {
    name: 'Green Peas', category: 'Vegetables',
    farmer: farmerMap['Lakshmi Devi'], farmerName: 'Lakshmi Devi', farmerType: 'Individual',
    location: 'Nashik', state: 'Maharashtra',
    quantity: 300, availableQuantity: 300, price: 45, quality: 'A',
    harvestDate: daysAgo(4), availableFrom: daysAgo(3),
    description: 'Fresh field peas, sweet and tender, harvested daily.',
    image: '🫛', minOrderQuantity: 10, deliveryDays: 1,
  },
  {
    name: 'Cauliflower', category: 'Vegetables',
    farmer: farmerMap['Ramesh Kumar'], farmerName: 'Ramesh Kumar', farmerType: 'Individual',
    location: 'Karnal', state: 'Haryana',
    quantity: 500, availableQuantity: 500, price: 28, quality: 'A',
    harvestDate: daysAgo(2), availableFrom: daysAgo(1),
    description: 'Compact white curds, free of blemishes, medium size (1-1.5 kg each).',
    image: '🥦', minOrderQuantity: 20, deliveryDays: 1,
  },
  {
    name: 'Soybean', category: 'Oilseeds',
    farmer: farmerMap['Govind Patel'], farmerName: 'Govind Patel', farmerType: 'Individual',
    location: 'Surat', state: 'Gujarat',
    quantity: 800, availableQuantity: 800, price: 44, quality: 'B',
    harvestDate: daysAgo(35), availableFrom: daysAgo(30),
    description: 'Yellow soybean, 18% protein content, suitable for oil extraction.',
    image: '🌿', minOrderQuantity: 50, deliveryDays: 3,
  },
  {
    name: 'Jowar', category: 'Cereals',
    farmer: farmerMap['Krishna Reddy'], farmerName: 'Krishna Reddy', farmerType: 'Individual',
    location: 'Kurnool', state: 'Andhra Pradesh',
    quantity: 1000, availableQuantity: 1000, price: 21, quality: 'A',
    harvestDate: daysAgo(25), availableFrom: daysAgo(20),
    description: 'White sorghum (Jowar), high-quality, suitable for flour and feed.',
    image: '🌾', minOrderQuantity: 50, deliveryDays: 3,
  },
  {
    name: 'Groundnuts', category: 'Oilseeds',
    farmer: farmerMap['Sunita Rathi'], farmerName: 'Sunita Rathi', farmerType: 'Individual',
    location: 'Jaipur', state: 'Rajasthan',
    quantity: 600, availableQuantity: 600, price: 58, quality: 'A',
    harvestDate: daysAgo(15), availableFrom: daysAgo(12),
    description: 'Bold peanuts, 50% oil content, aflatoxin-tested, packed in 50 kg jute bags.',
    image: '🥜', minOrderQuantity: 25, deliveryDays: 3,
  },
  {
    name: 'Sugarcane', category: 'Cereals',
    farmer: farmerMap['Mohan Lal Sharma'], farmerName: 'Mohan Lal Sharma', farmerType: 'FPO',
    location: 'Agra', state: 'Uttar Pradesh',
    quantity: 5000, availableQuantity: 5000, price: 4, quality: 'A',
    harvestDate: daysAgo(5), availableFrom: daysAgo(3),
    description: 'CO-0238 sugarcane variety, 12% sucrose content, freshly harvested.',
    image: '🎋', minOrderQuantity: 500, deliveryDays: 1,
  },
  {
    name: 'Brinjal', category: 'Vegetables',
    farmer: farmerMap['Lakshmi Devi'], farmerName: 'Lakshmi Devi', farmerType: 'Individual',
    location: 'Nashik', state: 'Maharashtra',
    quantity: 400, availableQuantity: 400, price: 32, quality: 'B',
    harvestDate: daysAgo(2), availableFrom: daysAgo(1),
    description: 'Purple brinjal (eggplant), medium-large size, tender skin.',
    image: '🍆', minOrderQuantity: 20, deliveryDays: 1,
  },
  {
    name: 'Spinach', category: 'Vegetables',
    farmer: farmerMap['Harpreet Kaur'], farmerName: 'Harpreet Kaur', farmerType: 'Individual',
    location: 'Amritsar', state: 'Punjab',
    quantity: 200, availableQuantity: 200, price: 38, quality: 'A',
    harvestDate: daysAgo(1), availableFrom: new Date(),
    description: 'Fresh baby spinach, washed and packed, iron-rich dark leaves.',
    image: '🥬', minOrderQuantity: 10, deliveryDays: 1,
  },
];

// ─── Generate orders ─────────────────────────────────────────────────────────
const makeOrders = (userMap, productMap) => {
  const statuses = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'delivered'];
  const buyers = [
    { name: 'Priya Mehta', id: userMap['Priya Mehta'], type: 'consumer', loc: 'Delhi', state: 'Delhi' },
    { name: 'Rajesh Bansal', id: userMap['Rajesh Bansal'], type: 'bulk_buyer', loc: 'Mumbai', state: 'Maharashtra' },
    { name: 'Seema Nair', id: userMap['Seema Nair'], type: 'consumer', loc: 'Bangalore', state: 'Karnataka' },
    { name: 'Vikram Traders Pvt Ltd', id: userMap['Vikram Traders Pvt Ltd'], type: 'bulk_buyer', loc: 'Delhi', state: 'Delhi' },
    { name: 'Anil Kumar', id: userMap['Anil Kumar'], type: 'consumer', loc: 'Chennai', state: 'Tamil Nadu' },
  ];

  const orders = [
    // Order 1 - delivered
    {
      orderId: `ORD-${Date.now() - 2000000}`,
      buyer: buyers[0].id, buyerName: buyers[0].name, buyerType: buyers[0].type,
      deliveryLocation: buyers[0].loc, deliveryState: buyers[0].state,
      items: [
        { product: productMap['Wheat'], productName: 'Wheat', farmerName: 'Ramesh Kumar', quantity: 100, price: 24, subtotal: 2400 },
        { product: productMap['Cauliflower'], productName: 'Cauliflower', farmerName: 'Ramesh Kumar', quantity: 30, price: 28, subtotal: 840 },
      ],
      totalAmount: 3240, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(5), createdAt: daysAgo(15),
    },
    // Order 2 - delivered
    {
      orderId: `ORD-${Date.now() - 1900000}`,
      buyer: buyers[1].id, buyerName: buyers[1].name, buyerType: buyers[1].type,
      deliveryLocation: buyers[1].loc, deliveryState: buyers[1].state,
      items: [
        { product: productMap['Tomatoes'], productName: 'Tomatoes', farmerName: 'Lakshmi Devi', quantity: 200, price: 22, subtotal: 4400 },
        { product: productMap['Onions'], productName: 'Onions', farmerName: 'Govind Patel', quantity: 300, price: 18, subtotal: 5400 },
      ],
      totalAmount: 9800, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(3), createdAt: daysAgo(12),
    },
    // Order 3 - in_transit
    {
      orderId: `ORD-${Date.now() - 1800000}`,
      buyer: buyers[3].id, buyerName: buyers[3].name, buyerType: buyers[3].type,
      deliveryLocation: buyers[3].loc, deliveryState: buyers[3].state,
      items: [
        { product: productMap['Basmati Rice'], productName: 'Basmati Rice', farmerName: 'Sukhdev Singh', quantity: 500, price: 65, subtotal: 32500 },
        { product: productMap['Chana Dal'], productName: 'Chana Dal', farmerName: 'Sunita Rathi', quantity: 100, price: 85, subtotal: 8500 },
      ],
      totalAmount: 41000, status: 'in_transit', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(1), createdAt: daysAgo(8),
    },
    // Order 4 - processing
    {
      orderId: `ORD-${Date.now() - 1700000}`,
      buyer: buyers[2].id, buyerName: buyers[2].name, buyerType: buyers[2].type,
      deliveryLocation: buyers[2].loc, deliveryState: buyers[2].state,
      items: [
        { product: productMap['Potatoes'], productName: 'Potatoes', farmerName: 'Mohan Lal Sharma', quantity: 150, price: 14, subtotal: 2100 },
        { product: productMap['Green Peas'], productName: 'Green Peas', farmerName: 'Lakshmi Devi', quantity: 50, price: 45, subtotal: 2250 },
      ],
      totalAmount: 4350, status: 'processing', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(3), createdAt: daysAgo(5),
    },
    // Order 5 - confirmed
    {
      orderId: `ORD-${Date.now() - 1600000}`,
      buyer: buyers[4].id, buyerName: buyers[4].name, buyerType: buyers[4].type,
      deliveryLocation: buyers[4].loc, deliveryState: buyers[4].state,
      items: [
        { product: productMap['Moong Dal'], productName: 'Moong Dal', farmerName: 'Krishna Reddy', quantity: 100, price: 92, subtotal: 9200 },
      ],
      totalAmount: 9200, status: 'confirmed', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(4), createdAt: daysAgo(3),
    },
    // Order 6 - pending
    {
      orderId: `ORD-${Date.now() - 1500000}`,
      buyer: buyers[0].id, buyerName: buyers[0].name, buyerType: buyers[0].type,
      deliveryLocation: buyers[0].loc, deliveryState: buyers[0].state,
      items: [
        { product: productMap['Spinach'], productName: 'Spinach', farmerName: 'Harpreet Kaur', quantity: 20, price: 38, subtotal: 760 },
        { product: productMap['Brinjal'], productName: 'Brinjal', farmerName: 'Lakshmi Devi', quantity: 30, price: 32, subtotal: 960 },
      ],
      totalAmount: 1720, status: 'pending', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(2), createdAt: daysAgo(1),
    },
    // Order 7 - delivered
    {
      orderId: `ORD-${Date.now() - 1400000}`,
      buyer: buyers[1].id, buyerName: buyers[1].name, buyerType: buyers[1].type,
      deliveryLocation: buyers[1].loc, deliveryState: buyers[1].state,
      items: [
        { product: productMap['Soybean'], productName: 'Soybean', farmerName: 'Govind Patel', quantity: 400, price: 44, subtotal: 17600 },
        { product: productMap['Mustard Seeds'], productName: 'Mustard Seeds', farmerName: 'Sukhdev Singh', quantity: 200, price: 52, subtotal: 10400 },
      ],
      totalAmount: 28000, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(7), createdAt: daysAgo(20),
    },
    // Order 8 - delivered
    {
      orderId: `ORD-${Date.now() - 1300000}`,
      buyer: buyers[3].id, buyerName: buyers[3].name, buyerType: buyers[3].type,
      deliveryLocation: buyers[3].loc, deliveryState: buyers[3].state,
      items: [
        { product: productMap['Maize'], productName: 'Maize', farmerName: 'Ramesh Kumar', quantity: 1000, price: 19, subtotal: 19000 },
        { product: productMap['Groundnuts'], productName: 'Groundnuts', farmerName: 'Sunita Rathi', quantity: 200, price: 58, subtotal: 11600 },
      ],
      totalAmount: 30600, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(10), createdAt: daysAgo(25),
    },
    // Order 9 - ready_for_pickup
    {
      orderId: `ORD-${Date.now() - 1200000}`,
      buyer: buyers[2].id, buyerName: buyers[2].name, buyerType: buyers[2].type,
      deliveryLocation: buyers[2].loc, deliveryState: buyers[2].state,
      items: [
        { product: productMap['Red Apples'], productName: 'Red Apples', farmerName: 'Harpreet Kaur', quantity: 100, price: 95, subtotal: 9500 },
      ],
      totalAmount: 9500, status: 'ready_for_pickup', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(2), createdAt: daysAgo(4),
    },
    // Order 10 - in_transit (bulk)
    {
      orderId: `ORD-${Date.now() - 1100000}`,
      buyer: buyers[1].id, buyerName: buyers[1].name, buyerType: buyers[1].type,
      deliveryLocation: buyers[1].loc, deliveryState: buyers[1].state,
      items: [
        { product: productMap['Sugarcane'], productName: 'Sugarcane', farmerName: 'Mohan Lal Sharma', quantity: 2000, price: 4, subtotal: 8000 },
        { product: productMap['Onions'], productName: 'Onions', farmerName: 'Govind Patel', quantity: 500, price: 18, subtotal: 9000 },
      ],
      totalAmount: 17000, status: 'in_transit', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(1), createdAt: daysAgo(6),
    },
    // Order 11 - delivered
    {
      orderId: `ORD-${Date.now() - 1000000}`,
      buyer: buyers[4].id, buyerName: buyers[4].name, buyerType: buyers[4].type,
      deliveryLocation: buyers[4].loc, deliveryState: buyers[4].state,
      items: [
        { product: productMap['Jowar'], productName: 'Jowar', farmerName: 'Krishna Reddy', quantity: 300, price: 21, subtotal: 6300 },
        { product: productMap['Chana Dal'], productName: 'Chana Dal', farmerName: 'Sunita Rathi', quantity: 50, price: 85, subtotal: 4250 },
      ],
      totalAmount: 10550, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(4), createdAt: daysAgo(18),
    },
    // Order 12 - pending
    {
      orderId: `ORD-${Date.now() - 900000}`,
      buyer: buyers[0].id, buyerName: buyers[0].name, buyerType: buyers[0].type,
      deliveryLocation: buyers[0].loc, deliveryState: buyers[0].state,
      items: [
        { product: productMap['Tomatoes'], productName: 'Tomatoes', farmerName: 'Lakshmi Devi', quantity: 50, price: 22, subtotal: 1100 },
        { product: productMap['Potatoes'], productName: 'Potatoes', farmerName: 'Mohan Lal Sharma', quantity: 50, price: 14, subtotal: 700 },
        { product: productMap['Onions'], productName: 'Onions', farmerName: 'Govind Patel', quantity: 50, price: 18, subtotal: 900 },
      ],
      totalAmount: 2700, status: 'pending', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(3), createdAt: new Date(),
    },
    // Order 13 - confirmed
    {
      orderId: `ORD-${Date.now() - 800000}`,
      buyer: buyers[3].id, buyerName: buyers[3].name, buyerType: buyers[3].type,
      deliveryLocation: buyers[3].loc, deliveryState: buyers[3].state,
      items: [
        { product: productMap['Wheat'], productName: 'Wheat', farmerName: 'Ramesh Kumar', quantity: 500, price: 24, subtotal: 12000 },
        { product: productMap['Maize'], productName: 'Maize', farmerName: 'Ramesh Kumar', quantity: 500, price: 19, subtotal: 9500 },
      ],
      totalAmount: 21500, status: 'confirmed', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(4), createdAt: daysAgo(2),
    },
    // Order 14 - processing
    {
      orderId: `ORD-${Date.now() - 700000}`,
      buyer: buyers[2].id, buyerName: buyers[2].name, buyerType: buyers[2].type,
      deliveryLocation: buyers[2].loc, deliveryState: buyers[2].state,
      items: [
        { product: productMap['Moong Dal'], productName: 'Moong Dal', farmerName: 'Krishna Reddy', quantity: 75, price: 92, subtotal: 6900 },
        { product: productMap['Groundnuts'], productName: 'Groundnuts', farmerName: 'Sunita Rathi', quantity: 50, price: 58, subtotal: 2900 },
      ],
      totalAmount: 9800, status: 'processing', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(2), createdAt: daysAgo(3),
    },
    // Order 15 - delivered
    {
      orderId: `ORD-${Date.now() - 600000}`,
      buyer: buyers[1].id, buyerName: buyers[1].name, buyerType: buyers[1].type,
      deliveryLocation: buyers[1].loc, deliveryState: buyers[1].state,
      items: [
        { product: productMap['Basmati Rice'], productName: 'Basmati Rice', farmerName: 'Sukhdev Singh', quantity: 300, price: 65, subtotal: 19500 },
      ],
      totalAmount: 19500, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(8), createdAt: daysAgo(22),
    },
    // Order 16 - delivered (month ago)
    {
      orderId: `ORD-${Date.now() - 500000}`,
      buyer: buyers[4].id, buyerName: buyers[4].name, buyerType: buyers[4].type,
      deliveryLocation: buyers[4].loc, deliveryState: buyers[4].state,
      items: [
        { product: productMap['Tomatoes'], productName: 'Tomatoes', farmerName: 'Lakshmi Devi', quantity: 100, price: 22, subtotal: 2200 },
        { product: productMap['Brinjal'], productName: 'Brinjal', farmerName: 'Lakshmi Devi', quantity: 80, price: 32, subtotal: 2560 },
      ],
      totalAmount: 4760, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(30), createdAt: daysAgo(40),
    },
    // Order 17
    {
      orderId: `ORD-${Date.now() - 400000}`,
      buyer: buyers[0].id, buyerName: buyers[0].name, buyerType: buyers[0].type,
      deliveryLocation: buyers[0].loc, deliveryState: buyers[0].state,
      items: [
        { product: productMap['Red Apples'], productName: 'Red Apples', farmerName: 'Harpreet Kaur', quantity: 25, price: 95, subtotal: 2375 },
        { product: productMap['Spinach'], productName: 'Spinach', farmerName: 'Harpreet Kaur', quantity: 15, price: 38, subtotal: 570 },
      ],
      totalAmount: 2945, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(12), createdAt: daysAgo(28),
    },
    // Order 18
    {
      orderId: `ORD-${Date.now() - 300000}`,
      buyer: buyers[3].id, buyerName: buyers[3].name, buyerType: buyers[3].type,
      deliveryLocation: buyers[3].loc, deliveryState: buyers[3].state,
      items: [
        { product: productMap['Jowar'], productName: 'Jowar', farmerName: 'Krishna Reddy', quantity: 500, price: 21, subtotal: 10500 },
        { product: productMap['Mustard Seeds'], productName: 'Mustard Seeds', farmerName: 'Sukhdev Singh', quantity: 200, price: 52, subtotal: 10400 },
        { product: productMap['Soybean'], productName: 'Soybean', farmerName: 'Govind Patel', quantity: 200, price: 44, subtotal: 8800 },
      ],
      totalAmount: 29700, status: 'delivered', paymentStatus: 'paid',
      estimatedDelivery: daysAgo(15), createdAt: daysAgo(35),
    },
    // Order 19
    {
      orderId: `ORD-${Date.now() - 200000}`,
      buyer: buyers[2].id, buyerName: buyers[2].name, buyerType: buyers[2].type,
      deliveryLocation: buyers[2].loc, deliveryState: buyers[2].state,
      items: [
        { product: productMap['Cauliflower'], productName: 'Cauliflower', farmerName: 'Ramesh Kumar', quantity: 100, price: 28, subtotal: 2800 },
        { product: productMap['Green Peas'], productName: 'Green Peas', farmerName: 'Lakshmi Devi', quantity: 40, price: 45, subtotal: 1800 },
      ],
      totalAmount: 4600, status: 'in_transit', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(1), createdAt: daysAgo(4),
    },
    // Order 20
    {
      orderId: `ORD-${Date.now() - 100000}`,
      buyer: buyers[1].id, buyerName: buyers[1].name, buyerType: buyers[1].type,
      deliveryLocation: buyers[1].loc, deliveryState: buyers[1].state,
      items: [
        { product: productMap['Sugarcane'], productName: 'Sugarcane', farmerName: 'Mohan Lal Sharma', quantity: 1000, price: 4, subtotal: 4000 },
        { product: productMap['Groundnuts'], productName: 'Groundnuts', farmerName: 'Sunita Rathi', quantity: 150, price: 58, subtotal: 8700 },
      ],
      totalAmount: 12700, status: 'confirmed', paymentStatus: 'paid',
      estimatedDelivery: daysFromNow(5), createdAt: daysAgo(1),
    },
  ];

  return orders;
};

// ─── Generate historical sales data ─────────────────────────────────────────
const generateHistoricalSales = () => {
  const records = [];
  const combos = [
    { product: 'Tomato', location: 'Delhi', category: 'Vegetables', baseQty: 3750, basePrice: 22 },
    { product: 'Tomato', location: 'Mumbai', category: 'Vegetables', baseQty: 4500, basePrice: 24 },
    { product: 'Tomato', location: 'Bangalore', category: 'Vegetables', baseQty: 2800, basePrice: 25 },
    { product: 'Tomato', location: 'Hyderabad', category: 'Vegetables', baseQty: 3200, basePrice: 21 },
    { product: 'Wheat', location: 'Delhi', category: 'Cereals', baseQty: 6000, basePrice: 24 },
    { product: 'Wheat', location: 'Mumbai', category: 'Cereals', baseQty: 4500, basePrice: 26 },
    { product: 'Wheat', location: 'Bangalore', category: 'Cereals', baseQty: 2500, basePrice: 27 },
    { product: 'Wheat', location: 'Hyderabad', category: 'Cereals', baseQty: 3000, basePrice: 25 },
    { product: 'Rice', location: 'Delhi', category: 'Cereals', baseQty: 5000, basePrice: 45 },
    { product: 'Rice', location: 'Mumbai', category: 'Cereals', baseQty: 6000, basePrice: 48 },
    { product: 'Rice', location: 'Bangalore', category: 'Cereals', baseQty: 5500, basePrice: 46 },
    { product: 'Rice', location: 'Hyderabad', category: 'Cereals', baseQty: 6000, basePrice: 44 },
    { product: 'Potato', location: 'Delhi', category: 'Vegetables', baseQty: 5000, basePrice: 14 },
    { product: 'Potato', location: 'Mumbai', category: 'Vegetables', baseQty: 4000, basePrice: 16 },
    { product: 'Potato', location: 'Bangalore', category: 'Vegetables', baseQty: 3000, basePrice: 18 },
    { product: 'Potato', location: 'Hyderabad', category: 'Vegetables', baseQty: 3200, basePrice: 15 },
    { product: 'Onion', location: 'Delhi', category: 'Vegetables', baseQty: 7000, basePrice: 18 },
    { product: 'Onion', location: 'Mumbai', category: 'Vegetables', baseQty: 9000, basePrice: 20 },
    { product: 'Onion', location: 'Bangalore', category: 'Vegetables', baseQty: 5000, basePrice: 22 },
    { product: 'Onion', location: 'Hyderabad', category: 'Vegetables', baseQty: 5500, basePrice: 19 },
  ];

  const seasonalMultipliers = {
    Tomato: [1.15, 1.10, 0.95, 0.85, 0.75, 0.70, 0.72, 0.80, 0.90, 1.05, 1.20, 1.18],
    Wheat: [1.10, 1.05, 0.80, 0.60, 0.70, 0.85, 0.90, 0.95, 1.00, 1.05, 1.15, 1.12],
    Rice: [0.95, 0.90, 0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.10, 1.20, 1.00],
    Potato: [1.05, 1.00, 0.90, 0.85, 0.80, 0.75, 0.80, 0.85, 0.95, 1.10, 1.20, 1.15],
    Onion: [1.00, 0.95, 0.90, 0.85, 0.88, 0.92, 0.95, 1.00, 1.05, 1.10, 1.12, 1.05],
  };

  for (const combo of combos) {
    for (let i = 90; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const month = date.getMonth();
      const dayOfWeek = date.getDay();

      const seasonal = seasonalMultipliers[combo.product]?.[month] || 1.0;
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.88 : 1.0;
      const trendFactor = 1 + ((90 - i) / 90) * 0.08;
      const noise = 0.9 + Math.random() * 0.2;

      const qty = Math.round(combo.baseQty * seasonal * weekendFactor * trendFactor * noise);
      const price = parseFloat((combo.basePrice * (0.95 + Math.random() * 0.1)).toFixed(2));

      records.push({
        product: combo.product,
        location: combo.location,
        date,
        quantitySold: qty,
        price,
        category: combo.category,
      });
    }
  }
  return records;
};

// ─── Deliveries ──────────────────────────────────────────────────────────────
const makeDeliveries = (orderIds) => [
  {
    deliveryId: `DLV-${Date.now() - 5000}`,
    orderIds: orderIds.slice(0, 2),
    origin: 'Karnal', destination: 'Delhi', distance: 130,
    estimatedCost: 2340, optimizedCost: 1560, savings: 780,
    status: 'delivered', driver: 'Ramesh Yadav', vehicle: 'Medium Truck',
    departureTime: daysAgo(12), estimatedArrival: daysAgo(11),
  },
  {
    deliveryId: `DLV-${Date.now() - 4000}`,
    orderIds: orderIds.slice(2, 4),
    origin: 'Ludhiana', destination: 'Delhi', distance: 310,
    estimatedCost: 5580, optimizedCost: 3720, savings: 1860,
    status: 'delivered', driver: 'Harjit Singh', vehicle: 'Large Truck (12-Wheeler)',
    departureTime: daysAgo(8), estimatedArrival: daysAgo(7),
  },
  {
    deliveryId: `DLV-${Date.now() - 3000}`,
    orderIds: orderIds.slice(4, 6),
    origin: 'Nashik', destination: 'Mumbai', distance: 170,
    estimatedCost: 1530, optimizedCost: 1020, savings: 510,
    status: 'in_transit', driver: 'Suresh Patil', vehicle: 'Mini Truck (Tata Ace)',
    departureTime: daysAgo(1), estimatedArrival: daysFromNow(0),
  },
  {
    deliveryId: `DLV-${Date.now() - 2000}`,
    orderIds: orderIds.slice(6, 8),
    origin: 'Agra', destination: 'Delhi', distance: 200,
    estimatedCost: 3600, optimizedCost: 2400, savings: 1200,
    status: 'scheduled', driver: 'Dinesh Kumar', vehicle: 'Medium Truck',
    departureTime: daysFromNow(1), estimatedArrival: daysFromNow(2),
  },
  {
    deliveryId: `DLV-${Date.now() - 1000}`,
    orderIds: orderIds.slice(8, 10),
    origin: 'Kurnool', destination: 'Hyderabad', distance: 215,
    estimatedCost: 3870, optimizedCost: 2580, savings: 1290,
    status: 'scheduled', driver: 'Venkat Rao', vehicle: 'Medium Truck',
    departureTime: daysFromNow(2), estimatedArrival: daysFromNow(3),
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Clear collections ──────────────────────────────────────────────────
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      HistoricalSales.deleteMany({}),
      Delivery.deleteMany({}),
    ]);
    console.log('   Collections cleared.\n');

    // ── 2. Seed users ─────────────────────────────────────────────────────────
    console.log('👥 Seeding users...');
    const users = await User.insertMany(usersData);
    const userMap = {};
    users.forEach((u) => { userMap[u.name] = u._id; });
    console.log(`   ✅ ${users.length} users created.\n`);

    // ── 3. Seed products ──────────────────────────────────────────────────────
    console.log('📦 Seeding products...');
    const productsData = makeProducts(userMap);
    const products = await Product.insertMany(productsData);
    const productMap = {};
    products.forEach((p) => { productMap[p.name] = p._id; });
    console.log(`   ✅ ${products.length} products created.\n`);

    // ── 4. Seed orders ────────────────────────────────────────────────────────
    console.log('🛒 Seeding orders...');
    const ordersData = makeOrders(userMap, productMap);
    const orders = await Order.insertMany(ordersData);
    console.log(`   ✅ ${orders.length} orders created.\n`);

    // ── 5. Seed historical sales ──────────────────────────────────────────────
    console.log('📊 Seeding historical sales data (this may take a moment)...');
    const salesData = generateHistoricalSales();
    // Insert in batches to avoid memory issues
    const batchSize = 500;
    for (let i = 0; i < salesData.length; i += batchSize) {
      await HistoricalSales.insertMany(salesData.slice(i, i + batchSize));
    }
    console.log(`   ✅ ${salesData.length} historical sales records created.\n`);

    // ── 6. Seed deliveries ────────────────────────────────────────────────────
    console.log('🚚 Seeding deliveries...');
    const orderIdStrings = orders.map((o) => o.orderId);
    const deliveriesData = makeDeliveries(orderIdStrings);
    const deliveries = await Delivery.insertMany(deliveriesData);
    console.log(`   ✅ ${deliveries.length} deliveries created.\n`);

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════');
    console.log('🌱  AgriNexus Database Seeded Successfully!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`   👥  Users            : ${users.length}`);
    console.log(`   📦  Products         : ${products.length}`);
    console.log(`   🛒  Orders           : ${orders.length}`);
    console.log(`   📊  Historical Sales : ${salesData.length}`);
    console.log(`   🚚  Deliveries       : ${deliveries.length}`);
    console.log('═══════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed.');
    process.exit(0);
  }
};

seedDatabase();
