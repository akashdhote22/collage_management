import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import api from "../../services/api";

import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  IndianRupee,
  Bell,
  UserRound,
  Mail,
  Hash,
  Building2,
  Layers,
  Phone,
  LogOut,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingBox}>
          <LoaderCircle
            size={42}
            color="#2563eb"
            style={styles.spinner}
          />

          <h2 style={styles.loadingTitle}>
            Loading Student Dashboard
          </h2>

          <p style={styles.loadingText}>
            Preparing your student portal...
          </p>
        </div>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  const studentName =
    dashboard?.name ||
    user?.name ||
    "Student";

  /* ================= MAIN ================= */

  return (
    <div style={styles.page}>

      {/* ================= HERO HEADER ================= */}

      <div
        className="student-hero"
        style={styles.hero}
      >
        <div
          className="student-hero-content"
          style={styles.heroContent}
        >
          <div style={styles.heroIcon}>
            <GraduationCap size={30} />
          </div>

          <div>
            <div style={styles.portalLabel}>
              STUDENT PORTAL
            </div>

            <h1 style={styles.heroTitle}>
              Welcome back, {studentName}!
            </h1>

            <p style={styles.heroSubtitle}>
              Manage your academic information,
              attendance, courses and college updates.
            </p>
          </div>
        </div>

        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>
            <AlertCircle size={20} />
          </div>

          <div style={styles.errorContent}>
            <strong>
              Unable to load dashboard
            </strong>

            <p>{error}</p>
          </div>

          <button
            style={styles.retryButton}
            onClick={fetchDashboard}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* ================= STATS ================= */}

      <div
        className="student-stats"
        style={styles.statsGrid}
      >

        {/* Courses */}

        <div
          style={{
            ...styles.statCard,
            borderTop: "4px solid #2563eb",
          }}
        >
          <div
            style={{
              ...styles.statIcon,
              background: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <BookOpen size={23} />
          </div>

          <div style={styles.statContent}>
            <span style={styles.statLabel}>
              MY COURSES
            </span>

            <strong style={styles.statValue}>
              {dashboard?.totalCourses ?? 0}
            </strong>

            <span style={styles.statBottom}>
              Assigned courses
            </span>
          </div>
        </div>

        {/* Attendance */}

        <div
          style={{
            ...styles.statCard,
            borderTop: "4px solid #16a34a",
          }}
        >
          <div
            style={{
              ...styles.statIcon,
              background: "#f0fdf4",
              color: "#16a34a",
            }}
          >
            <ClipboardCheck size={23} />
          </div>

          <div style={styles.statContent}>
            <span style={styles.statLabel}>
              ATTENDANCE
            </span>

            <strong style={styles.statValue}>
              {dashboard?.attendancePercentage ?? 0}%
            </strong>

            <span style={styles.statBottom}>
              Attendance percentage
            </span>
          </div>
        </div>

        {/* Fees */}

        <div
          style={{
            ...styles.statCard,
            borderTop: "4px solid #ea580c",
          }}
        >
          <div
            style={{
              ...styles.statIcon,
              background: "#fff7ed",
              color: "#ea580c",
            }}
          >
            <IndianRupee size={23} />
          </div>

          <div style={styles.statContent}>
            <span style={styles.statLabel}>
              PENDING FEES
            </span>

            <strong style={styles.statValue}>
              ₹{dashboard?.pendingFees ?? 0}
            </strong>

            <span style={styles.statBottom}>
              Outstanding amount
            </span>
          </div>
        </div>

        {/* Notices */}

        <div
          style={{
            ...styles.statCard,
            borderTop: "4px solid #7c3aed",
          }}
        >
          <div
            style={{
              ...styles.statIcon,
              background: "#f5f3ff",
              color: "#7c3aed",
            }}
          >
            <Bell size={23} />
          </div>

          <div style={styles.statContent}>
            <span style={styles.statLabel}>
              NOTICES
            </span>

            <strong style={styles.statValue}>
              {dashboard?.totalNotices ?? 0}
            </strong>

            <span style={styles.statBottom}>
              College announcements
            </span>
          </div>
        </div>
      </div>

      {/* ================= CONTENT GRID ================= */}

      <div
        className="student-content"
        style={styles.contentGrid}
      >

        {/* ================= STUDENT INFORMATION ================= */}

        <div style={styles.infoCard}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <UserRound size={21} />
            </div>

            <div>
              <h2 style={styles.sectionTitle}>
                Student Information
              </h2>

              <p style={styles.sectionSubtitle}>
                Your academic profile
              </p>
            </div>
          </div>

          <div
            className="student-info-grid"
            style={styles.infoGrid}
          >

            {/* Name */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                <UserRound size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  NAME
                </span>

                <strong>
                  {dashboard?.name ||
                    user?.name ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* Email */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#f5f3ff",
                  color: "#7c3aed",
                }}
              >
                <Mail size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  EMAIL
                </span>

                <strong>
                  {dashboard?.email ||
                    user?.email ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* Roll Number */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#f0fdf4",
                  color: "#16a34a",
                }}
              >
                <Hash size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  ROLL NUMBER
                </span>

                <strong>
                  {dashboard?.rollNumber ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* Branch */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                <Building2 size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  BRANCH
                </span>

                <strong>
                  {dashboard?.branch ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* Semester */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#ecfeff",
                  color: "#0891b2",
                }}
              >
                <Layers size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  SEMESTER
                </span>

                <strong>
                  {dashboard?.semester ||
                    "N/A"}
                </strong>
              </div>
            </div>

            {/* Phone */}

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoIcon,
                  background: "#fdf2f8",
                  color: "#db2777",
                }}
              >
                <Phone size={18} />
              </div>

              <div style={styles.infoText}>
                <span style={styles.label}>
                  PHONE
                </span>

                <strong>
                  {dashboard?.phone ||
                    "N/A"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PORTAL CARD ================= */}

        <div style={styles.portalCard}>
          <div style={styles.portalTopIcon}>
            <GraduationCap size={27} />
          </div>

          <span style={styles.portalSmallTitle}>
            STUDENT PORTAL
          </span>

          <h2 style={styles.portalTitle}>
            Your Academic Hub
          </h2>

          <p style={styles.portalText}>
            From your student portal, you can keep
            track of your academic activities,
            attendance, fees, timetable and college
            announcements.
          </p>

          <div style={styles.portalFeatures}>
            <div style={styles.portalFeature}>
              <BookOpen size={17} />
              <span>Courses</span>
            </div>

            <div style={styles.portalFeature}>
              <ClipboardCheck size={17} />
              <span>Attendance</span>
            </div>

            <div style={styles.portalFeature}>
              <IndianRupee size={17} />
              <span>Fees</span>
            </div>

            <div style={styles.portalFeature}>
              <Bell size={17} />
              <span>Notices</span>
            </div>
          </div>

          <div style={styles.portalFooter}>
            <span>
              Stay updated with your college
            </span>

            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE ONLY ================= */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          /*
            IMPORTANT:
            Existing desktop UI remains unchanged.
            Only responsive behavior is added below.
          */

          @media (max-width: 1050px) {
            .student-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .student-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .student-hero {
              padding: 24px !important;
            }

            .student-hero-content {
              width: 100%;
            }
          }

          @media (max-width: 650px) {
            .student-stats {
              grid-template-columns: 1fr !important;
            }

            .student-info-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            .student-hero {
              padding: 20px !important;
              border-radius: 18px !important;
            }

            .student-hero-content {
              align-items: flex-start !important;
              gap: 12px !important;
            }

            .student-hero-content > div:last-child {
              min-width: 0;
            }

            .student-hero h1 {
              font-size: 23px !important;
              line-height: 1.25 !important;
              word-break: break-word;
            }

            .student-hero p {
              font-size: 12px !important;
              line-height: 1.5 !important;
            }

            .student-hero button {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .student-hero {
              padding: 17px !important;
            }

            .student-hero-content {
              flex-direction: column !important;
            }

            .student-hero-content > div:last-child {
              width: 100%;
            }

            .student-hero h1 {
              font-size: 21px !important;
            }

            .student-hero-icon {
              width: 52px !important;
              height: 52px !important;
            }
          }

          @media (max-width: 400px) {
            .student-hero h1 {
              font-size: 19px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

/* ================================================= */
/* ===================== STYLES ==================== */
/* ================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "28px",
  },

  /* Hero */

  hero: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.16)",
  },

  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
  },

  heroIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.14)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  portalLabel: {
    color: "#bfdbfe",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    marginBottom: "5px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: 800,
  },

  heroSubtitle: {
    margin: "7px 0 0",
    color: "#dbeafe",
    fontSize: "14px",
  },

  logoutButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    background:
      "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "11px 16px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  /* Error */

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "15px",
    padding: "14px 16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  errorIcon: {
    color: "#dc2626",
  },

  errorContent: {
    flex: 1,
    minWidth: "200px",
    color: "#991b1b",
  },

  errorContentP: {
    margin: 0,
  },

  retryButton: {
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    padding: "9px 14px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  /* Stats */

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "19px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    borderLeft: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
    boxShadow:
      "0 6px 20px rgba(15, 23, 42, 0.05)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statContent: {
    minWidth: 0,
  },

  statLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.7px",
    color: "#94a3b8",
  },

  statValue: {
    display: "block",
    marginTop: "4px",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 800,
  },

  statBottom: {
    display: "block",
    marginTop: "2px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  /* Content */

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.65fr) minmax(300px, 0.85fr)",
    gap: "20px",
    alignItems: "stretch",
  },

  /* Student Info */

  infoCard: {
    background: "#ffffff",
    borderRadius: "21px",
    padding: "23px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 7px 25px rgba(15, 23, 42, 0.06)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  sectionIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background: "#eff6ff",
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
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px",
    borderRadius: "13px",
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    minWidth: 0,
  },

  infoIcon: {
    width: "37px",
    height: "37px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoText: {
    minWidth: 0,
    overflow: "hidden",
  },

  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.6px",
    marginBottom: "3px",
  },

  /* Portal */

  portalCard: {
    borderRadius: "21px",
    padding: "25px",
    color: "#ffffff",
    background:
      "linear-gradient(145deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
    boxShadow:
      "0 12px 30px rgba(37, 99, 235, 0.20)",
    display: "flex",
    flexDirection: "column",
  },

  portalTopIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
  },

  portalSmallTitle: {
    color: "#bfdbfe",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  portalTitle: {
    margin: "7px 0 0",
    fontSize: "23px",
    fontWeight: 800,
  },

  portalText: {
    color: "#dbeafe",
    fontSize: "13px",
    lineHeight: 1.65,
    margin: "12px 0 20px",
  },

  portalFeatures: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "9px",
    marginBottom: "auto",
  },

  portalFeature: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background:
      "rgba(255,255,255,0.10)",
    borderRadius: "10px",
    padding: "10px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 600,
  },

  portalFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "22px",
    paddingTop: "15px",
    borderTop:
      "1px solid rgba(255,255,255,0.15)",
    color: "#dbeafe",
    fontSize: "11px",
  },

  /* Loading */

  loadingBox: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "75px 20px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.06)",
  },

  spinner: {
    margin: "0 auto 15px",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  loadingText: {
    marginTop: "7px",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default StudentDashboard;