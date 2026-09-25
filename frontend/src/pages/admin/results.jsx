import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import api from "../../services/api";

const initialForm = {
  studentId: "",
  courseId: "",
  examType: "Unit Test",
  totalMarks: "",
  obtainedMarks: "",
  remarks: "",
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // =========================
  // FETCH RESULTS
  // =========================
  const fetchResults = async () => {
    try {
      const response = await api.get("/results");

      setResults(
        response.data?.results ||
          response.data?.data ||
          response.data ||
          []
      );
    } catch (err) {
      console.error("Results fetch error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch results"
      );
    }
  };

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");

      setStudents(
        response.data?.students ||
          response.data?.data ||
          response.data ||
          []
      );
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  };

  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");

      setCourses(
        response.data?.courses ||
          response.data?.data ||
          response.data ||
          []
      );
    } catch (err) {
      console.error("Courses fetch error:", err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);

      await Promise.all([
        fetchResults(),
        fetchStudents(),
        fetchCourses(),
      ]);

      setPageLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN MODAL
  // =========================
  const openAddModal = () => {
    setFormData(initialForm);
    setMessage("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialForm);
  };

  // =========================
  // ADD RESULT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const totalMarks = Number(formData.totalMarks);
      const obtainedMarks = Number(formData.obtainedMarks);

      if (obtainedMarks > totalMarks) {
        setError(
          "Obtained marks cannot be greater than total marks."
        );
        setLoading(false);
        return;
      }

      await api.post("/results", {
        ...formData,
        totalMarks,
        obtainedMarks,
      });

      setMessage("Result added successfully.");

      setFormData(initialForm);

      await fetchResults();

      setShowModal(false);
    } catch (err) {
      console.error("Add result error:", err);

      setError(
        err.response?.data?.message || "Failed to add result"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE RESULT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/results/${id}`);

      setMessage("Result deleted successfully.");

      await fetchResults();
    } catch (err) {
      console.error("Delete result error:", err);

      setError(
        err.response?.data?.message || "Failed to delete result"
      );
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredResults = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return results;

    return results.filter((result) => {
      const studentName =
        result.studentId?.userId?.name ||
        result.studentId?.name ||
        result.studentId?.rollNumber ||
        "";

      const courseCode =
        result.courseId?.courseCode || "";

      const courseName =
        result.courseId?.courseName || "";

      const examType =
        result.examType || "";

      const grade =
        result.grade || "";

      return (
        studentName.toLowerCase().includes(search) ||
        courseCode.toLowerCase().includes(search) ||
        courseName.toLowerCase().includes(search) ||
        examType.toLowerCase().includes(search) ||
        grade.toLowerCase().includes(search)
      );
    });
  }, [results, searchTerm]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    const total = results.length;

    const passed = results.filter((result) => {
      const percentage = Number(result.percentage || 0);
      return percentage >= 40;
    }).length;

    const failed = total - passed;

    const average =
      total > 0
        ? results.reduce(
            (sum, result) =>
              sum + Number(result.percentage || 0),
            0
          ) / total
        : 0;

    return {
      total,
      passed,
      failed,
      average: average.toFixed(1),
    };
  }, [results]);

  // =========================
  // GRADE STYLE
  // =========================
  const getGradeStyle = (grade) => {
    const value = String(grade || "").toUpperCase();

    if (value === "A+" || value === "A") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (value === "B+" || value === "B") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (value === "C" || value === "D") {
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    }

    return {
      background: "#fee2e2",
      color: "#dc2626",
    };
  };

  return (
    <div style={styles.page}>
      {/* ================= HERO ================= */}
      <div style={styles.hero}>
        <div style={styles.heroGlow}></div>

        <div
          className="results-hero-content"
          style={styles.heroContent}
        >
          <div>
            <div style={styles.eyebrow}>
              <GraduationCap size={15} />
              ACADEMIC ADMINISTRATION
            </div>

            <h1 style={styles.heroTitle}>
              Results Management
            </h1>

            <p style={styles.heroSubtitle}>
              Add, monitor and manage student examination results.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="results-add-button"
            style={styles.addButton}
          >
            <Plus size={19} />
            Add Result
          </button>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      {message && (
        <div style={styles.success}>
          <CheckCircle2 size={18} />
          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            style={styles.messageClose}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            style={styles.messageClose}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ================= STATS ================= */}
      <div
        className="results-stats-grid"
        style={styles.statsGrid}
      >
        <StatCard
          icon={<ClipboardList size={22} />}
          title="Total Results"
          value={stats.total}
          subtitle="Examination records"
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          title="Passed"
          value={stats.passed}
          subtitle="40% and above"
        />

        <StatCard
          icon={<Award size={22} />}
          title="Average"
          value={`${stats.average}%`}
          subtitle="Overall percentage"
        />

        <StatCard
          icon={<Users size={22} />}
          title="Needs Attention"
          value={stats.failed}
          subtitle="Below 40%"
        />
      </div>

      {/* ================= SEARCH ================= */}
      <div style={styles.searchCard}>
        <Search size={20} color="#64748b" />

        <input
          type="text"
          placeholder="Search student, course, exam type or grade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <X size={16} />
          </button>
        )}

        <span style={styles.resultCount}>
          {filteredResults.length}{" "}
          {filteredResults.length === 1
            ? "result"
            : "results"}
        </span>
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h2 style={styles.tableTitle}>
              Examination Results
            </h2>

            <p style={styles.tableSubtitle}>
              View and manage all student results
            </p>
          </div>

          <button
            onClick={fetchResults}
            style={styles.refreshButton}
          >
            Refresh
          </button>
        </div>

        {pageLoading ? (
          <div style={styles.stateContainer}>
            <div style={styles.spinner}></div>
            <p>Loading results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <ClipboardList size={30} />
            </div>

            <h3 style={styles.emptyTitle}>
              No results found
            </h3>

            <p style={styles.emptyText}>
              {searchTerm
                ? "Try changing your search keyword."
                : "No examination results have been added yet."}
            </p>

            {!searchTerm && (
              <button
                onClick={openAddModal}
                style={styles.emptyButton}
              >
                <Plus size={17} />
                Add First Result
              </button>
            )}
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Exam</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Grade</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result) => {
                  const gradeStyle = getGradeStyle(
                    result.grade
                  );

                  return (
                    <tr
                      key={result._id}
                      style={styles.tr}
                    >
                      {/* STUDENT */}
                      <td style={styles.td}>
                        <div style={styles.studentCell}>
                          <div style={styles.avatar}>
                            <GraduationCap size={17} />
                          </div>

                          <div>
                            <div style={styles.studentName}>
                              {result.studentId?.userId?.name ||
                                result.studentId?.name ||
                                "N/A"}
                            </div>

                            <div style={styles.studentRoll}>
                              {result.studentId?.rollNumber ||
                                "Student"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td style={styles.td}>
                        <div style={styles.courseCell}>
                          <BookOpen size={15} />

                          <div>
                            <strong>
                              {result.courseId?.courseCode ||
                                "N/A"}
                            </strong>

                            <span>
                              {result.courseId?.courseName ||
                                "Course"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* EXAM */}
                      <td style={styles.td}>
                        <span style={styles.examBadge}>
                          {result.examType}
                        </span>
                      </td>

                      {/* MARKS */}
                      <td style={styles.td}>
                        <div style={styles.marks}>
                          <strong>
                            {result.obtainedMarks}
                          </strong>

                          <span>
                            / {result.totalMarks}
                          </span>
                        </div>
                      </td>

                      {/* PERCENTAGE */}
                      <td style={styles.td}>
                        <strong style={styles.percentage}>
                          {result.percentage}%
                        </strong>
                      </td>

                      {/* GRADE */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.grade,
                            ...gradeStyle,
                          }}
                        >
                          {result.grade || "N/A"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td style={styles.td}>
                        <button
                          onClick={() =>
                            handleDelete(result._id)
                          }
                          style={styles.deleteButton}
                          title="Delete Result"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ADD RESULT MODAL ================= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* MODAL HEADER */}
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleArea}>
                <div style={styles.modalIcon}>
                  <Award size={21} />
                </div>

                <div>
                  <h2 style={styles.modalTitle}>
                    Add New Result
                  </h2>

                  <p style={styles.modalSubtitle}>
                    Enter examination marks and details
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div
                className="results-form-grid"
                style={styles.formGrid}
              >
                {/* STUDENT */}
                <FormField label="Student">
                  <select
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
                        {student.userId?.name ||
                          student.name ||
                          student.rollNumber ||
                          "Student"}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* COURSE */}
                <FormField label="Course">
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map((course) => (
                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.courseCode} -{" "}
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* EXAM */}
                <FormField label="Exam Type">
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="Unit Test">
                      Unit Test
                    </option>

                    <option value="Mid Term">
                      Mid Term
                    </option>

                    <option value="Final Exam">
                      Final Exam
                    </option>

                    <option value="Practical">
                      Practical
                    </option>
                  </select>
                </FormField>

                {/* TOTAL */}
                <FormField label="Total Marks">
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    placeholder="Enter total marks"
                    min="1"
                    required
                    style={styles.input}
                  />
                </FormField>

                {/* OBTAINED */}
                <FormField label="Obtained Marks">
                  <input
                    type="number"
                    name="obtainedMarks"
                    value={formData.obtainedMarks}
                    onChange={handleChange}
                    placeholder="Enter obtained marks"
                    min="0"
                    required
                    style={styles.input}
                  />
                </FormField>

                {/* REMARKS */}
                <FormField label="Remarks">
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional remarks"
                    style={styles.input}
                  />
                </FormField>
              </div>

              {/* LIVE MARKS PREVIEW */}
              {formData.totalMarks &&
                formData.obtainedMarks && (
                  <div style={styles.preview}>
                    <div>
                      <span style={styles.previewLabel}>
                        Marks Preview
                      </span>

                      <strong style={styles.previewMarks}>
                        {formData.obtainedMarks} /{" "}
                        {formData.totalMarks}
                      </strong>
                    </div>

                    <div style={styles.previewPercentage}>
                      {Math.min(
                        100,
                        (
                          (Number(formData.obtainedMarks) /
                            Number(formData.totalMarks)) *
                          100
                        ).toFixed(1)
                      )}
                      %
                    </div>
                  </div>
                )}

              {/* FOOTER */}
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Result
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes resultSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .results-add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.25);
        }

        @media (max-width: 900px) {
          .results-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 700px) {
          .results-hero-content {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .results-add-button {
            width: 100%;
          }

          .results-form-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .results-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// =========================
// FORM FIELD
// =========================
const FormField = ({ label, children }) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
};

// =========================
// STAT CARD
// =========================
const StatCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div style={styles.statIcon}>{icon}</div>

        <span style={styles.statLabel}>
          {title}
        </span>
      </div>

      <div style={styles.statValue}>{value}</div>

      <div style={styles.statSubtitle}>
        {subtitle}
      </div>
    </div>
  );
};

// =========================
// STYLES
// =========================
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "24px",
    color: "#0f172a",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1d4ed8 100%)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(15, 23, 42, 0.18)",
  },

  heroGlow: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.22)",
    filter: "blur(10px)",
    right: "-90px",
    top: "-120px",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "8px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  heroSubtitle: {
    margin: "8px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: "700",
  },

  error: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "9px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: "700",
  },

  messageClose: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    display: "flex",
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
    borderRadius: "18px",
    padding: "20px",
    boxShadow:
      "0 8px 24px rgba(15, 23, 42, 0.06)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
  },

  statValue: {
    marginTop: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
  },

  statSubtitle: {
    marginTop: "3px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  searchCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px 15px",
    marginBottom: "18px",
    boxShadow:
      "0 6px 20px rgba(15, 23, 42, 0.05)",
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "14px",
  },

  clearButton: {
    width: "30px",
    height: "30px",
    border: "none",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  resultCount: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "7px 11px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 8px 28px rgba(15, 23, 42, 0.06)",
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "20px 22px",
    borderBottom: "1px solid #e2e8f0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
  },

  tableSubtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  refreshButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "9px",
    padding: "8px 13px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "15px 18px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #eef2f7",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px 18px",
    verticalAlign: "middle",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: "180px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #dbeafe, #eff6ff)",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  studentName: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
  },

  studentRoll: {
    marginTop: "3px",
    fontSize: "10px",
    color: "#94a3b8",
  },

  courseCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#2563eb",
  },

  courseCell : {
    display: "flex",
    flexDirection: "column",
  },

  courseCellStrong: {
    fontSize: "12px",
  },

  examBadge: {
    display: "inline-flex",
    padding: "7px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  marks: {
    display: "flex",
    alignItems: "baseline",
    gap: "3px",
    color: "#0f172a",
    fontSize: "13px",
  },

  percentage: {
    color: "#1d4ed8",
    fontSize: "13px",
  },

  grade: {
    display: "inline-flex",
    minWidth: "38px",
    justifyContent: "center",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: "9px",
    padding: "8px 11px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },

  stateContainer: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#64748b",
    fontSize: "14px",
  },

  spinner: {
    width: "34px",
    height: "34px",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation:
      "resultSpin 0.8s linear infinite",
  },

  emptyState: {
    minHeight: "330px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
  },

  emptyIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
  },

  emptyTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },

  emptyText: {
    margin: "7px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  emptyButton: {
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 15px",
    borderRadius: "9px",
    fontWeight: "700",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.68)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },

  modal: {
    width: "100%",
    maxWidth: "720px",
    maxHeight: "94vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 30px 80px rgba(0, 0, 0, 0.25)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "21px 22px",
    borderBottom: "1px solid #e2e8f0",
  },

  modalTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  modalIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
  },

  modalSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  closeButton: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  form: {
    padding: "22px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "17px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    color: "#334155",
    fontSize: "12px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "11px 12px",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
  },

  preview: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #eff6ff, #f8fafc)",
    border: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewLabel: {
    display: "block",
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  previewMarks: {
    display: "block",
    marginTop: "4px",
    color: "#0f172a",
    fontSize: "16px",
  },

  previewPercentage: {
    color: "#2563eb",
    fontSize: "24px",
    fontWeight: "800",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "18px",
    marginTop: "20px",
  },

  cancelButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  submitButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 17px",
    fontSize: "13px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    boxShadow:
      "0 8px 18px rgba(37, 99, 235, 0.22)",
  },
};

export default Results;