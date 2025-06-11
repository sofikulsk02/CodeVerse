const express = require('express');
const {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');
const { validateProblem } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAllProblems);
router.get('/:id', authenticateToken, getProblemById);
router.post('/', authenticateToken, requireAdmin, validateProblem, createProblem);
router.put('/:id', authenticateToken, requireAdmin, validateProblem, updateProblem);
router.delete('/:id', authenticateToken, requireAdmin, deleteProblem);

module.exports = router;