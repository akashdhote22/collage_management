const User = require("../models/user");
const Course = require("../models/course");
const Attendance = require("../models/attendance");

const adminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalTeachers = await User.countDocuments({
      role: "teacher",
    });

    const totalUsers = await User.countDocuments();

    const totalCourses = await Course.countDocuments();

    const totalAttendance = await Attendance.countDocuments();

    res.status(200).json({
      message: "Admin dashboard data fetched successfully",

      user: req.user,

      stats: {
        totalStudents,
        totalTeachers,
        totalUsers,
        totalCourses,
        totalAttendance,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch admin dashboard data",
      error: error.message,
    });
  }
};

module.exports = { adminDashboard };