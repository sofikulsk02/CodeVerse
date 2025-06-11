const { User, Problem, Contest, Submission, GrowthTrack, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.count({ where: { role: 'student' } });
    const totalProblems = await Problem.count({ where: { is_active: true } });
    const totalContests = await Contest.count();
    const totalSubmissions = await Submission.count();

    // Get recent activity
    const recentSubmissions = await Submission.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: Problem,
          attributes: ['id', 'title']
        }
      ]
    });

    // Get submission statistics
    const submissionStats = await Submission.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get popular problems
    const popularProblems = await Problem.findAll({
      attributes: [
        'id',
        'title',
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('submissions.id')), 'submission_count']
      ],
      include: [
        {
          model: Submission,
          as: 'submissions',
          attributes: []
        }
      ],
      group: ['Problem.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('submissions.id')), 'DESC']],
      limit: 5
    });

    res.json({
      totalUsers,
      totalProblems,
      totalContests,
      totalSubmissions,
      recentSubmissions,
      submissionStats,
      popularProblems
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, batch, department } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { role: 'student' };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { registration_number: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (batch) whereClause.batch = batch;
    if (department) whereClause.department = department;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'batch', 'year', 'department', 'registration_number', 'is_active', 'createdAt', 'last_login']
    });

    res.json({
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    await user.update({ is_active: !user.is_active });

    res.json({
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: { user_id: id },
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
      user: user.toSafeObject(),
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

const getSystemAnalytics = async (req, res) => {
  try {
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily submission counts
    const dailySubmissions = await Submission.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Success rate over time
    const successRate = await Submission.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [
        sequelize.fn('DATE', sequelize.col('createdAt')),
        'status'
      ],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Problem difficulty distribution
    const difficultyStats = await Problem.findAll({
      where: { is_active: true },
      attributes: [
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['difficulty']
    });

    res.json({
      dailySubmissions,
      successRate,
      difficultyStats
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getUserSubmissions,
  getSystemAnalytics
};