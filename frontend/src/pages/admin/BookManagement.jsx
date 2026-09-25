import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Hash,
  Library,
  Plus,
  Search,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

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

  const fetchBooks = async () => {
    try {
      setFetchLoading(true);

      const response = await api.get("/books");

      setBooks(response.data.books || []);
    } catch (err) {
      console.error("Fetch books error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch books"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

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

      await fetchBooks();
    } catch (err) {
      console.error("Add book error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add book"
      );
    } finally {
      setLoading(false);
    }
  };

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

      await fetchBooks();
    } catch (err) {
      console.error("Delete book error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete book"
      );
    }
  };

  const filteredBooks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return books;

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
          .includes(searchText) ||
        book.publisher
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [books, search]);

  const stats = useMemo(() => {
    const totalTitles = books.length;

    const totalCopies = books.reduce(
      (sum, book) =>
        sum + Number(book.totalCopies || 0),
      0
    );

    const availableCopies = books.reduce(
      (sum, book) =>
        sum + Number(book.availableCopies || 0),
      0
    );

    const issuedCopies =
      totalCopies - availableCopies;

    const categories = new Set(
      books
        .map((book) => book.category)
        .filter(Boolean)
    ).size;

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      categories,
    };
  }, [books]);

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 1000px) {
          .book-form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .book-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 650px) {
          .book-form-grid {
            grid-template-columns: 1fr !important;
          }

          .book-stats {
            grid-template-columns: 1fr !important;
          }

          .book-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .book-search {
            width: 100% !important;
          }
        }

        .book-input:focus {
          outline: none;
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .book-row {
          transition: background 0.2s ease;
        }

        .book-row:hover {
          background: #f8fbff;
        }

        .book-submit {
          transition: all 0.2s ease;
        }

        .book-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.22);
        }

        .book-delete {
          transition: all 0.2s ease;
        }

        .book-delete:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* HERO */}
      <div
        style={styles.hero}
        className="book-header"
      >
        <div style={styles.heroLeft}>
          <div style={styles.heroIcon}>
            <Library size={28} />
          </div>

          <div>
            <div style={styles.eyebrow}>
              LIBRARY MANAGEMENT
            </div>

            <h1 style={styles.title}>
              Book Management
            </h1>

            <p style={styles.subtitle}>
              Add, search and manage college
              library books
            </p>
          </div>
        </div>

        <div style={styles.heroBadge}>
          <BookOpen size={16} />
          {books.length} Book Titles
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
        className="book-stats"
        style={styles.statsGrid}
      >
        <StatCard
          icon={<BookOpen size={21} />}
          title="Book Titles"
          value={stats.totalTitles}
          description="Different books"
        />

        <StatCard
          icon={<Library size={21} />}
          title="Total Copies"
          value={stats.totalCopies}
          description="Library inventory"
        />

        <StatCard
          icon={<CheckCircle2 size={21} />}
          title="Available"
          value={stats.availableCopies}
          description="Ready to issue"
        />

        <StatCard
          icon={<UserRound size={21} />}
          title="Issued"
          value={stats.issuedCopies}
          description="Currently issued"
        />
      </div>

      {/* ADD BOOK */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.sectionIcon}>
            <Plus size={20} />
          </div>

          <div>
            <h2 style={styles.cardTitle}>
              Add New Book
            </h2>

            <p style={styles.cardSubtitle}>
              Enter the book information below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="book-form-grid"
            style={styles.formGrid}
          >
            <FormField
              label="Book Title"
              required
              icon={<BookOpen size={16} />}
            >
              <input
                className="book-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Author"
              required
              icon={<UserRound size={16} />}
            >
              <input
                className="book-input"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="ISBN"
              required
              icon={<Hash size={16} />}
            >
              <input
                className="book-input"
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Category"
              required
              icon={<Library size={16} />}
            >
              <input
                className="book-input"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Programming"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Publisher"
              icon={<BookOpen size={16} />}
            >
              <input
                className="book-input"
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher name"
                style={styles.input}
              />
            </FormField>

            <FormField
              label="Total Copies"
              required
              icon={<Library size={16} />}
            >
              <input
                className="book-input"
                type="number"
                name="totalCopies"
                min="1"
                value={formData.totalCopies}
                onChange={handleChange}
                placeholder="Enter total copies"
                style={styles.input}
              />
            </FormField>

            <div
              style={styles.descriptionField}
            >
              <label style={styles.label}>
                <span style={styles.labelIcon}>
                  <BookOpen size={16} />
                </span>

                Description
              </label>

              <textarea
                className="book-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows="4"
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              type="submit"
              disabled={loading}
              className="book-submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.65 : 1,
              }}
            >
              <Plus size={18} />

              {loading
                ? "Adding Book..."
                : "Add Book"}
            </button>
          </div>
        </form>
      </div>

      {/* BOOK LIST */}
      <div style={styles.card}>
        <div
          className="book-header"
          style={styles.listHeader}
        >
          <div>
            <div style={styles.listTitleRow}>
              <div style={styles.smallIcon}>
                <BookOpen size={18} />
              </div>

              <div>
                <h2 style={styles.cardTitle}>
                  All Books
                </h2>

                <p style={styles.cardSubtitle}>
                  {filteredBooks.length} of{" "}
                  {books.length} books displayed
                </p>
              </div>
            </div>
          </div>

          <div
            className="book-search"
            style={styles.searchBox}
          >
            <Search
              size={18}
              color="#64748b"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search title, author, ISBN..."
              style={styles.searchInput}
            />
          </div>
        </div>

        {fetchLoading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>

            <p>Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <BookOpen size={28} />
            </div>

            <strong>
              No books found
            </strong>

            <span>
              Try a different search term or
              add a new book.
            </span>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    #
                  </th>

                  <th style={styles.th}>
                    Book
                  </th>

                  <th style={styles.th}>
                    Author
                  </th>

                  <th style={styles.th}>
                    ISBN
                  </th>

                  <th style={styles.th}>
                    Category
                  </th>

                  <th style={styles.th}>
                    Copies
                  </th>

                  <th style={styles.th}>
                    Available
                  </th>

                  <th style={styles.th}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map(
                  (book, index) => {
                    const isAvailable =
                      Number(
                        book.availableCopies || 0
                      ) > 0;

                    return (
                      <tr
                        key={book._id}
                        className="book-row"
                      >
                        <td style={styles.td}>
                          <span
                            style={styles.indexBadge}
                          >
                            {index + 1}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <div
                            style={
                              styles.bookCell
                            }
                          >
                            <div
                              style={
                                styles.bookIcon
                              }
                            >
                              <BookOpen
                                size={17}
                              />
                            </div>

                            <div>
                              <div
                                style={
                                  styles.primaryText
                                }
                              >
                                {book.title}
                              </div>

                              {book.publisher && (
                                <div
                                  style={
                                    styles.secondaryText
                                  }
                                >
                                  {book.publisher}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <div
                            style={
                              styles.authorText
                            }
                          >
                            {book.author}
                          </div>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={
                              styles.isbnBadge
                            }
                          >
                            {book.isbn}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={
                              styles.categoryBadge
                            }
                          >
                            {book.category}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <strong
                            style={
                              styles.copyNumber
                            }
                          >
                            {book.totalCopies}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={
                              isAvailable
                                ? styles.available
                                : styles.unavailable
                            }
                          >
                            {isAvailable ? (
                              <CheckCircle2
                                size={13}
                              />
                            ) : (
                              <XCircle
                                size={13}
                              />
                            )}

                            {book.availableCopies}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <button
                            onClick={() =>
                              handleDelete(
                                book._id
                              )
                            }
                            className="book-delete"
                            style={
                              styles.deleteButton
                            }
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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
  required,
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

        {required && (
          <span style={styles.required}>
            *
          </span>
        )}
      </label>

      {children}
    </div>
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
    background:
      "rgba(255,255,255,0.14)",
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
    background:
      "rgba(255,255,255,0.12)",
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
      "repeat(2, minmax(0, 1fr))",
    gap: "17px",
    marginTop: "23px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  descriptionField: {
    gridColumn: "1 / -1",
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

  required: {
    color: "#dc2626",
    marginLeft: "-3px",
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

  textarea: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    background: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },

  formActions: {
    display: "flex",
    alignItems: "center",
    marginTop: "21px",
  },

  submitButton: {
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

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  listTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  smallIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  indexBadge: {
    width: "27px",
    height: "27px",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },

  bookCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  bookIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
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

  authorText: {
    color: "#475569",
    fontWeight: "600",
  },

  isbnBadge: {
    display: "inline-block",
    padding: "5px 8px",
    borderRadius: "7px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  categoryBadge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "11px",
    fontWeight: "750",
    whiteSpace: "nowrap",
  },

  copyNumber: {
    color: "#334155",
  },

  available: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "11px",
    fontWeight: "800",
  },

  unavailable: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "11px",
    fontWeight: "800",
  },

  deleteButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 11px",
    border: "none",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "750",
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

  empty: {
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    color: "#64748b",
    fontSize: "13px",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    marginBottom: "5px",
    borderRadius: "15px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default BookManagement;