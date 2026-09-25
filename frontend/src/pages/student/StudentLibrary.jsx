import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  Library,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

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
        err.response?.data?.message ||
          "Failed to fetch books"
      );
    }
  };

  // Fetch student's issued books
  const fetchIssuedBooks = async () => {
    try {
      const studentId = getStudentId();

      if (!studentId) {
        console.warn(
          "Student ID not found in localStorage"
        );
        return;
      }

      const response = await api.get(
        `/book-issues/student/${studentId}`
      );

      setIssuedBooks(
        response.data.bookIssues || []
      );
    } catch (err) {
      console.error(
        "Fetch issued books error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to fetch issued books"
      );
    }
  };

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchBooks(),
        fetchIssuedBooks(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  // Search books
  const filteredBooks = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return books.filter((book) => {
      return (
        book.title
          ?.toLowerCase()
          .includes(searchText) ||
        book.author
          ?.toLowerCase()
          .includes(searchText) ||
        book.isbn
          ?.toLowerCase()
          .includes(searchText) ||
        book.category
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [books, search]);

  const availableBooks = books.filter(
    (book) => Number(book.availableCopies) > 0
  ).length;

  const totalCopies = books.reduce(
    (total, book) =>
      total + Number(book.totalCopies || 0),
    0
  );

  const availableCopies = books.reduce(
    (total, book) =>
      total + Number(book.availableCopies || 0),
    0
  );

  const issuedCount = issuedBooks.filter(
    (issue) => issue.status !== "returned"
  ).length;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>
          Loading library...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .library-stat-card {
          transition: all 0.25s ease;
        }

        .library-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .book-card {
          transition: all 0.25s ease;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09);
          border-color: #bfdbfe !important;
        }

        .library-search:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .library-row {
          transition: background 0.2s ease;
        }

        .library-row:hover {
          background: #f8fafc;
        }

        @media (max-width: 900px) {
          .library-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          .library-content {
            padding: 16px !important;
          }

          .library-hero {
            padding: 22px !important;
          }

          .library-title {
            font-size: 24px !important;
          }

          .library-stats {
            grid-template-columns: 1fr !important;
          }

          .library-section {
            padding: 18px !important;
          }

          .library-section-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .library-search-box {
            width: 100% !important;
          }
        }
      `}</style>

      <div
        className="library-content"
        style={styles.content}
      >
        {/* HERO */}
        <div
          className="library-hero"
          style={styles.hero}
        >
          <div style={styles.heroCircleOne}></div>
          <div style={styles.heroCircleTwo}></div>

          <div style={styles.heroContent}>
            <div>
              <div style={styles.heroLabel}>
                <Library size={15} />
                STUDENT PORTAL
              </div>

              <h1
                className="library-title"
                style={styles.heroTitle}
              >
                Student Library
              </h1>

              <p style={styles.heroText}>
                Browse college books and track your
                issued books in one place.
              </p>
            </div>

            <button
              onClick={loadLibraryData}
              style={styles.refreshButton}
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          className="library-stats"
          style={styles.statsGrid}
        >
          <StatCard
            icon={<BookOpen size={21} />}
            label="Book Titles"
            value={books.length}
            iconBackground="#dbeafe"
            iconColor="#2563eb"
          />

          <StatCard
            icon={<Library size={21} />}
            label="Total Copies"
            value={totalCopies}
            iconBackground="#ede9fe"
            iconColor="#7c3aed"
          />

          <StatCard
            icon={<CheckCircle2 size={21} />}
            label="Available Copies"
            value={availableCopies}
            iconBackground="#dcfce7"
            iconColor="#16a34a"
          />

          <StatCard
            icon={<Clock3 size={21} />}
            label="My Issued Books"
            value={issuedCount}
            iconBackground="#fef3c7"
            iconColor="#d97706"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={19} />

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              style={styles.alertClose}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* AVAILABLE BOOKS */}
        <section
          className="library-section"
          style={styles.section}
        >
          <div
            className="library-section-header"
            style={styles.sectionHeader}
          >
            <div>
              <div style={styles.sectionTitleRow}>
                <div style={styles.sectionIcon}>
                  <BookOpen size={19} />
                </div>

                <h2 style={styles.sectionTitle}>
                  Available Books
                </h2>
              </div>

              <p style={styles.sectionSubtitle}>
                Browse books available in the college
                library.
              </p>
            </div>

            <div
              className="library-search-box"
              style={styles.searchBox}
            >
              <Search
                size={18}
                color="#94a3b8"
              />

              <input
                className="library-search"
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={styles.searchInput}
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={styles.clearButton}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div style={styles.resultText}>
            Showing {filteredBooks.length} of{" "}
            {books.length} books
          </div>

          {filteredBooks.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <BookOpen size={28} />
              </div>

              <h3 style={styles.emptyTitle}>
                No books found
              </h3>

              <p style={styles.emptyText}>
                Try searching with another title,
                author or category.
              </p>
            </div>
          ) : (
            <div style={styles.booksGrid}>
              {filteredBooks.map((book) => {
                const isAvailable =
                  Number(book.availableCopies) > 0;

                return (
                  <div
                    key={book._id}
                    className="book-card"
                    style={styles.bookCard}
                  >
                    <div style={styles.bookTop}>
                      <div style={styles.bookIcon}>
                        <BookOpen size={21} />
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          background: isAvailable
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: isAvailable
                            ? "#15803d"
                            : "#b91c1c",
                          borderColor: isAvailable
                            ? "#bbf7d0"
                            : "#fecaca",
                        }}
                      >
                        <span
                          style={{
                            ...styles.statusDot,
                            background: isAvailable
                              ? "#16a34a"
                              : "#dc2626",
                          }}
                        ></span>

                        {isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    <h3 style={styles.bookTitle}>
                      {book.title}
                    </h3>

                    <div style={styles.authorRow}>
                      <UserRound size={14} />
                      <span>
                        {book.author || "Unknown Author"}
                      </span>
                    </div>

                    <div style={styles.bookDetails}>
                      <InfoRow
                        label="Category"
                        value={
                          book.category || "N/A"
                        }
                      />

                      <InfoRow
                        label="ISBN"
                        value={
                          book.isbn || "N/A"
                        }
                      />

                      <InfoRow
                        label="Total Copies"
                        value={
                          book.totalCopies ?? 0
                        }
                      />

                      <InfoRow
                        label="Available"
                        value={
                          book.availableCopies ?? 0
                        }
                        valueColor={
                          isAvailable
                            ? "#15803d"
                            : "#dc2626"
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ISSUED BOOKS */}
        <section
          className="library-section"
          style={styles.section}
        >
          <div style={styles.sectionHeaderSimple}>
            <div>
              <div style={styles.sectionTitleRow}>
                <div
                  style={{
                    ...styles.sectionIcon,
                    background: "#ede9fe",
                    color: "#7c3aed",
                  }}
                >
                  <Clock3 size={19} />
                </div>

                <h2 style={styles.sectionTitle}>
                  My Issued Books
                </h2>
              </div>

              <p style={styles.sectionSubtitle}>
                Books currently issued to you.
              </p>
            </div>

            <div style={styles.issuedCount}>
              {issuedBooks.length} Record
              {issuedBooks.length !== 1
                ? "s"
                : ""}
            </div>
          </div>

          {issuedBooks.length === 0 ? (
            <div style={styles.emptyState}>
              <div
                style={{
                  ...styles.emptyIcon,
                  background: "#f5f3ff",
                  color: "#7c3aed",
                }}
              >
                <Library size={28} />
              </div>

              <h3 style={styles.emptyTitle}>
                No issued books
              </h3>

              <p style={styles.emptyText}>
                You currently have no books issued
                from the library.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>
                      BOOK
                    </th>
                    <th style={styles.th}>
                      ISSUE DATE
                    </th>
                    <th style={styles.th}>
                      DUE DATE
                    </th>
                    <th style={styles.th}>
                      RETURN DATE
                    </th>
                    <th style={styles.th}>
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {issuedBooks.map(
                    (issue, index) => {
                      const returned =
                        issue.status ===
                        "returned";

                      return (
                        <tr
                          key={issue._id}
                          className="library-row"
                          style={styles.tr}
                        >
                          <td style={styles.td}>
                            <div style={styles.numberBadge}>
                              {index + 1}
                            </div>
                          </td>

                          <td style={styles.td}>
                            <div
                              style={
                                styles.issuedBookCell
                              }
                            >
                              <div
                                style={
                                  styles.smallBookIcon
                                }
                              >
                                <BookOpen
                                  size={17}
                                />
                              </div>

                              <div>
                                <p
                                  style={
                                    styles.issuedBookTitle
                                  }
                                >
                                  {issue.bookId
                                    ?.title ||
                                    "Book unavailable"}
                                </p>

                                <p
                                  style={
                                    styles.issuedBookAuthor
                                  }
                                >
                                  {issue.bookId
                                    ?.author || ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td style={styles.td}>
                            <DateCell
                              date={issue.issueDate}
                              icon={
                                <CalendarDays
                                  size={14}
                                />
                              }
                            />
                          </td>

                          <td style={styles.td}>
                            <DateCell
                              date={issue.dueDate}
                              icon={
                                <Clock3
                                  size={14}
                                />
                              }
                            />
                          </td>

                          <td style={styles.td}>
                            <DateCell
                              date={issue.returnDate}
                              icon={
                                <CheckCircle2
                                  size={14}
                                />
                              }
                            />
                          </td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.issueStatus,
                                background:
                                  returned
                                    ? "#dcfce7"
                                    : "#fef3c7",
                                color: returned
                                  ? "#15803d"
                                  : "#b45309",
                                borderColor:
                                  returned
                                    ? "#bbf7d0"
                                    : "#fde68a",
                              }}
                            >
                              <span
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius:
                                    "50%",
                                  background:
                                    returned
                                      ? "#16a34a"
                                      : "#d97706",
                                }}
                              ></span>

                              {issue.status ||
                                "pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const StatCard = ({
  icon,
  label,
  value,
  iconBackground,
  iconColor,
}) => {
  return (
    <div
      className="library-stat-card"
      style={styles.statCard}
    >
      <div
        style={{
          ...styles.statIcon,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div>
        <p style={styles.statLabel}>{label}</p>

        <h3 style={styles.statValue}>
          {value}
        </h3>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  valueColor,
}) => {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>
        {label}
      </span>

      <span
        style={{
          ...styles.infoValue,
          color: valueColor || "#334155",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const DateCell = ({ date, icon }) => {
  return (
    <div style={styles.dateCell}>
      <span style={styles.dateIcon}>
        {icon}
      </span>

      <span>
        {date
          ? new Date(date).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "-"}
      </span>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#0f172a",
  },

  content: {
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "28px",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    background:
      "linear-gradient(135deg, #0f2d5c 0%, #1555a6 55%, #2563eb 100%)",
    boxShadow:
      "0 16px 40px rgba(15,45,92,0.18)",
  },

  heroCircleOne: {
    position: "absolute",
    width: "250px",
    height: "250px",
    right: "-70px",
    top: "-100px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.08)",
  },

  heroCircleTwo: {
    position: "absolute",
    width: "150px",
    height: "150px",
    right: "180px",
    bottom: "-100px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.05)",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  heroLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    marginBottom: "7px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  heroText: {
    margin: "7px 0 0",
    color: "#dbeafe",
    fontSize: "14px",
  },

  refreshButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    background:
      "rgba(255,255,255,0.12)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "11px 15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 700,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
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
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  statIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
  },

  statValue: {
    margin: "3px 0 0",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 800,
  },

  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "18px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },

  alertClose: {
    marginLeft: "auto",
    border: 0,
    background: "transparent",
    color: "inherit",
    display: "flex",
    cursor: "pointer",
  },

  section: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "22px",
    marginBottom: "22px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "12px",
  },

  sectionHeaderSimple: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  sectionIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  searchBox: {
    width: "330px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "11px",
  },

  searchInput: {
    width: "100%",
    height: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    fontSize: "13px",
    color: "#0f172a",
  },

  clearButton: {
    width: "27px",
    height: "27px",
    border: 0,
    borderRadius: "7px",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  resultText: {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "16px",
  },

  booksGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  bookCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    padding: "18px",
    background: "#ffffff",
  },

  bookTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "14px",
  },

  bookIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "10px",
    fontWeight: 800,
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  bookTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: 800,
    lineHeight: 1.35,
  },

  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "7px",
    color: "#64748b",
    fontSize: "12px",
  },

  bookDetails: {
    marginTop: "17px",
    paddingTop: "14px",
    borderTop: "1px solid #eef2f7",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "6px 0",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  infoValue: {
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "right",
  },

  issuedCount: {
    padding: "7px 11px",
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    background: "#0f274d",
    color: "#dbeafe",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.7px",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #eef2f7",
  },

  td: {
    padding: "14px 16px",
    verticalAlign: "middle",
  },

  numberBadge: {
    width: "29px",
    height: "29px",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
  },

  issuedBookCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  smallBookIcon: {
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

  issuedBookTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 750,
  },

  issuedBookAuthor: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#475569",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  dateIcon: {
    color: "#94a3b8",
    display: "flex",
  },

  issueStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "capitalize",
  },

  emptyState: {
    minHeight: "230px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: 800,
  },

  emptyText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    maxWidth: "400px",
  },

  loadingPage: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7fb",
  },

  loadingSpinner: {
    width: "38px",
    height: "38px",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    marginTop: "12px",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default StudentLibrary;