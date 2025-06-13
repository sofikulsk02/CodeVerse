const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {  // Fixed: use isActive instead of is_active
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user inactive' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

const requireMentor = (req, res, next) => {
  if (!['admin', 'mentor'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Mentor or admin access required' 
    });
  }
  next();
};

module.exports = { 
  authenticateToken, 
  requireAdmin, 
  requireMentor 
};