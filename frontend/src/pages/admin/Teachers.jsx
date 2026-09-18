import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  employeeId: "",
  department: "",
  designation: "",
  phone: "",
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers");

      setTeachers(response.data.teachers || []);
    } catch (err) {
      console.error("Fetch teachers error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setSelectedTeacherId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditModal = (teacher) => {
    setIsEditMode(true);
    setSelectedTeacherId(teacher._id);

    setFormData({
      name: teacher.userId?.name || "",
      email: teacher.userId?.email || "",
      password: "",
      employeeId: teacher.employeeId || "",
      department: teacher.department || "",
      designation: teacher.designation || "",
      phone: teacher.phone || "",
    });

    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    resetForm();
  };

  const handleAddTeacher = async (event) => {
    event.preventDefault();

    try {
      await api.post("/teachers", {
        ...formData,
      });

      alert("Teacher added successfully");

      closeModal();
      await fetchTeachers();
    } catch (err) {
      console.error("Add teacher error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to add teacher"
      );
    }
  };

  const handleUpdateTeacher = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/teachers/${selectedTeacherId}`, {
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
      });

      alert("Teacher updated successfully");

      closeModal();
      await fetchTeachers();
    } catch (err) {
      console.error("Update teacher error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update teacher"
      );
    }
  };

  const handleFormSubmit = (event) => {
    if (isEditMode) {
      handleUpdateTeacher(event);
    } else {
      handleAddTeacher(event);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/teachers/${teacherId}`);

      alert("Teacher deleted successfully");

      await fetchTeachers();
    } catch (err) {
      console.error("Delete teacher error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete teacher"
      );
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const teacherName = teacher.userId?.name || "";
    const teacherEmail = teacher.userId?.email || "";
    const employeeId = teacher.employeeId || "";
    const department = teacher.department || "";

    const searchText = search.toLowerCase();

    return (
      teacherName.toLowerCase().includes(searchText) ||
      teacherEmail.toLowerCase().includes(searchText) ||
      employeeId.toLowerCase().includes(searchText) ||
      department.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Teachers</h1>
          <p style={styles.subtitle}>
            Manage all college teachers
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Teacher
        </button>
      </div>

      {/* Search Box */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={19} color="#6b7280" />

          <input
            type="text"
            placeholder="Search by name, email, employee ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.searchInput}
          />
        </div>

        <p style={styles.countText}>
          Total Teachers: <strong>{teachers.length}</strong>
        </p>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Teachers Table */}
      <div style={styles.tableContainer}>
        {loading ? (
          <p style={styles.statusText}>Loading teachers...</p>
        ) : filteredTeachers.length === 0 ? (
          <p style={styles.statusText}>No teachers found.</p>
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
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td style={styles.td}>
                      <strong>
                        {teacher.userId?.name || "N/A"}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {teacher.userId?.email || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.employeeId || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.department || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.designation || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {teacher.phone || "N/A"}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.editButton}
                          title="Edit teacher"
                          onClick={() => openEditModal(teacher)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          style={styles.deleteButton}
                          title="Delete teacher"
                          onClick={() =>
                            handleDeleteTeacher(teacher._id)
                          }
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Teacher Modal */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {isEditMode ? "Edit Teacher" : "Add Teacher"}
                </h2>

                <p style={styles.modalSubtitle}>
                  {isEditMode
                    ? "Update teacher details"
                    : "Enter teacher details"}
                </p>
              </div>

              <button
                style={styles.closeButton}
                onClick={closeModal}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGrid}>
                {/* Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    style={styles.input}
                    required
                    disabled={isEditMode}
                  />
                </div>

                {/* Email */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    style={styles.input}
                    required
                    disabled={isEditMode}
                  />
                </div>

                {/* Password */}
                {!isEditMode && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      style={styles.input}
                      required
                    />
                  </div>
                )}

                {/* Employee ID */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee ID</label>

                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="Example: EMP101"
                    style={styles.input}
                    required
                  />
                </div>

                {/* Department */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department</label>

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Example: Computer Engineering"
                    style={styles.input}
                    required
                  />
                </div>

                {/* Designation */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Designation</label>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Example: Assistant Professor"
                    style={styles.input}
                    required
                  />
                </div>

                {/* Phone */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" style={styles.saveButton}>
                  {isEditMode ? "Update Teacher" : "Save Teacher"}
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
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 18px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "0 14px",
    width: "min(100%, 450px)",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "13px 0",
    fontSize: "14px",
  },

  countText: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },

  tableContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f9fafb",
    color: "#4b5563",
    fontSize: "12px",
    textTransform: "uppercase",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "16px",
    color: "#374151",
    fontSize: "13px",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: "nowrap",
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
  },

  editButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    cursor: "pointer",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    cursor: "pointer",
  },

  statusText: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 100,
  },

  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "25px",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111827",
  },

  modalSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "28px",
  },

  cancelButton: {
    padding: "11px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },

  saveButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Teachers;