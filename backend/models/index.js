const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Problem = require('./Problem')(sequelize, Sequelize.DataTypes);
const Contest = require('./Contest')(sequelize, Sequelize.DataTypes);
const ContestProblem = require('./ContestProblem')(sequelize, Sequelize.DataTypes);
const Submission = require('./Submission')(sequelize, Sequelize.DataTypes);
const GrowthTrack = require('./GrowthTrack')(sequelize, Sequelize.DataTypes);

// Define associations
const db = {
  User,
  Problem,
  Contest,
  ContestProblem,
  Submission,
  GrowthTrack,
  sequelize,
  Sequelize
};

// User associations
User.hasMany(Submission, { foreignKey: 'user_id', as: 'submissions' });
User.hasMany(GrowthTrack, { foreignKey: 'user_id', as: 'growthTracks' });
User.hasMany(Problem, { foreignKey: 'created_by', as: 'createdProblems' });
User.hasMany(Contest, { foreignKey: 'created_by', as: 'createdContests' });

// Problem associations
Problem.hasMany(Submission, { foreignKey: 'problem_id', as: 'submissions' });
Problem.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Problem.belongsToMany(Contest, { 
  through: ContestProblem, 
  foreignKey: 'problem_id',
  otherKey: 'contest_id',
  as: 'contests'
});

// Contest associations
Contest.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Contest.belongsToMany(Problem, { 
  through: ContestProblem, 
  foreignKey: 'contest_id',
  otherKey: 'problem_id',
  as: 'problems'
});
Contest.hasMany(Submission, { foreignKey: 'contest_id', as: 'submissions' });

// Submission associations
Submission.belongsTo(User, { foreignKey: 'user_id' });
Submission.belongsTo(Problem, { foreignKey: 'problem_id' });
Submission.belongsTo(Contest, { foreignKey: 'contest_id', required: false });

// GrowthTrack associations
GrowthTrack.belongsTo(User, { foreignKey: 'user_id' });

module.exports = db;