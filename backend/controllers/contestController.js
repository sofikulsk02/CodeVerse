const { Contest, Problem, ContestProblem, User, Submission } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllContests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const now = new Date();

    let whereClause = {};

    if (status === 'upcoming') {
      whereClause.start_time = { [Op.gt]: now };
    } else if (status === 'ongoing') {
      whereClause[Op.and] = [
        { start_time: { [Op.lte]: now } },
        { end_time: { [Op.gte]: now } }
      ];
    } else if (status === 'finished') {
      whereClause.end_time = { [Op.lt]: now };
    }

    const { count, rows: contests } = await Contest.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['start_time', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        },
        {
          model: Problem,
          as: 'problems',
          through: { attributes: [] },
          attributes: ['id', 'title', 'difficulty', 'points']
        }
      ]
    });

    res.json({
      contests,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get contests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getContestById = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        },
        {
          model: Problem,
          as: 'problems',
          through: { attributes: [] },
          attributes: ['id', 'title', 'difficulty', 'points', 'description']
        }
      ]
    });

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json({ contest });
  } catch (error) {
    console.error('Get contest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createContest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { problem_ids, ...contestData } = req.body;

    const contest = await Contest.create({
      ...contestData,
      created_by: req.user.id
    });

    // Add problems to contest
    if (problem_ids && problem_ids.length > 0) {
      const contestProblems = problem_ids.map(problemId => ({
        contest_id: contest.id,
        problem_id: problemId
      }));
      await ContestProblem.bulkCreate(contestProblems);
    }

    res.status(201).json({
      message: 'Contest created successfully',
      contest
    });
  } catch (error) {
    console.error('Create contest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    const { problem_ids, ...updateData } = req.body;

    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    await contest.update(updateData);

    // Update Contest problems if provided
    if (problem_ids) {
      await ContestProblem.destroy({ where: { contest_id: id } });
      if (problem_ids.length > 0) {
        const contestProblems = problem_ids.map(problemId => ({
          contest_id: id,
          problem_id: problemId
        }));
        await ContestProblem.bulkCreate(contestProblems);
      }
    }

    res.json({
      message: 'Contest updated successfully',
      contest
    });
  } catch (error) {
    console.error('Update contest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteContest = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    await ContestProblem.destroy({ where: { contest_id: id } });
    await contest.destroy();

    res.json({
      message: 'Contest deleted successfully'
    });
  } catch (error) {
    console.error('Delete contest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getContestLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const leaderboard = await Submission.findAll({
      where: {
        contest_id: id,
        status: 'accepted'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'batch', 'department']
        },
        {
          model: Problem,
          attributes: ['id', 'title', 'points']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Calculate scores
    const userScores = {};
    leaderboard.forEach(submission => {
      const userId = submission.User.id;
      if (!userScores[userId]) {
        userScores[userId] = {
          user: submission.User,
          totalScore: 0,
          solvedProblems: 0,
          lastSubmission: submission.createdAt
        };
      }
      userScores[userId].totalScore += submission.Problem.points;
      userScores[userId].solvedProblems += 1;
      userScores[userId].lastSubmission = submission.createdAt;
    });

    const sortedLeaderboard = Object.values(userScores)
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) {
          return b.totalScore - a.totalScore;
        }
        return new Date(a.lastSubmission) - new Date(b.lastSubmission);
      })
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

    res.json({
      contest: {
        id: contest.id,
        name: contest.name
      },
      leaderboard: sortedLeaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  getContestLeaderboard
};