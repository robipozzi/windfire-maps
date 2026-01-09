// Import necessary modules
const express = require('express');
const placeRoutes = require('./place.routes');

// Create a new router instance
const router = express.Router();

// ===== Mount place routes ===== //
router.use('/places', placeRoutes);

// ===== Health check endpoint ===== //
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;