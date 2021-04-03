const express = require('express');
const router = express.Router();

// all routes will be fine tuned along the line

// @route   GET api/v1/profile
// @desc    get profile route
// @access  Public
router.get('/', (req, res) => {
  console.log(req.body);
  res.status(200).json({
    message: 'Profile route',
  });
});

module.exports = router;
