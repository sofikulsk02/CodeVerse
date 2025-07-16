const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function recreateAdmin() {
  try {
    // delete existing admin
    await User.destroy({ where: { email: 'admin@soma.edu' } });
    console.log('🗑️ Deleted existing admin user');

    // create new admin with properly hashed password
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('🔐 Hashed password:', hashedPassword);

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@soma.edu',
      password: hashedPassword,
      role: 'admin',
      department: 'Administration',
      isActive: true,
      isEmailVerified: true
    });

    console.log('✅ Admin user recreated successfully');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: password123');
    console.log('👑 Role:', admin.role);
    
    // test password comparison
    const testComparison = await bcrypt.compare('password123', admin.password);
    console.log('🧪 Test password comparison:', testComparison);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

recreateAdmin();