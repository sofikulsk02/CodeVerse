const { User } = require("../models");

const createDemoUsers = async () => {
  try {
    console.log("🌱 Creating demo users...");

    const demoUsers = [
      {
        name: "Admin User",
        email: "admin@soma.edu",
        password: "password123", // ← Plain password - will be hashed by beforeCreate hook
        role: "admin",
        isEmailVerified: true,
        totalPoints: 1500,
        totalSubmissions: 50,
        acceptedSubmissions: 45,
      },
      {
        name: "Mentor User",
        email: "mentor@soma.edu",
        password: "password123", // ← Plain password - will be hashed by beforeCreate hook
        role: "mentor",
        isEmailVerified: true,
        totalPoints: 2000,
        totalSubmissions: 75,
        acceptedSubmissions: 68,
      },
      {
        name: "sofikul sk",
        email: "student@soma.edu",
        password: "password123", // ← Plain password - will be hashed by beforeCreate hook
        role: "student",
        isEmailVerified: true,
        totalPoints: 750,
        totalSubmissions: 25,
        acceptedSubmissions: 18,
      },
    ];

    for (const userData of demoUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });

      if (created) {
        console.log(
          `✅ Created demo user: ${userData.email} (${userData.role})`
        );
      } else {
        console.log(`ℹ️ Demo user already exists: ${userData.email}`);
      }
    }

    console.log("🎉 Demo users setup complete!");
  } catch (error) {
    console.error("❌ Error creating demo users:", error);
  }
};

module.exports = createDemoUsers;
