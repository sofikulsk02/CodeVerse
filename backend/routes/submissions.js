const express = require('express');
const {
  submitSolution,
  getUserSubmissions,
  getSubmissionById,
  getAllSubmissions
} = require('../controllers/submissionController');
const { validateSubmission } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, validateSubmission, submitSolution);
router.get('/my', authenticateToken, getUserSubmissions);
router.get('/all', authenticateToken, requireAdmin, getAllSubmissions);
router.get('/:id', authenticateToken, getSubmissionById);

module.exports = router;