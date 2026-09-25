import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users as UsersIcon,
  X,
} from "lucide-react";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [updatingRole, setUpdatingRole] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        error.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    if (updatingRole) return;

    setShowModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setUpdatingRole(true);
      setError("");
      setSuccess("");

      await api.put(`/admin/users/${selectedUser._id}/role`, {
        role: selectedRole,
      });

      setSuccess("User role updated successfully");

      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/admin/users/${id}`);

      setSuccess("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const filteredUsers = useMemo(() => {
    const searchText = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.role?.toLowerCase().includes(searchText)
      );
    });
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      teachers: users.filter((user) => user.role === "teacher").length,
      students: users.filter((user) => user.role === "student").length,
    };
  }, [users]);

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
          border: "#fecaca",
        };

      case "teacher":
        return {
          background: "#ede9fe",
          color: "#6d28d9",
          border: "#ddd6fe",
        };

      case "student":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
          border: "#bfdbfe",
        };

      default:
        return {
          background: "#f1f5f9",
          color: "#475569",
          border: "#e2e8f0",
        };
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .users-stat-card {
          transition: all 0.25s ease;
        }

        .users-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .users-row {
          transition: background 0.2s ease;
        }

        .users-row:hover {
          background: #f8fafc;
        }

        .user-action-btn {
          transition: all 0.2s ease;
        }

        .user-action-btn:hover {
          transform: translateY(-1px);
        }

        .search-input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        @media (max-width: 900px) {
          .users-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          .users-stats {
            grid-template-columns: 1fr !important;
          }

          .users-hero {
            padding: 22px !important;
          }

          .users-hero-title {
            font-size: 24px !important;
          }

          .users-content {
            padding: 16px !important;
          }

          .modal-content {
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="users-content" style={styles.content}>
        {/* HERO */}
        <div className="users-hero" style={styles.hero}>
          <div style={styles.heroOverlay}></div>

          <div style={styles.heroContent}>
            <div>
              <div style={styles.heroLabel}>
                <UsersIcon size={15} />
                ADMIN PORTAL
              </div>

              <h1
                className="users-hero-title"
                style={styles.heroTitle}
              >
                User Management
              </h1>

              <p style={styles.heroText}>
                Manage users, access roles and account permissions
                from one place.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              disabled={loading}
              style={styles.refreshButton}
            >
              <RefreshCw
                size={17}
                style={{
                  animation: loading
                    ? "spin 0.8s linear infinite"
                    : "none",
                }}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          className="users-stats"
          style={styles.statsGrid}
        >
          <StatCard
            icon={<UsersIcon size={21} />}
            label="Total Users"
            value={stats.total}
            iconBackground="#dbeafe"
            iconColor="#2563eb"
          />

          <StatCard
            icon={<ShieldCheck size={21} />}
            label="Administrators"
            value={stats.admins}
            iconBackground="#fee2e2"
            iconColor="#dc2626"
          />

          <StatCard
            icon={<UserRound size={21} />}
            label="Teachers"
            value={stats.teachers}
            iconBackground="#ede9fe"
            iconColor="#7c3aed"
          />

          <StatCard
            icon={<GraduationCap size={21} />}
            label="Students"
            value={stats.students}
            iconBackground="#dcfce7"
            iconColor="#16a34a"
          />
        </div>

        {/* ALERTS */}
        {success && (
          <div style={styles.successAlert}>
            <CheckCircle2 size={19} />
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              style={styles.alertClose}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={19} />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              style={styles.alertClose}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* SEARCH */}
        <div style={styles.searchCard}>
          <div style={styles.searchHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                All Users
              </h2>

              <p style={styles.sectionSubtitle}>
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div style={styles.searchBox}>
            <Search
              size={19}
              color="#94a3b8"
            />

            <input
              className="search-input"
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={styles.searchInput}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={styles.clearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <UsersIcon size={28} />
              </div>

              <h3 style={styles.emptyTitle}>
                No users found
              </h3>

              <p style={styles.emptyText}>
                Try changing your search term.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>USER</th>
                    <th style={styles.th}>EMAIL</th>
                    <th style={styles.th}>ROLE</th>
                    <th style={styles.th}>CREATED</th>
                    <th style={styles.th}>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const roleStyle = getRoleStyle(
                      user.role
                    );

                    return (
                      <tr
                        key={user._id}
                        className="users-row"
                        style={styles.tr}
                      >
                        {/* USER */}
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={styles.avatar}>
                              {getInitials(user.name)}
                            </div>

                            <div>
                              <div style={styles.userName}>
                                {user.name || "N/A"}
                              </div>

                              <div style={styles.userId}>
                                ID: {user._id?.slice(-8) || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td style={styles.td}>
                          <span style={styles.email}>
                            {user.email || "N/A"}
                          </span>
                        </td>

                        {/* ROLE */}
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.roleBadge,
                              background:
                                roleStyle.background,
                              color: roleStyle.color,
                              borderColor:
                                roleStyle.border,
                            }}
                          >
                            <span
                              style={{
                                ...styles.roleDot,
                                background:
                                  roleStyle.color,
                              }}
                            ></span>

                            {user.role || "N/A"}
                          </span>
                        </td>

                        {/* CREATED */}
                        <td style={styles.td}>
                          <span style={styles.date}>
                            {formatDate(
                              user.createdAt
                            )}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <button
                              className="user-action-btn"
                              onClick={() =>
                                openRoleModal(user)
                              }
                              title="Change Role"
                              style={styles.editButton}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              className="user-action-btn"
                              onClick={() =>
                                handleDelete(user._id)
                              }
                              title="Delete User"
                              style={styles.deleteButton}
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
      </div>

      {/* ROLE MODAL */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay}>
          <div
            className="modal-content"
            style={styles.modal}
          >
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalIcon}>
                  <ShieldCheck size={21} />
                </div>

                <h2 style={styles.modalTitle}>
                  Change User Role
                </h2>

                <p style={styles.modalSubtitle}>
                  Update access permissions for this user.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={updatingRole}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleRoleUpdate}
              style={styles.modalForm}
            >
              {/* USER INFO */}
              <div style={styles.selectedUserCard}>
                <div style={styles.largeAvatar}>
                  {getInitials(selectedUser.name)}
                </div>

                <div>
                  <div style={styles.selectedUserName}>
                    {selectedUser.name}
                  </div>

                  <div style={styles.selectedUserEmail}>
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label style={styles.label}>
                  Select Role
                </label>

                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                  required
                  disabled={updatingRole}
                  style={styles.select}
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="teacher">
                    Teacher
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              {/* BUTTONS */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updatingRole}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingRole}
                  style={styles.updateButton}
                >
                  {updatingRole ? (
                    <>
                      <span style={styles.buttonSpinner}></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Update Role
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  iconBackground,
  iconColor,
}) => {
  return (
    <div
      className="users-stat-card"
      style={styles.statCard}
    >
      <div
        style={{
          ...styles.statIcon,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div>
        <p style={styles.statLabel}>{label}</p>
        <h3 style={styles.statValue}>{value}</h3>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#0f172a",
  },

  content: {
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "28px",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    background:
      "linear-gradient(135deg, #0f2d5c 0%, #1555a6 55%, #2563eb 100%)",
    boxShadow:
      "0 16px 40px rgba(15, 45, 92, 0.18)",
  },

  heroOverlay: {
    position: "absolute",
    width: "260px",
    height: "260px",
    right: "-70px",
    top: "-100px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  heroLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#bfdbfe",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    marginBottom: "7px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  heroText: {
    margin: "7px 0 0",
    color: "#dbeafe",
    fontSize: "14px",
  },

  refreshButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "11px 15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 700,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  statIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
  },

  statValue: {
    margin: "3px 0 0",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 800,
  },

  successAlert: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "16px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },

  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },

  alertClose: {
    marginLeft: "auto",
    border: 0,
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    display: "flex",
  },

  searchCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "18px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  searchHeader: {
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  searchBox: {
    height: "46px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "0 13px",
    background: "#f8fafc",
  },

  searchInput: {
    width: "100%",
    height: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#0f172a",
    fontSize: "14px",
  },

  clearSearch: {
    border: 0,
    background: "#e2e8f0",
    color: "#64748b",
    borderRadius: "7px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "15px 18px",
    textAlign: "left",
    background: "#0f274d",
    color: "#dbeafe",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.7px",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #eef2f7",
  },

  td: {
    padding: "15px 18px",
    verticalAlign: "middle",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 800,
    flexShrink: 0,
  },

  userName: {
    fontSize: "14px",
    fontWeight: 750,
    color: "#0f172a",
  },

  userId: {
    marginTop: "3px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  email: {
    color: "#475569",
    fontSize: "13px",
  },

  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "capitalize",
  },

  roleDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  date: {
    fontSize: "13px",
    color: "#64748b",
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  editButton: {
    width: "35px",
    height: "35px",
    border: "1px solid #fde68a",
    background: "#fffbeb",
    color: "#b45309",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  deleteButton: {
    width: "35px",
    height: "35px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  loadingState: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    gap: "12px",
    fontSize: "14px",
  },

  spinner: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "3px solid #dbeafe",
    borderTopColor: "#2563eb",
    animation: "spin 0.8s linear infinite",
  },

  emptyState: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: 800,
  },

  emptyText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.62)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },

  modal: {
    width: "100%",
    maxWidth: "470px",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 25px 70px rgba(15,23,42,0.28)",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "15px",
    padding: "22px",
    borderBottom: "1px solid #eef2f7",
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
    marginBottom: "12px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  modalSubtitle: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  closeButton: {
    width: "35px",
    height: "35px",
    border: 0,
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  modalForm: {
    padding: "22px",
  },

  selectedUserCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  largeAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 800,
  },

  selectedUserName: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 800,
  },

  selectedUserEmail: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "3px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 700,
  },

  select: {
    width: "100%",
    height: "46px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    padding: "0 12px",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    fontSize: "14px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #eef2f7",
  },

  cancelButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },

  updateButton: {
    border: 0,
    background:
      "linear-gradient(135deg, #1555a6, #2563eb)",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    boxShadow:
      "0 6px 15px rgba(37,99,235,0.22)",
  },

  buttonSpinner: {
    width: "15px",
    height: "15px",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

export default Users;