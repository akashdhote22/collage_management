const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createResult,
  getResults,
  getResultsByStudent,
  getResultById,
  updateResult,
  deleteResult,
} = require("../controllers/resultcontroller");

const router = express.Router();

// ADMIN and TEACHER can manage results

// CREATE RESULT
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  createResult
);

// GET ALL RESULTS
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  getResults
);

// GET RESULTS BY STUDENT
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "teacher"),
  getResultsByStudent
);

// GET SINGLE RESULT
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  getResultById
);

// UPDATE RESULT
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  updateResult
);

// DELETE RESULT
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  deleteResult
);

module.exports = router;