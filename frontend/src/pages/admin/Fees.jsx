import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const initialForm = {
  studentId: "",
  academicYear: "",
  semester: "",
  totalAmount: "",
  paidAmount: "",
  paymentDate: "",
  remarks: "",
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fees");

      const data =
        response.data.fees ||
        response.data.data ||
        response.data ||
        [];

      setFees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch fees error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch fees"
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

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";

    return (
      student.userId?.name ||
      student.name ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (student) => {
    if (!student) return "";

    return student.userId?.email || student.email || "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFeeId(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (fee) => {
    setIsEditMode(true);
    setSelectedFeeId(fee._id);

    const studentId =
      fee.studentId?._id ||
      fee.studentId ||
      "";

    const formattedPaymentDate = fee.paymentDate
      ? new Date(fee.paymentDate).toISOString().split("T")[0]
      : "";

    setFormData({
      studentId,
      academicYear: fee.academicYear || "",
      semester: fee.semester || "",
      totalAmount: fee.totalAmount ?? "",
      paidAmount: fee.paidAmount ?? "",
      paymentDate: formattedPaymentDate,
      remarks: fee.remarks || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setIsEditMode(false);
    setSelectedFeeId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = Number(formData.totalAmount);
    const paidAmount = Number(formData.paidAmount);

    if (paidAmount > totalAmount) {
      setError("Paid amount cannot be greater than total amount.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const pendingAmount = totalAmount - paidAmount;

      let paymentStatus = "pending";

      if (paidAmount === totalAmount && totalAmount > 0) {
        paymentStatus = "paid";
      } else if (paidAmount > 0 && paidAmount < totalAmount) {
        paymentStatus = "partial";
      }

      const payload = {
        studentId: formData.studentId,
        academicYear: formData.academicYear,
        semester: Number(formData.semester),
        totalAmount,
        paidAmount,
        pendingAmount,
        paymentStatus,
        paymentDate: formData.paymentDate || null,
        remarks: formData.remarks,
      };

      if (isEditMode) {
        await api.put(`/fees/${selectedFeeId}`, payload);
      } else {
        await api.post("/fees", payload);
      }

      closeModal();
      fetchFees();
    } catch (err) {
      console.error("Save fee error:", err);

      setError(
        err.response?.data?.message || "Failed to save fee record"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (feeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/fees/${feeId}`);
      fetchFees();
    } catch (err) {
      console.error("Delete fee error:", err);

      setError(
        err.response?.data?.message || "Failed to delete fee record"
      );
    }
  };

  const filteredFees = fees.filter((fee) => {
    const studentName = getStudentName(fee.studentId).toLowerCase();
    const studentEmail = getStudentEmail(fee.studentId).toLowerCase();
    const academicYear = fee.academicYear?.toLowerCase() || "";
    const paymentStatus = fee.paymentStatus?.toLowerCase() || "";

    const search = searchTerm.toLowerCase();

    return (
      studentName.includes(search) ||
      studentEmail.includes(search) ||
      academicYear.includes(search) ||
      paymentStatus.includes(search) ||
      String(fee.semester).includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Fees Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student fee records and payment status
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Fee Record
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
            placeholder="Search student, academic year, status..."
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

      {/* Fees Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Academic Year
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Semester
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paid
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pending
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
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Loading fee records...
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No fee records found
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {getStudentName(fee.studentId)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {getStudentEmail(fee.studentId)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {fee.academicYear}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      Semester {fee.semester}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                      ₹{fee.totalAmount}
                    </td>

                    <td className="px-5 py-4 text-sm text-green-600">
                      ₹{fee.paidAmount}
                    </td>

                    <td className="px-5 py-4 text-sm text-red-600">
                      ₹{fee.pendingAmount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          fee.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : fee.paymentStatus === "partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {fee.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(fee)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit fee"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(fee._id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Delete fee"
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
                  {isEditMode ? "Edit Fee Record" : "Add Fee Record"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter student fee and payment details
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Student */}
                <div className="md:col-span-2">
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

                {/* Academic Year */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Academic Year
                  </label>

                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2026-27"
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

                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Total Amount
                  </label>

                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    min="0"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Paid Amount
                  </label>

                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    min="0"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks..."
                  rows="3"
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
                    ? "Update Fee"
                    : "Add Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;