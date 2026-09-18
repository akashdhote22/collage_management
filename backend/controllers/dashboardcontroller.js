const User = require("../models/user");
const Student = require("../models/Student");
const Teacher = require("../models/teacher");
const Course = require("../models/course");
const Book = require("../models/book");
const BookIssue = require("../models/bookissue");
const Fee = require("../models/fee");

// GET DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalBooks,
      availableBooks,
      issuedBooks,
      totalFeeRecords,
      feeSummary,
    ] = await Promise.all([
      Student.countDocuments(),

      Teacher.countDocuments(),

      Course.countDocuments(),

      Book.aggregate([
        {
          $group: {
            _id: null,
            totalCopies: { $sum: "$totalCopies" },
          },
        },
      ]),

      Book.aggregate([
        {
          $group: {
            _id: null,
            availableCopies: { $sum: "$availableCopies" },
          },
        },
      ]),

      BookIssue.countDocuments({
        status: "issued",
      }),

      Fee.countDocuments(),

      Fee.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            paidAmount: { $sum: "$paidAmount" },
            pendingAmount: { $sum: "$pendingAmount" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      statistics: {
        totalStudents,
        totalTeachers,
        totalCourses,

        totalBooks:
          totalBooks.length > 0
            ? totalBooks[0].totalCopies
            : 0,

        availableBooks:
          availableBooks.length > 0
            ? availableBooks[0].availableCopies
            : 0,

        issuedBooks,

        totalFeeRecords,

        fees:
          feeSummary.length > 0
            ? feeSummary[0]
            : {
                totalAmount: 0,
                paidAmount: 0,
                pendingAmount: 0,
              },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};