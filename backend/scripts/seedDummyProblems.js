const { Problem, User, sequelize } = require("../models");

async function seedDummyProblems() {
  try {
    await sequelize.authenticate();

    // Find an admin user to assign as creator
    const admin = await User.findOne({ where: { role: "admin" } });
    if (!admin) throw new Error("No admin user found!");

    const problems = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        category: "Array",
        tags: ["array", "hash-table"],
        timeLimit: 2000,
        memoryLimit: 256,
        points: 100,
        createdBy: admin.id,
        isActive: true,
        slug: "two-sum",
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        ],
        testCases: [{ input: "[2,7,11,15]\n9", output: "[0,1]" }],
      },
      {
        title: "Reverse Linked List",
        description: "Reverse a singly linked list.",
        difficulty: "Medium",
        category: "Linked List",
        tags: ["linked-list"],
        timeLimit: 2000,
        memoryLimit: 256,
        points: 200,
        createdBy: admin.id,
        isActive: true,
        slug: "reverse-linked-list",
        examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
        testCases: [{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }],
      },
    ];

    for (const p of problems) {
      await Problem.findOrCreate({ where: { slug: p.slug }, defaults: p });
    }

    console.log("✅ Dummy problems seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding dummy problems:", err);
    process.exit(1);
  }
}

seedDummyProblems();
