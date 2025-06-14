const { User } = require('./models');

async function fixDemoUsers() {
  try {
    console.log('🔄 Fixing demo users with correct roles...');
    
    const demoUsers = [
      { email: 'admin@soma.edu', name: 'Admin User', role: 'admin' },
      { email: 'instructor@soma.edu', name: 'Instructor User', role: 'instructor' }, // Changed from mentor to instructor
      { email: 'student@soma.edu', name: 'Student User', role: 'student' }
    ];

    for (const userData of demoUsers) {
      await User.destroy({ where: { email: userData.email } });
      console.log(`🗑️ Deleted existing user: ${userData.email}`);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: 'password123',
        role: userData.role,
        isActive: true,
        isEmailVerified: true
      });

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      
      const testValidation = await user.validatePassword('password123');
      console.log(`🧪 Password validation test for ${userData.email}:`, testValidation);
    }
    
    console.log('🎉 All demo users fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing demo users:', error);
  } finally {
    process.exit();
  }
}

fixDemoUsers();