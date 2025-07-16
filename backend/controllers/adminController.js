const { User, Problem, Contest, Submission, Batch, Resource, Announcement, Message, AuditLog } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

class AdminController {
  // dashboard Analytics  (shuru 1)
  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const newUsersThisWeek = await User.count({
        where: { createdAt: { [Op.gte]: lastWeek } }
      });

      // submission Statistics
      const totalSubmissions = await Submission.count();
      const submissionsToday = await Submission.count({
        where: { 
          createdAt: { 
            [Op.gte]: new Date(today.setHours(0, 0, 0, 0)) 
          } 
        }
      });
      const submissionsThisWeek = await Submission.count({
        where: { createdAt: { [Op.gte]: lastWeek } }
      });

      // problemss Statistics
      const totalProblems = await Problem.count({ where: { isActive: true } });
      const pendingProblems = await Problem.count({ 
        where: { approvalStatus: 'pending' } 
      });

      // contest statistics
      const activeContests = await Contest.count({
        where: {
          startTime: { [Op.lte]: today },
          endTime: { [Op.gte]: today },
          isActive: true
        }
      });
      const upcomingContests = await Contest.count({
        where: {
          startTime: { [Op.gt]: today },
          isActive: true
        }
      });

      // recent activity
      const recentSubmissions = await Submission.findAll({
        include: [
          { model: User, attributes: ['name'] },
          { model: Problem, attributes: ['title'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            activeUsers,
            newUsersThisWeek,
            totalSubmissions,
            submissionsToday,
            submissionsThisWeek,
            totalProblems,
            pendingProblems,
            activeContests,
            upcomingContests
          },
          recentSubmissions
        }
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  }

  // user management
  async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        role,
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

  
      if (role) whereClause.role = role;
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset,
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, password, role, ...userData } = req.body;

      // check if user already
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // hash password 
      const hashedPassword = await bcrypt.hash(password, 12);

      // create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        ...userData
      });

      // log action
      await this.logAction(req.user.id, 'CREATE_USER', 'user', user.id, {
        createdUser: { name, email, role }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user: { ...user.toJSON(), password: undefined } }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      
      const oldValues = { ...user.dataValues };

    
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      await user.update(updateData);

      // log ACtions
      await this.logAction(req.user.id, 'UPDATE_USER', 'user', user.id, {
        oldValues,
        newValues: updateData
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: { ...user.toJSON(), password: undefined } }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Soft delete - deactivate instead of actual deletion
      await user.update({ isActive: false }); 

      // Log action
      await this.logAction(req.user.id, 'DELETE_USER', 'user', user.id, {
        deletedUser: { name: user.name, email: user.email }
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }

  async resetUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await user.update({ password: hashedPassword });

      // Log action
      await this.logAction(req.user.id, 'RESET_PASSWORD', 'user', user.id, {
        targetUser: user.email
      });

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }

  // batch Management (sab batches)
  async createBatch(req, res) {
    try {
      const batchData = req.body;
      const batch = await Batch.create(batchData);

      await this.logAction(req.user.id, 'CREATE_BATCH', 'batch', batch.id, {
        batchData
      });

      res.status(201).json({
        success: true,
        message: 'Batch created successfully',
        data: { batch }
      });
    } catch (error) {
      console.error('Create batch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create batch'
      });
    }
  }

  async getAllBatches(req, res) {
    try {
      const batches = await Batch.findAll({
        include: [
          {
            model: User,
            as: 'mentor',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.json({
        success: true,
        data: { batches }
      });
    } catch (error) {
      console.error('Get batches error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch batches'
      });
    }
  }

  // resource management
  async createResource(req, res) {
    try {
      const resourceData = {
        ...req.body,
        uploadedBy: req.user.id
      };

      const resource = await Resource.create(resourceData);

      await this.logAction(req.user.id, 'CREATE_RESOURCE', 'resource', resource.id, {
        resourceData
      });

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: { resource }
      });
    } catch (error) {
      console.error('Create resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create resource'
      });
    }
  }

  // analytics and reports
  async getUserAnalytics(req, res) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      // user-specific analytics
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Submission,
            where: startDate && endDate ? {
              createdAt: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
              }
            } : {},
            required: false
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // calculate analytics
      const analytics = await this.calculateUserAnalytics(user, startDate, endDate);

      res.json({
        success: true,
        data: { user, analytics }
      });
    } catch (error) {
      console.error('User analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user analytics'
      });
    }
  }

  async generateReport(req, res) {
    try {
      const { type, format, startDate, endDate, filters } = req.body;

      let reportData;
      switch (type) {
        case 'user-progress':
          reportData = await this.generateUserProgressReport(startDate, endDate, filters);
          break;
        case 'submission-analytics':
          reportData = await this.generateSubmissionReport(startDate, endDate, filters);
          break;
        case 'contest-performance':
          reportData = await this.generateContestReport(startDate, endDate, filters);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid report type'
          });
      }

      if (format === 'csv') {
        // generate CSV
        const csv = await this.generateCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
        return res.send(csv);
      }

      res.json({
        success: true,
        data: reportData
      });
    } catch (error) {
      console.error('Generate report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate report'
      });
    }
  }

  // ommunication management
  async createAnnouncement(req, res) {
    try {
      const announcementData = {
        ...req.body,
        createdBy: req.user.id
      };

      const announcement = await Announcement.create(announcementData);

      await this.logAction(req.user.id, 'CREATE_ANNOUNCEMENT', 'announcement', announcement.id, {
        announcementData
      });

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: { announcement }
      });
    } catch (error) {
      console.error('Create announcement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create announcement'
      });
    }
  }

  async sendPersonalMessage(req, res) {
    try {
      const { receiverId, subject, content, type, isImportant } = req.body;

      const message = await Message.create({
        senderId: req.user.id,
        receiverId,
        subject,
        content,
        type: type || 'personal',
        isImportant: isImportant || false
      });

      await this.logAction(req.user.id, 'SEND_MESSAGE', 'message', message.id, {
        receiverId,
        subject
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: { message }
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  // system Settingse
  async getSystemSettings(req, res) {
    try {
      const settings = {
        platform: {
          name: 'CampusCode',
          allowRegistration: true,
          requireEmailVerification: false
        },
        judge: {
          timeout: 5000,
          memoryLimit: 256,
          supportedLanguages: ['javascript', 'python', 'java', 'cpp']
        },
        features: {
          allowStudentSubmissions: true,
          showLeaderboard: true,
          enableContests: true
        }
      };

      res.json({
        success: true,
        data: { settings }
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch settings'
      });
    }
  }

  // audit logs
  async getAuditLogs(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        action,
        entityType,
        performedBy,
        startDate,
        endDate
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (action) whereClause.action = action;
      if (entityType) whereClause.entityType = entityType;
      if (performedBy) whereClause.performedBy = performedBy;
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const { count, rows: logs } = await AuditLog.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'performer',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs'
      });
    }
  }

  // helper methods
  async logAction(userId, action, entityType, entityId, details) {
    try {
      await AuditLog.create({
        performedBy: userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress: this.getClientIP(),
        userAgent: this.getUserAgent()
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }

  async calculateUserAnalytics(user, startDate, endDate) {
    // implementation for detailed user analytic calculations
    return {
      totalSubmissions: user.Submissions?.length || 0,
      successRate: 0,
      averageTime: 0,
      preferredLanguages: []
    };
  }

  async generateUserProgressReport(startDate, endDate, filters) {
    return [];
  }

  async generateSubmissionReport(startDate, endDate, filters) {
    return [];
  }

  async generateContestReport(startDate, endDate, filters) {
    return [];
  }

  async generateCSV(data) {
    return 'CSV data here';
  }

  getClientIP() {
    return '127.0.0.1';
  }

  getUserAgent() {
    return 'Admin Panel';
  }
}

module.exports = new AdminController();