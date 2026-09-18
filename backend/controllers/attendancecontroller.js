const Attendance = require("../models/attendance");
const Student = require("../models/Student");
const Course = require("../models/course");
const User = require("../models/user");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timetable");

// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;

    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({
        message: "Please provide studentId, courseId, date and status",
      });
    }

    // Validate status
    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        message: "Status must be present or absent",
      });
    }

    // Check student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Normalize date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(attendanceDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      studentId,
      courseId,
      date: {
        $gte: attendanceDate,
        $lt: nextDate,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "Attendance already marked for this student, course and date",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      studentId,
      courseId,
      date: attendanceDate,
      status,
      markedBy: req.user.userId,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName")
      .populate("markedBy", "name email");

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error("Create attendance error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// CREATE ATTENDANCE BY TEACHER
const createTeacherAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;

    // Required fields check
    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({
        message: "Please provide studentId, courseId, date and status",
      });
    }

    // Validate status
    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        message: "Status must be present or absent",
      });
    }

    // Find logged-in teacher profile
    const teacherProfile = await Teacher.findOne({
  userId: req.user.userId,
});
    if (!teacherProfile) {
      return res.status(404).json({
        message: "Teacher profile not found",
      });
    }

    // Check whether course is assigned to this teacher
    const assignedCourse = await Timetable.findOne({
      teacherId: teacherProfile._id,
      courseId,
    });

    if (!assignedCourse) {
      return res.status(403).json({
        message: "This course is not assigned to you",
      });
    }

    // Check student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Normalize date to avoid time mismatch
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(attendanceDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      studentId,
      courseId,
      date: {
        $gte: attendanceDate,
        $lt: nextDate,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "Attendance already marked for this student, course and date",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      studentId,
      courseId,
      date: attendanceDate,
      status,
     markedBy: req.user.userId,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName")
      .populate("markedBy", "name email");

    res.status(201).json({
      message: "Teacher attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error("Create teacher attendance error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL ATTENDANCE
// GET ATTENDANCE RECORDS
const getAttendances = async (req, res) => {
  try {
    let filter = {};

    // Admin can view all attendance records
    if (req.user.role === "admin") {
      filter = {};
    }

    // Teacher can view attendance of assigned courses only
    if (req.user.role === "teacher") {
      const teacherProfile = await Teacher.findOne({
        userId: req.user.userId,
      });

      if (!teacherProfile) {
        return res.status(404).json({
          message: "Teacher profile not found",
        });
      }

      const timetableRecords = await Timetable.find({
        teacherId: teacherProfile._id,
      }).select("courseId");

      const assignedCourseIds = [
        ...new Set(
          timetableRecords.map((record) =>
            record.courseId.toString()
          )
        ),
      ];

      filter = {
        courseId: {
          $in: assignedCourseIds,
        },
      };
    }

    const attendances = await Attendance.find(filter)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      count: attendances.length,
      attendances,
    });
  } catch (error) {
    console.error("Get attendance records error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// GET ATTENDANCE BY STUDENT ID
const getAttendanceByStudent = async (req, res) => {
  try {
    const attendances = await Attendance.find({
      studentId: req.params.studentId,
    })
      .populate("courseId", "courseCode courseName")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      count: attendances.length,
      attendances,
    });
  } catch (error) {
    console.error("Get attendance by student error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT ATTENDANCE
const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({
  userId: req.user.userId,
});
    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const attendance = await Attendance.find({
      studentId: student._id,
    })
      .populate("courseId", "courseCode courseName")
      .sort({ date: -1 });

    res.status(200).json({
      message: "Student attendance fetched successfully",
      attendance,
    });
  } catch (error) {
    console.error("Student attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};

// UPDATE ATTENDANCE
const updateAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;

    if (status && !["present", "absent"].includes(status)) {
      return res.status(400).json({
        message: "Status must be present or absent",
      });
    }

    const updateData = {};

    if (date) {
      updateData.date = new Date(date);
    }

    if (status) {
      updateData.status = status;
    }

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("courseId", "courseCode courseName")
      .populate("markedBy", "name email");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE ATTENDANCE
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(
      req.params.id
    );

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("Delete attendance error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createAttendance,
  createTeacherAttendance,
  getAttendances,
  getAttendanceByStudent,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
};