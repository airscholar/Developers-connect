const express = require('express');

const router = express.Router();

// all routes will be fine tuned along the line

// @route   GET api/users
// @desc    Test Users API route
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'User route',
  });
});

module.exports = router;
