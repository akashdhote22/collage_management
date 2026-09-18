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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Teacher Management</h1>

          <p style={styles.subtitle}>
            Create and manage teacher profiles
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Add Teacher Form */}
      <div style={styles.formCard}>
        <h2 style={styles.sectionTitle}>Add Teacher</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            {/* Select Teacher User */}
            <div style={styles.field}>
              <label>Select Teacher User</label>

              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select user</option>

                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee ID */}
            <div style={styles.field}>
              <label>Employee ID</label>

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

            {/* Department */}
            <div style={styles.field}>
              <label>Department</label>

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

            {/* Designation */}
            <div style={styles.field}>
              <label>Designation</label>

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

            {/* Phone */}
            <div style={styles.field}>
              <label>Phone</label>

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

          <button type="submit" style={styles.button}>
            Add Teacher
          </button>
        </form>
      </div>

      {/* Teachers Table */}
      <div style={styles.tableCard}>
        <h2 style={styles.sectionTitle}>All Teachers</h2>

        {loading ? (
          <p>Loading teachers...</p>
        ) : teachers.length === 0 ? (
          <p style={styles.emptyText}>No teachers found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td style={styles.td}>
                      {teacher.userId?.name || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.userId?.email || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.employeeId}
                    </td>

                    <td style={styles.td}>
                      {teacher.department}
                    </td>

                    <td style={styles.td}>
                      {teacher.designation}
                    </td>

                    <td style={styles.td}>
                      {teacher.phone || "N/A"}
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(teacher)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(teacher._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h2 style={styles.sectionTitle}>Edit Teacher</h2>

            <form onSubmit={handleUpdate}>
              <div style={styles.modalForm}>
                {/* Employee ID */}
                <div style={styles.field}>
                  <label>Employee ID</label>

                  <input
                    type="text"
                    name="employeeId"
                    value={editFormData.employeeId}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                {/* Department */}
                <div style={styles.field}>
                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                {/* Designation */}
                <div style={styles.field}>
                  <label>Designation</label>

                  <input
                    type="text"
                    name="designation"
                    value={editFormData.designation}
                    onChange={handleEditChange}
                    required
                    style={styles.input}
                  />
                </div>

                {/* Phone */}
                <div style={styles.field}>
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.updateButton}
                >
                  Update Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },

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

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  formCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "25px",
  },

  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
  },

  sectionTitle: {
    margin: "0 0 20px",
    fontSize: "20px",
    color: "#111827",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  },

  modalForm: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    color: "#374151",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px",
    color: "#4b5563",
  },

  editButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyText: {
    color: "#6b7280",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "25px",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  updateButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminTeachers;