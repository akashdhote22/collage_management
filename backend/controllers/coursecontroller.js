const Course = require("../models/course");

// CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      department,
      semester,
      credits,
      description,
    } = req.body;

    // Check required fields
    if (
      !courseCode ||
      !courseName ||
      !department ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({
        message:
          "Please provide courseCode, courseName, department, semester and credits",
      });
    }

    // Check duplicate course code
    const existingCourse = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exists",
      });
    }

    // Create course
    const course = await Course.create({
      courseCode,
      courseName,
      department,
      semester,
      credits,
      description,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL COURSES
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      semester: 1,
      courseCode: 1,
    });

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE COURSE
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      department,
      semester,
      credits,
      description,
    } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        courseCode,
        courseName,
        department,
        semester,
        credits,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};