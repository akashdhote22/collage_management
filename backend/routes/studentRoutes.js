const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses,
  getStudentDashboard,
  getStudentProfile,
} = require("../controllers/studentController");

const router = express.Router();

// Only Admin can manage students
router.post("/", protect, authorizeRoles("admin"), createStudent);

router.get("/", protect, authorizeRoles("admin"), getStudents);

router.get(
  "/courses",
  protect,
  authorizeRoles("student"),
  getStudentCourses
);

// GET LOGGED-IN STUDENT DASHBOARD
router.get(
  "/dashboard",
  protect,
  authorizeRoles("student"),
  getStudentDashboard
);
// ADMIN and TEACHER can view students
router.get(
  "/attendance-list",
  protect,
  authorizeRoles("admin", "teacher"),
  getStudents
);

// GET LOGGED-IN STUDENT PROFILE
router.get(
  "/profile",
  protect,
  authorizeRoles("student"),
  getStudentProfile
);

router.get("/:id", protect, authorizeRoles("admin"), getStudentById);

router.put("/:id", protect, authorizeRoles("admin"), updateStudent);

router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);


module.exports = router;