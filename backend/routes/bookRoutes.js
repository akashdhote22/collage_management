const express = require("express");

const router = express.Router();

// Book controller ke functions yahan import karo.
// Apne bookController.js mein jo actual functions hain,
// unhi ke naam yahan rakho.
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookcontroller");

// Create book
router.post("/", createBook);

// Get all books
router.get("/", getBooks);

// Get single book
router.get("/:id", getBookById);

// Update book
router.put("/:id", updateBook);

// Delete book
router.delete("/:id", deleteBook);

module.exports = router;