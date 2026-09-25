import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Library,
  RotateCcw,
  Search,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

const getToday = () => new Date().toISOString().split("T")[0];

const BookIssue = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    bookId: "",
    issueDate: getToday(),
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        err.response?.data?.message ||
          "Failed to fetch book issue records"
      );
    }
  };

  const fetchAllData = async () => {
    setPageLoading(true);
    setError("");

    try {
      await Promise.all([
        fetchBooks(),
        fetchStudents(),
        fetchIssues(),
      ]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
        issueDate: getToday(),
        dueDate: "",
      });

      await fetchBooks();
      await fetchIssues();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to issue book"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (issueId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) return;

    setReturningId(issueId);
    setMessage("");
    setError("");

    try {
      await api.put(`/book-issues/return/${issueId}`);

      setMessage("Book returned successfully");

      await fetchBooks();
      await fetchIssues();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to return book"
      );
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (student) => {
    return (
      student?.userId?.name ||
      student?.name ||
      student?.rollNumber ||
      "Student"
    );
  };

  const filteredIssues = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return issues;

    return issues.filter((issue) => {
      const studentName =
        issue.studentId?.userId?.name ||
        issue.studentId?.rollNumber ||
        "";

      const studentRoll =
        issue.studentId?.rollNumber || "";

      const bookTitle =
        issue.bookId?.title || "";

      const author =
        issue.bookId?.author || "";

      const status =
        issue.status || "";

      return [
        studentName,
        studentRoll,
        bookTitle,
        author,
        status,
      ].some((value) =>
        String(value).toLowerCase().includes(query)
      );
    });
  }, [issues, searchTerm]);

  const stats = useMemo(() => {
    const total = issues.length;

    const issued = issues.filter(
      (issue) => issue.status === "issued"
    ).length;

    const returned = issues.filter(
      (issue) => issue.status === "returned"
    ).length;

    const availableBooks = books.reduce(
      (total, book) =>
        total + Number(book.availableCopies || 0),
      0
    );

    return {
      total,
      issued,
      returned,
      availableBooks,
    };
  }, [issues, books]);

  const availableBooks = books.filter(
    (book) => Number(book.availableCopies || 0) > 0
  );

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 900px) {
          .book-issue-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .book-issue-form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 650px) {
          .book-issue-stats {
            grid-template-columns: 1fr !important;
          }

          .book-issue-form-grid {
            grid-template-columns: 1fr !important;
          }

          .book-issue-header {
            flex-direction: column !important;
          }

          .book-issue-search {
            width: 100% !important;
          }

          .book-issue-actions {
            flex-direction: column !important;
          }

          .book-issue-actions button {
            width: 100% !important;
          }
        }

        .book-issue-table tbody tr {
          transition: background 0.2s ease;
        }

        .book-issue-table tbody tr:hover {
          background: #f8fbff;
        }

        .book-issue-input:focus {
          outline: none;
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .book-issue-button {
          transition: all 0.2s ease;
        }

        .book-issue-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.22);
        }

        .book-return-button {
          transition: all 0.2s ease;
        }

        .book-return-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(22, 163, 74, 0.2);
        }
      `}</style>

      {/* HERO */}
      <div style={styles.hero} className="book-issue-header">
        <div style={styles.heroLeft}>
          <div style={styles.heroIcon}>
            <Library size={28} />
          </div>

          <div>
            <div style={styles.eyebrow}>
              LIBRARY MANAGEMENT
            </div>

            <h1 style={styles.title}>
              Book Issue Management
            </h1>

            <p style={styles.subtitle}>
              Issue and return library books with ease
            </p>
          </div>
        </div>

        <div style={styles.heroBadge}>
          <BookOpen size={16} />
          Library Portal
        </div>
      </div>

      {/* ALERTS */}
      {message && (
        <div style={styles.success}>
          <CheckCircle2 size={19} />
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            style={styles.alertClose}
          >
            <XCircle size={17} />
          </button>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <XCircle size={19} />
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            style={styles.alertClose}
          >
            <XCircle size={17} />
          </button>
        </div>
      )}

      {/* STATS */}
      <div
        className="book-issue-stats"
        style={styles.statsGrid}
      >
        <StatCard
          icon={<BookOpen size={21} />}
          title="Total Records"
          value={stats.total}
          description="All issue records"
        />

        <StatCard
          icon={<Clock3 size={21} />}
          title="Currently Issued"
          value={stats.issued}
          description="Books with students"
        />

        <StatCard
          icon={<CheckCircle2 size={21} />}
          title="Returned"
          value={stats.returned}
          description="Completed returns"
        />

        <StatCard
          icon={<Library size={21} />}
          title="Available Copies"
          value={stats.availableBooks}
          description="Ready to issue"
        />
      </div>

      {/* ISSUE BOOK */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.sectionIcon}>
            <BookOpen size={20} />
          </div>

          <div>
            <h2 style={styles.cardTitle}>
              Issue a Book
            </h2>

            <p style={styles.cardSubtitle}>
              Select a student, book and issue period
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="book-issue-form-grid"
            style={styles.formGrid}
          >
            <FormField
              label="Student"
              icon={<UserRound size={17} />}
            >
              <select
                className="book-issue-input"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {getStudentName(student)}
                    {student.rollNumber
                      ? ` - ${student.rollNumber}`
                      : ""}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Book"
              icon={<BookOpen size={17} />}
            >
              <select
                className="book-issue-input"
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">
                  Select Book
                </option>

                {availableBooks.map((book) => (
                  <option
                    key={book._id}
                    value={book._id}
                  >
                    {book.title} — Available:{" "}
                    {book.availableCopies}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Issue Date"
              icon={<CalendarDays size={17} />}
            >
              <input
                className="book-issue-input"
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Due Date"
              icon={<CalendarDays size={17} />}
            >
              <input
                className="book-issue-input"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </FormField>
          </div>

          <div
            className="book-issue-actions"
            style={styles.formActions}
          >
            <button
              type="submit"
              disabled={loading}
              className="book-issue-button"
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <BookOpen size={18} />

              {loading
                ? "Issuing..."
                : "Issue Book"}
            </button>

            <div style={styles.availableInfo}>
              <Library size={16} />
              {availableBooks.length} book titles available
            </div>
          </div>
        </form>
      </div>

      {/* RECORDS */}
      <div style={styles.card}>
        <div
          className="book-issue-header"
          style={styles.recordsHeader}
        >
          <div style={styles.cardHeader}>
            <div style={styles.sectionIcon}>
              <Users size={20} />
            </div>

            <div>
              <h2 style={styles.cardTitle}>
                Book Issue Records
              </h2>

              <p style={styles.cardSubtitle}>
                Track issued and returned books
              </p>
            </div>
          </div>

          <div
            className="book-issue-search"
            style={styles.searchBox}
          >
            <Search
              size={18}
              color="#64748b"
            />

            <input
              type="text"
              placeholder="Search student, book, author..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.resultInfo}>
          Showing{" "}
          <strong>{filteredIssues.length}</strong>{" "}
          of {issues.length} records
        </div>

        {pageLoading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading library records...</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table
              className="book-issue-table"
              style={styles.table}
            >
              <thead>
                <tr>
                  <th style={styles.th}>
                    Student
                  </th>

                  <th style={styles.th}>
                    Book
                  </th>

                  <th style={styles.th}>
                    Issue Date
                  </th>

                  <th style={styles.th}>
                    Due Date
                  </th>

                  <th style={styles.th}>
                    Return Date
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th style={styles.th}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={styles.empty}
                    >
                      <div style={styles.emptyIcon}>
                        <BookOpen size={27} />
                      </div>

                      <strong>
                        No book issue records found
                      </strong>

                      <span>
                        Issue a book or change your
                        search.
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const isReturned =
                      issue.status === "returned";

                    return (
                      <tr key={issue._id}>
                        {/* STUDENT */}
                        <td style={styles.td}>
                          <div style={styles.studentCell}>
                            <div style={styles.avatar}>
                              <UserRound size={17} />
                            </div>

                            <div>
                              <div
                                style={styles.primaryText}
                              >
                                {issue.studentId?.userId
                                  ?.name ||
                                  issue.studentId
                                    ?.rollNumber ||
                                  "N/A"}
                              </div>

                              {issue.studentId
                                ?.rollNumber && (
                                <div
                                  style={
                                    styles.secondaryText
                                  }
                                >
                                  {
                                    issue.studentId
                                      .rollNumber
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* BOOK */}
                        <td style={styles.td}>
                          <div style={styles.bookCell}>
                            <div style={styles.bookIcon}>
                              <BookOpen size={17} />
                            </div>

                            <div>
                              <div
                                style={styles.primaryText}
                              >
                                {issue.bookId?.title ||
                                  "N/A"}
                              </div>

                              <div
                                style={
                                  styles.secondaryText
                                }
                              >
                                {issue.bookId?.author ||
                                  "Unknown author"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ISSUE DATE */}
                        <td style={styles.td}>
                          <DateBadge
                            date={formatDate(
                              issue.issueDate
                            )}
                          />
                        </td>

                        {/* DUE DATE */}
                        <td style={styles.td}>
                          <DateBadge
                            date={formatDate(
                              issue.dueDate
                            )}
                            warning={!isReturned}
                          />
                        </td>

                        {/* RETURN DATE */}
                        <td style={styles.td}>
                          <span
                            style={
                              issue.returnDate
                                ? styles.dateText
                                : styles.mutedText
                            }
                          >
                            {formatDate(
                              issue.returnDate
                            )}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td style={styles.td}>
                          <span
                            style={
                              isReturned
                                ? styles.returned
                                : styles.issued
                            }
                          >
                            {isReturned ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}

                            {issue.status ||
                              "issued"}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td style={styles.td}>
                          {issue.status === "issued" ? (
                            <button
                              onClick={() =>
                                handleReturn(
                                  issue._id
                                )
                              }
                              disabled={
                                returningId ===
                                issue._id
                              }
                              className="book-return-button"
                              style={{
                                ...styles.returnButton,
                                opacity:
                                  returningId ===
                                  issue._id
                                    ? 0.65
                                    : 1,
                              }}
                            >
                              <RotateCcw size={15} />

                              {returningId ===
                              issue._id
                                ? "Returning..."
                                : "Return"}
                            </button>
                          ) : (
                            <span
                              style={styles.completed}
                            >
                              <CheckCircle2
                                size={15}
                              />
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div style={styles.statIcon}>
          {icon}
        </div>

        <span style={styles.statLabel}>
          {title}
        </span>
      </div>

      <div style={styles.statValue}>
        {value}
      </div>

      <div style={styles.statDescription}>
        {description}
      </div>
    </div>
  );
};

const FormField = ({
  label,
  icon,
  children,
}) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        <span style={styles.labelIcon}>
          {icon}
        </span>
        {label}
      </label>

      {children}
    </div>
  );
};

const DateBadge = ({ date, warning }) => {
  return (
    <span
      style={{
        ...styles.dateBadge,
        ...(warning ? styles.warningDate : {}),
      }}
    >
      <CalendarDays size={14} />
      {date}
    </span>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100%",
    paddingBottom: "30px",
  },

  hero: {
    background:
      "linear-gradient(135deg, #0f2a5f 0%, #173f87 52%, #2563eb 100%)",
    borderRadius: "20px",
    padding: "28px 30px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "22px",
    boxShadow:
      "0 16px 35px rgba(15, 42, 95, 0.20)",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
  },

  heroIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(255,255,255,0.18)",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    color: "#bfdbfe",
    marginBottom: "5px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#dbeafe",
    fontSize: "14px",
  },

  heroBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 13px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "18px",
    borderRadius: "12px",
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    fontSize: "14px",
    fontWeight: "600",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "18px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    fontSize: "14px",
    fontWeight: "600",
  },

  alertClose: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "19px",
    boxShadow:
      "0 5px 18px rgba(15, 23, 42, 0.05)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },

  statValue: {
    marginTop: "15px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
  },

  statDescription: {
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "23px",
    marginBottom: "22px",
    boxShadow:
      "0 6px 22px rgba(15, 23, 42, 0.05)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "17px",
    marginTop: "23px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  labelIcon: {
    color: "#2563eb",
    display: "flex",
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    background: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  },

  formActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "22px",
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 20px",
    background:
      "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
  },

  availableInfo: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },

  recordsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "15px",
  },

  searchBox: {
    width: "330px",
    height: "42px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 12px",
    background: "#ffffff",
    boxSizing: "border-box",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#0f172a",
    background: "transparent",
  },

  resultInfo: {
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "13px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "13px",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "13px 14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #eef2f7",
    color: "#334155",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  bookCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  bookIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#f0fdf4",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  primaryText: {
    color: "#0f172a",
    fontWeight: "750",
    fontSize: "13px",
  },

  secondaryText: {
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "3px",
  },

  dateBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 9px",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "650",
    whiteSpace: "nowrap",
  },

  warningDate: {
    background: "#fffbeb",
    color: "#a16207",
  },

  dateText: {
    color: "#475569",
    fontWeight: "600",
  },

  mutedText: {
    color: "#94a3b8",
  },

  issued: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  returned: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  returnButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  completed: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "750",
  },

  empty: {
    textAlign: "center",
    padding: "55px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 12px",
    borderRadius: "15px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  spinner: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    animation: "spin 0.8s linear infinite",
  },
};

export default BookIssue;