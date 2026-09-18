const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    targetAudience: {
      type: String,
      enum: ["all", "students", "teachers", "admin"],
      default: "all",
    },

    publishDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;