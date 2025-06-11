const { Submission, Problem, User, Contest, GrowthTrack } = require('../models');
const { validationResult } = require('express-validator');
const { executeCode } = require('../utils/codeExecutor');

const submitSolution = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { problem_id, code, language, contest_id } = req.body;

    // Check if problem exists
    const problem = await Problem.findByPk(problem_id);
    if (!problem || !problem.is_active) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // If contest submission, check contest validity
    if (contest_id) {
      const contest = await Contest.findByPk(contest_id);
      if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
      }

      const now = new Date();
      if (now < contest.start_time || now > contest.end_time) {
        return res.status(400).json({ message: 'Contest is not active' });
      }
    }

    // Create submission
    const submission = await Submission.create({
      user_id: req.user.id,
      problem_id,
      contest_id,
      code,
      language,
      status: 'pending'
    });

    // Execute code against test cases
    try {
      const result = await executeCode(code, language, problem.test_cases);
      
      await submission.update({
        status: result.status,
        execution_time: result.executionTime,
        memory_used: result.memoryUsed,
        error_message: result.error
      });

      // Update growth track if accepted
      if (result.status === 'accepted') {
        const growthTrack = await GrowthTrack.getOrCreateWeeklyTrack(req.user.id);
        growthTrack.updateSubmissionMetrics(true, result.executionTime);
        growthTrack.addProblemByDifficulty(problem.difficulty);
        growthTrack.addPoints(problem.points);
        await growthTrack.save();
      } else {
        const growthTrack = await GrowthTrack.getOrCreateWeeklyTrack(req.user.id);
        growthTrack.updateSubmissionMetrics(false, result.executionTime);
        await growthTrack.save();
      }

      res.status(201).json({
        message: 'Submission created successfully',
        submission: {
          id: submission.id,
          status: submission.status,
          execution_time: submission.execution_time,
          memory_used: submission.memory_used,
          error_message: submission.error_message
        }
      });
    } catch (executionError) {
      await submission.update({
        status: 'runtime_error',
        error_message: executionError.message
      });

      res.status(201).json({
        message: 'Submission created successfully',
        submission: {
          id: submission.id,
          status: 'runtime_error',
          error_message: executionError.message
        }
      });
    }
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, problem_id, contest_id, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: req.user.id };

    if (problem_id) whereClause.problem_id = problem_id;
    if (contest_id) whereClause.contest_id = contest_id;
    if (status) whereClause.status = status;

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Problem,
          attributes: ['id', 'title', 'difficulty', 'points']
        },
        {
          model: Contest,
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.json({
      submissions,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findOne({
      where: { 
        id,
        user_id: req.user.id
      },
      include: [
        {
          model: Problem,
          attributes: ['id', 'title', 'difficulty', 'points']
        },
        {
          model: Contest,
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, user_id, problem_id, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (user_id) whereClause.user_id = user_id;
    if (problem_id) whereClause.problem_id = problem_id;
    if (status) whereClause.status = status;

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Problem,
          attributes: ['id', 'title', 'difficulty']
        },
        {
          model: Contest,
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.json({
      submissions,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitSolution,
  getUserSubmissions,
  getSubmissionById,
  getAllSubmissions
};