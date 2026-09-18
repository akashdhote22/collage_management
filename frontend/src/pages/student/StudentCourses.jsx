import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students/courses");

      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Fetch student courses error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading courses...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Courses</h1>
          <p style={styles.subtitle}>
            View your enrolled and assigned courses
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchCourses}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {!error && courses.length === 0 && (
        <div style={styles.empty}>
          <h3>No courses found</h3>
          <p>Your courses will appear here once they are assigned.</p>
        </div>
      )}

      <div style={styles.grid}>
        {courses.map((course) => (
          <div key={course._id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.code}>
                {course.courseCode || "N/A"}
              </span>

              <span style={styles.semester}>
                Semester {course.semester || "N/A"}
              </span>
            </div>

            <h2 style={styles.courseName}>
              {course.courseName || "Unnamed Course"}
            </h2>

            <p style={styles.description}>
              {course.description || "No description available"}
            </p>

            <div style={styles.details}>
              <p>
                <strong>Department:</strong>{" "}
                {course.department || "N/A"}
              </p>

              <p>
                <strong>Credits:</strong>{" "}
                {course.credits || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  code: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  semester: {
    color: "#6b7280",
    fontSize: "13px",
  },

  courseName: {
    margin: "0 0 12px",
    fontSize: "20px",
    color: "#111827",
  },

  description: {
    color: "#6b7280",
    minHeight: "45px",
    lineHeight: "1.5",
  },

  details: {
    borderTop: "1px solid #e5e7eb",
    marginTop: "18px",
    paddingTop: "12px",
    color: "#374151",
    fontSize: "14px",
  },
};

export default StudentCourses;