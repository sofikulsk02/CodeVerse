const { User } = require('./models');

async function fixAdmin() {
  try {
    console.log('🔄 Starting admin user fix...');
    
    // Delete existing admin
    await User.destroy({ where: { email: 'admin@soma.edu' } });
    console.log('🗑️ Deleted existing admin user');

    // Create admin with plain password (beforeCreate hook will hash it automatically)
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@soma.edu',
      password: 'password123', // Plain password - will be hashed by beforeCreate hook
      role: 'admin',
      department: 'Administration',
      isActive: true,
      isEmailVerified: true
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: password123');
    console.log('👑 Role:', admin.role);
    
    // Test password validation using the model method
    const testValidation = await admin.validatePassword('password123');
    console.log('🧪 Password validation test:', testValidation);
    
    if (testValidation) {
      console.log('🎉 SUCCESS! Admin login should work now!');
    } else {
      console.log('❌ Password validation failed. Check User model hooks.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

fixAdmin();