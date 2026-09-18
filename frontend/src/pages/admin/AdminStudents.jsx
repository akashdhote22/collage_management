import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    rollNumber: "",
    branch: "",
    semester: "",
    phone: "",
  });

  const [editingStudent, setEditingStudent] = useState(null);

  const [editFormData, setEditFormData] = useState({
    rollNumber: "",
    branch: "",
    semester: "",
    phone: "",
  });

  // Fetch students and users
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, usersResponse] = await Promise.all([
        api.get("/students"),
        api.get("/users"),
      ]);

      setStudents(studentsResponse.data.students || []);
      setUsers(usersResponse.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create student
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/students", {
        ...formData,
        semester: Number(formData.semester),
      });

      setMessage("Student created successfully");

      setFormData({
        userId: "",
        rollNumber: "",
        branch: "",
        semester: "",
        phone: "",
      });

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create student"
      );
    }
  };

  // Open edit modal
  const handleEdit = (student) => {
    setEditingStudent(student);

    setEditFormData({
      rollNumber: student.rollNumber || "",
      branch: student.branch || "",
      semester: student.semester || "",
      phone: student.phone || "",
    });

    setMessage("");
    setError("");
  };

  // Edit form input change
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      const response = await api.put(
        `/students/${editingStudent._id}`,
        {
          rollNumber: editFormData.rollNumber,
          branch: editFormData.branch,
          semester: Number(editFormData.semester),
          phone: editFormData.phone,
        }
      );

      setMessage(
        response.data.message || "Student updated successfully"
      );

      setEditingStudent(null);

      setEditFormData({
        rollNumber: "",
        branch: "",
        semester: "",
        phone: "",
      });

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update student"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/students/${id}`);

      setMessage("Student deleted successfully");

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete student"
      );
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading students...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Student Management
        </h1>

        <p className="text-gray-500">
          Create and manage student profiles
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

      {/* Create Student Form */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Create Student Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Select User */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Student User
            </label>

            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select user</option>

              {users
                .filter((user) => user.role === "student")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Roll Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Roll Number
            </label>

            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Branch
            </label>

            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Computer Engineering"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Semester
            </label>

            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Enter semester"
              min="1"
              max="8"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Create Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Create Student
            </button>
          </div>
        </form>
      </div>

      {/* All Students Table */}
      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          All Students
        </h2>

        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-semibold">
                Name
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Email
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Roll Number
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Branch
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Semester
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Phone
              </th>

              <th className="px-4 py-3 text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="px-4 py-3">
                    {student.userId?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {student.userId?.email || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {student.rollNumber}
                  </td>

                  <td className="px-4 py-3">
                    {student.branch}
                  </td>

                  <td className="px-4 py-3">
                    {student.semester}
                  </td>

                  <td className="px-4 py-3">
                    {student.phone || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(student)}
                      className="mr-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(student._id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
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

      {/* Edit Student Modal - Outside Table */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Edit Student
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Roll Number */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Roll Number
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  value={editFormData.rollNumber}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Branch */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={editFormData.branch}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Semester */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Semester
                </label>

                <input
                  type="number"
                  name="semester"
                  value={editFormData.semester}
                  onChange={handleEditChange}
                  min="1"
                  max="8"
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;