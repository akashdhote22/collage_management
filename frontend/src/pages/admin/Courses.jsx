import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  courseCode: "",
  courseName: "",
  department: "",
  semester: "",
  credits: "",
  description: "",
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");

      const courseData =
        response.data.courses ||
        response.data.data ||
        response.data ||
        [];

      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setIsEditMode(false);
    setSelectedCourseId(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setIsEditMode(true);
    setSelectedCourseId(course._id);

    setFormData({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      department: course.department || "",
      semester: course.semester || "",
      credits: course.credits || "",
      description: course.description || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setIsEditMode(false);
    setSelectedCourseId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        courseCode: formData.courseCode,
        courseName: formData.courseName,
        department: formData.department,
        semester: Number(formData.semester),
        credits: Number(formData.credits),
        description: formData.description,
      };

      if (isEditMode) {
        await api.put(`/courses/${selectedCourseId}`, payload);
      } else {
        await api.post("/courses", payload);
      }

      closeModal();
      fetchCourses();
    } catch (err) {
      console.error("Save course error:", err);

      setError(
        err.response?.data?.message || "Failed to save course"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete course error:", err);

      setError(
        err.response?.data?.message || "Failed to delete course"
      );
    }
  };

  const filteredCourses = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return courses.filter((course) => {
      return (
        course.courseCode?.toLowerCase().includes(search) ||
        course.courseName?.toLowerCase().includes(search) ||
        course.department?.toLowerCase().includes(search) ||
        String(course.semester).includes(search)
      );
    });
  }, [courses, searchTerm]);

  const totalCredits = courses.reduce(
    (sum, course) => sum + Number(course.credits || 0),
    0
  );

  const departments = new Set(
    courses.map((course) => course.department).filter(Boolean)
  ).size;

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
                <BookOpen size={22} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                Academic Management
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Course Management
            </h1>

            <p className="mt-1.5 max-w-xl text-sm text-blue-100 sm:text-base">
              Create, manage and organize courses for your college.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#174a8b] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
          >
            <Plus size={19} />
            Add Course
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {courses.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Departments
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {departments}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total Credits
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalCredits}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Clock3 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              All Courses
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search code, name, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={fetchCourses}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Course Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Course Name
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Semester
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Credits
                </th>

                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading courses...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-14 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                        <BookOpen size={28} />
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-700">
                        No courses found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or add a new course.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        {course.courseCode}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="max-w-xs">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {course.courseName}
                        </p>

                        {course.description && (
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      {course.department}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Semester {course.semester}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-700">
                        {course.credits}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                          title="Edit course"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(course._id)}
                          className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                          title="Delete course"
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
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <BookOpen size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    {isEditMode ? "Edit Course" : "Add Course"}
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {isEditMode
                    ? "Update course information"
                    : "Enter course information"}
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
            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Course Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Course Code
                  </label>

                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="e.g. CS101"
                    required
                    disabled={isEditMode}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm uppercase text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Course Name
                  </label>

                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Engineering"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select semester</option>

                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Credits */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    placeholder="e.g. 4"
                    min="1"
                    max="10"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
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
                    ? "Update Course"
                    : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;