const jwt = require('jsonwebtoken');
const config = require('config');

const authenticate = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    return res.status(401).json({
      msg: 'Invalid token, Authorization denied!',
    });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Invalid token, Authorization denied!',
    });
  }
};

module.exports = { authenticate };
