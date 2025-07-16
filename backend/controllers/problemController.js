const { Problem, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllProblems = async (req, res) => {
  try {
    console.log('📚 Getting all problems...');
    const { page = 1, limit = 50, difficulty, category, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true }; 
    
    if (difficulty) whereClause.difficulty = difficulty;
    if (category) whereClause.category = category;
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
      order: [['created_at', 'DESC']], 
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    console.log(`✅ Found ${count} problems`);

    const transformedProblems = problems.map(problem => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags || [],
      status: 'published',
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      examples: problem.examples || [],
      testCases: problem.testCases || [],
      author: problem.creator?.name || 'Unknown',
      createdAt: problem.created_at, 
      acceptanceRate: 0,
      submissions: 0
    }));

    res.json({
      success: true,
      data: {
        problems: transformedProblems,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Get problems error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const createProblem = async (req, res) => {
  try {
    console.log('🔨 Creating new problem...');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const {
      title,
      description,
      difficulty,
      category,
      tags,
      timeLimit,
      memoryLimit,
      examples,
      testCases
    } = req.body;

    console.log('📝 Problem data:', { title, difficulty, category });
    console.log('👤 User creating:', req.user);

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const problem = await Problem.create({
      title,
      description,
      difficulty: difficulty || 'easy',
      category: category || 'array',
      tags: Array.isArray(tags) ? tags : [],
      timeLimit: timeLimit || 2000,
      memoryLimit: memoryLimit || 256,
      examples: examples || [],
      testCases: testCases || [],
      createdBy: req.user.id,
      slug,
      points: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300,
      isActive: true
    });

    console.log('✅ Problem created with ID:', problem.id);

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: { problem }
    });
  } catch (error) {
    console.error('❌ Create problem error:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
};

const updateProblem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      category,
      tags,
      timeLimit,
      memoryLimit,
      examples,
      testCases
    } = req.body;

    console.log('🔨 Updating problem:', id);

    const problem = await Problem.findOne({
      where: { id, is_active: true } 
    });

    if (!problem) {
      return res.status(404).json({ 
        success: false,
        message: 'Problem not found' 
      });
    }

    if (problem.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this problem' 
      });
    }

    const slug = title ? title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') : problem.slug;

    await problem.update({
      title,
      description,
      difficulty,
      category,
      tags: Array.isArray(tags) ? tags : [],
      timeLimit,
      memoryLimit,
      examples,
      testCases,
      slug,
      points: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300
    });

    console.log('✅ Problem updated:', problem.id);

    res.json({
      success: true,
      message: 'Problem updated successfully',
      data: { problem }
    });
  } catch (error) {
    console.error('❌ Update problem error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update problem',
      error: error.message
    });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      where: { id, is_active: true } 
    });

    if (!problem) {
      return res.status(404).json({ 
        success: false,
        message: 'Problem not found' 
      });
    }

    if (problem.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this problem' 
      });
    }

    // Soft delete
    await problem.update({ isActive: false });

    console.log('✅ Problem deleted:', problem.id);

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete problem error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete problem' 
    });
  }
};

module.exports = {
  getAllProblems,
  createProblem,
  updateProblem,
  deleteProblem
};