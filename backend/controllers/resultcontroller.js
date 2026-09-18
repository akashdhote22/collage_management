const Result = require("../models/result");
const Student = require("../models/Student");
const Course = require("../models/course");

// CALCULATE PERCENTAGE
const calculatePercentage = (obtainedMarks, totalMarks) => {
  return Number(((obtainedMarks / totalMarks) * 100).toFixed(2));
};

// CALCULATE GRADE
const calculateGrade = (percentage) => {
  if (percentage >= 90) {
    return "A+";
  } else if (percentage >= 80) {
    return "A";
  } else if (percentage >= 70) {
    return "B+";
  } else if (percentage >= 60) {
    return "B";
  } else if (percentage >= 50) {
    return "C";
  } else if (percentage >= 40) {
    return "D";
  } else {
    return "F";
  }
};

// CREATE RESULT
const createResult = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      examType,
      totalMarks,
      obtainedMarks,
      remarks,
    } = req.body;

    if (
      !studentId ||
      !courseId ||
      !examType ||
      totalMarks === undefined ||
      obtainedMarks === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide studentId, courseId, examType, totalMarks and obtainedMarks",
      });
    }

    if (totalMarks <= 0) {
      return res.status(400).json({
        message: "Total marks must be greater than 0",
      });
    }

    if (obtainedMarks < 0) {
      return res.status(400).json({
        message: "Obtained marks cannot be negative",
      });
    }

    if (obtainedMarks > totalMarks) {
      return res.status(400).json({
        message: "Obtained marks cannot be greater than total marks",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingResult = await Result.findOne({
      studentId,
      courseId,
      examType,
    });

    if (existingResult) {
      return res.status(400).json({
        message:
          "Result already exists for this student, course and exam type",
      });
    }

    const percentage = calculatePercentage(
      obtainedMarks,
      totalMarks
    );

    const grade = calculateGrade(percentage);

    const result = await Result.create({
      studentId,
      courseId,
      examType,
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      remarks,
    });

    const populatedResult = await Result.findById(result._id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName");

    res.status(201).json({
      message: "Result created successfully",
      result: populatedResult,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL RESULTS
const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET RESULTS BY STUDENT
const getResultsByStudent = async (req, res) => {
  try {
    const results = await Result.find({
      studentId: req.params.studentId,
    })
      .populate("courseId", "courseCode courseName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE RESULT
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName");

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE RESULT
const updateResult = async (req, res) => {
  try {
    const {
      examType,
      totalMarks,
      obtainedMarks,
      remarks,
    } = req.body;

    const existingResult = await Result.findById(req.params.id);

    if (!existingResult) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    const updatedTotalMarks =
      totalMarks !== undefined
        ? totalMarks
        : existingResult.totalMarks;

    const updatedObtainedMarks =
      obtainedMarks !== undefined
        ? obtainedMarks
        : existingResult.obtainedMarks;

    if (updatedTotalMarks <= 0) {
      return res.status(400).json({
        message: "Total marks must be greater than 0",
      });
    }

    if (updatedObtainedMarks < 0) {
      return res.status(400).json({
        message: "Obtained marks cannot be negative",
      });
    }

    if (updatedObtainedMarks > updatedTotalMarks) {
      return res.status(400).json({
        message: "Obtained marks cannot be greater than total marks",
      });
    }

    const percentage = calculatePercentage(
      updatedObtainedMarks,
      updatedTotalMarks
    );

    const grade = calculateGrade(percentage);

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        examType,
        totalMarks: updatedTotalMarks,
        obtainedMarks: updatedObtainedMarks,
        percentage,
        grade,
        remarks,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode courseName");

    res.status(200).json({
      message: "Result updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE RESULT
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json({
      message: "Result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createResult,
  getResults,
  getResultsByStudent,
  getResultById,
  updateResult,
  deleteResult,
};