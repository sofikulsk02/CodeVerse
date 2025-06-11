module.exports = (sequelize, DataTypes) => {
  const Contest = sequelize.define('Contest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString()
      }
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isEndTimeValid() {
          if (this.end_time <= this.start_time) {
            throw new Error('End time must be after start time');
          }
        }
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
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    registration_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    registration_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registration_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prize_distribution: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    allowed_batches: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    allowed_years: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: []
    },
    allowed_departments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    contest_type: {
      type: DataTypes.ENUM('practice', 'official', 'mock'),
      defaultValue: 'official',
      allowNull: false
    }
  }, {
    tableName: 'contests',
    indexes: [
      {
        fields: ['start_time']
      },
      {
        fields: ['end_time']
      },
      {
        fields: ['created_by']
      },
      {
        fields: ['contest_type']
      }
    ]
  });

  // Instance methods
  Contest.prototype.getStatus = function() {
    const now = new Date();
    if (now < this.start_time) {
      return 'upcoming';
    } else if (now >= this.start_time && now <= this.end_time) {
      return 'ongoing';
    } else {
      return 'ended';
    }
  };

  Contest.prototype.getDuration = function() {
    return Math.floor((this.end_time - this.start_time) / (1000 * 60)); // in minutes
  };

  return Contest;
};