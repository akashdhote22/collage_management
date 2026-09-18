import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fees/student");

      setFees(response.data.fees || []);
    } catch (err) {
      console.error("Fetch student fees error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch fees"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.totalAmount || 0),
    0
  );

  const paidAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const pendingAmount = totalAmount - paidAmount;

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading fees...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Fees</h1>
          <p style={styles.subtitle}>
            View your fee details and payment status
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchFees}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h3>Total Fees</h3>
          <p style={styles.blueValue}>₹{totalAmount.toLocaleString()}</p>
        </div>

        <div style={styles.summaryCard}>
          <h3>Paid Amount</h3>
          <p style={styles.greenValue}>₹{paidAmount.toLocaleString()}</p>
        </div>

        <div style={styles.summaryCard}>
          <h3>Pending Amount</h3>
          <p style={styles.redValue}>₹{pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {!error && fees.length === 0 && (
        <div style={styles.empty}>
          <h3>No fee records found</h3>
          <p>Your fee details will appear here once added by admin.</p>
        </div>
      )}

      {fees.length > 0 && (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Fee Records</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Academic Year</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Total Amount</th>
                  <th style={styles.th}>Paid Amount</th>
                  <th style={styles.th}>Pending Amount</th>
                  <th style={styles.th}>Payment Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => {
                  const total = Number(fee.totalAmount || 0);
                  const paid = Number(fee.paidAmount || 0);
                  const pending = total - paid;

                  return (
                    <tr key={fee._id}>
                      <td style={styles.td}>
                        {fee.academicYear || "N/A"}
                      </td>

                      <td style={styles.td}>
                        {fee.semester || "N/A"}
                      </td>

                      <td style={styles.td}>₹{total.toLocaleString()}</td>

                      <td style={styles.td}>₹{paid.toLocaleString()}</td>

                      <td style={styles.td}>
                        ₹{pending.toLocaleString()}
                      </td>

                      <td style={styles.td}>
                        {fee.paymentDate
                          ? new Date(
                              fee.paymentDate
                            ).toLocaleDateString()
                          : "Not paid"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={
                            pending <= 0
                              ? styles.paidBadge
                              : styles.pendingBadge
                          }
                        >
                          {pending <= 0 ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  summaryCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },

  blueValue: {
    color: "#2563eb",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  greenValue: {
    color: "#16a34a",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  redValue: {
    color: "#dc2626",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },

  tableContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    overflow: "hidden",
  },

  tableTitle: {
    marginTop: 0,
    color: "#1f2937",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    textAlign: "left",
    backgroundColor: "#f3f4f6",
    padding: "14px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    whiteSpace: "nowrap",
  },

  paidBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
  },

  pendingBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
  },
};

export default StudentFees;