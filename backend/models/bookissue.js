const mongoose = require("mongoose");

const bookIssueSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["issued", "returned"],
      default: "issued",
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookIssue = mongoose.model("BookIssue", bookIssueSchema);

module.exports = BookIssue;