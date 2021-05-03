const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
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

// @route   GET api/v1/profile
// @desc    get profile route
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.status(200).json({
      result: profiles,
    });
  } catch (err) {
    res.status(500).json({
      result: 'Server error',
    });
  }
});

// @route   GET api/v1/profile/user/:user_id
// @desc    get profile by user id route
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      result: profile,
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Profile not found',
      });
    }
    res.status(500).json({
      result: 'Server error',
    });
  }
});

// @route   POST api/v1/profile
// @desc    Create or update user profile route
// @access  Private
router.post(
  '/',
  [
    authenticate,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map(skill => skill.trim());

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    // const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //  update
        await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, useFindAndModify: false }
        );

        return res.status(200).json({
          result: profile,
        });
      }

      profile = await new Profile(profileFields).save();
      res.status(200).json({
        result: profile,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

// @route   DELETE api/v1/profile
// @desc    DELETE profile, user & posts
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    /// TODO - remove users posts
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.status(200).json({
      result: 'User deleted',
    });
  } catch (err) {
    res.status(500).json({
      result: 'Server error',
    });
  }
});

// @route   PUT api/v1/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    authenticate,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.user);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);

      if (profile.experience) {
        profile.experience.unshift(newExp);
      } else {
        profile.experience = newExp;
      }

      await profile.save();

      res.status(200).json({ result: profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
