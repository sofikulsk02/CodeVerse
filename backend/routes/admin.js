const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getUserSubmissions,
  getSystemAnalytics
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/users/:id/submissions', authenticateToken, requireAdmin, getUserSubmissions);
router.put('/users/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.get('/analytics', authenticateToken, requireAdmin, getSystemAnalytics);

module.exports = router;