const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      console.log("❌ Malformed token received:", token);
      return res.status(401).json({ message: "Invalid token" });
    }

    //jwT valodation
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.log(
        "❌ Malformed token received:",
        token.substring(0, 20) + "..."
      );
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.name + ":", error.message);

    // provide specific error messages for different jwt error
    let message = "Invalid or expired token";
    if (error.name === "JsonWebTokenError") {
      message = "Invalid token format";
    } else if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

const requireInstructor = (req, res, next) => {
  if (!["admin", "instructor"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Instructor or admin access required",
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireInstructor,
};
