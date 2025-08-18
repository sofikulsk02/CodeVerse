const express = require("express");
const router = express.Router();
const { Problem, User } = require("../models");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validationResult, body } = require("express-validator");
const {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

// validation middleware
const validateProblem = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be easy, medium, or hard"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category is required"),
  body("timeLimit")
    .optional()
    .isInt({ min: 100, max: 10000 })
    .withMessage("Time limit must be between 100 and 10000 ms"),
  body("memoryLimit")
    .optional()
    .isInt({ min: 16, max: 512 })
    .withMessage("Memory limit must be between 16 and 512 MB"),
];

// routesc
router.get("/", getProblems);
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateProblem,
  createProblem
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateProblem,
  updateProblem
);
router.delete("/:id", authenticateToken, requireAdmin, deleteProblem);

module.exports = router;
