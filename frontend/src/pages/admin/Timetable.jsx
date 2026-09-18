import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    day: "Monday",
    courseId: "",
    teacherId: "",
    semester: "",
    branch: "",
    startTime: "",
    endTime: "",
    roomNumber: "",
  });

const fetchTimetables = async () => {
  try {
    setLoading(true);

    const response = await api.get("/timetable");

    console.log("Timetable API Response:", response.data);

    setTimetables(response.data.timetables || response.data);
  } catch (error) {
    console.error("Timetable Fetch Error:", error);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

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
      setCourses(response.data.courses || response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data.teachers || response.data);
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
    setFormData({
      day: "Monday",
      courseId: "",
      teacherId: "",
      semester: "",
      branch: "",
      startTime: "",
      endTime: "",
      roomNumber: "",
    });

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
      alert(error.response?.data?.message || "Failed to save timetable");
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
      alert(error.response?.data?.message || "Failed to delete timetable");
    }
  };

  const getCourseName = (course) => {
    if (!course) return "N/A";

    if (typeof course === "object") {
      return `${course.courseCode || ""} - ${course.courseName || ""}`;
    }

    const foundCourse = courses.find((item) => item._id === course);
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

    const foundTeacher = teachers.find((item) => item._id === teacher);

    return foundTeacher
      ? foundTeacher.userId?.name ||
          foundTeacher.name ||
          foundTeacher.employeeId
      : "N/A";
  };

  const filteredTimetables = timetables.filter((item) => {
    const searchText = searchTerm.toLowerCase();

    return (
      item.day?.toLowerCase().includes(searchText) ||
      item.branch?.toLowerCase().includes(searchText) ||
      item.roomNumber?.toLowerCase().includes(searchText) ||
      String(item.semester).includes(searchText) ||
      getCourseName(item.courseId).toLowerCase().includes(searchText) ||
      getTeacherName(item.teacherId).toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Timetable Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage college class schedules
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Timetable
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search by day, course, teacher, branch or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading timetable...
          </div>
        ) : filteredTimetables.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No timetable entries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-slate-800 text-sm text-white">
                <tr>
                  <th className="px-4 py-4">Day</th>
                  <th className="px-4 py-4">Course</th>
                  <th className="px-4 py-4">Teacher</th>
                  <th className="px-4 py-4">Semester</th>
                  <th className="px-4 py-4">Branch</th>
                  <th className="px-4 py-4">Time</th>
                  <th className="px-4 py-4">Room</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTimetables.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {item.day}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {getCourseName(item.courseId)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {getTeacherName(item.teacherId)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.semester}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.branch}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.startTime} - {item.endTime}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.roomNumber}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                          title="Delete"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Timetable" : "Add Timetable"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Day
                  </label>

                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Course
                  </label>

                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Select Course</option>

                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseCode} - {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Teacher
                  </label>

                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Select Teacher</option>

                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.userId?.name ||
                          teacher.name ||
                          teacher.employeeId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Computer Engineering"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Room Number
                  </label>

                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="Room 101"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Timetable" : "Add Timetable"}
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