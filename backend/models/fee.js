const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "pending"],
      default: "pending",
    },

    paymentDate: {
      type: Date,
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

const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;