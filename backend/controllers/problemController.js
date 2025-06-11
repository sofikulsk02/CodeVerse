const { Problem, User, Submission } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, tags, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = tags.split(',');
      whereClause.tags = { [Op.overlap]: tagArray };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: problems } = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      problems,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      where: { id, is_active: true },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (req.user.role !== 'admin') {
      const problemData = problem.toJSON();
      delete problemData.test_cases;
      return res.json({ problem: problemData });
    }

    res.json({ problem });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createProblem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const problemData = {
      ...req.body,
      created_by: req.user.id
    };

    const problem = await Problem.create(problemData);

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const problem = await Problem.findByPk(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await problem.update(req.body);

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findByPk(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await problem.update({ is_active: false });

    res.json({
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
};