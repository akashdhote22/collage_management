import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  CalendarDays,
  RefreshCw,
  Clock3,
  MapPin,
  BookOpen,
  GraduationCap,
  Building2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

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

  // ================= LOADING =================

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
            Loading Timetable
          </h2>

          <p style={styles.loadingText}>
            Fetching your lecture schedule...
          </p>
        </div>

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
    );
  }

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <div style={styles.portalLabel}>
            <div style={styles.portalIcon}>
              <CalendarDays size={21} />
            </div>

            <span>FACULTY PORTAL</span>
          </div>

          <h1 style={styles.title}>
            My Timetable
          </h1>

          <p style={styles.subtitle}>
            View your assigned lecture schedule and
            classroom details.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={fetchTeacherTimetable}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div style={styles.error}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      {!error && timetables.length > 0 && (
        <div
          className="timetable-summary"
          style={styles.summaryGrid}
        >
          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <CalendarDays size={21} />
            </div>

            <div>
              <span style={styles.summaryLabel}>
                TOTAL LECTURES
              </span>

              <strong style={styles.summaryValue}>
                {timetables.length}
              </strong>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <BookOpen size={21} />
            </div>

            <div>
              <span style={styles.summaryLabel}>
                ASSIGNED SCHEDULE
              </span>

              <strong style={styles.summaryValue}>
                {timetables.length} Classes
              </strong>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#fff7ed",
                color: "#ea580c",
              }}
            >
              <Clock3 size={21} />
            </div>

            <div>
              <span style={styles.summaryLabel}>
                SCHEDULE
              </span>

              <strong style={styles.summaryValue}>
                Weekly
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!error && timetables.length === 0 && (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>
            <CalendarDays size={32} />
          </div>

          <h2 style={styles.emptyTitle}>
            No Timetable Assigned
          </h2>

          <p style={styles.emptyText}>
            No lecture schedule has been assigned to
            you yet. Your timetable will appear here
            once it is configured.
          </p>

          <button
            style={styles.emptyButton}
            onClick={fetchTeacherTimetable}
          >
            <RefreshCw size={16} />
            Check Again
          </button>
        </div>
      )}

      {/* ================= TABLE SECTION ================= */}

      {!error && timetables.length > 0 && (
        <div style={styles.tableCard}>
          {/* Table Header */}

          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>
                Lecture Schedule
              </h2>

              <p style={styles.tableSubtitle}>
                Your assigned classes and classroom
                information
              </p>
            </div>

            <div style={styles.classCount}>
              {timetables.length}{" "}
              {timetables.length === 1
                ? "Lecture"
                : "Lectures"}
            </div>
          </div>

          {/* Table */}

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>DAY</th>
                  <th style={styles.th}>COURSE</th>
                  <th style={styles.th}>SEMESTER</th>
                  <th style={styles.th}>BRANCH</th>
                  <th style={styles.th}>TIME</th>
                  <th style={styles.th}>ROOM</th>
                </tr>
              </thead>

              <tbody>
                {timetables.map((item) => (
                  <tr
                    key={item._id}
                    style={styles.tr}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background =
                        "#f8fafc";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background =
                        "#ffffff";
                    }}
                  >
                    {/* DAY */}

                    <td style={styles.td}>
                      <div style={styles.dayBox}>
                        <CalendarDays size={17} />

                        <span>
                          {item.day || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* COURSE */}

                    <td style={styles.td}>
                      <div style={styles.courseBox}>
                        <div style={styles.courseIcon}>
                          <BookOpen size={18} />
                        </div>

                        <div>
                          <div style={styles.courseCode}>
                            {item.courseId?.courseCode ||
                              "N/A"}
                          </div>

                          <div style={styles.courseName}>
                            {item.courseId?.courseName ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SEMESTER */}

                    <td style={styles.td}>
                      <span style={styles.semesterBadge}>
                        <GraduationCap size={14} />
                        Sem {item.semester}
                      </span>
                    </td>

                    {/* BRANCH */}

                    <td style={styles.td}>
                      <div style={styles.branchBox}>
                        <Building2 size={15} />

                        <span>
                          {item.branch || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* TIME */}

                    <td style={styles.td}>
                      <div style={styles.timeBox}>
                        <Clock3 size={16} />

                        <span>
                          {item.startTime || "--"} -{" "}
                          {item.endTime || "--"}
                        </span>
                      </div>
                    </td>

                    {/* ROOM */}

                    <td style={styles.td}>
                      <span style={styles.roomBadge}>
                        <MapPin size={14} />

                        {item.roomNumber || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Hint */}

          <div style={styles.scrollHint}>
            <span>
              ← Scroll horizontally to view the
              complete schedule →
            </span>
          </div>
        </div>
      )}

      {/* ================= RESPONSIVE ================= */}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1000px) {
          .timetable-page {
            padding: 22px !important;
          }

          .timetable-summary {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
          }

          .timetable-header {
            padding: 26px !important;
          }

          .timetable-title {
            font-size: 29px !important;
          }
        }

        @media (max-width: 800px) {
          .timetable-summary {
            grid-template-columns: 1fr !important;
          }

          .timetable-page {
            padding: 18px !important;
          }

          .timetable-header {
            padding: 23px !important;
          }

          .timetable-title {
            font-size: 27px !important;
          }

          .timetable-refresh {
            width: 100% !important;
            justify-content: center !important;
          }

          .timetable-table-header {
            padding: 18px !important;
          }
        }

        @media (max-width: 600px) {
          .timetable-page {
            padding: 14px !important;
          }

          .timetable-header {
            border-radius: 19px !important;
            padding: 20px !important;
          }

          .timetable-title {
            font-size: 24px !important;
          }

          .timetable-subtitle {
            font-size: 13px !important;
          }

          .timetable-summary-card {
            padding: 15px !important;
          }

          .timetable-table-card {
            border-radius: 17px !important;
          }

          .timetable-table-header {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .timetable-class-count {
            align-self: flex-start !important;
          }

          .timetable-empty {
            padding: 50px 18px !important;
          }
        }

        @media (max-width: 420px) {
          .timetable-page {
            padding: 10px !important;
          }

          .timetable-header {
            padding: 17px !important;
          }

          .timetable-title {
            font-size: 21px !important;
          }

          .timetable-portal-icon {
            width: 39px !important;
            height: 39px !important;
          }

          .timetable-summary-card {
            padding: 14px !important;
          }

          .timetable-summary-icon {
            width: 42px !important;
            height: 42px !important;
          }

          .timetable-table-title {
            font-size: 17px !important;
          }

          .timetable-table-subtitle {
            font-size: 12px !important;
          }
        }

        @media (max-width: 360px) {
          .timetable-page {
            padding: 8px !important;
          }

          .timetable-header {
            padding: 15px !important;
          }

          .timetable-title {
            font-size: 20px !important;
          }

          .timetable-header-subtitle {
            font-size: 12px !important;
          }

          .timetable-empty {
            padding: 42px 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

// =================================================
// ===================== STYLES =====================
// =================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "28px",
  },

  header: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    color: "#ffffff",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.16)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  portalLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#bfdbfe",
  },

  portalIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    color: "#ffffff",
  },

  subtitle: {
    margin: "8px 0 0",
    fontSize: "14px",
    color: "#dbeafe",
  },

  refreshButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "12px 17px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "24px",
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 6px 20px rgba(15, 23, 42, 0.05)",
  },

  summaryIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  summaryLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    color: "#94a3b8",
    letterSpacing: "0.6px",
  },

  summaryValue: {
    display: "block",
    marginTop: "4px",
    fontSize: "15px",
    fontWeight: 800,
    color: "#1e293b",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 7px 25px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "21px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    borderBottom: "1px solid #e2e8f0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 800,
    color: "#0f172a",
  },

  tableSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  classCount: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "7px 13px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },

  tableWrapper: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "950px",
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.7px",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  tr: {
    background: "#ffffff",
    transition: "background 0.15s ease",
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  dayBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "8px 11px",
    borderRadius: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  courseBox: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: "210px",
  },

  courseIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "11px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  courseCode: {
    fontSize: "11px",
    color: "#4f46e5",
    fontWeight: 800,
    marginBottom: "3px",
  },

  courseName: {
    fontSize: "13px",
    color: "#1e293b",
    fontWeight: 700,
    maxWidth: "210px",
  },

  semesterBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#f0fdf4",
    color: "#15803d",
    padding: "7px 10px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  branchBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#475569",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  timeBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#475569",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  roomBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#fff7ed",
    color: "#c2410c",
    padding: "7px 10px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  emptyBox: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "70px 25px",
    textAlign: "center",
    border: "2px dashed #cbd5e1",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#1e293b",
  },

  emptyText: {
    margin: "8px auto 20px",
    maxWidth: "480px",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#64748b",
  },

  emptyButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
  },

  loadingBox: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "70px 20px",
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
    fontSize: "14px",
    color: "#64748b",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px 18px",
    marginBottom: "20px",
    borderRadius: "15px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 600,
  },

  scrollHint: {
    padding: "10px",
    textAlign: "center",
    background: "#f8fafc",
    color: "#94a3b8",
    fontSize: "11px",
    borderTop: "1px solid #e2e8f0",
  },
};

export default TeacherTimetable;