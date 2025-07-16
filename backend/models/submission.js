const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Submission = sequelize.define('Submission', {
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
    problemId: {
      type: DataTypes.UUID,
      allowNull: false, 
      references: {
        model: 'problems',
        key: 'id'
      },
      field: 'problem_id'
    },
    contestId: {
      type: DataTypes.UUID,
      allowNull: true, 
      references: {
        model: 'contests',
        key: 'id'
      },
      field: 'contest_id'
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    executionTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'execution_time'
    },
    memoryUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'memory_used'
    },
    testCasesPassed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'test_cases_passed'
    },
    totalTestCases: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'total_test_cases'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message'
    },
    compilerOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'compiler_output'
    },
    testCaseResults: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'test_case_results'
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at'
    },
    judgedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'judged_at'
    }
  }, {
    tableName: 'submissions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Submission;
};