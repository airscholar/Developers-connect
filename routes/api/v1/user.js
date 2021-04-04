const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
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
      let user = await User.findOne({ email });

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
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encryptpassword
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
            message: 'User registered',
            token,
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
