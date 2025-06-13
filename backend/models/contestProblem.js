const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContestProblem = sequelize.define('ContestProblem', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    contestId: {
      type: DataTypes.UUID,
      allowNull: false, // NOT NULL
      references: {
        model: 'contests',
        key: 'id'
      },
      field: 'contest_id'
    },
    problemId: {
      type: DataTypes.UUID,
      allowNull: false, // NOT NULL
      references: {
        model: 'problems',
        key: 'id'
      },
      field: 'problem_id'
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'order_index'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    partialScoring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'partial_scoring'
    },
    isBonus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_bonus'
    }
  }, {
    tableName: 'contest_problems',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ContestProblem;
};