import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    academicYear: "",
    semester: "",
    totalAmount: "",
    paidAmount: 0,
    paymentDate: "",
    remarks: "",
  });

  const fetchFees = async () => {
    try {
      const response = await api.get("/fees");
      setFees(response.data.fees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch fees");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.students || response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch students"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFees(), fetchStudents()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      await api.post("/fees", {
        ...formData,
        semester: Number(formData.semester),
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
      });

      setMessage("Fee record added successfully");

      setFormData({
        studentId: "",
        academicYear: "",
        semester: "",
        totalAmount: "",
        paidAmount: 0,
        paymentDate: "",
        remarks: "",
      });

      fetchFees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add fee record"
      );
    }
  };

  if (loading) {
    return <p>Loading fees...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Fees Management</h1>
          <p style={styles.subtitle}>
            Add and manage student fee records
          </p>
        </div>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add Fee Record</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Student</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.userId?.name ||
                    student.name ||
                    student._id}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Academic Year</label>
            <input
              type="text"
              name="academicYear"
              placeholder="2026-27"
              value={formData.academicYear}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              placeholder="50000"
              min="0"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Paid Amount</label>
            <input
              type="number"
              name="paidAmount"
              placeholder="25000"
              min="0"
              value={formData.paidAmount}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Remarks</label>
            <input
              type="text"
              name="remarks"
              placeholder="First installment"
              value={formData.remarks}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Add Fee
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>All Fee Records</h2>

        {fees.length === 0 ? (
          <p>No fee records found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Academic Year</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Paid</th>
                  <th style={styles.th}>Pending</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id}>
                    <td style={styles.td}>
                      {fee.studentId?.userId?.name || "Unknown"}
                    </td>
                    <td style={styles.td}>
                      {fee.academicYear}
                    </td>
                    <td style={styles.td}>
                      {fee.semester}
                    </td>
                    <td style={styles.td}>
                      ₹{fee.totalAmount}
                    </td>
                    <td style={styles.td}>
                      ₹{fee.paidAmount}
                    </td>
                    <td style={styles.td}>
                      ₹{fee.pendingAmount}
                    </td>
                    <td style={styles.td}>
                      {fee.paymentStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },
  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#111827",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  input: {
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    alignSelf: "end",
  },
  success: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
  },
  error: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: "13px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    fontSize: "14px",
  },
};

export default AdminFees;