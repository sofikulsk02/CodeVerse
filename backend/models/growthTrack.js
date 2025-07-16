const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GrowthTrack = sequelize.define('GrowthTrack', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    weekStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'week_start'
    },
    weekEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'week_end'
    },
    totalSolved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_solved'
    },
    totalAttempted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_attempted'
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    },
    avgSubmissionTime: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'avg_submission_tim'
    },
    problemsByDifficulty: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'problems_by_difficul'
    },
    contestParticipation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'contest_participatio'
    },
    contestRankAvg: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'contest_rank_avg'
    },
    streakDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'streak_days'
    },
    pointsEarned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'points_earned'
    }
  }, {
    tableName: 'growth_tracks',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return GrowthTrack;
};