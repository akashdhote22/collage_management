import { useEffect, useState } from "react";
import api from "../../services/api";

const BookIssue = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    bookId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.books || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await api.get("/book-issues");
      setIssues(response.data.bookIssues || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch book issue records"
      );
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchIssues();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/book-issues", {
        studentId: formData.studentId,
        bookId: formData.bookId,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
      });

      setMessage("Book issued successfully");

      setFormData({
        studentId: "",
        bookId: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
      });

      fetchBooks();
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (issueId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) return;

    try {
      await api.put(`/book-issues/return/${issueId}`);

      setMessage("Book returned successfully");
      fetchBooks();
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to return book");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Book Issue Management</h1>
          <p style={styles.subtitle}>
            Issue and return library books
          </p>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Issue Book</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label>Student</label>

              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Student</option>

                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.userId?.name ||
                      student.name ||
                      student.rollNumber ||
                      "Student"}
                    {student.rollNumber
                      ? ` - ${student.rollNumber}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Book</label>

              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Book</option>

                {books
                  .filter((book) => book.availableCopies > 0)
                  .map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} — Available: {book.availableCopies}
                    </option>
                  ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Issue Date</label>

              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Issuing..." : "Issue Book"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Book Issue Records</h2>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Book</th>
                <th style={styles.th}>Issue Date</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Return Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>
                    No book issue records found
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue._id}>
                    <td style={styles.td}>
                      {issue.studentId?.userId?.name ||
                        issue.studentId?.rollNumber ||
                        "N/A"}
                    </td>

                    <td style={styles.td}>
                      {issue.bookId?.title || "N/A"}
                      <br />
                      <small>
                        {issue.bookId?.author || ""}
                      </small>
                    </td>

                    <td style={styles.td}>
                      {formatDate(issue.issueDate)}
                    </td>

                    <td style={styles.td}>
                      {formatDate(issue.dueDate)}
                    </td>

                    <td style={styles.td}>
                      {formatDate(issue.returnDate)}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          issue.status === "returned"
                            ? styles.returned
                            : styles.issued
                        }
                      >
                        {issue.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {issue.status === "issued" ? (
                        <button
                          onClick={() => handleReturn(issue._id)}
                          style={styles.returnButton}
                        >
                          Return
                        </button>
                      ) : (
                        <span style={styles.completed}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  header: {
    marginBottom: "25px",
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
  },
  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#111827",
    fontSize: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: "22px",
    padding: "12px 22px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "18px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "18px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },
  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: "13px",
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    fontSize: "14px",
  },
  issued: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  returned: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  returnButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "7px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  completed: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};

export default BookIssue;