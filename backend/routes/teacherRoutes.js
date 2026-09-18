const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  teacherDashboard,
  getTeacherCourses,
} = require("../controllers/teachercontroller");

const router = express.Router();

// Admin: Create teacher
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTeacher
);

// Admin: Get all teachers
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getTeachers
);

// Teacher: Dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("teacher"),
  teacherDashboard
);

// Teacher: Assigned courses
router.get(
  "/courses",
  protect,
  authorizeRoles("teacher"),
  getTeacherCourses
);

// Admin: Get single teacher
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getTeacherById
);

// Admin: Update teacher
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTeacher
);

// Admin: Delete teacher
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTeacher
);

module.exports = router;