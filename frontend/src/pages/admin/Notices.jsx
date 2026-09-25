import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import api from "../../services/api";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "all",
    publishDate: "",
    expiryDate: "",
  });

  // =========================
  // FETCH NOTICES
  // =========================
  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notices");

      setNotices(
        response.data?.notices ||
          response.data?.data ||
          response.data ||
          []
      );
    } catch (error) {
      console.error("Error fetching notices:", error);
      alert(error.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // =========================
  // FORM
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetAudience: "all",
      publishDate: "",
      expiryDate: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const offset = parsedDate.getTimezoneOffset();
    const localDate = new Date(parsedDate.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  const openEditModal = (notice) => {
    setEditingId(notice._id);

    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      targetAudience: notice.targetAudience || "all",
      publishDate: formatDateForInput(notice.publishDate),
      expiryDate: formatDateForInput(notice.expiryDate),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        targetAudience: formData.targetAudience,
        publishDate: formData.publishDate
          ? new Date(formData.publishDate).toISOString()
          : undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : undefined,
      };

      if (editingId) {
        await api.put(`/notices/${editingId}`, payload);
        alert("Notice updated successfully");
      } else {
        await api.post("/notices", payload);
        alert("Notice added successfully");
      }

      closeModal();
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      alert(error.response?.data?.message || "Failed to save notice");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notices/${id}`);

      alert("Notice deleted successfully");

      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);

      alert(
        error.response?.data?.message || "Failed to delete notice"
      );
    }
  };

  // =========================
  // HELPERS
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAudienceStyle = (audience) => {
    switch (audience) {
      case "students":
        return {
          bg: "#dbeafe",
          color: "#1d4ed8",
          label: "Students",
        };

      case "teachers":
        return {
          bg: "#ede9fe",
          color: "#6d28d9",
          label: "Teachers",
        };

      case "admin":
        return {
          bg: "#fee2e2",
          color: "#b91c1c",
          label: "Admin",
        };

      default:
        return {
          bg: "#dcfce7",
          color: "#15803d",
          label: "Everyone",
        };
    }
  };

  const filteredNotices = useMemo(() => {
    const searchText = searchTerm.toLowerCase().trim();

    if (!searchText) {
      return notices;
    }

    return notices.filter((notice) => {
      return (
        notice.title?.toLowerCase().includes(searchText) ||
        notice.description?.toLowerCase().includes(searchText) ||
        notice.targetAudience?.toLowerCase().includes(searchText)
      );
    });
  }, [notices, searchTerm]);

  const stats = useMemo(() => {
    const total = notices.length;

    const studentNotices = notices.filter(
      (notice) => notice.targetAudience === "students"
    ).length;

    const teacherNotices = notices.filter(
      (notice) => notice.targetAudience === "teachers"
    ).length;

    const allNotices = notices.filter(
      (notice) => notice.targetAudience === "all"
    ).length;

    return {
      total,
      studentNotices,
      teacherNotices,
      allNotices,
    };
  }, [notices]);

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      {/* ================= HERO ================= */}
      <div style={styles.hero}>
        <div style={styles.heroGlow}></div>

        <div style={styles.heroContent}>
          <div>
            <div style={styles.eyebrow}>
              <Bell size={15} />
              COLLEGE ADMINISTRATION
            </div>

            <h1 style={styles.heroTitle}>Notices Management</h1>

            <p style={styles.heroSubtitle}>
              Create, publish and manage important college announcements.
            </p>
          </div>

          <button
            onClick={openAddModal}
            style={styles.addButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(15, 23, 42, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Plus size={19} />
            Add Notice
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<FileText size={22} />}
          title="Total Notices"
          value={stats.total}
          subtitle="All announcements"
        />

        <StatCard
          icon={<Users size={22} />}
          title="Student Notices"
          value={stats.studentNotices}
          subtitle="For students"
        />

        <StatCard
          icon={<Users size={22} />}
          title="Teacher Notices"
          value={stats.teacherNotices}
          subtitle="For teachers"
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          title="Everyone"
          value={stats.allNotices}
          subtitle="Visible to all"
        />
      </div>

      {/* ================= SEARCH ================= */}
      <div style={styles.searchCard}>
        <div style={styles.searchIcon}>
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="Search by title, description or audience..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={styles.clearSearch}
          >
            <X size={17} />
          </button>
        )}

        <div style={styles.resultCount}>
          {filteredNotices.length}{" "}
          {filteredNotices.length === 1 ? "notice" : "notices"}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h2 style={styles.tableTitle}>All Notices</h2>
            <p style={styles.tableSubtitle}>
              Manage your college announcements
            </p>
          </div>

          <button
            onClick={fetchNotices}
            style={styles.refreshButton}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.stateContainer}>
            <div style={styles.spinner}></div>
            <p>Loading notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Bell size={30} />
            </div>

            <h3>No notices found</h3>

            <p>
              {searchTerm
                ? "Try changing your search keyword."
                : "Create your first college notice to get started."}
            </p>

            {!searchTerm && (
              <button
                onClick={openAddModal}
                style={styles.emptyButton}
              >
                <Plus size={17} />
                Add First Notice
              </button>
            )}
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Notice</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Audience</th>
                  <th style={styles.th}>Publish Date</th>
                  <th style={styles.th}>Expiry Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotices.map((notice) => {
                  const audience = getAudienceStyle(
                    notice.targetAudience
                  );

                  return (
                    <tr key={notice._id} style={styles.tr}>
                      {/* Notice */}
                      <td style={styles.td}>
                        <div style={styles.noticeCell}>
                          <div style={styles.noticeIcon}>
                            <Bell size={18} />
                          </div>

                          <div style={styles.noticeInfo}>
                            <div style={styles.noticeTitle}>
                              {notice.title}
                            </div>

                            <div style={styles.noticeId}>
                              Notice ID:{" "}
                              {notice._id?.slice(-8) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td style={styles.td}>
                        <p style={styles.description}>
                          {notice.description}
                        </p>
                      </td>

                      {/* Audience */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.audienceBadge,
                            background: audience.bg,
                            color: audience.color,
                          }}
                        >
                          <Users size={14} />
                          {audience.label}
                        </span>
                      </td>

                      {/* Publish */}
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <CalendarDays size={15} />
                          {formatDate(notice.publishDate)}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <Clock3 size={15} />
                          {formatDate(notice.expiryDate)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() => openEditModal(notice)}
                            style={styles.editButton}
                            title="Edit Notice"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(notice._id)}
                            style={styles.deleteButton}
                            title="Delete Notice"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleArea}>
                <div style={styles.modalIcon}>
                  <Bell size={21} />
                </div>

                <div>
                  <h2 style={styles.modalTitle}>
                    {editingId ? "Edit Notice" : "Create Notice"}
                  </h2>

                  <p style={styles.modalSubtitle}>
                    {editingId
                      ? "Update announcement details"
                      : "Create a new college announcement"}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Title */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Notice Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                  style={styles.input}
                />
              </div>

              {/* Description */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write the notice details..."
                  rows={5}
                  required
                  style={{
                    ...styles.input,
                    minHeight: "130px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Audience */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Target Audience
                </label>

                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Dates */}
              <div style={styles.dateGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Publish Date
                  </label>

                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Expiry Date
                  </label>

                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  {editingId ? (
                    <>
                      <Pencil size={17} />
                      Update Notice
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .notices-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .notices-stats-grid {
            grid-template-columns: 1fr !important;
          }

          .notices-hero-content {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .notices-add-button {
            width: 100% !important;
            justify-content: center !important;
          }

          .notices-result-count {
            display: none !important;
          }

          .notices-date-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// =========================
// STAT CARD
// =========================
const StatCard = ({ icon, title, value, subtitle }) => {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div style={styles.statIcon}>{icon}</div>

        <span style={styles.statLabel}>{title}</span>
      </div>

      <div style={styles.statValue}>{value}</div>

      <div style={styles.statSubtitle}>{subtitle}</div>
    </div>
  );
};

// =========================
// STYLES
// =========================
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "24px",
    color: "#0f172a",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1d4ed8 100%)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
  },

  heroGlow: {
    position: "absolute",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.22)",
    filter: "blur(10px)",
    right: "-80px",
    top: "-100px",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "8px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  heroSubtitle: {
    margin: "8px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
  },

  statValue: {
    marginTop: "14px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
  },

  statSubtitle: {
    marginTop: "3px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  searchCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px 15px",
    marginBottom: "18px",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)",
  },

  searchIcon: {
    color: "#64748b",
    display: "flex",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "14px",
  },

  clearSearch: {
    border: "none",
    background: "#f1f5f9",
    color: "#64748b",
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  resultCount: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "7px 11px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 28px rgba(15, 23, 42, 0.06)",
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "20px 22px",
    borderBottom: "1px solid #e2e8f0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
  },

  tableSubtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  refreshButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "9px",
    padding: "8px 13px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "15px 18px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #eef2f7",
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px 18px",
    verticalAlign: "middle",
  },

  noticeCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "210px",
  },

  noticeIcon: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    borderRadius: "11px",
    background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  noticeInfo: {
    minWidth: 0,
  },

  noticeTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#0f172a",
    maxWidth: "230px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  noticeId: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#94a3b8",
  },

  description: {
    margin: 0,
    maxWidth: "280px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  audienceBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  editButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "9px",
    background: "#fef3c7",
    color: "#b45309",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  deleteButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "9px",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  stateContainer: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#64748b",
    fontSize: "14px",
  },

  spinner: {
    width: "34px",
    height: "34px",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "noticeSpin 0.8s linear infinite",
  },

  emptyState: {
    minHeight: "330px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
  },

  emptyIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
  },

  emptyStateTitle: {
    color: "#0f172a",
  },

  emptyButton: {
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 15px",
    borderRadius: "9px",
    fontWeight: "700",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.68)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },

  modal: {
    width: "100%",
    maxWidth: "680px",
    maxHeight: "94vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "21px 22px",
    borderBottom: "1px solid #e2e8f0",
  },

  modalTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  modalIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
  },

  modalSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  closeButton: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  form: {
    padding: "22px",
  },

  field: {
    marginBottom: "17px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "11px 12px",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
  },

  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "15px",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "18px",
    marginTop: "5px",
  },

  cancelButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  submitButton: {
    border: "none",
    background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 17px",
    fontSize: "13px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
  },
};

export default Notices;