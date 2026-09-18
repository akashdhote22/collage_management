import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import api from "../../services/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Backend route: GET /api/students/dashboard
      const response = await api.get("/students/dashboard");

      setDashboard(response.data.student);
    } catch (err) {
      console.error("Student dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch student dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Student Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Student Dashboard</h2>

          <p style={styles.subtitle}>
            Welcome, {dashboard?.name || user?.name || "Student"}!
          </p>
        </div>

        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{error}</p>

          <button
            style={styles.retryButton}
            onClick={fetchDashboard}
          >
            Retry
          </button>
        </div>
      )}

      {/* Dashboard Cards */}
      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>My Courses</h3>
          <p style={styles.cardValue}>
            {dashboard?.totalCourses ?? 0}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Attendance</h3>
          <p style={styles.cardValue}>
            {dashboard?.attendancePercentage ?? 0}%
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Pending Fees</h3>
          <p style={styles.cardValue}>
            ₹{dashboard?.pendingFees ?? 0}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Notices</h3>
          <p style={styles.cardValue}>
            {dashboard?.totalNotices ?? 0}
          </p>
        </div>
      </div>

      {/* Student Information */}
      <div style={styles.infoCard}>
        <h3 style={styles.sectionTitle}>
          Student Information
        </h3>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.label}>Name</span>
            <strong>
              {dashboard?.name || user?.name || "N/A"}
            </strong>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Email</span>
            <strong>
              {dashboard?.email || user?.email || "N/A"}
            </strong>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Roll Number</span>
            <strong>{dashboard?.rollNumber || "N/A"}</strong>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Branch</span>
            <strong>{dashboard?.branch || "N/A"}</strong>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Semester</span>
            <strong>{dashboard?.semester || "N/A"}</strong>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Phone</span>
            <strong>{dashboard?.phone || "N/A"}</strong>
          </div>
        </div>
      </div>

      {/* Welcome Box */}
      <div style={styles.welcomeBox}>
        <h3 style={styles.sectionTitle}>Student Portal</h3>

        <p style={styles.welcomeText}>
          From this portal, you will be able to view your courses,
          attendance, fees, results, timetable and college notices.
        </p>
      </div>
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
    fontSize: "16px",
  },

  logoutButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    borderTop: "4px solid #2563eb",
  },

  cardTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
  },

  cardValue: {
    margin: "12px 0 0",
    color: "#0f172a",
    fontSize: "30px",
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    marginBottom: "24px",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#0f172a",
    fontSize: "20px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    color: "#334155",
  },

  label: {
    color: "#64748b",
    fontSize: "13px",
  },

  welcomeBox: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },

  welcomeText: {
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: 0,
  },

  errorBox: {
    backgroundColor: "#fee2e2",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  error: {
    color: "#dc2626",
    margin: "0 0 10px",
  },

  retryButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default StudentDashboard;