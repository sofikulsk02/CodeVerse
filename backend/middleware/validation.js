const { body, param, query } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/),
  body('role').optional().isIn(['student', 'admin']),
  body('batch').optional().isString(),
  body('year').optional().isInt({ min: 2020, max: 2030 }),
  body('department').optional().isString(),
  body('registration_number').optional().isString()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const validateProblem = [
  body('title').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('description').notEmpty().trim(),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('points').optional().isInt({ min: 1 }),
  body('time_limit').optional().isInt({ min: 1, max: 10 }),
  body('memory_limit').optional().isInt({ min: 64, max: 1024 }),
  body('test_cases').isArray({ min: 1 })
];

const validateContest = [
  body('name').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('start_time').isISO8601(),
  body('end_time').isISO8601(),
  body('duration').isInt({ min: 30 })
];

const validateSubmission = [
  body('problem_id').isUUID(),
  body('code').notEmpty().trim(),
  body('language').isIn(['javascript', 'python', 'java', 'cpp'])
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProblem,
  validateContest,
  validateSubmission
};