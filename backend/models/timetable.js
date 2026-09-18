const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;