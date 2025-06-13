const { User } = require('../models');
const bcrypt = require('bcryptjs');

const createDemoUsers = async () => {
  try {
    console.log('🌱 Creating demo users...');

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@soma.edu',
        password: await bcrypt.hash('password123', 12),
        role: 'admin',
        isVerified: true,
        totalPoints: 1500,
        totalSubmissions: 50,
        acceptedSubmissions: 45
      },
      {
        name: 'Mentor User', 
        email: 'mentor@soma.edu',
        password: await bcrypt.hash('password123', 12),
        role: 'mentor',
        isVerified: true,
        totalPoints: 2000,
        totalSubmissions: 75,
        acceptedSubmissions: 68
      },
      {
        name: 'sofikul sk',
        email: 'student@soma.edu',
        password: await bcrypt.hash('password123', 12),
        role: 'student',
        isVerified: true,
        totalPoints: 850,
        totalSubmissions: 25,
        acceptedSubmissions: 20
      }
    ];

    for (const userData of demoUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
      
      if (created) {
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`ℹ️  ${userData.role} already exists: ${userData.email}`);
      }
    }

    console.log('🎉 Demo users ready!');
    return true;
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    return false;
  }
};

module.exports = { createDemoUsers };