const express = require('express');

const router = express.Router();

// all routes will be fine tuned along the line

// @route   GET api/auth
// @desc    Test posts API route
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Posts route',
  });
});

module.exports = router;
