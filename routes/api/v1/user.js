const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../../../models/User');
const router = express.Router();
const gravatar = require('gravatar');

// all routes will be fine tuned along the line

// @route   POST api/v1/users
// @desc    Test Users API route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, password, email } = req.body;

    try {
      //check if user exists
      const user = User.findOne({ email });

      if (user) {
        res.status(400).json({
          errors: [
            {
              msg: 'User already exists',
            },
          ],
        });
      }

      //get user gravatar

      //encryptpassword

      //return token

      res.status(200).json({
        message: 'User route',
      });
    } catch (error) {}
  }
);

module.exports = router;
