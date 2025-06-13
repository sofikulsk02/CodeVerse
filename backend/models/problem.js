const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Problem = sequelize.define('Problem', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200), // character varying(200)
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: true // YES
    },
    testCases: {
      type: DataTypes.JSON,
      allowNull: true, // YES
      field: 'test_cases'
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false, // NO
      defaultValue: 'medium'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // ARRAY, not JSON!
      allowNull: true // YES
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false, // NO
      defaultValue: 2000,
      field: 'time_limit'
    },
    memoryLimit: {
      type: DataTypes.INTEGER,
      allowNull: false, // NO
      defaultValue: 256,
      field: 'memory_limit'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false, // NO
      defaultValue: 100
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false, // NO
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'created_by'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // NO
      defaultValue: true,
      field: 'is_active'
    },
    allowedLanguages: {
      type: DataTypes.ARRAY(DataTypes.STRING), // ARRAY, not JSON!
      allowNull: false, // NO
      defaultValue: ['javascript', 'python', 'java', 'cpp'],
      field: 'allowed_languages'
    },
    slug: {
      type: DataTypes.STRING(250), // character varying(250)
      allowNull: false // NO
    },
    category: {
      type: DataTypes.STRING(50), // character varying(50)
      allowNull: false // NO
    },
    examples: {
      type: DataTypes.JSON,
      allowNull: true, // YES
      defaultValue: []
    },
    hints: {
      type: DataTypes.JSON,
      allowNull: true, // YES
      defaultValue: []
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true // YES
    },
    solutionApproach: {
      type: DataTypes.TEXT,
      allowNull: true, // YES
      field: 'solution_approach'
    }
  }, {
    tableName: 'problems',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Problem;
};