const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('personal', 'feedback', 'warning', 'congratulations'),
      defaultValue: 'personal'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isImportant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {
        attachments: [],
        relatedTo: null,
        context: null
      }
    }
  }, {
    tableName: 'messages',
    timestamps: true
  });

  return Message;
};