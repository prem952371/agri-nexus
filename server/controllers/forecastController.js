const HistoricalSales = require('../models/HistoricalSales');

// ─── Seasonal multipliers for Indian agricultural products ───────────────────
// month index: 0=Jan, 11=Dec
const SEASONAL_MULTIPLIERS = {
  Tomato: [1.15, 1.10, 0.95, 0.85, 0.75, 0.70, 0.72, 0.80, 0.90, 1.05, 1.20, 1.18],
  Wheat: [1.10, 1.05, 0.80, 0.60, 0.70, 0.85, 0.90, 0.95, 1.00, 1.05, 1.15, 1.12],
  Rice: [0.95, 0.90, 0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.10, 1.20, 1.00],
  Potato: [1.05, 1.00, 0.90, 0.85, 0.80, 0.75, 0.80, 0.85, 0.95, 1.10, 1.20, 1.15],
  Onion: [1.00, 0.95, 0.90, 0.85, 0.88, 0.92, 0.95, 1.00, 1.05, 1.10, 1.12, 1.05],
};

// ─── Base demand by product (kg/day) ─────────────────────────────────────────
const BASE_DEMAND = {
  Tomato: { Delhi: 4000, Mumbai: 5000, Bangalore: 3000, Hyderabad: 3500, default: 2500 },
  Wheat: { Delhi: 6000, Mumbai: 4000, Bangalore: 2500, Hyderabad: 3000, default: 2000 },
  Rice: { Delhi: 5000, Mumbai: 6000, Bangalore: 5500, Hyderabad: 6000, default: 4000 },
  Potato: { Delhi: 5500, Mumbai: 4500, Bangalore: 3000, Hyderabad: 3200, default: 2000 },
  Onion: { Delhi: 7000, Mumbai: 9000, Bangalore: 5000, Hyderabad: 5500, default: 4000 },
};

// ─── Base prices by product (INR/kg) ─────────────────────────────────────────
const BASE_PRICES = {
  Tomato: 22, Wheat: 24, Rice: 45, Potato: 14, Onion: 18,
};

const getSeasonalMultiplier = (product, month) => {
  const name = Object.keys(SEASONAL_MULTIPLIERS).find((k) =>
    product.toLowerCase().includes(k.toLowerCase())
  );
  if (name) return SEASONAL_MULTIPLIERS[name][month];
  return 1.0;
};

const getBaseDemand = (product, location) => {
  const key = Object.keys(BASE_DEMAND).find((k) =>
    product.toLowerCase().includes(k.toLowerCase())
  );
  if (key) {
    const locKey = Object.keys(BASE_DEMAND[key]).find((l) =>
      location.toLowerCase().includes(l.toLowerCase())
    );
    return BASE_DEMAND[key][locKey || 'default'];
  }
  return 2000;
};

const getBasePrice = (product) => {
  const key = Object.keys(BASE_PRICES).find((k) =>
    product.toLowerCase().includes(k.toLowerCase())
  );
  return key ? BASE_PRICES[key] : 25;
};

// Generate synthetic historical data for 90 days
const generateSyntheticHistory = (product, location, days = 90) => {
  const records = [];
  const base = getBaseDemand(product, location);
  const price = getBasePrice(product);

  for (let i = days; i >= 1; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const month = date.getMonth();
    const dayOfWeek = date.getDay(); // 0=Sun

    const seasonal = getSeasonalMultiplier(product, month);
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.88 : 1.0;
    // Linear upward trend over 90 days
    const trendFactor = 1 + ((days - i) / days) * 0.08;
    // Random noise ±10%
    const noise = 0.9 + Math.random() * 0.2;

    const quantity = Math.round(base * seasonal * weekendFactor * trendFactor * noise);
    const dailyPrice = parseFloat((price * (0.95 + Math.random() * 0.1)).toFixed(2));

    records.push({ date, quantitySold: quantity, price: dailyPrice });
  }
  return records;
};

// Calculate 7-day moving average
const movingAverage = (data, windowSize = 7) => {
  const result = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1);
    const avg = window.reduce((sum, d) => sum + d.quantitySold, 0) / windowSize;
    result.push(avg);
  }
  return result;
};

// Detect trend from first-half vs second-half averages
const detectTrend = (data) => {
  if (data.length < 4) return { direction: 'stable', factor: 1.0 };
  const half = Math.floor(data.length / 2);
  const firstHalfAvg = data.slice(0, half).reduce((s, d) => s + d.quantitySold, 0) / half;
  const secondHalfAvg = data.slice(half).reduce((s, d) => s + d.quantitySold, 0) / (data.length - half);
  const changePct = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  if (changePct > 5) return { direction: 'increasing', factor: 1 + changePct / 200, changePct };
  if (changePct < -5) return { direction: 'decreasing', factor: 1 + changePct / 200, changePct };
  return { direction: 'stable', factor: 1.0, changePct };
};

// Build recommendation text
const buildRecommendation = (trend, avgForecast, product) => {
  if (trend.direction === 'increasing') {
    const increase = Math.abs(trend.changePct || 10);
    return `Demand for ${product} is trending up. Increase supply by ${Math.round(increase)}% to meet expected demand. Consider pre-booking logistics capacity.`;
  }
  if (trend.direction === 'decreasing') {
    const decrease = Math.abs(trend.changePct || 10);
    return `Demand for ${product} is trending down by ~${Math.round(decrease)}%. Consider exploring alternative markets or reducing supply to avoid wastage.`;
  }
  return `Demand for ${product} is stable. Maintain current supply levels at ~${Math.round(avgForecast)} kg/day.`;
};

// @desc  Get demand forecast
// @route GET /api/forecast
const getForecast = async (req, res, next) => {
  try {
    const { product = 'Tomato', location = 'Delhi', days = 7 } = req.query;
    const forecastDays = Math.min(Math.max(parseInt(days) || 7, 1), 30);

    // Fetch historical data from DB (last 90 days)
    const since = new Date();
    since.setDate(since.getDate() - 90);

    let historicalRecords = await HistoricalSales.find({
      product: { $regex: new RegExp(product, 'i') },
      location: { $regex: new RegExp(location, 'i') },
      date: { $gte: since },
    })
      .sort({ date: 1 })
      .lean();

    let usingSyntheticData = false;
    if (historicalRecords.length < 14) {
      // Fall back to synthetic
      historicalRecords = generateSyntheticHistory(product, location, 90);
      usingSyntheticData = true;
    }

    // Trend & moving average
    const trend = detectTrend(historicalRecords);
    const maValues = movingAverage(historicalRecords, 7);
    const baseValue = maValues.length > 0 ? maValues[maValues.length - 1] : getBaseDemand(product, location);

    // Generate forecast
    const forecastArr = [];
    const today = new Date();
    let confidenceBase = usingSyntheticData ? 72 : 85;

    for (let d = 1; d <= forecastDays; d++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(forecastDate.getDate() + d);
      const month = forecastDate.getMonth();
      const dayOfWeek = forecastDate.getDay();

      const seasonal = getSeasonalMultiplier(product, month);
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.88 : 1.0;
      const predictedDemand = Math.round(baseValue * trend.factor * seasonal * weekendFactor);

      forecastArr.push({
        date: forecastDate.toISOString().split('T')[0],
        predictedDemand,
        confidence: Math.max(confidenceBase - d * 1.5, 50),
      });
    }

    // Historical data for chart (last 14 days)
    const histForChart = historicalRecords.slice(-14).map((r) => ({
      date: new Date(r.date).toISOString().split('T')[0],
      actualDemand: r.quantitySold,
      price: r.price,
    }));

    const avgForecast = forecastArr.reduce((s, f) => s + f.predictedDemand, 0) / forecastArr.length;
    const recommendation = buildRecommendation(trend, avgForecast, product);

    res.json({
      success: true,
      data: {
        product,
        location,
        forecastDays,
        trend: trend.direction,
        trendChangePct: trend.changePct ? trend.changePct.toFixed(1) : 0,
        confidence: Math.round(confidenceBase),
        recommendation,
        usingSyntheticData,
        forecast: forecastArr,
        historicalData: histForChart,
        summary: {
          avgDailyDemand: Math.round(avgForecast),
          peakDay: forecastArr.reduce((max, f) => (f.predictedDemand > max.predictedDemand ? f : max), forecastArr[0]),
          totalForecast: Math.round(avgForecast * forecastDays),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getForecast };
