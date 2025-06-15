'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('problems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'easy'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      timeLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1000
      },
      memoryLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 128
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft'
      },
      examples: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      testCases: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('problems');
  }
};