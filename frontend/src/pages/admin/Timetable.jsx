import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  DoorOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import api from "../../services/api";

const initialForm = {
  day: "Monday",
  courseId: "",
  teacherId: "",
  semester: "",
  branch: "",
  startTime: "",
  endTime: "",
  roomNumber: "",
};

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(initialForm);

  const fetchTimetables = async () => {
    try {
      setLoading(true);

      const response = await api.get("/timetable");

      console.log("Timetable API Response:", response.data);

      const data =
        response.data.timetables ||
        response.data.data ||
        response.data ||
        [];

      setTimetables(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Timetable Fetch Error:", error);

      alert(
        error.response?.data?.message ||
          `Failed to fetch timetable. Status: ${
            error.response?.status || "Network Error"
          }`
      );
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teachers");

      const data =
        response.data.teachers ||
        response.data.data ||
        response.data ||
        [];

      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTimetables();
    fetchCourses();
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);

    setFormData({
      day: item.day || "Monday",
      courseId: item.courseId?._id || item.courseId || "",
      teacherId: item.teacherId?._id || item.teacherId || "",
      semester: item.semester || "",
      branch: item.branch || "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      roomNumber: item.roomNumber || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        semester: Number(formData.semester),
      };

      if (editingId) {
        await api.put(`/timetable/${editingId}`, payload);
        alert("Timetable updated successfully");
      } else {
        await api.post("/timetable", payload);
        alert("Timetable added successfully");
      }

      closeModal();
      fetchTimetables();
    } catch (error) {
      console.error("Error saving timetable:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save timetable"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable entry?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/timetable/${id}`);

      alert("Timetable deleted successfully");

      fetchTimetables();
    } catch (error) {
      console.error("Error deleting timetable:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete timetable"
      );
    }
  };

  const getCourseName = (course) => {
    if (!course) return "N/A";

    if (typeof course === "object") {
      return `${course.courseCode || ""} - ${
        course.courseName || ""
      }`;
    }

    const foundCourse = courses.find(
      (item) => item._id === course
    );

    return foundCourse
      ? `${foundCourse.courseCode} - ${foundCourse.courseName}`
      : "N/A";
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return "N/A";

    if (typeof teacher === "object") {
      return (
        teacher.userId?.name ||
        teacher.name ||
        teacher.employeeId ||
        "N/A"
      );
    }

    const foundTeacher = teachers.find(
      (item) => item._id === teacher
    );

    return foundTeacher
      ? foundTeacher.userId?.name ||
          foundTeacher.name ||
          foundTeacher.employeeId
      : "N/A";
  };

  const filteredTimetables = useMemo(() => {
    const searchText = searchTerm.toLowerCase();

    return timetables.filter((item) => {
      return (
        item.day?.toLowerCase().includes(searchText) ||
        item.branch?.toLowerCase().includes(searchText) ||
        item.roomNumber?.toLowerCase().includes(searchText) ||
        String(item.semester).includes(searchText) ||
        getCourseName(item.courseId)
          .toLowerCase()
          .includes(searchText) ||
        getTeacherName(item.teacherId)
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [timetables, searchTerm, courses, teachers]);

  const uniqueDays = new Set(
    timetables.map((item) => item.day)
  ).size;

  const uniqueCourses = new Set(
    timetables.map((item) =>
      typeof item.courseId === "object"
        ? item.courseId?._id
        : item.courseId
    )
  ).size;

  const uniqueTeachers = new Set(
    timetables.map((item) =>
      typeof item.teacherId === "object"
        ? item.teacherId?._id
        : item.teacherId
    )
  ).size;

  const getDayStyle = (day) => {
    const styles = {
      Monday: "bg-blue-100 text-blue-700",
      Tuesday: "bg-indigo-100 text-indigo-700",
      Wednesday: "bg-violet-100 text-violet-700",
      Thursday: "bg-cyan-100 text-cyan-700",
      Friday: "bg-emerald-100 text-emerald-700",
      Saturday: "bg-amber-100 text-amber-700",
    };

    return (
      styles[day] || "bg-slate-100 text-slate-700"
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 p-5 text-white shadow-lg md:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-200">
              <CalendarDays size={18} />
              Academic Schedule
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Timetable Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Create and manage college class schedules,
              teachers, rooms and academic timings.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
          >
            <Plus size={19} />
            Add Timetable
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Entries
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {timetables.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Active Days
              </p>

              <h2 className="mt-2 text-2xl font-bold text-indigo-600">
                {uniqueDays}
              </h2>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Courses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                {uniqueCourses}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <BookOpen size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Teachers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-violet-600">
                {uniqueTeachers}
              </h2>
            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <Users size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Class Schedule
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredTimetables.length} of{" "}
              {timetables.length} timetable entries
            </p>
          </div>

          <div className="relative w-full lg:max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search day, course, teacher, branch or room..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-14">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading timetable...
            </p>
          </div>
        ) : filteredTimetables.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
              <CalendarDays size={30} />
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              No timetable entries found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or create a new timetable entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Day
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Teacher
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Semester
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Branch
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Time
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Room
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTimetables.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/40"
                  >
                    {/* Day */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getDayStyle(
                          item.day
                        )}`}
                      >
                        {item.day}
                      </span>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                          <BookOpen size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {getCourseName(item.courseId)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Course
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Teacher */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {getTeacherName(item.teacherId)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Faculty
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                        Sem {item.semester}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {item.branch}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                        <Clock3 size={15} />

                        {item.startTime} - {item.endTime}
                      </div>
                    </td>

                    {/* Room */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                        <DoorOpen size={15} />

                        {item.roomNumber}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          title="Edit timetable"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-600 hover:text-white"
                          title="Delete timetable"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600">
                  <CalendarDays size={19} />

                  <span className="text-xs font-bold uppercase tracking-wide">
                    Schedule Management
                  </span>
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingId
                    ? "Edit Timetable"
                    : "Add Timetable"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure course, faculty and class timing.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 md:p-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Day */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} />
                    Day
                  </label>

                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">
                      Wednesday
                    </option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BookOpen size={16} />
                    Course
                  </label>

                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Course
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

                {/* Teacher */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRound size={16} />
                    Teacher
                  </label>

                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Teacher
                    </option>

                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.userId?.name ||
                          teacher.name ||
                          teacher.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="Enter semester"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Computer Engineering"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <DoorOpen size={16} />
                    Room Number
                  </label>

                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="Room 101"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 size={16} />
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 size={16} />
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {editingId
                    ? "Update Timetable"
                    : "Add Timetable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;