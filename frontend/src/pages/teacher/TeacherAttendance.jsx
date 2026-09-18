import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  ClipboardCheck,
  LoaderCircle,
  CheckCircle,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <LoaderCircle className="mr-2 animate-spin" size={22} />
        Loading attendance data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Mark Attendance
        </h1>

        <p className="mt-1 text-gray-500">
          Mark attendance for students in your assigned courses.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle size={20} className="mr-2" />
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Attendance Form */}
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-3 rounded-lg bg-blue-100 p-3 text-blue-600">
            <ClipboardCheck size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Attendance Form
            </h2>

            <p className="text-sm text-gray-500">
              Select student, course, date and attendance status.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Student
            </label>

            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">Choose student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.userId?.name || student.name || "Unnamed Student"}
                  {student.rollNumber
                    ? ` - ${student.rollNumber}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Course
            </label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">Choose course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attendance Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attendance Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle
                  size={20}
                  className="mr-2 animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <ClipboardCheck size={20} className="mr-2" />
                Mark Attendance
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAttendance;