module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    problem_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'problems',
        key: 'id'
      }
    },
    contest_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contests',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    language: {
      type: DataTypes.ENUM('javascript', 'python', 'java', 'cpp', 'c'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 'running', 'accepted', 'wrong_answer', 
        'time_limit_exceeded', 'memory_limit_exceeded', 
        'runtime_error', 'compile_error', 'presentation_error'
      ),
      defaultValue: 'pending',
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    execution_time: {
      type: DataTypes.INTEGER, // in milliseconds
      allowNull: true,
      validate: {
        min: 0
      }
    },
    memory_used: {
      type: DataTypes.INTEGER, // in KB
      allowNull: true,
      validate: {
        min: 0
      }
    },
    test_cases_passed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    total_test_cases: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    compiler_output: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_case_results: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    judged_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'submissions',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['problem_id']
      },
      {
        fields: ['contest_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['submitted_at']
      },
      {
        fields: ['user_id', 'problem_id']
      }
    ]
  });

  // Instance methods
  Submission.prototype.getAccuracy = function() {
    if (this.total_test_cases === 0) return 0;
    return Math.round((this.test_cases_passed / this.total_test_cases) * 100);
  };

  Submission.prototype.isAccepted = function() {
    return this.status === 'accepted';
  };

  return Submission;
};