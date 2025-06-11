const { User, GrowthTrack, Submission, Problem } = require('../models');
const { Op } = require('sequelize');

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    // Get overall stats from GrowthTrack
    const stats = await GrowthTrack.getUserStats(userId);

    // Get recent submissions
    const recentSubmissions = await Submission.findAll({
      where: { user_id: userId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Problem,
          attributes: ['id', 'title', 'difficulty']
        }
      ]
    });

    // Get weekly progress
    const weeklyProgress = await GrowthTrack.getWeeklyProgress(userId, 12);

    res.json({
      stats,
      recentSubmissions,
      weeklyProgress
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'batch', 'year', 'department', 'registration_number', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, batch, year, department } = req.body;

    await req.user.update({
      name,
      batch,
      year,
      department
    });

    res.json({
      message: 'Profile updated successfully',
      user: req.user.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'all', limit = 10 } = req.query;

    let whereClause = {};
    if (timeframe === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      whereClause.createdAt = { [Op.gte]: oneWeekAgo };
    } else if (timeframe === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      whereClause.createdAt = { [Op.gte]: oneMonthAgo };
    }

    const users = await User.findAll({
      where: { role: 'student', is_active: true },
      attributes: ['id', 'name', 'batch', 'department'],
      include: [
        {
          model: Submission,
          as: 'submissions',
          where: {
            status: 'accepted',
            ...whereClause
          },
          required: false,
          include: [
            {
              model: Problem,
              attributes: ['points']
            }
          ]
        }
      ],
      limit: parseInt(limit)
    });

    const leaderboard = users.map(user => {
      const totalPoints = user.submissions.reduce((sum, submission) => {
        return sum + (submission.Problem?.points || 0);
      }, 0);

      return {
        user: {
          id: user.id,
          name: user.name,
          batch: user.batch,
          department: user.department
        },
        totalPoints,
        solvedProblems: user.submissions.length
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserStats,
  getUserProfile,
  updateProfile,
  getLeaderboard
};