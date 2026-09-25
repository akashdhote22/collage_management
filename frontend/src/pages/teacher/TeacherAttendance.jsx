import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  ClipboardCheck,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
  UserRound,
  BookOpen,
  CalendarDays,
  Activity,
} from "lucide-react";

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch students and teacher courses
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, coursesResponse] = await Promise.all([
        api.get("/students/attendance-list"),
        api.get("/teachers/courses"),
      ]);

      setStudents(studentsResponse.data.students || []);
      setCourses(coursesResponse.data.courses || []);
    } catch (err) {
      console.error("Fetch attendance data error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load students and courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await api.post("/attendance/teacher", formData);

      setMessage("Attendance marked successfully!");

      setFormData((previous) => ({
        ...previous,
        studentId: "",
        status: "present",
      }));
    } catch (err) {
      console.error("Mark attendance error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to mark attendance"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f1f5f9",
          padding: "30px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "70px 20px",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.07)",
          }}
        >
          <LoaderCircle
            size={42}
            color="#2563eb"
            style={{
              margin: "0 auto 15px",
              animation: "spin 1s linear infinite",
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Loading Attendance
          </h2>

          <p
            style={{
              marginTop: "7px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Fetching students and assigned courses...
          </p>

          <style>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div
      className="teacher-attendance-page"
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "28px",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        className="attendance-header"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          borderRadius: "24px",
          padding: "30px",
          marginBottom: "22px",
          color: "#ffffff",
          boxShadow: "0 12px 35px rgba(15, 23, 42, 0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              className="attendance-header-icon"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClipboardCheck size={23} />
            </div>

            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#bfdbfe",
              }}
            >
              FACULTY PORTAL
            </span>
          </div>

          <h1
            className="attendance-header-title"
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            Mark Attendance
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              color: "#dbeafe",
              lineHeight: 1.5,
            }}
          >
            Record attendance for students in your assigned courses.
          </p>
        </div>

        <div
          className="attendance-panel-badge"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <Activity size={20} />

          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#bfdbfe",
                fontWeight: 700,
              }}
            >
              ATTENDANCE
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginTop: "2px",
              }}
            >
              Faculty Panel
            </div>
          </div>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}

      {message && (
        <div
          className="attendance-message"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            borderRadius: "15px",
            padding: "15px 18px",
            marginBottom: "18px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <CheckCircle size={21} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          className="attendance-message"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            borderRadius: "15px",
            padding: "15px 18px",
            marginBottom: "18px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <AlertCircle size={21} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= CONTENT ROW ================= */}

      <div
        className="attendance-main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.8fr) minmax(280px, 1fr)",
          gap: "22px",
          alignItems: "start",
        }}
      >
        {/* ================= FORM CARD ================= */}

        <div
          className="attendance-form-card"
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "26px",
            boxShadow: "0 7px 25px rgba(15, 23, 42, 0.07)",
          }}
        >
          {/* Form heading */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
              paddingBottom: "20px",
              marginBottom: "22px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClipboardCheck size={24} />
            </div>

            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Attendance Form
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Enter attendance details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ================= STUDENT + COURSE ================= */}

            <div
              className="attendance-fields"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
                marginBottom: "18px",
              }}
            >
              {/* Student */}

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  <UserRound size={16} color="#2563eb" />
                  Select Student
                </label>

                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 13px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Choose student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.userId?.name ||
                        student.name ||
                        "Unnamed Student"}

                      {student.rollNumber
                        ? ` - ${student.rollNumber}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course */}

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  <BookOpen size={16} color="#7c3aed" />
                  Select Course
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 13px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Choose course</option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ================= DATE + STATUS ================= */}

            <div
              className="attendance-fields"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
                marginBottom: "22px",
              }}
            >
              {/* Date */}

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  <CalendarDays size={16} color="#059669" />
                  Attendance Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 13px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Status */}

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  <Activity size={16} color="#ea580c" />
                  Attendance Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 13px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                height: "52px",
                border: "none",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.65 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
                boxShadow: "0 7px 18px rgba(37, 99, 235, 0.25)",
              }}
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={20}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Saving Attendance...
                </>
              ) : (
                <>
                  <ClipboardCheck size={20} />
                  Mark Attendance
                </>
              )}
            </button>
          </form>
        </div>

        {/* ================= SIDE INFO ================= */}

        <div
          className="attendance-side-info"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Students Card */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "22px",
              boxShadow: "0 7px 25px rgba(15, 23, 42, 0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "13px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <UserRound size={21} />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Available Students
                </p>

                <h3
                  style={{
                    margin: "3px 0 0",
                    fontSize: "25px",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {students.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Courses Card */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "22px",
              boxShadow: "0 7px 25px rgba(15, 23, 42, 0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "13px",
                  background: "#f5f3ff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={21} />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Assigned Courses
                </p>

                <h3
                  style={{
                    margin: "3px 0 0",
                    fontSize: "25px",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {courses.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Instructions */}

          <div
            style={{
              background:
                "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
              border: "1px solid #bbf7d0",
              borderRadius: "20px",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <CheckCircle size={20} color="#059669" />

              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#065f46",
                }}
              >
                Quick Guide
              </h3>
            </div>

            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#047857",
              }}
            >
              <p style={{ margin: "0 0 6px" }}>
                1. Select a student
              </p>

              <p style={{ margin: "0 0 6px" }}>
                2. Select the course
              </p>

              <p style={{ margin: "0 0 6px" }}>
                3. Choose attendance date
              </p>

              <p style={{ margin: 0 }}>
                4. Select Present or Absent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE ================= */}

      <style>{`
        /* Large Tablet */

        @media (max-width: 1000px) {
          .teacher-attendance-page {
            padding: 22px !important;
          }

          .attendance-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Tablet */

        @media (max-width: 800px) {
          .attendance-header {
            padding: 25px !important;
          }

          .attendance-header-title {
            font-size: 29px !important;
          }

          .attendance-fields {
            grid-template-columns: 1fr !important;
          }
        }

        /* Mobile */

        @media (max-width: 600px) {
          .teacher-attendance-page {
            padding: 14px !important;
          }

          .attendance-header {
            padding: 20px !important;
            border-radius: 20px !important;
            margin-bottom: 16px !important;
          }

          .attendance-header-title {
            font-size: 25px !important;
          }

          .attendance-header p {
            font-size: 13px !important;
          }

          .attendance-header-icon {
            width: 38px !important;
            height: 38px !important;
          }

          .attendance-panel-badge {
            width: 100% !important;
            justify-content: flex-start !important;
          }

          .attendance-message {
            align-items: flex-start !important;
            padding: 13px 14px !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
          }

          .attendance-form-card {
            padding: 18px !important;
            border-radius: 18px !important;
          }

          .attendance-side-info > div {
            padding: 18px !important;
            border-radius: 18px !important;
          }

          .attendance-main-grid {
            gap: 16px !important;
          }
        }

        /* Small Mobile */

        @media (max-width: 400px) {
          .teacher-attendance-page {
            padding: 10px !important;
          }

          .attendance-header {
            padding: 17px !important;
            border-radius: 17px !important;
          }

          .attendance-header-title {
            font-size: 22px !important;
          }

          .attendance-form-card {
            padding: 15px !important;
          }

          .attendance-fields {
            gap: 14px !important;
          }

          .attendance-form-card select,
          .attendance-form-card input {
            height: 46px !important;
            font-size: 13px !important;
          }

          .attendance-form-card button {
            height: 49px !important;
            font-size: 14px !important;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherAttendance;