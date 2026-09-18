const Student = require("../models/Student");
const User = require("../models/user");
const Course = require("../models/course");
const Timetable = require("../models/timetable");

// CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const { userId, rollNumber, branch, semester, phone } = req.body;

    if (!userId || !rollNumber || !branch || !semester) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(400).json({
        message: "Selected user is not a student",
      });
    }

    const existingStudent = await Student.findOne({ userId });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student profile already exists",
      });
    }

    const student = await Student.create({
      userId,
      rollNumber,
      branch,
      semester,
      phone,
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL STUDENTS
const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email role");

    res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE STUDENT
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
  userId: req.user.userId,
}).populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { rollNumber, branch, semester, phone } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { rollNumber, branch, semester, phone },
      { new: true, runValidators: true }
    ).populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT DASHBOARD

const getStudentDashboard = async (req, res) => {
  try {
    // Logged-in student ka profile find karo
    const student = await Student.findOne({
  userId: req.user.userId,
}).populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      message: "Student dashboard fetched successfully",
      student: {
        id: student._id,
        name: student.userId?.name,
        email: student.userId?.email,
        role: student.userId?.role,
        rollNumber: student.rollNumber,
        branch: student.branch,
        semester: student.semester,
        phone: student.phone,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT PROFILE
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user.userId,
    }).populate("userId", "name email");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      student,
    });
  } catch (error) {
    console.error("Get student profile error:", error);

    res.status(500).json({
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT COURSES
const getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findOne({
  userId: req.user.userId,
});

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Student ke branch aur semester ke according timetable find karna
    const timetableRecords = await Timetable.find({
      semester: student.semester,
      branch: student.branch,
    }).populate("courseId");

    // Duplicate courses remove karna
    const courseMap = new Map();

    timetableRecords.forEach((record) => {
      if (record.courseId) {
        courseMap.set(
          record.courseId._id.toString(),
          record.courseId
        );
      }
    });

    const courses = Array.from(courseMap.values());

    res.status(200).json({
      message: "Student courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Student courses error:", error);

    res.status(500).json({
      message: "Failed to fetch student courses",
      error: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentDashboard,
  getStudentCourses,
  getStudentProfile,
};