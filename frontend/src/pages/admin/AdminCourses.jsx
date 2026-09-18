import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Add course form
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    department: "",
    semester: "",
    credits: "",
    description: "",
  });

  // Edit course states
  const [editingCourse, setEditingCourse] = useState(null);

  const [editFormData, setEditFormData] = useState({
    courseCode: "",
    courseName: "",
    department: "",
    semester: "",
    credits: "",
    description: "",
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");

      setCourses(response.data.courses || []);
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

  // Handle add course form
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Create course
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await api.post("/courses", {
        ...formData,
        semester: Number(formData.semester),
        credits: Number(formData.credits),
      });

      setMessage(
        response.data.message || "Course created successfully"
      );

      setFormData({
        courseCode: "",
        courseName: "",
        department: "",
        semester: "",
        credits: "",
        description: "",
      });

      fetchCourses();
    } catch (err) {
      console.error("Create course error:", err);

      setError(
        err.response?.data?.message || "Failed to create course"
      );
    }
  };

  // Open edit modal
  const handleEdit = (course) => {
    setEditingCourse(course);

    setEditFormData({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      department: course.department || "",
      semester: course.semester || "",
      credits: course.credits || "",
      description: course.description || "",
    });

    setMessage("");
    setError("");
  };

  // Handle edit form changes
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Update course
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await api.put(`/courses/${editingCourse._id}`, {
        courseCode: editFormData.courseCode,
        courseName: editFormData.courseName,
        department: editFormData.department,
        semester: Number(editFormData.semester),
        credits: Number(editFormData.credits),
        description: editFormData.description,
      });

      setMessage(
        response.data.message || "Course updated successfully"
      );

      setEditingCourse(null);

      setEditFormData({
        courseCode: "",
        courseName: "",
        department: "",
        semester: "",
        credits: "",
        description: "",
      });

      fetchCourses();
    } catch (err) {
      console.error("Update course error:", err);

      setError(
        err.response?.data?.message || "Failed to update course"
      );
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/courses/${courseId}`);

      setMessage(
        response.data.message || "Course deleted successfully"
      );

      setCourses((previousCourses) =>
        previousCourses.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      console.error("Delete course error:", err);

      setError(
        err.response?.data?.message || "Failed to delete course"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>

        <p className="mt-4 text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Courses
        </h1>

        <p className="text-gray-500">
          Add and manage college courses.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Create Course Form */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Add New Course
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={formData.courseCode}
            onChange={handleChange}
            required
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="semester"
            placeholder="Semester (1-8)"
            min="1"
            max="8"
            value={formData.semester}
            onChange={handleChange}
            required
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="credits"
            placeholder="Credits"
            min="1"
            max="10"
            value={formData.credits}
            onChange={handleChange}
            required
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 md:w-fit"
          >
            Add Course
          </button>
        </form>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-3">Code</th>
              <th className="border-b px-4 py-3">Course Name</th>
              <th className="border-b px-4 py-3">Department</th>
              <th className="border-b px-4 py-3">Semester</th>
              <th className="border-b px-4 py-3">Credits</th>
              <th className="border-b px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50"
                >
                  <td className="border-b px-4 py-3 font-medium">
                    {course.courseCode}
                  </td>

                  <td className="border-b px-4 py-3">
                    {course.courseName}
                  </td>

                  <td className="border-b px-4 py-3">
                    {course.department}
                  </td>

                  <td className="border-b px-4 py-3">
                    {course.semester}
                  </td>

                  <td className="border-b px-4 py-3">
                    {course.credits}
                  </td>

                  <td className="border-b px-4 py-3">
                    <button
                      onClick={() => handleEdit(course)}
                      className="mr-2 rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course._id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Course
              </h2>

              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                type="text"
                name="courseCode"
                placeholder="Course Code"
                value={editFormData.courseCode}
                onChange={handleEditChange}
                required
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={editFormData.courseName}
                onChange={handleEditChange}
                required
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={editFormData.department}
                onChange={handleEditChange}
                required
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="semester"
                placeholder="Semester (1-8)"
                min="1"
                max="8"
                value={editFormData.semester}
                onChange={handleEditChange}
                required
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="credits"
                placeholder="Credits"
                min="1"
                max="10"
                value={editFormData.credits}
                onChange={handleEditChange}
                required
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="description"
                placeholder="Course Description"
                value={editFormData.description}
                onChange={handleEditChange}
                rows="3"
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="rounded-lg bg-gray-500 px-5 py-2 font-medium text-white hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
                >
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;