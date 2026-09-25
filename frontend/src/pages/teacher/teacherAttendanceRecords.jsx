import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  ClipboardList,
  LoaderCircle,
  Search,
  CalendarDays,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
  Filter,
  AlertCircle,
} from "lucide-react";

const TeacherAttendanceRecords = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance");

      setAttendances(response.data.attendances || []);
    } catch (err) {
      console.error("Fetch attendance records error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const getStudentName = (attendance) => {
    return (
      attendance.studentId?.userId?.name ||
      attendance.studentId?.name ||
      "Unknown Student"
    );
  };

  const getCourseName = (attendance) => {
    const course = attendance.courseId;

    if (!course) {
      return "Unknown Course";
    }

    return `${course.courseCode || ""} ${
      course.courseName || ""
    }`.trim();
  };

  const filteredAttendances = attendances.filter((attendance) => {
    const studentName = getStudentName(attendance).toLowerCase();
    const courseName = getCourseName(attendance).toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      studentName.includes(search) ||
      courseName.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      attendance.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const presentCount = filteredAttendances.filter(
    (attendance) => attendance.status === "present"
  ).length;

  const absentCount = filteredAttendances.filter(
    (attendance) => attendance.status === "absent"
  ).length;

  const getInitials = (name) => {
    if (!name || name === "Unknown Student") {
      return "U";
    }

    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="attendance-loading-card">
          <LoaderCircle
            size={42}
            color="#2563eb"
            className="attendance-spinner"
          />

          <h2>Loading Attendance Records</h2>

          <p>Fetching attendance information...</p>
        </div>

        <style>{`
          .attendance-page {
            min-height: 100vh;
            background: #f1f5f9;
            padding: 28px;
          }

          .attendance-loading-card {
            background: #ffffff;
            border-radius: 22px;
            padding: 70px 20px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(15, 23, 42, 0.07);
          }

          .attendance-loading-card h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
          }

          .attendance-loading-card p {
            margin-top: 7px;
            font-size: 14px;
            color: #64748b;
          }

          .attendance-spinner {
            display: block;
            margin: 0 auto 15px;
            animation: attendanceSpin 1s linear infinite;
          }

          @keyframes attendanceSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 700px) {
            .attendance-page {
              padding: 16px;
            }

            .attendance-loading-card {
              padding: 55px 15px;
            }
          }

          @media (max-width: 400px) {
            .attendance-page {
              padding: 10px;
            }

            .attendance-loading-card {
              border-radius: 16px;
            }

            .attendance-loading-card h2 {
              font-size: 18px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="attendance-page">

      {/* ================= HEADER ================= */}

      <div className="attendance-header">
        <div className="attendance-header-content">
          <div className="attendance-title-row">
            <div className="attendance-header-icon">
              <ClipboardList size={23} />
            </div>

            <span className="attendance-portal-label">
              FACULTY PORTAL
            </span>
          </div>

          <h1>Attendance Records</h1>

          <p>
            View and manage attendance records of students.
          </p>
        </div>

        <div className="attendance-record-badge">
          <ClipboardList size={21} />

          <div>
            <div className="attendance-record-label">
              RECORDS
            </div>

            <div className="attendance-record-title">
              Academic Attendance
            </div>
          </div>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="attendance-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= FILTERS ================= */}

      <div className="attendance-filters">

        {/* Search */}

        <div className="attendance-search">
          <Search
            size={19}
            color="#94a3b8"
          />

          <input
            type="text"
            placeholder="Search student or course..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        {/* Filter */}

        <div className="attendance-status-filter">
          <Filter
            size={17}
            color="#64748b"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="present">
              Present
            </option>

            <option value="absent">
              Absent
            </option>
          </select>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="attendance-summary-grid">

        {/* Total */}

        <div className="attendance-summary-card total-card">
          <div className="summary-content">
            <div>
              <p>Total Records</p>

              <h2>
                {filteredAttendances.length}
              </h2>

              <span>
                Attendance entries
              </span>
            </div>

            <div className="summary-icon total-icon">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Present */}

        <div className="attendance-summary-card present-card">
          <div className="summary-content">
            <div>
              <p>Present Records</p>

              <h2>
                {presentCount}
              </h2>

              <span>
                Students present
              </span>
            </div>

            <div className="summary-icon present-icon">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        {/* Absent */}

        <div className="attendance-summary-card absent-card">
          <div className="summary-content">
            <div>
              <p>Absent Records</p>

              <h2>
                {absentCount}
              </h2>

              <span>
                Students absent
              </span>
            </div>

            <div className="summary-icon absent-icon">
              <UserX size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="attendance-table-card">

        {/* Table Header */}

        <div className="attendance-table-header">
          <div className="attendance-list-title">

            <div className="attendance-list-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <h2>
                Attendance List
              </h2>

              <p>
                {filteredAttendances.length} records found
              </p>
            </div>

          </div>
        </div>

        {/* Empty */}

        {filteredAttendances.length === 0 ? (
          <div className="attendance-empty">

            <div className="attendance-empty-icon">
              <ClipboardList size={27} />
            </div>

            <h3>
              No attendance records found
            </h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (

          /* Table */

          <div className="attendance-table-wrapper">
            <table className="attendance-table">

              <thead>
                <tr>
                  <th style={thStyle}>
                    Student
                  </th>

                  <th style={thStyle}>
                    Course
                  </th>

                  <th style={thStyle}>
                    Date
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendances.map(
                  (attendance) => {
                    const studentName =
                      getStudentName(attendance);

                    return (
                      <tr
                        key={attendance._id}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background =
                            "#f8fafc";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "#ffffff";
                        }}
                      >

                        {/* Student */}

                        <td style={tdStyle}>
                          <div className="student-cell">

                            <div className="student-avatar">
                              {getInitials(studentName)}
                            </div>

                            <div className="student-details">

                              <p>
                                {studentName}
                              </p>

                              {attendance.studentId
                                ?.rollNumber && (
                                <span>
                                  Roll No:{" "}
                                  {
                                    attendance.studentId
                                      .rollNumber
                                  }
                                </span>
                              )}

                            </div>
                          </div>
                        </td>

                        {/* Course */}

                        <td style={tdStyle}>
                          <div className="course-cell">

                            <BookIcon />

                            <span>
                              {getCourseName(
                                attendance
                              )}
                            </span>

                          </div>
                        </td>

                        {/* Date */}

                        <td style={tdStyle}>
                          <div className="date-cell">

                            <CalendarDays
                              size={17}
                              color="#64748b"
                            />

                            {formatDate(
                              attendance.date
                            )}
                          </div>
                        </td>

                        {/* Status */}

                        <td style={tdStyle}>
                          {attendance.status ===
                          "present" ? (
                            <span className="present-badge">
                              <CheckCircle size={15} />
                              Present
                            </span>
                          ) : (
                            <span className="absent-badge">
                              <XCircle size={15} />
                              Absent
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ================= RESPONSIVE CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .attendance-page {
          min-height: 100vh;
          background: #f1f5f9;
          padding: 28px;
        }

        /* HEADER */

        .attendance-header {
          background:
            linear-gradient(
              135deg,
              #0f172a 0%,
              #1e3a8a 55%,
              #2563eb 100%
            );

          border-radius: 24px;
          padding: 30px;
          margin-bottom: 22px;
          color: #ffffff;

          box-shadow:
            0 12px 35px rgba(15, 23, 42, 0.16);

          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .attendance-header-content {
          min-width: 0;
        }

        .attendance-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .attendance-header-icon {
          width: 43px;
          height: 43px;
          border-radius: 13px;

          background:
            rgba(255,255,255,0.15);

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .attendance-portal-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #bfdbfe;
        }

        .attendance-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
        }

        .attendance-header p {
          margin: 8px 0 0;
          font-size: 14px;
          color: #dbeafe;
        }

        .attendance-record-badge {
          display: flex;
          align-items: center;
          gap: 10px;

          background:
            rgba(255,255,255,0.12);

          border:
            1px solid rgba(255,255,255,0.15);

          border-radius: 16px;
          padding: 14px 18px;

          flex-shrink: 0;
        }

        .attendance-record-label {
          font-size: 11px;
          color: #bfdbfe;
          font-weight: 700;
        }

        .attendance-record-title {
          margin-top: 2px;
          font-size: 14px;
          font-weight: 700;
        }

        /* ERROR */

        .attendance-error {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 15px 18px;
          margin-bottom: 18px;

          border-radius: 15px;

          background: #fef2f2;
          border: 1px solid #fecaca;

          color: #dc2626;

          font-size: 14px;
          font-weight: 600;
        }

        /* FILTERS */

        .attendance-filters {
          background: #ffffff;
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 20px;

          box-shadow:
            0 6px 22px rgba(15, 23, 42, 0.06);

          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .attendance-search {
          position: relative;
          flex: 1;
          min-width: 260px;
          height: 48px;
        }

        .attendance-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
        }

        .attendance-search input {
          width: 100%;
          height: 48px;

          border-radius: 12px;
          border: 1px solid #cbd5e1;

          background: #f8fafc;

          padding-left: 43px;
          padding-right: 14px;

          outline: none;

          font-size: 14px;
          color: #1e293b;
        }

        .attendance-search input:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.10);
        }

        .attendance-status-filter {
          display: flex;
          align-items: center;
          gap: 9px;

          height: 48px;

          padding: 0 12px;

          border-radius: 12px;
          border: 1px solid #cbd5e1;

          background: #f8fafc;

          flex-shrink: 0;
        }

        .attendance-status-filter select {
          height: 100%;
          border: none;
          outline: none;

          background: transparent;

          color: #334155;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        /* SUMMARY */

        .attendance-summary-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;
          margin-bottom: 22px;
        }

        .attendance-summary-card {
          background: #ffffff;
          border-radius: 19px;
          padding: 20px;

          box-shadow:
            0 6px 20px rgba(15, 23, 42, 0.05);
        }

        .total-card {
          border: 1px solid #dbeafe;
        }

        .present-card {
          border: 1px solid #a7f3d0;
        }

        .absent-card {
          border: 1px solid #fecaca;
        }

        .summary-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .summary-content p {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }

        .total-card p {
          color: #64748b;
        }

        .present-card p {
          color: #059669;
        }

        .absent-card p {
          color: #dc2626;
        }

        .summary-content h2 {
          margin: 8px 0 0;
          font-size: 30px;
          font-weight: 800;
        }

        .total-card h2 {
          color: #0f172a;
        }

        .present-card h2 {
          color: #047857;
        }

        .absent-card h2 {
          color: #b91c1c;
        }

        .summary-content span {
          display: block;
          margin-top: 5px;

          font-size: 12px;
          color: #94a3b8;
        }

        .summary-icon {
          width: 50px;
          height: 50px;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .total-icon {
          background: #eff6ff;
          color: #2563eb;
        }

        .present-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .absent-icon {
          background: #fef2f2;
          color: #dc2626;
        }

        /* TABLE */

        .attendance-table-card {
          background: #ffffff;

          border-radius: 22px;

          overflow: hidden;

          box-shadow:
            0 7px 25px rgba(15, 23, 42, 0.07);
        }

        .attendance-table-header {
          padding: 20px 22px;

          border-bottom:
            1px solid #e2e8f0;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .attendance-list-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .attendance-list-icon {
          width: 43px;
          height: 43px;

          border-radius: 12px;

          background: #eff6ff;
          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .attendance-list-title h2 {
          margin: 0;

          font-size: 18px;
          font-weight: 800;

          color: #0f172a;
        }

        .attendance-list-title p {
          margin: 3px 0 0;

          font-size: 12px;
          color: #64748b;
        }

        .attendance-table-wrapper {
          overflow-x: auto;
          width: 100%;
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .student-avatar {
          width: 40px;
          height: 40px;

          border-radius: 12px;

          background: #eff6ff;
          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 13px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .student-details p {
          margin: 0;

          font-size: 14px;
          font-weight: 700;

          color: #1e293b;
        }

        .student-details span {
          display: block;

          margin-top: 3px;

          font-size: 11px;
          color: #94a3b8;
        }

        .course-cell {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .course-cell > span {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;

          font-size: 13px;
          color: #475569;
          font-weight: 600;
        }

        .present-badge,
        .absent-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 7px 11px;

          border-radius: 999px;

          font-size: 12px;
          font-weight: 800;
        }

        .present-badge {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .absent-badge {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        /* EMPTY */

        .attendance-empty {
          padding: 65px 20px;
          text-align: center;
        }

        .attendance-empty-icon {
          width: 60px;
          height: 60px;

          margin: 0 auto 15px;

          border-radius: 18px;

          background: #f1f5f9;
          color: #94a3b8;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .attendance-empty h3 {
          margin: 0;

          font-size: 17px;
          font-weight: 700;

          color: #334155;
        }

        .attendance-empty p {
          margin: 6px 0 0;

          font-size: 13px;
          color: #94a3b8;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1000px) {

          .attendance-page {
            padding: 22px;
          }

          .attendance-summary-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .attendance-summary-card:last-child {
            grid-column: span 2;
          }

          .attendance-header {
            padding: 26px;
          }

          .attendance-header h1 {
            font-size: 29px;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 700px) {

          .attendance-page {
            padding: 14px;
          }

          .attendance-header {
            padding: 21px;
            border-radius: 20px;
          }

          .attendance-header h1 {
            font-size: 25px;
          }

          .attendance-header p {
            font-size: 13px;
            line-height: 1.5;
          }

          .attendance-record-badge {
            width: 100%;
          }

          .attendance-filters {
            padding: 14px;
            border-radius: 17px;
          }

          .attendance-search {
            min-width: 100%;
          }

          .attendance-status-filter {
            width: 100%;
          }

          .attendance-status-filter select {
            flex: 1;
          }

          .attendance-summary-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .attendance-summary-card:last-child {
            grid-column: auto;
          }

          .attendance-summary-card {
            padding: 17px;
          }

          .summary-content h2 {
            font-size: 27px;
          }

          .attendance-table-card {
            border-radius: 18px;
          }

          .attendance-table-header {
            padding: 17px;
          }

          .attendance-list-title h2 {
            font-size: 16px;
          }

          .attendance-empty {
            padding: 50px 15px;
          }
        }

        /* ================= SMALL MOBILE ================= */

        @media (max-width: 400px) {

          .attendance-page {
            padding: 10px;
          }

          .attendance-header {
            padding: 17px;
            border-radius: 17px;
          }

          .attendance-title-row {
            gap: 8px;
          }

          .attendance-header-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
          }

          .attendance-portal-label {
            font-size: 11px;
          }

          .attendance-header h1 {
            font-size: 22px;
          }

          .attendance-header p {
            font-size: 12px;
          }

          .attendance-record-badge {
            padding: 12px;
          }

          .attendance-record-title {
            font-size: 13px;
          }

          .attendance-error {
            padding: 12px;
            font-size: 12px;
          }

          .attendance-filters {
            padding: 11px;
          }

          .attendance-search input,
          .attendance-status-filter {
            height: 44px;
          }

          .attendance-search {
            height: 44px;
          }

          .attendance-summary-card {
            border-radius: 16px;
            padding: 15px;
          }

          .summary-icon {
            width: 44px;
            height: 44px;
          }

          .summary-content h2 {
            font-size: 25px;
          }

          .attendance-table-header {
            padding: 14px;
          }

          .attendance-list-icon {
            width: 38px;
            height: 38px;
          }

          .attendance-list-title {
            gap: 9px;
          }

          .attendance-list-title h2 {
            font-size: 15px;
          }

          .attendance-empty {
            padding: 42px 12px;
          }
        }

      `}</style>
    </div>
  );
};

// ================= TABLE STYLES =================

const thStyle = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "17px 20px",
  textAlign: "left",
  verticalAlign: "middle",
};

// ================= BOOK ICON =================

const BookIcon = () => (
  <div
    style={{
      width: "32px",
      height: "32px",
      borderRadius: "9px",
      background: "#f5f3ff",
      color: "#7c3aed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <ClipboardList size={16} />
  </div>
);

export default TeacherAttendanceRecords;