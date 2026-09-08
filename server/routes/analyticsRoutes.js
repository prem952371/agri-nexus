const express = require('express');
const router = express.Router();
const { getOverview, getImpact } = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/impact', getImpact);

module.exports = router;
