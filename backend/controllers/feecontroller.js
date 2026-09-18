const Fee = require("../models/fee");
const Student = require("../models/Student");

// Helper function to calculate payment details
const calculatePaymentDetails = (totalAmount, paidAmount) => {
  const pendingAmount = totalAmount - paidAmount;

  let paymentStatus = "pending";

  if (paidAmount === totalAmount) {
    paymentStatus = "paid";
  } else if (paidAmount > 0 && paidAmount < totalAmount) {
    paymentStatus = "partial";
  }

  return {
    pendingAmount,
    paymentStatus,
  };
};

// CREATE FEE RECORD
const createFee = async (req, res) => {
  try {
    const {
      studentId,
      academicYear,
      semester,
      totalAmount,
      paidAmount = 0,
      paymentDate,
      remarks,
    } = req.body;

    if (
      !studentId ||
      !academicYear ||
      !semester ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide studentId, academicYear, semester and totalAmount",
      });
    }

    // Validate student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Validate amounts
    if (totalAmount < 0 || paidAmount < 0) {
      return res.status(400).json({
        message: "Amounts cannot be negative",
      });
    }

    if (paidAmount > totalAmount) {
      return res.status(400).json({
        message: "Paid amount cannot be greater than total amount",
      });
    }

    const { pendingAmount, paymentStatus } =
      calculatePaymentDetails(totalAmount, paidAmount);

    const fee = await Fee.create({
      studentId,
      academicYear,
      semester,
      totalAmount,
      paidAmount,
      pendingAmount,
      paymentStatus,
      paymentDate,
      remarks,
    });

    const populatedFee = await Fee.findById(fee._id).populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    res.status(201).json({
      message: "Fee record created successfully",
      fee: populatedFee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL FEE RECORDS
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET FEES BY STUDENT
const getFeesByStudent = async (req, res) => {
  try {
    const fees = await Fee.find({
      studentId: req.params.studentId,
    })
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ academicYear: -1, semester: 1 });

    res.status(200).json({
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE FEE RECORD
const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      fee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE FEE RECORD
const updateFee = async (req, res) => {
  try {
    const {
      academicYear,
      semester,
      totalAmount,
      paidAmount,
      paymentDate,
      remarks,
    } = req.body;

    const existingFee = await Fee.findById(req.params.id);

    if (!existingFee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    const updatedTotalAmount =
      totalAmount !== undefined
        ? totalAmount
        : existingFee.totalAmount;

    const updatedPaidAmount =
      paidAmount !== undefined
        ? paidAmount
        : existingFee.paidAmount;

    if (updatedTotalAmount < 0 || updatedPaidAmount < 0) {
      return res.status(400).json({
        message: "Amounts cannot be negative",
      });
    }

    if (updatedPaidAmount > updatedTotalAmount) {
      return res.status(400).json({
        message: "Paid amount cannot be greater than total amount",
      });
    }

    const { pendingAmount, paymentStatus } =
      calculatePaymentDetails(
        updatedTotalAmount,
        updatedPaidAmount
      );

    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      {
        academicYear,
        semester,
        totalAmount: updatedTotalAmount,
        paidAmount: updatedPaidAmount,
        pendingAmount,
        paymentStatus,
        paymentDate,
        remarks,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    res.status(200).json({
      message: "Fee record updated successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE FEE RECORD
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      message: "Fee record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET LOGGED-IN STUDENT FEES
const getStudentFees = async (req, res) => {
  try {
    // Logged-in user se student profile find karna
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Student ki fees find karna
    const fees = await Fee.find({
      studentId: student._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Student fees fetched successfully",
      fees,
    });
  } catch (error) {
    console.error("Student fees error:", error);

    res.status(500).json({
      message: "Failed to fetch student fees",
      error: error.message,
    });
  }
};

module.exports = {
  createFee,
  getFees,
  getFeesByStudent,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFees,
};