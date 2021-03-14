const express = require('express');

const router = express.Router();

// all routes will be fine tuned along the line

// @route   GET api/auth
// @desc    Test Auth API route
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Auth route',
  });
});

module.exports = router;
