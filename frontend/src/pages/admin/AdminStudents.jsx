import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  Hash,
  Building2,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
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

  // =========================
  // FETCH DATA
  // =========================
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

  // =========================
  // CREATE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  // =========================
  // EDIT
  // =========================
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

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE
  // =========================
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

  // =========================
  // DELETE
  // =========================
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

  const studentUsers = users.filter(
    (user) => user.role === "student"
  );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Loading student management...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f6f8fc] -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">

      {/* =====================================================
          PREMIUM HEADER
      ====================================================== */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#07152f] shadow-[0_20px_60px_rgba(15,23,42,0.18)]">

        {/* Background decorations */}
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative px-6 py-7 md:px-9 md:py-9">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-200">
                <GraduationCap size={15} />
                ADMINISTRATION
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Student Management
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                Manage student profiles, academic information and
                account details from a single workspace.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/15"
            >
              <RefreshCw
                size={17}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              Refresh Data
            </button>
          </div>

          {/* Mini bottom information */}
          <div className="mt-8 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-4 py-2.5 text-sm text-slate-200">
              <Users size={16} className="text-blue-300" />
              <span>{students.length} registered students</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-4 py-2.5 text-sm text-slate-200">
              <UserPlus size={16} className="text-emerald-300" />
              <span>{studentUsers.length} available profiles</span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          ALERTS
      ====================================================== */}
      <div className="mt-6 space-y-3">

        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <CheckCircle2 size={20} />

            <div>
              <p className="text-sm font-bold">
                Success
              </p>

              <p className="text-sm">
                {message}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
            <AlertCircle size={20} />

            <div>
              <p className="text-sm font-bold">
                Something went wrong
              </p>

              <p className="text-sm">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.09)]">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50" />

          <div className="relative flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {students.length}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Active student profiles
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-3.5 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <Users size={24} />
            </div>

          </div>
        </div>

        {/* Available */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.09)]">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50" />

          <div className="relative flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Student Users
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {studentUsers.length}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Available for profile creation
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <UserPlus size={24} />
            </div>

          </div>
        </div>

        {/* Management */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.09)] sm:col-span-2 xl:col-span-1">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-violet-50" />

          <div className="relative flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Profile Management
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Active
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Create, update and remove profiles
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-3.5 text-violet-600 transition-transform duration-300 group-hover:scale-110">
              <GraduationCap size={24} />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CREATE STUDENT
      ====================================================== */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <UserPlus size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Create Student Profile
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Add academic details to an existing student account
              </p>
            </div>

          </div>

          <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 md:block">
            REQUIRED INFORMATION
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8"
        >

          {/* USER */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Student Account
            </label>

            <div className="relative">

              <Users
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  Choose a student account...
                </option>

                {studentUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} — {user.email}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* ROLL */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Roll Number
            </label>

            <div className="relative">

              <Hash
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="CO101"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>
          </div>

          {/* BRANCH */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Branch
            </label>

            <div className="relative">

              <Building2
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Computer Engineering"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>
          </div>

          {/* SEMESTER */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Semester
            </label>

            <div className="relative">

              <BookOpen
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="1 - 8"
                min="1"
                max="8"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>
          </div>

          {/* PHONE */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>

            <div className="relative">

              <Phone
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-end md:col-span-2">

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b63f6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 md:w-auto"
            >
              <UserPlus
                size={18}
                className="transition-transform group-hover:scale-110"
              />
              Create Student Profile
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>

          </div>

        </form>
      </section>

      {/* =====================================================
          STUDENTS
      ====================================================== */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Student Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all registered student profiles
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Users size={16} />
            {students.length} Students
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">

                <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Roll Number
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Branch
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Semester
                </th>

                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Contact
                </th>

                <th className="px-7 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {students.length === 0 ? (

                <tr>
                  <td colSpan="6">

                    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                      <div className="mb-4 rounded-2xl bg-slate-100 p-5 text-slate-400">
                        <Users size={32} />
                      </div>

                      <h3 className="text-base font-bold text-slate-800">
                        No student profiles
                      </h3>

                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Create your first student profile using
                        the form above.
                      </p>

                    </div>
                  </td>
                </tr>

              ) : (

                students.map((student) => (

                  <tr
                    key={student._id}
                    className="group border-b border-slate-100 last:border-0 transition-colors hover:bg-blue-50/30"
                  >

                    {/* STUDENT */}
                    <td className="px-7 py-5">

                      <div className="flex items-center gap-3.5">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-100">
                          {(student.userId?.name || "N")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-slate-900">
                            {student.userId?.name || "N/A"}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail size={12} />
                            <span className="truncate">
                              {student.userId?.email || "N/A"}
                            </span>
                          </div>

                        </div>

                      </div>
                    </td>

                    {/* ROLL */}
                    <td className="px-5 py-5">

                      <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                        {student.rollNumber}
                      </span>

                    </td>

                    {/* BRANCH */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                        <Building2
                          size={15}
                          className="text-blue-500"
                        />

                        {student.branch}

                      </div>

                    </td>

                    {/* SEMESTER */}
                    <td className="px-5 py-5">

                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                        Semester {student.semester}
                      </span>

                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <Phone
                          size={14}
                          className="text-slate-400"
                        />

                        {student.phone || "Not provided"}

                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="px-7 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleEdit(student)}
                          title="Edit student"
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(student._id)
                          }
                          title="Delete student"
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
        </div>
      </section>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}
      {editingStudent && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-xl overflow-hidden rounded-[26px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Pencil size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edit Student
                  </h2>

                  <p className="text-xs text-slate-500">
                    Update academic information
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>

            </div>

            {/* Student identity */}
            <div className="mx-6 mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white">
                {(editingStudent.userId?.name || "N")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  {editingStudent.userId?.name || "N/A"}
                </p>

                <p className="text-xs text-slate-500">
                  {editingStudent.userId?.email || "N/A"}
                </p>
              </div>

            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5 p-6"
            >

              {/* ROLL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Roll Number
                </label>

                <div className="relative">

                  <Hash
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="rollNumber"
                    value={editFormData.rollNumber}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>
              </div>

              {/* BRANCH */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Branch
                </label>

                <div className="relative">

                  <Building2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="branch"
                    value={editFormData.branch}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>
              </div>

              {/* SEMESTER + PHONE */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    value={editFormData.semester}
                    onChange={handleEditChange}
                    min="1"
                    max="8"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save Changes
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