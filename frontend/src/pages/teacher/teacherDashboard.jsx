import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Megaphone,
  Users,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import api from "../../services/api";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAttendance: 0,
    totalNotices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/teachers/dashboard");
        const data = response.data;

        setStats({
          totalCourses: data.stats?.totalCourses || 0,
          totalStudents: data.stats?.totalStudents || 0,
          totalAttendance: data.stats?.totalAttendance || 0,
          totalNotices: data.stats?.totalNotices || 0,
        });
      } catch (error) {
        console.error("Teacher dashboard error:", error);

        setStats({
          totalCourses: 0,
          totalStudents: 0,
          totalAttendance: 0,
          totalNotices: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Assigned Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "#2563eb",
      light: "#eff6ff",
      border: "#dbeafe",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "#7c3aed",
      light: "#f5f3ff",
      border: "#ede9fe",
    },
    {
      title: "Attendance Records",
      value: stats.totalAttendance,
      icon: ClipboardCheck,
      color: "#059669",
      light: "#ecfdf5",
      border: "#d1fae5",
    },
    {
      title: "Active Notices",
      value: stats.totalNotices,
      icon: Megaphone,
      color: "#ea580c",
      light: "#fff7ed",
      border: "#fed7aa",
    },
  ];

  const quickActions = [
    {
      title: "Mark Attendance",
      description: "Record student attendance",
      icon: ClipboardCheck,
      path: "/teacher/attendance",
      color: "#2563eb",
      light: "#eff6ff",
    },
    {
      title: "View Courses",
      description: "Check assigned courses",
      icon: BookOpen,
      path: "/teacher/courses",
      color: "#7c3aed",
      light: "#f5f3ff",
    },
    {
      title: "View Timetable",
      description: "Check teaching schedule",
      icon: CalendarDays,
      path: "/teacher/timetable",
      color: "#059669",
      light: "#ecfdf5",
    },
    {
      title: "View Notices",
      description: "Read latest notices",
      icon: Megaphone,
      path: "/teacher/notices",
      color: "#ea580c",
      light: "#fff7ed",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "32px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "60px 20px",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #2563eb",
              borderRadius: "50%",
              margin: "0 auto 18px",
              animation: "spin 1s linear infinite",
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Loading Dashboard...
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Please wait while we load your teaching data.
          </p>

          <style>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      className="teacher-dashboard"
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "28px",
        color: "#0f172a",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        className="teacher-dashboard-header"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          borderRadius: "24px",
          padding: "32px",
          marginBottom: "24px",
          color: "#ffffff",
          boxShadow: "0 12px 35px rgba(15, 23, 42, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              className="teacher-dashboard-header-icon"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={24} />
            </div>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                opacity: 0.85,
              }}
            >
              FACULTY PORTAL
            </span>
          </div>

          <h1
            className="teacher-dashboard-title"
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: 1.2,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            Teacher Dashboard
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              color: "#dbeafe",
            }}
          >
            Manage your teaching activities and stay updated.
          </p>
        </div>

        <div
          className="teacher-academic-box"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "16px 20px",
            minWidth: "180px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#bfdbfe",
            }}
          >
            ACADEMIC
          </p>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "15px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Overview
          </p>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div
        className="teacher-dashboard-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              style={{
                background: "#ffffff",
                border: `1px solid ${card.border}`,
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
                minHeight: "150px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </p>

                  <h2
                    style={{
                      margin: "14px 0 3px",
                      fontSize: "34px",
                      lineHeight: 1,
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {card.value}
                  </h2>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    Current total
                  </span>
                </div>

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: card.light,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
              </div>

              <div
                style={{
                  height: "4px",
                  borderRadius: "10px",
                  background: card.color,
                  marginTop: "20px",
                  opacity: 0.8,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ================= MAIN ROW ================= */}

      <div
        className="teacher-dashboard-main"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {/* ================= QUICK ACTIONS ================= */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
              gap: "12px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Quick Actions
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Frequently used teaching tools
              </p>
            </div>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ArrowUpRight size={21} />
            </div>
          </div>

          <div
            className="teacher-quick-actions"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  onClick={() => {
                    window.location.href = action.path;
                  }}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px",
                    background: action.light,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    minWidth: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(15,23,42,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      flexShrink: 0,
                      borderRadius: "13px",
                      background: "#ffffff",
                      color: action.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 3px 10px rgba(15,23,42,0.06)",
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#1e293b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {action.title}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "4px",
                        lineHeight: 1.4,
                      }}
                    >
                      {action.description}
                    </div>
                  </div>

                  <ArrowUpRight
                    size={18}
                    color="#94a3b8"
                    style={{ flexShrink: 0 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= TEACHING OVERVIEW ================= */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "13px",
                background: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClipboardCheck size={22} />
            </div>

            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Teaching Overview
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Your academic summary
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              {
                label: "Assigned Courses",
                value: stats.totalCourses,
                color: "#2563eb",
                bg: "#eff6ff",
              },
              {
                label: "Students Under Guidance",
                value: stats.totalStudents,
                color: "#7c3aed",
                bg: "#f5f3ff",
              },
              {
                label: "Attendance Entries",
                value: stats.totalAttendance,
                color: "#059669",
                bg: "#ecfdf5",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderRadius: "14px",
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#475569",
                    minWidth: 0,
                  }}
                >
                  {item.label}
                </span>

                <span
                  style={{
                    minWidth: "42px",
                    height: "34px",
                    padding: "0 10px",
                    borderRadius: "10px",
                    background: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Notice mini card */}

          <div
            style={{
              marginTop: "18px",
              padding: "15px",
              borderRadius: "14px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Megaphone size={19} />
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#9a3412",
                  fontWeight: 600,
                }}
              >
                Active Notices
              </p>

              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "18px",
                  color: "#7c2d12",
                  fontWeight: 800,
                }}
              >
                {stats.totalNotices}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE ================= */}

      <style>{`
        /* Tablet */

        @media (max-width: 1100px) {
          .teacher-dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .teacher-dashboard-main {
            grid-template-columns: 1fr !important;
          }
        }

        /* Small Tablet */

        @media (max-width: 900px) {
          .teacher-dashboard {
            padding: 22px !important;
          }

          .teacher-dashboard-header {
            padding: 28px !important;
          }

          .teacher-dashboard-title {
            font-size: 32px !important;
          }
        }

        /* Mobile */

        @media (max-width: 700px) {
          .teacher-dashboard {
            padding: 16px !important;
          }

          .teacher-dashboard-header {
            padding: 22px !important;
            border-radius: 20px !important;
            margin-bottom: 18px !important;
          }

          .teacher-dashboard-title {
            font-size: 28px !important;
          }

          .teacher-dashboard-stats {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            margin-bottom: 18px !important;
          }

          .teacher-dashboard-main {
            gap: 16px !important;
          }

          .teacher-quick-actions {
            grid-template-columns: 1fr !important;
          }
        }

        /* Small Mobile */

        @media (max-width: 500px) {
          .teacher-dashboard {
            padding: 12px !important;
          }

          .teacher-dashboard-header {
            padding: 18px !important;
            border-radius: 18px !important;
          }

          .teacher-dashboard-header-icon {
            width: 38px !important;
            height: 38px !important;
          }

          .teacher-dashboard-title {
            font-size: 24px !important;
            line-height: 1.25 !important;
            word-break: break-word;
          }

          .teacher-dashboard-header p {
            font-size: 13px !important;
            line-height: 1.5 !important;
          }

          .teacher-academic-box {
            width: 100% !important;
            min-width: 0 !important;
          }

          .teacher-dashboard-stats > div {
            min-height: auto !important;
            padding: 18px !important;
          }

          .teacher-dashboard-stats h2 {
            font-size: 30px !important;
          }

          .teacher-dashboard-main > div {
            padding: 18px !important;
            border-radius: 18px !important;
          }

          .teacher-quick-actions {
            grid-template-columns: 1fr !important;
          }
        }

        /* Very Small Mobile */

        @media (max-width: 380px) {
          .teacher-dashboard-title {
            font-size: 21px !important;
          }

          .teacher-dashboard-header {
            padding: 16px !important;
          }

          .teacher-dashboard-stats > div {
            padding: 16px !important;
          }

          .teacher-dashboard-main > div {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;