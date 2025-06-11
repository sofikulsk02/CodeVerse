const express = require('express');
const {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  getContestLeaderboard
} = require('../controllers/contestController');
const { validateContest } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAllContests);
router.get('/:id', authenticateToken, getContestById);
router.get('/:id/leaderboard', authenticateToken, getContestLeaderboard);
router.post('/', authenticateToken, requireAdmin, validateContest, createContest);
router.put('/:id', authenticateToken, requireAdmin, validateContest, updateContest);
router.delete('/:id', authenticateToken, requireAdmin, deleteContest);

module.exports = router;