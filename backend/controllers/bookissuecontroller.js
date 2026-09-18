const BookIssue = require("../models/bookissue");
const Book = require("../models/book");
const Student = require("../models/Student");

// ISSUE BOOK
const issueBook = async (req, res) => {
  try {
    const {
      studentId,
      bookId,
      issueDate,
      dueDate,
    } = req.body;

    // Validate required fields
    if (!studentId || !bookId || !dueDate) {
      return res.status(400).json({
        message: "Please provide studentId, bookId and dueDate",
      });
    }

    // Check student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Check available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "Book is currently unavailable",
      });
    }

    // Check due date
    const selectedIssueDate = issueDate
      ? new Date(issueDate)
      : new Date();

    const selectedDueDate = new Date(dueDate);

    if (selectedDueDate <= selectedIssueDate) {
      return res.status(400).json({
        message: "Due date must be after issue date",
      });
    }

    // Create issue record
    const bookIssue = await BookIssue.create({
      studentId,
      bookId,
      issueDate: selectedIssueDate,
      dueDate: selectedDueDate,
      status: "issued",
      issuedBy: req.user.userId,
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate response
    const populatedBookIssue = await BookIssue.findById(
      bookIssue._id
    )
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("bookId", "title author isbn category")
      .populate("issuedBy", "name email");

    res.status(201).json({
      message: "Book issued successfully",
      bookIssue: populatedBookIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL ISSUED BOOKS
const getBookIssues = async (req, res) => {
  try {
    const bookIssues = await BookIssue.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("bookId", "title author isbn category")
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookIssues.length,
      bookIssues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET BOOK ISSUES BY STUDENT
const getBookIssuesByStudent = async (req, res) => {
  try {
    const bookIssues = await BookIssue.find({
      studentId: req.params.studentId,
    })
      .populate("bookId", "title author isbn category")
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookIssues.length,
      bookIssues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const bookIssue = await BookIssue.findById(req.params.id);

    if (!bookIssue) {
      return res.status(404).json({
        message: "Book issue record not found",
      });
    }

    // Check whether book is already returned
    if (bookIssue.status === "returned") {
      return res.status(400).json({
        message: "Book has already been returned",
      });
    }

    // Find the related book
    const book = await Book.findById(bookIssue.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Related book not found",
      });
    }

    // Update issue record
    bookIssue.returnDate = new Date();
    bookIssue.status = "returned";

    await bookIssue.save();

    // Increase available copies
    book.availableCopies += 1;

    // Do not allow available copies to exceed total copies
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }

    await book.save();

    // Populate response
    const populatedBookIssue = await BookIssue.findById(
      bookIssue._id
    )
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("bookId", "title author isbn category")
      .populate("issuedBy", "name email");

    res.status(200).json({
      message: "Book returned successfully",
      bookIssue: populatedBookIssue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  issueBook,
  getBookIssues,
  getBookIssuesByStudent,
  returnBook,
};