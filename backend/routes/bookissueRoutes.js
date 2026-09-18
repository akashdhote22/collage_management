const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  issueBook,
  getBookIssues,
  getBookIssuesByStudent,
  returnBook,
} = require("../controllers/bookissuecontroller");

const router = express.Router();

// ISSUE BOOK - Only Admin
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  issueBook
);

// GET ALL BOOK ISSUE RECORDS - Admin, Teacher, Student
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getBookIssues
);

// GET BOOK ISSUES BY STUDENT
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getBookIssuesByStudent
);

// RETURN BOOK - Only Admin
router.put(
  "/return/:id",
  protect,
  authorizeRoles("admin"),
  returnBook
);

module.exports = router;