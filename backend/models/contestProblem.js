module.exports = (sequelize, DataTypes) => {
  const ContestProblem = sequelize.define('ContestProblem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contests',
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
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true, // If null, use problem's default points
      validate: {
        min: 1
      }
    },
    partial_scoring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_bonus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'contest_problems',
    indexes: [
      {
        unique: true,
        fields: ['contest_id', 'problem_id']
      },
      {
        fields: ['contest_id', 'order_index']
      }
    ]
  });

  return ContestProblem;
};