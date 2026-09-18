import { useEffect, useState } from "react";
import api from "../../services/api";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students/profile");

      setStudent(response.data.student || response.data);
    } catch (err) {
      console.error("Fetch student profile error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch student profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button style={styles.refreshButton} onClick={fetchProfile}>
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h3>Profile not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Profile</h1>
          <p style={styles.subtitle}>
            View your personal and academic information
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchProfile}>
          Refresh
        </button>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {(student.userId?.name || student.name || "S")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2 style={styles.profileName}>
              {student.userId?.name || student.name || "Student"}
            </h2>
            <p style={styles.profileEmail}>
              {student.userId?.email || student.email || "Email not available"}
            </p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Information</h3>

          <div style={styles.detailsGrid}>
            <DetailItem
              label="Full Name"
              value={student.userId?.name || student.name}
            />

            <DetailItem
              label="Email"
              value={student.userId?.email || student.email}
            />

            <DetailItem
              label="Phone"
              value={student.phone}
            />

            <DetailItem
              label="Student ID"
              value={student.studentId || student.rollNumber}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Academic Information</h3>

          <div style={styles.detailsGrid}>
            <DetailItem
              label="Roll Number"
              value={student.rollNumber}
            />

            <DetailItem
              label="Branch"
              value={student.branch || student.department}
            />

            <DetailItem
              label="Semester"
              value={student.semester}
            />

            <DetailItem
              label="Admission Year"
              value={student.admissionYear || student.year}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div style={styles.detailItem}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>
        {value !== undefined && value !== null && value !== ""
          ? value
          : "Not available"}
      </span>
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
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  refreshButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },

  profileCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
    maxWidth: "900px",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
  },

  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  profileName: {
    margin: 0,
    fontSize: "24px",
    color: "#111827",
  },

  profileEmail: {
    marginTop: "6px",
    color: "#6b7280",
  },

  section: {
    marginTop: "28px",
  },

  sectionTitle: {
    marginBottom: "16px",
    color: "#1f2937",
    fontSize: "18px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  detailItem: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  detailLabel: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "600",
  },

  detailValue: {
    color: "#111827",
    fontSize: "15px",
    fontWeight: "500",
    wordBreak: "break-word",
  },
};

export default StudentProfile;