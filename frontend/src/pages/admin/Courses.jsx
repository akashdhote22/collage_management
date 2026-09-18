import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
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

  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();

    return (
      course.courseCode?.toLowerCase().includes(search) ||
      course.courseName?.toLowerCase().includes(search) ||
      course.department?.toLowerCase().includes(search) ||
      String(course.semester).includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage college courses
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Course
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
            placeholder="Search by code, name, department..."
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

      {/* Courses Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course Code
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course Name
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Semester
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Credits
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
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No courses found
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-blue-600">
                      {course.courseCode}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                      {course.courseName}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {course.department}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      Semester {course.semester}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {course.credits}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit course"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(course._id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isEditMode ? "Edit Course" : "Add Course"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEditMode
                    ? "Update course information"
                    : "Enter course information"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Course Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Course Name
                  </label>

                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Engineering"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  rows="4"
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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