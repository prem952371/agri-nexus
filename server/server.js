require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrinexus';

const start = () => {
  app.listen(PORT, () => {
    console.log(`🚀  AgriNexus API running on http://localhost:${PORT}`);
    console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
  });

  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  }).then(() => {
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
  }).catch((err) => {
    console.error('❌  MongoDB connection failed; API started in demo mode:', err.message);
  });
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

start();
