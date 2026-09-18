import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalAttendance: 0,
  });
 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      const dashboardStats = response.data.stats;

      setStats({
        totalStudents: dashboardStats?.totalStudents || 0,
        totalTeachers: dashboardStats?.totalTeachers || 0,
        totalCourses: dashboardStats?.totalCourses || 0,
        totalAttendance: dashboardStats?.totalAttendance || 0,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Overview of your college management system
          </p>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.statsGrid}>
        {/* Students */}
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.iconBox,
              backgroundColor: "#dbeafe",
            }}
          >
            <Users size={25} color="#2563eb" />
          </div>

          <div>
            <p style={styles.statLabel}>Total Students</p>
            <h2 style={styles.statNumber}>
              {loading ? "..." : stats.totalStudents}
            </h2>
          </div>
        </div>

        {/* Teachers */}
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.iconBox,
              backgroundColor: "#dcfce7",
            }}
          >
            <GraduationCap size={25} color="#16a34a" />
          </div>

          <div>
            <p style={styles.statLabel}>Total Teachers</p>
            <h2 style={styles.statNumber}>
              {loading ? "..." : stats.totalTeachers}
            </h2>
          </div>
        </div>

        {/* Courses */}
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.iconBox,
              backgroundColor: "#fef3c7",
            }}
          >
            <BookOpen size={25} color="#d97706" />
          </div>

          <div>
            <p style={styles.statLabel}>Total Courses</p>
            <h2 style={styles.statNumber}>
              {loading ? "..." : stats.totalCourses}
            </h2>
          </div>
        </div>

        {/* Attendance */}
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.iconBox,
              backgroundColor: "#f3e8ff",
            }}
          >
            <ClipboardCheck size={25} color="#9333ea" />
          </div>

          <div>
            <p style={styles.statLabel}>Attendance Records</p>
            <h2 style={styles.statNumber}>
              {loading ? "..." : stats.totalAttendance}
            </h2>
          </div>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Recent Activities</h3>

          <p style={styles.emptyText}>
            No recent activities available.
          </p>
        </div>

        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Quick Information</h3>

          <p style={styles.infoText}>
            Use the sidebar to manage students, teachers, courses,
            attendance, fees, timetable and notices.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "14px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  statNumber: {
    margin: "6px 0 0",
    fontSize: "26px",
    color: "#111827",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  panel: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    minHeight: "180px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },

  emptyText: {
    marginTop: "30px",
    color: "#9ca3af",
    textAlign: "center",
  },

  infoText: {
    marginTop: "20px",
    color: "#6b7280",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default AdminDashboard;