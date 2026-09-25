import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  BookOpen,
  LoaderCircle,
  GraduationCap,
  Building2,
  CalendarDays,
  Award,
  BookMarked,
  AlertCircle,
} from "lucide-react";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers/courses");

      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Fetch teacher courses error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="teacher-courses-page">

      {/* ================= HEADER ================= */}

      <div className="teacher-courses-header">
        <div className="teacher-courses-header-content">
          <div className="teacher-courses-title-row">
            <div className="teacher-courses-header-icon">
              <GraduationCap size={24} />
            </div>

            <span className="teacher-courses-portal-label">
              FACULTY PORTAL
            </span>
          </div>

          <h1>My Courses</h1>

          <p>
            View the courses assigned to you.
          </p>
        </div>

        {/* Course Count */}

        <div className="teacher-courses-count">
          <BookOpen size={22} />

          <div>
            <div className="teacher-courses-count-label">
              ASSIGNED COURSES
            </div>

            <div className="teacher-courses-count-number">
              {courses.length}
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="teacher-courses-loading">
          <LoaderCircle
            size={42}
            color="#2563eb"
            className="teacher-courses-spinner"
          />

          <h2>Loading Courses</h2>

          <p>
            Fetching your assigned courses...
          </p>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="teacher-courses-error">
          <AlertCircle size={20} />

          <span>{error}</span>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!loading &&
        !error &&
        courses.length === 0 && (
          <div className="teacher-courses-empty">
            <div className="teacher-courses-empty-icon">
              <BookOpen size={32} />
            </div>

            <h2>No Courses Assigned</h2>

            <p>
              Courses assigned through the timetable
              will appear here.
            </p>
          </div>
        )}

      {/* ================= COURSES ================= */}

      {!loading &&
        !error &&
        courses.length > 0 && (
          <>
            <div className="teacher-courses-section-header">
              <div>
                <h2>Assigned Courses</h2>

                <p>
                  Your current teaching subjects
                </p>
              </div>

              <div className="teacher-courses-badge">
                {courses.length}{" "}
                {courses.length === 1
                  ? "Course"
                  : "Courses"}
              </div>
            </div>

            <div className="teacher-courses-grid">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="teacher-course-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-4px)";

                    e.currentTarget.style.boxShadow =
                      "0 14px 32px rgba(15, 23, 42, 0.11)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";

                    e.currentTarget.style.boxShadow =
                      "0 7px 25px rgba(15, 23, 42, 0.06)";
                  }}
                >

                  {/* Card Top */}

                  <div className="teacher-course-card-top" />

                  <div className="teacher-course-card-content">

                    {/* Icon + Code */}

                    <div className="teacher-course-card-top-row">
                      <div className="teacher-course-icon">
                        <BookOpen size={25} />
                      </div>

                      <span className="teacher-course-code">
                        {course.courseCode}
                      </span>
                    </div>

                    {/* Course Name */}

                    <h2 className="teacher-course-name">
                      {course.courseName}
                    </h2>

                    {/* Details */}

                    <div className="teacher-course-details">

                      {/* Department */}

                      <div className="teacher-course-detail-row">
                        <div className="teacher-course-detail-icon department-icon">
                          <Building2 size={17} />
                        </div>

                        <div>
                          <div className="teacher-course-detail-label">
                            Department
                          </div>

                          <div className="teacher-course-detail-value">
                            {course.department ||
                              "Not specified"}
                          </div>
                        </div>
                      </div>

                      {/* Semester */}

                      <div className="teacher-course-detail-row">
                        <div className="teacher-course-detail-icon semester-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <div className="teacher-course-detail-label">
                            Semester
                          </div>

                          <div className="teacher-course-detail-value">
                            Semester{" "}
                            {course.semester}
                          </div>
                        </div>
                      </div>

                      {/* Credits */}

                      <div className="teacher-course-detail-row">
                        <div className="teacher-course-detail-icon credits-icon">
                          <Award size={17} />
                        </div>

                        <div>
                          <div className="teacher-course-detail-label">
                            Credits
                          </div>

                          <div className="teacher-course-detail-value">
                            {course.credits} Credits
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Description */}

                    {course.description && (
                      <div className="teacher-course-description">
                        <div className="teacher-course-description-title">
                          <BookMarked
                            size={15}
                            color="#64748b"
                          />

                          <span>
                            Description
                          </span>
                        </div>

                        <p>
                          {course.description}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      {/* ================= RESPONSIVE CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .teacher-courses-page {
          min-height: 100vh;
          background: #f1f5f9;
          padding: 28px;
        }

        /* ================= HEADER ================= */

        .teacher-courses-header {
          background:
            linear-gradient(
              135deg,
              #0f172a 0%,
              #1e3a8a 55%,
              #2563eb 100%
            );

          border-radius: 24px;
          padding: 30px;
          margin-bottom: 24px;

          color: #ffffff;

          box-shadow:
            0 12px 35px rgba(15, 23, 42, 0.16);

          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 20px;
          flex-wrap: wrap;
        }

        .teacher-courses-header-content {
          min-width: 0;
        }

        .teacher-courses-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .teacher-courses-header-icon {
          width: 44px;
          height: 44px;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.15);

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .teacher-courses-portal-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #bfdbfe;
        }

        .teacher-courses-header h1 {
          margin: 0;

          font-size: 32px;
          font-weight: 800;

          color: #ffffff;
        }

        .teacher-courses-header p {
          margin: 8px 0 0;

          font-size: 14px;
          color: #dbeafe;
        }

        .teacher-courses-count {
          display: flex;
          align-items: center;
          gap: 12px;

          background:
            rgba(255, 255, 255, 0.12);

          border:
            1px solid rgba(255, 255, 255, 0.15);

          border-radius: 16px;

          padding: 14px 18px;

          flex-shrink: 0;
        }

        .teacher-courses-count-label {
          font-size: 11px;
          color: #bfdbfe;
          font-weight: 700;
        }

        .teacher-courses-count-number {
          margin-top: 2px;

          font-size: 20px;
          font-weight: 800;
        }

        /* ================= LOADING ================= */

        .teacher-courses-loading {
          background: #ffffff;

          border-radius: 22px;

          padding: 70px 20px;

          text-align: center;

          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.06);
        }

        .teacher-courses-spinner {
          display: block;
          margin: 0 auto 15px;

          animation:
            teacherCoursesSpin 1s linear infinite;
        }

        .teacher-courses-loading h2 {
          margin: 0;

          font-size: 20px;
          font-weight: 800;

          color: #0f172a;
        }

        .teacher-courses-loading p {
          margin-top: 7px;

          font-size: 14px;
          color: #64748b;
        }

        @keyframes teacherCoursesSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ================= ERROR ================= */

        .teacher-courses-error {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 16px 18px;

          border-radius: 15px;

          background: #fef2f2;

          border: 1px solid #fecaca;

          color: #dc2626;

          font-size: 14px;
          font-weight: 600;
        }

        /* ================= EMPTY ================= */

        .teacher-courses-empty {
          background: #ffffff;

          border-radius: 22px;

          padding: 70px 25px;

          text-align: center;

          border:
            2px dashed #cbd5e1;
        }

        .teacher-courses-empty-icon {
          width: 70px;
          height: 70px;

          border-radius: 20px;

          background: #eff6ff;
          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 18px;
        }

        .teacher-courses-empty h2 {
          margin: 0;

          font-size: 20px;
          font-weight: 800;

          color: #1e293b;
        }

        .teacher-courses-empty p {
          margin: 8px auto 0;

          max-width: 450px;

          font-size: 14px;
          line-height: 1.6;

          color: #64748b;
        }

        /* ================= SECTION HEADER ================= */

        .teacher-courses-section-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          margin-bottom: 16px;

          gap: 10px;

          flex-wrap: wrap;
        }

        .teacher-courses-section-header h2 {
          margin: 0;

          font-size: 20px;
          font-weight: 800;

          color: #0f172a;
        }

        .teacher-courses-section-header p {
          margin: 4px 0 0;

          font-size: 13px;
          color: #64748b;
        }

        .teacher-courses-badge {
          background: #dbeafe;

          color: #1d4ed8;

          border-radius: 999px;

          padding: 7px 13px;

          font-size: 12px;
          font-weight: 800;
        }

        /* ================= GRID ================= */

        .teacher-courses-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 20px;
        }

        /* ================= COURSE CARD ================= */

        .teacher-course-card {
          background: #ffffff;

          border-radius: 22px;

          overflow: hidden;

          border:
            1px solid #e2e8f0;

          box-shadow:
            0 7px 25px rgba(15, 23, 42, 0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .teacher-course-card-top {
          height: 7px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed
            );
        }

        .teacher-course-card-content {
          padding: 22px;
        }

        .teacher-course-card-top-row {
          display: flex;

          justify-content: space-between;
          align-items: center;

          gap: 10px;

          margin-bottom: 18px;
        }

        .teacher-course-icon {
          width: 50px;
          height: 50px;

          border-radius: 15px;

          background: #eff6ff;
          color: #2563eb;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .teacher-course-code {
          background: #eef2ff;

          color: #4338ca;

          border-radius: 9px;

          padding: 7px 10px;

          font-size: 12px;
          font-weight: 800;

          white-space: nowrap;

          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 55%;
        }

        .teacher-course-name {
          margin: 0;

          font-size: 19px;
          line-height: 1.35;

          font-weight: 800;

          color: #0f172a;

          overflow-wrap: anywhere;
        }

        /* ================= DETAILS ================= */

        .teacher-course-details {
          margin-top: 20px;

          border-top:
            1px solid #e2e8f0;

          padding-top: 17px;

          display: grid;

          gap: 12px;
        }

        .teacher-course-detail-row {
          display: flex;

          align-items: center;

          gap: 11px;

          min-width: 0;
        }

        .teacher-course-detail-icon {
          width: 34px;
          height: 34px;

          border-radius: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .department-icon {
          background: #f0fdf4;
          color: #16a34a;
        }

        .semester-icon {
          background: #fff7ed;
          color: #ea580c;
        }

        .credits-icon {
          background: #faf5ff;
          color: #9333ea;
        }

        .teacher-course-detail-label {
          font-size: 11px;

          color: #94a3b8;

          font-weight: 700;

          text-transform: uppercase;
        }

        .teacher-course-detail-value {
          margin-top: 2px;

          font-size: 13px;

          color: #334155;

          font-weight: 700;

          overflow-wrap: anywhere;
        }

        /* ================= DESCRIPTION ================= */

        .teacher-course-description {
          margin-top: 18px;

          padding: 14px;

          border-radius: 12px;

          background: #f8fafc;

          border:
            1px solid #e2e8f0;
        }

        .teacher-course-description-title {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 6px;
        }

        .teacher-course-description-title span {
          font-size: 11px;

          font-weight: 800;

          color: #64748b;

          text-transform: uppercase;
        }

        .teacher-course-description p {
          margin: 0;

          font-size: 13px;

          line-height: 1.55;

          color: #64748b;

          overflow-wrap: anywhere;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1100px) {

          .teacher-courses-page {
            padding: 22px;
          }

          .teacher-courses-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {

          .teacher-courses-header {
            padding: 25px;
          }

          .teacher-courses-header h1 {
            font-size: 29px;
          }

          .teacher-courses-count {
            min-width: 190px;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 700px) {

          .teacher-courses-page {
            padding: 14px;
          }

          .teacher-courses-header {
            padding: 21px;

            border-radius: 20px;

            align-items: stretch;
          }

          .teacher-courses-header h1 {
            font-size: 25px;
          }

          .teacher-courses-header p {
            font-size: 13px;

            line-height: 1.5;
          }

          .teacher-courses-count {
            width: 100%;

            min-width: 0;
          }

          .teacher-courses-grid {
            grid-template-columns: 1fr;

            gap: 14px;
          }

          .teacher-course-card-content {
            padding: 19px;
          }

          .teacher-course-name {
            font-size: 18px;
          }

          .teacher-courses-section-header {
            align-items: flex-start;
          }

          .teacher-courses-badge {
            align-self: center;
          }

          .teacher-courses-loading {
            padding: 55px 15px;
          }

          .teacher-courses-empty {
            padding: 55px 18px;
          }
        }

        /* ================= SMALL MOBILE ================= */

        @media (max-width: 400px) {

          .teacher-courses-page {
            padding: 10px;
          }

          .teacher-courses-header {
            padding: 17px;

            border-radius: 17px;
          }

          .teacher-courses-title-row {
            gap: 8px;
          }

          .teacher-courses-header-icon {
            width: 38px;
            height: 38px;

            border-radius: 11px;
          }

          .teacher-courses-portal-label {
            font-size: 11px;
          }

          .teacher-courses-header h1 {
            font-size: 22px;
          }

          .teacher-courses-header p {
            font-size: 12px;
          }

          .teacher-courses-count {
            padding: 12px;
          }

          .teacher-courses-count-label {
            font-size: 10px;
          }

          .teacher-courses-count-number {
            font-size: 18px;
          }

          .teacher-courses-section-header h2 {
            font-size: 18px;
          }

          .teacher-courses-section-header p {
            font-size: 12px;
          }

          .teacher-courses-card {
            border-radius: 18px;
          }

          .teacher-course-card-content {
            padding: 16px;
          }

          .teacher-course-icon {
            width: 45px;
            height: 45px;
          }

          .teacher-course-code {
            font-size: 11px;
            padding: 6px 8px;
          }

          .teacher-course-name {
            font-size: 17px;
          }

          .teacher-course-detail-value {
            font-size: 12px;
          }

          .teacher-course-description {
            padding: 12px;
          }
        }

      `}</style>
    </div>
  );
};

export default TeacherCourses;