module.exports = (sequelize, DataTypes) => {
  const Problem = sequelize.define('Problem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    input_format: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    output_format: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sample_cases: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidSampleCases(value) {
          if (!Array.isArray(value)) {
            throw new Error('Sample cases must be an array');
          }
          value.forEach(testCase => {
            if (!testCase.input || !testCase.output) {
              throw new Error('Each sample case must have input and output');
            }
          });
        }
      }
    },
    test_cases: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidTestCases(value) {
          if (!Array.isArray(value)) {
            throw new Error('Test cases must be an array');
          }
          if (value.length === 0) {
            throw new Error('At least one test case is required');
          }
          value.forEach(testCase => {
            if (!testCase.input || !testCase.output) {
              throw new Error('Each test case must have input and output');
            }
          });
        }
      }
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'easy',
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true
    },
    time_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 2000, // in milliseconds
      allowNull: false,
      validate: {
        min: 100,
        max: 10000
      }
    },
    memory_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 256, // in MB
      allowNull: false,
      validate: {
        min: 64,
        max: 1024
      }
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
      validate: {
        min: 10,
        max: 1000
      }
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowed_languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['javascript', 'python', 'java', 'cpp'],
      allowNull: false
    }
  }, {
    tableName: 'problems',
    indexes: [
      {
        fields: ['difficulty']
      },
      {
        fields: ['tags'],
        using: 'gin'
      },
      {
        fields: ['created_by']
      }
    ]
  });

  return Problem;
};