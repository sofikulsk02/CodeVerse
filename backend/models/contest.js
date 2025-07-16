const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contest = sequelize.define('Contest', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time'
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
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_participants'
    },
    registrationRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'registration_required'
    },
    registrationStart: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'registration_start'
    },
    registrationEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'registration_end'
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prizeDistribution: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'prize_distribution'
    },
    allowedBatches: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)), 
      allowNull: true,
      field: 'allowed_batches'
    },
    allowedYears: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), 
      allowNull: true,
      field: 'allowed_years'
    },
    allowedDepartments: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)), 
      allowNull: true,
      field: 'allowed_departments'
    },
    contestType: {
      type: DataTypes.ENUM('practice', 'official', 'mock'),
      allowNull: false,
      defaultValue: 'official',
      field: 'contest_type'
    }
  }, {
    tableName: 'contests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Contest;
};