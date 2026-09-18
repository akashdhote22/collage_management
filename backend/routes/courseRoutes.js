const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursecontroller");

const router = express.Router();

// Only Admin can manage courses

// CREATE COURSE
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCourse
);

// GET ALL COURSES
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getCourses
);

// GET SINGLE COURSE
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getCourseById
);

// UPDATE COURSE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCourse
);

// DELETE COURSE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourse
);

module.exports = router;