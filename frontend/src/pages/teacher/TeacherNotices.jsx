import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Megaphone,
  RefreshCw,
  CalendarDays,
  Clock3,
  Users,
  AlertCircle,
  Bell,
  LoaderCircle,
} from "lucide-react";

const TeacherNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notices");
      setNotices(response.data.notices || []);
    } catch (err) {
      console.error("Teacher notices error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch notices"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
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
            Loading Notices
          </h2>

          <p style={styles.loadingText}>
            Fetching college announcements...
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
              <Megaphone size={21} />
            </div>

            <span>FACULTY PORTAL</span>
          </div>

          <h1 style={styles.title}>
            College Notices
          </h1>

          <p style={styles.subtitle}>
            Stay updated with important college
            announcements and notices.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={fetchNotices}
          disabled={loading}
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

      {/* ================= TOP INFO ================= */}

      {!error && (
        <div className="notice-info-row" style={styles.infoRow}>
          <div style={styles.infoCard}>
            <div
              style={{
                ...styles.infoIcon,
                background: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Bell size={21} />
            </div>

            <div>
              <span style={styles.infoLabel}>
                TOTAL NOTICES
              </span>

              <strong style={styles.infoValue}>
                {notices.length}
              </strong>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div
              style={{
                ...styles.infoIcon,
                background: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              <Megaphone size={21} />
            </div>

            <div>
              <span style={styles.infoLabel}>
                ANNOUNCEMENTS
              </span>

              <strong style={styles.infoValue}>
                College Updates
              </strong>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div
              style={{
                ...styles.infoIcon,
                background: "#fff7ed",
                color: "#ea580c",
              }}
            >
              <Users size={21} />
            </div>

            <div>
              <span style={styles.infoLabel}>
                AUDIENCE
              </span>

              <strong style={styles.infoValue}>
                Faculty & Students
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!error && notices.length === 0 && (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>
            <Bell size={32} />
          </div>

          <h2 style={styles.emptyTitle}>
            No Notices Available
          </h2>

          <p style={styles.emptyText}>
            There are currently no college announcements
            available for you.
          </p>

          <button
            style={styles.emptyButton}
            onClick={fetchNotices}
          >
            <RefreshCw size={16} />
            Check Again
          </button>
        </div>
      )}

      {/* ================= NOTICE SECTION ================= */}

      {!error && notices.length > 0 && (
        <>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Latest Announcements
              </h2>

              <p style={styles.sectionSubtitle}>
                Important information from college
                administration
              </p>
            </div>

            <div style={styles.noticeCount}>
              {notices.length}{" "}
              {notices.length === 1
                ? "Notice"
                : "Notices"}
            </div>
          </div>

          {/* ================= NOTICE GRID ================= */}

          <div className="notice-grid" style={styles.noticeGrid}>
            {notices.map((notice) => (
              <div
                key={notice._id}
                style={styles.noticeCard}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform =
                    "translateY(-5px)";

                  event.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(15, 23, 42, 0.12)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform =
                    "translateY(0)";

                  event.currentTarget.style.boxShadow =
                    "0 7px 25px rgba(15, 23, 42, 0.06)";
                }}
              >
                {/* Top Color Bar */}

                <div style={styles.cardTopBar} />

                <div style={styles.cardContent}>
                  {/* Card Header */}

                  <div style={styles.cardHeader}>
                    <div style={styles.noticeIcon}>
                      <Megaphone size={22} />
                    </div>

                    <span style={styles.audience}>
                      <Users size={13} />

                      {notice.targetAudience || "All"}
                    </span>
                  </div>

                  {/* Title */}

                  <h3 style={styles.noticeTitle}>
                    {notice.title}
                  </h3>

                  {/* Description */}

                  <p style={styles.description}>
                    {notice.description ||
                      "No description available."}
                  </p>

                  {/* Dates */}

                  <div style={styles.dateSection}>
                    <div style={styles.dateItem}>
                      <div
                        style={{
                          ...styles.dateIcon,
                          background: "#eff6ff",
                          color: "#2563eb",
                        }}
                      >
                        <CalendarDays size={16} />
                      </div>

                      <div>
                        <span style={styles.dateLabel}>
                          Published
                        </span>

                        <strong style={styles.dateValue}>
                          {notice.publishDate
                            ? new Date(
                                notice.publishDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </strong>
                      </div>
                    </div>

                    {notice.expiryDate && (
                      <div style={styles.dateItem}>
                        <div
                          style={{
                            ...styles.dateIcon,
                            background: "#fff7ed",
                            color: "#ea580c",
                          }}
                        >
                          <Clock3 size={16} />
                        </div>

                        <div>
                          <span style={styles.dateLabel}>
                            Expires
                          </span>

                          <strong style={styles.dateValue}>
                            {new Date(
                              notice.expiryDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}

                  <div style={styles.cardFooter}>
                    <div style={styles.footerStatus}>
                      <span style={styles.statusDot} />
                      Active Announcement
                    </div>

                    <span style={styles.readText}>
                      College Notice
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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
          .notice-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
          }

          .notice-info-row {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
          }
        }

        @media (max-width: 700px) {
          .teacher-notices-page {
            padding: 20px !important;
          }

          .teacher-notices-header {
            padding: 24px !important;
          }

          .teacher-notices-title {
            font-size: 28px !important;
          }

          .notice-grid,
          .notice-info-row {
            grid-template-columns: 1fr !important;
          }

          .notice-card-content {
            padding: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .teacher-notices-page {
            padding: 12px !important;
          }

          .teacher-notices-header {
            padding: 20px !important;
            border-radius: 18px !important;
          }

          .teacher-notices-title {
            font-size: 24px !important;
          }

          .teacher-notices-subtitle {
            font-size: 13px !important;
          }

          .teacher-notices-refresh {
            width: 100% !important;
            justify-content: center !important;
          }

          .notice-info-card {
            padding: 15px !important;
          }

          .notice-section-title {
            font-size: 18px !important;
          }

          .notice-card-content {
            padding: 16px !important;
          }

          .notice-title {
            font-size: 17px !important;
          }

          .notice-description {
            min-height: auto !important;
          }

          .notice-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 360px) {
          .teacher-notices-page {
            padding: 9px !important;
          }

          .teacher-notices-header {
            padding: 17px !important;
          }

          .teacher-notices-title {
            font-size: 21px !important;
          }

          .portal-icon {
            width: 38px !important;
            height: 38px !important;
          }

          .notice-audience {
            font-size: 10px !important;
            padding: 6px 8px !important;
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

  infoRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "24px",
  },

  infoCard: {
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

  infoIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    color: "#94a3b8",
    letterSpacing: "0.6px",
  },

  infoValue: {
    display: "block",
    marginTop: "4px",
    fontSize: "15px",
    fontWeight: 800,
    color: "#1e293b",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  noticeCount: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "7px 13px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },

  noticeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "20px",
  },

  noticeCard: {
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 7px 25px rgba(15, 23, 42, 0.06)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  cardTopBar: {
    height: "6px",
    background:
      "linear-gradient(90deg, #2563eb, #7c3aed)",
  },

  cardContent: {
    padding: "21px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "17px",
  },

  noticeIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  audience: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  },

  noticeTitle: {
    margin: 0,
    fontSize: "19px",
    lineHeight: 1.35,
    fontWeight: 800,
    color: "#0f172a",
  },

  description: {
    margin: "10px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.65,
    minHeight: "63px",
  },

  dateSection: {
    marginTop: "18px",
    paddingTop: "17px",
    borderTop: "1px solid #e2e8f0",
    display: "grid",
    gap: "12px",
  },

  dateItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dateIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  dateLabel: {
    display: "block",
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  dateValue: {
    display: "block",
    marginTop: "2px",
    fontSize: "13px",
    color: "#334155",
    fontWeight: 700,
  },

  cardFooter: {
    marginTop: "18px",
    paddingTop: "13px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  footerStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#64748b",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },

  readText: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
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
    maxWidth: "450px",
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
};

export default TeacherNotices;