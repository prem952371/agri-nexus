const express = require('express');
const router = express.Router();
const { optimizeRoutes, getDeliveries } = require('../controllers/routeController');

router.post('/optimize', optimizeRoutes);
router.get('/deliveries', getDeliveries);

module.exports = router;
