const Teacher = require("../models/teacher");
const User = require("../models/user");
const Course = require("../models/course");
const Attendance = require("../models/attendance");
const Notice = require("../models/notice");
const Timetable = require("../models/timetable");
// CREATE TEACHER
const createTeacher = async (req, res) => {
  try {
    const {
      userId,
      employeeId,
      department,
      designation,
      phone,
    } = req.body;

    // Check required fields
    if (!userId || !employeeId || !department || !designation) {
      return res.status(400).json({
        message:
          "Please provide userId, employeeId, department and designation",
      });
    }

    // Check whether user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check user role
    if (user.role !== "teacher") {
      return res.status(400).json({
        message: "Selected user is not a teacher",
      });
    }

    // Check whether teacher profile already exists
    const existingTeacher = await Teacher.findOne({ userId });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher profile already exists",
      });
    }

    // Check employee ID already exists
    const existingEmployee = await Teacher.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already exists",
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      userId,
      employeeId,
      department,
      designation,
      phone,
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL TEACHERS
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate(
      "userId",
      "name email role"
    );

    res.status(200).json({
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE TEACHER
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE TEACHER
const updateTeacher = async (req, res) => {
  try {
    const {
      employeeId,
      department,
      designation,
      phone,
    } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        employeeId,
        department,
        designation,
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "name email role");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE TEACHER
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// TEACHER DASHBOARD

const teacherDashboard = async (req, res) => {
  try {
    // Logged-in teacher ka profile find karo
    const teacherProfile = await Teacher.findOne({
  userId: req.user.userId,
});

    if (!teacherProfile) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // Is teacher ke timetable records se assigned courses count honge
    const assignedCourses = await Timetable.distinct("courseId", {
      teacherId: teacherProfile._id,
    });

    const totalCourses = assignedCourses.length;

    // Total registered students
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    // Is teacher ne jitni attendance mark ki hai
  const totalAttendance = await Attendance.countDocuments({
  markedBy: req.user.userId,
});

    // Teachers ke liye visible notices
    const totalNotices = await Notice.countDocuments({
      $or: [
        { targetAudience: "all" },
        { targetAudience: "teachers" },
      ],
    });

    res.status(200).json({
      message: "Teacher dashboard data fetched successfully",
      stats: {
        totalCourses,
        totalStudents,
        totalAttendance,
        totalNotices,
      },
    });
  } catch (error) {
    console.error("Teacher dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch teacher dashboard data",
      error: error.message,
    });
  }
};

// GET COURSES ASSIGNED TO LOGGED-IN TEACHER

const getTeacherCourses = async (req, res) => {
  try {
    // Logged-in user ka teacher profile find karo
   const teacherProfile = await Teacher.findOne({
  userId: req.user.userId,
});

    if (!teacherProfile) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // Teacher ke timetable records find karo
    const timetableRecords = await Timetable.find({
      teacherId: teacherProfile._id,
    }).populate("courseId");

    // Duplicate courses remove karne ke liye Map use karenge
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
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get teacher courses error:", error);

    res.status(500).json({
      message: "Failed to fetch teacher courses",
      error: error.message,
    });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  teacherDashboard,
  getTeacherCourses,
};