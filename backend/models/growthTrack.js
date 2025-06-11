module.exports = (sequelize, DataTypes) => {
  const GrowthTrack = sequelize.define('GrowthTrack', {
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
    week_start: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    week_end: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_solved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    total_attempted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    accuracy: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    avg_submission_time: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true,
      validate: {
        min: 0
      }
    },
    problems_by_difficulty: {
      type: DataTypes.JSONB,
      defaultValue: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      allowNull: false
    },
    contest_participations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    contest_rank_avg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 1
      }
    },
    streak_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    points_earned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'growth_tracks',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'week_start']
      },
      {
        fields: ['week_start']
      },
      {
        fields: ['user_id']
      }
    ]
  });

  // Class methods
  GrowthTrack.getWeekBounds = function(date = new Date()) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
      start: startOfWeek.toISOString().split('T')[0], // YYYY-MM-DD format
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // Get or create growth track for a specific week
  GrowthTrack.getOrCreateWeeklyTrack = async function(userId, date = new Date()) {
    const { start, end } = this.getWeekBounds(date);
    
    let track = await this.findOne({
      where: {
        user_id: userId,
        week_start: start
      }
    });
    
    if (!track) {
      track = await this.create({
        user_id: userId,
        week_start: start,
        week_end: end
      });
    }
    
    return track;
  };

  // Get weekly progress for a user
  GrowthTrack.getWeeklyProgress = async function(userId, weekCount = 12) {
    const tracks = await this.findAll({
      where: {
        user_id: userId
      },
      order: [['week_start', 'DESC']],
      limit: weekCount
    });
    
    return tracks.reverse(); // Return in chronological order
  };

  // Get user's overall stats
  GrowthTrack.getUserStats = async function(userId) {
    const tracks = await this.findAll({
      where: {
        user_id: userId
      }
    });

    if (tracks.length === 0) {
      return {
        totalSolved: 0,
        totalAttempted: 0,
        overallAccuracy: 0,
        totalContestParticipations: 0,
        totalPointsEarned: 0,
        currentStreak: 0,
        bestWeekSolved: 0,
        problemsByDifficulty: { easy: 0, medium: 0, hard: 0 }
      };
    }

    const totalSolved = tracks.reduce((sum, track) => sum + track.total_solved, 0);
    const totalAttempted = tracks.reduce((sum, track) => sum + track.total_attempted, 0);
    const totalContestParticipations = tracks.reduce((sum, track) => sum + track.contest_participations, 0);
    const totalPointsEarned = tracks.reduce((sum, track) => sum + track.points_earned, 0);
    const bestWeekSolved = Math.max(...tracks.map(track => track.total_solved));
    const currentStreak = tracks[tracks.length - 1]?.streak_days || 0;

    // Aggregate problems by difficulty
    const problemsByDifficulty = tracks.reduce((acc, track) => {
      acc.easy += track.problems_by_difficulty.easy || 0;
      acc.medium += track.problems_by_difficulty.medium || 0;
      acc.hard += track.problems_by_difficulty.hard || 0;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    return {
      totalSolved,
      totalAttempted,
      overallAccuracy: totalAttempted > 0 ? ((totalSolved / totalAttempted) * 100).toFixed(2) : 0,
      totalContestParticipations,
      totalPointsEarned,
      currentStreak,
      bestWeekSolved,
      problemsByDifficulty
    };
  };

  // Instance methods
  GrowthTrack.prototype.updateAccuracy = function() {
    if (this.total_attempted > 0) {
      this.accuracy = ((this.total_solved / this.total_attempted) * 100).toFixed(2);
    } else {
      this.accuracy = 0.00;
    }
  };

  // Update contest rank average
  GrowthTrack.prototype.updateContestRankAverage = function(newRank) {
    if (this.contest_participations === 0) {
      this.contest_rank_avg = newRank;
    } else {
      const currentTotal = this.contest_rank_avg * this.contest_participations;
      this.contest_rank_avg = ((currentTotal + newRank) / (this.contest_participations + 1)).toFixed(2);
    }
    this.contest_participations += 1;
  };

  // Add points to the weekly track
  GrowthTrack.prototype.addPoints = function(points) {
    this.points_earned += points;
  };

  // Update problem difficulty count
  GrowthTrack.prototype.addProblemByDifficulty = function(difficulty) {
    if (this.problems_by_difficulty[difficulty] !== undefined) {
      this.problems_by_difficulty[difficulty] += 1;
      this.changed('problems_by_difficulty', true); // Mark as changed for JSONB
    }
  };

  // Update submission metrics
  GrowthTrack.prototype.updateSubmissionMetrics = function(isAccepted, submissionTime) {
    this.total_attempted += 1;
    
    if (isAccepted) {
      this.total_solved += 1;
    }
    
    // Update average submission time
    if (submissionTime && submissionTime > 0) {
      if (this.avg_submission_time) {
        this.avg_submission_time = Math.round((this.avg_submission_time + submissionTime) / 2);
      } else {
        this.avg_submission_time = submissionTime;
      }
    }
    
    this.updateAccuracy();
  };

  return GrowthTrack;
};