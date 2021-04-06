const express = require('express');
const router = express.Router();
const { authenticate } = require('../../../middleware/auth.middleware');
const Profile = require('../../../models/Profile');

// all routes will be fine tuned along the line

// @route   GET api/v1/profile/me
// @desc    get profile route
// @access  Public
router.get('/me', authenticate, async (req, res) => {
  const profile = await Profile.findOne({ email: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    return res.status(400).json({
      message: 'No profile for this user',
      result: profile,
    });
  }

  res.status(200).json({
    result: profile,
  });
});

module.exports = router;
