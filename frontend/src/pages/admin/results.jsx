import { useEffect, useState } from "react";
import api from "../../services/api";

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    examType: "Unit Test",
    totalMarks: "",
    obtainedMarks: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchResults = async () => {
    try {
      const response = await api.get("/results");
      setResults(response.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.students || []);
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Courses fetch error:", err);
    }
  };

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchCourses();
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
      await api.post("/results", {
        ...formData,
        totalMarks: Number(formData.totalMarks),
        obtainedMarks: Number(formData.obtainedMarks),
      });

      setMessage("Result added successfully");

      setFormData({
        studentId: "",
        courseId: "",
        examType: "Unit Test",
        totalMarks: "",
        obtainedMarks: "",
        remarks: "",
      });

      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add result");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/results/${id}`);
      setMessage("Result deleted successfully");
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete result");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Results Management</h1>
          <p style={styles.subtitle}>
            Add and manage student examination results
          </p>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add New Result</h2>

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
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Course</option>

                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Exam Type</label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="Unit Test">Unit Test</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Practical">Practical</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Total Marks</label>
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
            </div>

            <div style={styles.formGroup}>
              <label>Obtained Marks</label>
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
            </div>

            <div style={styles.formGroup}>
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Optional remarks"
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Add Result"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>All Results</h2>

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
              {results.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.empty}>
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id}>
                    <td style={styles.td}>
                      {result.studentId?.userId?.name ||
                        result.studentId?.rollNumber ||
                        "N/A"}
                    </td>

                    <td style={styles.td}>
                      {result.courseId?.courseCode || "N/A"}
                      <br />
                      <small>{result.courseId?.courseName}</small>
                    </td>

                    <td style={styles.td}>{result.examType}</td>

                    <td style={styles.td}>
                      {result.obtainedMarks} / {result.totalMarks}
                    </td>

                    <td style={styles.td}>{result.percentage}%</td>

                    <td style={styles.td}>
                      <span style={styles.grade}>{result.grade}</span>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(result._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    minWidth: "750px",
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
  grade: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "7px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};

export default Results;