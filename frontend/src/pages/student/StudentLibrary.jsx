import { useEffect, useState } from "react";
import api from "../../api";

function StudentLibrary() {
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in student ID from localStorage
  const getStudentId = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      user?.studentId ||
      user?._id ||
      user?.id ||
      user?.userId
    );
  };

  // Fetch available books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");

      setBooks(response.data.books || []);
    } catch (err) {
      console.error("Fetch books error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch books"
      );
    }
  };

  // Fetch student's issued books
  const fetchIssuedBooks = async () => {
    try {
      const studentId = getStudentId();

      if (!studentId) {
        console.warn("Student ID not found in localStorage");
        return;
      }

      const response = await api.get(
        `/book-issues/student/${studentId}`
      );

      setIssuedBooks(response.data.bookIssues || []);
    } catch (err) {
      console.error("Fetch issued books error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch issued books"
      );
    }
  };

  useEffect(() => {
    const loadLibraryData = async () => {
      setLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchIssuedBooks(),
      ]);

      setLoading(false);
    };

    loadLibraryData();
  }, []);

  // Search books
  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(searchText) ||
      book.author?.toLowerCase().includes(searchText) ||
      book.isbn?.toLowerCase().includes(searchText) ||
      book.category?.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Student Library
        </h1>

        <p className="mt-1 text-gray-500">
          Browse available books and check your issued books.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Available Books Section */}
      <section className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Available Books
            </h2>

            <p className="text-sm text-gray-500">
              Books available in the college library
            </p>
          </div>

          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-80"
          />
        </div>

        {filteredBooks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No books found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {book.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.availableCopies > 0
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Author:</span>{" "}
                    {book.author}
                  </p>

                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {book.category}
                  </p>

                  <p>
                    <span className="font-medium">ISBN:</span>{" "}
                    {book.isbn}
                  </p>

                  <p>
                    <span className="font-medium">Total Copies:</span>{" "}
                    {book.totalCopies}
                  </p>

                  <p>
                    <span className="font-medium">Available Copies:</span>{" "}
                    {book.availableCopies}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Issued Books Section */}
      <section className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            My Issued Books
          </h2>

          <p className="text-sm text-gray-500">
            Books currently issued to you
          </p>
        </div>

        {issuedBooks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            You have no issued books.
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
                    Issue Date
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Due Date
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Return Date
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {issuedBooks.map((issue, index) => (
                  <tr
                    key={issue._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {issue.bookId?.title || "Book unavailable"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {issue.bookId?.author || ""}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {issue.issueDate
                        ? new Date(issue.issueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {issue.dueDate
                        ? new Date(issue.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {issue.returnDate
                        ? new Date(issue.returnDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          issue.status === "returned"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentLibrary;