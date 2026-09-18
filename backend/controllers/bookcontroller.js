const Book = require("../models/book");

// CREATE BOOK
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      totalCopies,
      publishedYear,
      description,
    } = req.body;

    if (
      !title ||
      !author ||
      !isbn ||
      !category ||
      totalCopies === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide title, author, isbn, category and totalCopies",
      });
    }

    if (totalCopies < 1) {
      return res.status(400).json({
        message: "Total copies must be at least 1",
      });
    }

    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({
        message: "Book with this ISBN already exists",
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies,
      publishedYear,
      description,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL BOOKS
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });

    res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET AVAILABLE BOOKS
const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({
      availableCopies: { $gt: 0 },
    }).sort({ title: 1 });

    res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE BOOK
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      totalCopies,
      publishedYear,
      description,
    } = req.body;

    const existingBook = await Book.findById(req.params.id);

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (totalCopies !== undefined && totalCopies < 1) {
      return res.status(400).json({
        message: "Total copies must be at least 1",
      });
    }

    const issuedCopies =
      existingBook.totalCopies - existingBook.availableCopies;

    if (
      totalCopies !== undefined &&
      totalCopies < issuedCopies
    ) {
      return res.status(400).json({
        message:
          "Total copies cannot be less than currently issued copies",
      });
    }

    const updatedTotalCopies =
      totalCopies !== undefined
        ? totalCopies
        : existingBook.totalCopies;

    const updatedAvailableCopies =
      totalCopies !== undefined
        ? updatedTotalCopies - issuedCopies
        : existingBook.availableCopies;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        isbn,
        category,
        totalCopies: updatedTotalCopies,
        availableCopies: updatedAvailableCopies,
        publishedYear,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const issuedCopies = book.totalCopies - book.availableCopies;

    if (issuedCopies > 0) {
      return res.status(400).json({
        message: "Cannot delete book while copies are issued",
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  getAvailableBooks,
  getBookById,
  updateBook,
  deleteBook,
};