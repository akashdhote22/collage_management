import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const initialForm = {
  studentId: "",
  courseId: "",
  date: "",
  status: "present",
};

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const response = await api.get("/attendance");

      const data =
        response.data.attendance ||
        response.data.records ||
        response.data.data ||
        response.data ||
        [];

      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch attendance error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");

      const data =
        response.data.students ||
        response.data.data ||
        response.data ||
        [];

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch students error:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");

      const data =
        response.data.courses ||
        response.data.data ||
        response.data ||
        [];

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch courses error:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchStudents();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    const today = new Date().toISOString().split("T")[0];

    setIsEditMode(false);
    setSelectedAttendanceId(null);
    setFormData({
      ...initialForm,
      date: today,
    });
    setError("");
    setShowModal(true);
  };

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";

    if (student.userId?.name) {
      return student.userId.name;
    }

    if (student.name) {
      return student.name;
    }

    return "Unknown Student";
  };

  const getStudentEmail = (student) => {
    if (!student) return "";

    return student.userId?.email || student.email || "";
  };

  const getCourseName = (course) => {
    if (!course) return "Unknown Course";

    if (course.courseName && course.courseCode) {
      return `${course.courseCode} - ${course.courseName}`;
    }

    return course.courseName || course.name || "Unknown Course";
  };

  const openEditModal = (record) => {
    setIsEditMode(true);
    setSelectedAttendanceId(record._id);

    const studentId =
      record.studentId?._id ||
      record.studentId ||
      "";

    const courseId =
      record.courseId?._id ||
      record.courseId ||
      "";

    const formattedDate = record.date
      ? new Date(record.date).toISOString().split("T")[0]
      : "";

    setFormData({
      studentId,
      courseId,
      date: formattedDate,
      status: record.status || "present",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setIsEditMode(false);
    setSelectedAttendanceId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        studentId: formData.studentId,
        courseId: formData.courseId,
        date: formData.date,
        status: formData.status,
      };

      if (isEditMode) {
        await api.put(
          `/attendance/${selectedAttendanceId}`,
          payload
        );
      } else {
        await api.post("/attendance", payload);
      }

      closeModal();
      fetchAttendance();
    } catch (err) {
      console.error("Save attendance error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save attendance"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (attendanceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/attendance/${attendanceId}`);
      fetchAttendance();
    } catch (err) {
      console.error("Delete attendance error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete attendance"
      );
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const studentName = getStudentName(record.studentId).toLowerCase();
    const studentEmail = getStudentEmail(record.studentId).toLowerCase();
    const courseName = getCourseName(record.courseId).toLowerCase();
    const status = record.status?.toLowerCase() || "";

    const search = searchTerm.toLowerCase();

    return (
      studentName.includes(search) ||
      studentEmail.includes(search) ||
      courseName.includes(search) ||
      status.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student attendance records
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Mark Attendance
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student, email, course, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Loading attendance...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {getStudentName(record.studentId)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {getStudentEmail(record.studentId)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {getCourseName(record.courseId)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit attendance"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(record._id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Delete attendance"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isEditMode
                    ? "Edit Attendance"
                    : "Mark Attendance"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEditMode
                    ? "Update attendance record"
                    : "Add a new attendance record"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Student */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Student
                </label>

                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">Select student</option>

                  {students.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {getStudentName(student)}
                      {student.rollNumber
                        ? ` - ${student.rollNumber}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Course
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">Select course</option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm capitalize outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : isEditMode
                    ? "Update Attendance"
                    : "Mark Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;