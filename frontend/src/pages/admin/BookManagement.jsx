import { useEffect, useState } from "react";
import api from "../../api";

const initialFormData = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publisher: "",
  totalCopies: "",
  description: "",
};

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setFetchLoading(true);

      const response = await api.get("/books");

      setBooks(response.data.books || []);
    } catch (err) {
      console.error("Fetch books error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch books"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add book
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.title ||
      !formData.author ||
      !formData.isbn ||
      !formData.category ||
      !formData.totalCopies
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (Number(formData.totalCopies) < 1) {
      setError("Total copies must be at least 1");
      return;
    }

    try {
      setLoading(true);

      await api.post("/books", {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        category: formData.category,
        publisher: formData.publisher,
        totalCopies: Number(formData.totalCopies),
        description: formData.description,
      });

      setMessage("Book added successfully!");

      setFormData(initialFormData);

      fetchBooks();
    } catch (err) {
      console.error("Add book error:", err);

      setError(
        err.response?.data?.message || "Failed to add book"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");

      await api.delete(`/books/${bookId}`);

      setMessage("Book deleted successfully!");

      fetchBooks();
    } catch (err) {
      console.error("Delete book error:", err);

      setError(
        err.response?.data?.message || "Failed to delete book"
      );
    }
  };

  // Search filter
  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(searchText) ||
      book.author?.toLowerCase().includes(searchText) ||
      book.isbn?.toLowerCase().includes(searchText) ||
      book.category?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Library Book Management
        </h1>

        <p className="text-gray-500 mt-1">
          Add, search and manage college library books.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Add Book Form */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Add New Book
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Book Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Author *
            </label>

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ISBN *
            </label>

            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category *
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Programming"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Publisher */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Publisher
            </label>

            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Total Copies */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Total Copies *
            </label>

            <input
              type="number"
              name="totalCopies"
              min="1"
              value={formData.totalCopies}
              onChange={handleChange}
              placeholder="Enter total copies"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>

      {/* Book List */}
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              All Books
            </h2>

            <p className="text-sm text-gray-500">
              Total books: {books.length}
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-80"
          />
        </div>

        {fetchLoading ? (
          <p className="py-8 text-center text-gray-500">
            Loading books...
          </p>
        ) : filteredBooks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No books found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Book
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Author
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    ISBN
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Copies
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Available
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr
                    key={book._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {book.title}
                      </p>

                      {book.publisher && (
                        <p className="text-xs text-gray-500">
                          {book.publisher}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {book.author}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {book.isbn}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {book.category}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {book.totalCopies}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          book.availableCopies > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.availableCopies}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookManagement;