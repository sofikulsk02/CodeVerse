const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  createBatch,
  getAllBatches,
  createResource,
  getUserAnalytics,
  generateReport,
  createAnnouncement,
  sendPersonalMessage,
  getSystemSettings,
  getAuditLogs
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard Analytics
router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);

// User Management
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);
router.post('/users/:id/reset-password', authenticateToken, requireAdmin, resetUserPassword);

// Batch Management
router.get('/batches', authenticateToken, requireAdmin, getAllBatches);
router.post('/batches', authenticateToken, requireAdmin, createBatch);

// Resource Management
router.post('/resources', authenticateToken, requireAdmin, createResource);

// Analytics and Reports
router.get('/analytics/users/:userId', authenticateToken, requireAdmin, getUserAnalytics);
router.post('/reports/generate', authenticateToken, requireAdmin, generateReport);

// Communication Management
router.post('/announcements', authenticateToken, requireAdmin, createAnnouncement);
router.post('/messages', authenticateToken, requireAdmin, sendPersonalMessage);

// System Settings
router.get('/settings', authenticateToken, requireAdmin, getSystemSettings);

// Audit Logs
router.get('/audit-logs', authenticateToken, requireAdmin, getAuditLogs);

module.exports = router;