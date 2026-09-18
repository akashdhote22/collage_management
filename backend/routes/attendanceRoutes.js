const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createAttendance,
  createTeacherAttendance,
  getAttendances,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
} = require("../controllers/attendancecontroller");

const router = express.Router();

// ADMIN and TEACHER can manage attendance

// CREATE ATTENDANCE
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  createAttendance
);

// GET ALL ATTENDANCE
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  getAttendances
);

// GET ATTENDANCE BY STUDENT
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "teacher"),
  getAttendanceByStudent
);

// UPDATE ATTENDANCE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  updateAttendance
);

// DELETE ATTENDANCE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  deleteAttendance
);
// Create attendance by teacher
router.post(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  createTeacherAttendance
);
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAttendance
);

module.exports = router;