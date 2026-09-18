import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authcontext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      login(user, token);

      // Redirect according to role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>College Management System</h1>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },

  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "8px",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "24px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  },

  error: {
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;