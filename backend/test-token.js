require("dotenv").config();
const jwt = require("jsonwebtoken");

const testUser = {
  userId: 1,
  email: "admin@soma.edu",
  role: "admin",
};

const token = jwt.sign(testUser, process.env.JWT_SECRET || "your-secret-key", {
  expiresIn: "24h",
});
console.log("Generated token:", token);
console.log("Token parts:", token.split(".").length);

try {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key"
  );
  console.log("Decoded token:", decoded);
} catch (error) {
  console.error("Token verification failed:", error);
}
