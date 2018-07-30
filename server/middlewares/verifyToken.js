const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(403).json({
      error: 'INVALID STATUS',
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      error: 'INVALID STATUS',
    });
  }
  jwt.verify(
    token,
    config.jwtSecret,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: 'INVALID STATUS',
        });
      }
      req.decoded = decoded;
      next();
    });
}

module.exports = verifyToken;