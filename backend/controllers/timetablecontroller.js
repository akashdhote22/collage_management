const Timetable = require("../models/timetable");
const Course = require("../models/course");
const Teacher = require("../models/teacher");

// CREATE TIMETABLE
const createTimetable = async (req, res) => {
  try {
    const {
      day,
      courseId,
      teacherId,
      semester,
      branch,
      startTime,
      endTime,
      roomNumber,
    } = req.body;

    if (
      !day ||
      !courseId ||
      !teacherId ||
      !semester ||
      !branch ||
      !startTime ||
      !endTime ||
      !roomNumber
    ) {
      return res.status(400).json({
        message:
          "Please provide day, courseId, teacherId, semester, branch, startTime, endTime and roomNumber",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be greater than start time",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const timetable = await Timetable.create({
      day,
      courseId,
      teacherId,
      semester,
      branch,
      startTime,
      endTime,
      roomNumber,
    });

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    res.status(201).json({
      message: "Timetable created successfully",
      timetable: populatedTimetable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL TIMETABLES
const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({
        day: 1,
        startTime: 1,
      });

    res.status(200).json({
      count: timetables.length,
      timetables,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET TIMETABLE BY SEMESTER AND BRANCH
const getTimetableByClass = async (req, res) => {
  try {
    const { semester, branch } = req.query;

    const filter = {};

    if (semester) {
      filter.semester = Number(semester);
    }

    if (branch) {
      filter.branch = branch;
    }

    const timetables = await Timetable.find(filter)
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({
        day: 1,
        startTime: 1,
      });

    res.status(200).json({
      count: timetables.length,
      timetables,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE TIMETABLE
const getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    if (!timetable) {
      return res.status(404).json({
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE TIMETABLE
const updateTimetable = async (req, res) => {
  try {
    const {
      day,
      courseId,
      teacherId,
      semester,
      branch,
      startTime,
      endTime,
      roomNumber,
    } = req.body;

    if (startTime && endTime && startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be greater than start time",
      });
    }

    if (courseId) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }
    }

    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }
    }

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      {
        day,
        courseId,
        teacherId,
        semester,
        branch,
        startTime,
        endTime,
        roomNumber,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    if (!timetable) {
      return res.status(404).json({
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      message: "Timetable updated successfully",
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE TIMETABLE
const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      message: "Timetable deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET TIMETABLE OF LOGGED-IN STUDENT
const getStudentTimetable = async (req, res) => {
  try {
    const Student = require("../models/students");

    // Logged-in student ka profile find karo
    const studentProfile = await Student.findOne({
      userId: req.user.userId,
    });

    if (!studentProfile) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Student ke semester aur branch ke according timetable find karo
    const timetables = await Timetable.find({
      semester: studentProfile.semester,
      branch: studentProfile.branch,
    })
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({
        day: 1,
        startTime: 1,
      });

    res.status(200).json({
      count: timetables.length,
      timetable: timetables,
    });
  } catch (error) {
    console.error("Get student timetable error:", error);

    res.status(500).json({
      message: "Failed to fetch student timetable",
      error: error.message,
    });
  }
};
// GET TIMETABLE OF LOGGED-IN TEACHER

// GET TIMETABLE OF LOGGED-IN TEACHER

const getTeacherTimetable = async (req, res) => {
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

    // Sirf logged-in teacher ka timetable find karo
    const timetables = await Timetable.find({
      teacherId: teacherProfile._id,
    })
      .populate("courseId", "courseCode courseName")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({
        day: 1,
        startTime: 1,
      });

    res.status(200).json({
      count: timetables.length,
      timetables,
    });
  } catch (error) {
    console.error("Get teacher timetable error:", error);

    res.status(500).json({
      message: "Failed to fetch teacher timetable",
      error: error.message,
    });
  }
};

module.exports = {
  createTimetable,
  getTimetables,
  getTimetableByClass,
  getTimetableById,
  getTeacherTimetable,
  getStudentTimetable,
  updateTimetable,
  deleteTimetable,
};