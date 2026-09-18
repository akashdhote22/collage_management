import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance/student");

      setAttendance(response.data.attendance || []);
    } catch (err) {
      console.error("Fetch student attendance error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalClasses = attendance.length;

  const presentClasses = attendance.filter(
    (item) => item.status === "present"
  ).length;

  const absentClasses = attendance.filter(
    (item) => item.status === "absent"
  ).length;

  const percentage =
    totalClasses > 0
      ? ((presentClasses / totalClasses) * 100).toFixed(2)
      : 0;

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading attendance...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Attendance</h1>
          <p style={styles.subtitle}>
            View your subject-wise attendance records
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchAttendance}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h3>Total Classes</h3>
          <p style={styles.blueValue}>{totalClasses}</p>
        </div>

        <div style={styles.summaryCard}>
          <h3>Present</h3>
          <p style={styles.greenValue}>{presentClasses}</p>
        </div>

        <div style={styles.summaryCard}>
          <h3>Absent</h3>
          <p style={styles.redValue}>{absentClasses}</p>
        </div>

        <div style={styles.summaryCard}>
          <h3>Attendance Percentage</h3>
          <p style={styles.purpleValue}>{percentage}%</p>
        </div>
      </div>

      {!error && attendance.length === 0 && (
        <div style={styles.empty}>
          <h3>No attendance records found</h3>
          <p>Your attendance will appear here after it is marked.</p>
        </div>
      )}

      {attendance.length > 0 && (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Attendance Records</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Course Code</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((item) => (
                  <tr key={item._id}>
                    <td style={styles.td}>
                      {item.courseId?.courseName || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {item.courseId?.courseCode || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          item.status === "present"
                            ? styles.presentBadge
                            : styles.absentBadge
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  summaryCard: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },

  blueValue: {
    color: "#2563eb",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  greenValue: {
    color: "#16a34a",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  redValue: {
    color: "#dc2626",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  purpleValue: {
    color: "#9333ea",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },

  tableContainer: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    overflow: "hidden",
  },

  tableTitle: {
    marginTop: 0,
    color: "#1f2937",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    backgroundColor: "#f3f4f6",
    padding: "14px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
  },

  presentBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    textTransform: "capitalize",
  },

  absentBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    textTransform: "capitalize",
  },
};

export default StudentAttendance;