const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createTimetable,
  getTimetables,
  getTimetableByClass,
  getTimetableById,
  getTeacherTimetable,
  getStudentTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetablecontroller");

const router = express.Router();

// ==========================================
// ADMIN CAN MANAGE TIMETABLE
// TEACHER/STUDENT CAN VIEW TIMETABLE
// ==========================================

// Create timetable - Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTimetable
);

// Get all timetables - Admin, Teacher, Student
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getTimetables
);

// Get timetable by class - Admin, Teacher, Student
router.get(
  "/class",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getTimetableByClass
);

// Get logged-in teacher timetable - Teacher only
// Static route must be before /:id
router.get(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  getTeacherTimetable
);

// Get logged-in student timetable - Student only
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentTimetable
);

// Get single timetable - Admin, Teacher, Student
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getTimetableById
);

// Update timetable - Admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTimetable
);

// Delete timetable - Admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTimetable
);

module.exports = router;