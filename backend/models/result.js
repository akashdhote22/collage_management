const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    examType: {
      type: String,
      required: true,
      enum: ["Unit Test", "Mid Term", "Final Exam", "Practical"],
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate result for same student,
// course and exam type
resultSchema.index(
  {
    studentId: 1,
    courseId: 1,
    examType: 1,
  },
  {
    unique: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;