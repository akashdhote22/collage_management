import { useEffect, useState } from "react";
import api from "../../services/api";

const TeacherTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeacherTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/timetable/teacher");

      setTimetables(response.data.timetables || []);
    } catch (err) {
      console.error("Teacher timetable error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch teacher timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherTimetable();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>My Timetable</h2>
        <p>Loading timetable...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>My Timetable</h2>
          <p style={styles.subtitle}>
            View your assigned lecture schedule
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={fetchTeacherTimetable}
        >
          Refresh
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {!error && timetables.length === 0 && (
        <div style={styles.emptyBox}>
          <p>No timetable assigned to you yet.</p>
        </div>
      )}

      {timetables.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Day</th>
                <th style={styles.th}>Course Code</th>
                <th style={styles.th}>Course Name</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Branch</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Room</th>
              </tr>
            </thead>

            <tbody>
              {timetables.map((item) => (
                <tr key={item._id}>
                  <td style={styles.td}>{item.day}</td>

                  <td style={styles.td}>
                    {item.courseId?.courseCode || "N/A"}
                  </td>

                  <td style={styles.td}>
                    {item.courseId?.courseName || "N/A"}
                  </td>

                  <td style={styles.td}>{item.semester}</td>

                  <td style={styles.td}>{item.branch}</td>

                  <td style={styles.td}>
                    {item.startTime} - {item.endTime}
                  </td>

                  <td style={styles.td}>{item.roomNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "6px",
    color: "#64748b",
  },

  refreshButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    fontSize: "14px",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
  },

  error: {
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    padding: "12px",
    borderRadius: "8px",
  },

  emptyBox: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default TeacherTimetable;