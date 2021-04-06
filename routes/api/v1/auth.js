const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const User = require('../../../models/User');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
// all routes will be fine tuned along the line

// @route   GET api/auth
// @desc    Test Auth API route
// @access  Public
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});

// @route   POST api/v1/auth
// @desc    Authenticate Users and Get Token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { password, email } = req.body;

    try {
      //check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({
          errors: [
            {
              msg: 'Invalid credentials',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          errors: [
            {
              msg: 'Invalid credentials',
            },
          ],
        });
      }
      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.status(200).json({
            message: 'User authenticated',
            token,
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server error',
        token,
      });
    }
  }
);

module.exports = router;
