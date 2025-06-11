const express = require('express');
const {
  getUserStats,
  getUserProfile,
  updateProfile,
  getLeaderboard
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', authenticateToken, getLeaderboard);
router.get('/stats/:id?', authenticateToken, getUserStats);
router.get('/profile/:id', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;