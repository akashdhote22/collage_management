import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
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
      setError("");

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
        err.response?.data?.message ||
          "Failed to fetch attendance"
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

  const filteredAttendance = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return attendance.filter((record) => {
      const studentName = getStudentName(
        record.studentId
      ).toLowerCase();

      const studentEmail = getStudentEmail(
        record.studentId
      ).toLowerCase();

      const courseName = getCourseName(
        record.courseId
      ).toLowerCase();

      const status =
        record.status?.toLowerCase() || "";

      return (
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        courseName.includes(search) ||
        status.includes(search)
      );
    });
  }, [attendance, searchTerm]);

  const presentCount = attendance.filter(
    (record) => record.status === "present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "absent"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round(
          (presentCount / attendance.length) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 sm:p-5 md:p-6 lg:p-8">
      {/* Hero Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2d5c] via-[#174a8b] to-[#2563b8] p-5 text-white shadow-xl sm:p-6 md:p-7">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
                <ClipboardCheck size={22} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                Academic Management
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Attendance Management
            </h1>

            <p className="mt-1.5 max-w-xl text-sm text-blue-100 sm:text-base">
              Track and manage student attendance records.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#174a8b] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
          >
            <Plus size={19} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Records
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {attendance.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ClipboardCheck size={22} />
            </div>
          </div>
        </div>

        {/* Present */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Present
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {presentCount}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Absent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Absent
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {absentCount}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Attendance Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {attendancePercentage}%
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Attendance Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredAttendance.length} record
              {filteredAttendance.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student, course, status..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            onClick={fetchAttendance}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading attendance...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                        <ClipboardCheck size={28} />
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-700">
                        No attendance records found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or mark new attendance.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/40"
                  >
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                          {getStudentName(
                            record.studentId
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {getStudentName(
                              record.studentId
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {getStudentEmail(
                              record.studentId
                            ) || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <p className="max-w-xs text-sm font-medium text-slate-700">
                        {getCourseName(record.courseId)}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />

                        {record.date
                          ? new Date(
                              record.date
                            ).toLocaleDateString()
                          : "-"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          record.status === "present"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {record.status === "present" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {record.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(record)
                          }
                          className="rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                          title="Edit attendance"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(record._id)
                          }
                          className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <ClipboardCheck size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    {isEditMode
                      ? "Edit Attendance"
                      : "Mark Attendance"}
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {isEditMode
                    ? "Update attendance record"
                    : "Add a new attendance record"}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Student */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Student
                </label>

                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    Select student
                  </option>

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
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Course
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    Select course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} -{" "}
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Attendance Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm capitalize text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="present">
                    Present
                  </option>

                  <option value="absent">
                    Absent
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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