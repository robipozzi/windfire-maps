const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;