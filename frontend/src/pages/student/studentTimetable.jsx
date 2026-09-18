import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/timetable/student");

      setTimetable(response.data.timetable || []);
    } catch (err) {
      console.error("Fetch student timetable error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading timetable...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Timetable</h1>
          <p style={styles.subtitle}>
            View your weekly class schedule
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchTimetable}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {!error && timetable.length === 0 && (
        <div style={styles.empty}>
          <h3>No timetable found</h3>
          <p>Your class schedule will appear here once it is assigned.</p>
        </div>
      )}

      {timetable.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Day</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Teacher</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Room</th>
              </tr>
            </thead>

            <tbody>
              {timetable.map((item) => (
                <tr key={item._id}>
                  <td style={styles.td}>
                    <span style={styles.dayBadge}>
                      {item.day || "N/A"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <strong>
                      {item.courseId?.courseName || "Unknown Course"}
                    </strong>
                    <br />
                    <small>
                      {item.courseId?.courseCode || "N/A"}
                    </small>
                  </td>

                  <td style={styles.td}>
                    {item.teacherId?.userId?.name ||
                      item.teacherId?.name ||
                      "Not Assigned"}
                  </td>

                  <td style={styles.td}>
                    {item.startTime || "N/A"} - {item.endTime || "N/A"}
                  </td>

                  <td style={styles.td}>
                    {item.roomNumber || "N/A"}
                  </td>
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

  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    minWidth: "750px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    borderBottom: "1px solid #dbeafe",
    fontSize: "14px",
  },

  td: {
    padding: "16px 14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
  },

  dayBadge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default StudentTimetable;