const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },

    publishedYear: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;