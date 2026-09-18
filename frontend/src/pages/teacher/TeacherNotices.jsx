import { useEffect, useState } from "react";
import api from "../../services/api";

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

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Notices</h2>
        <p>Loading notices...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Notices</h2>
          <p style={styles.subtitle}>
            View college announcements and notices
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={fetchNotices}
        >
          Refresh
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {!error && notices.length === 0 && (
        <div style={styles.emptyBox}>
          <p>No notices available.</p>
        </div>
      )}

      <div style={styles.noticeGrid}>
        {notices.map((notice) => (
          <div key={notice._id} style={styles.noticeCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.noticeTitle}>
                {notice.title}
              </h3>

              <span style={styles.audience}>
                {notice.targetAudience || "All"}
              </span>
            </div>

            <p style={styles.description}>
              {notice.description}
            </p>

            <div style={styles.footer}>
              <span>
                Published:{" "}
                {notice.publishDate
                  ? new Date(notice.publishDate).toLocaleDateString()
                  : "N/A"}
              </span>

              {notice.expiryDate && (
                <span>
                  Expires:{" "}
                  {new Date(
                    notice.expiryDate
                  ).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
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

  noticeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  noticeCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    borderLeft: "4px solid #2563eb",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },

  noticeTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  audience: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  description: {
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "18px",
  },

  footer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#64748b",
    fontSize: "13px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "12px",
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

export default TeacherNotices;