import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add teacher form
  const [formData, setFormData] = useState({
    userId: "",
    employeeId: "",
    department: "",
    designation: "",
    phone: "",
  });

  // Edit teacher states
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [editFormData, setEditFormData] = useState({
    employeeId: "",
    department: "",
    designation: "",
    phone: "",
  });

  // Fetch teachers and users
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [teachersResponse, usersResponse] = await Promise.all([
        api.get("/teachers"),
        api.get("/users"),
      ]);

      setTeachers(teachersResponse.data.teachers || []);

      const teacherUsers = (usersResponse.data.users || []).filter(
        (user) => user.role === "teacher"
      );

      setUsers(teacherUsers);
    } catch (err) {
      console.error("Fetch teachers error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch teacher data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle add form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create teacher
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/teachers", {
        userId: formData.userId,
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
      });

      alert("Teacher created successfully");

      setFormData({
        userId: "",
        employeeId: "",
        department: "",
        designation: "",
        phone: "",
      });

      fetchData();
    } catch (err) {
      console.error("Create teacher error:", err);

      setError(
        err.response?.data?.message || "Failed to create teacher"
      );
    }
  };

  // Open edit modal
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);

    setEditFormData({
      employeeId: teacher.employeeId || "",
      department: teacher.department || "",
      designation: teacher.designation || "",
      phone: teacher.phone || "",
    });

    setError("");
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Update teacher
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.put(`/teachers/${editingTeacher._id}`, {
        employeeId: editFormData.employeeId,
        department: editFormData.department,
        designation: editFormData.designation,
        phone: editFormData.phone,
      });

      alert("Teacher updated successfully");

      setEditingTeacher(null);

      setEditFormData({
        employeeId: "",
        department: "",
        designation: "",
        phone: "",
      });

      fetchData();
    } catch (err) {
      console.error("Update teacher error:", err);

      setError(
        err.response?.data?.message || "Failed to update teacher"
      );
    }
  };

  // Delete teacher
  const handleDelete = async (teacherId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher profile?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await api.delete(`/teachers/${teacherId}`);

      alert("Teacher deleted successfully");

      fetchData();
    } catch (err) {
      console.error("Delete teacher error:", err);

      setError(
        err.response?.data?.message || "Failed to delete teacher"
      );
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .admin-teacher-form-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 760px) {
          .admin-teacher-stats-grid { grid-template-columns: 1fr !important; }
          .admin-teacher-hero-content { flex-direction: column !important; align-items: flex-start !important; }
          .admin-teacher-hero-count { width: 100% !important; text-align: left !important; box-sizing: border-box; }
          .admin-teacher-card-header { flex-direction: column !important; }
          .admin-teacher-form-footer { flex-direction: column !important; align-items: stretch !important; }
          .admin-teacher-primary-button { width: 100% !important; }
          .admin-teacher-modal-form { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 560px) {
          .admin-teacher-container { padding-bottom: 24px !important; }
          .admin-teacher-hero { padding: 22px !important; border-radius: 18px !important; }
          .admin-teacher-title { font-size: 24px !important; }
          .admin-teacher-card { padding: 17px !important; border-radius: 16px !important; }
          .admin-teacher-modal-card { padding: 18px !important; border-radius: 17px !important; }
          .admin-teacher-modal-actions { flex-direction: column-reverse !important; }
          .admin-teacher-modal-actions button { width: 100% !important; }
        }
      `}</style>

      <div
        className="admin-teacher-container"
        style={styles.container}
      >
      {/* Premium Header */}
      <div className="admin-teacher-hero" style={styles.hero}>
        <div style={styles.heroGlowOne}></div>
        <div style={styles.heroGlowTwo}></div>

        <div className="admin-teacher-hero-content" style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <div style={styles.iconBadge}>👨‍🏫</div>
            <div>
              <p style={styles.eyebrow}>ADMIN PORTAL • FACULTY</p>
              <h1 className="admin-teacher-title" style={styles.title}>Teacher Management</h1>
              <p style={styles.subtitle}>
                Create, manage and maintain teacher profiles from one place.
              </p>
            </div>
          </div>

          <div className="admin-teacher-hero-count" style={styles.heroCount}>
            <span style={styles.heroCountLabel}>TOTAL TEACHERS</span>
            <strong style={styles.heroCountValue}>
              {loading ? "—" : teachers.length}
            </strong>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>!</span>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="admin-teacher-stats-grid" style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#eff6ff", color: "#2563eb" }}>
            👨‍🏫
          </div>
          <div>
            <span style={styles.statLabel}>Total Teachers</span>
            <strong style={styles.statValue}>{loading ? "—" : teachers.length}</strong>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#ecfdf5", color: "#059669" }}>
            ✓
          </div>
          <div>
            <span style={styles.statLabel}>Active Profiles</span>
            <strong style={styles.statValue}>{loading ? "—" : teachers.length}</strong>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#f5f3ff", color: "#7c3aed" }}>
            🏢
          </div>
          <div>
            <span style={styles.statLabel}>Faculty Records</span>
            <strong style={styles.statValue}>{loading ? "—" : teachers.length}</strong>
          </div>
        </div>
      </div>

      {/* Add Teacher */}
      <div className="admin-teacher-card" style={styles.card}>
        <div className="admin-teacher-card-header" style={styles.cardHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Add New Teacher</h2>
            <p style={styles.sectionSubtitle}>
              Create a faculty profile and connect it with a teacher user.
            </p>
          </div>
          <div style={styles.sectionBadge}>NEW PROFILE</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-teacher-form-grid" style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Teacher User</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select teacher user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP001"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Computer Engineering"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Assistant Professor"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                style={styles.input}
              />
            </div>
          </div>

          <div className="admin-teacher-form-footer" style={styles.formFooter}>
            <span style={styles.formHint}>All required fields are marked automatically.</span>
            <button type="submit" className="admin-teacher-primary-button" style={styles.primaryButton}>
              <span>＋</span> Add Teacher
            </button>
          </div>
        </form>
      </div>

      {/* Teachers Table */}
      <div className="admin-teacher-card" style={styles.card}>
        <div className="admin-teacher-card-header" style={styles.cardHeader}>
          <div>
            <h2 style={styles.sectionTitle}>All Teachers</h2>
            <p style={styles.sectionSubtitle}>
              View and manage all registered teacher profiles.
            </p>
          </div>
          <div style={styles.recordCount}>
            {loading ? "Loading..." : `${teachers.length} records`}
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <span>Loading teacher records...</span>
          </div>
        ) : teachers.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>👨‍🏫</div>
            <h3>No teachers found</h3>
            <p>Create your first teacher profile using the form above.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Teacher</th>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Phone</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.teacherCell}>
                        <div style={styles.avatar}>
                          {(teacher.userId?.name || "T").charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.teacherInfo}>
                          <strong>{teacher.userId?.name || "N/A"}</strong>
                          <span>{teacher.userId?.email || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.employeeBadge}>{teacher.employeeId}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.departmentText}>{teacher.department}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.designationBadge}>{teacher.designation}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.phoneText}>{teacher.phone || "N/A"}</span>
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.actionGroup}>
                        <button
                          onClick={() => handleEdit(teacher)}
                          style={styles.editButton}
                          title="Edit teacher"
                        >
                          ✎ <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(teacher._id)}
                          style={styles.deleteButton}
                          title="Delete teacher"
                        >
                          🗑 <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTeacher && (
        <div style={styles.modalOverlay}>
          <div className="admin-teacher-modal-card" style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalEyebrow}>FACULTY PROFILE</p>
                <h2 style={styles.modalTitle}>Edit Teacher</h2>
                <p style={styles.modalSubtitle}>
                  Update the selected teacher's profile information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                style={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="admin-teacher-modal-form" style={styles.modalForm}>
                <div style={styles.field}>
                  <label style={styles.label}>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={editFormData.employeeId}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={editFormData.designation}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="admin-teacher-modal-actions" style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.updateButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       </div>
    </>
  );
};
const styles = {
  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    paddingBottom: "40px",
    color: "#0f172a",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    background: "linear-gradient(135deg, #0f172a 0%, #172554 55%, #1d4ed8 100%)",
    color: "#fff",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
  },

  heroGlowOne: {
    position: "absolute",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(96, 165, 250, 0.16)",
    top: "-120px",
    right: "12%",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.07)",
    bottom: "-120px",
    right: "-30px",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minWidth: 0,
  },

  iconBadge: {
    width: "58px",
    height: "58px",
    minWidth: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "27px",
    backdropFilter: "blur(10px)",
  },

  eyebrow: {
    margin: "0 0 6px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    color: "#bfdbfe",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.15,
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#dbeafe",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  heroCount: {
    minWidth: "125px",
    padding: "14px 18px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "right",
    backdropFilter: "blur(10px)",
  },

  heroCountLabel: {
    display: "block",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    color: "#bfdbfe",
  },

  heroCountValue: {
    display: "block",
    marginTop: "3px",
    fontSize: "25px",
    color: "#fff",
  },

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    background: "#fff1f2",
    color: "#991b1b",
  },

  errorIcon: {
    width: "25px",
    height: "25px",
    minWidth: "25px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "800",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "17px",
    boxShadow: "0 5px 20px rgba(15, 23, 42, 0.05)",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    fontSize: "20px",
  },

  statLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "3px",
  },

  statValue: {
    display: "block",
    fontSize: "23px",
    color: "#0f172a",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 6px 25px rgba(15, 23, 42, 0.05)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "22px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#64748b",
  },

  sectionBadge: {
    flexShrink: 0,
    padding: "7px 10px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.7px",
  },

  recordCount: {
    flexShrink: 0,
    padding: "7px 11px",
    borderRadius: "9px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "17px",
  },

  modalForm: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "17px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 13px",
    boxSizing: "border-box",
    border: "1px solid #dbe1ea",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.2s ease",
  },

  formFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #eef2f7",
  },

  formHint: {
    fontSize: "11px",
    color: "#94a3b8",
  },

  primaryButton: {
    border: "none",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 7px 18px rgba(37, 99, 235, 0.24)",
    whiteSpace: "nowrap",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    border: "1px solid #eef2f7",
    borderRadius: "14px",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px 14px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
    color: "#64748b",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "15px 14px",
    fontSize: "13px",
    color: "#334155",
    verticalAlign: "middle",
  },

  teacherCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: "190px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "11px",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "800",
  },

  teacherInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },

  employeeBadge: {
    display: "inline-block",
    padding: "5px 8px",
    borderRadius: "7px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  departmentText: {
    color: "#475569",
    fontWeight: "600",
  },

  designationBadge: {
    display: "inline-block",
    padding: "5px 8px",
    borderRadius: "7px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  phoneText: {
    color: "#64748b",
    whiteSpace: "nowrap",
  },

  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "7px",
  },

  editButton: {
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "7px 10px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  deleteButton: {
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "7px 10px",
    background: "#fff1f2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  loadingBox: {
    minHeight: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "12px",
    color: "#64748b",
    fontSize: "13px",
  },

  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  emptyBox: {
    minHeight: "190px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    background: "#f1f5f9",
    fontSize: "25px",
    marginBottom: "10px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.58)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "18px",
  },

  modalCard: {
    width: "100%",
    maxWidth: "620px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "20px",
    padding: "25px",
    boxSizing: "border-box",
    boxShadow: "0 25px 70px rgba(15, 23, 42, 0.28)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    paddingBottom: "20px",
    marginBottom: "20px",
    borderBottom: "1px solid #eef2f7",
  },

  modalEyebrow: {
    margin: "0 0 5px",
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
  },

  modalSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#64748b",
  },

  closeButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "9px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "23px",
    lineHeight: 1,
    cursor: "pointer",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #eef2f7",
  },

  cancelButton: {
    border: "1px solid #dbe1ea",
    borderRadius: "10px",
    padding: "10px 15px",
    background: "#fff",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  updateButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(37, 99, 235, 0.22)",
  },
};

export default AdminTeachers;