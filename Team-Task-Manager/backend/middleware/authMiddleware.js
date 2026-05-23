const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (global.isDemoMode) {
        const mockUser = global.mockUsers.find(u => u._id === decoded.id);
        if (!mockUser) {
          return res.status(401).json({ message: 'User not found in system' });
        }
        req.user = mockUser;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token authorization failed' });
    }
  }
  return res.status(401).json({ message: 'No authorization token supplied' });
};

module.exports = { protect };
