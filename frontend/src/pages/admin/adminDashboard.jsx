import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  ArrowUpRight,
  Activity,
  LayoutDashboard,
  Info,
  RefreshCw,
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

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
      description: "Registered students",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
      description: "Faculty members",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      description: "Available courses",
    },
    {
      title: "Attendance Records",
      value: stats.totalAttendance,
      icon: ClipboardCheck,
      iconBg: "#f3e8ff",
      iconColor: "#9333ea",
      description: "Recorded attendance",
    },
  ];

  return (
    <div style={styles.page}>
      {/* ================= HERO ================= */}
      <div style={styles.hero} className="admin-hero">
        <div style={styles.heroContent} className="admin-hero-content">
          <div style={styles.heroIcon} className="admin-hero-icon">
            <LayoutDashboard size={26} />
          </div>

          <div className="admin-hero-text">
            <p style={styles.heroLabel}>ADMIN PORTAL</p>

            <h1 style={styles.title}>Admin Dashboard</h1>

            <p style={styles.subtitle}>
              Manage and monitor your college management system
              from one place.
            </p>
          </div>
        </div>

        <button
          style={styles.refreshButton}
          className="admin-refresh"
          onClick={fetchDashboardStats}
          disabled={loading}
          title="Refresh dashboard"
        >
          <RefreshCw
            size={17}
            style={{
              animation: loading
                ? "spin 1s linear infinite"
                : "none",
            }}
          />

          <span>Refresh</span>
        </button>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div style={styles.errorBox} className="admin-error">
          <div>
            <strong>Unable to load dashboard</strong>

            <p>{error}</p>
          </div>

          <button
            style={styles.retryButton}
            className="admin-retry"
            onClick={fetchDashboardStats}
          >
            Retry
          </button>
        </div>
      )}

      {/* ================= SECTION HEADER ================= */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>System Overview</h2>

        <p style={styles.sectionSubtitle}>
          Quick overview of your college data
        </p>
      </div>

      {/* ================= STATISTICS ================= */}
      <div style={styles.statsGrid}>
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              style={styles.statCard}
              className="admin-stat-card"
            >
              <div
                style={{
                  ...styles.iconBox,
                  backgroundColor: card.iconBg,
                }}
              >
                <Icon
                  size={25}
                  color={card.iconColor}
                  strokeWidth={2}
                />
              </div>

              <div style={styles.statContent}>
                <p style={styles.statLabel}>{card.title}</p>

                <h2 style={styles.statNumber}>
                  {loading ? (
                    <span style={styles.loadingNumber}>...</span>
                  ) : (
                    card.value
                  )}
                </h2>

                <p style={styles.statDescription}>
                  {card.description}
                </p>
              </div>

              <div style={styles.arrow}>
                <ArrowUpRight size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div style={styles.bottomGrid} className="admin-bottom-grid">
        {/* ================= RECENT ACTIVITIES ================= */}
        <div style={styles.panel} className="admin-panel">
          <div style={styles.panelHeader}>
            <div style={styles.panelHeaderLeft}>
              <div style={styles.panelIcon}>
                <Activity size={19} />
              </div>

              <div>
                <h3 style={styles.panelTitle}>
                  Recent Activities
                </h3>

                <p style={styles.panelSubtitle}>
                  Latest system activity
                </p>
              </div>
            </div>
          </div>

          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Activity size={25} />
            </div>

            <h4 style={styles.emptyTitle}>
              No recent activities
            </h4>

            <p style={styles.emptyText}>
              Recent system activities will appear here
              when available.
            </p>
          </div>
        </div>

        {/* ================= QUICK INFORMATION ================= */}
        <div style={styles.panel} className="admin-panel">
          <div style={styles.panelHeader}>
            <div style={styles.panelHeaderLeft}>
              <div style={styles.panelIcon}>
                <Info size={19} />
              </div>

              <div>
                <h3 style={styles.panelTitle}>
                  Quick Information
                </h3>

                <p style={styles.panelSubtitle}>
                  Manage your college system
                </p>
              </div>
            </div>
          </div>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoDot,
                  backgroundColor: "#2563eb",
                }}
              />

              <div>
                <strong style={styles.infoTitle}>
                  Students
                </strong>

                <p style={styles.infoDescription}>
                  Manage student records and profiles.
                </p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoDot,
                  backgroundColor: "#16a34a",
                }}
              />

              <div>
                <strong style={styles.infoTitle}>
                  Teachers
                </strong>

                <p style={styles.infoDescription}>
                  Manage faculty and teaching information.
                </p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoDot,
                  backgroundColor: "#d97706",
                }}
              />

              <div>
                <strong style={styles.infoTitle}>
                  Courses
                </strong>

                <p style={styles.infoDescription}>
                  Manage courses and academic information.
                </p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div
                style={{
                  ...styles.infoDot,
                  backgroundColor: "#9333ea",
                }}
              />

              <div>
                <strong style={styles.infoTitle}>
                  Attendance
                </strong>

                <p style={styles.infoDescription}>
                  Monitor attendance records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE CSS ================= */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .admin-stat-card {
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              border-color 0.2s ease;
          }

          .admin-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.09);
            border-color: #cbd5e1 !important;
          }

          .admin-refresh {
            transition: all 0.2s ease;
          }

          .admin-refresh:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.2) !important;
          }

          .admin-refresh:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          /* ================= TABLET ================= */

          @media (max-width: 1000px) {
            .admin-bottom-grid {
              grid-template-columns: 1fr !important;
            }

            .admin-hero {
              padding: 24px !important;
            }

            .admin-stat-card {
              min-width: 0 !important;
            }
          }

          /* ================= MOBILE ================= */

          @media (max-width: 640px) {
            .admin-hero {
              flex-direction: column !important;
              align-items: stretch !important;
              padding: 20px !important;
              border-radius: 16px !important;
              gap: 18px !important;
            }

            .admin-hero-content {
              align-items: flex-start !important;
            }

            .admin-hero-icon {
              width: 46px !important;
              height: 46px !important;
              min-width: 46px !important;
              border-radius: 12px !important;
            }

            .admin-hero-icon svg {
              width: 22px !important;
              height: 22px !important;
            }

            .admin-hero-text {
              min-width: 0 !important;
            }

            .admin-refresh {
              width: 100% !important;
              justify-content: center !important;
              padding: 11px 15px !important;
            }

            .admin-stat-card {
              padding: 18px !important;
              border-radius: 14px !important;
            }

            .admin-panel {
              padding: 18px !important;
              min-height: auto !important;
            }
          }

          /* ================= SMALL MOBILE ================= */

          @media (max-width: 420px) {
            .admin-hero-content {
              gap: 12px !important;
            }

            .admin-stat-card {
              gap: 11px !important;
            }

            .admin-stat-card .admin-stat-icon {
              width: 44px !important;
              height: 44px !important;
              min-width: 44px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  /* ================= PAGE ================= */

  page: {
    width: "100%",
    minHeight: "100%",
    paddingBottom: "30px",
  },

  /* ================= HERO ================= */

  hero: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
    borderRadius: "20px",
    padding: "28px 30px",
    marginBottom: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    color: "#ffffff",
    boxShadow:
      "0 12px 30px rgba(15, 23, 42, 0.14)",
  },

  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    minWidth: 0,
  },

  heroIcon: {
    width: "54px",
    height: "54px",
    minWidth: "54px",
    borderRadius: "15px",
    backgroundColor: "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid rgba(255,255,255,0.18)",
  },

  heroLabel: {
    margin: "0 0 5px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#bfdbfe",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "750",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: "13px",
    color: "#dbeafe",
    lineHeight: 1.5,
  },

  refreshButton: {
    border:
      "1px solid rgba(255,255,255,0.2)",
    backgroundColor:
      "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "10px 15px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    backdropFilter: "blur(8px)",
    flexShrink: 0,
  },

  /* ================= ERROR ================= */

  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },

  retryButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    flexShrink: 0,
  },

  /* ================= SECTION ================= */

  sectionHeader: {
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: "700",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  /* ================= STATS ================= */

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "17px",
    marginBottom: "26px",
  },

  statCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "21px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
    overflow: "hidden",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statContent: {
    minWidth: 0,
    paddingRight: "18px",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  statNumber: {
    margin: "4px 0 2px",
    color: "#0f172a",
    fontSize: "27px",
    fontWeight: "750",
  },

  loadingNumber: {
    color: "#94a3b8",
  },

  statDescription: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },

  arrow: {
    position: "absolute",
    right: "15px",
    top: "15px",
    color: "#94a3b8",
  },

  /* ================= BOTTOM ================= */

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(0, 0.85fr)",
    gap: "20px",
    width: "100%",
  },

  panel: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    minHeight: "270px",
    minWidth: 0,
  },

  panelHeader: {
    display: "flex",
    alignItems: "center",
    paddingBottom: "17px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  panelHeaderLeft: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
  },

  panelIcon: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "11px",
  },

  panelTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "700",
  },

  panelSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  /* ================= EMPTY ================= */

  emptyState: {
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
  },

  emptyIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: 0,
    color: "#334155",
    fontSize: "14px",
  },

  emptyText: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    maxWidth: "300px",
    lineHeight: 1.5,
  },

  /* ================= INFO ================= */

  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingTop: "18px",
  },

  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
  },

  infoDot: {
    width: "8px",
    height: "8px",
    minWidth: "8px",
    borderRadius: "50%",
    marginTop: "5px",
  },

  infoTitle: {
    display: "block",
    color: "#334155",
    fontSize: "13px",
  },

  infoDescription: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: 1.4,
  },
};

export default AdminDashboard;