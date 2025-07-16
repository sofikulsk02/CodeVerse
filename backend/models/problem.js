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
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: true 
    },
    testCases: {
      type: DataTypes.JSON,
      allowNull: true, 
      field: 'test_cases'
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false, 
      defaultValue: 'medium'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      allowNull: true 
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 2000,
      field: 'time_limit'
    },
    memoryLimit: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 256,
      field: 'memory_limit'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false, 
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'created_by'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: true,
      field: 'is_active'
    },
    allowedLanguages: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      allowNull: false, 
      defaultValue: ['javascript', 'python', 'java', 'cpp'],
      field: 'allowed_languages'
    },
    slug: {
      type: DataTypes.STRING(250), 
      allowNull: false 
    },
    category: {
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    examples: {
      type: DataTypes.JSON,
      allowNull: true, 
      defaultValue: []
    },
    hints: {
      type: DataTypes.JSON,
      allowNull: true, 
      defaultValue: []
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true 
    },
    solutionApproach: {
      type: DataTypes.TEXT,
      allowNull: true, 
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